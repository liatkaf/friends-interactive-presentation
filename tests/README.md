# Current test entry points - final 17-slide refinement

## Final Slide 13 quotes

Run `node tests/quote-update-test.cjs` against `TEST_BASE` for the exact six cards, one character each, mouse/keyboard selection, transitions, persistence, clear/skip/reset, 15 layout cases, all-slide navigation and the retained PIVOT scene. Set `TEST_PYTHON=1` on the local API server to include Python/JavaScript parity for both new quotes. The same suite runs against static HTTP and Pages without that flag. `test_quote_update.py` is included in full Python discovery. The two retired quote-only cases remain untouched in the historical golden fixture; current profile suites still compare all 18 unaffected cases exactly.

Run browser suites sequentially against the already running local preview; avoid duplicate headless/software-WebGL processes. Check listener ports before starting a server. The current review preview is http://127.0.0.1:8011.

```powershell
$env:TEST_BASE='http://127.0.0.1:8011'
node tests/browser-test.cjs
node tests/joey-refinement-test.cjs
node tests/v10-ux-test.cjs
node tests/v10-layout-test.cjs
node tests/chart-layout-test.cjs
node tests/pivot-state-test.cjs
node tests/stairwell-context-test.cjs
node tests/capture-v10.cjs
./tests/make-contact-sheets.ps1 -Version v10-final -Slides 17
.venv/Scripts/python.exe -m unittest discover -s tests -p 'test_*.py' -v
```

For `v10-static-test.cjs`, point TEST_BASE to a clean static HTTP server (no `/api/recommend`), for example port 8013 using Python's `http.server`. The Python HTTP server is only file transport, not recommendation execution. All Python test modules remain current because their data/scoring/provenance contracts are preserved. The full unittest discovery runs the old version-labelled Python modules as well as animation tests.

Earlier `capture-v06/v07/v08/v09` and `v09-*-test.cjs` files are retained historical UI fixtures for superseded slide structures, not current entry points or claimed current passes. Active v10 scripts were updated in place for the approved 17-slide deck, while new outputs use `v10-final-*` to avoid overwriting the prior committed evidence. For reproducing historical UI fixtures use the corresponding historical commit; do not weaken current assertions to satisfy the old 18-slide scope.

Actual executed results, fixture corrections and visual-review limits are recorded in `screenshots/v10-final/visual-review.md`. No screenshot or generated-code success alone is counted as a functional test pass.

## Final six-experience questionnaire upgrade

```powershell
$env:TEST_BASE='http://127.0.0.1:8011'
node tests/profile-experience-test.cjs
node tests/profile-layout-test.cjs
$env:PROFILE_PHASE='after'
node tests/profile-capture.cjs
./tests/profile-contact-sheets.ps1
```

For file-only static QA, start `python python/static_preview.py --port 8013`, set TEST_BASE to that URL and run `node tests/profile-static-test.cjs`. This helper sets the WebP MIME type even on Windows Python 3.8; it has no recommendation API. The new Python asset/golden tests run with the existing full unittest discovery command. Twenty fixtures were captured before UI changes at b9e1c2c. Before capture refuses to overwrite that fixture or label an enhanced page as a pre-upgrade page. Current before/after evidence is in `screenshots/profile-upgrade/visual-review.md`; earlier reports remain historical.
