# Verbum 2.0 — Development roadmap

Status: Phase 0 (component validation). Production stays on main. Work occurs on rewrite/v2.

## Product objective
Progressively mirror Microsoft Word desktop editing behaviour, workflows, supported functions and document fidelity, excluding cloud collaboration, Mailings and previously rejected features. Maintain an independent Verbum interface, fast interaction, offline-first storage, browser delivery and Windows Electron packaging.

## Engineering principles
- A command is complete only when behaviour, undo/redo, persistence and regression tests pass.
- One document model and shared application logic for browser and Electron.
- Do not couple React rendering to each keystroke.
- Preserve compatibility with v1 .verbum files; never silently discard unsupported content.
- Incremental pagination, viewport-aware rendering and worker-based expensive tasks.
- Benchmark against WordCraft where feasible; use Microsoft Word desktop as behavioural reference.
- Record licence, version, dependencies and security review for every adopted component.
- No empty ribbon commands.

## Milestones and gates
| Milestone | Scope | Exit gate |
| --- | --- | --- |
| Phase 0 | Component audit, licence review, benchmarks, architecture spikes | Evidence-based engine decision |
| 2.0 | React/TS/Vite foundation, command registry, responsive shell, Electron, CI | Browser and Windows smoke builds |
| 2.1 | Structured editing, selection, history, styles, lists, native save/migration | Native round-trip regression suite |
| 2.2 | Incremental layout, pages, headers, footers, sections, rulers | 100-page benchmark and layout tests |
| 2.3 | Tables, images, shapes, wrapping, contextual ribbons | Object editing and persistence tests |
| 2.4 | DOCX import/export, RTF, PDF, EPUB | Compatibility corpus with documented loss policy |
| 2.5 | References, citations, comments, tracked changes, compare | Review/reference persistence tests |
| 2.6 | Equations, charts, diagrams, advanced UI | Word-like behaviour tests |
| 2.7 | Accessibility, performance, packaging, hardening | Release acceptance and installer tests |

## Performance budgets (provisional, validate on reference hardware)
- Typing and caret input response p95 <16 ms.
- Common ribbon command feedback <50 ms.
- Typical 20-page native open <1 s.
- Indexed find in 100 pages <200 ms.
- 100-page scroll target ~60 FPS.
- Autosave must not block typing.
- Track long tasks, layout invalidation, memory, heap growth, startup and document fidelity.

## Phase 0 work items
1. Inventory current Verbum features, data model and migration constraints.
2. Prototype ProseMirror core and Tiptap wrapper; compare extension complexity and licences.
3. Prototype editable pagination; reject print-only pagination as a substitute.
4. Test DOCX round trips; assess Mammoth as semantic importer only and docx.js as exporter only.
5. Validate React rendering isolation and worker boundaries.
6. Build representative 5-, 50-, 200- and 500-page fixtures.
7. Establish GitHub Actions for web validation and Windows packaging.
8. Decide whether any WordCraft Rust/WASM components are worth integrating after a document-model feasibility test.

## Release management
- main: existing published application until v2 acceptance.
- backup/pre-v2-rewrite: immutable pre-rewrite checkpoint.
- rewrite/v2: development branch.
- Update README, ROADMAP, WORD_PARITY and CHANGELOG with every milestone.
- No claim of build or runtime success without an executed test.
