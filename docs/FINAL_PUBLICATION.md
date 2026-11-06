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
- Profile interaction: 267 checks pass, including all 20 golden fixtures. Clean static presentation: 13 checks pass; profile fallback: 34 checks pass. One initial static run failed after the local transport omitted `v06.js`; the unchanged suite passed on retry. Additional repeated runs check stability before publication.
- The local server now prefers `.venv` without requiring a registered Windows launcher. A fresh server with no interpreter override successfully executed the real Python recommendation worker.
- Deployment outcome is appended after publication.

Prior evidence remains in `screenshots/v10-final/` and `screenshots/profile-upgrade/`; migration output is in ignored `test-results/`.

## University actions remaining

Check actual Moodle instructions, deadline, required formats, presentation duration and submission fields. Submit repository/demo links and required files, reflection or video; confirm receipt and lecturer access. Physical-device testing, formal screen-reader testing and independent human academic review remain unperformed. Approved scope remains 17 slides.
