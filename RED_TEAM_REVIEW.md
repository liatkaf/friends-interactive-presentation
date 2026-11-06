# v1.0 FINAL - Adversarial Review

Date: November 6, 2026. This is a separate evaluator-perspective review pass by the same Codex session that implemented the release. It is **not independent human certification**, a new empirical study or a claim of external peer review.

## Findings, corrective actions and retests

| Severity | Finding / challenge | Action and actual evidence | Status |
|---|---|---|---|
| High | The final specification requires Python-authored social and research animation; v0.9's browser evidence maps alone do not satisfy that requirement. | Added complete Pillow frame authoring, eight sequences and provenance manifest. Five new image/hash tests inspect pixels, animated GIFs and byte-identical regeneration; full Python discovery passes 23 tests. | Resolved locally |
| High | System Pillow fails to import its imaging DLL, breaking reproducibility on this machine. | Isolated pinned Pillow 10.4.0 in ignored `.venv`; generation and full Python suite actually run. README documents clean environment and dependency. | Resolved locally; platform setup can vary |
| High | Scanned bars invite invented numerical reconstruction or p-values presented as effect magnitudes. | No digitization. Source-verified categorical findings, exact reported p labels, prominent qualitative explanations, unchanged originals and accessible tables. Source/data tests and research audit reviewed all seven measures. | Resolved by design; no fabricated outcomes |
| Medium | Old Paper B full-text link is inaccessible (403), making source audit difficult. | Verified author-uploaded primary full text, corrected source URL and regenerated hashes; retained canonical DOI and correct 2013/online-2012 distinction. | Resolved; third-party availability may vary |
| Medium | Inherited `.pillar-card>div` flex styling squeezes revealed explanations into narrow columns, especially mobile. | Added explicit block detail layout and mobile single-column cards; recaptured and reviewed the final desktop/mobile deck. | Resolved |
| Medium | Dimming entire inactive comic panels risks weak text contrast. | Keep text fully opaque and dim only artwork; preserve focus and selected borders. | Resolved |
| Medium | Animation/module switching, enlargement or hidden stages can accumulate playback loops or show old module frames. | Generation guards, finite playback, pause on visibility change and controller disposal. Focused browser tests cover actual frame change, pause/replay, module cancellation, hidden-slide pause and enlarged-dialog cleanup. | Resolved in executed tests |
| Medium | Missing atlases or reduced motion could remove access to the scientific content. | Static Python poster, adjacent HTML design/finding/limits, original figure access; tested missing-atlas and reduced-motion paths. | Resolved in executed tests |
| High regression risk | New story choices might enter recommendation scoring or Try Again might restore stale prior results. | Story choice remains separate and ephemeral. Existing single profile architecture retained. Focused suite tests all-answer reset, refresh, unrelated settings, both engines and delayed old response rejection. | Verified; no new defect observed |
| Medium deployment risk | Static Pages cannot run the local Python recommendation worker. | Clean file-server test uses genuine 3D, generated evidence and JS fallback; ordinary UI hides engine details while developer diagnostics remain accurate. | 10 checks passed; live final deployment pending approval |

The first two findings are actual build/specification gaps, the layout/contrast findings came from review, and the remaining rows explicitly identify adversarial risks rather than pretending every tested scenario was a preexisting bug. Two focused test-fixture failures (timing after finite playback, malformed evaluation wrapper) and a layout fixture selecting a hidden player were corrected; only completed reruns count as passes.

## Cross-disciplinary assessment

**Academic integrity:** source ledger distinguishes experimental tasks, observational diary relationships, broader interpretation and fictional examples. Familiar-world recall tasks are not portrayed as experiments on Friends viewers. Nonsignificance is not equality; no therapeutic, cortisol or physical-energy claims. Sources are historical and not a comprehensive systematic review.

**Technical quality:** actual browser/CDP tests, image-level Python reproducibility, deterministic game rules, real WebGL context-loss recovery, clean static hosting and unchanged recommendation engine provide concrete evidence. No live LLM/API key or external runtime dependency is required.

**UX and originality:** three new interaction styles have distinct purposes: concept reveals, predictable comic and branching story followed by research. Lab modules differ in design and visuals. Original SVG/Python illustrations follow the user's creative instructions. The existing research-first narrative and six optional questions remain intact.

**Documentation and assignment compliance:** README includes real screenshots/Python previews, architecture and regeneration; PRD matches implemented behavior; prompt summaries are labeled; Git history remains authentic. Compliance report separates completed repository checks from publication/Moodle actions.

**Accessibility:** native controls, keyboard tests, focus restoration, semantic dialogs, text/table alternatives and reduced-motion posters are implemented. Mobile is emulated, not physical-device testing. No formal screen-reader certification or audited WCAG conformance is claimed.

## Residual risks and release decision

No unresolved critical/high local product defect was found in the executed scope. This does not guarantee absence of defects. Remaining limits: small-screen/large-font vertical scrolling, fine in-frame text requiring enlargement, browser-dependent software/GPU rendering, external source-link availability, no physical-device/formal screen-reader testing and no independent human academic audit. The publicly hosted release has not been replaced with v1.0. User review, explicit publication approval, post-deployment verification and external Moodle steps remain. Therefore the repository is a locally verified final candidate, not an assertion that all external submission actions are finished.
