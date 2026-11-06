# Friends Comfort Lab - v1.0 FINAL Product Requirements

## Vision and audience

FriendsAnxietyStudio is an 18-slide HTML educational presentation for a university professor, AI evaluation agent and classroom viewers. It uses Friends as an accessible cultural example for a carefully qualified research narrative, then offers an optional entertainment recommendation. It is not a clinical assessment or treatment tool.

Educational goals: explain familiarity and belonging research; distinguish experiments from diary associations and interpretation; demonstrate meaningful HTML/CSS, JavaScript, Python and animated Three.js; document the user's creative direction and iterative AI-assisted development honestly.

## Final scope

| Slide | Scope and behavior |
|---|---|
| 1 | Welcome: continuously rotating genuine 3D mug, manual drag, pause when hidden |
| 2 | Why rewatch: published descriptive means preview |
| 3 | Psychology: four original illustrated reveal cards with dynamic takeaway |
| 4 | The One Where You Know What Happens Next: original three-scene comic, step/select/replay |
| 5 | PIVOT: original 3D stairwell, move/pivot/reset, isolated entertainment score |
| 6 | What the Research Shows: switchable Study 1 chart, tooltips and accessible data |
| 7 | The One Where You Feel Left Out: Python social animation, gentle choice, actual study evidence |
| 8 | The Self-Control Recovery Lab: three Python-authored modules, findings/design/limits |
| 9 | Rewind: VHS/TV nostalgia and cognitive-ease illustration, replay |
| 10 | Episode Lobster: sequential explanation and CTA to Slide 11 |
| 11 | Optional mood selection |
| 12 | Optional 0-10 stress self-report without developer hints |
| 13 | Six favorite-character cards |
| 14 | Six iconic quotes, all mapped to scoring |
| 15 | Desired comfort experience |
| 16 | Three familiarity and three nostalgia options, preserved internal mappings |
| 17 | Actual recommendation process states and prominent reveal |
| 18 | Main real episode, two alternatives, actual factors, surprise, reset and home |

The six questionnaire steps collect seven visible factors because familiarity and nostalgia share Slide 16. Missing answers remain valid. The earlier 12-slide limit is superseded. The lecturer's approximately ten-slide suggestion was reviewed; all 18 have a defined role and no slide was removed without approval. Slide 2 introduces the data that Slide 6 examines in detail.

## Functional requirements

- Original cards use native buttons, reveal one concept at a time, explain a Friends example and identify evidence versus broader interpretation.
- Comic scenes can advance, be selected directly or replayed; all artwork is original code-native illustration. It is not an experiment.
- Slide 7 has three navigable stages. Viewing choice changes only the fictional narrative response, never profile scoring or a scientific conclusion.
- Slide 8 switches Puzzle Performance, Negative Mood and Daily Diary, each with a distinct Python-rendered sequence and source-specific explanation.
- Python players support Play/Pause/Replay, frame progress, enlargement, static poster fallback, hidden-slide/document pause, cancellation on module change and reduced-motion poster mode. No duplicate frame loops accumulate.
- Seven original figures remain unchanged and reachable through View Original Figure; reported-test details and accessible tables remain expandable.
- The mug remains continuous on the opening slide; PIVOT preserves stages, penalties/reward cap, actual couch movement/rotation, reset and WebGL recovery. Game score never enters recommendations.
- Profile state uses the existing single architecture and session persistence. Normal navigation, home and refresh preserve the current attempt. Try Again clears all answers, UI selections, stored attempt, cached ranking and pending results, resets controls and returns to Slide 11. Late prior responses must not restore cleared state.
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

- [x] Exactly 18 slides and navigation verified by the current browser suite.
- [x] Four illustrated cards, comic progression/replay and branching research story verified by focused browser tests.
- [x] Eight genuinely Python-rendered sequences and byte-for-byte regeneration verified by Python tests.
- [x] Three lab modules, playback/pause/replay, missing-atlas fallback, module cancellation and reduced motion verified.
- [x] Seven source figures and retained chart/profile/recommendation/reset functionality verified by browser tests.
- [x] Clean static HTTP hosting and recommendation fallback verified without an API.
- [x] Genuine Three.js and preserved game rules/context recovery verified.
- [x] All 18 desktop/mobile slides captured and visually reviewed; corrections and retests recorded in the visual report.
- [x] Research source/design audit recorded in `docs/RESEARCH_INTEGRITY_AUDIT.md`.
- [ ] Final v1.0 GitHub Pages deployment: pending explicit push approval and post-deployment verification.
- [ ] Physical-device and formal assistive-technology testing: not performed; not a claimed release certification.
- [ ] External human academic review and Moodle submission: outside completed local repository work.

Exact executed suite results, remaining limitations and compliance statuses are recorded in the README, visual review, Red Team review and final compliance report. Passing code generation alone is not acceptance.
