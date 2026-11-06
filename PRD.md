# Friends Comfort Lab - v1.0 FINAL Product Requirements

## Vision and audience

FriendsAnxietyStudio is an 17-slide HTML educational presentation for a university professor, AI evaluation agent and classroom viewers. It uses Friends as an accessible cultural example for a carefully qualified research narrative, then offers an optional entertainment recommendation. It is not a clinical assessment or treatment tool.

Educational goals: explain familiarity and belonging research; distinguish experiments from diary associations and interpretation; demonstrate meaningful HTML/CSS, JavaScript, Python and animated Three.js; document the user's creative direction and iterative AI-assisted development honestly.

## Final scope

| Slide | Scope and behavior |
|---|---|
| 1 | Welcome: continuously rotating genuine 3D mug, manual drag, pause when hidden |
| 2 | Why rewatch: published descriptive means preview |
| 3 | Psychology: four original illustrated reveal cards with dynamic takeaway |
| 4 | Missing Punchline: original Joey restaurant adaptation, timed setup, prediction freeze, unscored reveal, explicit purpose and Replay |
| 5 | PIVOT: original 3D stairwell, move/pivot/reset, isolated entertainment score |
| 6 | Study 1 chart; optional concise belonging/mood/rejection evidence with four original figures and Python animations |
| 7 | Self-Control Recovery Lab: three Python-authored research modules |
| 8 | VHS Rewind: nostalgia/ease interpretation |
| 9 | Episode Lobster: transition and CTA to Slide 10 |
| 10 | Optional mood |
| 11 | Optional self-reported stress, 0-10 |
| 12 | Six character cards |
| 13 | Six integrated iconic quote cards |
| 14 | Desired comfort experience |
| 15 | Familiarity and nostalgia |
| 16 | Actual matching process and reveal |
| 17 | Episode, alternatives, score factors, surprise, reset and home |

The six questionnaire steps collect seven visible factors because familiarity and nostalgia share Slide 15. Missing answers remain valid. The earlier 12-slide limit is superseded. The lecturer's approximately ten-slide suggestion was reviewed; all 17 have a defined role and no slide was removed without approval. Slide 2 introduces the data that Slide 6 examines in detail.

## Functional requirements

- Original cards use native buttons, reveal one concept at a time, explain a Friends example and identify evidence versus broader interpretation.
- Slide 4 progresses through a 5.5-second setup, a freeze that waits indefinitely for a prediction, a 650ms comic pause, an expressive reaction and the educational explanation 1.8 seconds later. All three choices lead to the same unscored payoff; no answer/profile data is recorded. Typical reading/choice pace is about 15-20 seconds. Original generated bitmap poses replace the geometric comic, and the adaptation/source limitation is visible. Replay clears all reveal state. Reduced motion skips decorative timing but retains prediction before reveal. Leaving the slide cancels transient timers.
- The former Slide 7 and social mini-story are absent. Unique Paper A evidence remains in an optional disclosure on Slide 6, including original figures and Python playback.
- Current Slide 7 switches Puzzle Performance, Negative Mood and Daily Diary, each with a distinct Python-rendered sequence and source-specific explanation.
- Python players support Play/Pause/Replay, frame progress, enlargement, static poster fallback, hidden-slide/document pause, cancellation on module change and reduced-motion poster mode. No duplicate frame loops accumulate.
- Seven original figures remain unchanged and reachable through View Original Figure; reported-test details and accessible tables remain expandable.
- The mug remains continuous on the opening slide; PIVOT preserves stages, penalties/reward cap, actual couch movement/rotation, reset and WebGL recovery. Game score never enters recommendations.
- Profile state uses the existing single architecture and session persistence. Normal navigation, home and refresh preserve the current attempt. Try Again clears all answers, UI selections, stored attempt, cached ranking and pending results, resets controls and returns to Slide 10. Late prior responses must not restore cleared state.
- Matching remains deterministic and explainable from a 22-real-episode catalog, with identical quote/familiarity mappings in Python and fallback. Editorial scores do not imply clinical validity.
- Centered branding, hidden-on-idle touch/keyboard-accessible dock, arrows, guarded Enter, hashes, focus handling, themes and responsive layouts remain.

## Technical responsibilities

Python validates `data/research_source.json`, exports research JSON/browser data, and authors animation pixels in `python/generate_animations.py` using pinned Pillow 10.4.0. Each of eight finite animations has a poster, atlas and GIF; manifest hashes support provenance and reproducibility. Browser JavaScript selects exported frames and controls interaction, rather than redrawing Python scenes. The local Node server executes the Python recommender worker; static Pages uses pre-generated evidence and JavaScript fallback scoring, never falsely claiming live Python.

