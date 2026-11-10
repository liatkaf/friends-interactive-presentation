# Guided README tour — inventory and review

**Local Slide 1 author-credit preview (2026-11-10):** the primary image now shows Livnat Benson and Liat Kafezider with their requested IDs. It was captured from the local working copy; the public presentation and public README are unchanged until approval. Only `slide-01.webp` was replaced; hashes for the other 16 primary images and all 8 interaction-state images remain unchanged. Desktop, laptop, mobile and README-sized captures were checked for readable text, clipping and overlap. The inventory marks Slide 1's local-only source.

**Current Slide 13 amendment:** Rachel and Chandler now have the final user-selected lines. Only `slide-13.webp` was replaced; all other tour images are unchanged. See [quote-update scope and QA](SLIDE13_QUOTE_UPDATE.md). The inventory preserves the original tour-stage evidence and marks the new Slide 13 capture separately.

The user reviewed the prepared revision and explicitly approved committing and pushing this documentation-only update. The following inventory records the checks performed before publication; live public README verification follows the push. No presentation change or release tag is included.

## Screenshot inventory

All primary files are under `screenshots/readme-tour/`. Each was captured directly from the published Pages presentation, not inferred from an old filename. The capture records the live slide ID/title, URL, dimensions and visible state. All 17 primary sections fit in the 1440 × 1000 viewport without horizontal or vertical clipping. No image is a mockup. Example profile answers were deliberately selected.

Full SHA-256 hashes, capture metadata and perceptual comparison results: [machine-readable inventory](../screenshots/readme-tour/inventory.json).

| Slide | Exact title | Primary screenshot | Purpose documented | Distinguishing feature documented |
|---|---|---|---|---|
| 01 | Welcome to the Friends Comfort Lab | `slide-01.webp` | Welcome visitors into a familiar fictional world and introduce the question behind the project: why can rewatching feel comforting? | Drag the coffee mug or use its keyboard controls to change the view. Its gentle rotation stops when the slide is hidden, keeping the welcome scene alive without distracting from later slides. |
| 02 | Why Do We Rewatch Friends? | `slide-02.webp` | Begin with a research question rather than treating the appeal of Friends as established scientific fact. | Switch between choosing an activity when lonely and loneliness-related ratings. Bars and contextual text change together, helping the audience see that these are different self-reported measures. The source dialog explains the scales. |
| 03 | The Psychology of Comfort TV | `slide-03.webp` | Give the audience four useful ideas for interpreting comfort viewing: predictability, social surrogacy, cognitive ease and nostalgia. | Open an illustrated card to reveal its explanation and example. Only one stays open, and the takeaway changes with the selected concept, turning a list of terms into a small exploration. |
| 04 | The One With the Missing Punchline | `slide-04.webp` | Make predictability tangible: knowing a familiar reaction does not necessarily remove the pleasure of watching it unfold. | Play the restaurant setup, wait for the freeze, choose a prediction, then reveal Joey's reaction and the educational takeaway. Replay starts the sequence again; predictions receive no score. |
| 05 | PIVOT! Concentration & Spatial Focus | `slide-05.webp` | Offer a playful focus and spatial-awareness break before the detailed research, without presenting game performance as a psychological test. | Move the orange couch upstairs, pivot at the tight corner and reach the landing. Trying to move through the corner first produces a blocked-move response; Reset Challenge restores the starting state. |
| 06 | What the Research Shows | `slide-06.webp` | Slow down and examine the evidence introduced on Slide 2, distinguishing activity choice from loneliness-related ratings. | Toggle the chart series, inspect a bar's value, or open the data table. A separate disclosure offers belongingness findings, original figures and additional research animations, keeping the main comparison readable. |
| 07 | The Self-Control Recovery Lab | `slide-07.webp` | Explain what the self-control research actually tested, separating an experiment from an observational diary study. | Choose Puzzle Performance, Negative Mood or Daily Diary, then play, pause, replay or enlarge its animated explanation. Study design, reported finding and limitations remain alongside the picture. |
| 08 | The One With The Rewind | `slide-08.webp` | Translate the broader ideas of nostalgia and cognitive ease into a recognizable action before introducing the personal profile. | Press REWIND: the cassette and television animate, a familiar room appears, and two short explanations are revealed. Replay repeats the transition; reduced motion shows the completed state directly. |
| 09 | Finding Your Episode Lobster! | `slide-09.webp` | Bridge the research narrative and the optional questionnaire, explaining what the audience will do next. | Two illustrated lobsters meet while three stages appear: understanding needs, discovering a comfort style and finding an episode. The button advances to the first question; it does not claim that a match already exists. |
| 10 | How Are You Feeling? | `slide-10.webp` | Invite a lightweight reflection on the visitor's current mood as the first optional preference. | Choose one of six illustrated mood cards. Hover and focus animate the symbols gently; selection changes the accent and saved-answer feedback. Clear the answer or continue without choosing, and ordinary navigation preserves the choice. |
| 11 | What's Your Stress Level? | `slide-11.webp` | Let visitors describe their current stress level while making the entertainment-only boundary explicit. | Move the native 0–10 slider: the retro gauge needle, numeric reading, band and playful caption respond together. The initial midpoint is only a preview and does not count as an answer; clearing restores the unanswered state. |
| 12 | Who's Your Favorite Friend? | `slide-12.webp` | Bring a favorite character into the recommendation and give the profile a more personal visual identity. | Choose among six painted portraits. The selected card grows slightly, gains a highlighted border and reveals a personality description; all six choices remain visible. |
| 13 | Which Quote Speaks to You? | `slide-13.webp` | Connect Rachel’s independence and Chandler’s humor-as-coping with emotional comfort. | Six characters, one each; selecting a framed quote reveals its character/theme and contributes an explained match. |
| 14 | What Kind of Comfort Do You Need? | `slide-14.webp` | Ask what kind of viewing experience would suit this evening: laughter, warmth, friendship, nostalgia or something light. | Pick an illustrated Central Perk-inspired menu item. A YOUR ORDER stamp and immediate text feedback confirm the choice, making preference entry feel like ordering comfort without adding a checkout step. |
| 15 | How Familiar Is Friends to You? | `slide-15.webp` | Separate knowledge of the series from the amount of nostalgia a visitor wants, so newcomers can participate too. | Press a familiarity button on the illustrated remote, then choose nostalgia independently. The remote display and nostalgia bars update; each field can be cleared separately. Completing both shows a cue without automatically navigating away. |
| 16 | Finding Your Perfect Match | `slide-16.webp` | Make the recommendation process understandable before revealing the chosen episode. | The five-step display stays incomplete while a result is pending. Once ranking finishes, it shows contributing factors and enables the reveal button. Unanswered questions are omitted rather than silently assigned values. |
| 17 | The One With Your Perfect Episode | `slide-17.webp` | Turn the profile into a transparent entertainment suggestion rather than an unexplained final score. | Read the top episode and two alternatives, open Why This Episode? for factor contributions, or request a different discovery with Surprise Me. Try Again clears the whole attempt and returns to Slide 10; Back to Start preserves answers. |

