# Verbum
Your words. Your way.

A free, single-user, browser-based word processor with a familiar ribbon interface.

**App URL (after GitHub Pages activation):** https://averydimbulb79.github.io/Verbum/

## Version 1.0.9: Version number in application header

| Area | Implemented |
| --- | --- |
| Interface | Seven functional ribbon tabs, grouped commands, Navigation and Styles panes, light/dark mode |
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

### 1.0.1 changes
- Replaced broken startup JavaScript that prevented ribbon rendering.
- Added References ribbon, grouped commands, navigation outline and styles sidebar.
- Refined workspace layout to match the approved professional mockup.
- RTF fidelity and true pagination remain planned improvements.

### 1.0.2 changes
- Responsive ribbon: collapsible tools on narrow viewports and scrollable ribbon tabs.
- Compact mobile toolbar for Tools, Outline and Styles.
- Navigation and Styles panes become individually accessible overlays on mobile.
- Desktop keeps the approved ribbon layout with tighter command spacing.
- Note: A4 remains a fixed-size editing canvas; mobile users can scroll to reach the full page. Responsive pagination and improved mobile editing are future work.

### 1.0.3 changes
- Replaced the narrow-screen horizontal ribbon with a left slide-out vertical command drawer.
- Command groups are stacked with larger touch targets and adaptive three-column controls.
- Drawer dismisses on backdrop tap or Escape, with reduced-motion support.
- Full desktop ribbon remains unchanged.

### 1.0.4 changes
- On compact screens, File/Home/Insert/Layout/References/Review/View tabs move into a left slide-out menu.
- The ribbon stays above the document, displaying grouped command buttons.
- Each group opens a compact popup with its existing commands.
- Desktop retains the original horizontal tabs and ribbon.
- Live mobile testing is still required to validate popup placement, keyboard interaction and scrolling.

### 1.0.5 changes
- Document width automatically scales to available viewport space by default, including mobile.
- Added Fit button in status bar and Fit width action under View.
- Manual zoom disables automatic fit until Fit is selected again.
- Browser resize recalculates automatic fit; print resets display zoom.
- Page dimensions remain A4/Letter in the document model.

### 1.0.6 changes
- Replaced text-heavy ribbon command buttons with compact inline SVG icons.
- Tightened desktop toolbar sizing and group spacing based on Microsoft Word proportions.
- Retained command tooltips and accessible button labels.
- Mobile group popups keep larger touch targets with icon-only commands.
- Further visual QA on desktop and Android is recommended.

### 1.0.7 changes
- Ribbon navigation tabs display their full text labels (File, Home, Insert, Layout, References, Review, View).
- Toolbar icons provide descriptive hover tooltips and accessible labels.
- Commands without a dedicated icon use their own short text label rather than repeated generic icons.
- Preserves compact Word-inspired ribbon sizing and responsive mobile controls.

### 1.0.8 changes
- Replaced Save, Undo and Redo quick actions with consistent thin-stroke SVG icons.
- Added horizontal ruler above the document and vertical ruler to the left, with centimetre labels and margin indicators.
- Ruler measurements respond to zoom, page size and orientation; rulers are excluded from print.
- Rulers are display-only at this stage; draggable margin and indent markers are not yet implemented.

### 1.0.9 changes
- Displayed the current version beside the Verbum wordmark in the application header.
- Styled version as a small neutral label that adapts to light/dark mode and mobile widths.
