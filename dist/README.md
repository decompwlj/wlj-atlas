# WLJ Atlas — static three.js application

A complete buildless HTML/CSS/JavaScript viewer for Rémi Eismann's decomposition into **weight × level + jump**, with sixty sequences and **200,000 decomposable points per sequence**. Deployment requires only the contents of `dist/`. No PHP, database, API, npm installation, bundler, or CDN is needed by the deployed app.

## Version 1.3.0 — fifty sequences

The catalogue now contains **60 sequences and 12,000,000 plotted points**, in 480 gzip-compressed CSV chunks. The 42 catalogue additions come from [your original 2D graph catalogue](https://decompwlj.com/2dgraphs.php), spanning digit patterns, prime subsequences, factorization, Beatty sequences, divisor sums and quadratic forms. See [SOURCES.md](SOURCES.md) for the complete additions, definitions and source links.

Triangular, square, pentagonal and pronic numbers remain the four retained figurate sequences. The previous six requested additions are retained. Every sequence still has eight chunks of 25,000 points. The interface, renderer and fitted desktop layout are unchanged.

At desktop viewports at least 1000 CSS pixels wide and 600 pixels high, the application fits the available screen height. The footer stays in the main viewport, the canvas shrinks to a square that fits the remaining space, and the catalogue and controls scroll independently. Smaller screens and enlarged text retain normal document scrolling for accessibility. The camera's mathematical coordinate scales are unchanged.

A browser layout check at 1363 × 936 CSS pixels found document height 936 pixels, footer bottom 924.8125 pixels, and equal plot width/height 580.65625 pixels. GPU rendering remains unavailable in this test browser; the previous shader fix is separately compiler-verified and was confirmed working by the user.

To update an existing installation, upload the new `dist/` contents over your app folder and hard-refresh with Ctrl+F5. Preserve/reapply any public social-card URLs you customized in `index.html`. No data generation is needed for deployment.

## Fix in version 1.0.1

The original point shader used `flat` as a uniform variable name. `flat` is a reserved GLSL interpolation qualifier, so the vertex shader failed to compile and the axes could remain visible with no points. It is now named `flattenZ` in both the shader and the JavaScript uniforms.

**Existing installation:** replace only the deployed `js/viewer.js` with the corrected file, then press Ctrl+F5 (Windows/Linux) or Command+Shift+R (Mac). The CSVs, metadata and your configured social URLs do not need changing. If your host/CDN caches JavaScript aggressively, purge that file's cache as well.

The original defect was reproduced with glslangValidator 12.0.0 (`unexpected FLAT, expecting IDENTIFIER`). The corrected vertex and fragment shaders compile and link as GLSL ES 3.00. Reproduce the regression test with `node tools/check-shaders.mjs` when glslangValidator is installed, or pass its absolute path as the first argument.

Optional browser development server: `npm ci`, then `npm run dev`. This uses Vite only for local development; deployment remains the same plain `dist/` folder with no build step.

## Deploy

1. Unzip the package.
2. Upload **the contents of `dist/`**, preserving folders, to a static HTTP(S) host. It can live at a domain root or in any subdirectory, for example `/atlas/`.
3. Open that folder's `index.html` over HTTP(S).

For a local preview, Python 3 is sufficient:

```sh
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000/`. Double-clicking `index.html` as a `file://` URL does not work: browser security restricts module workers and CSV requests. The app explains this explicitly.

The server must serve `.js` as JavaScript (`text/javascript` or `application/javascript`), `.json` as JSON, and `.csv` as text/CSV. Ordinary static servers already do. Do not rewrite missing assets to `index.html`: a missing chunk must return 404. HTTPS is recommended and enables browser-side SHA-256 integrity checks; numeric and byte-count checks also run on plain HTTP. Enable gzip/Brotli at the host for CSV/JSON/JS bandwidth savings.

### X / Twitter cards

`dist/index.html` includes Open Graph and Twitter metadata, plus a **1200 × 630 PNG made from the actual prime data**. The portable archive uses a relative image path because the final public URL is not known. Before uploading, set absolute card and canonical URLs:

```sh
node tools/configure.mjs https://YOUR-DOMAIN/atlas/
```

This requires Node 20.11+ locally, but Node is **not** needed on the host. Alternatively, edit `og:image`, `twitter:image`, `og:url` and the canonical link directly. The two image tags must point to the public absolute URL of `assets/social-card.png`. Crawlers must be able to fetch the HTML and PNG without authentication. Hash links such as `#primes` share the app-wide card; distinct per-sequence cards would require separate static HTML pages. Metadata cannot guarantee when X refreshes its cache.

## Previously included sequences

Sequences use **n = 1 under the conventions below**, except A001839, whose strictly increasing tail starts at its native OEIS index **n = 4**. Enough consecutive terms are generated to obtain exactly 200,000 decomposable points per sequence. Unclassified terms retain their indices in each manifest.

A001839 begins 0, 0, 1, 1. Its first three terms are recorded separately in `omittedPrefix`; the WLJ dataset uses the strictly increasing tail 1, 2, 4, 7, … from n = 4, without renumbering. A001855 and A002113 retain their native initial zero as an unclassified term. Those six additions otherwise retain their OEIS indexing. The 32 new sequences follow the indices in the linked original CSVs; in particular A000788 begins at n = 1 and records the omitted a(0) = 0. See `SOURCES.md`.

| ID | Sequence | Definition / start | Reference |
|---|---|---|---|
| natural | Natural numbers | a(n) = n | A000027 |
| primes | Prime numbers | 2, 3, 5, 7, 11, … | A000040 |
| composites | Composite numbers | 4, 6, 8, 9, 10, … | A002808 |
| odd | Odd numbers | a(n) = 2n − 1 | A005408 |
| even | Even numbers | a(n) = 2n | A005843, positive terms |
| triangular | Triangular numbers | a(n) = n(n + 1)/2 | A000217, positive terms |
| squares | Square numbers | a(n) = n² | A000290, positive terms |
| pentagonal | Pentagonal numbers | a(n) = n(3n − 1)/2 | A000326, positive terms |
| pronic | Pronic numbers | a(n) = n(n + 1) | A002378, positive terms |
| squarefree | Squarefree numbers | 1, 2, 3, 5, 6, 7, 10, … | [A005117](https://oeis.org/A005117) |
| primes-1-mod-4 | Primes ≡ 1 (mod 4) | 5, 13, 17, 29, 37, … | [A002144](https://oeis.org/A002144) |
| primes-3-mod-4 | Primes ≡ 3 (mod 4) | 3, 7, 11, 19, 23, … | [A002145](https://oeis.org/A002145) |
| a001651 | Not divisible by 3 | a(n) = floor((3n − 1)/2) | [A001651](https://oeis.org/A001651) |
| a001839 | Triangle packing numbers | floor(n floor((n − 1)/2)/3), minus 1 when n ≡ 5 (mod 6); tail n ≥ 4 | [A001839](https://oeis.org/A001839) |
| a001855 | Binary-insertion sorting numbers | a(1) = 0; a(n) = nm − 2^m + 1, m = ceil(log₂ n) | [A001855](https://oeis.org/A001855) |
| a002113 | Decimal palindromes | 0, 1, 2, …, 9, 11, 22, … | [A002113](https://oeis.org/A002113) |
| a006446 | Floor-root divisibility numbers | Positive integers divisible by floor(sqrt(a)); 1, 2, 3, 4, 6, 8, … | [A006446](https://oeis.org/A006446) |
| a006567 | Emirps | Primes with a distinct prime decimal reversal; 13, 17, 31, 37, … | [A006567](https://oeis.org/A006567) |

All prime subsequences, including emirps, use their own consecutive terms when computing the jump; the ordinary next-prime gap is not reused.

## Using the atlas

- Search by sequence name, ID or OEIS number. Only 30 results are rendered at a time.
- Drag to orbit, wheel/pinch to zoom, right-drag or two-finger drag to pan.
- Focus the plot with Tab: arrow keys move the camera, +/− zoom, R resets.
- **Weight–level** switches to a square orthographic projection with identical x/y units. **3D space** restores perspective.
- Coordinates are **natural logarithms**, `(ln k, ln L, ln d)`, matching the supplied PHP graph. All three axes use the same world-unit scale; k and L share the same maximum extent.
- Blue points are weight-classified (`k ≤ L`, including ties). Amber points are level-classified (`k > L`). Checkboxes change visibility without downloading or rebuilding the data.
- The dashed `k = L` guide lies on the z = 0 plane. It is a diagonal reference, not a 3D classification plane. Classification depends on k/L independently of d.
- Click a point for its integer data. Where multiple terms project onto the same position, the inspector selects one of them, not a statistical aggregate.
- Point budget loads the **first N decomposable terms in sequence order**, not a random sample. A smaller budget can change the visible distribution.
- **Loaded points** counts the loaded data, including classes currently hidden. **Level share · full data** always uses the complete manifest count, not the budget or filters.
- **Download loaded CSV** exports all loaded rows, including hidden classes. **Save PNG** exports the current graph view. Rendering is idle when the view is idle, unless Rotate is enabled.

The plot requires a WebGL2-capable browser and GPU. Data remain available as CSV if WebGL is unavailable. Automatic rotation is off by default.

## Mathematics and provenance

For consecutive terms a < b, `d = b − a`. If `a ≤ 2d`, the term is unclassified: `k = L = 0`. Otherwise `l = a − d`, k is the **smallest divisor of l strictly larger than d**, and `L = l/k`. Then `a = kL + d`.

`tools/kernel.gp` is copied verbatim from the supplied **decompwlj_fordiv.txt**. Its result order is `[k, L, d]`, including `[0, 0, d]` for unclassified terms. The alternative old snippets in `algos.txt` are not used: some return a different order on that branch.

**Correction to the project summary:** the excluded primes are **2, 3, 7**, not 2, 3, 5. Direct computation gives `decomp(5,7) = [3,1,2]` and `decomp(7,11) = [0,0,4]`. The attached 8th-edition treatise also states `{2,3,7}`. The 9th edition mentioned in the project context was not among the supplied files. No proof-status claims rely on an unseen edition.

In raw weight–level coordinates, a fixed l gives the hyperbola `kL = l`; in the displayed logarithmic coordinates it becomes `ln k + ln L = ln l`. Exact integer CSV values are kept separately from Float32 plotting coordinates. This release intentionally rejects values above `Number.MAX_SAFE_INTEGER` (9,007,199,254,740,991); supporting larger sequence terms needs a BigInt/string inspector and a carefully specified log conversion, not silent rounding.

References:

- Original graph: https://decompwlj.com/3Dgraph/Prime_numbers.html
- Supplied source: `3dgraph.php` (the attached filename; no PHP is required in this app).
- Supplied kernel: `decompwlj_fordiv.txt`.
- Supplied census reference: `Fable5_decompwlj_deep_analysis_8th_edition_final_2026_08_07.html`, Table 1.
- Founding paper: https://arxiv.org/abs/0711.0865
- Renderer API: https://threejs.org/docs/pages/BufferGeometry.html
- Camera controls: https://threejs.org/docs/pages/OrbitControls.html

## Data contract

```text
n,a,k,L,d
3,5,3,1,2
5,11,3,3,2
```

CSV is UTF-8, comma-separated, with exactly this header, no quotes or extra columns, and positive decimal safe integers. Plotted rows contain only decomposable terms. `n` is the original sequence index, so omissions leave gaps. The final row's jump is calculated using the **next sequence term**, not inferred from a truncated dataset.

`dist/data/<id>/manifest.json` contains:

- name, definition, OEIS reference, index origin;
- point count and total examined terms;
- unclassified `[n,a,0,0,d]` rows (these can occur beyond the beginning, particularly for emirps);
- `omittedPrefix` for A001839 and A000788, separate from the unclassified rows;
- full classification counts, with ties already included in weight;
- raw maxima `[max(k),max(L),max(d)]` for stable axes during loading;
- ordered chunks with file name, row count, byte count and SHA-256.

Each sequence has eight 25,000-point chunks. Chunk files use content hashes in their names. The parser validates row shape, safe integers, exact BigInt reconstruction, positive jump, `k > d`, decomposability, and monotone order. Minimality of k is established at generation/audit time, not recomputed in the browser.

## Architecture and growth to tens of thousands of sequences

```text
index.html + assets/style.css
js/app.js                 UI, selection, cancellation, error states
js/viewer.js              three.js BufferGeometry, cameras, controls, GPU disposal
js/catalog-worker.js      search and pagination, off the main thread
js/data-worker.js         ordered fetch, integrity, parse, transfer, backpressure
js/csv.js                 strict CSV validation and typed-array conversion
vendor/                   pinned three.js r185, OrbitControls, MIT license
data/catalog/index.json   catalogue counts and schema
data/catalog/search.json  compact [id, name, OEIS, metadata-page] tuples
data/catalog/page-N.json  descriptive metadata in pages of 128 sequences
data/<id>/manifest.json   one sequence's chunk list and statistics
data/<id>/chunk-*.csv     immutable, content-addressed chunks
```

The app keeps **one selected dataset** in memory. Switching terminates its worker, aborts pending metadata requests, ignores stale replies and disposes old geometries. The worker fetches one chunk at a time and waits for the main thread to accept it before fetching another. Typed arrays are transferred rather than cloned. There is one GPU draw object per loaded chunk, not one object per point. Resize uses the square host's actual dimensions; device pixel ratio is capped at 2.

At 200,000 points, retained application arrays are about **11.2 MB**: 8 MB for five Float64 integer fields and 3.2 MB for Float32 coordinates/classes, plus corresponding GPU attributes and temporary parsing/download data. This is an array-size calculation, **not a measured browser peak-memory or frame-rate claim**. The renderer, WebGL framebuffer, strings and runtime add overhead.

The search worker loads a compact name index, not the point data or all descriptions. A search returns at most 30 rows. Detailed metadata pages are loaded on demand. This design has been checked with **20,000 synthetic catalogue entries**, not 20,000 real datasets or simultaneous plots. Name-index memory and linear search cost still grow with catalogue size; beyond tens of thousands, shard the index or use a static precomputed search index.

Storage and hosting limits remain real: 10,000 sequences at 200,000 points means 2 billion rows and roughly 90,000 data files at this chunk size, before catalogue pages. Use a static host or object store whose file-count, total-size and request limits fit your catalogue. The architecture avoids loading this entire collection into the browser; it does not eliminate its storage cost.

Recommended cache policy: hashed chunk CSVs and versioned vendor assets may be long cached; `index.html`, manifests, catalogue JSON and unversioned app JS/CSS should revalidate. For updates, upload all new chunks first, then their manifests, catalogue and app assets; retain older hashed chunks until old clients have expired. An atomic whole-folder deploy is best. The generator does not remove old chunks automatically.

## Regenerate or add data

The shipped folder already contains all data. Regeneration is optional and requires PARI/GP plus Node 20.11+ on your own machine.

To regenerate only the 32 additions in version 1.3.0, run `gp -fq tools/generate-catalog.gp` with no pre-existing raw CSVs for their IDs. Run `gp -fq tools/check-catalog.gp` after generation to compare the bundled source fixtures.

To regenerate only the six additions from version 1.2.0, run `gp -fq tools/generate-requested.gp` with no pre-existing raw CSVs for those six IDs. The previous `generate-extra.gp` is retired. For the whole atlas:

1. Create an **empty** `raw/` directory at project root. `generate.gp` uses PARI's append-mode `write`, so do not rerun it over old CSV files.
2. Run the reference GP exporter:

   ```sh
   gp -fq tools/generate.gp
   ```

3. Check the exporter printed fifty completed sequence lines and no GP errors. Then run:

   ```sh
   gp -fq tools/audit.gp
   node tools/pack-data.mjs
   node tools/check.mjs
   ```

To add a sequence, add metadata to `tools/sequences.json`, supply a strictly increasing function or a sufficiently long integer vector in `tools/generate.gp`, and call `export_seq("your-id", n -> ...)`. The function must supply a successor for the last retained point. Export into `raw/your-id.csv`, then repack. No viewer code change is needed. Extend the `ids` list in `audit.gp` to include the new sequence. The current release bundles 60 sequences; the catalogue format is designed to accept many more.

You may also import previously computed CSV data using the exact contract above. `pack-data.mjs` checks sequence continuity including successor gaps and exact identities, but cannot prove that an imported weight is the *smallest* qualifying divisor. Use the reference kernel or an independent audit for that property.

`pack-data.mjs` packs one sequence at a time. It processes the registry linearly and keeps only small catalogue metadata across sequences. It is intended as an offline publishing step, not a browser operation.

## Validation and limitations

- All 10,000,000 rows: exact identity and domain checks, increasing indices/terms, finite log positions, class counts, chunk byte counts and SHA-256.
- 51,100 sampled rows: independent PARI divisor-enumeration minimality check, including the first 17 terms of each sequence.
- The six additions from version 1.2.0: 117 matching OEIS prefix terms; full independent recurrence checks for A001839 and A001855, full predicate/gap checks for A001651, A002113 and A006446, and sampled emirp primality checks by trial division. See `REQUESTED-SEQUENCES-VALIDATION.json`. Comparisons used OEIS entry pages; full b-files were unavailable.
- The 32 catalogue additions: 319,879 rows from the original CSVs compared field for field. See `CATALOG-VALIDATION.json`. Bundled fixtures allow PARI/GP to reproduce 32,000 of these reference comparisons.
- Prime census below 10^6 reproduced: 78,495 decomposable; 18,353 level-classified; 5,953 level-one; 12 ties, matching the attached treatise.
- Real parser and worker modules exercised in Node: full 200k load, transfer buffers, one-chunk backpressure, 25k budget, missing-chunk failure, worker termination, subdirectory URL resolution, and a synthetic 20,000-entry catalogue.
- Data and worker results are in `VALIDATION.json`. The existing layout and rendering code were not changed in this release.
- **Browser validation was attempted but could not complete because WebGL is disabled in the cloud browser.** Both corrected point shaders were separately compiled and linked with glslangValidator, and the original shader was confirmed to fail. This does not establish GPU compatibility or frame rate on every device. Check the deployed app on your target desktop and mobile devices before wider release.

Data were generated with PARI/GP 2.15.2. three.js 0.185.0 is pinned and vendored locally; its copyright and MIT license are in `dist/vendor/three-LICENSE.txt`. OrbitControls has one local import-path adjustment. No third-party network requests are needed to use the app; reference links open only when clicked.

## September 2026: ten more sequences

Added A003726, A004215, A005153, A006093, A006450, A006512, A006753, A006995, A007510 and A007770, with 200,000 decomposable points each. All ten use the original catalogue CSV indexing, including initial zero terms. Their complete published CSVs were checked against the regenerated data; see `EXPANSION-VALIDATION.json`.

Run `gp -fq tools/generate-expansion.gp` with a `raw/` directory and no existing raw CSVs for these ten IDs. To pack only these additions while retaining the original 50 datasets, run:

```bash
node tools/pack-data.mjs a003726 a004215 a005153 a006093 a006450 a006512 a006753 a006995 a007510 a007770
```

Run `gp -fq tools/check-expansion.gp` to compare the bundled reference fixtures and independently audit sampled minimal weights, then `node tools/check.mjs` for all packaged data and worker checks.

## Compressed data delivery

The 60-sequence release stores each 25,000-row CSV chunk as `.csv.gz` to fit Sites hosting limits. Compression preserves every original CSV byte. Manifests retain the uncompressed byte count and SHA-256, with `encoding: "gzip"` and a separate `compressedBytes` count. The worker decompresses one chunk at a time with the browser’s native `DecompressionStream`, then verifies and parses the original CSV. CSV export still downloads ordinary `.csv` files. Use a modern browser supporting the [Compression Streams API](https://developer.mozilla.org/en-US/docs/Web/API/DecompressionStream).

The packer now emits gzip chunks. Convert existing uncompressed datasets with `node tools/compress-data.mjs` before publishing. This verifies the source hashes and compression round trips before replacing files. Historical validation counts above refer to the same decoded CSV data.
