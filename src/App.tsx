import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { FontSize } from './typography';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { parseDocument, serializeDocument } from './document';

const iconPaths: Record<string, string> = { save:'M4 3h14l3 3v15H3V3h1zm2 0v7h11V3M6 21v-8h12v8', undo:'M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12', redo:'m15 14 5-5-5-5m5 5H10a6 6 0 0 0 0 12', fullscreen:'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5', bold:'M7 4h6a4 4 0 0 1 0 8H7zm0 8h7a4 4 0 0 1 0 8H7z', italic:'M14 4h6M4 20h6M15 4 9 20', underline:'M6 3v8a6 6 0 0 0 12 0V3M4 21h16', bullets:'M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01', numbers:'M10 6h11M10 12h11M10 18h11M4 5h2v4M4 13c2-2 4 0 0 3h3', left:'M4 6h16M4 10h10M4 14h16M4 18h10', center:'M4 6h16M7 10h10M4 14h16M7 18h10', right:'M4 6h16M10 10h10M4 14h16M10 18h10', file:'M13 2H5v20h14V8l-6-6zm0 0v6h6M12 12v7m-3-3.5h6', open:'M3 7V5h7l2 3h9v4M3 20l3-10h16l-3 10z', paragraph:'M18 4H9a5 5 0 0 0 0 10h3m0-10v17m4-17v17', heading1:'M4 5v14M12 5v14M4 12h8M18 9v10m-3-7 3-3', heading2:'M4 5v14M12 5v14M4 12h8M15 11a3 3 0 0 1 6 0c0 3-6 4-6 8h6', plus:'M5 12h14M12 5v14', minus:'M5 12h14', quote:'M10 6H5v7h5l-3 5M20 6h-5v7h5l-3 5', linebreak:'M4 7h16M4 11h10m0 0-3-3m3 3-3 3M4 18h16', normal:'M5 4h14M5 9h14M5 14h10M5 19h14', cut:'M7 7l10 10M17 7 7 17M6 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4M6 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4', copy:'M8 8h12v13H8zM4 16H3V3h13v2', paste:'M8 4h3a2 2 0 0 1 4 0h3v4H8zM6 7H4v14h16V7h-2', date:'M4 5h16v16H4zM8 3v4M16 3v4M4 10h16M8 14h3M8 18h3', time:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7v5l4 2' };
function Glyph({name}:{name:string}) { return <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={iconPaths[name] || iconPaths.paragraph}/></svg>; }
const googleFonts = ['Arial', 'Calibri', 'Georgia', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Merriweather', 'Playfair Display', 'Poppins', 'Inter', 'Nunito', 'Source Sans 3', 'Noto Sans', 'Noto Serif'];
const fontSizes = [8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72];
const tabs = ['File', 'Home', 'Insert', 'Design', 'Layout', 'References', 'Review', 'View'];
export default function App() {
  const [tab, setTab] = useState('Home');
  const [name, setName] = useState('Untitled document');
  const [notice, setNotice] = useState('Phase 0 prototype — not Word-compatible yet');
  const picker = useRef<HTMLInputElement>(null);
  const [zoom, setZoom] = useState(100);
  const [mobileRibbon, setMobileRibbon] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [stylesOpen, setStylesOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [fileOpen, setFileOpen] = useState(false);
  const [fileSection, setFileSection] = useState('Home');
  const [navigationQuery, setNavigationQuery] = useState('');
  const [navigationMode, setNavigationMode] = useState<'Headings'|'Pages'|'Results'>('Headings');
  const editor = useEditor({
    extensions: [StarterKit, Underline, TextStyle, Color, FontFamily, FontSize, TextAlign.configure({ types: ['heading', 'paragraph'] })],
    content: '<h1>Welcome to Verbum 2.0</h1><p>This is the new structured editing engine prototype.</p>',
    onUpdate: ({ editor }) => setWordCount(editor.getText().trim().split(/\s+/).filter(Boolean).length),
    editorProps: { attributes: { 'aria-label': 'Document editor', class: 'editor-content' } },
  });
  const run = (fn: () => void) => { fn(); editor?.commands.focus(); };
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); save(); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'o') { event.preventDefault(); picker.current?.click(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });
  useEffect(() => {
    const onChange = () => setFullScreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { setNotice('Fullscreen is unavailable in this browser'); }
  };
  function save() {
    if (!editor) return;
    const blob = new Blob([serializeDocument(name, editor.getJSON())], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = (name.replace(/\.verbum$/i, '').replace(/[^a-z0-9 _.-]/gi, '_') || 'Untitled document') + '.verbum'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice('Saved structured .verbum file');
  }
  async function open(file?: File) {
    if (!file || !editor) return;
    try {
      const data = parseDocument(await file.text());
      editor.commands.setContent(data.content as Parameters<typeof editor.commands.setContent>[0]);
      setName(data.name); setWordCount(editor.getText().trim().split(/\s+/).filter(Boolean).length); setNotice('Opened ' + file.name);
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Unable to open file'); }
  }
  const copyClipboard = async (cut: boolean) => {
    if (!editor || editor.state.selection.empty) { setNotice('Select text first'); return; }
    const {from, to} = editor.state.selection;
    const selected = editor.state.doc.textBetween(from, to, '\n');
    try {
      await navigator.clipboard.writeText(selected);
      if (cut) editor.chain().focus().deleteRange({from, to}).run();
      setNotice(cut ? 'Cut selection' : 'Copied selection');
    } catch { setNotice('Clipboard blocked; use Ctrl+' + (cut ? 'X' : 'C')); }
  };
  const pasteClipboard = async () => {
    if (!editor) return;
    try { const value = await navigator.clipboard.readText(); editor.chain().focus().insertContent(value).run(); setNotice('Pasted text'); }
    catch { setNotice('Clipboard blocked; use Ctrl+V'); }
  };
  const setFontSize = (size: number) => run(() => editor?.chain().focus().setMark('textStyle', { fontSize: size + 'pt' }).run());
  const stepFontSize = (direction: number) => { const current = parseFloat(String(editor?.getAttributes('textStyle').fontSize || '11')); const next = fontSizes[direction > 0 ? fontSizes.findIndex(n => n > current) : [...fontSizes].reverse().findIndex(n => n < current)]; if (direction > 0) setFontSize(next || 72); else { const smaller = [...fontSizes].reverse().find(n => n < current); setFontSize(smaller || 8); } };
  const cmd = (label:string, icon:string, action:()=>void, pressed?:boolean) => <button key={label} title={label} aria-label={label} aria-pressed={pressed} onClick={action}><Glyph name={icon}/><span className="command-label">{label}</span></button>;
  const group = (title:string, children:ReactNode) => <section className="ribbon-group"><div className="ribbon-tools">{children}</div><small>{title}</small></section>;
  const outline = editor?.getJSON().content?.filter(node => node.type === 'heading').map((node,i) => ({ id:i, level:node.attrs?.level || 1, text:node.content?.map(c=>c.text || '').join('') || 'Untitled heading' })) || [];
  const fileItems = ['Home','New','Open','Info','Recover','Save','Save As','Print','Export','Close','Options'];
  const startTemplate = (kind: string) => {
    if (!editor || !window.confirm('Create a new document? Unsaved changes will be lost.')) return;
    const contents: Record<string,string> = {
      'Blank document':'<p></p>',
      'Letter':'<p>Dear Recipient,</p><p></p><p>Sincerely,</p><p>Your Name</p>',
      'Résumé':'<h1>Your Name</h1><p>Contact information</p><h2>Experience</h2><p></p><h2>Education</h2><p></p><h2>Skills</h2><p></p>',
      'Meeting notes':'<h1>Meeting Notes</h1><p>Date:</p><h2>Attendees</h2><p></p><h2>Agenda</h2><p></p><h2>Action Items</h2><p></p>'
    };
    editor.commands.setContent(contents[kind] || '<p></p>');setName(kind==='Blank document'?'Untitled document':kind);setWordCount(0);setFileOpen(false);
  };
  const fileAction = (item:string) => {
    if(item==='Save'||item==='Save As'){save();return;}
    if(item==='Open'){picker.current?.click();return;}
    if(item==='Print'){setFileSection('Print');return;}
    if(item==='Close'){setFileOpen(false);return;}
    setFileSection(item);
  };
  return <div className={mobileRibbon ? 'app ribbon-open' : 'app'}>
    <header className="titlebar"><span className="brand">verbum.</span><span className="version">v2.0.0-alpha.11</span><input className="document-name" aria-label="Document name" value={name} onChange={e => setName(e.target.value)} />
      <div className="quick-actions">{cmd('Save document','save',save)}{cmd('Undo','undo',()=>run(()=>editor?.chain().focus().undo().run()))}{cmd('Redo','redo',()=>run(()=>editor?.chain().focus().redo().run()))}</div>
      <span className="save-state" title={notice}>{notice}</span>{cmd(fullScreen?'Exit fullscreen':'Fullscreen','fullscreen',()=>void toggleFullscreen())}
    </header>
    <nav className="tabs" aria-label="Ribbon tabs">{tabs.map(t => <button key={t} className={tab === t ? 'active' : ''} onClick={() => {if(t==='File'){setFileOpen(true);setFileSection('Home');}else{setTab(t);setFileOpen(false);}setMobileRibbon(false);}}>{t}</button>)}</nav>
    <div className="mobile-controls"><button onClick={()=>setMobileRibbon(v=>!v)} aria-expanded={mobileRibbon}>☰ Tabs</button><button onClick={()=>{setNavOpen(v=>!v);setStylesOpen(false)}}>☰ Outline</button><button onClick={()=>{setStylesOpen(v=>!v);setNavOpen(false)}}>Styles</button></div>
    {mobileRibbon && <button className="drawer-backdrop" aria-label="Close ribbon" onClick={()=>setMobileRibbon(false)}/>}
    <div className="ribbon" role="toolbar" aria-label={tab + ' ribbon'}>
      {tab === 'Home' ? <>
        
        {group('Clipboard',<><div className="clipboard-layout"><div className="paste-major">{cmd('Paste','paste',()=>void pasteClipboard())}<span>Paste</span></div><div className="clipboard-minor">{cmd('Cut','cut',()=>void copyClipboard(true))}{cmd('Copy','copy',()=>void copyClipboard(false))}<button title="Format Painter is planned" disabled><Glyph name="copy"/><span>Format</span></button></div></div></>)}
        {group('Font',<><div className="font-controls"><select aria-label="Font family" defaultValue="Arial" onChange={e=>run(()=>editor?.chain().focus().setFontFamily(e.target.value).run())}>{googleFonts.map(font=><option key={font}>{font}</option>)}</select><select aria-label="Font size" defaultValue="11" onChange={e=>setFontSize(Number(e.target.value))}>{fontSizes.map(size=><option key={size}>{size}</option>)}</select><button title="Increase font size" onClick={()=>stepFontSize(1)}>A+</button><button title="Decrease font size" onClick={()=>stepFontSize(-1)}>A−</button></div><div className="font-buttons">{cmd('Bold','bold',()=>run(()=>editor?.chain().focus().toggleBold().run()),editor?.isActive('bold'))}{cmd('Italic','italic',()=>run(()=>editor?.chain().focus().toggleItalic().run()),editor?.isActive('italic'))}{cmd('Underline','underline',()=>run(()=>editor?.chain().focus().toggleUnderline().run()),editor?.isActive('underline'))}<button title="Strike through" onClick={()=>run(()=>editor?.chain().focus().toggleStrike().run())}>S̶</button><label className="color-picker" title="Font colour">A<input type="color" aria-label="Font colour" defaultValue="#202020" onChange={e=>run(()=>editor?.chain().focus().setColor(e.target.value).run())}/></label><button title="Clear formatting" onClick={()=>run(()=>editor?.chain().focus().unsetAllMarks().run())}>Tx</button></div></>)}
        {group('Paragraph',<><div className="paragraph-grid">{cmd('Bullets','bullets',()=>run(()=>editor?.chain().focus().toggleBulletList().run()))}{cmd('Numbering','numbers',()=>run(()=>editor?.chain().focus().toggleOrderedList().run()))}{cmd('Align left','left',()=>run(()=>editor?.chain().focus().setTextAlign('left').run()))}{cmd('Align centre','center',()=>run(()=>editor?.chain().focus().setTextAlign('center').run()))}{cmd('Align right','right',()=>run(()=>editor?.chain().focus().setTextAlign('right').run()))}{cmd('Justify','left',()=>run(()=>editor?.chain().focus().setTextAlign('justify').run()))}</div></>)}
        {group('Styles',<div className="style-gallery">{[{name:'Normal',tag:'AaBbCcDd',icon:'normal',action:()=>editor?.chain().focus().setParagraph().run()},{name:'No Spacing',tag:'AaBbCcDd',icon:'normal',action:()=>editor?.chain().focus().setParagraph().run()},{name:'Heading 1',tag:'AaBbCc',icon:'heading1',action:()=>editor?.chain().focus().toggleHeading({level:1}).run()},{name:'Heading 2',tag:'AaBbCc',icon:'heading2',action:()=>editor?.chain().focus().toggleHeading({level:2}).run()}].map(style=><button key={style.name} className={'style-preview '+(style.name==='Normal'?'style-selected':'')} title={style.name} onClick={()=>run(style.action)}><span>{style.tag}</span><small>{style.name}</small></button>)}</div>)}
        {group('Editing',<div className="editing-actions"><button onClick={()=>{setNavigationMode('Results');}}><Glyph name="normal"/>Find</button><button disabled title="Replace is planned"><Glyph name="copy"/>Replace</button><button disabled title="Selection tools are planned"><Glyph name="normal"/>Select</button></div>)}
      </> : tab === 'File' ? group('Document',<>{cmd('New','file',()=>{if(confirm('Start a new document? Unsaved changes will be lost.')){editor?.commands.setContent('<p></p>');setName('Untitled document');setWordCount(0)}})}{cmd('Open','open',()=>picker.current?.click())}{cmd('Save As','save',save)}</>) : tab === 'View' ? <>{group('Zoom',<>{cmd('Zoom out','minus',()=>setZoom(z=>Math.max(50,z-10)))}<output>{zoom}%</output>{cmd('Zoom in','plus',()=>setZoom(z=>Math.min(200,z+10)))}<button onClick={()=>setZoom(100)}>100%</button></>)}{group('Window',cmd(fullScreen?'Exit fullscreen':'Fullscreen','fullscreen',()=>void toggleFullscreen()))}</> : tab === 'Insert' ? <>
        {group('Pages',<div className="insert-stack"><button disabled title="Cover Page requires template support">▤ <span>Cover Page ▾</span></button><button onClick={()=>startTemplate('Blank document')} title="New blank document">♧ <span>Blank Page</span></button><button disabled title="Page Break requires pagination support">↵ <span>Page Break</span></button></div>)}
        {group('Tables',<div className="insert-major"><button disabled title="Tables require a table extension"><span className="insert-symbol">▦</span><span>Table ▾</span></button></div>)}
        {group('Illustrations',<div className="insert-cluster"><button disabled title="Pictures require image insertion support"><span className="insert-symbol">▧</span>Pictures</button><button disabled title="Shapes require drawing support"><span className="insert-symbol">◩</span>Shapes ▾</button><div className="insert-stack"><button disabled title="Icons are planned">◉ Icons</button><button disabled title="SmartArt is planned">♧ SmartArt</button><button disabled title="Charts are planned">▥ Chart</button></div></div>)}
        {group('Links',<div className="insert-stack"><button disabled title="Hyperlink editing is planned">↗ Link</button><button disabled title="Bookmarks are planned">⚑ Bookmark</button><button disabled title="Cross-references are planned">↳ Cross-reference</button></div>)}
        {group('Comments',<div className="insert-major"><button disabled title="Comments require document annotations"><span className="insert-symbol">▣</span>Comment</button></div>)}
        {group('Header & Footer',<div className="insert-cluster"><button disabled title="Headers are planned"><span className="insert-symbol">▤</span>Header ▾</button><button disabled title="Footers are planned"><span className="insert-symbol">▤</span>Footer ▾</button><button disabled title="Page numbers require pagination"><span className="insert-symbol">＃</span>Page Number ▾</button></div>)}
        {group('Text',<div className="insert-cluster"><button disabled title="Text boxes require positioned content"><span className="insert-symbol">▣</span>Text Box</button><div className="insert-stack"><button disabled title="Quick Parts are planned">▦ Quick Parts ▾</button><button disabled title="WordArt is planned">A WordArt ▾</button><button disabled title="Drop Cap is planned">▤ Drop Cap ▾</button></div><div className="insert-stack"><button title="Insert date" onClick={()=>run(()=>editor?.chain().focus().insertContent(new Intl.DateTimeFormat(undefined,{dateStyle:'long'}).format(new Date())).run())}><Glyph name="date"/> Date</button><button title="Insert time" onClick={()=>run(()=>editor?.chain().focus().insertContent(new Intl.DateTimeFormat(undefined,{timeStyle:'short'}).format(new Date())).run())}><Glyph name="time"/> Time</button><button title="Insert horizontal divider" onClick={()=>run(()=>editor?.chain().focus().setHorizontalRule().run())}><Glyph name="minus"/> Divider</button></div></div>)}
        {group('Symbols',<div className="insert-cluster"><button disabled title="Equation editor is planned"><span className="insert-symbol">π</span>Equation ▾</button><div className="insert-symbol-menu"><span className="insert-symbol">Ω</span><select aria-label="Insert symbol" value="" onChange={e=>{if(e.target.value)run(()=>editor?.chain().focus().insertContent(e.target.value).run())}}><option value="">Symbol ▾</option>{['©','®','—','•','°','±','÷','×','€','£','¥','§','¶','∞','Ω','π'].map(v=><option key={v} value={v}>{v}</option>)}</select></div></div>)}
      </> : group(tab,<span className="ribbon-note">Features under development</span>)}
    </div>
    <main className="workspace">
      <aside className={'side-pane navigation-pane'+(navOpen?' pane-open':'')}><h3>Navigation</h3><input className="navigation-search" aria-label="Search document" placeholder="Search document" value={navigationQuery} onChange={e=>setNavigationQuery(e.target.value)}/><div className="navigation-modes">{(['Headings','Pages','Results'] as const).map(mode=><button key={mode} className={navigationMode===mode?'selected':''} onClick={()=>setNavigationMode(mode)}>{mode}</button>)}</div>{navigationMode==='Headings' ? (outline.filter(h=>h.text.toLowerCase().includes(navigationQuery.toLowerCase())).length ? outline.filter(h=>h.text.toLowerCase().includes(navigationQuery.toLowerCase())).map(h=><div className={'outline-item h'+h.level} key={h.id}>{h.text}</div>) : <p className="pane-hint">No matching headings.</p>) : <p className="pane-hint">{navigationMode==='Pages'?'Page thumbnails are planned.':'Document search results are planned.'}</p>}</aside>
      <div className="document-area"><div className="document-stage" style={{zoom:zoom+'%'}}><div className="horizontal-ruler" aria-label="Horizontal page ruler"><div className="ruler-printable"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span></div></div><div className="sheet-row"><div className="vertical-ruler" aria-label="Vertical page ruler"><div className="ruler-vertical-printable">{Array.from({length:9},(_,i)=><span key={i}>{i}</span>)}</div></div><article className="paper"><EditorContent editor={editor}/></article></div></div></div>
      <aside className={'side-pane styles-pane'+(stylesOpen?' pane-open':'')}><h3>Styles</h3><div className="styles-list"><button onClick={()=>run(()=>editor?.chain().focus().setParagraph().run())}>Normal</button><button onClick={()=>run(()=>editor?.chain().focus().toggleHeading({level:1}).run())}>Heading 1</button><button onClick={()=>run(()=>editor?.chain().focus().toggleHeading({level:2}).run())}>Heading 2</button></div></aside>
    </main>
    <footer className="statusbar"><span>{wordCount} words · {editor?.getText().length || 0} characters</span><span>A4 · Portrait · Verbum 2.0</span><span className="status-zoom"><button onClick={()=>setZoom(z=>Math.max(50,z-10))}>−</button><button onClick={()=>setZoom(100)}>Fit</button><output>{zoom}%</output><button onClick={()=>setZoom(z=>Math.min(200,z+10))}>+</button></span></footer>
    {fileOpen && <div className="backstage" role="dialog" aria-modal="true" aria-label="File workspace">
      <aside className="backstage-menu"><button className="backstage-back" onClick={()=>setFileOpen(false)} aria-label="Return to document">‹ <span>Back to document</span></button>{fileItems.map(item=><button key={item} className={fileSection===item?'selected':''} onClick={()=>fileAction(item)}><span className="backstage-menu-icon">{({Home:'⌂',New:'＋',Open:'▱',Info:'ⓘ',Recover:'↶',Save:'▣','Save As':'▤',Print:'▧',Export:'⇥',Close:'×',Options:'⚙'} as Record<string,string>)[item]}</span>{item}</button>)}<div className="backstage-menu-footer">verbum. <small>v2.0.0-alpha.9</small></div></aside>
      <section className="backstage-content"><h1>{fileSection==='Home'?'Welcome to Verbum':fileSection}</h1>
      {(fileSection==='Home'||fileSection==='New') && <><h2>Start a document</h2><div className="template-gallery">{['Blank document','Letter','Résumé','Meeting notes'].map((kind,i)=><button className="template-tile" key={kind} onClick={()=>startTemplate(kind)}><div className="template-preview"><span className="template-line heading"/>{i>0&&<><span className="template-line"/><span className="template-line short"/><span className="template-line"/><span className="template-line short"/></>}</div><span>{kind}</span></button>)}</div>{fileSection==='Home'&&<><h2>Recent</h2><p className="backstage-muted">Recent documents are not yet stored. Open a local .verbum document to continue editing.</p><button className="backstage-primary" onClick={()=>picker.current?.click()}>Browse files</button></>}</>}
      {fileSection==='Open'&&<><p>Open a Verbum document from your device.</p><button className="backstage-primary" onClick={()=>picker.current?.click()}>Browse files</button></>}
      {fileSection==='Info'&&<div className="backstage-info"><p><strong>Name:</strong> {name}</p><p><strong>Words:</strong> {wordCount}</p><p><strong>Format:</strong> Verbum native document (.verbum)</p><p><strong>Document protection:</strong> Not yet available</p></div>}
      {fileSection==='Print'&&<><p>Print the current document using your browser's print dialog.</p><button className="backstage-primary" onClick={()=>window.print()}>Print document</button></>}
      {fileSection==='Export'&&<><p>Download the editable native Verbum document.</p><button className="backstage-primary" onClick={save}>Export .verbum</button><p className="backstage-muted">PDF, DOCX and other export formats are planned.</p></>}
      {['Recover','Options'].includes(fileSection)&&<p className="backstage-muted">This section is planned but not yet available.</p>}
      </section></div>}
    <input ref={picker} type="file" accept=".verbum,application/json" hidden onChange={e => { void open(e.target.files?.[0]); e.target.value = ''; }} />
  </div>;
}
