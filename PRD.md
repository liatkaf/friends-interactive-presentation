# FriendsAnxietyStudio — Product Requirements v0.8

## Product, audience and objectives

**Product:** FriendsAnxietyStudio / Friends Comfort Lab. **Audience:** university course professor, AI evaluation agent and live classroom audience.

Present a polished, research-first narrative, then six optional comfort-profile questions and an explainable real Friends episode recommendation. Preserve exactly **18 primary slides** in the existing order. The old 12-slide limit and five-second mug behavior are superseded. Extend the existing repository; retain history, assets and working features. No paid services, API keys or push are authorized.

The centered **F·R·I·E·N·D·S | The Comfort Lab** brand retains alternating red/yellow/blue dots, independent of controls. Purple-door/yellow-frame/orange-couch styling stays; visible versions, redundant header subtitles and white-background artworks remain absent.

## User stories

- As a presenter, I can explain published evidence before asking personal questions, with minimal text and a strong main visual per slide.
- As a viewer, I can inspect exact source charts, definitions and citations without mistaking editorial interpretations for measured findings.
- As a participant, I can skip, revise or clear answers and retain them while navigating or returning to the start.
- As a keyboard/touch user, I can select cards, reveal navigation, access settings and inspect explanations without losing native control behavior.
- As an evaluator, I can reproduce Python-generated data, see actual Python execution locally, identify fallback mode and inspect deterministic factor scores.

## Required slide structure

| # | Slide | Main visual/interaction |
|---|---|---|
| 1 | Welcome to the Friends Comfort Lab | Continuous original Three.js mug and purple door |
| 2 | Why Do We Rewatch Friends? | Retained published-means chart |
| 3 | The Psychology of Comfort TV | Four numbered grid cards; no arch |
| 4 | Predictability & Control | Illustrative story sequence |
| 5 | PIVOT! Concentration & Spatial Focus | Enlarged stairwell, three compact controls, brief feedback |
| 6 | What the Research Shows | Grouped/switchable exact descriptive-means chart |
| 7 | Belonging, Mood & Rejection | All four original Paper A figures |
| 8 | Familiar Worlds & Self-Control | All three original Paper B figures |
| 9 | Nostalgia & Cognitive Ease | Memory/familiarity illustration |
| 10 | From Research to Recommendation | Evidence → preferences → real episode |
| 11 | How Are You Feeling? | Optional mood cards |
| 12 | What's Your Stress Level? | Optional 0–10 self-report slider |
| 13 | Who's Your Favorite Friend? | Preserved six character cards |
| 14 | Which Quote Speaks to You? | Exactly six single-selection quote cards |
| 15 | What Kind of Comfort Do You Need? | Desired-experience selection |
| 16 | How Familiar Is Friends to You? | Three familiarity and three nostalgia choices |
| 17 | Finding Your Perfect Match | Actual request/computation states and factors |
| 18 | The One With Your Perfect Episode | Top episode, two alternatives, explanations and actions |

## Functional requirements

### Presentation and graphics

The mug rotates seamlessly for the entire visible opening slide, retaining its model/materials/light/drag controls. Ease automatic rotation back after interaction; prevent duplicate frame loops; cancel while the slide/document is hidden. Reduced motion keeps manual exploration without automatic rotation. Remove replay controls and copy.

Slide 3 uses a spacious 2×2 desktop grid, two columns on medium mobile and one on very narrow screens. Each focusable card has a number, subtle icon, heading, requested tagline and brief qualified explanation. Use consistent heights and restrained hover/focus feedback.

Slide 5 devotes approximately 85–95% of content width to the actual 3D stairwell. Correctly resize renderer/camera aspect; preserve full scene framing. Center MOVE UP (blue), PIVOT! (red) and Reset Challenge (outlined) below it. Remove the visible percentage meter, checklist and large progress bar; keep brief unobscuring feedback and **tension** terminology. Desktop/laptop composition should avoid needless vertical scrolling.

