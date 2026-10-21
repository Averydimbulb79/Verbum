# Changelog

## Unreleased — Verbum 2.0 / Phase 0
- Created dedicated rewrite and rollback branches.
- Added Microsoft Word behavioural parity matrix and staged roadmap.
- Registered candidate components and explicit selection gates.
- Established development groundwork without changing production Verbum.
- Added React/TypeScript/Vite + Tiptap editing prototype, basic Home/File ribbon and structured v3 native document serialization.
- Added unit tests, Electron desktop scaffold and GitHub Actions web/Windows build workflow (build status not yet verified).
- Legacy v1 document import is intentionally blocked until migration is implemented.

## 2.0.0-alpha.1 — CI hardening (unverified)
- Separated web and desktop asset paths; Electron builds now use relative URLs suitable for local file loading.
- Added Windows installer and portable EXE artifact workflow; version-tagged successful builds can be attached to GitHub prereleases.
- Production GitHub Pages remains untouched. A separate hosted v2 preview URL has not yet been provisioned.
- Build execution and installer runtime testing are still pending; do not treat workflow configuration as proof of a successful build.
