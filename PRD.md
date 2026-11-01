# FriendsAnxietyStudio — Product Requirements Document v0.5

## Audience and objectives

Target audience: university course professor and AI evaluation agent. Demonstrate meaningful Python, JavaScript, Three.js, interactive charts, animation and AI-assisted development in an engaging research-informed presentation. End with an explainable recommendation for a real Friends episode based on optional personal viewing preferences.

Work within v0.4, retain exactly 12 primary slides and preserve its working activities, visual identity, navigation and Three.js interactions. No paid services, keys, video embeds or theme music. All authored text, labels, comments and documentation are English.

## User stories

- As a viewer, I can answer short questions throughout the presentation, skip any question, change my answers, and keep them while navigating.
- As a research reader, I can inspect all seven supplied figures, enlarge them, read conditions/axes/citations and distinguish strong from tentative findings.
- As an instructor, I can see actual Python execution, identify when fallback JavaScript runs, and reproduce the analytics from published values.
- As a viewer, I receive one episode and two alternatives, inspect the exact scoring factors, revise/reset my profile or discover a random real episode.
- As a keyboard/mobile viewer, I can navigate, operate controls, close the evidence dialog, use larger text and reduce decorative motion.

## Required slide plan

| # | Primary slide | Implemented interactions |
|---|---|---|
| 1 | Welcome to Central Perk | Existing 5,000 ms Three.js mug, replay/drag/keyboard and original door; both original artworks |
| 2 | Modern Anxiety & Mental Overload | Retained imagined overload activity; separate optional self-reported stress 0–10 with clear answer |
| 3 | Why Do We Rewatch Friends? | Two published-means charts with metric toggle, hover/focus/click values and scale/source note; familiarity question; original cafe artwork; explorer |
| 4 | The Science of Predictability | Retained reveal; predictable/surprising preference; explorer |
| 5 | PIVOT! The 3D Experience | Existing Three.js couch with drag/keyboard/slider/reset and angle feedback |
| 6 | Friends Who Feel Like Family | Six retained character cards, favorite selection/feedback, animated affinity indicator, original couch artwork; explorer |
| 7 | Giving Your Brain a Break | Retained familiar/new reading activity; desired experience question; explorer |
| 8 | The Nostalgia Effect | Retained timeline/reflection; nostalgia preference and limits; explorer |
| 9 | Iconic Quotes & Emotional Triggers | Retained reveal cards/theme cues; synchronized quote selection |
| 10 | The Anxiety Simulator | Retained synthetic scenario; mood choice; extra illustrative comfort index controlled by stress, familiarity, nostalgia and minutes, executed in Python with labeled fallback |
| 11 | Customize Your Comfort Zone | Retained palette/font/mood/reset; text size and decorative-motion controls; profile overview and original cafe artwork |
| 12 | The One With Your Perfect Episode | Episode/synopsis, two alternatives, explanations and animated factor bars; Why This Episode?, Try Again, Surprise Me, editable/reset profile, sources/references/explorer, original couch artwork |

## Functional and technical requirements

- Preserve 12 existing `.slide` sections, 12 indicators, active-only visibility, Previous/Next, arrow keys, Home/End and hash navigation. New panels and a native dialog do not count as slides.
- Collect eight optional profile fields. Retain choices in tab sessionStorage; synchronize duplicate controls. Never treat untouched stress slider defaults as answers. No external transmission.
- Maintain at least 20 real catalog records with sources, official title, numbering, spoiler-light description, featured characters, moments/quotes, editorial comedy/warmth/nostalgia ratings and mood/story/familiarity tags.
- Use transparent deterministic Python ranking and return three episodes, exact points/maxima and explanations. Normalize over answered factors. Use chronological ties; empty profile is 0%, not invented certainty.
- Execute Python through local Node subprocess APIs. Provide explicit JavaScript mode on absent/failed Python, API timeout or direct file access. Compare engines in tests.
- Include all seven original research PNGs unchanged. Native dialog supplies selector/thumbnails, enlargement, alt text, paper/study/figure identity, accessible explanations and DOI citations.
- Generate research JSON through Python using only the four supplied published descriptive mean pairs. Keep research, editorial classifications and synthetic simulations clearly distinguished.
- Preserve local Three.js, the 5,000 ms coffee timeline and PIVOT interaction. Add CSS animations without network libraries. Respect system reduced motion; additional UI toggle affects decorative CSS motion.
- Keep original artwork proportions with meaningful alt text and attribution. Retain responsive slide scrolling and keyboard focus styles.
- Update README with setup, reproducible commands, research/data/art attribution, Python mode, scoring, AI use, screenshots and actual test results. Commit once with the requested message and do not push.

## Acceptance evidence

Requirements are marked complete only with implementation and executed checks. Final run: 263 browser checks passed, 7 Python tests passed, zero unexpected JavaScript errors and zero external network requests.

- [x] Existing 12-slide regression behavior implemented and verified in the executed 227-check baseline suite, with final title expectation updated for v0.5.
- [x] Python scripts execute; seven Python unittest cases pass for published means, catalog, deterministic/partial scoring, explanations/denominator, validation, simulation and supplied PNG signatures.
- [x] Expanded browser acceptance run (263 passed): all artwork and research figures load, explorer works with focus restoration, Python API works, engines agree, choices survive navigation/reload, incomplete profile/reset/Why/Try Again/Surprise work, size/motion controls work, all responsive and Three.js regression checks pass with no unexpected JavaScript errors.
- [x] Selected final screenshots reviewed and included in README.
Release procedure: create the single requested local commit after these checks; do not push. The delivered commit hash is reported separately to avoid a self-referential hash in this file.

## Research and ethical limits

Paper A: Derrick, Gabriel, & Hugenberg (2009), Journal of Experimental Social Psychology, 45, 352–362, DOI 10.1016/j.jesp.2008.12.003. Paper B: Derrick (2013; online 2012), Social Psychological and Personality Science, 4(3), 299–307, DOI 10.1177/1948550612454889.

The studies concern favored television/familiar fictional worlds, not experiments on Friends viewers. Social surrogacy is supported in these studies; predictability/cognitive ease are broader interpretations; nostalgia is not directly tested by these two papers. The explorer labels the marginal rejection interaction and distinguishes experimental evidence from diary associations. No exact values are reconstructed from figure bar heights.

Neither the rating charts nor episode tags are clinical anxiety measures. Comfort index values are invented for interaction, explicitly labeled educational only and not a validated psychological or medical model. No cortisol, neuroscience or treatment claims. No health-effect probability is implied by algorithmic match percentages. Fictional relationships are one-sided; individual viewing experiences and memories differ.

No formal user study, clinical validation or universal episode comfort claim is part of acceptance. Source assets and previous commits must remain intact.
