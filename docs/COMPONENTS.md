# Component evaluation register

All entries are candidates until validated. No dependencies have been installed on this branch.

| Layer | Candidate | Intended role | Risk / investigation |
| --- | --- | --- | --- |
| UI | React + TypeScript + Vite | Responsive application shell | Isolate editor transactions from React rerenders |
| Editing | ProseMirror | Structured document, selections, transactions | Extension cost for Word-like pagination/sections |
| Editing wrapper | Tiptap | Extension and command API | Audit licence of each package; avoid unplanned paid features |
| Tables | prosemirror-tables | Table operations | Test complex cell selection and split/merge |
| State | Zustand | UI state only | Avoid mirroring entire editor state |
| Local data | IndexedDB | Autosave and recovery | Versioned migrations and quota failures |
| Pagination | Custom incremental layout | Editable multi-page view | Highest-risk component; prototype first |
| Print preview | Paged.js | Potential paged output | Not a live editor pagination engine |
| DOCX import | Mammoth (candidate) | Semantic import | Not layout-fidelity solution |
| DOCX export | docx.js (candidate) | OOXML generation | Not a complete DOCX round-trip solution |
| EPUB | JSZip and EPUB serialization | Export | Validate EPUB structure and metadata |
| Desktop | Electron + electron-builder | Windows packaging | Security hardening, package size, unsigned warnings |
| Tests | Vitest + Playwright | Unit, browser and visual tests | Include long-document benchmarks |
| Acceleration | Rust/WASM, optional | Expensive isolated processing | Add only after profiling and model integration study |

## Selection gates
Licence and transitive dependency audit; reproducible versions; active maintenance; accessibility; browser and Windows compatibility; real document fidelity; p95 interaction latency; memory; packaging feasibility.

## WordCraft integration research
WordCraft's Rust engine is a separate architecture. Do not assume its document model can transparently replace ProseMirror. Compare a minimal editable round-trip prototype before attempting Rust/WASM reuse.
