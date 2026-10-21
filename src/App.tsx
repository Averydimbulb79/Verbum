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
  return <div className={mobileRibbon ? 'app ribbon-open' : 'app'}>
    <header className="titlebar"><span className="brand">verbum.</span><span className="version">v2.0.0-alpha.7</span><input className="document-name" aria-label="Document name" value={name} onChange={e => setName(e.target.value)} />
      <div className="quick-actions">{cmd('Save document','save',save)}{cmd('Undo','undo',()=>run(()=>editor?.chain().focus().undo().run()))}{cmd('Redo','redo',()=>run(()=>editor?.chain().focus().redo().run()))}</div>
      <span className="save-state" title={notice}>{notice}</span>{cmd(fullScreen?'Exit fullscreen':'Fullscreen','fullscreen',()=>void toggleFullscreen())}
    </header>
    <nav className="tabs" aria-label="Ribbon tabs">{tabs.map(t => <button key={t} className={tab === t ? 'active' : ''} onClick={() => {setTab(t);setMobileRibbon(false);}}>{t}</button>)}</nav>
    <div className="mobile-controls"><button onClick={()=>setMobileRibbon(v=>!v)} aria-expanded={mobileRibbon}>☰ Tabs</button><button onClick={()=>{setNavOpen(v=>!v);setStylesOpen(false)}}>☰ Outline</button><button onClick={()=>{setStylesOpen(v=>!v);setNavOpen(false)}}>Styles</button></div>
    {mobileRibbon && <button className="drawer-backdrop" aria-label="Close ribbon" onClick={()=>setMobileRibbon(false)}/>}
    <div className="ribbon" role="toolbar" aria-label={tab + ' ribbon'}>
      {tab === 'Home' ? <>
        {group('Editing',<>{cmd('Undo','undo',()=>run(()=>editor?.chain().focus().undo().run()))}{cmd('Redo','redo',()=>run(()=>editor?.chain().focus().redo().run()))}</>)}
        {group('Clipboard',<>{cmd('Paste','paste',()=>void pasteClipboard())}{cmd('Cut','cut',()=>void copyClipboard(true))}{cmd('Copy','copy',()=>void copyClipboard(false))}</>)}
        {group('Font',<><div className="font-controls"><select aria-label="Font family" title="Font family" defaultValue="Arial" onChange={e=>run(()=>editor?.chain().focus().setFontFamily(e.target.value).run())}>{googleFonts.map(font=><option key={font} value={font}>{font}</option>)}</select><select aria-label="Font size" title="Font size" defaultValue="11" onChange={e=>setFontSize(Number(e.target.value))}>{fontSizes.map(size=><option key={size} value={size}>{size}</option>)}</select><button title="Grow font" onClick={()=>stepFontSize(1)}>A+</button><button title="Shrink font" onClick={()=>stepFontSize(-1)}>A−</button></div><div className="font-buttons">{cmd('Bold','bold',()=>run(()=>editor?.chain().focus().toggleBold().run()),editor?.isActive('bold'))}{cmd('Italic','italic',()=>run(()=>editor?.chain().focus().toggleItalic().run()),editor?.isActive('italic'))}{cmd('Underline','underline',()=>run(()=>editor?.chain().focus().toggleUnderline().run()),editor?.isActive('underline'))}<label className="color-picker" title="Font color">A<input type="color" aria-label="Font color" defaultValue="#202020" onChange={e=>run(()=>editor?.chain().focus().setColor(e.target.value).run())}/></label><button title="Clear formatting" onClick={()=>run(()=>editor?.chain().focus().unsetAllMarks().run())}>Tx</button></div></>)}
        {group('Paragraph',<>{cmd('Bullets','bullets',()=>run(()=>editor?.chain().focus().toggleBulletList().run()))}{cmd('Numbering','numbers',()=>run(()=>editor?.chain().focus().toggleOrderedList().run()))}{cmd('Align left','left',()=>run(()=>editor?.chain().focus().setTextAlign('left').run()))}{cmd('Align centre','center',()=>run(()=>editor?.chain().focus().setTextAlign('center').run()))}{cmd('Align right','right',()=>run(()=>editor?.chain().focus().setTextAlign('right').run()))}</>)}
        {group('Styles',<>{cmd('Normal','normal',()=>run(()=>editor?.chain().focus().setParagraph().run()))}{cmd('Heading 1','heading1',()=>run(()=>editor?.chain().focus().toggleHeading({level:1}).run()))}{cmd('Heading 2','heading2',()=>run(()=>editor?.chain().focus().toggleHeading({level:2}).run()))}</>)}
      </> : tab === 'File' ? group('Document',<>{cmd('New','file',()=>{if(confirm('Start a new document? Unsaved changes will be lost.')){editor?.commands.setContent('<p></p>');setName('Untitled document');setWordCount(0)}})}{cmd('Open','open',()=>picker.current?.click())}{cmd('Save As','save',save)}</>) : tab === 'View' ? <>{group('Zoom',<>{cmd('Zoom out','minus',()=>setZoom(z=>Math.max(50,z-10)))}<output>{zoom}%</output>{cmd('Zoom in','plus',()=>setZoom(z=>Math.min(200,z+10)))}<button onClick={()=>setZoom(100)}>100%</button></>)}{group('Window',cmd(fullScreen?'Exit fullscreen':'Fullscreen','fullscreen',()=>void toggleFullscreen()))}</> : tab === 'Insert' ? <>
        {group('Pages',<>{cmd('Divider','minus',()=>run(()=>editor?.chain().focus().setHorizontalRule().run()))}{cmd('Line break','linebreak',()=>run(()=>editor?.chain().focus().setHardBreak().run()))}</>)}
        {group('Text',<>{cmd('Quote','quote',()=>run(()=>editor?.chain().focus().toggleBlockquote().run()))}{cmd('Date','date',()=>run(()=>editor?.chain().focus().insertContent(new Intl.DateTimeFormat(undefined,{dateStyle:'long'}).format(new Date())).run()))}{cmd('Time','time',()=>run(()=>editor?.chain().focus().insertContent(new Intl.DateTimeFormat(undefined,{timeStyle:'short'}).format(new Date())).run()))}</>)}
        {group('Symbols',<>{['©','®','—','•','°'].map(symbol=><button key={symbol} title={'Insert '+symbol} onClick={()=>run(()=>editor?.chain().focus().insertContent(symbol).run())}>{symbol}</button>)}</>)}
        {group('Coming soon',<><button disabled title="Table insertion under development">Table</button><button disabled title="Image insertion under development">Picture</button><button disabled title="Link insertion under development">Link</button></>)}
      </> : group(tab,<span className="ribbon-note">Features under development</span>)}
    </div>
    <main className="workspace">
      <aside className={'side-pane navigation-pane'+(navOpen?' pane-open':'')}><h3>Navigation</h3>{outline.length ? outline.map(h=><div className={'outline-item h'+h.level} key={h.id}>{h.text}</div>) : <p className="pane-hint">Headings appear here as you write.</p>}</aside>
      <div className="document-area"><div className="document-stage" style={{zoom:zoom+'%'}}><div className="horizontal-ruler" aria-label="Horizontal page ruler"><div className="ruler-printable"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span></div></div><div className="sheet-row"><div className="vertical-ruler" aria-label="Vertical page ruler"><div className="ruler-vertical-printable">{Array.from({length:9},(_,i)=><span key={i}>{i}</span>)}</div></div><article className="paper"><EditorContent editor={editor}/></article></div></div></div>
      <aside className={'side-pane styles-pane'+(stylesOpen?' pane-open':'')}><h3>Styles</h3><div className="styles-list"><button onClick={()=>run(()=>editor?.chain().focus().setParagraph().run())}>Normal</button><button onClick={()=>run(()=>editor?.chain().focus().toggleHeading({level:1}).run())}>Heading 1</button><button onClick={()=>run(()=>editor?.chain().focus().toggleHeading({level:2}).run())}>Heading 2</button></div></aside>
    </main>
    <footer className="statusbar"><span>{wordCount} words · {editor?.getText().length || 0} characters</span><span>A4 · Portrait · Verbum 2.0</span><span className="status-zoom"><button onClick={()=>setZoom(z=>Math.max(50,z-10))}>−</button><button onClick={()=>setZoom(100)}>Fit</button><output>{zoom}%</output><button onClick={()=>setZoom(z=>Math.min(200,z+10))}>+</button></span></footer>
    <input ref={picker} type="file" accept=".verbum,application/json" hidden onChange={e => { void open(e.target.files?.[0]); e.target.value = ''; }} />
  </div>;
}
