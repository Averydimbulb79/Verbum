import { useState, type ReactNode } from 'react';

export type FileSection = 'Home'|'New'|'Open'|'Info'|'Recover'|'Save'|'Save As'|'Print'|'Export'|'Close'|'Options';
export type TemplateId = 'Blank document'|'Letter'|'Résumé'|'Meeting notes'|'Report'|'Proposal'|'Newsletter'|'Invoice';
export const templates: {id:TemplateId;category:string;description:string}[] = [
 {id:'Blank document',category:'Basic',description:'Start with an empty page'},
 {id:'Letter',category:'Personal',description:'A professional letter layout'},
 {id:'Résumé',category:'Career',description:'Clean résumé with sections'},
 {id:'Meeting notes',category:'Business',description:'Agenda, decisions and actions'},
 {id:'Report',category:'Business',description:'Executive summary and findings'},
 {id:'Proposal',category:'Business',description:'Project scope and timeline'},
 {id:'Newsletter',category:'Creative',description:'Editorial-style updates'},
 {id:'Invoice',category:'Business',description:'Simple invoice structure'}
];
const menu: {name:FileSection;icon:string}[] = [
 {name:'Home',icon:'⌂'},{name:'New',icon:'⊞'},{name:'Open',icon:'▱'},{name:'Info',icon:'ⓘ'},
 {name:'Recover',icon:'↶'},{name:'Save',icon:'▣'},{name:'Save As',icon:'▤'},
 {name:'Print',icon:'▧'},{name:'Export',icon:'⇥'},{name:'Close',icon:'×'},{name:'Options',icon:'⚙'}
];
export type RecentDocument = {name:string;modified:string;content:string};
type Props = {
 section:FileSection;onSection:(section:FileSection)=>void;onBack:()=>void;
 name:string;words:number;characters:number;recent:RecentDocument[];
 onTemplate:(id:TemplateId)=>void;onOpen:()=>void;onRecent:(doc:RecentDocument)=>void;
 onSave:()=>void;onSaveAs:(name:string)=>void;onPrint:()=>void;onExport:(format:'verbum'|'html'|'txt')=>void;
 onRecover:()=>void;hasRecovery:boolean;onDiscardRecovery:()=>void;
 autoRecover:boolean;onAutoRecover:(enabled:boolean)=>void;
 onRename:(name:string)=>void;onClearRecent:()=>void;
};
function Preview({kind}:{kind:TemplateId}) {
 const content:Record<TemplateId,ReactNode>={
  'Blank document':null,
  'Letter':<><div className="tp-letter-top">YOUR NAME <span>CONTACT DETAILS</span></div><div className="tp-letter-date">24 October 2026</div><div className="tp-letter-recipient">Recipient Name<br/>Company Address</div><div className="tp-letter-salutation">Dear Recipient,</div><p>Thank you for your consideration. We look forward to hearing from you.</p><p>Kind regards,</p><strong>Your Name</strong></>,
  'Résumé':<><div className="tp-resume-name">ALEX MORGAN</div><div className="tp-resume-contact">DESIGNER · SINGAPORE</div><div className="tp-resume-section">PROFILE</div><p>Creative professional with experience delivering thoughtful solutions.</p><div className="tp-resume-section">EXPERIENCE</div><strong>Senior Designer</strong><small>2022 — Present</small><p>Brand identity and digital design</p><div className="tp-resume-section">EDUCATION</div><p>Bachelor of Design</p></>,
  'Meeting notes':<><div className="tp-meeting-label">TEAM / OPERATIONS</div><h3>Meeting Notes</h3><div className="tp-meeting-meta">12 OCTOBER 2026　·　10:00 AM</div><h4>01　Agenda</h4><p>Quarterly priorities and delivery review</p><h4>02　Key decisions</h4><p>Confirm milestones and assign owners</p><h4>03　Next steps</h4><p>• Update project timeline<br/>• Circulate meeting summary</p></>,
  'Report':<><div className="tp-report-rule"/><div className="tp-report-label">ANNUAL REPORT / 2026</div><h3>Performance<br/>Review</h3><div className="tp-report-subtitle">Findings, insights & recommendations</div><div className="tp-report-divider"/><h4>EXECUTIVE SUMMARY</h4><p>A concise overview of the year's key results and opportunities.</p></>,
  'Proposal':<><div className="tp-proposal-label">BUSINESS PROPOSAL</div><h3>Project<br/>Northstar</h3><div className="tp-proposal-band">STRATEGY　 /　2026</div><h4>Overview</h4><p>A clear plan for the next stage of growth.</p><h4>Objectives</h4><p>Build · Launch · Measure</p></>,
  'Newsletter':<><div className="tp-newsletter-masthead">THE WEEKLY</div><div className="tp-newsletter-edition">ISSUE 08　 |　 OCTOBER 2026</div><div className="tp-newsletter-photo"/><h3>Fresh ideas,<br/>new perspectives.</h3><p>Stories and updates from our community.</p><div className="tp-newsletter-rule"/><strong>INSIDE THIS ISSUE</strong></>,
  'Invoice':<><div className="tp-invoice-header"><strong>INVOICE</strong><span>№ 00128</span></div><div className="tp-invoice-brand">STUDIO NORTH</div><div className="tp-invoice-meta">BILL TO<br/><strong>Client Company</strong><br/>24 Oct 2026</div><div className="tp-invoice-table"><div>DESCRIPTION <span>AMOUNT</span></div><p>Design services <span>$1,200</span></p><p>Consultation <span>$300</span></p></div><div className="tp-invoice-total">TOTAL <span>$1,500</span></div></>
 };
 return <div className={'template-preview template-'+kind.toLowerCase().replace(/\s+/g,'-')} aria-hidden="true"><div className="tp-page">{content[kind]}</div></div>;
}
export default function FileWorkspace(p:Props) {
 const [query,setQuery]=useState('');
 const [category,setCategory]=useState('All');
 const [saveName,setSaveName]=useState(p.name);
 const [showAll,setShowAll]=useState(false);
 const [format,setFormat]=useState<'verbum'|'html'|'txt'>('verbum');
 const [copies,setCopies]=useState(1);
 const shown=templates.filter(t=>(showAll||p.section==='New'||templates.indexOf(t)<4)&&
 (category==='All'||t.category===category)&&t.id.toLowerCase().includes(query.toLowerCase()));
 const tile=(id:TemplateId)=> <button key={id} className="template-tile" onClick={()=>p.onTemplate(id)}><Preview kind={id}/><span className="template-name">{id}</span><span className="template-description">{templates.find(t=>t.id===id)?.description}</span></button>;
 const recent=<><div className="backstage-heading-row"><h2>Recent documents</h2>{p.recent.length>0&&<button className="backstage-text-button" onClick={p.onClearRecent}>Clear history</button>}</div>{p.recent.length? <div className="recent-list">{p.recent.map((doc,i)=><button key={i} onClick={()=>p.onRecent(doc)}><span className="recent-icon">▤</span><span><strong>{doc.name}</strong><small>{new Date(doc.modified).toLocaleString()}</small></span><span className="recent-open">Open ↗</span></button>)}</div>:<div className="backstage-empty">No recent documents yet. Documents you save in this browser will appear here.</div>}</>;
 const templatesView=<><div className="backstage-heading-row"><h2>{p.section==='New'?'Choose a template':'Start a document'}</h2>{p.section==='Home'&&<button className="backstage-text-button" onClick={()=>{p.onSection('New');setShowAll(true)}}>More templates →</button>}</div>{p.section==='New'&&<div className="template-filters"><input aria-label="Search templates" placeholder="Search templates" value={query} onChange={e=>setQuery(e.target.value)}/><select aria-label="Template category" value={category} onChange={e=>setCategory(e.target.value)}>{['All','Basic','Personal','Career','Business','Creative'].map(v=><option key={v}>{v}</option>)}</select></div>}<div className="template-gallery">{shown.map(t=>tile(t.id))}</div>{shown.length===0&&<p className="backstage-muted">No matching templates.</p>}</>;
 let body:ReactNode;
 switch(p.section){
 case 'Home':body=<>{templatesView}{recent}</>;break;
 case 'New':body=templatesView;break;
 case 'Open':body=<><p className="backstage-muted">Open a native Verbum document (.verbum) from your device or from recent documents.</p><button className="backstage-primary" onClick={p.onOpen}>Browse this device</button>{recent}</>;break;
 case 'Info':body=<div className="backstage-panel"><h2>Document properties</h2><label className="backstage-field">Document name<input defaultValue={p.name} onBlur={e=>{if(e.target.value.trim())p.onRename(e.target.value.trim())}}/></label><div className="backstage-properties"><span>Words</span><strong>{p.words}</strong><span>Characters</span><strong>{p.characters}</strong><span>Native format</span><strong>.verbum</strong></div><p className="backstage-muted">Password protection and cloud version history are not available in this offline-first editor.</p></div>;break;
 case 'Recover':body=<div className="backstage-panel"><h2>Local recovery</h2><p className="backstage-muted">Recovery snapshots are stored in this browser. They are not a substitute for saving a .verbum file.</p>{p.hasRecovery?<div className="backstage-button-row"><button className="backstage-primary" onClick={p.onRecover}>Restore recovery snapshot</button><button className="backstage-secondary backstage-danger" onClick={p.onDiscardRecovery}>Discard snapshot</button></div>:<p>No recovery snapshot available.</p>}</div>;break;
 case 'Save':case 'Save As':body=<div className="backstage-panel"><h2>{p.section==='Save'?'Save document':'Save a copy'}</h2><label className="backstage-field">File name<input value={saveName} onChange={e=>setSaveName(e.target.value)}/></label><p className="backstage-muted">Downloads a complete editable .verbum document to your device.</p><button className="backstage-primary" onClick={()=>p.onSaveAs(saveName.trim()||p.name)}>Download .verbum</button></div>;break;
 case 'Print':body=<div className="backstage-panel"><h2>Print document</h2><label className="backstage-field">Copies<input type="number" min="1" max="99" value={copies} onChange={e=>setCopies(Math.max(1,Number(e.target.value)||1))}/></label><p className="backstage-muted">Printer, page range, paper size and other options are managed by the browser's print dialog.</p><button className="backstage-primary" onClick={p.onPrint}>Open print dialog</button></div>;break;
 case 'Export':body=<div className="backstage-panel"><h2>Export document</h2><label className="backstage-field">Format<select value={format} onChange={e=>setFormat(e.target.value as typeof format)}><option value="verbum">Verbum editable document (.verbum)</option><option value="html">HTML web document (.html)</option><option value="txt">Plain text (.txt)</option></select></label><button className="backstage-primary" onClick={()=>p.onExport(format)}>Export file</button><p className="backstage-muted">PDF: use Print → Save as PDF. DOCX and RTF export are not yet supported.</p></div>;break;
 case 'Options':body=<div className="backstage-panel"><h2>Preferences</h2><label className="backstage-toggle"><input type="checkbox" checked={p.autoRecover} onChange={e=>p.onAutoRecover(e.target.checked)}/> Keep local recovery snapshots while editing</label><p className="backstage-muted">Stored only in this browser. Disable this option to stop future snapshots.</p></div>;break;
 default:body=null;
 }
 return <div className="backstage" role="dialog" aria-modal="true" aria-label="File workspace" onKeyDown={e=>{if(e.key==='Escape')p.onBack()}}>
 <aside className="backstage-menu"><button className="backstage-back" onClick={p.onBack} aria-label="Back to document"><span className="backstage-arrow">‹</span><span>Back to document</span></button>{menu.map(item=><button key={item.name} className={p.section===item.name?'selected':''} onClick={()=>item.name==='Close'?p.onBack():item.name==='Save'?p.onSave():p.onSection(item.name)}><span className="backstage-menu-icon">{item.icon}</span><span>{item.name}</span></button>)}<div className="backstage-menu-footer"><strong>verbum.</strong><small>2.0 alpha</small></div></aside>
 <section className="backstage-content"><div className="backstage-eyebrow">VERBUM DOCUMENTS</div><h1>{p.section==='Home'?'Good to see you again':p.section}</h1>{body}</section>
 </div>;
}
