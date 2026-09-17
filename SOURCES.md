# Ten additional sequences — September 2026

The Atlas now contains 60 sequences and 12 million plotted points. These ten additions each contain 200,000 decomposable points, generated with the unchanged WLJ kernel. Each jump uses the successor in its own sequence. No polygonal sequence was added.

| OEIS | Name | Definition | Original catalogue |
|---|---|---|---|
| [A003726](https://oeis.org/A003726) | Binary numbers without 111 | Nonnegative integers whose binary expansion contains no three consecutive 1s, including 0. | [Source](https://decompwlj.com/2dgraphs.php?page=9) |
| [A004215](https://oeis.org/A004215) | Require four squares | Positive integers requiring four nonzero squares: precisely the numbers 4^r(8m + 7), with r, m ≥ 0. | [Source](https://decompwlj.com/2dgraphs.php?page=9) |
| [A005153](https://oeis.org/A005153) | Practical numbers | Positive integers for which every smaller positive integer is a sum of distinct divisors of the integer. | [Source](https://decompwlj.com/2dgraphs.php?page=11) |
| [A006093](https://oeis.org/A006093) | Primes minus one | a(n) = p(n) − 1, where p(n) is the n-th prime. | [Source](https://decompwlj.com/2dgraphs.php?page=14) |
| [A006450](https://oeis.org/A006450) | Prime-indexed primes | a(n) = p(p(n)): primes whose indices in the prime sequence are also prime. Jumps use this subsequence. | [Source](https://decompwlj.com/2dgraphs.php?page=14) |
| [A006512](https://oeis.org/A006512) | Greater twin primes | Primes p for which p − 2 is prime. Jumps go to the next greater twin prime. | [Source](https://decompwlj.com/2dgraphs.php?page=14) |
| [A006753](https://oeis.org/A006753) | Smith numbers | Composite integers whose decimal digit sum equals the sum of the digit sums of their prime factors, counted with multiplicity. | [Source](https://decompwlj.com/2dgraphs.php?page=15) |
| [A006995](https://oeis.org/A006995) | Binary palindromes | Nonnegative integers whose binary expansion reads the same forwards and backwards, including 0. | [Source](https://decompwlj.com/2dgraphs.php?page=15) |
| [A007510](https://oeis.org/A007510) | Isolated primes | Primes p for which neither p − 2 nor p + 2 is prime. Jumps go to the next isolated prime. | [Source](https://decompwlj.com/2dgraphs.php?page=16) |
| [A007770](https://oeis.org/A007770) | Happy numbers | Positive integers that eventually reach 1 under repeated replacement by the sum of the squares of their decimal digits. | [Source](https://decompwlj.com/2dgraphs.php?page=16) |

The application index starts at 1, matching the source CSVs. For A003726 and A006995, the term 0 is retained as unclassified. Binary palindromes are constructed by reflection; prime-indexed primes use exact prime tables; practical numbers use the Stewart–Sierpiński criterion ([OEIS](https://oeis.org/A005153)); A004215 uses the characterization 4^r(8m + 7) ([OEIS](https://oeis.org/A004215)). All calculations use integer arithmetic.

The full original CSVs were compared field for field. `EXPANSION-VALIDATION.json` records the source hashes and comparison counts; `tools/fixtures/expansion/` retains the first 1,000 numerical rows per source. Reproduce generation with `tools/generate-expansion.gp` and the fixture and minimal-weight audit with `tools/check-expansion.gp`.

---

# Catalogue expansion — version 1.3.0

32 additions selected from [Rémi Eismann’s 2D graph catalogue](https://decompwlj.com/2dgraphs.php). Each has 200,000 decomposable plotted points. No new polygonal sequence has been added.

The application index n starts at 1 and matches the linked original CSVs. Initial zeros are retained as unclassified rows when present. A000788 follows the site’s n ≥ 1 tail and records its omitted a(0) = 0 in the manifest. Integer square roots make the fractional-power and quadratic-irrational formulas exact; no floating-point floor decisions are used.

| OEIS | Name | Definition | Original catalogue |
|---|---|---|---|
| [A000028](https://oeis.org/A000028) | Odd exponent-bit parity | Integers whose prime-factor exponents have an odd total binary popcount. | [Source](https://decompwlj.com/2dgraphs.php) |
| [A000037](https://oeis.org/A000037) | Nonsquares | Positive integers that are not perfect squares. | [Source](https://decompwlj.com/2dgraphs.php) |
| [A000069](https://oeis.org/A000069) | Odious numbers | Nonnegative integers with odd binary popcount. | [Source](https://decompwlj.com/2dgraphs.php) |
| [A000093](https://oeis.org/A000093) | Floor of n to the 3/2 | a(n) = floor(n^(3/2)), computed exactly as the integer square root of n³; n starts at 1. | [Source](https://decompwlj.com/2dgraphs.php) |
| [A000201](https://oeis.org/A000201) | Lower Wythoff sequence | a(n) = floor(nφ), with φ = (1 + √5)/2; evaluated using integer square roots. | [Source](https://decompwlj.com/2dgraphs.php?page=2) |
| [A000378](https://oeis.org/A000378) | Sums of three squares | Nonnegative integers representable as a sum of three integer squares, including 0. | [Source](https://decompwlj.com/2dgraphs.php?page=2) |
| [A000379](https://oeis.org/A000379) | Even exponent-bit parity | Positive integers whose prime-factor exponents have an even total binary popcount. | [Source](https://decompwlj.com/2dgraphs.php?page=2) |
| [A000469](https://oeis.org/A000469) | Squarefree composites and 1 | 1 and the squarefree composite integers: products of at least two distinct primes. | [Source](https://decompwlj.com/2dgraphs.php?page=3) |
| [A000788](https://oeis.org/A000788) | Cumulative binary digit sum | Total binary popcount of 0 through n. Uses your site’s positive-index tail n ≥ 1; a(0) = 0 is omitted. | [Source](https://decompwlj.com/2dgraphs.php?page=3) |
| [A000961](https://oeis.org/A000961) | Prime powers | 1 and powers p^k of a prime p, with k ≥ 1. | [Source](https://decompwlj.com/2dgraphs.php?page=3) |
| [A000977](https://oeis.org/A000977) | At least three prime factors | Positive integers with at least three distinct prime divisors. | [Source](https://decompwlj.com/2dgraphs.php?page=3) |
| [A001043](https://oeis.org/A001043) | Sums of consecutive primes | a(n) = p(n) + p(n+1), the sum of consecutive primes. | [Source](https://decompwlj.com/2dgraphs.php?page=3) |
| [A001097](https://oeis.org/A001097) | Twin primes | Primes belonging to at least one twin-prime pair. Each prime is included once. | [Source](https://decompwlj.com/2dgraphs.php?page=3) |
| [A001358](https://oeis.org/A001358) | Semiprimes | Products of two primes, allowing equal primes. | [Source](https://decompwlj.com/2dgraphs.php?page=4) |
| [A001359](https://oeis.org/A001359) | Lesser twin primes | Primes p for which p + 2 is prime. Jumps go to the next lesser twin prime. | [Source](https://decompwlj.com/2dgraphs.php?page=4) |
| [A001481](https://oeis.org/A001481) | Sums of two squares | Nonnegative integers representable as a sum of two integer squares, including 0. | [Source](https://decompwlj.com/2dgraphs.php?page=4) |
| [A001751](https://oeis.org/A001751) | Primes and twice primes | The sorted union of primes and twice primes. | [Source](https://decompwlj.com/2dgraphs.php?page=5) |
| [A001952](https://oeis.org/A001952) | Beatty: 2 + √2 | a(n) = floor(n(2 + √2)), evaluated using integer square roots. | [Source](https://decompwlj.com/2dgraphs.php?page=5) |
| [A001969](https://oeis.org/A001969) | Evil numbers | Nonnegative integers with even binary popcount, including 0. | [Source](https://decompwlj.com/2dgraphs.php?page=5) |
| [A002476](https://oeis.org/A002476) | Primes ≡ 1 (mod 6) | Primes congruent to 1 modulo 6. Jumps use consecutive terms of this subsequence. | [Source](https://decompwlj.com/2dgraphs.php?page=7) |
| [A002822](https://oeis.org/A002822) | Twin-prime centers / 6 | Positive integers n for which 6n − 1 and 6n + 1 are both prime. | [Source](https://decompwlj.com/2dgraphs.php?page=7) |
| [A003052](https://oeis.org/A003052) | Decimal self numbers | Positive integers absent from the image m + decimal digit sum(m). | [Source](https://decompwlj.com/2dgraphs.php?page=8) |
| [A003136](https://oeis.org/A003136) | Loeschian numbers | Nonnegative integers of the form x² + xy + y², including 0. | [Source](https://decompwlj.com/2dgraphs.php?page=8) |
| [A003277](https://oeis.org/A003277) | Cyclic numbers | Positive integers a with gcd(a, φ(a)) = 1. | [Source](https://decompwlj.com/2dgraphs.php?page=8) |
| [A003601](https://oeis.org/A003601) | Integer divisor averages | Positive integers whose sum of divisors is divisible by their number of divisors. | [Source](https://decompwlj.com/2dgraphs.php?page=8) |
| [A003628](https://oeis.org/A003628) | Primes ≡ 5 or 7 (mod 8) | Primes congruent to 5 or 7 modulo 8. | [Source](https://decompwlj.com/2dgraphs.php?page=8) |
| [A003631](https://oeis.org/A003631) | Primes ≡ 2 or 3 (mod 5) | Primes congruent to 2 or 3 modulo 5. | [Source](https://decompwlj.com/2dgraphs.php?page=9) |
| [A005100](https://oeis.org/A005100) | Deficient numbers | Positive integers whose sum of all divisors is less than twice the integer. | [Source](https://decompwlj.com/2dgraphs.php?page=11) |
| [A005101](https://oeis.org/A005101) | Abundant numbers | Positive integers whose sum of all divisors exceeds twice the integer. | [Source](https://decompwlj.com/2dgraphs.php?page=11) |
| [A005349](https://oeis.org/A005349) | Harshad numbers | Positive integers divisible by their decimal digit sum. | [Source](https://decompwlj.com/2dgraphs.php?page=12) |
| [A005384](https://oeis.org/A005384) | Sophie Germain primes | Primes p for which 2p + 1 is also prime. | [Source](https://decompwlj.com/2dgraphs.php?page=12) |
| [A005385](https://oeis.org/A005385) | Safe primes | Primes p for which (p − 1)/2 is also prime. | [Source](https://decompwlj.com/2dgraphs.php?page=12) |

All jumps use the next term in the selected sequence. The twin-prime, Sophie Germain and safe-prime datasets therefore use their own gaps.

## Reproduction

Run `gp -fq tools/generate-catalog.gp` from the project root with an existing `raw/` directory and no raw CSVs for these 32 IDs. The exporter refuses to append to existing files. It uses the unchanged reference kernel in `tools/kernel.gp`. Run `node tools/pack-data.mjs`, then `node tools/check.mjs`, `gp -fq tools/audit.gp` and `gp -fq tools/check-catalog.gp`. The full `generate.gp` also includes this exporter.

`tools/fixtures/catalog/` contains the first 1,000 numerical rows from each original CSV, for reproducible regression comparisons. `CATALOG-VALIDATION.json` records the full original-file comparisons and SHA-256 values. Source downloads are reference checks; all 200,000-point datasets were recomputed locally.

