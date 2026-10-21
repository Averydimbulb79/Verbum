# Microsoft Word behavioural parity

Reference: Microsoft Word desktop (specific version/build to be recorded with test environment). WordCraft is a secondary technical benchmark, not the primary behavioural specification.

## Status vocabulary
Not started → Prototype → Implemented → Behaviour verified → Fidelity verified → Released.

## Acceptance matrix
| Area | Required behaviour | Verification | Status |
| --- | --- | --- | --- |
| Typing | IME, composition, selections, cursor, clipboard | Keyboard and composition tests | Not started |
| History | Undo/redo groups typing and format operations predictably | Transaction tests | Not started |
| Formatting | Font, paragraph, styles, formatting retention | Round-trip and interaction tests | Not started |
| Lists | Enter continues; empty Enter exits; Tab/Shift+Tab nesting | Word-reference interaction tests | Not started |
| Tables | Selection, Tab navigation, merge/split, resize, rows/columns | Keyboard/mouse tests | Not started |
| Pages | Margins, sections, breaks, headers/footers, reflow | Visual/page-count comparison | Not started |
| Images | Inline/floating, resize, wrap, positioning | Layout tests | Not started |
| DOCX | Import, edit, export without silent loss | Round-trip fixture corpus | Not started |
| References | TOC, notes, captions, citations | Persistence and update tests | Not started |
| Review | Comments, tracked changes, accept/reject | Review transaction tests | Not started |
| View | Rulers, zoom, print/web view, focus, full screen | UI tests | Not started |
| Performance | Low-latency typing, incremental rendering | Automated profiling | Not started |

## Scope exclusions
No Mailings tab, cloud collaboration, accounts, subscriptions, password protection, translation, embedded audio/video or other previously excluded functions. Functional and behavioural parity applies to the approved scope, not every Microsoft Word feature.

## Evidence rule
Mark a behaviour verified only with a reproducible test and expected result. Presence of a button or command does not count.
