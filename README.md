# Friends Comfort Lab - v1.0 FINAL

[Published presentation](https://liatkaf.github.io/friends-interactive-presentation/) - [Public repository](https://github.com/liatkaf/friends-interactive-presentation)

**Release status:** v1.0 FINAL is published on GitHub Pages and verified November 6, 2026: 17 slides, six painted portraits, research/3D assets and static questionnaire matching. See the [final publication report](docs/FINAL_PUBLICATION.md). Earlier local-only notes below describe historical review stages. No release tag or Moodle submission was created.

An original, research-first HTML presentation exploring why familiar television can feel comforting, followed by an optional six-step profile and an explainable recommendation from **22 real Friends episodes**. It has **17 primary slides**: nine research/story slides, six questionnaire slides and two recommendation slides. The student approved removing the previous social mini-story after review; the lecturer's approximately ten-slide suggestion remains flexible.

### A look inside

**Slide 01 — Welcome and the 3D coffee mug**

![Slide 01 of 17 — Welcome and the genuine 3D coffee mug](screenshots/readme-gallery/slide-01.webp)

**Slide 12 — The painted character gallery**

![Slide 12 of 17 — Painted character portraits with Monica selected](screenshots/readme-gallery/slide-12.webp)

**Slide 17 — Your personalized episode**

![Slide 17 of 17 — Personalized episode and two alternatives](screenshots/readme-gallery/slide-17.webp)

[Browse all 17 slides and 11 interactive states](#complete-final-presentation-gallery).

## Purpose and creative direction

Friends provides a recognizable cultural example through which to explain belonging, familiarity and comfort viewing. The user selected the topic and directed successive changes to the narrative, branding, research presentation, 3D game, questionnaire and reset behavior. These choices, rather than an invented personal biography, demonstrate personal involvement. Original code illustrations translate the user's coffee-shop, VHS, lobster and recognizable sitcom concepts into a coherent purple, yellow, cream and orange visual identity.

The featured papers did **not** test Friends as a clinical treatment. The presentation separates published evidence, broader psychological interpretations, fictional examples, editorial matching scores and educational simulations. It contains no episode footage or theme music.

## Start locally

Requirements: Node.js 18+ (22+ for browser QA), Python 3.8+, a modern browser; WebGL 2 is optional with fallbacks. No npm installation or API key is required.

```powershell
node serve.cjs
```

Open http://127.0.0.1:8000. The server prefers the project's `.venv` interpreter; otherwise it invokes `py -3` on Windows or `python3` elsewhere. `FRIENDS_PYTHON` overrides either choice. After migration, Python 3.11.9 and Pillow 10.4.0 are verified on D:. The review session uses http://127.0.0.1:8011.

For a clean static-host preview:

```powershell
python python/static_preview.py --port 8013 --bind 127.0.0.1
```

Open http://127.0.0.1:8013. Serve over HTTP; direct file opening is not the supported way to load Three.js modules.

## Final content refinement

- **Slide 3:** four original SVG concept reveals remain unchanged.
- **Slide 4 - The One With the Missing Punchline:** an original, polished restaurant illustration inspired by Joey's food gag in S10 E9, *The One with the Birth Mother*. Play the setup, freeze before his reaction, choose one of three predictions, then reveal the familiar catchphrase and the explicit educational takeaway. No score or right/wrong feedback. Replay clears the interaction; keyboard and reduced-motion modes preserve all content. Approximately 15-20 seconds at normal reading/choice pace, not a forced timed quiz.
- **Previous Slide 7 removed:** the weak social mini-story was removed with the student's approval. Exactly 17 primary slides remain, with contiguous IDs, counters, hashes and navigation. The four unique Paper A findings, Python animations, original figures and accessible tables now live in the optional **More evidence: belonging, mood & rejection** disclosure on Slide 6, avoiding a second introductory story.
- **Current Slide 7:** the three-module Self-Control Recovery Lab retains genuine Python-authored animations, source access, playback/replay and limitations.

The student reviewed the completed presentation, found the original Slide 4/7 animations visually weak and their stories lacking a meaningful payoff, considered alternatives, selected the recognizable Joey scene, explicitly requested an explanation of its educational purpose and approved removing repetition. This is a [summarized design decision](llm_logs/v1-content-refinement.md), not an invented conversation transcript.

Preserved: continuous genuine Three.js mug with drag and inactive-slide pause; centered branding and idle-hidden navigation; 3D PIVOT stairwell and isolated game scoring; Study 1 chart; VHS rewind (Slide 8); lobster transition (Slide 9); six character and six quote choices; familiarity/nostalgia mapping; deterministic matching and alternatives; theme controls; keyboard navigation; responsive layouts; all seven original research figures.

**Try Again clears the entire profile, persisted attempt, cached results and pending recommendation state, then returns to Slide 10. Back to Start and ordinary navigation preserve answers.** Enter advances only from noninteractive slide/background focus on Slides 1-16; native controls and dialogs keep normal keyboard behavior. The final recommendation is Slide 17. Use the bottom Navigation button on touch devices or Tab to reach the dock.

## Architecture: what actually runs

| Layer | Responsibility |
|---|---|
| HTML/CSS | Accessible presentation shell, visual identity, responsive cards, original scene composition |
| `script.js`, `v06.js` | Slide templates/navigation, existing single profile state, recommendations and research dialogs |
| `v10-art.js`, `v10.js`, `v10.css` | Original SVG cards, finite Python-frame playback and lab UI |
| `v08.js`, `v09.js` | Research chart, qualitative evidence access, navigation dock, rewind and lobster interactions |
| `joey.js`, `joey.css`, `assets/joey/restaurant-storyboard.png` | Original generated restaurant artwork, progressive setup/prediction/reaction, unscored payoff and replay |
| `mug.js`, `couch.js`, bundled Three.js r170 | Genuine 3D coffee and stairwell; no remote CDN dependency |
| `python/research_analytics.py` | Validate documented means and seven figure records; export research JSON |
| `python/generate_animations.py` | Render every animation pixel with Pillow; export posters, sprite atlases and GIF previews |
| `python/episode_recommender.py` | Actual persistent local Python worker, deterministic scoring through `/api/recommend` |
| `lab-core.js` | Equivalent JavaScript scoring fallback for static hosting or Python failure |

On GitHub Pages there is **no live Python runtime**. Python-generated data/assets still work, with JavaScript controlling frame playback and fallback matching. Locally the included server actually executes Python for matching. Engine diagnostics stay in the console and `FriendsLab.diagnostics`, outside ordinary user status text. No user profile is stored server-side or sent to an external AI service.

### Reproduce the Python animation pipeline

**Verified evidence - validated JSON - Python/Pillow frames - exported assets - JavaScript playback.**

```powershell
py -3 -m venv .venv
.venv/Scripts/python.exe -m pip install -r python/requirements-animation.txt
.venv/Scripts/python.exe python/research_analytics.py
.venv/Scripts/python.exe python/build_catalog.py
.venv/Scripts/python.exe python/generate_animations.py
```

On macOS/Linux use `python3` and `.venv/bin/python`. Pillow 10.4.0 is pinned; the generator uses its bundled default scalable font. A clean virtual environment avoids the broken system Pillow DLL encountered during this build. Dependency download needs internet, but regeneration and presentation playback do not. pandas/Matplotlib are unnecessary for categorical evidence and original frame artwork; Pillow is the actual authoring library.

Inputs: `data/research_source.json` (citations, verified means, study designs and categorical findings). Outputs: `data/research_analytics.json`, `data/v05-data.js`, `data/python_animations.json`, `data/python_animations.js`, and `assets/generated/`. The animation manifest records source/code/asset SHA-256 hashes. The reproducible archive contains eight sequences, seven of which remain accessible as research animations. The retired social-scene export is retained for historical reproducibility, not displayed. Each has 16 frames, a 960x400 poster, a PNG frame atlas and a finite GIF preview: **24 image assets**, about 3.9 MB total. `--output <directory>` supports isolated generation. JavaScript does not redraw or invent the Python scenes; it displays the exported frames.

Historical `python/generate_data.py` produces explicitly synthetic educational illustrations, not published research measurements and not the data source for Slides 6-8. Do not confuse that retained artifact with the verified pipeline.

## Real screenshots and Python previews

### Complete final presentation gallery

**17 slides · 11 additional interaction screenshots · current v1.0 FINAL.** All images are real Microsoft Edge captures of the final presentation at 1440 × 1000, captured November 6, 2026 after publication. Slide IDs and order were checked during capture. Open a section below; click an image to inspect its full resolution.

The questionnaire uses an explicitly selected demonstration profile (Happy, stress 5, Monica, “I know!”, Warmth, rewatcher, high nostalgia). These are example answers, not defaults. Additional states show deliberate changes. Screenshots are optimized WebP at the original dimensions; they are not mockups or reconstructed slides.

<details>
<summary>Welcome, comfort psychology and play — Slides 1–5</summary>

#### Slide 01 — Welcome to the Friends Comfort Lab

![Slide 01 of 17 — Welcome to the Friends Comfort Lab](screenshots/readme-gallery/slide-01.webp)

#### Slide 02 — Why Do We Rewatch Friends?

![Slide 02 of 17 — Why Do We Rewatch Friends?](screenshots/readme-gallery/slide-02.webp)

#### Slide 03 — The Psychology of Comfort TV

![Slide 03 of 17 — The Psychology of Comfort TV](screenshots/readme-gallery/slide-03.webp)

#### Slide 04 — The One With the Missing Punchline

![Slide 04 of 17 — The One With the Missing Punchline](screenshots/readme-gallery/slide-04.webp)

#### Slide 05 — PIVOT! Concentration & Spatial Focus

![Slide 05 of 17 — PIVOT! Concentration & Spatial Focus](screenshots/readme-gallery/slide-05.webp)

</details>

<details>
<summary>Research, familiarity and the journey — Slides 6–9</summary>

#### Slide 06 — What the Research Shows

![Slide 06 of 17 — What the Research Shows](screenshots/readme-gallery/slide-06.webp)

#### Slide 07 — The Self-Control Recovery Lab

![Slide 07 of 17 — The Self-Control Recovery Lab](screenshots/readme-gallery/slide-07.webp)

#### Slide 08 — The One With The Rewind

![Slide 08 of 17 — The One With The Rewind](screenshots/readme-gallery/slide-08.webp)

#### Slide 09 — Finding Your Episode Lobster!

![Slide 09 of 17 — Finding Your Episode Lobster!](screenshots/readme-gallery/slide-09.webp)

</details>

<details>
<summary>Your personal comfort profile — Slides 10–15</summary>

#### Slide 10 — How Are You Feeling?

![Slide 10 of 17 — How Are You Feeling?](screenshots/readme-gallery/slide-10.webp)

#### Slide 11 — What's Your Stress Level?

![Slide 11 of 17 — What's Your Stress Level?](screenshots/readme-gallery/slide-11.webp)

#### Slide 12 — Who's Your Favorite Friend?

![Slide 12 of 17 — Who's Your Favorite Friend?](screenshots/readme-gallery/slide-12.webp)

#### Slide 13 — Which Quote Speaks to You?

![Slide 13 of 17 — Which Quote Speaks to You?](screenshots/readme-gallery/slide-13.webp)

#### Slide 14 — What Kind of Comfort Do You Need?

![Slide 14 of 17 — What Kind of Comfort Do You Need?](screenshots/readme-gallery/slide-14.webp)

#### Slide 15 — How Familiar Is Friends to You?

![Slide 15 of 17 — How Familiar Is Friends to You?](screenshots/readme-gallery/slide-15.webp)

</details>

<details>
<summary>Matching and recommendations — Slides 16–17</summary>

#### Slide 16 — Finding Your Perfect Match

![Slide 16 of 17 — Finding Your Perfect Match](screenshots/readme-gallery/slide-16.webp)

#### Slide 17 — The One With Your Perfect Episode

![Slide 17 of 17 — The One With Your Perfect Episode](screenshots/readme-gallery/slide-17.webp)

</details>

### Interactions in action

These still images capture real UI states; use the [live presentation](https://liatkaf.github.io/friends-interactive-presentation/) to explore motion and interaction.

<details>
<summary>3D mug, Joey prediction and PIVOT game</summary>

#### Slide 1 — Rotating the genuine 3D coffee mug

The mug responds to a real pointer drag.

![Slide 1 — Rotating the genuine 3D coffee mug](screenshots/readme-gallery/mug-drag.webp)

#### Slide 4 — Freeze and predict

The scene pauses for one of three optional predictions.

![Slide 4 — Freeze and predict](screenshots/readme-gallery/joey-prediction.webp)

#### Slide 4 — Reaction and educational takeaway

The familiar payoff reveals why knowing the ending can still be enjoyable.

![Slide 4 — Reaction and educational takeaway](screenshots/readme-gallery/joey-payoff.webp)

#### Slide 5 — PIVOT challenge completed

Move, turn at the corner and reach the landing; game points stay separate from the profile.

![Slide 5 — PIVOT challenge completed](screenshots/readme-gallery/pivot-success.webp)

</details>

<details>
<summary>Python research animation, questionnaire and portraits</summary>

#### Slide 7 — Python-generated research animation

A real exported animation frame, paused during playback; the adjacent study design and limitations remain visible.

![Slide 7 — Python-generated research animation](screenshots/readme-gallery/research-animation.webp)

#### Slide 11 — Stress-O-Meter selection

An explicitly selected 8/10 updates the needle, value and caption; it is not a clinical score.

![Slide 11 — Stress-O-Meter selection](screenshots/readme-gallery/stress-selected.webp)

#### Slide 12 — Painted portrait selection

Selecting Joey highlights the portrait and reveals his description.

![Slide 12 — Painted portrait selection](screenshots/readme-gallery/portrait-selected.webp)

#### Slide 14 — Comfort menu selection

Choosing Friendship produces immediate order feedback.

![Slide 14 — Comfort menu selection](screenshots/readme-gallery/comfort-order.webp)

</details>

<details>
<summary>Personalized results, score explanation and discovery</summary>

#### Slide 17 — Updated personalized recommendations

The changed illustrative profile produces a new ranking and two alternatives.

![Slide 17 — Updated personalized recommendations](screenshots/readme-gallery/personalized-result.webp)

#### Slide 17 — Why this episode?

The dialog explains actual factor contributions and the algorithmic match percentage.

![Slide 17 — Why this episode?](screenshots/readme-gallery/score-details.webp)

#### Slide 17 — Surprise Me

A different catalog episode appears after the real Surprise Me interaction.

![Slide 17 — Surprise Me](screenshots/readme-gallery/surprise-result.webp)

</details>

### Python animation preview

This finite GIF is an actual Python-rendered asset played inside the research lab, not a screenshot.

![Python-rendered puzzle module](assets/generated/evidence-4-preview.gif)

[Current 17-slide visual review](screenshots/v10-final/visual-review.md) and [published final verification](docs/FINAL_PUBLICATION.md) retain the functional evidence. Earlier screenshot folders remain historical records; the gallery above uses only fresh captures of the final 17-slide presentation.

## The 17-slide story

| # | Headline |
|---|---|
| 1 | Welcome to the Friends Comfort Lab |
| 2 | Why Do We Rewatch Friends? |
| 3 | The Psychology of Comfort TV |
| 4 | The One With the Missing Punchline |
| 5 | PIVOT! Concentration & Spatial Focus |
| 6 | What the Research Shows (optional belonging evidence) |
| 7 | The Self-Control Recovery Lab |
| 8 | The One With The Rewind |
| 9 | Finding Your Episode Lobster! |
| 10 | How Are You Feeling? |
| 11 | What's Your Stress Level? |
| 12 | Who's Your Favorite Friend? |
| 13 | Which Quote Speaks to You? |
| 14 | What Kind of Comfort Do You Need? |
| 15 | How Familiar Is Friends to You? |
| 16 | Finding Your Perfect Match |
| 17 | The One With Your Perfect Episode |

Slide 2 previews the descriptive data unpacked on Slide 6. Unique belongingness findings remain optional on Slide 6. The student explicitly approved the removal of the former Slide 7; remaining slides retain their order and functionality.

## Recommendation and data provenance

The catalog contains 22 real episodes. Titles, season/episode numbers and moment associations retain the prior release's documented verification. Mood/warmth/comedy/nostalgia/predictability tags are **editorial**, not measured psychological properties. Six quotes use `data/quotes.json` in both engines. Weights: mood 18, self-reported stress 10, character 18, quote 18, nostalgia 10, familiarity 8, predictability 8, experience 10. Only answered factors contribute to the available denominator; ties resolve by season/episode. The result includes actual contributing factors and two alternatives. Missing answers are allowed; match percentages are algorithmic, not scientific probabilities or prescriptions.

## Research references and boundaries

1. Derrick, J. L., Gabriel, S., & Hugenberg, K. (2009). Social surrogacy: How favored television programs provide the experience of belonging. *Journal of Experimental Social Psychology, 45*, 352-362. https://doi.org/10.1016/j.jesp.2008.12.003
2. Derrick, J. L. (2013). Energized by Television: Familiar Fictional Worlds Restore Self-Control. *Social Psychological and Personality Science, 4*(3), 299-307. https://doi.org/10.1177/1948550612454889 (first online 2012).

[Research integrity audit](docs/RESEARCH_INTEGRITY_AUDIT.md) identifies sources, design, claims and limits. Study 1 uses published 1-7 descriptive means, not clinical anxiety scores. Other animations summarize verified significant, marginal or nonsignificant tests without estimating group means from scans. Non-significance does not establish equivalence, p-values are not effect magnitudes, diary associations are not causal effects, and no physical cognitive-energy units were measured. The papers do not prove Friends treats anxiety or lowers cortisol. Predictability, cognitive ease and nostalgia examples are broader interpretations. All seven original PNG figures remain unchanged and accessible through View Original Figure.

The two user-created original artworks remain in `assets/` with attribution to the user but are deliberately absent from the UI following the user's design feedback. New illustrations are original code/Python artwork, AI-assisted under user direction, not copied television screenshots. Research figure copyright remains with the respective authors/publishers; scholarly attribution is not a license for unrestricted redistribution.

## Development, QA and academic evidence

[Release file manifest](docs/V1_RELEASE_MANIFEST.md) lists created/modified files. [Development journey](DEVELOPMENT_JOURNEY.md) links authentic Git milestones. [Prompt history](llm_logs/README.md) distinguishes recorded summaries from transcripts. Codex assisted implementation, research checks, testing and documentation; the user supplied creative direction and successive corrective specifications. No live LLM or paid service is required by the product.

[Final compliance matrix](FINAL_COMPLIANCE_REPORT.md) separates repository evidence from external Moodle actions. [Adversarial review](RED_TEAM_REVIEW.md) records findings, fixes, retests and the limits of a same-session AI review.

```powershell
.venv/Scripts/python.exe -m unittest discover -s tests -p 'test_*.py' -v
node tests/pivot-state-test.cjs
$env:TEST_BASE='http://127.0.0.1:8000'
node tests/browser-test.cjs
node tests/v10-ux-test.cjs
node tests/joey-refinement-test.cjs
node tests/v10-layout-test.cjs
node tests/chart-layout-test.cjs
node tests/stairwell-context-test.cjs
node tests/capture-v10.cjs
```

[Current test entry points](tests/README.md) identify active versus historical fixtures. Run browser suites sequentially to avoid competing software-WebGL processes. For `tests/v10-static-test.cjs`, set TEST_BASE to the clean static HTTP server. Browser QA uses installed Edge, Node's built-in CDP/WebSocket support and software WebGL; no Playwright dependency. Actual final results and screenshots are recorded in `screenshots/v10-final/visual-review.md` and its JSON reports. Python pixel/hash tests regenerate all exports in a temporary directory and compare bytes. Legacy test files and prior release screenshots remain historical evidence, not automatically claimed current passes.

## Accessibility, deployment and limitations

Native buttons, semantic figures/dialogs, focus indicators, keyboard playback, source tables and text captions complement visuals. System reduced motion or the quiet-motion setting uses static Python posters, avoids forced animation and preserves all explanations. Large text/small viewports may scroll within slides. Fine source scans and in-frame text can be enlarged; adjacent HTML explanations remain available.

Publish only after explicit user approval, using the repository's existing GitHub Pages configuration; then verify the deployed v1.0 assets, all 17 slides and fallbacks. Do not infer deployment from a local commit. No repository permission changes, release tag or Moodle submission were performed.

No physical-device or formal screen-reader testing, external human research review, clinical validation or new replication study is claimed. The older studies inform the educational narrative with the limits stated above. The optional game score and editorial episode match are independent of scientific assessment. See the compliance report for outstanding external actions.

### New illustration provenance and episode accuracy

`assets/joey/restaurant-storyboard.png` is newly generated original restaurant artwork, produced with the built-in image-generation tool under student direction; `joey.js` controls its two poses and timing. It is not a Python-generated asset, copied episode footage or a television screenshot. Its full generation prompt and tool mode are recorded in [the refinement log](llm_logs/v1-content-refinement.md).

[Apple TV confirms S10 E9 and the date taking food](https://tv.apple.com/us/episode/the-one-with-the-birth-mother/umc.cmc.5tjhrgg9ujwfuj7q0mff5gt4h). The familiar catchphrase occurs in Joey's conversation with his friends; this classroom interaction combines the food incident and catchphrase as an explicitly labelled illustrated adaptation, not an exact restaurant-scene transcript. It illustrates anticipation without being a scientific experiment.

### Final refinement QA summary

Executed: 433 browser regression checks, 41 dedicated Joey checks, 91 focused UX checks, 101 layout checks and 23 Python tests, plus game/context/chart/static-host/capture suites. All passed. All 17 slides were reviewed on desktop/mobile, including the new lesson and retained sources. [Actual reports and visual review](screenshots/v10-final/visual-review.md). No push or release tag has been made.

## Personal Comfort Profile - six distinct experiences

The existing questionnaire remains on **Slides 10-15** (indices 9-14). It now uses six different presentation interactions without adding questions or changing recommendation inputs:

| Slide | Interaction | Preserved contract |
|---|---|---|
| 10 | Six original mood symbols respond to hover/focus and selection | Same six mood values and grid |
| 11 | Retro Stress-O-Meter, moving needle, native slider and playful caption | Same 0-10 input; midpoint preview does not count as an answer |
| 12 | Six warm painted portraits; selected card reveals its personality description | Same character values, one selection, persistent on revisit |
| 13 | Gold-framed Quote Wall; selection reveals character/theme | Same six exact quote IDs, text and scoring mappings |
| 14 | Central Perk menu with five illustrated items and immediate order ticket | Same experience values; no checkout step |
| 15 | TV-remote familiarity buttons plus independent nostalgia dial and completion cue | Same three values per field; no automatic navigation |

The existing progress, Skip / Continue, Clear Answer, refresh persistence and full Try Again reset remain. Individual familiarity/nostalgia clear controls use the existing clear handler. `v06.js` still owns the single profile store; `profile-experience.js` only renders its state after `friends:profilechange`. No new storage, scoring rules or recommendation fields. Twenty pre-upgrade recommendation fixtures verify ranking/factor equivalence.

**Portrait provenance:** generated with the actual built-in image tool using Slide 4 as the painted-style reference. The Rachel card uses an original fashion-character interpretation after image-tool rejections, so exact actor likeness is not claimed; Phoebe uses an original fictional interpretation. [Exact prompts/outcomes](llm_logs/profile-portrait-prompts.json) and [asset hashes](assets/portraits/provenance.json) document this limitation. The six optimized WebP assets total about **189 KB**. No new dependency: the existing Pillow 10.4.0 is used solely for resizing/encoding, not portrait authorship. The local server includes the WebP MIME type; static hosting needs no Python runtime for these assets.

To re-export from the original generated PNGs (not included as large runtime assets), name them `monica.png` through `ross.png` and run:

```powershell
.venv/Scripts/python.exe python/prepare_portraits.py --input-dir test-results/portrait-sources
```

Original generation is nondeterministic and needs an image-generation capability; the app itself uses only the bundled optimized files. [Current before/after screenshots, executed tests and limitations](screenshots/profile-upgrade/visual-review.md). [Recorded instruction and design rationale](llm_logs/profile-upgrade.md). No publication or release is part of this local upgrade.

![Updated painted character gallery — Slide 12 of 17](screenshots/readme-gallery/slide-12.webp)

[Changed and added files](docs/PROFILE_UPGRADE_FILES.md). Executed current QA: 267 dedicated profile checks, 433 presentation checks, 91 retained UX checks, 26 Python tests, 36 layout cases and 34 static-host checks; before/after capture runs each passed 14 checks. See the current profile visual review for raw results and the Rachel likeness limitation.
