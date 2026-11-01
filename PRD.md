# FriendsAnxietyStudio — Product Requirements Document v0.7

## Product and audience

**Product:** FriendsAnxietyStudio / Friends Comfort Lab.

**Target audience:** university course professor and AI evaluation agent, with a live classroom audience.

**Objective:** present a coherent research story, then guide the viewer through six optional question slides and recommend a real Friends episode with explainable scoring. Professional slide composition takes priority over more features.

The v0.5 12-slide restriction is superseded: **exactly 18 primary slides** are required. Existing Git history must remain intact. No push is authorized.

## Version 0.7 incremental requirements

- Center only **F·R·I·E·N·D·S | The Comfort Lab** in the topbar, horizontally and vertically. Dots alternate `#e74c3c`, `#f1c40f`, `#3498db`. Use prominent lettering and a lighter lab suffix. Move controls/context/progress to a separate normal-flow utility row; retain their accessibility on mobile. Remove visible version badges and redundant header copy.
- Replace Slide 5 with **PIVOT! Concentration & Spatial Focus**. Keep it an entertainment demonstration in Part I, not an additional questionnaire. Description: “Test your focus and spatial awareness in a playful stairwell challenge. Help Ross move the couch around a tight corner — and remember to PIVOT at the right moment!” Display “Game score only — not a clinical or cognitive assessment.” No stress wording belongs on Slide 5; stress inputs and backend field names elsewhere remain intact.
- Use four deterministic stages: Bottom Landing, Stairflight 1, Tight Corner — PIVOT NEEDED!, Top Landing — Success! Initial score 100, bounded 0–100. A blocked MOVE UP at the corner costs 25; one successful pivot earns 10, capped at 100. Disallow pivot outside the corner and repeated rewards. Disable advancement after success. Reset every gameplay/visual/button state without reloading.
- Enhance the existing couch architecture with a shared original couch factory and a Three.js stairwell renderer: two flights, a tight corner, walls/railings, lighting, position movement and 90-degree rotation. Include visible failure/success feedback. Stop animation while inactive/hidden, honor reduced motion, and preserve a synchronized illustrated fallback when WebGL is unavailable.
- Keep game score entirely separate from questionnaire/session preference data and Python requests. It is not a scientific concentration score, cognitive assessment or anxiety measurement. Retain actual Python ranking, verified episode data, all research figures and analytics.
- Enter advances from presentation/background focus on slides 1–17; no advancement beyond slide 18. Ignore held-key repeats. Preserve native Enter activation for buttons/links and exclude forms, selects, editable content, choices, game controls, canvases, modals and interactive overlays. Retain arrows and Home/End.
- Add **Back to Start** in the final action area. Return to slide 1 and synchronize hash/counter/indicators/progress while preserving preferences and recommendation access. Keep Try Again and Reset Profile separate.
- Preserve the 18-slide research-first design, six questionnaire slides, transitions, five-second mug, optional free-rotation couch, theme settings, responsive layout and previous screenshots/history. No white-background artwork returns to the UI. No paid services or keys.

### v0.7 acceptance evidence

Executed evidence, 2026-11-01: 418 browser assertions, 14 real context-loss smoke checks, 33 pure game-rule checks and 7 Python tests passed. Zero unexpected JavaScript errors and zero external requests. Three expected WebGL context errors occurred only during deliberate graphics-failure testing. All 18 slides were visually reviewed on desktop and mobile; current evidence is in `screenshots/v07/`, including six contact sheets, individual captures, game states, review notes and the browser result JSON. Previous v0.6 evidence is retained. The real context-loss test also verifies the private Three.js adapter callback fix, canvas hiding, continued gameplay and final illustrated position.

- [x] Branding centered at desktop/mobile widths, correct dot colors, no competing brand-row controls/version copy or control overlap.
- [x] Deterministic game rules, score floor/cap, one-time pivot, actual 3D translation/yaw, failure/success, repeated reset, no inactive render loop, reduced motion and illustrated fallback verified.
- [x] Enter from all 17 eligible slide backgrounds, final boundary, repeat suppression, focused-control/native activation and dialog/form/choice exceptions verified.
- [x] Back to Start updates navigation state, preserves answers and permits returning to the personalized result.
- [x] Existing Python, analytics, seven figures, questionnaire, mug, settings, optional couch, fallback and responsive regressions pass with no unexpected JavaScript errors.
- [x] All 18 slides visually reviewed on desktop/mobile with current screenshots; previous evidence retained.

