# Atlas v2

The homepage now introduces four user intentions. Six focused destinations replace the long index: credentials, personal pathway, schools, costs, practice, resources. Existing theory and practice content remains intact.

- Five shared navigation destinations; legacy homepage anchors redirect to their new destination.
- One guided beginner journey, with a ten-step visual map. Original `cp_start_v2`, `cp_progress`, `cp_map_done` and preference keys are preserved. Old map completion is not treated as completion of different guided lessons.
- Chapter reading for theory, individual coaching and team coaching, with deep links, browser history, saved chapter and full-document/print mode.
- Credential and transition details render inline, with shareable fragment URLs and keyboard access.
- School directory: query, accreditation, listed location/format, online availability, ten results per page, comparison of up to three schools. No invented prices or accreditation claims.
- Path advisor uses the existing credential data. It gives orientation, not an eligibility decision.
- PWA installation is offered only after a completed guided step. New pages and versioned assets are included in offline precaching.
- Feedback opens a user-reviewed GitHub issue draft. It requires a GitHub account and sends nothing automatically. No third-party analytics or aggregate visitor measurement is enabled.

## Validation

`npm run check` validates syntax, local references, translations and version consistency. `npm run qa` / `npm run qa:atlas` run v2 DOM integration tests for every page, filters, comparison limits, language, chapters, detail views and retained progress. `npm run qa:start` retains the 48 guided-journey tests (requires a server on port 3000).

The old `qa:legacy`, `qa:polish`, `qa:mobile` and `qa:itil` scripts describe v1.7's monolithic homepage and are historical diagnostics, not v2 release gates. Their old reports do not establish v2 visual accessibility or real-device compatibility. DOM tests are not a substitute for a browser visual audit.

## Deployment and rollback

Render receives a normal commit on main. Both Node routes and Render rewrites include all new pages. GitHub Pages remains supported using relative asset and page links; canonical URLs now identify Render as the primary site.

To roll back, revert the v2 commit and deploy. Progress is retained in the same storage keys. Do not reuse an old service-worker version for later releases.
