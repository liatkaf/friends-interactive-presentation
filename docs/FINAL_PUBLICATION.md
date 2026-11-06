# Final GitHub publication — November 6, 2026

The user explicitly authorized final publication after moving the complete project to `D:\friends-interactive-presentation`. This supersedes earlier local-only restrictions. No slide redesign, history rewrite, original C: deletion, repository permission change or Moodle action is included.

## Migration and preservation

- Existing remote: `https://github.com/liatkaf/friends-interactive-presentation.git`; public repository, default branch `main`, existing Pages deployment.
- Starting HEAD: `b9e1c2c`; four unpublished commits above `origin/main` (`fdd4da7`). All history is preserved.
- Latest questionnaire experiences, six optimized portraits and provenance, animations, prompt records, before/after screenshots and 20 golden ranking fixtures are included.
- The copied environment referenced a missing C: Anaconda interpreter. It was preserved as ignored `.venv-migrated-backup`. Python 3.11.9 was installed under ignored `.tools/python` on D:, and `.venv` rebuilt with pinned Pillow 10.4.0. `pip check` passes.
- Runtime source contains no absolute project paths. Edge's C: installation path is valid; historical records remain historical.
- Environments, tools, caches, raw test outputs and the unrelated research ZIP are excluded from Git. No existing work was deleted.

## Verification on D:

- Python: 26 tests pass, including ranking parity, portrait hashes and byte-for-byte animation regeneration.
- Joey: 41 checks; retained UX: 91; final layout: 101; chart layout: 18; PIVOT rules: 33; WebGL recovery: 14. All pass.
- Profile layout: 36 viewport cases, zero failures/errors.
- All-slide capture: 18 checks pass, 17 slides at desktop 1440×1000 and mobile 390×844. Updated questionnaire and portraits confirmed in fresh captures.
- Runtime JavaScript syntax checks pass; `tests/publication-integrity.cjs` checks local runtime/document references.
- Full regression: 433 checks pass, zero unexpected errors/external requests. Three renderer errors are expected from deliberate no-WebGL tests.
- Profile interaction: 267 checks pass, including all 20 golden fixtures. Clean static presentation: 13 checks pass; profile fallback: 34 checks pass. One initial static run failed after the local transport omitted `v06.js`; three unchanged reruns passed before publication.
- The local server now prefers `.venv` without requiring a registered Windows launcher. A fresh server with no interpreter override successfully executed the real Python recommendation worker.
- [Fresh desktop/mobile contact sheets and JSON reports](../screenshots/final-publication/) preserve the migration run evidence. Earlier images remain unchanged.

## Published release

Product commit: `371ab83082510f9636d7a315489f4faa6f98b9fd`, pushed normally to `origin/main`, preserving all previous commits. GitHub's [Pages build and deployment](https://github.com/liatkaf/friends-interactive-presentation/actions/runs/42273479747) completed successfully for that exact SHA. A subsequent documentation commit records this verified outcome without changing runtime files.

- Repository: https://github.com/liatkaf/friends-interactive-presentation
- Live presentation: https://liatkaf.github.io/friends-interactive-presentation/
- [Published browser verification](../screenshots/final-publication/final-pages-verification.json): seven checks, 17 slides, seven original figures, six painted portraits, genuine mug and stairwell, zero unexpected errors.
- [Published profile suite](../screenshots/final-publication/published-profile-static-results.json): 34 checks pass, including 20 baseline-equivalent rankings, static matching and full reset.
- [Published asset verification](../screenshots/final-publication/published-assets.json): all 77 runtime/source-data/portrait/animation/research/vendor files match committed Git blobs byte-for-byte. Windows CRLF working-copy differences are excluded by comparing Git blobs directly.

Release status: v1.0 FINAL published and verified. No GitHub Release object or tag was created; no repository permissions were changed. Submission actions below remain the student's responsibility.

Prior evidence remains in `screenshots/v10-final/` and `screenshots/profile-upgrade/`; migration output is in ignored `test-results/`.

## University actions remaining

Check actual Moodle instructions, deadline, required formats, presentation duration and submission fields. Submit repository/demo links and required files, reflection or video; confirm receipt and lecturer access. Physical-device testing, formal screen-reader testing and independent human academic review remain unperformed. Approved scope remains 17 slides.
