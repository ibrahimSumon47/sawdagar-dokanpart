/*
 * search-core — catalog relevance scoring, compiled to WebAssembly.
 *
 * Why native: catalog search runs on every query and scores hundreds of
 * candidates. Keeping the tokenizer, bounded edit distance and scoring in a
 * small freestanding module gives a deterministic, allocation-free hot path that
 * the TypeScript port mirrors byte for byte. The demo ships the compiled module
 * and falls back to the port if the browser or runtime refuses WebAssembly.
 *
 * ABI (all strings are UTF-8 bytes in linear memory):
 *   alloc(size) -> offset        reserve a buffer, -1 when the heap is full
 *   reset()                      rewind the bump allocator
 *   rank(docPtr, docLen, queryPtr, queryLen) -> int32 score
 *
 * The score is an integer on purpose: floating point would make the native and
 * TypeScript results drift apart. A larger score means a better match.
 */

namespace {

constexpr int kMaxTokens = 64;
constexpr int kMaxTokenBytes = 32;
constexpr int kMaxDistance = 1;

/* Query and document tokens longer than this are truncated, never split. */
constexpr int kTokenCapacity = kMaxTokenBytes + 1;

constexpr int kHeapBytes = 1 << 20;

unsigned char gHeap[kHeapBytes];
int gHeapTop = 0;

/* UTF-8 bytes above 0x7f are opaque token characters, which keeps Bangla
 * words intact: the tokenizer only splits on ASCII punctuation and spaces. */
bool isDelimiter(unsigned char code) {
  if (code <= 0x20) return true;
  switch (code) {
    case ',': case '.': case '/': case '\\': case '-': case '_':
    case '+': case '&': case '|': case '(': case ')': case '[':
    case ']': case '{': case '}': case '\'': case '"': case ':':
    case ';': case '!': case '?': case '*': case '#': case '@':
    case '$': case '%': case '^': case '~': case '=':
      return true;
    default:
      return false;
  }
}

unsigned char toLowerAscii(unsigned char code) {
  return (code >= 'A' && code <= 'Z') ? static_cast<unsigned char>(code + 32) : code;
}

int minimum(int a, int b) { return a < b ? a : b; }
int maximum(int a, int b) { return a > b ? a : b; }

int tokenize(const unsigned char* input, int length,
             unsigned char tokens[][kTokenCapacity], int* tokenLengths) {
  int count = 0;
  int index = 0;
  while (index < length && count < kMaxTokens) {
    if (isDelimiter(input[index])) {
      index += 1;
      continue;
    }
    int written = 0;
    while (index < length && !isDelimiter(input[index])) {
      if (written < kMaxTokenBytes) {
        tokens[count][written] = toLowerAscii(input[index]);
        written += 1;
      }
      index += 1;
    }
    tokens[count][written] = 0;
    tokenLengths[count] = written;
    count += 1;
  }
  return count;
}

bool startsWithBytes(const unsigned char* haystack, int haystackLength,
                     const unsigned char* needle, int needleLength) {
  if (needleLength > haystackLength) return false;
  for (int i = 0; i < needleLength; i += 1) {
    if (haystack[i] != needle[i]) return false;
  }
  return true;
}

bool equalsBytes(const unsigned char* a, int aLength, const unsigned char* b, int bLength) {
  if (aLength != bLength) return false;
  for (int i = 0; i < aLength; i += 1) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

bool containsBytes(const unsigned char* haystack, int haystackLength,
                   const unsigned char* needle, int needleLength) {
  if (needleLength == 0 || needleLength > haystackLength) return false;
  for (int start = 0; start <= haystackLength - needleLength; start += 1) {
    if (startsWithBytes(haystack + start, haystackLength - start, needle, needleLength)) {
      return true;
    }
  }
  return false;
}

/* Optimal string alignment distance (Levenshtein plus adjacent transposition),
 * capped at `limit`. Rows whose minimum exceeds the cap stop early, so a typo
 * check on a 24-byte token stays cheap. */
int boundedDistance(const unsigned char* a, int aLength, const unsigned char* b, int bLength,
                    int limit) {
  if (aLength > kMaxTokenBytes) aLength = kMaxTokenBytes;
  if (bLength > kMaxTokenBytes) bLength = kMaxTokenBytes;
  int previous[kTokenCapacity];
  int current[kTokenCapacity];
  int beforePrevious[kTokenCapacity];

  for (int j = 0; j <= bLength; j += 1) {
    previous[j] = j;
    beforePrevious[j] = j;
  }

  for (int i = 1; i <= aLength; i += 1) {
    current[0] = i;
    int rowMinimum = current[0];
    for (int j = 1; j <= bLength; j += 1) {
      int cost = a[i - 1] == b[j - 1] ? 0 : 1;
      int value = minimum(previous[j] + 1, current[j - 1] + 1);
      value = minimum(value, previous[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] == b[j - 2] && a[i - 2] == b[j - 1]) {
        value = minimum(value, beforePrevious[j - 2] + 1);
      }
      current[j] = value;
      if (value < rowMinimum) rowMinimum = value;
    }
    if (rowMinimum > limit) return limit + 1;
    for (int j = 0; j <= bLength; j += 1) {
      beforePrevious[j] = previous[j];
      previous[j] = current[j];
    }
  }
  return previous[bLength];
}

/* Field weights: an exact token beats a prefix, a prefix beats a fuzzy hit, and
 * a plain substring is the weakest signal. */
int tokenScore(const unsigned char* query, int queryLength,
               const unsigned char* doc, int docLength) {
  if (equalsBytes(query, queryLength, doc, docLength)) return 1000;
  if (queryLength >= 2 && docLength > queryLength &&
      startsWithBytes(doc, docLength, query, queryLength)) {
    return 700;
  }
  if (docLength >= 2 && queryLength > docLength &&
      startsWithBytes(query, queryLength, doc, docLength)) {
    return 400;
  }
  if (queryLength >= 4 && docLength >= 4 &&
      boundedDistance(query, queryLength, doc, docLength, kMaxDistance) <= kMaxDistance) {
    return 300;
  }
  if (containsBytes(doc, docLength, query, queryLength) ||
      containsBytes(query, queryLength, doc, docLength)) {
    return 250;
  }
  return 0;
}

/* Normalizes a phrase for the whole-string bonus: lowercase, every delimiter
 * becomes one space, leading and trailing spaces are dropped. */
int normalizePhrase(const unsigned char* input, int length, unsigned char* output) {
  int written = 0;
  bool pendingSpace = false;
  for (int i = 0; i < length; i += 1) {
    unsigned char code = input[i];
    if (isDelimiter(code)) {
      pendingSpace = written > 0;
      continue;
    }
    if (pendingSpace) {
      output[written] = ' ';
      written += 1;
      pendingSpace = false;
    }
    output[written] = toLowerAscii(code);
    written += 1;
  }
  return written;
}

}  // namespace

extern "C" {

/* Returns an absolute address in linear memory, which is what the caller writes
 * to and what rank() reads from. */
int alloc(int size) {
  if (size <= 0) return -1;
  int aligned = (size + 7) & ~7;
  if (aligned < 0 || gHeapTop + aligned > kHeapBytes) return -1;
  int start = gHeapTop;
  gHeapTop += aligned;
  return reinterpret_cast<int>(gHeap + start);
}

void reset() { gHeapTop = 0; }

/* Scores one document against one query. Returns 0 when nothing matches. */
int rank(int docPtr, int docLen, int queryPtr, int queryLen) {
  if (docPtr < 0 || queryPtr < 0 || docLen <= 0 || queryLen <= 0) return 0;

  const unsigned char* doc = reinterpret_cast<const unsigned char*>(docPtr);
  const unsigned char* query = reinterpret_cast<const unsigned char*>(queryPtr);

  unsigned char docTokens[kMaxTokens][kTokenCapacity];
  unsigned char queryTokens[kMaxTokens][kTokenCapacity];
  int docLengths[kMaxTokens];
  int queryLengths[kMaxTokens];

  int docCount = tokenize(doc, docLen, docTokens, docLengths);
  int queryCount = tokenize(query, queryLen, queryTokens, queryLengths);
  if (docCount == 0 || queryCount == 0) return 0;

  int score = 0;
  int matched = 0;
  for (int i = 0; i < queryCount; i += 1) {
    int best = 0;
    for (int j = 0; j < docCount; j += 1) {
      int candidate = tokenScore(queryTokens[i], queryLengths[i], docTokens[j], docLengths[j]);
      if (candidate > best) best = candidate;
    }
    if (best > 0) {
      matched += 1;
      score += best;
    }
  }
  if (matched == 0) return 0;

  /* Coverage matters: a document that matches every query token outranks one
   * that matches a single token very well. */
  score = static_cast<int>((static_cast<long long>(score) * matched) / queryCount);

  unsigned char docPhrase[1024];
  unsigned char queryPhrase[1024];
  int docPhraseLength = normalizePhrase(doc, docLen, docPhrase);
  int queryPhraseLength = normalizePhrase(query, queryLen, queryPhrase);
  if (docPhraseLength > 0 && queryPhraseLength > 0) {
    if (startsWithBytes(docPhrase, docPhraseLength, queryPhrase, queryPhraseLength)) {
      score += 1500;
    } else if (containsBytes(docPhrase, docPhraseLength, queryPhrase, queryPhraseLength)) {
      score += 500;
    }
  }

  return score;
}

}  // extern "C"
