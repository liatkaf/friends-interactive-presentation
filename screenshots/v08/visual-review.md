# Version 0.8 — validation and visual review

Reviewed November 1, 2026 in isolated headless Microsoft Edge, using local server `http://127.0.0.1:8008` with actual Python 3 matching and software WebGL. Exactly **18 primary slides** retain their existing order. No changes were pushed.

## Actual executed results

| Check | Result |
|---|---|
| `py -3 tests/test_v05.py` | 7 tests passed |
| `py -3 tests/test_v08.py` | 7 tests passed |
| `node tests/pivot-state-test.cjs` | 33 checks passed |
| `node tests/browser-test.cjs` | [455 assertions passed](v08-results.json); zero unexpected JavaScript errors; zero external requests |
| `node tests/stairwell-context-test.cjs` | [14 live WebGL context-loss checks passed](v08-context-results.json); zero unexpected errors |
| `node tests/capture-v08.cjs` | [11 checks passed](v08-capture-results.json), including actual emulated touch mug drag/release; zero errors |
| `node tests/chart-layout-test.cjs` | [18 checks passed](v08-chart-layout-results.json); aligned axis endpoints, exact proportions and no horizontal overflow at five widths |
| `py -3 python/research_analytics.py` | Validated/exported JSON successfully |
| `py -3 python/build_catalog.py` | Regenerated 22 episodes/offline bundle successfully |
| JavaScript syntax and `git diff --check` | 15 syntax checks passed; whitespace check passed |
| Local documentation links | 48 targets verified |
| `git diff --exit-code -- assets/ vendor/ data/friends_episodes.json` | Passed: original figures/artwork, vendor library and episode catalog unchanged |
| Published Pages verification | [5 checks passed](../../llm_logs/pages_verification.json); deployed v0.7, not local v0.8 |

Three renderer errors in the browser report are expected only during deliberate no-WebGL injection, one per attempted Three.js scene. They are not normal-operation errors. Earlier failing development runs were fixed/retested and are not included in these pass counts.

The browser suite covers continuous motion beyond five seconds, drag/resume, manual keyboard controls, rapid repeated visits, hidden/no-duplicate/reduced-motion loops, all slide destinations and Enter exclusions, retained game penalties/pivot/pose/reset, seven figures/enlargement, data/tooltips/table/series switch, all six quote IDs and single selection, native Enter/Space, exact familiarity/nostalgia labels and stored values, clear/skip/reload persistence, actual Python completion/pending states, Python/fallback factor-and-explanation parity, final actions, settings, WebGL/direct-file fallback and layout widths 1440, 1024, 768, 390 and 320. The enlarged game also fits the 1366×768 laptop viewport without vertical scrolling.

## Visual review of every slide

All 36 final individual captures were reviewed through six contact sheets, with full-resolution checks for research charts, quote/profile labels, enlarged figures, score explanations and navigation states. Desktop: **1440×1000**; mobile: **390×844**.

| Slides | Review outcome |
|---|---|
| 1 | Original mug/door remain clear, replay absent, compact interaction hint; continuous loop/drag/resume checked in browser, not inferred from a still image |
| 2 | Retained source-based chart readable in warm layout |
| 3 | Four separate spacious grid cards; no arch; 2×2 on desktop/390px and one column at very narrow widths |
| 4 | Research-first illustrative sequence preserved |
| 5 | Large fully framed stairwell; compact controls and brief feedback below; dashboard removed; mobile scene remains recognizable |
| 6 | Grouped exact means, distinct legend, keyboard tooltips and source table; final axis alignment corrected and independently tested |
| 7–8 | Original figure image is the main visual; all four/three tabs accessible; captions/takeaways and enlargement retained |
| 9–10 | Minimal explanatory visuals lead naturally into the profile |
| 11–13 | Dedicated mood/stress/character questions preserve clear selected states and saved answers |
| 14 | All six quote cards in 3×2 desktop and 2×3 mobile; character/theme legible; mobile spacing tightened after initial review |
| 15 | Desired-experience cards remain consistent with the questionnaire |
| 16 | Exact requested labels fit; equal desktop rows and stacked mobile options; no label truncation |
| 17 | Actual Python completion label, ordered matching steps and real factor chips visible |
| 18 | Real top episode, alternatives, algorithmic label, all final actions and disclaimer remain legible |

Small mobile screens retain vertical scrolling for supporting notes, lower questionnaire actions and long result detail. This is intentional accessibility behavior rather than clipped content. Original figure fine print is best viewed enlarged. The navigation overlay can temporarily cover the lowest content while open; the persistent toggle/keyboard can dismiss it without changing slide size.

### Contact sheets

- Desktop: [1–6](v08-contact-desktop-1.png), [7–12](v08-contact-desktop-2.png), [13–18](v08-contact-desktop-3.png).
- Mobile: [1–6](v08-contact-mobile-1.png), [7–12](v08-contact-mobile-2.png), [13–18](v08-contact-mobile-3.png).

### Requested representative captures

[Mug](v08-desktop-01.png) · [Pillar grid](v08-desktop-03.png) · [Enlarged PIVOT](v08-desktop-05.png) · [Study 1 chart](v08-desktop-06.png) · [Paper A explorer](v08-desktop-07.png) · [Paper B explorer](v08-desktop-08.png) · [Six quotes](v08-desktop-14.png) · [Familiarity/nostalgia](v08-desktop-16.png) · [Navigation hidden](v08-navigation-hidden.png) · [Navigation visible](v08-navigation-visible.png).

[Enlarged original figure](v08-research-enlarged.png) · [Actual factor details](v08-score-details.png) · [Pivoted corner](v08-corner-pivoted.png) · [Success](v08-game-success.png) · [Live context-loss fallback](v08-live-context-fallback.png) · [No-WebGL fallback](v08-game-fallback.png) · [Optional original couch](v08-optional-pivot.png).

## Files created and modified

**Modified:** `index.html`, `script.js`, `mug.js`, `animation-timeline.mjs`, `lab-core.js`, `v06.js`, `v07.js`, `serve.cjs`; `python/research_analytics.py`, `python/build_catalog.py`, `python/episode_recommender.py`; `data/research_analytics.json`, `data/v05-data.js`; `tests/browser-test.cjs`, `tests/stairwell-context-test.cjs`; `README.md`, `PRD.md`.

**Created:** `v08.css`, `v08.js`; `data/research_source.json`, `data/quotes.json`, `data/profile_labels.json`; `tests/test_v08.py`, `tests/capture-v08.cjs`, `tests/chart-layout-test.cjs`, `tests/verify-pages.cjs`; `docs/v07-README.md`, `docs/v07-PRD.md`; `llm_logs/llm_prompts_log.md`, `llm_logs/pages_verification.json`; this review and the v0.8 screenshot/result files in this directory. All previous screenshots remain. The unrelated untracked `friends-v05-research-assets.zip` is untouched and excluded from the release.

## Known limitations

No physical-device, formal screen-reader, cross-browser certification or user study was performed. Mobile results are browser emulation. Software WebGL/headless paint timing varies; tests wait for actual rendering. A local interpreter is required for Python matching; static Pages uses labeled JavaScript fallback and build-time Python data. After GPU loss, illustrated gameplay remains usable; reload retries 3D. Comfort tags/quote character affinities are editorial and the 22-episode catalog is a subset. No clinical interpretation, guaranteed comfort or unique episode per quote is claimed.
