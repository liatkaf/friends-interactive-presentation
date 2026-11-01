# Product Requirements Document — v0.4

## Objective

Deliver an English browser presentation with **exactly 12 fully functional slides** explaining possible psychological mechanisms behind comfort viewing through Friends-inspired examples. This structure supersedes earlier 10-slide or optional-12-slide plans. Preserve the established Classic Friends styling and working five-second Three.js mug.

## Audience and design

Educational presentation for students and an instructor. Use purple (#674A83), yellow (#F4C542), orange (#D98748), cream (#FFF4DE), original portraits, a purple door, coffee imagery, and an orange couch. Support desktop and mobile, keyboard access, readable focus states, reduced motion, and static WebGL fallbacks. All content and documentation must be in English.

## Required slide plan

| # | Slide | Required behavior |
|---|---|---|
| 1 | Welcome to Central Perk | Preserve the existing five-second animated Three.js coffee mug, replay, manual exploration, and fallbacks |
| 2 | Modern Anxiety & Mental Overload | Interactive imagined stress meter with visible numeric and descriptive feedback |
| 3 | Why Do We Rewatch Friends? | Comfort viewing explanation and Python-generated illustrative chart with interactive explanations |
| 4 | The Science of Predictability | Mechanism 1 with interactive reveal and limitations |
| 5 | PIVOT! The 3D Experience | Interactive rotating Three.js couch, drag, keyboard, slider, reset and illustration fallback |
| 6 | Friends Who Feel Like Family | Mechanism 2: parasocial relationships, six character reveal cards |
| 7 | Giving Your Brain a Break | Mechanism 3: low cognitive load, interactive comparison with answer reveals |
| 8 | The Nostalgia Effect | Mechanism 4 with interactive timeline and optional temporary reflection |
| 9 | Iconic Quotes & Emotional Triggers | Interactive quote cards, attribution and playful theme changes |
| 10 | The Anxiety Simulator | Python-generated illustrative curves, JavaScript visualization, working controls, accessible table and explicit nonclinical labeling |
| 11 | Customize Your Comfort Zone | Working accent color, font, mood and reset controls applied throughout the deck |
| 12 | I'll Be There for You | Conclusions, scientific limitations, accessible reference links and restart |

## Functional acceptance criteria

- Exactly 12 sections and 12 clickable navigation indicators, in the prescribed order.
- Previous/Next, keyboard navigation, Home/End, hash deep links and refresh all work; only one slide is visible.
- Counter, page title and progress reflect the current slide; boundary controls disable appropriately.
- Every interaction in the table works, with meaningful keyboard support and visible feedback.
- Slide 1 retains the exact 5,000 ms clamped spin, replay lock, reduced-motion behavior and manual controls.
- Slide 5 uses genuine locally bundled Three.js geometry, with no network model dependency.
- Python deterministically generates JSON, a browser-compatible data bundle, and an illustrative SVG; browser charts consume its output.
- Settings apply across slides and reset restores the classic defaults, including quote mood overrides.
- Forms and scene controls do not accidentally trigger slide navigation.
- Navigation remains usable with missing WebGL, direct file access, reduced motion and narrow windows.
- Run the browser regression suite successfully before creating the local v0.4 Git commit. No GitHub push is authorized for this milestone.

## Evidence and data requirements

All numeric chart values are synthetic arbitrary units, explicitly identified as nonclinical in context. They are not clinical stress scores, cortisol levels, survey results, measured outcomes, predictions or proven treatment effects. The simulator ranking is invented. The stress meter is an imagined reflection prompt with no data collection.

Use cautious language for proposed predictability and low-load mechanisms. Distinguish nonreciprocal parasocial bonds from reciprocal friendships. Explain individual differences and possible bittersweet nostalgia. Include accessible links to the APA definition, University at Buffalo research coverage, and a University of Southampton research record on nostalgia and self-continuity. No claim that watching Friends treats anxiety.

## Architecture and scope

HTML/CSS and vanilla JavaScript; local Three.js r170; standard-library Python preprocessing; dependency-free Node static server and Edge/Chromium tests. Data is pre-generated for static hosting; no server-side Python or runtime external services. No participant information, persistent settings, telemetry or clinical assessment. Original illustrations and short attributed quotes; retain bundled Three.js license and provenance.

The prescribed comfort-viewing structure replaces obsolete quizzes, production-fact previews and live character-description editing. Existing functional navigation, mug, responsive composition and original artwork are retained.

## Verification and delivery

The browser suite covers animation boundaries, actual WebGL drawing, interactions, required titles and exact count, navigation/counter/progress, deep links, input isolation, responsive widths, reduced motion and fallback operation. Capture real browser screenshots for visual review. README must accurately describe run commands, Python regeneration, all 12 slides, synthetic data, controls, accessibility, scientific limitations, and local-only Git delivery. Commit only after passing verification; do not push.
