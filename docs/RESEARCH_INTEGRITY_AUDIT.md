# Final research integrity audit

Reviewed November 6, 2026. This audit distinguishes the papers' observations/tests from the project's fictional art, interpretations and entertainment scoring. No participant data is collected by the unscored Joey interaction. The verified inputs remain in `data/research_source.json`; generated outputs are separate.

## Sources checked

**Paper A:** Derrick, J. L., Gabriel, S., & Hugenberg, K. (2009). Social surrogacy: How favored television programs provide the experience of belonging. *Journal of Experimental Social Psychology, 45*, 352–362. DOI [10.1016/j.jesp.2008.12.003](https://doi.org/10.1016/j.jesp.2008.12.003). [Author-lab PDF](https://ubwp.buffalo.edu/gabriellab/wp-content/uploads/sites/65/2025/04/Derrick-J.-L.-Gabriel-S.-Hugenberg-K.-J.-2009.-Social-surrogacy-How-favored-television-programs-provide-the-experience-of-belonging.pdf).

**Paper B:** Derrick, J. L. (2013; first online August 8, 2012). Energized by Television: Familiar Fictional Worlds Restore Self-Control. *Social Psychological and Personality Science, 4*(3), 299–307. DOI [10.1177/1948550612454889](https://doi.org/10.1177/1948550612454889). Bibliography checked against the publisher and [University at Buffalo record](https://researchconnect.buffalo.edu/en/publications/energized-by-television-familiar-fictional-worlds-restore-self-co/); results/design checked against the [author-uploaded full text](https://www.researchgate.net/publication/235665383_Energized_by_Television_Familiar_Fictional_Worlds_Restore_Self-Control). The old CiteSeer verification URL returned 403, so the source metadata now points to the available author copy. The DOI remains the canonical citation.

## Claim and visualization ledger

| Area | Evidence and treatment |
|---|---|
| Slides 2/6, descriptive means | Paper A, Study 1, Table 1, p. 355: 5.81/2.64, 4.86/3.69, 5.82/2.97, 5.00/3.43. 1–7 self-report scales; reversed loneliness ratings. These describe reported likelihoods, not clinical anxiety or causal viewing benefits. Exact supplied means are retained. |
| Slide 3, social surrogacy | Favored-TV research supports investigation of subjective belonging. The Friends couch/example is an illustration, not a Friends-specific finding. |
| Slide 3, predictability/ease/nostalgia | Broader qualified interpretations. No claim that either featured paper directly measured these mechanisms in Friends viewers. Each revealed card states its evidence level. |
| Slide 4, Joey adaptation | Original generated restaurant illustration inspired by S10 E9, The One with the Birth Mother. The date takes food; the catchphrase is spoken to friends in the episode. This explicitly labelled classroom adaptation combines these beats to illustrate anticipation, not an exact transcript or scientific experiment. No correctness score or profile input. |
| Slide 5, concentration/tension | Game score only; not cognitive ability, anxiety or clinical assessment. No game score enters recommendation inputs. |
| Slide 6, optional Paper A Study 2 | Fight recall versus possessions listing, crossed with favored/control-TV essay. Outcome: time spent writing. Interaction p < .01; favorite-TV threat contrast p = .04; favorite/control-TV contrast without threat p = .24. No exact four-condition means are reconstructed. |
| Slide 6, optional Paper A Study 3, self-esteem | Interaction p = .04; threat contrast in favorite-TV condition p = .42. Non-significance does not show equality or establish an absence of effect. |
| Slide 6, optional Paper A Study 3, mood/rejection | Mood interaction p = .03; favorite/control-TV contrast under threat p = .09. Rejection interaction p = .09 is marginal and not significant at .05. Original figures/data-table access remains. |
| Slide 7, puzzle/mood modules | Paper B Study 1 crossed free/regulated writing with room/favorite-TV recall. Interactions: puzzle p < .05; mood p = .04. In room recall, regulated writers solved fewer items/reported more negative mood; these contrasts were not significant after favorite-TV recall. Unspecified simple-contrast p values remain unspecified. No invented means/error bars/effect sizes. |
| Slide 7, diary | Paper B Study 2 relates Day 1 effortful self-control, Day 2 familiar-world use and Day 3 mood. Interaction p < .01; association without familiar-world use p = .012; with use p = .261. It is observational. Animation arrows explicitly mean chronology, not causal effects. |
| Slide 8, Rewind | Nostalgia and cognitive ease are interpretive concepts; memories can also be bittersweet. No copied footage or claim that the two papers established these mechanisms directly. |
| Slide 9, lobster metaphor | Entertainment analogy for preference matching, not psychological diagnosis or an empirical compatibility model. No early recommendation computation. |
| Slides 10–17 | Optional preferences and 0–10 stress self-report are not a clinical assessment. Catalog mood/comfort tags and normalized matching scores are editorial/algorithmic; no scientific probability or medical recommendation is implied. |

## Python authoring and measurement boundaries

`python/generate_animations.py` draws complete frames with Pillow. The seven active evidence animations and archived, no-longer-displayed social sequence are genuine Python-authored exports. JavaScript controls frame playback, module selection, story branching and replay. It does not author their bitmap artwork. Slide 3 uses original code-native SVG artwork. Slide 4 uses a newly generated painted bitmap storyboard with JavaScript/CSS playback, not misrepresented as a Python export.

All seven research animations are qualitative. Statistical categories and p labels are not plotted as effect magnitudes. Original figures are preserved without modifying pixels; their heights are never digitized. The animation timing and puzzle icons illustrate explanation only; they are not measured task duration, actual test items or participant counts. The experimental work is discussed as historical evidence, not a validated universal recovery protocol. No clinical anxiety treatment, cortisol reduction or physical cognitive-energy claim is made.

## Limitations and verification scope

The papers do not specifically test Friends as a treatment. The diary cannot establish causation. The supplied original scans lack a documented exact group-mean dataset, so no quantitative reconstruction is attempted. Supplemental mechanism analyses are exploratory rather than proof of an exclusive mechanism. Episode title/number/quote metadata retains the v0.9 verified catalog; this release adds no episodes or new quote-scene claims.

Verification combines source reading, source/asset hashes, numerical-input tests, real generated-image checks, and browser inspection. Original-paper text is not redistributed as a new PDF. Publisher access may require a library; the original supplied figure references and canonical citations remain available in the deck.

## Final content refinement

The student approved removing the former Slide 7. Its unique findings and all four original Paper A figures are retained in the optional Slide 6 disclosure rather than duplicated as a standalone story. Original data and Python image assets are unchanged. Episode metadata was checked against the Apple TV S10 E9 listing and episode dialogue context; the slide visibly states that its combined illustration is an adaptation.