Release: create one new local commit named `feat: v0.7 branding stairwell challenge and keyboard navigation`. Do not rewrite previous commits or push. Report its hash separately. The v0.6 acceptance record below remains historical evidence.

## Narrative structure

| Part | # | Slide | Focal element |
|---|---|---|---|
| I — Understanding the Research | 1 | Welcome to the Friends Comfort Lab | CSS purple door, yellow frame and original five-second Three.js coffee mug |
| I | 2 | Why Do We Rewatch Friends? | Python-generated descriptive research chart, metric toggle and source details |
| I | 3 | The Psychology of Comfort TV | Four concepts and explicit evidence/interpretation distinction |
| I | 4 | Predictability & Control | One illustrative familiar-story sequence |
| I | 5 | PIVOT! Concentration & Spatial Focus | State-driven Three.js stairwell challenge; entertainment only |
| I | 6 | What the Research Shows | Paper A, Study 2, Figure 1 |
| I | 7 | Belonging, Mood & Rejection | Paper A, Study 3, Figures 2–4 |
| I | 8 | Familiar Worlds & Self-Control | Paper B, Study 1 Figures 1–2 and Study 2 Figure 3 |
| I | 9 | Nostalgia & Cognitive Ease | Then/now visual; interpretations rather than claims of direct tests |
| I | 10 | From Research to Recommendation | Evidence → preferences → editorial matching |
| II — Your Personal Comfort Profile | 11 | How Are You Feeling? | Large optional mood choices |
| II | 12 | What's Your Stress Level? | Optional self-reported stress slider, 0–10 |
| II | 13 | Who's Your Favorite Friend? | Six original vector character choices |
| II | 14 | Which Quote Speaks to You? | Three large quote choices |
| II | 15 | What Kind of Comfort Do You Need? | Desired experience |
| II | 16 | How Familiar Is Friends to You? | Familiarity and nostalgia, explicitly paired on this slide |
| III — Your Personalized Episode | 17 | Finding Your Perfect Match | Actual computation states and factor contributions |
| III | 18 | The One With Your Perfect Episode | Top episode, two alternatives and optional scoring details |

Each primary slide has one h1/h2 headline, one main visual/interactive element, restrained supporting text, generous spacing and consistent navigation. Research slides have no personal questionnaire fields. Detail dialogs and optional activities are not primary slides.

## User stories

- As a viewer, I can understand the psychological concepts and see the published evidence before answering questions.
- As a research reader, I can inspect all seven original figures, select related outcomes, enlarge them and read accurate axes, conditions and citations.
- As a viewer, I can answer, skip, return to, change or clear each optional preference, with automatic saving and six-question progress.
- As a viewer, I can see honest computation status, then receive a real episode plus two alternatives and understand why they match.
- As an instructor, I can verify actual Python execution and distinguish it from fallback JavaScript.
- As a presenter, I can open PIVOT or settings only when wanted, without disrupting the research narrative.
- As a mobile or keyboard user, I can navigate the whole deck, access dialogs, enlarge figures, select answers and use reduced motion.

## Functional requirements

1. Exactly 18 existing-project presentation sections and indicators, in the specified order. Preserve Previous/Next, arrow keys, Home/End, deep links, counter and progress. One slide visible at a time.
2. Remove all active UI references to the two user-created white-background PNG artworks. Keep the original files unchanged; retain CSS identity, orange couch colors and 3D elements.
3. Place the seven research figures across slides 6–8. Preserve original pixels, study/figure identity, readable full-size viewing, source citations and accurate interpretation. Native dialogs must support closing and focus restoration.
4. Preserve Python analytics and generated descriptive data; do not fabricate extra statistics. The published chart provides clear scale/context and accessible values.
5. Use six dedicated questionnaire slides. Answers remain optional, save to tab sessionStorage and can be changed or cleared. The last question explicitly groups familiarity and nostalgia. Stress slider defaults are not treated as answers without movement or confirmation.
6. Map seven UI fields directly to the existing Python profile names. Omit the formerly separate predictability question from the redesigned UI while retaining backend support for compatibility. Preserve valid v0.5 tab answers for the fields still used.
7. Preserve `python/episode_recommender.py`, the verified 22-episode catalog, persistent Python worker and transparent deterministic scoring. Only answered factors enter the score denominator. Empty profile = 0%; chronological tie-breaking.
8. Slide 17 shows local reading, pending computation, and completed matching/ranking states tied to actual requests/results. Animate returned states without pretending to stream Python internals or measure their durations. Identify fallback execution accurately.
9. Slide 18 displays one real episode title, season/number, short description, concise matching summary, two alternatives, Why This Episode?, Try Again and Surprise Me. Detailed actual scoring factors open in a dialog. Try Again returns to slide 11 with editable answers. Profile reset lives in settings. Surprise Me identifies JavaScript random discovery.
10. Retain the exact 5,000 ms mug animation and replay/manual controls, genuine Three.js couch drag/keyboard/slider/reset as an optional header activity, responsive canvas sizing and no-WebGL/file fallbacks.
11. Retain appearance settings in a compact optional dialog: palette, display font, visual mood, text size, reduced decorative motion and reset. System reduced motion applies to the mug.
12. All authored content, labels, comments and documentation are English. No paid services, API keys, copyrighted episode embeds or theme music.

