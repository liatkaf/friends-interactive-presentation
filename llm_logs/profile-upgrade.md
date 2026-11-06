# Personal Comfort Profile upgrade - authentic instruction summary

This is a faithful summary of the user's final questionnaire-upgrade request and actual implementation, not a fabricated verbatim conversation. Earlier prompts, commits, screenshots and design decisions remain unchanged.

## User objective and constraints

Upgrade only the six existing questionnaire slides in the 17-slide presentation. Verify actual slide numbering and shared state first. Preserve all answer fields/values, scoring, quote mappings, session persistence, optional questions, skip/clear/revisit/change behavior, keyboard/mobile/reduced-motion support and full Try Again reset. Create six cohesive but distinct Friends-inspired interactions, avoiding dashboards, emoji-heavy cards or distracting animation. Do not push, publish or create a release without approval. Stop after local implementation and verification.

Requested designs: animated mood symbols in the existing six-card grid (Slide 10); a retro semicircular Stress-O-Meter with native accessible 0-10 input and no automatic default answer (11); six coordinated semi-realistic painted character portraits using Slide 4 as the quality reference, selected descriptions and all characters visible (12); gold-framed Quote Wall preserving all six quote IDs/content (13); Central Perk Comfort Menu with five existing choices and immediate order feedback (14); a TV remote for familiarity plus a separate nostalgia selector, independent values and a restrained completion cue without auto-navigation (15).

## Audit and implementation decisions

Baseline: local main at b9e1c2c406f817d03b604376d79938b82cf2554e, with only the unrelated research ZIP untracked. Existing preview at port 8011 was reused after checking listeners; no duplicate preview server was launched. Visible Slides 10-15 are indices 9-14. Existing native buttons use `data-answer`/`data-value` and `aria-pressed`. All values remain unchanged, including experience value `lighthearted entertainment`, the six exact quote IDs and independent familiarity/nostalgia fields.

`v06.js` remains the only profile state manager. A presentation-only `friends:profilechange` notification from `syncProfile()` lets `profile-experience.js` project the same stored answers into the gauge, mood accent, order ticket and remote/meters. It does not store answers, score anything or trigger navigation. Native clear/skip handlers remain; two optional individual clear controls reuse the existing `data-clear` handler. Session key remains `friends-profile-v05`. The slider's preview midpoint is unanswered until an actual input event, including after reset.

Before changing the UI, the capture script saved desktop/mobile screenshots and 20 complete recommendation fixtures from the existing fallback engine. These are compared with both engines after the upgrade. No scoring code, weights, research data, catalog or quote metadata was changed.

## Portrait origin and limitation

Actual built-in image-generation calls used the existing Slide 4 restaurant artwork as a style reference. Four initial named-character requests succeeded; Rachel's initial request was rejected at input moderation and Phoebe's at output moderation. A revised original fictional interpretation succeeded for Phoebe but was rejected for Rachel. A new, explicitly original fashion-character portrait with no real-person or existing-character likeness then succeeded for the Rachel card. No exact actor likeness is claimed for that interpretation. All six final assets are original generated images with coordinated warm painted treatment; they are not screenshots, stock photos, Python-authored portraits or generic SVG avatars.

[Exact prompts and outcomes](profile-portrait-prompts.json) preserve the actual requests, including rejected attempts. `python/prepare_portraits.py` only resizes/encodes the images using the already documented Pillow 10.4.0 dependency. Six 400x500 WebP files total 188,624 bytes. `assets/portraits/provenance.json` records original and optimized hashes/dimensions. Raw generated sources remain in the tool's generated-image directory and ignored local QA source folder; optimized final assets are in the repository. Image generation is not deterministic; re-encoding is reproducible given the same source PNGs.

## Validation and corrections

Actual test results and before/after screenshots are recorded in `screenshots/profile-upgrade/visual-review.md`. The first broad regression found a long mood label overflowing at 320px; a compact typography rule corrected it. Visual review moved the gauge number below the needle and tightened mobile fan-selector spacing. Two fixture issues were corrected honestly: UTF-8 JSON needs explicit decoding on this Windows installation, and answer equality must ignore object-key insertion order on normal refresh. Failed/incomplete runs are not counted as passes.

The captions and low/moderate/high visual bands are original interface copy and editorial display cutoffs, not scientific or diagnostic categories. No new research claims or clinical assessments were added. Small/zoomed viewports may require vertical scrolling for accessible content; no physical-device or formal screen-reader certification is claimed. No commit, push, release, deployment or repository setting change is authorized by this upgrade's stop condition.

### Completed verification

The final dedicated suite passed 267 checks, the broad presentation suite 433, the retained research/player/rewind/lobster/reset suite 91, full Python discovery 26, clean static hosting 34, and all 36 layout cases had zero failures. Before/after capture runs each passed 14 checks. All six current questions were visually reviewed at desktop/mobile sizes. The plain Windows static-server MIME issue was corrected with a standard-library preview helper; no recommendation API is claimed in that mode. The work stops uncommitted on main for user review.
