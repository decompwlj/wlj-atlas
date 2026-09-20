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


## Expansion to 70 sequences — 14 September 2026

Each addition contains 200,000 decomposable points. All published reference CSV rows match the generated rows, retaining the catalogue’s indexing and unclassified prefix. The generator uses exact integer factorization and the smallest divisor strictly greater than the jump.

| OEIS | Name | Definition | Catalogue | CSV |
|---|---|---|---|---|
| [A007528](https://oeis.org/A007528) | Primes ≡ 5 (mod 6) | Primes of the form 6m − 1. Jumps use consecutive primes of this subsequence. | [Source](https://decompwlj.com/2dgraphs.php?page=16) | [CSV](https://decompwlj.com/csv/A007528decomp.csv) |
| [A007606](https://oeis.org/A007606) | Take one, skip two | Keep 1 positive integer, skip 2, keep 3, skip 4, and continue with increasing block lengths. | [Source](https://decompwlj.com/2dgraphs.php?page=16) | [CSV](https://decompwlj.com/csv/A007606decomp.csv) |
| [A007618](https://oeis.org/A007618) | Digit-sum orbit from 5 | Start at 5; each next term is the current term plus its decimal digit sum. | [Source](https://decompwlj.com/2dgraphs.php?page=16) | [CSV](https://decompwlj.com/csv/A007618decomp.csv) |
| [A007957](https://oeis.org/A007957) | Numbers containing an odd digit | Positive integers containing at least one odd decimal digit. | [Source](https://decompwlj.com/2dgraphs.php?page=17) | [CSV](https://decompwlj.com/csv/A007957decomp.csv) |
| [A008364](https://oeis.org/A008364) | 11-rough numbers | 1 and positive integers not divisible by 2, 3, 5 or 7. | [Source](https://decompwlj.com/2dgraphs.php?page=17) | [CSV](https://decompwlj.com/csv/A008364decomp.csv) |
| [A008846](https://oeis.org/A008846) | Primitive Pythagorean hypotenuses | Distinct hypotenuses of primitive integer right triangles, in increasing order. Equivalently, integers greater than 1 with every prime factor congruent to 1 modulo 4. | [Source](https://decompwlj.com/2dgraphs.php?page=17) | [CSV](https://decompwlj.com/csv/A008846decomp.csv) |
| [A008851](https://oeis.org/A008851) | Numbers ≡ 0 or 1 (mod 5) | Nonnegative integers congruent to 0 or 1 modulo 5, including 0. | [Source](https://decompwlj.com/2dgraphs.php?page=17) | [CSV](https://decompwlj.com/csv/A008851decomp.csv) |
| [A008864](https://oeis.org/A008864) | Primes plus one | a(n) = p(n) + 1, where p(n) is the n-th prime. | [Source](https://decompwlj.com/2dgraphs.php?page=17) | [CSV](https://decompwlj.com/csv/A008864decomp.csv) |
| [A010061](https://oeis.org/A010061) | Binary self numbers | Positive integers not of the form m + the number of 1s in the binary expansion of m. | [Source](https://decompwlj.com/2dgraphs.php?page=18) | [CSV](https://decompwlj.com/csv/A010061decomp.csv) |
| [A010784](https://oeis.org/A010784) | Distinct decimal digits | Nonnegative integers with no repeated decimal digit, including 0. | [Source](https://decompwlj.com/2dgraphs.php?page=18) | [CSV](https://decompwlj.com/csv/A010784decomp.csv) |

Generation: `tools/generate-expansion-70.cpp`; validation: `EXPANSION-70-VALIDATION.json`. The independent weight checks enumerate divisor pairs by trial division. Hypotenuses A008846 are generated using their prime-factor characterization and checked against the complete published prefix.


## Final expansion to 100 sequences — 14 September 2026

This is the final expansion requested by the owner. No further sequence decompositions are planned. The 30 additions each have 200,000 decomposable points, for 20,000,000 points across the 100-sequence atlas. Existing 70 datasets are preserved byte for byte.

| OEIS | Name | Definition | Catalogue | CSV |
|---|---|---|---|---|
| [A010064](https://oeis.org/A010064) | Base-4 self numbers | Positive integers not of the form m plus the sum of the base-4 digits of m. | [Source](https://decompwlj.com/2dgraphs.php?page=18) | [CSV](https://decompwlj.com/csv/A010064decomp.csv) |
| [A011531](https://oeis.org/A011531) | Numbers containing 1 | Positive integers containing at least one decimal digit 1. | [Source](https://decompwlj.com/2dgraphs.php?page=18) | [CSV](https://decompwlj.com/csv/A011531decomp.csv) |
| [A011539](https://oeis.org/A011539) | Numbers containing 9 | Positive integers containing at least one decimal digit 9. | [Source](https://decompwlj.com/2dgraphs.php?page=19) | [CSV](https://decompwlj.com/csv/A011539decomp.csv) |
| [A011540](https://oeis.org/A011540) | Numbers containing 0 | Nonnegative integers containing a decimal digit 0, including 0. | [Source](https://decompwlj.com/2dgraphs.php?page=19) | [CSV](https://decompwlj.com/csv/A011540decomp.csv) |
| [A013939](https://oeis.org/A013939) | Cumulative distinct prime factors | Partial sums of ω(m), the number of distinct prime divisors of m, starting at m = 1 with a(1) = 0. | [Source](https://decompwlj.com/2dgraphs.php?page=19) | [CSV](https://decompwlj.com/csv/A013939decomp.csv) |
| [A014076](https://oeis.org/A014076) | Odd nonprimes | Odd positive integers that are not prime, including 1. | [Source](https://decompwlj.com/2dgraphs.php?page=19) | [CSV](https://decompwlj.com/csv/A014076decomp.csv) |
| [A014190](https://oeis.org/A014190) | Ternary palindromes | Nonnegative integers whose base-3 expansion is palindromic, including 0. | [Source](https://decompwlj.com/2dgraphs.php?page=20) | [CSV](https://decompwlj.com/csv/A014190decomp.csv) |
| [A014261](https://oeis.org/A014261) | Odd digits only | Positive integers whose decimal digits all belong to 1, 3, 5, 7, 9. | [Source](https://decompwlj.com/2dgraphs.php?page=20) | [CSV](https://decompwlj.com/csv/A014261decomp.csv) |
| [A014263](https://oeis.org/A014263) | Even digits only | Nonnegative integers whose decimal digits all belong to 0, 2, 4, 6, 8, including 0. | [Source](https://decompwlj.com/2dgraphs.php?page=20) | [CSV](https://decompwlj.com/csv/A014263decomp.csv) |
| [A014574](https://oeis.org/A014574) | Twin-prime centers | Arithmetic means of twin-prime pairs, in increasing order. Each jump uses the next center. | [Source](https://decompwlj.com/2dgraphs.php?page=20) | [CSV](https://decompwlj.com/csv/A014574decomp.csv) |
| [A014612](https://oeis.org/A014612) | 3-almost primes | Positive integers with exactly three prime factors, counted with multiplicity. | [Source](https://decompwlj.com/2dgraphs.php?page=20) | [CSV](https://decompwlj.com/csv/A014612decomp.csv) |
| [A014613](https://oeis.org/A014613) | 4-almost primes | Positive integers with exactly four prime factors, counted with multiplicity. | [Source](https://decompwlj.com/2dgraphs.php?page=20) | [CSV](https://decompwlj.com/csv/A014613decomp.csv) |
| [A014614](https://oeis.org/A014614) | 5-almost primes | Positive integers with exactly five prime factors, counted with multiplicity. | [Source](https://decompwlj.com/2dgraphs.php?page=21) | [CSV](https://decompwlj.com/csv/A014614decomp.csv) |
| [A014688](https://oeis.org/A014688) | Prime plus its index | a(n) = p(n) + n, where p(n) is the n-th prime and n starts at 1. | [Source](https://decompwlj.com/2dgraphs.php?page=21) | [CSV](https://decompwlj.com/csv/A014688decomp.csv) |
| [A015911](https://oeis.org/A015911) | Odd power-of-two residues | Positive integers m for which the least nonnegative residue of 2^m modulo m is odd. | [Source](https://decompwlj.com/2dgraphs.php?page=21) | [CSV](https://decompwlj.com/csv/A015911decomp.csv) |
| [A016052](https://oeis.org/A016052) | Digit-sum orbit from 3 | Start at 3; each next term is the current term plus its decimal digit sum. | [Source](https://decompwlj.com/2dgraphs.php?page=21) | [CSV](https://decompwlj.com/csv/A016052decomp.csv) |
| [A016096](https://oeis.org/A016096) | Digit-sum orbit from 9 | Start at 9; each next term is the current term plus its decimal digit sum. | [Source](https://decompwlj.com/2dgraphs.php?page=21) | [CSV](https://decompwlj.com/csv/A016096decomp.csv) |
| [A018825](https://oeis.org/A018825) | Not two nonzero squares | Positive integers not representable as x² + y² with positive integers x and y. | [Source](https://decompwlj.com/2dgraphs.php?page=22) | [CSV](https://decompwlj.com/csv/A018825decomp.csv) |
| [A019506](https://oeis.org/A019506) | Hoax numbers | Composite integers whose decimal digit sum equals the sum of the decimal digit sums of their distinct prime factors. | [Source](https://decompwlj.com/2dgraphs.php?page=22) | [CSV](https://decompwlj.com/csv/A019506decomp.csv) |
| [A020670](https://oeis.org/A020670) | Square plus seven times a square | Nonnegative integers representable as x² + 7y² with integers x and y, including 0. | [Source](https://decompwlj.com/2dgraphs.php?page=22) | [CSV](https://decompwlj.com/csv/A020670decomp.csv) |
| [A020756](https://oeis.org/A020756) | Sums of two triangular numbers | Nonnegative integers representable as T(x) + T(y), where T(j) = j(j+1)/2 and x, y are nonnegative. | [Source](https://decompwlj.com/2dgraphs.php?page=22) | [CSV](https://decompwlj.com/csv/A020756decomp.csv) |
| [A020757](https://oeis.org/A020757) | Not two triangular numbers | Nonnegative integers not representable as a sum of two triangular numbers. | [Source](https://decompwlj.com/2dgraphs.php?page=22) | [CSV](https://decompwlj.com/csv/A020757decomp.csv) |
| [A022544](https://oeis.org/A022544) | Not two squares | Nonnegative integers not representable as a sum of two integer squares. | [Source](https://decompwlj.com/2dgraphs.php?page=22) | [CSV](https://decompwlj.com/csv/A022544decomp.csv) |
| [A022549](https://oeis.org/A022549) | Square plus cube | Nonnegative integers representable as x² + y³ with nonnegative integers x and y, including 0. | [Source](https://decompwlj.com/2dgraphs.php?page=23) | [CSV](https://decompwlj.com/csv/A022549decomp.csv) |
| [A022559](https://oeis.org/A022559) | Prime factors of factorials | Total number of prime factors of n!, counted with multiplicity, starting at n = 1 with a(1) = 0. | [Source](https://decompwlj.com/2dgraphs.php?page=23) | [CSV](https://decompwlj.com/csv/A022559decomp.csv) |
| [A022839](https://oeis.org/A022839) | Beatty: √5 | a(n) = floor(n√5), for n ≥ 1; computed with an exact integer square root. | [Source](https://decompwlj.com/2dgraphs.php?page=23) | [CSV](https://decompwlj.com/csv/A022839decomp.csv) |
| [A022841](https://oeis.org/A022841) | Beatty: √7 | a(n) = floor(n√7), for n ≥ 1; computed with an exact integer square root. | [Source](https://decompwlj.com/2dgraphs.php?page=23) | [CSV](https://decompwlj.com/csv/A022841decomp.csv) |
| [A023197](https://oeis.org/A023197) | Divisor sum at least 3n | Positive integers m satisfying σ(m) ≥ 3m. | [Source](https://decompwlj.com/2dgraphs.php?page=23) | [CSV](https://decompwlj.com/csv/A023197decomp.csv) |
| [A023200](https://oeis.org/A023200) | Lesser cousin primes | Primes p for which p + 4 is prime. Jumps use consecutive primes of this subsequence. | [Source](https://decompwlj.com/2dgraphs.php?page=23) | [CSV](https://decompwlj.com/csv/A023200decomp.csv) |
| [A023201](https://oeis.org/A023201) | Lesser sexy primes | Primes p for which p + 6 is prime. Jumps use consecutive primes of this subsequence. | [Source](https://decompwlj.com/2dgraphs.php?page=23) | [CSV](https://decompwlj.com/csv/A023201decomp.csv) |

Generation uses exact integer arithmetic, an integer prime-factor sieve with trial factorization beyond its bound, and enumeration of all divisors of a−d to find the least divisor greater than d. Quadratic-form sequences are enumerated directly, ternary palindromes are constructed by reflection, and digit-restricted integers are generated in ascending order. Initial unclassified terms and the source CSV index (starting at 1) are retained. A013939 and A022559 start at 0, matching the source. A018825 starts at 1. Each last retained term uses an explicitly generated successor.

`tools/generate-expansion-100.cpp` is the bounded final generator. `tools/validate-expansion-100.py` compares every published reference CSV row and independently checks sampled minimal weights by trial division over divisor pairs. `EXPANSION-100-VALIDATION.json` records source hashes and verification counts. The first 1,000 source rows per addition are retained in `tools/fixtures/expansion-100/`.


## Expansion to 120 sequences — 18 September 2026

The owner explicitly requested 20 further sequences, superseding the earlier 100-sequence limit. Each addition has 200,000 plotted points. The atlas now contains 24,000,000 points in 960 chunks, with six catalogue pages of 20 sequences. All original 100 datasets, previews, styles and application scripts are unchanged. The full homepage gallery has 120 cards.

| OEIS | Sequence | Definition |
| --- | --- | --- |
| [A000096](https://oeis.org/A000096) | Triangular numbers plus n | a(n) = n(n + 3)/2, n ≥ 1. |
| [A000124](https://oeis.org/A000124) | Central polygonal numbers | Lazy caterer numbers, a(n) = n(n + 1)/2 + 1. Positive-index tail n ≥ 1; a(0) = 1 is omitted. |
| [A000384](https://oeis.org/A000384) | Hexagonal numbers | a(n) = n(2n − 1), n ≥ 1. The OEIS entry also includes a(0) = 0. |
| [A001844](https://oeis.org/A001844) | Centered square numbers | a(n) = 2n(n + 1) + 1. Positive-index tail n ≥ 1; a(0) = 1 is omitted. |
| [A002522](https://oeis.org/A002522) | Squares plus one | a(n) = n² + 1. Positive-index tail n ≥ 1; a(0) = 1 is omitted. |
| [A002620](https://oeis.org/A002620) | Quarter-squares | a(n) = floor(n²/4), strictly increasing tail n ≥ 2. Original OEIS indices retained; a(0) = a(1) = 0 are omitted. |
| [A002081](https://oeis.org/A002081) | Residues 2, 4, 8, 16 modulo 20 | Positive integers congruent to 2, 4, 8 or 16 modulo 20. |
| [A003511](https://oeis.org/A003511) | Beatty: (1 + √3)/2 | a(n) = floor(n(1 + √3)/2), computed exactly using integer square roots. |
| [A003512](https://oeis.org/A003512) | Beatty: 2 + √3 | a(n) = floor(n(2 + √3)), computed exactly using integer square roots. |
| [A004201](https://oeis.org/A004201) | Take one, skip one, take two… | Take 1 integer, skip 1, take 2, skip 2, and so on, starting with the positive integers. |
| [A004202](https://oeis.org/A004202) | Skip one, take one, skip two… | Skip 1 integer, take 1, skip 2, take 2, and so on, starting with the positive integers. |
| [A003796](https://oeis.org/A003796) | Binary numbers without 000 | Nonnegative integers whose binary expansion contains no 000, without leading zeroes; includes 0. |
| [A004742](https://oeis.org/A004742) | Binary numbers without 101 | Nonnegative integers whose binary expansion contains no 101, without leading zeroes; includes 0. |
| [A004743](https://oeis.org/A004743) | Binary numbers without 110 | Nonnegative integers whose binary expansion contains no 110, without leading zeroes; includes 0. |
| [A004744](https://oeis.org/A004744) | Binary numbers without 011 | Nonnegative integers whose binary expansion contains no 011, without leading zeroes; includes 0. |
| [A004745](https://oeis.org/A004745) | Binary numbers without 001 | Nonnegative integers whose binary expansion contains no 001, without leading zeroes; includes 0. |
| [A004746](https://oeis.org/A004746) | Binary numbers without 010 | Nonnegative integers whose binary expansion contains no 010, without leading zeroes; includes 0. |
| [A004611](https://oeis.org/A004611) | Prime factors ≡ 1 (mod 3) | Positive integers whose prime divisors are all congruent to 1 modulo 3; includes 1. |
| [A004613](https://oeis.org/A004613) | Prime factors ≡ 1 (mod 4) | Positive integers whose prime divisors are all congruent to 1 modulo 4; includes 1. |
| [A004614](https://oeis.org/A004614) | Prime factors ≡ 3 (mod 4) | Positive integers whose prime divisors are all congruent to 3 modulo 4; includes 1. |

Generation: `tools/generate-expansion-120.cpp`; packaging: `tools/pack-data.mjs` with the 20 new IDs; gallery extension: `tools/extend-gallery-120.py`. Full reference CSVs from decompwlj.com are retained in `tools/fixtures/expansion-120/`. The six quadratic/quasi-polynomial datasets each contain 200,000 level-classified points. This is a finite-dataset observation. `EXPANSION-120-VALIDATION.json` records the checks, including independent minimal-divisor samples. `VALIDATION.json` records successful verification of all 24 million plotted rows and worker tests.


## Expansion to 140 sequences — 19 September 2026

Twenty numeral-base and digit-pattern sequences add 4,000,000 plotted points. The atlas contains 140 sequences, 28,000,000 plotted points, 1,120 compressed chunks and seven catalogue pages. All original 120 datasets, previews and gallery cards are preserved, as are the design, controls, scripts and styles. Only the catalogue, new cards and displayed totals were extended.

| OEIS | Sequence | Definition |
| --- | --- | --- |
| [A014192](https://oeis.org/A014192) | Palindromes in base 4 | Nonnegative integers whose base-4 expansion is palindromic, without leading zeroes; includes 0. [Reference CSV](https://decompwlj.com/csv/A014192decomp.csv) |
| [A029952](https://oeis.org/A029952) | Palindromes in base 5 | Nonnegative integers whose base-5 expansion is palindromic, without leading zeroes; includes 0. [Reference CSV](https://decompwlj.com/csv/A029952decomp.csv) |
| [A029953](https://oeis.org/A029953) | Palindromes in base 6 | Nonnegative integers whose base-6 expansion is palindromic, without leading zeroes; includes 0. [Reference CSV](https://decompwlj.com/csv/A029953decomp.csv) |
| [A029954](https://oeis.org/A029954) | Palindromes in base 7 | Nonnegative integers whose base-7 expansion is palindromic, without leading zeroes; includes 0. [Reference CSV](https://decompwlj.com/csv/A029954decomp.csv) |
| [A029803](https://oeis.org/A029803) | Palindromes in base 8 | Nonnegative integers whose base-8 expansion is palindromic, without leading zeroes; includes 0. [Reference CSV](https://decompwlj.com/csv/A029803decomp.csv) |
| [A029955](https://oeis.org/A029955) | Palindromes in base 9 | Nonnegative integers whose base-9 expansion is palindromic, without leading zeroes; includes 0. [Reference CSV](https://decompwlj.com/csv/A029955decomp.csv) |
| [A032924](https://oeis.org/A032924) | Ternary numbers without 0 | Positive integers whose base-3 expansion has only the digits 1 and 2. [Reference CSV](https://decompwlj.com/csv/A032924decomp.csv) |
| [A023705](https://oeis.org/A023705) | Base-4 numbers without 0 | Positive integers whose base-4 expansion has only the digits 1, 2 and 3. [Reference CSV](https://decompwlj.com/csv/A023705decomp.csv) |
| [A023733](https://oeis.org/A023733) | Base-5 numbers without 3 | Nonnegative integers whose base-5 expansion contains no digit 3; includes 0. [Reference CSV](https://decompwlj.com/csv/A023733decomp.csv) |
| [A031443](https://oeis.org/A031443) | Balanced binary digits | Positive integers with equally many zeroes and ones in binary, without leading zeroes. [Reference CSV](https://decompwlj.com/csv/A031443decomp.csv) |
| [A037301](https://oeis.org/A037301) | Equal digit sums in bases 2 and 3 | Nonnegative integers whose binary and ternary digit sums are equal; includes 0. [Reference CSV](https://decompwlj.com/csv/A037301decomp.csv) |
| [A037308](https://oeis.org/A037308) | Equal digit sums in bases 2 and 10 | Nonnegative integers whose binary and decimal digit sums are equal; includes 0. [Reference CSV](https://decompwlj.com/csv/A037308decomp.csv) |
| [A039004](https://oeis.org/A039004) | Balanced ones and twos in base 4 | Nonnegative integers with equally many digits 1 and 2 in base 4; includes 0. [Reference CSV](https://decompwlj.com/csv/A039004decomp.csv) |
| [A027697](https://oeis.org/A027697) | Odious primes | Primes with an odd number of ones in their binary expansion. [Reference CSV](https://decompwlj.com/csv/A027697decomp.csv) |
| [A027699](https://oeis.org/A027699) | Evil primes | Primes with an even number of ones in their binary expansion. [Reference CSV](https://decompwlj.com/csv/A027699decomp.csv) |
| [A028835](https://oeis.org/A028835) | Prime decimal digital root | Positive integers whose decimal digital root is 2, 3, 5 or 7. [Reference CSV](https://decompwlj.com/csv/A028835decomp.csv) |
| [A029742](https://oeis.org/A029742) | Decimal nonpalindromes | Positive integers whose decimal expansion is not palindromic. [Reference CSV](https://decompwlj.com/csv/A029742decomp.csv) |
| [A006364](https://oeis.org/A006364) | Even binary parity above the last bit | Nonnegative integers for which the binary expansion, ignoring the least significant bit, contains an even number of ones; includes 0. [Reference CSV](https://decompwlj.com/csv/A006364decomp.csv) |
| [A045844](https://oeis.org/A045844) | Largest-digit orbit | Start at 1; obtain each successive term by adding the largest decimal digit of the current term. [Reference CSV](https://decompwlj.com/csv/A045844decomp.csv) |
| [A014313](https://oeis.org/A014313) | Exactly five binary ones | Positive integers whose binary expansion has exactly five ones. [Reference CSV](https://decompwlj.com/csv/A014313decomp.csv) |

Generation: `tools/generate-expansion-140.cpp`; packaging: `tools/pack-data.mjs` with only the 20 new IDs; gallery extension: `tools/extend-gallery-140.py`. Each sequence contains 200,000 plotted points. Atlas indices begin at 1 following the reference CSVs, including any initial excluded terms; these are not necessarily OEIS offsets. The final plotted term uses its actual successor to determine the jump.

Full reference tables are retained in `tools/fixtures/expansion-140/`. All 199,981 reference rows match exactly, including indices, terms, weights, levels and jumps. `EXPANSION-140-VALIDATION.json` records 1,440 independent minimal-divisor checks and preservation of the original datasets. `VALIDATION.json` records verification of all 28 million plotted rows, chunk checksums and viewer worker behavior.

Publication size: `tools/compress-expansion-140.py` applies stronger gzip-compatible compression only to the 160 new chunks. All uncompressed CSV bytes and SHA-256 content hashes are unchanged; the original 120 datasets remain byte-for-byte unchanged. `COMPRESSION-140-VALIDATION.json` records the verified size reduction required by the hosting archive limit.
