# Version 0.9 — actual verification and visual review

Reviewed November 2, 2026. Local full preview: **http://127.0.0.1:8009** (`PORT=8009`, `node serve.cjs`). Static compatibility preview used http://127.0.0.1:8010 with Python's file-only HTTP server and no recommendation API. Nothing was pushed or deployed.

## Executed test results

| Command/suite | Actual result |
|---|---|
| `py -3 tests/test_v05.py` | 7 tests passed |
| `py -3 tests/test_v08.py` | 7 tests passed |
| `py -3 tests/test_v09.py` | 4 tests passed |
| `node tests/pivot-state-test.cjs` | 33 game-rule checks passed |
| `node tests/browser-test.cjs` | [448 assertions passed](v09-results.json) |
| `node tests/v09-ux-test.cjs` | [60 checks passed](v09-ux-results.json) |
| `node tests/v09-layout-test.cjs` | [97 checks passed](v09-layout-results.json) |
| `node tests/chart-layout-test.cjs` | [18 Slide 6 checks passed](v09-study1-layout-results.json) |
| `node tests/stairwell-context-test.cjs` | [14 live WebGL context-loss checks passed](v09-context-results.json) |
| `node tests/capture-v09.cjs` | [15 capture/touch checks passed](v09-capture-results.json) |
| `node tests/v09-static-test.cjs` | [8 static HTTP checks passed](v09-static-results.json) |
| Research generation commands | `research_analytics.py` and `build_catalog.py` executed successfully |
| Final syntax/whitespace/links | 20 JavaScript syntax checks, `git diff --check` and 51 local documentation targets passed |

No unexpected JavaScript errors occurred. The normal browser suite issued no external requests. Its three renderer errors are expected only during deliberate no-WebGL injection (mug, stairwell, optional couch). The static test intentionally has no recommendation endpoint, so its failed API request selects fallback scoring; this is not a JavaScript exception or a live-Python claim.

Run Python suites sequentially: legacy tests regenerate the same JSON file. One initial parallel run observed a temporarily empty file; sequential reruns passed. A headless keyboard-tooltip check was corrected to bring the page forward and confirm actual focus. A concurrent software-WebGL capture was stopped and subsequently rerun alone. These failed/incomplete development runs are not counted as passes.

## Functional evidence

- **Structure/navigation:** exactly 18 ordered slides, centered colored-dot brand, no secondary bar, no original white-background art, idle-hidden dock, focus/touch reveal, Enter exclusions, arrows, hashes and final boundaries verified.
- **Dock tools:** hovering the tools row above the original activation zone holds the taller dock open; leaving schedules idle hide, and Escape dismisses it even while hovered/focused. This final edge-case fix has explicit targeted coverage.
- **Mug:** genuine Three.js r170 drawing, continuous rotation beyond the former five-second limit, drag/resume, keyboard exploration, repeated visits, hidden/reduced-motion loop management and touch release checked. No replay or visible instructions underneath. The model/lighting/materials/steam code is unchanged.
- **PIVOT:** original Three.js geometry/camera/controller/state files unchanged. Real position/yaw, corner gating, score bounds, penalties/reward, success, repeated resets, inactive rendering and real GPU context-loss fallback passed. Slide 5 uses tension.
- **Research:** all seven measure selectors drive Python-exported maps and tables; reported p labels and category positions match the data. Original figures load through View Original Figure, enlargement/citations/focus restoration work, and no means are estimated. All maps fit the 1366×768 laptop viewport without scrolling. Five widths additionally verify marker/category alignment and horizontal fit. Slide 6 retains exact means and aligned axes.
- **Rewind:** native Enter activation stays on Slide 9, reels animate, TV/room/concepts reveal, replay resets cleanly, reduced motion completes immediately and no footage is embedded.
- **Lobsters:** two original SVG characters, three sequential stages and meeting heart work; the CTA goes to Slide 11 and no recommendation API runs during this transition. Reduced motion is supported.
- **Slider:** the Use this value instruction/control is absent; self-report recording still works.
- **Recommendation:** real Python and matching JavaScript factors/explanations agree, six quotes and familiarity/nostalgia mappings remain, reveal opens Slide 18, two separate alternative cards and all final actions work. Ordinary status text does not expose implementation mode; console/diagnostics retain it.
- **Try Again:** all seven preference fields across six steps, selected cards, slider/default output, session/local profile key, cached result/fingerprint/pending state and detail DOM clear; count becomes 0/6 and navigation returns to Slide 11. Unrelated storage/appearance survive. A normal refresh preserves an attempt; refresh after reset cannot restore it. New answers complete all six steps and produce a fresh Python recommendation. An old delayed response cannot resurrect state. The same reset works in JavaScript fallback mode. Back to Start and normal navigation preserve answers.
- **Static HTTP:** genuine 3D, generated research, original reference images, current-answer JavaScript scoring, friendly status and reset pass without a recommendation backend. This tests Pages-compatible assets; the unpushed v0.9 is not claimed to be deployed publicly.

