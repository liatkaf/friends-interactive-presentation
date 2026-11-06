# Personal Comfort Profile upgrade - actual QA and visual review

The deck remains **17 slides**. Only questionnaire Slides 10-15 (indices 9-14) were redesigned. Before images and 20 recommendation fixtures were captured from the previous UI at local baseline b9e1c2c before editing its templates; they are not recreated mockups. Original prompt history and previous screenshot directories remain unchanged.

## Executed tests

| Suite | Actual result | Evidence |
|---|---|---|
| Dedicated profile interaction suite | **267 checks passed**, zero unexpected errors | [Report](profile-experience-results.json) |
| Full presentation regression | **433 checks passed**, zero unexpected errors/external runtime requests | [Report](presentation-regression-results.json) |
| Retained research/player/rewind/lobster/reset regression | **91 checks passed**, including late-result reset protection | [Report](preserved-ux-results.json) |
| Python discovery | **26 tests passed**, exit 0; includes 3 new portrait/provenance/golden-result tests and all 23 previous Python tests | [Summary](profile-python-summary.json), [output](profile-python-results.txt) |
| Compact/responsive layout probe | **36 viewport cases**, zero horizontal overflow or vertical fit failures | [Measurements](profile-layout-results.json) |
| Clean static-host profile suite, no recommendation API | **34 checks passed**, including 20 baseline-equivalent fallback rankings | [Report](profile-static-results.json) |
| Before capture | **14 checks passed**, no errors; six slides at both viewport sizes | [Report](profile-before-capture-results.json) |
| After capture | **14 checks passed**, no errors; six slides at both viewport sizes | [Report](profile-after-capture-results.json) |

The presentation suite deliberately tests unavailable WebGL; three expected renderer errors are recorded separately. They are not unexpected JavaScript errors. The dedicated suite clears each answer before testing Enter/Space, so keyboard checks prove actual selection rather than merely preserving an already selected card. Native mouse and browser touch events also exercise the real range input. No physical touchscreen test is claimed.

Verified: original option counts/values; every choice by mouse and keyboard; 0-10 gauge needle/numeric/band mapping; no automatic midpoint answer; descriptions and quote themes; exact quote IDs; immediate menu ordering; independent familiarity/nostalgia fields and clears; no auto-navigation from the completion cue; relevant-step clearing; skip; revisit/refresh persistence; unchanged rankings, points, factors and explanations against 20 pre-upgrade cases in both Python and JavaScript; Back to Start preserving answers; Try Again clearing all new visuals/storage; cleared refresh; reduced-motion transitions.

## Visual review

Reviewed desktop 1440x1000 and mobile emulation 390x844 in Microsoft Edge/CDP. Layout measurements additionally cover 1366x768, 1024x768, 768x1000 and 320x844. All six slides fit those tested standard viewports without horizontal clipping or unwanted scrolling. Large text/zoom and shorter physical screens may legitimately scroll to retain accessible content.

| Slide | Distinct interaction and review |
|---|---|
| 10 | Existing six-card layout preserved; original restrained coffee/weather/window/clock/sun/paper symbols replace emoji. Hover/focus and selected accents respond without continuous animation. Long mood label fits at 320px. |
| 11 | Cream retro gauge on purple, colored semicircle and smooth needle; numeric value sits below the pivot, never under the needle. Native labelled slider remains authoritative. Initial value is unanswered; captions and band cutoffs are editorial UI copy, not clinical categories. |
| 12 | All six coordinated painted portraits remain visible; selected card grows slightly and reveals its concise description. Names, head/shoulder framing, warm color treatment and focus/selection borders reviewed at desktop and phone size. Rachel is an original interpretation rather than an exact actor likeness. |
| 13 | Gold-framed purple quote wall; all six quotes visible, selected character/theme revealed, readable restrained depth without large rotations. |
| 14 | Five illustrated cafe-menu rows with immediate order stamp/ticket; original explanatory copy/values retained, no checkout. Mobile selected mark and lower controls remain visible. |
| 15 | Remote familiarity buttons and distinct nostalgia selector remain simultaneously visible. Independent field clears and restrained completion cue work without advancing. Long labels wrap fully; footer controls fit. |

Screenshots use the same illustrative profile before and after: happy, stress 5, Monica, I know!, warmth, rewatcher, high nostalgia. This is deliberately selected test data, not an automatic default. An untouched fresh profile displays an unanswered gauge and no selected choices, verified by the interaction suite.

### Before / after contact sheets

- [Before - desktop](profile-before-contact-desktop.png) / [After - desktop](profile-after-contact-desktop.png)
- [Before - mobile](profile-before-contact-mobile.png) / [After - mobile](profile-after-contact-mobile.png)
- [Previous character avatars](profile-before-desktop-12.png) / [Painted gallery](profile-after-desktop-12.png) / [Mobile gallery](profile-after-mobile-12.png)

Full-resolution after screenshots for all six slides are saved here as `profile-after-desktop-10.png` through `15.png` and corresponding mobile images. Complete raw capture runs remain in ignored `test-results/` and can be regenerated with `tests/profile-capture.cjs`; its before mode refuses to overwrite the saved baseline or mislabel the new UI as the old one.

## Artwork provenance and limitations

The actual built-in image-generation tool created all six final portraits using the Slide 4 artwork as a painted-style reference. Four initial named-character requests succeeded. Revised fictional art succeeded for Phoebe; Rachel requests were rejected, so that card uses a new original fashion-character interpretation with no claimed real-person likeness. The exact prompts, failed attempts and final request are recorded in `llm_logs/profile-portrait-prompts.json`. This limitation is not hidden as a claim of exact character/actor fidelity.

`python/prepare_portraits.py` only resizes and encodes the generated PNGs. Six 400x500 WebP files total 188,624 bytes; individual and source hashes are in `assets/portraits/provenance.json`. Existing Pillow 10.4.0 is the only image-export dependency. Generation is nondeterministic; raw generation files are kept locally outside tracked runtime assets, so re-export needs those original inputs. The presentation bundles its complete optimized assets and makes no image/API calls at runtime.

## Corrections and verification limits

The first broad run found 320px mood-label overflow; typography was corrected. Visual review caught needle/numeric overlap and excess mobile height; the number was separated and compact spacing adjusted without hiding content. The final layout probe has zero failures. Test-fixture corrections made UTF-8 explicit and compared profile values independent of object-key order. The plain Windows Python 3.8 file server lacked a WebP MIME entry; the standard-library `python/static_preview.py` helper provides it. The static HTTP test was rerun successfully and its binary response is fully consumed to avoid a test-client cleanup error. Failed/incomplete development runs are not claimed as passing results.

No physical-device, formal screen-reader or independent human portrait-recognition study was performed. Rachel's exact actor likeness remains unavailable. No clinical claims, new research data, scoring changes, paid dependencies, API keys, commit, push, release, deployment or repository-setting change were introduced. Current changes remain local for user review.

## Final integrity review

[Source/link check](integrity-results.json) confirms all 11 non-questionnaire slide templates are unchanged and 23 protected scoring/research/3D/source files match the pre-upgrade commit. Nine JavaScript/test files pass syntax checks; current documentation links resolve; targeted secret-pattern checks found no matches. This is not an exhaustive security audit. The only change to the authoritative state manager is a presentation notification after synchronization. The local server also gains the WebP MIME entry. No scoring or persistence rules changed.
