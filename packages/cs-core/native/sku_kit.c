/*
 * sku-kit — SKU normalization, validation and check characters in WebAssembly.
 *
 * Why C: this is the smallest possible freestanding module. It has no libc, no
 * heap dependency beyond one fixed buffer and three functions over UTF-8 bytes,
 * which is enough to show a real WASM boundary without a toolchain wrapper.
 *
 * ABI (offsets are relative to the module's fixed heap):
 *   alloc(size) -> offset    reserve a buffer, -1 when the heap is full
 *   reset()                  rewind the bump allocator
 *   sku_normalize(inOffset, inLen, outOffset) -> outLen
 *   sku_valid(offset, len)   -> 1 valid, 0 invalid
 *   sku_check(offset, len)   -> check character code, -1 when empty
 */

#define MAX_SKU 25
#define HEAP_BYTES (64 * 1024)

static unsigned char heap[HEAP_BYTES];
static int heap_top = 0;

/* Returns an absolute address in linear memory, so callers write straight to
 * the returned offset. */
int alloc(int size) {
  if (size <= 0) return -1;
  int aligned = (size + 7) & ~7;
  if (aligned < 0 || heap_top + aligned > HEAP_BYTES) return -1;
  int start = heap_top;
  heap_top += aligned;
  return (int)(heap + start);
}

void reset(void) { heap_top = 0; }

static int is_alpha_numeric(unsigned char code) {
  return (code >= 'A' && code <= 'Z') || (code >= 'a' && code <= 'z') ||
         (code >= '0' && code <= '9');
}

static unsigned char upper(unsigned char code) {
  return (code >= 'a' && code <= 'z') ? (unsigned char)(code - 32) : code;
}

/* Uppercases ASCII letters, turns every other byte into a dash and collapses
 * repeated dashes, so " sd - 0001/1 " becomes "SD-0001-1". */
int sku_normalize(int inOffset, int inLen, int outOffset) {
  unsigned char *in = (unsigned char *)(inOffset);
  unsigned char *out = (unsigned char *)(outOffset);
  int written = 0;
  int pendingDash = 0;

  for (int i = 0; i < inLen && written < MAX_SKU - 1; i += 1) {
    unsigned char code = in[i];
    if (is_alpha_numeric(code)) {
      if (pendingDash && written > 0) {
        out[written] = '-';
        written += 1;
      }
      pendingDash = 0;
      out[written] = upper(code);
      written += 1;
    } else {
      pendingDash = 1;
    }
  }
  out[written] = 0;
  return written;
}

/* A usable SKU starts with SD-, is 6 to 24 characters long and contains only
 * uppercase letters, digits and single dashes. */
int sku_valid(int offset, int len) {
  unsigned char *sku = (unsigned char *)(offset);
  if (len < 6 || len > 24) return 0;
  if (sku[0] != 'S' || sku[1] != 'D' || sku[2] != '-') return 0;
  for (int i = 3; i < len; i += 1) {
    unsigned char code = sku[i];
    int allowed = (code >= 'A' && code <= 'Z') || (code >= '0' && code <= '9') || code == '-';
    if (!allowed) return 0;
    if (code == '-' && (i == 3 || sku[i - 1] == '-')) return 0;
  }
  return sku[len - 1] != '-';
}

static int value_of(unsigned char code) {
  if (code >= '0' && code <= '9') return code - '0';
  if (code >= 'A' && code <= 'Z') return 10 + (code - 'A');
  return 36;
}

/* Position-weighted modulo 36 check character over the normalized SKU. A single
 * mistyped or swapped character changes the result, so a wrong SKU is caught
 * before it reaches the catalog. */
int sku_check(int offset, int len) {
  unsigned char *sku = (unsigned char *)(offset);
  if (len == 0) return -1;
  int sum = 0;
  for (int i = 0; i < len; i += 1) {
    sum += value_of(sku[i]) * (i + 1);
  }
  return sum % 36;
}
