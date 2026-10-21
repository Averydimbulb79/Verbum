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
