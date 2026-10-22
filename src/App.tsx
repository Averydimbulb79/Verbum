import TableRibbons from './TableRibbons';
import InsertRibbon from './InsertRibbon';
import {ImageNode,PageBreakNode,LinkMark,TableNode,TableRowNode,TableCellNode} from './insertExtensions';
import FileWorkspace, { type FileSection, type TemplateId, type RecentDocument } from './FileWorkspace';
import WordRibbons from './WordRibbons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { FontSize } from './typography';
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { parseDocument, serializeDocument } from './document';

const iconPaths: Record<string, string> = { save:'M4 3h14l3 3v15H3V3h1zm2 0v7h11V3M6 21v-8h12v8', undo:'M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12', redo:'m15 14 5-5-5-5m5 5H10a6 6 0 0 0 0 12', fullscreen:'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5', bold:'M7 4h6a4 4 0 0 1 0 8H7zm0 8h7a4 4 0 0 1 0 8H7z', italic:'M14 4h6M4 20h6M15 4 9 20', underline:'M6 3v8a6 6 0 0 0 12 0V3M4 21h16', bullets:'M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01', numbers:'M10 6h11M10 12h11M10 18h11M4 5h2v4M4 13c2-2 4 0 0 3h3', left:'M4 6h16M4 10h10M4 14h16M4 18h10', center:'M4 6h16M7 10h10M4 14h16M7 18h10', right:'M4 6h16M10 10h10M4 14h16M10 18h10', file:'M13 2H5v20h14V8l-6-6zm0 0v6h6M12 12v7m-3-3.5h6', open:'M3 7V5h7l2 3h9v4M3 20l3-10h16l-3 10z', paragraph:'M18 4H9a5 5 0 0 0 0 10h3m0-10v17m4-17v17', heading1:'M4 5v14M12 5v14M4 12h8M18 9v10m-3-7 3-3', heading2:'M4 5v14M12 5v14M4 12h8M15 11a3 3 0 0 1 6 0c0 3-6 4-6 8h6', plus:'M5 12h14M12 5v14', minus:'M5 12h14', quote:'M10 6H5v7h5l-3 5M20 6h-5v7h5l-3 5', linebreak:'M4 7h16M4 11h10m0 0-3-3m3 3-3 3M4 18h16', normal:'M5 4h14M5 9h14M5 14h10M5 19h14', cut:'M7 7l10 10M17 7 7 17M6 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4M6 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4', copy:'M8 8h12v13H8zM4 16H3V3h13v2', paste:'M8 4h3a2 2 0 0 1 4 0h3v4H8zM6 7H4v14h16V7h-2', date:'M4 5h16v16H4zM8 3v4M16 3v4M4 10h16M8 14h3M8 18h3', time:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7v5l4 2' };
function Glyph({name}:{name:string}) { return <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={iconPaths[name] || iconPaths.paragraph}/></svg>; }
const googleFonts = ['Arial', 'Calibri', 'Georgia', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Merriweather', 'Playfair Display', 'Poppins', 'Inter', 'Nunito', 'Source Sans 3', 'Noto Sans', 'Noto Serif'];
const fontSizes = [8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72];
const tabs = ['File', 'Home', 'Insert', 'Design', 'Layout', 'References', 'Review', 'View'];
export default function App() {
  const [tab, setTab] = useState('Home');
  const [tableActive,setTableActive]=useState(false);
  const [tableFormat,setTableFormat]=useState({width:'100%',styleName:'grid',headerRow:false,bandedRows:false});
  const [name, setName] = useState('Untitled document');
  const [notice, setNotice] = useState('Phase 0 prototype — not Word-compatible yet');
  const picker = useRef<HTMLInputElement>(null);
  const [zoom, setZoom] = useState(100);
  const [pageColor, setPageColor] = useState('#ffffff');
  const [theme, setTheme] = useState('Classic');
  const [designFont,setDesignFont]=useState('Arial');
  const [designSpacing,setDesignSpacing]=useState(1.3);
  const [designColor,setDesignColor]=useState('#225b80');
  const [watermark,setWatermark]=useState('');
  const [pageBorder,setPageBorder]=useState('none');
  const [headerText,setHeaderText]=useState('');
  const [footerText,setFooterText]=useState('');
  const [pageNumber,setPageNumber]=useState(false);
  const picturePicker=useRef<HTMLInputElement>(null);
  const [orientation, setOrientation] = useState<'portrait'|'landscape'>('portrait');
  const [margin, setMargin] = useState(25);
  const [ruler, setRuler] = useState(true);
  const [navigation, setNavigation] = useState(true);
  const [mobileRibbon, setMobileRibbon] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [stylesOpen, setStylesOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [fileOpen, setFileOpen] = useState(false);
  const [fileSection, setFileSection] = useState<FileSection>('Home');
  const [recent, setRecent] = useState<RecentDocument[]>(()=>{try{return JSON.parse(localStorage.getItem('verbum-recent-v1')||'[]')}catch{return []}});
  const [autoRecover,setAutoRecover]=useState(()=>localStorage.getItem('verbum-auto-recover')!=='false');
  const [recoveryVersion,setRecoveryVersion]=useState(0);
  const [navigationQuery, setNavigationQuery] = useState('');
  const [navigationMode, setNavigationMode] = useState<'Headings'|'Pages'|'Results'>('Headings');
  const editor = useEditor({
    extensions: [StarterKit, ImageNode, PageBreakNode, LinkMark, TableNode, TableRowNode, TableCellNode, Underline, TextStyle, Color, FontFamily, FontSize, TextAlign.configure({ types: ['heading', 'paragraph'] })],
    content: '<h1>Welcome to Verbum 2.0</h1><p>This is the new structured editing engine prototype.</p>',
    onUpdate: ({ editor }) => setWordCount(editor.getText().trim().split(/\s+/).filter(Boolean).length),
    onSelectionUpdate: ({editor})=>{const active=editor.isActive('table');setTableActive(active);if(active)setTab(current=>current.startsWith('Table')?current:'Table Design')},
    onTransaction: ({editor})=>setTableActive(editor.isActive('table')),
    editorProps: { attributes: { 'aria-label': 'Document editor', class: 'editor-content' } },
  });
  const run = (fn: () => void) => { fn(); editor?.commands.focus(); };
  useEffect(()=>{if(!tableActive&&tab.startsWith('Table'))setTab('Home')},[tableActive,tab]);
  const tableAction=(action:'rowAbove'|'rowBelow'|'colBefore'|'colAfter'|'deleteRow'|'deleteColumn'|'deleteTable')=>{
    if(!editor)return;
    const {$from}=editor.state.selection;
    let cellDepth=-1,rowDepth=-1,tableDepth=-1;
    for(let d=$from.depth;d>=0;d--){const n=$from.node(d).type.name;if(n==='tableCell'&&cellDepth<0)cellDepth=d;if(n==='tableRow'&&rowDepth<0)rowDepth=d;if(n==='table'&&tableDepth<0)tableDepth=d;}
    if(tableDepth<0)return;
    const table=$from.node(tableDepth),tablePos=$from.before(tableDepth);
    const row=rowDepth>=0?$from.index(tableDepth):0;
    const col=cellDepth>=0?$from.index(rowDepth):0;
    const rows=table.content.content.map(r=>r.content.content.map(c=>c.toJSON()));
    const blank=()=>({type:'tableCell',content:[{type:'paragraph'}]});
    if(action==='deleteTable'){editor.chain().focus().command(({tr,dispatch})=>{if(dispatch)dispatch(tr.delete(tablePos,tablePos+table.nodeSize));return true}).run();return;}
    if(action==='rowAbove'||action==='rowBelow')rows.splice(row+(action==='rowBelow'?1:0),0,Array.from({length:rows[0]?.length||1},blank));
    if(action==='colBefore'||action==='colAfter')rows.forEach(r=>r.splice(col+(action==='colAfter'?1:0),0,blank()));
    if(action==='deleteRow'){if(rows.length===1){setNotice('Delete the table instead of its final row');return}rows.splice(row,1)}
    if(action==='deleteColumn'){if(rows[0]?.length===1){setNotice('Delete the table instead of its final column');return}rows.forEach(r=>r.splice(col,1))}
    const replacement={type:'table',content:rows.map(cells=>({type:'tableRow',content:cells}))};
    editor.chain().focus().command(({tr,dispatch})=>{if(dispatch)dispatch(tr.replaceWith(tablePos,tablePos+table.nodeSize,editor.schema.nodeFromJSON(replacement)));return true}).run();
  };

  const tableFormatAction=(action:string,value?:string|number|boolean)=>{
    if(!editor)return;
    if(['rowAbove','rowBelow','colBefore','colAfter','deleteRow','deleteColumn','deleteTable'].includes(action)){tableAction(action as Parameters<typeof tableAction>[0]);return}
    const {$from}=editor.state.selection;
    let tableDepth=-1,cellDepth=-1;
    for(let d=$from.depth;d>=0;d--){if($from.node(d).type.name==='table'&&tableDepth<0)tableDepth=d;if($from.node(d).type.name==='tableCell'&&cellDepth<0)cellDepth=d}
    if(tableDepth<0)return;
    const tablePos=$from.before(tableDepth),table=$from.node(tableDepth);
    if(action==='selectTable'){editor.chain().focus().setTextSelection({from:tablePos+1,to:tablePos+table.nodeSize-1}).run();return}
    if(action==='properties'){setNotice('Table: '+table.childCount+' rows · '+table.firstChild?.childCount+' columns · width '+(table.attrs.width||'100%'));return}
    if(['style','width','headerRow','bandedRows','borderColor','borderWidth'].includes(action)){
      const key=action==='style'?'styleName':action;
      editor.chain().focus().command(({tr,dispatch})=>{if(dispatch)dispatch(tr.setNodeMarkup(tablePos,undefined,{...table.attrs,[key]:value}));return true}).run();
      setTableFormat(current=>({...current,[key]:value}));
      return;
    }
    if(cellDepth<0)return;
    const cellPos=$from.before(cellDepth),cell=$from.node(cellDepth);
    if(action==='shade'||action==='align'){
      const attrs={...cell.attrs};
      if(action==='shade')attrs.background=value;
      else {const [h,v]=String(value).split(':');attrs.align=h;attrs.verticalAlign=v}
      editor.chain().focus().command(({tr,dispatch})=>{if(dispatch)dispatch(tr.setNodeMarkup(cellPos,undefined,attrs));return true}).run();
    }
  };
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
  function download(content:string,extension:string,mime:string,fileName=name){
    const blob=new Blob([content],{type:mime});const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=(fileName.replace(/\.[^.]+$/,'').replace(/[^a-z0-9 _.-]/gi,'_')||'Untitled document')+'.'+extension;a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function rememberDocument(docName:string,content:string){
    const next=[{name:docName,modified:new Date().toISOString(),content},...recent.filter(d=>d.name!==docName)].slice(0,12);
    try{localStorage.setItem('verbum-recent-v1',JSON.stringify(next));setRecent(next)}catch{setNotice('File saved, but browser history storage is full')}
  }
  function save(fileName=name) {
    if (!editor) return;
    const serialized=serializeDocument(fileName,editor.getJSON());
    download(serialized,'verbum','application/json',fileName);
    rememberDocument(fileName,serialized);
    setName(fileName);
    setNotice('Saved structured .verbum file');
  }
  async function open(file?: File) {
    if (!file || !editor) return;
    try {
      const data = parseDocument(await file.text());
      editor.commands.setContent(data.content as Parameters<typeof editor.commands.setContent>[0]);
      setName(data.name); setWordCount(editor.getText().trim().split(/\s+/).filter(Boolean).length); setNotice('Opened ' + file.name);setFileOpen(false);rememberDocument(data.name,serializeDocument(data.name,data.content));
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
  const templateContent:Record<TemplateId,string> = {
    'Blank document':'<p></p>',
    'Letter':'<p style="text-align:right">[Date]</p><p>[Recipient Name]</p><p>[Address]</p><p>Dear [Recipient],</p><p>[Write your letter here.]</p><p>Yours sincerely,</p><p>[Your Name]</p>',
    'Résumé':'<h1>Your Name</h1><p>Email · Phone · Location</p><h2>Professional Summary</h2><p>[Brief introduction]</p><h2>Work Experience</h2><p><strong>Job Title — Company</strong></p><p>[Responsibilities and achievements]</p><h2>Education</h2><p>[Qualification]</p><h2>Skills</h2><p>[Relevant skills]</p>',
    'Meeting notes':'<h1>Meeting Notes</h1><p><strong>Date:</strong> [Date] · <strong>Location:</strong> [Location]</p><h2>Attendees</h2><p>[Names]</p><h2>Agenda</h2><ul><li>[Agenda item]</li></ul><h2>Discussion & Decisions</h2><p>[Notes]</p><h2>Action Items</h2><ul><li>[Owner] — [Task] — [Due date]</li></ul>',
    'Report':'<h1>Report Title</h1><p>[Prepared by] · [Date]</p><h2>Executive Summary</h2><p>[Summary]</p><h2>Background</h2><p>[Context]</p><h2>Findings</h2><p>[Findings]</p><h2>Recommendations</h2><p>[Recommendations]</p>',
    'Proposal':'<h1>Project Proposal</h1><p>[Author] · [Date]</p><h2>Overview</h2><p>[Purpose]</p><h2>Objectives</h2><p>[Goals]</p><h2>Scope</h2><p>[Deliverables]</p><h2>Timeline</h2><p>[Milestones]</p><h2>Budget</h2><p>[Costs]</p>',
    'Newsletter':'<h1>Newsletter</h1><p>Issue [No.] · [Date]</p><h2>In This Issue</h2><p>[Introduction]</p><h2>Feature Story</h2><p>[Story]</p><h2>Updates</h2><p>[News]</p><h2>Upcoming Events</h2><p>[Dates]</p>',
    'Invoice':'<h1>INVOICE</h1><p>[Your Company]</p><p>Invoice No.: [Number] · Date: [Date]</p><h2>Bill To</h2><p>[Customer]</p><h2>Items</h2><p>Description | Quantity | Price | Amount</p><p>[Item] | [Qty] | [Price] | [Amount]</p><h2>Total: [Amount]</h2><p>Payment terms: [Terms]</p>'
  };
  const startTemplate=(kind:TemplateId)=>{
    if(!editor||!window.confirm('Create a new document? Unsaved changes will be lost.'))return;
    editor.commands.setContent(templateContent[kind]);setName(kind==='Blank document'?'Untitled document':kind);
    setWordCount(editor.getText().trim().split(/\\s+/).filter(Boolean).length);
    setNotice('Created '+kind);setFileOpen(false);
  };
  const restoreRecent=(doc:RecentDocument)=>{
    if(!editor||!window.confirm('Open '+doc.name+'? Unsaved changes will be lost.'))return;
    try{const data=parseDocument(doc.content);editor.commands.setContent(data.content as Parameters<typeof editor.commands.setContent>[0]);setName(data.name);setFileOpen(false);setNotice('Opened '+data.name)}
    catch{setNotice('Unable to open recent document')}
  };
  const recoverSnapshot=()=>{
    if(!editor||!window.confirm('Restore the local recovery snapshot? Current unsaved changes will be lost.'))return;
    try{const raw=localStorage.getItem('verbum-recovery-v1');if(!raw)throw Error('No recovery');const data=parseDocument(raw);editor.commands.setContent(data.content as Parameters<typeof editor.commands.setContent>[0]);setName(data.name);setFileOpen(false);setNotice('Recovery restored')}
    catch{setNotice('Unable to restore recovery snapshot')}
  };
  const exportFile=(format:'verbum'|'html'|'txt')=>{
    if(!editor)return;
    if(format==='verbum'){save();return}
    if(format==='html')download('<!doctype html><html><head><meta charset="utf-8"><title>'+name.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</title></head><body>'+editor.getHTML()+'</body></html>','html','text/html');
    else download(editor.getText(),'txt','text/plain');
    setNotice('Exported '+format.toUpperCase());
  };
  useEffect(()=>{
    if(!editor||!autoRecover)return;
    const snapshot=()=>{
      try{localStorage.setItem('verbum-recovery-v1',serializeDocument(name,editor.getJSON()));setRecoveryVersion(v=>v+1)}catch{}
    };
    const handle=window.setTimeout(snapshot,1200);
    return ()=>window.clearTimeout(handle);
  },[editor,name,wordCount,autoRecover]);
  return <div className={mobileRibbon ? 'app ribbon-open' : 'app'}>
    <header className="titlebar"><span className="brand">verbum.</span><span className="version">v2.0.0-alpha.17</span><input className="document-name" aria-label="Document name" value={name} onChange={e => setName(e.target.value)} />
      <div className="quick-actions">{cmd('Save document','save',()=>save())}{cmd('Undo','undo',()=>run(()=>editor?.chain().focus().undo().run()))}{cmd('Redo','redo',()=>run(()=>editor?.chain().focus().redo().run()))}</div>
      <span className="save-state" title={notice}>{notice}</span>{cmd(fullScreen?'Exit fullscreen':'Fullscreen','fullscreen',()=>void toggleFullscreen())}
    </header>
    <nav className="tabs" aria-label="Ribbon tabs">{[...tabs,...(tableActive?['Table Design','Table Layout']:[])].map(t => <button key={t} className={(tab === t ? 'active ' : '')+(t.startsWith('Table')?'contextual-tab':'')} onClick={() => {if(t==='File'){setFileOpen(true);setFileSection('Home');}else{setTab(t);setFileOpen(false);}setMobileRibbon(false);}}>{t}</button>)}</nav>
    <div className="mobile-controls"><button onClick={()=>setMobileRibbon(v=>!v)} aria-expanded={mobileRibbon}>☰ Tabs</button><button onClick={()=>{setNavOpen(v=>!v);setStylesOpen(false)}}>☰ Outline</button><button onClick={()=>{setStylesOpen(v=>!v);setNavOpen(false)}}>Styles</button></div>
    {mobileRibbon && <button className="drawer-backdrop" aria-label="Close ribbon" onClick={()=>setMobileRibbon(false)}/>}
    <div className="ribbon" role="toolbar" aria-label={tab + ' ribbon'}>
      {tab.startsWith('Table') && tableActive ? <TableRibbons mode={tab==='Table Layout'?'Table Layout':'Table Design'} onMode={setTab} action={tableFormatAction} width={tableFormat.width} styleName={tableFormat.styleName} headerRow={tableFormat.headerRow} bandedRows={tableFormat.bandedRows}/>  : tab === 'Home' ? <>
        
        {group('Clipboard',<><div className="clipboard-layout"><div className="paste-major">{cmd('Paste','paste',()=>void pasteClipboard())}<span>Paste</span></div><div className="clipboard-minor">{cmd('Cut','cut',()=>void copyClipboard(true))}{cmd('Copy','copy',()=>void copyClipboard(false))}<button title="Format Painter is planned" disabled><Glyph name="copy"/><span>Format</span></button></div></div></>)}
        {group('Font',<><div className="font-controls"><select aria-label="Font family" defaultValue="Arial" onChange={e=>run(()=>editor?.chain().focus().setFontFamily(e.target.value).run())}>{googleFonts.map(font=><option key={font}>{font}</option>)}</select><select aria-label="Font size" defaultValue="12" onChange={e=>setFontSize(Number(e.target.value))}>{fontSizes.map(size=><option key={size}>{size}</option>)}</select><button title="Increase font size" onClick={()=>stepFontSize(1)}>A+</button><button title="Decrease font size" onClick={()=>stepFontSize(-1)}>A−</button></div><div className="font-buttons">{cmd('Bold','bold',()=>run(()=>editor?.chain().focus().toggleBold().run()),editor?.isActive('bold'))}{cmd('Italic','italic',()=>run(()=>editor?.chain().focus().toggleItalic().run()),editor?.isActive('italic'))}{cmd('Underline','underline',()=>run(()=>editor?.chain().focus().toggleUnderline().run()),editor?.isActive('underline'))}<button title="Subscript" disabled> x₂ </button><button title="Superscript" disabled> x² </button><button title="Strike through" onClick={()=>run(()=>editor?.chain().focus().toggleStrike().run())}>S̶</button><label className="color-picker" title="Font colour">A<input type="color" aria-label="Font colour" defaultValue="#202020" onChange={e=>run(()=>editor?.chain().focus().setColor(e.target.value).run())}/></label><label className="color-picker highlight-picker" title="Text highlight">▰<input type="color" aria-label="Highlight colour" defaultValue="#ffff00" onChange={e=>setNotice('Text highlighting requires an editor extension')}/></label><button title="Clear formatting" onClick={()=>run(()=>editor?.chain().focus().unsetAllMarks().run())}>Tx</button></div></>)}
        {group('Paragraph',<><div className="paragraph-grid">{cmd('Bullets','bullets',()=>run(()=>editor?.chain().focus().toggleBulletList().run()))}{cmd('Numbering','numbers',()=>run(()=>editor?.chain().focus().toggleOrderedList().run()))}{cmd('Align left','left',()=>run(()=>editor?.chain().focus().setTextAlign('left').run()))}{cmd('Align centre','center',()=>run(()=>editor?.chain().focus().setTextAlign('center').run()))}{cmd('Align right','right',()=>run(()=>editor?.chain().focus().setTextAlign('right').run()))}{cmd('Justify','left',()=>run(()=>editor?.chain().focus().setTextAlign('justify').run()))}</div><div className="paragraph-extras"><button title="Decrease indent" onClick={()=>run(()=>editor?.chain().focus().liftListItem('listItem').run())}>⇤</button><button title="Increase indent" onClick={()=>run(()=>editor?.chain().focus().sinkListItem('listItem').run())}>⇥</button><button title="Line spacing" onClick={()=>setNotice('Use Design → Paragraph Spacing to change line spacing')}>↕</button><button title="Show paragraph marks" onClick={()=>setNotice('Paragraph marks view is not yet supported')}>¶</button></div></>)}
        {group('Styles',<div className="style-gallery">{[{name:'Normal',tag:'AaBbCcDd',icon:'normal',action:()=>editor?.chain().focus().setParagraph().run()},{name:'No Spacing',tag:'AaBbCcDd',icon:'normal',action:()=>editor?.chain().focus().setParagraph().run()},{name:'Heading 1',tag:'AaBbCc',icon:'heading1',action:()=>editor?.chain().focus().toggleHeading({level:1}).run()},{name:'Heading 2',tag:'AaBbCc',icon:'heading2',action:()=>editor?.chain().focus().toggleHeading({level:2}).run()}].map(style=><button key={style.name} className={'style-preview '+(style.name==='Normal'?'style-selected':'')} title={style.name} onClick={()=>run(style.action)}><span>{style.tag}</span><small>{style.name}</small></button>)}</div>)}
        {group('Editing',<div className="editing-actions"><button onClick={()=>{setNavigationMode('Results');}}><Glyph name="normal"/>Find</button><button disabled title="Replace is planned"><Glyph name="copy"/>Replace</button><button disabled title="Selection tools are planned"><Glyph name="normal"/>Select</button></div>)}
      </> : tab === 'File' ? group('Document',<>{cmd('New','file',()=>{if(confirm('Start a new document? Unsaved changes will be lost.')){editor?.commands.setContent('<p></p>');setName('Untitled document');setWordCount(0)}})}{cmd('Open','open',()=>picker.current?.click())}{cmd('Save As','save',()=>save())}</>) : tab === 'Insert' ? <InsertRibbon
 onCover={()=>{if(!editor)return;editor.chain().focus().insertContentAt(0,'<h1>Document Title</h1><p>Subtitle</p><p>Author · Date</p><hr/>').run()}}
 onBlank={()=>run(()=>editor?.chain().focus().insertContent({type:'pageBreak'}).run())}
 onPageBreak={()=>run(()=>editor?.chain().focus().insertContent({type:'pageBreak'}).run())}
 onTable={(rows,cols)=>{const content=Array.from({length:rows},()=>({type:'tableRow',content:Array.from({length:cols},()=>({type:'tableCell',content:[{type:'paragraph'}]}))}));run(()=>editor?.chain().focus().insertContent({type:'table',content}).run())}}
 onQuickTable={kind=>{if(!editor)return;
  const values=kind==='calendar'?[['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],...Array.from({length:5},()=>Array(7).fill(''))]:kind==='comparison'?[['Feature','Option A','Option B'],['Price','',''],['Benefits','',''],['Notes','','']]:[['Time','Activity','Owner'],['09:00','',''],['10:00','',''],['11:00','','']];
  const content=values.map(row=>({type:'tableRow',content:row.map(value=>({type:'tableCell',content:[{type:'paragraph',content:value?[{type:'text',text:value}]:undefined}]}))}));
  editor.chain().focus().insertContent({type:'table',content}).run();
 }}
 onPicture={()=>picturePicker.current?.click()}
 onLink={()=>{if(!editor)return;const href=window.prompt('Enter URL (https://...)',String(editor.getAttributes('link').href||'https://'));if(href===null)return;try{const u=new URL(href);if(!['https:','http:','mailto:'].includes(u.protocol))throw Error('Invalid scheme');if(editor.state.selection.empty){editor.chain().focus().insertContent({type:'text',text:href,marks:[{type:'link',attrs:{href}}]}).run()}else editor.chain().focus().setMark('link',{href}).run()}catch{setNotice('Enter a valid http(s) or mailto link')}}}
 onBookmark={()=>{const label=window.prompt('Bookmark name');if(label?.trim())run(()=>editor?.chain().focus().insertContent('['+label.trim()+']').run())}}
 onTextBox={()=>run(()=>editor?.chain().focus().insertContent('<blockquote><p>Text box — edit this text</p></blockquote>').run())}
 onDate={()=>run(()=>editor?.chain().focus().insertContent(new Intl.DateTimeFormat(undefined,{dateStyle:'long'}).format(new Date())).run())}
 onTime={()=>run(()=>editor?.chain().focus().insertContent(new Intl.DateTimeFormat(undefined,{timeStyle:'short'}).format(new Date())).run())}
 onRule={()=>run(()=>editor?.chain().focus().setHorizontalRule().run())}
 onSymbol={symbol=>run(()=>editor?.chain().focus().insertContent(symbol).run())}
 onHeader={()=>{const v=window.prompt('Header text',headerText);if(v!==null)setHeaderText(v)}}
 onFooter={()=>{const v=window.prompt('Footer text',footerText);if(v!==null)setFooterText(v)}}
 onPageNumber={()=>setPageNumber(v=>!v)}
 /> : <WordRibbons tab={tab} zoom={zoom} setZoom={setZoom} pageColor={pageColor} setPageColor={setPageColor} theme={theme} setTheme={setTheme} orientation={orientation} setOrientation={setOrientation} margin={margin} setMargin={setMargin} ruler={ruler} setRuler={setRuler} navigation={navigation} setNavigation={setNavigation} onInsert={value=>run(()=>editor?.chain().focus().insertContent(value).run())} onRule={()=>run(()=>editor?.chain().focus().setHorizontalRule().run())} onHeading={level=>run(()=>editor?.chain().focus().toggleHeading({level}).run())} onPrint={()=>window.print()} onFullscreen={()=>void toggleFullscreen()} onWordCount={()=>setNotice(wordCount+' words · '+(editor?.getText().length||0)+' characters')} designFont={designFont} setDesignFont={setDesignFont} designSpacing={designSpacing} setDesignSpacing={setDesignSpacing} designColor={designColor} setDesignColor={setDesignColor} watermark={watermark} setWatermark={setWatermark} pageBorder={pageBorder} setPageBorder={setPageBorder} onSetDefault={()=>{localStorage.setItem('verbum-design-default',JSON.stringify({theme,designFont,designSpacing,designColor,pageColor,watermark,pageBorder}));setNotice('Design defaults saved in this browser')}} /> }
    </div>
    <main className={"workspace theme-"+theme.toLowerCase()}>
      <aside className={'side-pane navigation-pane'+(navOpen?' pane-open':'')} style={{display:navigation?undefined:'none'}}><h3>Navigation</h3><input className="navigation-search" aria-label="Search document" placeholder="Search document" value={navigationQuery} onChange={e=>setNavigationQuery(e.target.value)}/><div className="navigation-modes">{(['Headings','Pages','Results'] as const).map(mode=><button key={mode} className={navigationMode===mode?'selected':''} onClick={()=>setNavigationMode(mode)}>{mode}</button>)}</div>{navigationMode==='Headings' ? (outline.filter(h=>h.text.toLowerCase().includes(navigationQuery.toLowerCase())).length ? outline.filter(h=>h.text.toLowerCase().includes(navigationQuery.toLowerCase())).map(h=><div className={'outline-item h'+h.level} key={h.id}>{h.text}</div>) : <p className="pane-hint">No matching headings.</p>) : <p className="pane-hint">{navigationMode==='Pages'?'Page thumbnails are planned.':'Document search results are planned.'}</p>}</aside>
      <div className="document-area"><div className="document-stage" style={{zoom:zoom+'%','--page-margin':margin+'mm','--page-color':pageColor,'--design-font':designFont,'--design-spacing':designSpacing,'--design-accent':designColor} as CSSProperties}><div className="horizontal-ruler" style={{display:ruler?undefined:"none"}} aria-label="Horizontal page ruler"><div className="ruler-printable"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span></div></div><div className="sheet-row"><div className="vertical-ruler" style={{display:ruler?undefined:"none"}} aria-label="Vertical page ruler"><div className="ruler-vertical-printable">{Array.from({length:9},(_,i)=><span key={i}>{i}</span>)}</div></div><article className={"paper "+(orientation==="landscape"?"paper-landscape":"")} style={{border:pageBorder==='none'?undefined:'3px '+pageBorder+' '+designColor}}>{watermark&&<div className="verbum-watermark" aria-hidden="true">{watermark}</div>}{headerText&&<div className="verbum-page-header">{headerText}</div>}<EditorContent editor={editor}/>{(footerText||pageNumber)&&<div className="verbum-page-footer">{footerText}<span>{pageNumber?'1':''}</span></div>}</article></div></div></div>
      <aside className={'side-pane styles-pane'+(stylesOpen?' pane-open':'')}><h3>Styles</h3><div className="styles-list"><button onClick={()=>run(()=>editor?.chain().focus().setParagraph().run())}>Normal</button><button onClick={()=>run(()=>editor?.chain().focus().toggleHeading({level:1}).run())}>Heading 1</button><button onClick={()=>run(()=>editor?.chain().focus().toggleHeading({level:2}).run())}>Heading 2</button></div></aside>
    </main>
    <footer className="statusbar"><span>{wordCount} words · {editor?.getText().length || 0} characters</span><span>A4 · Portrait · Verbum 2.0</span><span className="status-zoom"><button onClick={()=>setZoom(z=>Math.max(50,z-10))}>−</button><button onClick={()=>setZoom(100)}>Fit</button><output>{zoom}%</output><button onClick={()=>setZoom(z=>Math.min(200,z+10))}>+</button></span></footer>
    {fileOpen && <FileWorkspace section={fileSection} onSection={setFileSection} onBack={()=>setFileOpen(false)} name={name} words={wordCount} characters={editor?.getText().length||0} recent={recent} onTemplate={startTemplate} onOpen={()=>picker.current?.click()} onRecent={restoreRecent} onSave={()=>save()} onSaveAs={save} onPrint={()=>window.print()} onExport={exportFile} hasRecovery={Boolean(localStorage.getItem('verbum-recovery-v1'))} onRecover={recoverSnapshot} onDiscardRecovery={()=>{localStorage.removeItem('verbum-recovery-v1');setRecoveryVersion(v=>v+1)}} autoRecover={autoRecover} onAutoRecover={enabled=>{setAutoRecover(enabled);localStorage.setItem('verbum-auto-recover',String(enabled))}} onRename={setName} onClearRecent={()=>{setRecent([]);localStorage.removeItem('verbum-recent-v1')}} />}
    <input ref={picturePicker} type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(!file||!editor)return;if(file.size>3*1024*1024){setNotice('Image must be smaller than 3 MB');return}const reader=new FileReader();reader.onload=()=>{if(typeof reader.result==='string')editor.chain().focus().insertContent({type:'verbumImage',attrs:{src:reader.result,alt:file.name}}).run()};reader.readAsDataURL(file)}} />
    <input ref={picker} type="file" accept=".verbum,application/json" hidden onChange={e => { void open(e.target.files?.[0]); e.target.value = ''; }} />
  </div>;
}