Underlying PIVOT rules remain: score starts at 100 and stays 0–100; bottom → flight → corner → top; blocked corner move costs 25; one correct pivot adds 10 capped at 100. Disable pivot outside its valid stage and after use. Success stops advancement; repeated reset restores game/scene/button states. Position/yaw must track state; failure/success feedback is visible. Inactive scenes stop unnecessary animation; reduced motion snaps transitions. Synchronized illustrated fallback handles unavailable/lost WebGL. Game score is isolated from profiles/recommendation payloads. Display **Game score only — not a clinical or cognitive assessment**.

### Research pipeline and interactions

Extend `python/research_analytics.py`; do not add a redundant analytics module. Load documented `data/research_source.json`, validate finite ratings/scales/unique activities and seven PNG identities, calculate display widths and export structured JSON plus provenance hashes. `python/build_catalog.py` includes research data in the offline browser bundle. Document both reproducible commands. Charts must consume this output.

Slide 6 plots only Paper A, Study 1, Table 1 means: favorite TV 5.81/2.64; whatever TV 4.86/3.69; favorite music 5.82/2.97; favorite movie 5.00/3.43. Explain the 1–7 scales/reversed loneliness measure and distinguish them from clinical anxiety. Include axis, legend, series switch, pointer/focus tooltip, accessible table, animation, attribution and reduced-motion support.

Slides 7–8 use Python-bundled figure metadata and all seven unchanged originals, with interactive selectors, explanatory captions, paper/study/figure identities, axes/conditions, citations and enlargement. No numerical series are inferred from bar heights. Original figures remain the fallback where exact values are not documented.

### Profile and recommendation

Slide 14 contains exactly: PIVOT! (Ross); How you doin'? (Joey); We were on a break! (Ross); Could I BE any more...? (Chandler); Smelly Cat (Phoebe); I know! (Monica). Cards include full character names/themes, direct selection, single `aria-pressed` state, native Enter/Space, visible focus, responsive 3×2 desktop grid and persistence.

Use shared `data/quotes.json` for Python and fallback. Retain original exact-scene associations; new recurring/template quote options use transparent half-credit character associations rather than invented exact-episode claims. Explain actual scoring in results; do not guarantee unique recommendations per quote.

Slide 16 retains internal IDs and saved answers:

| Question | Internal value | Exact visible label |
|---|---|---|
| Your relationship with the series | new | Who's Chandler? |
| Your relationship with the series | some | I watch it when it's on TV |
| Your relationship with the series | rewatcher | I know it by heart — 7! 7! 7! |
| How much nostalgia tonight? | low | Light Comfort |
| How much nostalgia tonight? | medium | Central Perk Vibes |
| How much nostalgia tonight? | high | Unagi — Total Awareness & Nostalgia |

Keep three equal desktop cards per question; wrap longer labels without clipping and stack on mobile. Preserve Clear answer, Skip / continue and single selection per group.

Preserve actual Python worker scoring, 22 verified episodes, deterministic normalization/tie-breaking, two alternatives and explanations; use identical labeled JavaScript fallback on failure/static hosts. Incomplete profiles remain valid. Slide 17 must reflect actual pending/completed computation, never a false Python claim. Why This Episode? reveals actual factors. Try Again returns to editable questions; Surprise Me selects another real episode with its mode labeled. Back to Start returns to slide 1, updating hash/indicators without erasing answers. No game score enters recommendation inputs.

### Navigation and accessibility

Hide/minimize the bottom bar by default and overlay it without layout shifts. Reveal near the bottom 88 pixels; fade/slide up; hide after 1.3 seconds outside. Keep visible during focus; provide a persistent touch toggle and Escape dismissal. Retain counters/dots/buttons and contrast/focus indicators. Do not cover content with an event-catching activation layer.

Preserve Enter from non-interactive slide/background focus on slides 1–17, final boundary and repeat protection. Native Enter behavior remains on interactive controls, forms, quiz choices, editable content, canvases and dialogs. Preserve arrows, Home/End, hashes, transitions, settings and tab-session persistence. Support responsive layouts and reduced motion, allowing vertical scrolling on small screens/large text without clipping or horizontal overflow.

