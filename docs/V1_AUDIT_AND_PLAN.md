**Historical audit note:** this plan describes the original 18-slide v1.0 scope. The student subsequently approved removing the former Slide 7 and replacing Slide 4; current scope is 17 slides. See `llm_logs/v1-content-refinement.md` and `screenshots/v10-final/visual-review.md`.

# v1.0 FINAL: audit and implementation plan

Audit started November 6, 2026; resumed after interruption by inspecting disk and background processes. Baseline: `main`, `e9aef526e7d9260d7c506e697edb958bebcd8771` (v0.9). The only unrelated untracked file is the research ZIP; it stays untouched/uncommitted. No v0.10 implementation or separate v0.10 prompt was found; the current master prompt defines the four upgrades.

## What already works

The repository contains 18 HTML slide templates in `script.js`, layered CSS/JS enhancements, seven unchanged original research figures, local Three.js r170, real Python recommendations, static-host fallback, source-validated research JSON, six dedicated questions and a full Try Again reset. Mug/couch animation and game scoring are implemented; neither needs replacement. The v0.9 focused suite was rerun before UI edits: **60 checks passed, no unexpected JavaScript errors**. The installed system Pillow has a DLL error; an ignored project virtual environment now runs Pillow 10.4.0 successfully. Previous session state was checked before starting one preview on port 8011.

## Gaps for this release

1. Slide 3 has explanatory cards but no illustrated reveal interaction or dynamic takeaway.
2. Slide 4 has a text sequence but no original interactive comic.
3. Slides 7–8 have useful JS-rendered, Python-processed qualitative maps, but their animation artwork is not authored by Python. Retain their evidence/reference access while adding genuine exported animation frames.
4. Root documentation lacks a final lecturer compliance matrix, development journey and explicit Red Team findings. The README's deployment wording is stale after the authorized v0.9 push.
5. Prompt history contains honest v0.8/v0.9 summaries; earlier transcripts are unavailable and must not be invented.

## Internal plan, established before source edits

Verify source passages and baseline; generate original social/evidence animation atlases, posters and previews in Python; add illustrated reveal cards and a progressive comic; integrate a branching social story and selectable research lab using a finite, accessible frame player; run regression/static/reduced-motion/mobile tests; inspect all 18 slides; complete a separate adversarial review pass and fix high/critical findings; write final assessment documents and meaningful local commits. No push, release tag, visibility change or slide removal is authorized.

## Eighteen-slide value review

| Slides | Educational or interactive value |
|---|---|
| 1 | Establishes topic, personal visual direction and genuine 3D |
| 2 | Introduces descriptive research as an accessible hook |
| 3 | Four distinguishable mechanisms with evidence-level qualifications |
| 4 | Applies predictability through a fictional comic, distinct from experiments |
| 5 | Demonstrates 3D interaction and spatial gameplay without assessment claims |
| 6 | Explains exact descriptive means, response scales and source provenance |
| 7 | Separates a gentle fictional choice from a belongingness experiment |
| 8 | Compares experimental and observational self-control evidence |
| 9 | Explores nostalgia/familiarity through the retained VHS interaction |
| 10 | Bridges research to optional entertainment preferences |
| 11–16 | Each question has its own readable slide and scoring purpose |
| 17 | Shows actual matching completion and transparent factor contributions |
| 18 | Delivers one real episode, alternatives, explanations and reset/navigation |

Slide 2 previews the same source later unpacked on Slide 6; this repetition is intentional introduction versus detailed interpretation. The lecturer's approximately ten slides is guidance with flexibility. All 18 retain a purpose and remain because removing/merging requires the user's approval. Live presentation duration has not been formally timed.

## Research and review boundaries

Keep Paper A's Study 1 means unchanged. Use source-verified qualitative comparisons for original figures; never derive group means from pixel heights. Treat p-values as reported test annotations, not effect sizes. The two featured papers did not test Friends as a clinical intervention. Preserve marginal/non-significant distinctions and the diary's observational nature. Full bibliographic citations and original figures remain accessible. A separate Red Team pass in this same Codex session will be labeled honestly; it is not an external human or clinical review.