## All-slide visual review

All 18 slides were captured at **1440×1000 desktop** and **390×844 mobile** and reviewed through all six contact sheets. Full-resolution review covered the main research maps, laptop variants, Rewind before/after, lobster scene, reveal CTA, recommendation cards, scoring modal and navigation states. Final Slide 18 captures were refreshed after strengthening the yellow lower home action. The final capture profile matches Slide 17's example.

| Slides | Review findings |
|---|---|
| 1–4 | Quiet primary header; original rotating mug/door without instructions; spacious concept cards and story sequence retained |
| 5 | Large proportional stairwell and recognizable couch, compact controls, unobscuring feedback; no dashboard |
| 6 | Exact source means, legend, tooltips/table and display-axis alignment retained |
| 7–8 | Cream/purple/orange evidence maps are the main visual; p labels sit next to comparisons, avoiding confusion with category columns; original scans are optional references |
| 9 | Original VHS/TV composition, centered yellow control, cozy apartment reveal and balanced concept pair; stacked concept text remains readable on mobile |
| 10 | Original lobsters and heart support the three-stage story; CTA remains clear and stays within the questionnaire flow |
| 11–16 | Dedicated questions, saved/selected states, all six characters/quotes, exact fan/nostalgia labels; slider hint removed |
| 17–18 | Prominent glowing reveal, friendly status, primary episode focal point, smaller separate alternatives and lower yellow home action |

Very small screens and large text can scroll vertically for supporting notes and lower actions; no horizontal overflow was observed in the tested widths. Fine original-figure text needs the enlarged reference view. The compact laptop rules preserve all seven research maps without needless scrolling. Optional night-theme map text contrast was checked.

### Contact sheets and requested captures

- Desktop [1–6](v09-contact-desktop-1.png), [7–12](v09-contact-desktop-2.png), [13–18](v09-contact-desktop-3.png).
- Mobile [1–6](v09-contact-mobile-1.png), [7–12](v09-contact-mobile-2.png), [13–18](v09-contact-mobile-3.png).
- [3D mug](v09-desktop-01.png), [preserved game](v09-desktop-05.png), [Paper A map](v09-desktop-07.png), [Paper B map](v09-desktop-08.png), [Rewind](v09-desktop-09.png), [lobsters](v09-desktop-10.png), [slider](v09-desktop-12.png), [reveal button](v09-desktop-17.png), [final recommendation](v09-desktop-18.png).
- [Laptop map 7](v09-laptop-7.png), [laptop map 8](v09-laptop-8.png), [original figure](v09-research-enlarged.png), [actual factors](v09-score-details.png), [navigation hidden](v09-navigation-hidden.png), [navigation visible](v09-navigation-visible.png), [real context-loss recovery](v09-live-context-fallback.png).

## File inventory

**Modified:** `index.html`, `script.js`, `v06.js`, `v08.js`, `serve.cjs`, `python/research_analytics.py`, `data/research_source.json`, `data/research_analytics.json`, `data/v05-data.js`, `tests/browser-test.cjs`, `tests/stairwell-context-test.cjs`, `README.md`, `PRD.md`, `llm_logs/llm_prompts_log.md`.

**Created:** `v09.js`, `v09.css`, `tests/test_v09.py`, `tests/v09-ux-test.cjs`, `tests/v09-layout-test.cjs`, `tests/v09-static-test.cjs`, `tests/capture-v09.cjs`, `docs/v08-README.md`, `docs/v08-PRD.md`, and the screenshots/results/review in `screenshots/v09/`.

The existing original assets, vendor library, mug, couch/game geometry/state/controller, Python recommendation engine and 22-episode catalog remain unchanged against v0.8. All previous screenshots/history remain. `friends-v05-research-assets.zip` is untouched and excluded.

## Known limitations

The new research maps summarize reported tests qualitatively; they are not reconstructed group measurements or effect sizes. Exact unreported p values remain unspecified. Diary evidence is observational. Comfort/quote affinities are editorial, not clinical, and the catalog is a 22-episode subset. Actual Python recommendations require the local Node server and interpreter; static hosting uses JavaScript scoring and pre-generated data with mode available in developer diagnostics. Reload retries 3D after GPU loss; illustrated fallback remains for unsupported WebGL. No physical-device, formal screen-reader, user-study or universal-browser certification was performed. Mobile testing is browser emulation. v0.9 is local and not pushed/deployed.
