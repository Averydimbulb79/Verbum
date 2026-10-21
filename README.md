# Verbum

**Your words. Your way.** A free, single-user word processor built for the browser, with a familiar ribbon interface.

[Web application](https://averydimbulb79.github.io/Verbum/) · [Roadmap](ROADMAP.md) · [Word compatibility scope](WORD_PARITY.md) · [Changelog](CHANGELOG.md)

## Verbum 2.0 — web-first rewrite

The React, TypeScript, Vite and Tiptap editor is under active development. The existing 1.1 application is archived under [legacy/](legacy/) and the complete pre-transition source is preserved in [backup/pre-web-first-main](../../tree/backup/pre-web-first-main).

**Status:** The modular v2 scaffold is not yet a verified production release. Browser build, legacy-document migration, pagination and DOCX fidelity still require testing and implementation. Windows packaging is intentionally deferred until the web version is accepted.

## Local development

Requires Node.js 22 or later.

```bash
npm install
npm run dev
npm test
npm run build
```

The Vite development server prints a local URL, usually `http://localhost:5173/`.

## Architecture

- React + TypeScript + Vite for the interface.
- Tiptap/ProseMirror for structured editing.
- Native `.verbum` JSON document format for the new editor.
- Modular pagination and document-format interoperability planned in stages.
- Electron remains an optional Windows packaging target after web acceptance.

## Important limitations

- Legacy `.verbum` documents are not yet supported by the v2 importer. Preserve original files.
- The page shown by the current v2 prototype is a visual canvas, not accurate Word-style pagination.
- Unsupported ribbon tabs are identified as planned, not functional.
- Windows packaging scripts exist but are not proof of a tested executable.

See [ROADMAP.md](ROADMAP.md) for milestones, [docs/COMPONENTS.md](docs/COMPONENTS.md) for engine choices, and [CHANGELOG.md](CHANGELOG.md) for release history.

### Alpha 12 — Word-style ribbon foundations
Design, Layout, References, Review and View now follow the reference screenshots' group order and compact icon layout. Working controls: document theme previews, page colour, portrait/landscape orientation, margin presets, ruler/navigation visibility, zoom, Focus/fullscreen, and word-count reporting. Advanced layout, citations, review/track changes and other unsupported operations are visibly disabled rather than simulated. Collaboration, speech and previously excluded specialised tools remain out of scope. Working checkpoint: `backup/pre-design-layout-references-review-view-ribbons`. Browser/build verification is pending.

### Alpha 13 — View ribbon routing fix
Removed the obsolete View tab branch in `src/App.tsx`, which previously intercepted View before the new Word-style ribbon could render. View now uses `src/WordRibbons.tsx`, exposing Views, Immersive, Page Movement, Show, Zoom, Dark Mode, Window and Templates groups. Advanced functions remain disabled until implemented. Checkpoint: `backup/pre-view-ribbon-routing-fix`.

### Alpha 14 — File workspace and templates
- Restyled the File Backstage workspace with document preview cards, eight editable starter templates, category filtering and template search.
- File navigation supports Home, New, Open, Info, Recover, Save, Save As, Print, Export, Close and Options.
- Recent documents are stored locally in this browser on save; recovery snapshots are optionally stored locally while editing. These are not cloud backups.
- Export supports editable `.verbum`, HTML and plain text. PDF is available through the browser Print → Save as PDF workflow; DOCX/RTF remain future work.
- Native `.verbum` remains the preservation format. Template creation asks before replacing the current document.
- Rollback checkpoint: `backup/pre-file-workspace-completion`. Browser build verification is pending.

### Alpha 15 — Template previews and recovery controls
- Replaced generic template thumbnail lines with distinct miniature document layouts for letters, résumés, meeting notes, reports, proposals, newsletters and invoices.
- Styled the Recover screen's Discard snapshot as a clearly identifiable secondary destructive action, consistent with the primary Restore button.
- The thumbnails are visual previews; fully styled editable document templates and browser verification remain separate follow-up work.

### Alpha 15 — Insert + Design functional pass
Insert: editable basic tables (2–6 rows, 2–5 columns), embedded image files (up to 3 MB), HTTP(S)/mailto links, native page-break nodes, cover heading block, date/time, divider and expanded symbols. Simple header/footer text, page number display and blockquote-style text blocks are experimental. Tables lack Word-level row/column editing; the editor is not a paginated layout engine. Images are embedded in `.verbum` JSON as data URLs, increasing file size. Design: six visual presets, font family, theme accent colour, paragraph line spacing, page colour, watermark, page border and browser-local design defaults. Some page-level Design settings and header/footer settings are not yet persisted in `.verbum` documents; treat the native document as preserving editor content, not complete page layout. Unsupported illustrations, equations and collaboration remain disabled. Backup: `backup/pre-insert-design-functional-pass`. Build/browser validation pending.

### Alpha 16 — Contextual Table ribbon
When the editor selection enters a table cell, a contextual **Table** tab appears and opens automatically. It provides insertion of rows above/below, insertion of columns before/after, deletion of rows/columns, and deletion of the table. Leaving the table hides the contextual tab and restores Home. This first implementation rebuilds the table for structural edits; advanced cell styling, merging/splitting and preservation of complex selections are not yet supported. Rollback checkpoint: `backup/pre-contextual-table-tab`. Build/browser verification pending.
