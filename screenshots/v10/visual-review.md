# v1.0 FINAL - Actual QA and Visual Review

Reviewed November 6, 2026. Browser: installed Microsoft Edge, headless CDP, software WebGL. Desktop 1440x1000 and mobile emulation 390x844; supplemental widths 1024, 768 and 320 plus laptop 1366x768. This is not physical-device or formal screen-reader certification.

## Executed tests

| Command / suite | Actual result | Evidence |
|---|---|---|
| Python unittest discovery (`test_*.py`) | 23 passed, process exit 0; includes 5 image/provenance/reproducibility tests | [Summary](v10-python-summary.json), [output](v10-python-results.txt) |
| `node tests/browser-test.cjs` | 448 passed; zero unexpected errors or external requests | [Report](v10-results.json) |
| `node tests/v10-ux-test.cjs` | 99 passed; concept/comic/story/lab playback, cancellation, fallbacks, reduced motion, retained rewind/lobsters/reset | [Report](v10-ux-results.json) |
| `node tests/v10-layout-test.cjs` | 102 passed; five widths, hidden/open card details, all seven modules and laptop-height fit | [Report](v10-layout-results.json) |
| `node tests/chart-layout-test.cjs` | 18 passed; preserved Slide 6 alignment/proportion checks | [Report](v10-chart-layout-results.json) |
| `node tests/pivot-state-test.cjs` | 33 passed; deterministic moves, penalties, pivot cap, success/reset | [Report](v10-game-results.json) |
| `node tests/stairwell-context-test.cjs` | 14 passed; real WebGL context-loss recovery | [Report](v10-context-results.json) |
| `node tests/v10-static-test.cjs` against file-only HTTP server | 10 passed; generated data/assets, real Python-frame playback, genuine 3D, fallback recommendation and reset; no API | [Report](v10-static-results.json) |
| `node tests/capture-v10.cjs` | 16 passed, no errors; all 36 desktop/mobile slide captures plus story/module/modal/reset extras | [Report](v10-capture-results.json) |

The main suite deliberately forces WebGL failure; three corresponding renderer error messages are expected and separately recorded, not concealed as unexpected errors. Earlier development fixture failures are documented in the prompt and Red Team records; they are not counted as passing runs. Browser suites ran sequentially. Legacy result filenames for context and chart checks were copied only after their actual November 6 reruns, not reused from historical releases.

## Every-slide review

| Slide(s) | What was visually checked | Outcome / limits |
|---|---|---|
| 1 | Genuine mug, purple door, clean centered brand; no replay or instructional text | Preserved, desktop/mobile |
| 2 | Introductory Study 1 bars, labels and source | Preserved; intentional preview of Slide 6 |
| 3 | Four distinct illustrations, selected border, explanations/takeaway and mobile wrapping | Fixed inherited flex rule, then explicit hidden-state override; single-column mobile avoids squeezed text |
| 4 | All three original scenes, sequential selection, captions, replay and final takeaway | Coherent desktop strip / mobile stacked panels |
| 5 | Stairwell/couch proportions, centered scene, compact controls | Preserved genuine 3D; mechanical and context tests supplement visual review |
| 6 | Both measures, axes/legend, accessible data disclosure | Preserved; details may scroll on mobile |
| 7 | Social scene, two viewing choices, actual evidence with sources | Three stages are visually distinct; fictional choice never presented as empirical data |
| 8 | Puzzle, mood and diary modules; design/finding/limits and player controls | Distinct Python visuals; source audit optional, all modules fit laptop with audit closed |
| 9 | VHS, powered-on TV and revealed concepts | Preserved; no copied footage |
| 10 | Meeting lobsters, three explained stages and questionnaire CTA | Preserved; mobile vertical scroll available |
| 11-12 | Mood cards, optional stress slider and no developer hint | Saved selections clear and readable |
| 13-14 | Six character cards and six quote cards, selected states | Preserved; quotes may require mobile scrolling |
| 15-16 | Comfort choices, exact fan/nostalgia labels, long text wrapping | Preserved, no horizontal clipping observed |
| 17 | Actual match stages, factor summary and yellow reveal | Preserved; mobile stack may scroll |
| 18 | Primary recommendation, two smaller alternatives, score dialog, separate home and reset | Preserved; same seeded profile as Slide 17 for consistent screenshots |

## Real screenshots

All 18 slides were captured at both viewport sizes and inspected in these six contact sheets; selected full-resolution captures are committed alongside this review. The complete raw run remains in ignored `test-results/` and can be regenerated with the capture command. Keeping representative files avoids committing every large duplicate.

- [Desktop 1-6](v10-contact-desktop-1.png), [7-12](v10-contact-desktop-2.png), [13-18](v10-contact-desktop-3.png)
- [Mobile 1-6](v10-contact-mobile-1.png), [7-12](v10-contact-mobile-2.png), [13-18](v10-contact-mobile-3.png)
- [Cards](v10-desktop-03.png), [mobile cards](v10-mobile-03.png), [comic](v10-desktop-04.png)
- [Social scene](v10-desktop-07.png), [viewing choice](v10-desktop-07-choice.png), [actual research](v10-desktop-07-research.png)
- [Puzzle](v10-desktop-08-module-4.png), [mood](v10-desktop-08-module-5.png), [diary](v10-desktop-08-module-6.png), [enlarged Python result](v10-animation-enlarged.png)
- [Preserved 3D stairwell](v10-desktop-05.png), [final recommendation](v10-desktop-18.png), [cleared profile](v10-reset-profile.png)

## Limitations

Small screens, expanded audit details and large fonts can scroll within slides. The 960x400 animations prioritize slide readability; fine in-frame text can use Enlarge, while adjacent HTML captions and source tables provide accessible alternatives. No clinical, psychological or user-study validation is claimed. This verifies a clean local static deployment, not a newly published v1.0 Pages release. Public URL availability is recorded separately; the final push remains unauthorized.

Syntax checks passed for nine new/modified JavaScript and test files; fifteen core/research files were verified unchanged (text line endings normalized, PNGs byte-for-byte). Current documentation links resolve and a targeted tracked/source secret-pattern scan found no matches. These checks are not an exhaustive security audit. [Hygiene report](v10-hygiene-results.json).
