# LLM-assisted development history

## Version 0.8 — November 1, 2026

### Objective and faithful prompt summary

The user requested an incremental upgrade of the existing v0.7 FriendsAnxietyStudio repository to a polished v0.8 university presentation. Preserve exactly 18 ordered primary slides, research-first storytelling, Python analytics and recommendation execution, JavaScript fallback, persistent questionnaire, original research figures, branding, keyboard/navigation actions, responsive layouts and reduced motion. Keep all interface/documentation/comment text in English and do not push.

Requested changes: continuous draggable opening mug with no replay; four psychological-pillar grid cards on slide 3; full-width immersive PIVOT scene with compact controls and no visible dashboard; accurate Python-generated research visualizations on slides 6–8; six selectable iconic quote cards integrated into both scoring engines; exact Friends-inspired familiarity/nostalgia labels on slide 16 while retaining values; auto-hiding bottom navigation accessible through hover/focus/touch. Update README/PRD/prompt history, execute regression tests, review all slides on desktop/mobile, capture screenshots, verify Pages before claiming a live demo and create one new local v0.8 commit.

The exact requested quote set is PIVOT!, How you doin'?, We were on a break!, Could I BE any more...?, Smelly Cat and I know!. Familiarity labels: Who's Chandler?; I watch it when it's on TV; I know it by heart — 7! 7! 7!. Nostalgia labels: Light Comfort; Central Perk Vibes; Unagi — Total Awareness & Nostalgia.

### Initial state and implementation decisions

- Inspected clean tracked state, branch `main` and v0.7 commit `28641137e266c89616947b3b1e6b6af3d415f120`. Preserved the unrelated untracked `friends-v05-research-assets.zip`; no history rewrite or push.
- Kept the existing model, materials and lighting. Replaced mug replay timing with continuous frame integration, smooth post-drag speed recovery and one guarded render loop. Removed an intersection-observer dependency that could race during rapid hidden/visible transitions; slide/document visibility remains authoritative.
- Extended existing slide templates/controllers with `v08.css` and `v08.js`; retained original slide order and game state architecture. Enlarged canvas through CSS while its existing ResizeObserver updates renderer and camera aspect. Hid no essential game controls; removed obsolete dashboard DOM and kept underlying score mechanics isolated.
- Extended `research_analytics.py`, rather than creating a redundant analytics module. Added documented source JSON, validation, reproducible width transforms, figure/source hashes and exported metadata. Checked the eight Study 1 means and scale against the author-lab Paper A PDF. Displayed all seven original figures without deriving exact numbers from their bars.
- Added shared quote definitions and profile-label JSON, bundled by the existing Python build command. Preserved old quote IDs and saved familiarity/nostalgia values. New recurring catchphrases/template use explicit editorial half-credit character associations; no invented exact episode scene is asserted. Python and fallback explain the actual same rule.
- Added an overlay navigation layer with a non-blocking bottom activation zone, delayed hide, focused-control hold and persistent touch toggle. Existing Enter, arrows, hash navigation and final actions remain.
- Archived prior README/PRD under `docs/` before writing current v0.8 documentation; retained previous screenshots/history.
- Verified public Pages through an isolated browser: 18 slides, seven figures, mug/stairwell, no unexpected errors. It serves the published v0.7 baseline; v0.8 remains local. Static hosts use JavaScript fallback and build-time Python-generated charts, not live Python.

### Validation notes

Executed Python regression and new v0.8 suites: 14 tests passed. Deterministic PIVOT state suite: 33 checks passed. Research generation commands executed successfully. Browser tests cover continuous motion, drag/resume, rapid navigation, hidden/reduced rendering, source values/tables/tooltips, all six quote selections, keyboard activation/persistence, exact label mappings, Python/fallback factor-and-explanation parity, game regressions, navigation hover/touch/focus and all final actions.

During QA, headless software WebGL/compositor timing caused early fixed-delay assertions to fail. The tests now explicitly flush coalesced hide/show paints and observe actual rendered frames/geometry. Failures were not counted as passes. Final browser/context-loss counts and final visual findings are recorded in `screenshots/v08/visual-review.md` and the accompanying JSON reports.

Final results: 455 browser assertions, 14 real context-loss checks, 11 screenshot/touch checks and 18 targeted chart-layout checks passed with no unexpected JavaScript errors. The final visual review caught offset axis ticks; a dedicated five-width test now verifies alignment to bar endpoints and exact mean proportions. Slide 6 captures/contact sheets were refreshed after that correction. The first targeted width-proportion check caught an unfinished entrance animation; the final run waited for paint/animation and passed rather than treating that failure as success.

Every slide is captured at 1440×1000 and 390×844, with five responsive widths additionally checked by the regression suite. Initial visual review prompted tighter mobile quote-card spacing. Navigation hidden/visible states, enlarged figures and score explanations have dedicated captures. Actual final results are documented with the release evidence, not inferred from implementation.

### Scientific and practical limitations

No clinical, cortisol or physical cognitive-energy claim is made. Published means are descriptive, original-figure findings retain significance/observational qualifications, and editorial comfort scores are not scientific probabilities. Six quotes need not yield six unique top episodes. Catalog remains the existing curated 22-episode subset. Actual Python matching requires the local server/interpreter; Pages uses labeled fallback. Small screens/large fonts may scroll; original figure text needs enlargement. WebGL loss retains illustrated gameplay; reload retries 3D. No physical-device or formal screen-reader/user-study validation is claimed.

OpenAI Codex assisted with code, tests, verification and documentation. No live LLM, paid AI service or secret key is required at runtime. No earlier LLM conversation is reconstructed or invented in this log.