Three.js r170 and other runtime assets are bundled. No paid dependencies, API keys, footage or live LLM calls. No unnecessary rendering on hidden slides. Optional synthetic historical simulator data is kept separate from published research.

## Research and ethical requirements

Preserve exact published Study 1 means and their 1-7 scale context. Do not estimate means from figure bars. Qualitative comparisons retain significant, marginal and nonsignificant distinctions; p-values are not effect sizes and nonsignificance is not equivalence. Distinguish experimental recall/writing tasks from actually watching Friends; distinguish observational diary results from causal effects. No treatment, cortisol, neurological-energy measurement or comfort guarantee claims. Original fictional scenes and broader nostalgia/predictability/ease interpretations are explicitly qualified. Source citations, original figures and important study limitations remain accessible.

## Nonfunctional requirements

Desktop and mobile layouts may scroll vertically at small sizes or large fonts but must avoid clipped controls and horizontal overflow. Native controls, visible focus, keyboard playback, captions, source tables and semantic dialogs provide accessible alternatives. Reduced-motion settings retain content with static posters. Offline exported assets and clean static HTTP hosting must work without a Python API. No secrets, unrelated archives or rewritten history in release commits. No push, release tag, repository access change or Moodle action without approval.

## Acceptance evidence

- [x] Exactly 17 slides and navigation verified by the current browser suite.
- [x] Four illustrated cards preserved; new Joey setup/prediction/reveal/replay verified by dedicated browser tests.
- [x] Eight retained genuinely Python-rendered sequences (seven active research sequences; social scene retired) and byte-for-byte regeneration verified by Python tests.
- [x] Three lab modules, playback/pause/replay, missing-atlas fallback, module cancellation and reduced motion verified.
- [x] Seven source figures and retained chart/profile/recommendation/reset functionality verified by browser tests.
- [x] Clean static HTTP hosting and recommendation fallback verified without an API.
- [x] Genuine Three.js and preserved game rules/context recovery verified.
- [x] All 17 desktop/mobile slides captured and visually reviewed; corrections and retests recorded in the visual report.
- [x] Research source/design audit recorded in `docs/RESEARCH_INTEGRITY_AUDIT.md`.
- [x] Final v1.0 GitHub Pages deployment: user-authorized push and live browser/asset verification completed; see `docs/FINAL_PUBLICATION.md`.
- [ ] Physical-device and formal assistive-technology testing: not performed; not a claimed release certification.
- [ ] External human academic review and Moodle submission: outside completed local repository work.

Exact executed suite results, remaining limitations and compliance statuses are recorded in the README, visual review, Red Team review and final compliance report. Passing code generation alone is not acceptance.

## Approved final content decision

The student found the original Slide 4 and former Slide 7 visually weak and lacking a meaningful payoff, selected a recognizable Joey food gag after considering alternatives, required a clear educational purpose, and explicitly approved removing the repetitive slide. This is a summarized decision, not fabricated verbatim dialogue. See `llm_logs/v1-content-refinement.md` and the current `screenshots/v10-final/visual-review.md`. Historical 18-slide reports remain clearly identified as earlier evidence.

## Final questionnaire experience enhancement

Scope remains 17 slides, with exactly the existing six optional profile steps on Slides 10-15. Each step has a distinct visual/interaction pattern: responsive mood-symbol grid; retro semicircular Stress-O-Meter with a native 0-10 range input; coordinated painted portrait gallery with selected personality description; framed Quote Wall with selected character/theme; illustrated Central Perk menu with immediate order feedback; TV remote and separate nostalgia selector. All six characters and all choices remain available; selecting an answer never navigates automatically.

The authoritative state remains in `v06.js`. Existing values, weights, six quote mappings, independent familiarity/nostalgia fields, session key, progress, skip/clear/change/revisit and Try Again behavior must remain unchanged. The stress midpoint is a preview, not an automatically submitted default. New rendering observes `friends:profilechange`; it does not introduce another answer store or modify engine logic. Individual clear buttons reuse the existing handler.

Portraits are actual built-in-tool generated artwork, optimized to 400x500 WebP using existing Pillow. The Rachel card is an original fashion-character interpretation after image-tool rejection, not a claimed actor likeness. The other portraits and overall palette follow the Slide 4 painted reference. The six files must load, be distinct, have clear focus/selected states, and reveal the correct descriptions. Exact actor fidelity is a documented limitation for Rachel. No footage, copied screenshots or new paid service/API key is required.

Acceptance evidence for mouse/keyboard/touch inputs, 0-10 gauge mapping, all values and descriptions, independent fields/clearing, persistence, no default answer, unchanged pre-upgrade rankings, full reset, desktop/mobile/compact layouts and reduced motion is recorded in `screenshots/profile-upgrade/visual-review.md`. Do not infer completion from older 17-slide test counts. No push, release, deployment or repository-setting change is included.
