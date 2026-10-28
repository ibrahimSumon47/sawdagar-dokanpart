import java.util.ArrayList;
import java.util.List;

/**
 * Settlement reference implementation.
 *
 * A settlement run pays every payout at or above the minimum in whole taka and
 * carries the rounded-away poisha plus the sub-minimum balances into the next
 * run. The TypeScript port in {@code src/settlement.ts} mirrors these rules and
 * is what the admin finance page previews.
 *
 * <p>Usage: {@code java Settlement <minimumPoisha> <amountPoisha>...}
 * <p>Output: {@code count=<n>;paid=<poisha>;carried=<poisha>}
 */
public final class Settlement {

  /** Result of one dry run. */
  public record Run(int count, long paidPoisha, long carriedPoisha) {}

  private Settlement() {}

  /** Rounds down to whole taka, because transfers are made in whole taka. */
  public static long wholeTaka(long amountPoisha) {
    return amountPoisha - (amountPoisha % 100);
  }

  /** Plans one settlement batch without changing any stored balances. */
  public static Run plan(long minimumPoisha, long[] amounts) {
    int count = 0;
    long paid = 0;
    long carried = 0;

    for (long amount : amounts) {
      if (amount < minimumPoisha) {
        carried += Math.max(0, amount);
        continue;
      }
      long whole = wholeTaka(amount);
      paid += whole;
      carried += amount - whole;
      count += 1;
    }

    return new Run(count, paid, carried);
  }

  public static void main(String[] args) {
    if (args.length < 1) {
      System.err.println("usage: java Settlement <minimumPoisha> <amountPoisha>...");
      System.exit(2);
    }

    long minimum = Long.parseLong(args[0]);
    List<Long> parsed = new ArrayList<>();
    for (int index = 1; index < args.length; index += 1) {
      parsed.add(Long.parseLong(args[index]));
    }

    long[] amounts = new long[parsed.size()];
    for (int index = 0; index < parsed.size(); index += 1) {
      amounts[index] = parsed.get(index);
    }

    Run run = plan(minimum, amounts);
    System.out.printf("count=%d;paid=%d;carried=%d%n", run.count(), run.paidPoisha(), run.carriedPoisha());
  }
}