## Technical architecture

Use existing local Node server, Python worker, generated research JSON/offline bundle, vanilla JavaScript, SVG/CSS and bundled Three.js. No new runtime packages or remote dependencies. Browser rendering of Python-generated JSON is build-time data use, not live Python. GitHub Pages cannot run the worker and must show JavaScript fallback; local server remains the full Python demonstration. Profile data is tab/local-loopback only, not server-stored.

Maintain original research/artwork bytes, previous screenshots and Git history. Update README, this PRD, prompt log, tests and reviewed screenshots. Only list the Pages URL as verified with accurate deployed version. Create one local v0.8 commit after verification; do not push.

## Acceptance evidence

Only executed, verified checks are marked complete. The final [v0.8 review](screenshots/v08/visual-review.md) and [browser report](screenshots/v08/v08-results.json) record actual outcomes.

- [x] Python regression and v0.8 source/mapping suites: 14 tests passed.
- [x] Deterministic isolated game rules: 33 checks passed.
- [x] Research generation commands execute; exact means, generated data reproducibility and unchanged figure hashes verified by Python tests.
- [x] Published v0.7 Pages baseline verified in browser: 5 checks; not presented as deployed v0.8.
- [x] Final v0.8 browser regression: 455 assertions passed, no unexpected JavaScript errors or external requests. Three expected renderer errors were confined to deliberately unavailable WebGL.
- [x] Latest real WebGL context-loss recovery run: 14 checks passed, no unexpected errors.
- [x] All 18 final slides visually reviewed at 1440×1000 and 390×844; six contact sheets and individual captures retained. Final capture run: 11 checks, including real touch mug drag/release, no unexpected errors.
- [x] Final chart-axis correction independently tested: 18 checks passed, verifying zero/seven alignment, exact bar proportions and no horizontal overflow at five widths; refreshed slide 6 captures reviewed.
- [x] Fifteen JavaScript syntax checks and `git diff --check` passed; 48 local documentation links resolve. Original assets, vendor library and 22-episode catalog unchanged against v0.7.
- [ ] Physical-device testing and formal screen-reader/user-study validation (outside current automated desktop/mobile emulation).

## Research and ethical boundaries

Paper A: Derrick, Gabriel, & Hugenberg (2009), *JESP, 45*, 352–362; DOI [10.1016/j.jesp.2008.12.003](https://doi.org/10.1016/j.jesp.2008.12.003). Paper B: Derrick (2013; online 2012), *SPPS, 4*(3), 299–307; DOI [10.1177/1948550612454889](https://doi.org/10.1177/1948550612454889).

Neither paper tested Friends as a clinical anxiety intervention. Separate favored-TV findings from Friends illustrations and broader predictability/cognitive-ease/nostalgia interpretations. Distinguish significant, marginal (rejection p = .09), non-significant and observational findings. No cortisol claims, fabricated energy units, clinical anxiety-score interpretation or inferred figure values. Match percentages and episode comfort tags are editorial/algorithmic, not medical probabilities. Entertainment recommendations are not medical advice. The retained synthetic simulator remains an explicitly unvalidated educational illustration.

Known limits: subjective 22-episode subset; small original figure text needs enlargement; vertical scrolling on mobile/large fonts; interpreter requirement for actual Python; reload needed to retry 3D after lost context; storage restrictions may affect persistence. Formal user/clinical validation and universal-browser certification are not claimed.

## Development history

v0.5 introduced the research explorer and Python recommender; v0.6 established this 18-slide research-first format; v0.7 added centered branding, shared-couch stairwell, Enter and Back to Start. v0.8 refines presentation visuals, source processing, six quote inputs and optional navigation. Prior requirements and their historical evidence are preserved in [archived v0.7 PRD](docs/v07-PRD.md), [README history](README.md#deployment-attribution-and-history) and existing v0.6/v0.7 screenshots. Codex-assisted work is recorded in [the v0.8 prompt log](llm_logs/llm_prompts_log.md), without fabricated earlier prompts.