## Duplicate and similarity review

The preceding README embedded 28 unique gallery images 32 times: Slide 1 appeared twice, Slide 12 three times and Slide 17 twice. These were repeated references, not duplicate primary-slide files. The redesign removes all four repeated embeds.

The new README has 17 primary slide images and 8 distinct additional states: three Highlights and five interaction examples. All 25 image files have different SHA-256 hashes; each is embedded exactly once. The earlier image folder remains intact as historical evidence. Subtle mug-angle, stress-value, menu-order and alternate-result captures are omitted from the walkthrough to avoid unnecessary visual repetition.

A content-cropped 64-bit DCT perceptual hash flags compositionally similar pairs for visual review. Shared cream/purple backgrounds are not classified as duplicates automatically. All 17 primary images and all 8 additional states were inspected individually. No primary-to-primary pair falls within the perceptual similarity threshold. Six flagged pairs are legitimate before/after states, explained below.

## Verification status

- Direct published-site capture: 38 interaction/numbering checks passed; zero unexpected browser errors.
- All 17 captured slide IDs and titles match their expected order; portraits loaded and content fits the viewport.
- Each slide has Purpose, What makes it special and Behind the scenes, with 40–75 words excluding headings/labels.
- Individual review caught incomplete background-image decoding on the first Slide 4 capture. It was replaced with a new live capture after explicit decoding and a compositor flush; the complete illustration is now visible.
- All 25 files decode at 1440 × 1000; SHA-256 values are unique, and every README image appears exactly once.
- GitHub's actual Markdown renderer accepts all 25 image embeds, all 17 sets of three explanation labels, and zero collapsible sections. All image paths and local documentation links exist.
- Desktop 1440px and mobile 390px local previews: all 25 images decode, 17 primary headings are visible, zero horizontal page overflow. The HTML comes from GitHub's renderer; the readable preview wrapper uses local CSS, not the live GitHub site's full layout.
- All 17 descriptions were proofread against the source implementation. They contain 65–73 words each, excluding headings and labels. Scientific interpretation, editorial scoring, AI-assisted art, Python authoring and JavaScript playback remain distinguished.
- Runtime files are untouched. All 77 published runtime/data/portrait/animation/research/vendor files match committed Git blobs; the live static profile suite passes 34 checks, including 20 golden rankings and full reset.
- At the preparation stage, no commit, push, tag, release or live-site change had been made. The user subsequently approved documentation publication. Public image loading is checked after the push; the pre-publication JSON retains its original stage-specific status.

## Perceptual similarity decisions

| Pair | DCT distance | Individual visual finding |
|---|---|---|

| `slide-05` / `pivot-success` | 2 | Distinct intentional interaction state; Same stairwell; couch moves from the bottom to the top landing and success feedback replaces the initial prompt. |
| `slide-04` / `joey-prediction` | 4 | Distinct intentional interaction state; Same setup illustration; ready state has Play, frozen state shows FREEZE and three prediction buttons. |
| `slide-07` / `research-animation` | 6 | Distinct intentional interaction state; Same workbench; final poster includes the conclusion, while paused playback shows an intermediate frame and progress. |
| `slide-04` / `joey-payoff` | 8 | Distinct intentional interaction state; Two different illustrated poses; starting caption and Play are replaced by the punchline and educational takeaway. |
| `slide-12` / `portrait-selected` | 8 | Distinct intentional interaction state; Six portraits stay visible; highlight and personality text move from Monica to Joey. |
| `joey-payoff` / `joey-prediction` | 8 | Distinct intentional interaction state; Prediction controls precede the reaction; completed state shows a different pose, catchphrase and takeaway. |

## Review preview

Open the generated local preview at `test-results/README-guided-tour-preview.html` (or the running loopback preview URL). It uses the actual GitHub-rendered Markdown with local image files; it is not a published revision. Desktop/mobile review screenshots are in ignored `test-results/guided-preview-*.png`.

Changes prepared: `README.md`, this inventory/review document, 25 new WebP screenshots and their JSON inventory under `screenshots/readme-tour/`. Original screenshot folders, PRD, prompts and academic files remain intact. Images total approximately 1.96 MB at their original dimensions. A raw capture with incomplete artwork was corrected rather than accepted on filename alone.
