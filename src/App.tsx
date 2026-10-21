import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useRef, useState } from 'react';
import { parseDocument, serializeDocument } from './document';

const tabs = ['File', 'Home', 'Insert', 'Design', 'Layout', 'References', 'Review', 'View'];
export default function App() {
  const [tab, setTab] = useState('Home');
  const [name, setName] = useState('Untitled document');
  const [notice, setNotice] = useState('Phase 0 prototype — not Word-compatible yet');
  const picker = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions: [StarterKit, Underline, TextAlign.configure({ types: ['heading', 'paragraph'] })],
    content: '<h1>Welcome to Verbum 2.0</h1><p>This is the new structured editing engine prototype.</p>',
    editorProps: { attributes: { 'aria-label': 'Document editor', class: 'editor-content' } },
  });
  const run = (fn: () => void) => { fn(); editor?.commands.focus(); };
  function save() {
    if (!editor) return;
    const blob = new Blob([serializeDocument(name, editor.getJSON())], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = name.replace(/[^a-z0-9 _.-]/gi, '_') + '.verbum'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice('Saved structured .verbum file');
  }
  async function open(file?: File) {
    if (!file || !editor) return;
    try {
      const data = parseDocument(await file.text());
      editor.commands.setContent(data.content as Parameters<typeof editor.commands.setContent>[0]);
      setName(data.name); setNotice('Opened ' + file.name);
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
      </> : tab === 'File' ? <section><small>Document</small><button onClick={() => { if (confirm('Start a new document? Unsaved changes will be lost.')) { editor?.commands.setContent('<p></p>'); setName('Untitled document'); } }}>New</button><button onClick={() => picker.current?.click()}>Open</button><button onClick={save}>Save As</button></section> : <section><small>{tab}</small><span className="placeholder">Planned — no placeholder commands</span></section>}
    </div>
    <main className="workspace"><article className="paper"><EditorContent editor={editor} /></article></main>
    <footer>Verbum 2.0 · Structured editor prototype · No pagination or DOCX fidelity yet</footer>
    <input ref={picker} type="file" accept=".verbum,application/json" hidden onChange={e => { void open(e.target.files?.[0]); e.target.value = ''; }} />
  </div>;
}