## Technical requirements

- Extend the existing static browser project. Keep bundled Three.js and dependency-free Node serving.
- Actual Python execution remains local through `serve.cjs`, JSON lines and a persistent `python/episode_recommender.py --worker` process. `/api/recommend` and `/api/simulate` remain available.
- JavaScript fallback must be usable without Python and clearly labeled. Test ranking, factor and explanation parity.
- Keep existing research generator, JSON and offline bundle. Preserve source datasets and original assets.
- Use `script.js` for composition/navigation, `v06.js` for profile/research/result interactions, `lab-core.js` for retained fallback/figure metadata, and `v06.css` for redesigned layouts. Previous v0.5 UI modules remain unloaded historical files.
- Use no remote runtime dependencies. Backend remains loopback-only with existing origin, request-size and timeout protections. Preferences go only to the local backend and remain in the tab, not server storage.
- Update automated browser tests for 18 slides while retaining meaningful mug, couch, Python and navigation regressions. Capture every slide at desktop/mobile sizes and visually inspect the results.

## Acceptance evidence

Only executed checks are marked complete. Final evidence: 358 browser assertions, 7 Python tests, zero unexpected JavaScript errors and zero external network requests. Two expected context errors were confined to deliberate no-WebGL testing.

- [x] Retained Python regression suite: 7 tests passed for catalog, published means, deterministic/incomplete scoring, explanations/denominator, validation, synthetic backend support and PNG signatures.
- [x] Updated browser suite passes (358 assertions): exact 18-slide order/headlines/navigation; no user artwork DOM or requests; seven figures/readable enlargement/citations; saved/changed/reset/skipped answers; honest pending/completed matching; Python execution and fallback parity; correct final recommendation/actions; mug and optional PIVOT controls; settings; no unexpected JavaScript errors; responsive five-width layout and reduced motion.
- [x] Every primary slide visually reviewed at 1440×1000 and 390×844; selected screenshots and full contact sheets included in documentation.
- [x] Original artwork and supplied research PNG hashes verified unchanged.

Visual evidence: `screenshots/v06/visual-review.md`, six full-deck contact sheets, 36 individual slide captures, three optional-detail captures and `v06-results.json`. A final screenshot run completed with no JavaScript errors.

Historical v0.6 release procedure (completed): after implementation and checks, create exactly one new local commit named `feat: v0.6 research-first presentation redesign`, preserve all previous commits and do not push. Report the resulting commit hash separately.

## Research and ethical boundaries

Paper A: Derrick, Gabriel, & Hugenberg (2009), *Journal of Experimental Social Psychology, 45*, 352–362. DOI 10.1016/j.jesp.2008.12.003.

Paper B: Derrick (2013; online 2012), *Social Psychological and Personality Science, 4*(3), 299–307. DOI 10.1177/1948550612454889.

Neither paper specifically tested Friends as an anxiety intervention. Distinguish favorite-TV/social-surrogacy research from the project's Friends examples and broader interpretations of predictability, cognitive ease and nostalgia. Distinguish significant interactions from the marginal Paper A rejection result, exploratory supplementary analyses and observational diary evidence. Non-significance is not equivalence. No values are estimated from figure bar heights.

The research chart shows undergraduate descriptive self-reports, not clinical anxiety scores. Episode tags are editorial and the match percentage is an algorithmic fit, not a medical probability. Recommendations are entertainment-oriented, not medical advice. No cortisol, neuroscience or treatment claim is permitted. Existing illustrative simulator code/data remain available for compatibility but are not placed in the research narrative.

No formal user study, clinical validation or universal claim about episode comfort is part of acceptance. Vertical scrolling is acceptable on small screens, enlarged figures and accessibility text settings; clipping and horizontal overflow are not.
