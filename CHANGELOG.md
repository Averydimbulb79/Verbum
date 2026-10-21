## 2.0.0-alpha.5 — Insert ribbon (Alpha 4 baseline)
- Created `backup/alpha4-confirmed-working` before development.
- Added compact Insert ribbon groups: Pages (divider, line break), Text (quote, local date/time), Symbols (© ® — • °).
- Marked Table, Picture and Link as disabled pending their respective editor extensions.
- Preserved the Alpha 4 logo, ribbon icon system, navigation/styles panes, rulers, page geometry and status bar without structural changes.
- Build and browser deployment are not yet independently verified.

## 2.0.0-alpha.6 — UI restoration after regression
- Restored the V1.1-style thin blue `verbum.` logo, monoline icon toolbar, compact tabs, navigation/styles sidebars and bottom status bar.
- Retained the functional Insert ribbon added in alpha.5 (divider, line break, quote, date/time and symbols).
- Kept React render error boundary from previous hotfix.
- This commit is not a verified browser build; visual QA and CI validation are still required.

## 2.0.0-alpha.5 — Compact tabs and Insert ribbon
- Matched the menu-tab typography more closely to V1.1: 13px regular-weight text, tighter padding, compact active state.
- Added functional Insert ribbon groups for divider, line break, block quote, local date/time and five symbols.
- Table, Picture and Link are explicitly disabled until their editor extensions are integrated, rather than appearing functional.
- Kept the stable baseline workspace unchanged to avoid the previous blank-screen regressions.
- Changes committed on `main`; deployment and browser validation pending.

## 2.0.0-alpha.3 — V1.1 visual continuity
- Restored the thin blue `verbum.` wordmark and compact header with document name, quick save/undo/redo and fullscreen controls.
- Rebuilt the ribbon into compact monoline icon groups, retaining Home order: Editing, Clipboard, Font, Paragraph, Styles.
- Recreated the three-column document workspace, navigation and styles panes, ruler visuals, A4 paper dimensions and bottom status/zoom placement.
- Added mobile tab drawer and pane toggles; existing editing commands remain wired to Tiptap.
- Rulers are visual guides, not draggable measurement controls; unsupported functions remain pending.
- Browser deployment and manual visual QA still require confirmation.

## 2.0.0-alpha.2 — Web editor interaction (build unverified)
- Added working View controls for zoom (50–200%), 100% reset, and browser fullscreen.
- Added live word count and zoom status.
- Added Ctrl/Cmd+S download and Ctrl/Cmd+O open shortcuts.
- Prevented duplicated `.verbum` filename extensions on export.
- These changes are committed to `main`; browser build/deployment and manual interaction tests remain unverified.

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
