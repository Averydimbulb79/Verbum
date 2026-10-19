# Verbum
Your words. Your way.

A free, single-user, browser-based word processor with a familiar ribbon interface.

**App URL (after GitHub Pages activation):** https://averydimbulb79.github.io/Verbum/

## Version 1.0.0: Initial foundation

| Area | Implemented |
| --- | --- |
| Interface | File, Home, Insert, Layout, Review, View ribbon tabs; light/dark mode |
| Editing | Common rich-text formatting, headings, lists, alignment, undo/redo |
| Layout | A4 and Letter, orientation, margins, zoom |
| Files | Native .verbum, basic RTF import/export, HTML/TXT import, HTML export |
| Utilities | Find/replace, word count, browser spellcheck, print, local autosave |

### Known limitations
- RTF import currently extracts text and paragraph breaks but does not retain complex formatting. RTF export handles basic inline formatting, not full RTF fidelity.
- Use the native .verbum format to preserve editable HTML formatting.
- Pagination is not yet Word-equivalent; the document is a flowing editor canvas.
- Images inserted from URLs are not embedded into RTF.
- Browser autosave is not a substitute for saving a file or making backups.

## Roadmap
| Version | Milestone |
| --- | --- |
| 1.x | RTF round-trip, robust local save/reopen, editor reliability, pagination |
| 2.0 | Tables, images, styles, headers/footers, navigation, references |
| 3.0 | Templates, print-ready PDF, review tools, offline PWA |
| 4.0 | DOCX import/export and compatibility testing |

## Use
Open index.html in a modern browser, or enable GitHub Pages under Settings → Pages → Deploy from a branch → main → /(root).

## Release policy
Maintain README with every release. Use Git checkpoints for rollback. Validate document reopening and export before marking a feature complete. Collaboration and user accounts are out of scope.

## License
MIT, see LICENSE.
