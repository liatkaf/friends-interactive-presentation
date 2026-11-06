# Final content refinement - authentic instruction and design summary

Source: the user's final content-refinement request after the completed v1.0 review. This file is a faithful summary, not a reconstructed verbatim conversation. Earlier prompt transcripts and historical screenshots are preserved unchanged.

## Student design decision (summarized from the supplied instruction)

The student reviewed the completed v1.0 presentation. The original animations on Slides 4 and 7 were considered visually weak, and the stories lacked a meaningful payoff. Several alternatives for Slide 4 were explored. The student selected a real, recognizable Friends scene involving Joey refusing to share food, explicitly requested an explanation of the interaction's educational purpose, and approved removing Slide 7 entirely to reduce repetition. The earlier alternative discussions were not supplied as verbatim transcripts here; none are invented.

## Requested implementation

Replace Slide 4 with The One With the Missing Punchline, using the headline You Know the Joke. Why Is It Still Funny? and the supplied opening explanation. Show an original cozy restaurant illustration of Joey and his date taking a fry, freeze before his reaction, then ask Freeze! What will Joey do? Options: Smile and share his fries; Pretend he didn't notice; Make a big deal about his food. Hide the answer until a selection, then reveal the familiar catchphrase and an expressive comedic reaction. No scoring or knowledge test. Reveal the exact educational purpose and conclude Sometimes, knowing the punchline is part of the fun. Provide Replay, keyboard/reduced-motion support and desktop/mobile layout; no episode footage or unlicensed screenshots.

Remove the former The One Where You Feel Left Out slide and mini-story completely, reducing the primary deck to 17 slides. Preserve unique Derrick et al. (2009) evidence concisely elsewhere; preserve Python assets still used. Update numbering, selectors, navigation, counters, tests/captures, README/PRD, development and lecturer compliance records. Verify all slides and the new interaction, research accuracy, existing regressions, screenshots, mobile and Git diff. No push or release tag without approval.

## Main implementation decisions

- Original, newly generated painted restaurant artwork replaces the rejected geometric comic. The built-in image-generation tool was used, with no API key or CLI fallback. Saved asset: `assets/joey/restaurant-storyboard.png`. It contains two matching poses; JavaScript controls setup, freeze, a brief anticipatory pause, reaction and educational takeaway. This new illustration is not falsely described as Python-authored.
- State stays local to the interaction and never enters questionnaire/scoring. Typical flow is about 15-20 seconds including user reading/choice; the prediction never times out. Reduced motion exposes freeze/reveal without decorative waits. Replay resets choices/reveal; leaving cancels timers.
- Removed only the approved primary slide. Its four unique Paper A measures and genuine Python animations now live under an optional disclosure on Slide 6, with original scans, p/significance distinctions, design and limits. Current Slide 7 is the retained Self-Control Recovery Lab. The unused social-scene export remains solely for historical reproducibility; it is not displayed.
- Contiguous IDs now run `slide-1` through `slide-17`; questionnaire is Slides 10-15, matching/recommendation Slides 16-17. Reset returns to Slide 10. Research/profile/episode data and existing game/Three.js source remain intact.
- Episode verification: Apple TV confirms S10 E9, The One with the Birth Mother, and the date taking food. The catchphrase is spoken in Joey's conversation with his friends; the slide explicitly labels its combined setup/reaction as an illustrated adaptation, not a literal scene transcript or scientific experiment.

## Exact image-generation prompt

Built-in tool mode, `illustration-story`, no reference image and no copied screenshot:

> Use case: illustration-story. Create original polished hand-painted editorial animation storyboard artwork for an interactive Friends-inspired university slide. A TWO FRAME horizontal sprite sheet: precisely two equal landscape panels side by side, no gutter. Each panel same composition, cozy upscale casual 1990s New York restaurant with purple upholstered booth, cream walls, amber lamps, tiny vase, plate of fries. Cinematic warm lighting, refined expressive character drawing with natural anatomy and fluid lines, rich textured painted shading, NOT geometric vector figures, NOT a photograph or TV screenshot. Joey Tribbiani, recognizable friendly dark-haired Italian-American sitcom character in his thirties, dark open shirt over cream tee, seated LEFT at the table opposite his female date on RIGHT. LEFT PANEL SETUP: Joey is mid-conversation with a relaxed neutral expression; date reaches across and picks one golden fry off his plate, no angry reaction yet. RIGHT PANEL REACTION: identical setting, outfit and camera; Joey leans forward dramatically, eyebrows raised, mouth open in comic protest, protective hand around plate and other palm raised, date amused. Funny, gentle, expressive not menacing. Keep faces and the fry taking action large and readable, entire two people visible waist up, table foreground. No lettering, no speech bubbles, no text, no captions, no borders, no watermark. Matching compositions and characters across both frames. Purple, warm cream, signature yellow, burnt orange accents. This is newly illustrated fan-inspired art, never copied footage. Wide 2-panel composition.

The tool output is an original painted two-pose illustration; browser framing uses its two equal panels. No claim of a frame-perfect recreation, licensed production artwork or Python authorship is made.

## Verification, corrections and limits

Actual rerun counts and review screenshots are in `screenshots/v10-final/visual-review.md`. The first regression attempts exposed test assumptions tied to the old 18-slide structure (questionnaire slices and removed story selectors), not a reason to restore the removed slide. Fixtures were updated for the approved 17-slide scope, while preserving scoring and interaction checks. No failed or incomplete run is reported as passing. Small screens scroll vertically; no physical-device or formal screen-reader test is claimed. No push or release tag is authorized by this revision.

Sources: [Apple TV episode listing](https://tv.apple.com/us/episode/the-one-with-the-birth-mother/umc.cmc.5tjhrgg9ujwfuj7q0mff5gt4h), [episode transcript used to check scene context](https://www.drodd.com/friends/friend-episode1009.htm). Research inputs/citations remain unchanged.

### Completed reruns

Current browser regression: 433; dedicated Joey refinement: 41; focused preserved UX: 91; layout: 101; Python: 23; deterministic game: 33; WebGL recovery: 14; preserved chart: 18; clean static-host: 13; all-slide capture: 18 checks. All completed successfully. New screenshots and six contact sheets cover 17 slides on desktop/mobile. Syntax/link/preservation review passed. No push or tag. Local commit information is supplied in the delivery report and Git history.
