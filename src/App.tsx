import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect, useRef, useState } from 'react';
import { parseDocument, serializeDocument } from './document';

const tabs = ['File', 'Home', 'Insert', 'Design', 'Layout', 'References', 'Review', 'View'];
export default function App() {
  const [tab, setTab] = useState('Home');
  const [name, setName] = useState('Untitled document');
  const [notice, setNotice] = useState('Phase 0 prototype — not Word-compatible yet');
  const picker = useRef<HTMLInputElement>(null);
  const [zoom, setZoom] = useState(100);
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
  return <div className="app">
    <header className="titlebar"><span className="brand">VERBUM <small>2.0 alpha</small></span><input aria-label="Document name" value={name} onChange={e => setName(e.target.value)} /><span className="status">{notice}</span></header>
    <nav className="tabs" aria-label="Ribbon tabs">{tabs.map(t => <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>)}</nav>
    <div className="ribbon" role="toolbar" aria-label={tab + ' ribbon'}>
      {tab === 'Home' ? <>
        <section><small>Editing</small><button onClick={() => run(() => editor?.chain().focus().undo().run())}>Undo</button><button onClick={() => run(() => editor?.chain().focus().redo().run())}>Redo</button></section>
        <section><small>Clipboard</small><button onClick={() => setNotice('Use Ctrl+C / Ctrl+V for browser clipboard')}>Clipboard</button></section>
        <section><small>Font</small><button aria-pressed={editor?.isActive('bold')} onClick={() => run(() => editor?.chain().focus().toggleBold().run())}><b>B</b></button><button aria-pressed={editor?.isActive('italic')} onClick={() => run(() => editor?.chain().focus().toggleItalic().run())}><i>I</i></button><button aria-pressed={editor?.isActive('underline')} onClick={() => run(() => editor?.chain().focus().toggleUnderline().run())}><u>U</u></button></section>
        <section><small>Paragraph</small><button onClick={() => run(() => editor?.chain().focus().toggleBulletList().run())}>Bullets</button><button onClick={() => run(() => editor?.chain().focus().toggleOrderedList().run())}>Numbering</button><button onClick={() => run(() => editor?.chain().focus().setTextAlign('left').run())}>Left</button><button onClick={() => run(() => editor?.chain().focus().setTextAlign('center').run())}>Centre</button><button onClick={() => run(() => editor?.chain().focus().setTextAlign('right').run())}>Right</button></section>
        <section><small>Styles</small><button onClick={() => run(() => editor?.chain().focus().setParagraph().run())}>Normal</button><button onClick={() => run(() => editor?.chain().focus().toggleHeading({ level: 1 }).run())}>Heading 1</button><button onClick={() => run(() => editor?.chain().focus().toggleHeading({ level: 2 }).run())}>Heading 2</button></section>
      </> : tab === 'File' ? <section><small>Document</small><button onClick={() => { if (confirm('Start a new document? Unsaved changes will be lost.')) { editor?.commands.setContent('<p></p>'); setName('Untitled document'); setWordCount(0); } }}>New</button><button onClick={() => picker.current?.click()}>Open</button><button onClick={save}>Save As</button></section> : tab === 'View' ? <><section><small>Zoom</small><button onClick={() => setZoom(z => Math.max(50, z - 10))} aria-label="Zoom out">−</button><output>{zoom}%</output><button onClick={() => setZoom(z => Math.min(200, z + 10))} aria-label="Zoom in">+</button><button onClick={() => setZoom(100)}>100%</button></section><section><small>Window</small><button onClick={() => void toggleFullscreen()}>{fullScreen ? 'Exit fullscreen' : 'Fullscreen'}</button></section></> : <section><small>{tab}</small><span className="placeholder">Planned — no placeholder commands</span></section>}
    </div>
    <main className="workspace"><article className="paper" style={{ zoom: `${zoom}%` }}><EditorContent editor={editor} /></article></main>
    <footer><span>{wordCount} words · {zoom}% zoom · Ctrl+S save · Ctrl+O open</span><span>Verbum 2.0 · No pagination or DOCX fidelity yet</span></footer>
    <input ref={picker} type="file" accept=".verbum,application/json" hidden onChange={e => { void open(e.target.files?.[0]); e.target.value = ''; }} />
  </div>;
}
