import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect, useRef, useState } from 'react';
import { parseDocument, serializeDocument } from './document';

const iconPaths: Record<string, string> = { save:'M4 3h14l3 3v15H3V3h1zm2 0v7h11V3M6 21v-8h12v8', undo:'M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12', redo:'m15 14 5-5-5-5m5 5H10a6 6 0 0 0 0 12', fullscreen:'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5', bold:'M7 4h6a4 4 0 0 1 0 8H7zm0 8h7a4 4 0 0 1 0 8H7z', italic:'M14 4h6M4 20h6M15 4 9 20', underline:'M6 3v8a6 6 0 0 0 12 0V3M4 21h16', bullets:'M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01', numbers:'M10 6h11M10 12h11M10 18h11M4 5h2v4M4 13c2-2 4 0 0 3h3', left:'M4 6h16M4 10h10M4 14h16M4 18h10', center:'M4 6h16M7 10h10M4 14h16M7 18h10', right:'M4 6h16M10 10h10M4 14h16M10 18h10', file:'M13 2H5v20h14V8l-6-6zm0 0v6h6M12 12v7m-3-3.5h6', open:'M3 7V5h7l2 3h9v4M3 20l3-10h16l-3 10z', paragraph:'M18 4H9a5 5 0 0 0 0 10h3m0-10v17m4-17v17', heading1:'M4 5v14M12 5v14M4 12h8M18 9v10m-3-7 3-3', heading2:'M4 5v14M12 5v14M4 12h8M15 11a3 3 0 0 1 6 0c0 3-6 4-6 8h6', plus:'M5 12h14M12 5v14', minus:'M5 12h14' };
function Glyph({name}:{name:string}) { return <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={iconPaths[name] || iconPaths.paragraph}/></svg>; }
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
    extensions: [StarterKit, Underline, TextAlign.configure({ types: ['heading', 'paragraph'] })],
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
  const cmd = (label:string, icon:string, action:()=>void, pressed?:boolean) => <button key={label} title={label} aria-label={label} aria-pressed={pressed} onClick={action}><Glyph name={icon}/><span className="command-label">{label}</span></button>;
  const group = (title:string, children:React.ReactNode) => <section className="ribbon-group"><div className="ribbon-tools">{children}</div><small>{title}</small></section>;
  const outline = editor?.getJSON().content?.filter(node => node.type === 'heading').map((node,i) => ({ id:i, level:node.attrs?.level || 1, text:node.content?.map(c=>c.text || '').join('') || 'Untitled heading' })) || [];
  return <div className={mobileRibbon ? 'app ribbon-open' : 'app'}>
    <header className="titlebar"><span className="brand">verbum.</span><span className="version">v2.0.0-alpha.3</span><input className="document-name" aria-label="Document name" value={name} onChange={e => setName(e.target.value)} />
      <div className="quick-actions">{cmd('Save document','save',save)}{cmd('Undo','undo',()=>run(()=>editor?.chain().focus().undo().run()))}{cmd('Redo','redo',()=>run(()=>editor?.chain().focus().redo().run()))}</div>
      <span className="save-state" title={notice}>{notice}</span>{cmd(fullScreen?'Exit fullscreen':'Fullscreen','fullscreen',()=>void toggleFullscreen())}
    </header>
    <nav className="tabs" aria-label="Ribbon tabs">{tabs.map(t => <button key={t} className={tab === t ? 'active' : ''} onClick={() => {setTab(t);setMobileRibbon(false);}}>{t}</button>)}</nav>
    <div className="mobile-controls"><button onClick={()=>setMobileRibbon(v=>!v)} aria-expanded={mobileRibbon}>☰ Tabs</button><button onClick={()=>{setNavOpen(v=>!v);setStylesOpen(false)}}>☰ Outline</button><button onClick={()=>{setStylesOpen(v=>!v);setNavOpen(false)}}>Styles</button></div>
    {mobileRibbon && <button className="drawer-backdrop" aria-label="Close ribbon" onClick={()=>setMobileRibbon(false)}/>}
    <div className="ribbon" role="toolbar" aria-label={tab + ' ribbon'}>
      {tab === 'Home' ? <>
        {group('Editing',<>{cmd('Undo','undo',()=>run(()=>editor?.chain().focus().undo().run()))}{cmd('Redo','redo',()=>run(()=>editor?.chain().focus().redo().run()))}</>)}
        {group('Clipboard',<span className="ribbon-note">Ctrl+C · Ctrl+V</span>)}
        {group('Font',<>{cmd('Bold','bold',()=>run(()=>editor?.chain().focus().toggleBold().run()),editor?.isActive('bold'))}{cmd('Italic','italic',()=>run(()=>editor?.chain().focus().toggleItalic().run()),editor?.isActive('italic'))}{cmd('Underline','underline',()=>run(()=>editor?.chain().focus().toggleUnderline().run()),editor?.isActive('underline'))}</>)}
        {group('Paragraph',<>{cmd('Bullets','bullets',()=>run(()=>editor?.chain().focus().toggleBulletList().run()))}{cmd('Numbering','numbers',()=>run(()=>editor?.chain().focus().toggleOrderedList().run()))}{cmd('Align left','left',()=>run(()=>editor?.chain().focus().setTextAlign('left').run()))}{cmd('Align centre','center',()=>run(()=>editor?.chain().focus().setTextAlign('center').run()))}{cmd('Align right','right',()=>run(()=>editor?.chain().focus().setTextAlign('right').run()))}</>)}
        {group('Styles',<>{cmd('Normal','paragraph',()=>run(()=>editor?.chain().focus().setParagraph().run()))}{cmd('Heading 1','heading1',()=>run(()=>editor?.chain().focus().toggleHeading({level:1}).run()))}{cmd('Heading 2','heading2',()=>run(()=>editor?.chain().focus().toggleHeading({level:2}).run()))}</>)}
      </> : tab === 'File' ? group('Document',<>{cmd('New','file',()=>{if(confirm('Start a new document? Unsaved changes will be lost.')){editor?.commands.setContent('<p></p>');setName('Untitled document');setWordCount(0)}})}{cmd('Open','open',()=>picker.current?.click())}{cmd('Save As','save',save)}</>) : tab === 'View' ? <>{group('Zoom',<>{cmd('Zoom out','minus',()=>setZoom(z=>Math.max(50,z-10)))}<output>{zoom}%</output>{cmd('Zoom in','plus',()=>setZoom(z=>Math.min(200,z+10)))}<button onClick={()=>setZoom(100)}>100%</button></>)}{group('Window',cmd(fullScreen?'Exit fullscreen':'Fullscreen','fullscreen',()=>void toggleFullscreen()))}</> : group(tab,<span className="ribbon-note">Features under development</span>)}
    </div>
    <main className="workspace">
      <aside className={'side-pane navigation-pane'+(navOpen?' pane-open':'')}><h3>Navigation</h3>{outline.length ? outline.map(h=><div className={'outline-item h'+h.level} key={h.id}>{h.text}</div>) : <p className="pane-hint">Headings appear here as you write.</p>}</aside>
      <div className="document-area"><div className="document-stage" style={{zoom:zoom+'%'}}><div className="horizontal-ruler" aria-label="Horizontal page ruler"/><div className="sheet-row"><div className="vertical-ruler" aria-label="Vertical page ruler"/><article className="paper"><EditorContent editor={editor}/></article></div></div></div>
      <aside className={'side-pane styles-pane'+(stylesOpen?' pane-open':'')}><h3>Styles</h3><div className="styles-list"><button onClick={()=>run(()=>editor?.chain().focus().setParagraph().run())}>Normal</button><button onClick={()=>run(()=>editor?.chain().focus().toggleHeading({level:1}).run())}>Heading 1</button><button onClick={()=>run(()=>editor?.chain().focus().toggleHeading({level:2}).run())}>Heading 2</button></div></aside>
    </main>
    <footer className="statusbar"><span>{wordCount} words · {editor?.getText().length || 0} characters</span><span>A4 · Portrait · Verbum 2.0</span><span className="status-zoom"><button onClick={()=>setZoom(z=>Math.max(50,z-10))}>−</button><button onClick={()=>setZoom(100)}>Fit</button><output>{zoom}%</output><button onClick={()=>setZoom(z=>Math.min(200,z+10))}>+</button></span></footer>
    <input ref={picker} type="file" accept=".verbum,application/json" hidden onChange={e => { void open(e.target.files?.[0]); e.target.value = ''; }} />
  </div>;
}
