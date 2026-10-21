import type { ReactNode } from 'react';

type Props = {
 tab: string;
 zoom: number;
 setZoom: (value: number) => void;
 pageColor: string;
 setPageColor: (value: string) => void;
 theme: string;
 setTheme: (value: string) => void;
 orientation: 'portrait' | 'landscape';
 setOrientation: (value: 'portrait' | 'landscape') => void;
 margin: number;
 setMargin: (value: number) => void;
 ruler: boolean;
 setRuler: (value: boolean) => void;
 navigation: boolean;
 setNavigation: (value: boolean) => void;
 onInsert: (content: string) => void;
 onRule: () => void;
 onHeading: (level: 1 | 2) => void;
 onPrint: () => void;
 onFullscreen: () => void;
 onWordCount: () => void;
 designFont:string;setDesignFont:(font:string)=>void;
 designSpacing:number;setDesignSpacing:(n:number)=>void;
 designColor:string;setDesignColor:(v:string)=>void;
 watermark:string;setWatermark:(v:string)=>void;
 pageBorder:string;setPageBorder:(v:string)=>void;
 onSetDefault:()=>void;
};

function Group({name,children}:{name:string;children:ReactNode}) {
 return <section className="ribbon-group word-group"><div className="ribbon-tools word-tools">{children}</div><small>{name}</small></section>;
}
function Action({icon,label,onClick,disabled=false}:{icon:string;label:string;onClick?:()=>void;disabled?:boolean}) {
 return <button className="word-action" title={disabled ? label+' (not yet implemented)' : label} disabled={disabled} onClick={onClick}><span className="word-action-icon" aria-hidden="true">{icon}</span><span>{label}</span></button>;
}
function Stack({children}:{children:ReactNode}) { return <div className="word-stack">{children}</div>; }
function Small({label,onClick,disabled=false}:{label:string;onClick?:()=>void;disabled?:boolean}) {return <button className="word-small" title={disabled ? label+' (not yet implemented)' : label} disabled={disabled} onClick={onClick}>{label}</button>;}
export default function WordRibbons(p:Props) {
 if (p.tab==='Design') return <>
  <Group name="Themes"><Action icon="▦" label="Themes" onClick={()=>p.setTheme(p.theme==='Classic'?'Modern':'Classic')}/></Group>
  <Group name="Document Formatting">
   <div className="word-theme-gallery">{['Classic','Modern','Elegant','Minimal','Formal','Contemporary'].map(t=><button key={t} className={'word-theme-tile '+(p.theme===t?'selected':'')} onClick={()=>p.setTheme(t)}><strong>Title</strong><span>Heading 1</span><small>Body text sample</small></button>)}</div>
   <Stack>
    <label className="word-small">Colors <input type="color" aria-label="Theme accent color" value={p.designColor} onChange={e=>p.setDesignColor(e.target.value)}/></label>
    <label className="word-small">Fonts <select aria-label="Document theme font" value={p.designFont} onChange={e=>p.setDesignFont(e.target.value)}>{['Arial','Calibri','Georgia','Roboto','Open Sans','Lato','Montserrat','Merriweather','Playfair Display','Inter','Noto Sans','Noto Serif'].map(f=><option key={f}>{f}</option>)}</select></label>
    <label className="word-small">Paragraph Spacing <select aria-label="Document paragraph spacing" value={p.designSpacing} onChange={e=>p.setDesignSpacing(Number(e.target.value))}><option value={1}>Compact</option><option value={1.3}>Normal</option><option value={1.6}>Relaxed</option><option value={2}>Double</option></select></label>
    <Small label="Effects ▾" disabled/><Small label="Set as Default" onClick={p.onSetDefault}/>
   </Stack>
  </Group>
  <Group name="Page Background"><label className="word-color-action"><span className="word-action-icon">W</span><span>Watermark</span><select aria-label="Watermark" value={p.watermark} onChange={e=>p.setWatermark(e.target.value)}><option value="">None</option><option value="DRAFT">DRAFT</option><option value="CONFIDENTIAL">CONFIDENTIAL</option><option value="SAMPLE">SAMPLE</option></select></label><label className="word-color-action"><span className="word-action-icon">▧</span><span>Page Color</span><input type="color" aria-label="Page Color" value={p.pageColor} onChange={e=>p.setPageColor(e.target.value)}/></label><label className="word-color-action"><span className="word-action-icon">▣</span><span>Page Borders</span><select aria-label="Page border" value={p.pageBorder} onChange={e=>p.setPageBorder(e.target.value)}><option value="none">None</option><option value="solid">Box</option><option value="double">Double</option><option value="dashed">Dashed</option></select></label></Group>
 </>;
 if (p.tab==='Layout') return <>
  <Group name="Page Setup">
   <Action icon="↧" label="Text Direction" disabled/>
   <Stack><label className="word-small">Margins <select aria-label="Page margins" value={p.margin} onChange={e=>p.setMargin(Number(e.target.value))}><option value={15}>Narrow</option><option value={25}>Normal</option><option value={35}>Wide</option></select></label><label className="word-small">Orientation <select aria-label="Page orientation" value={p.orientation} onChange={e=>p.setOrientation(e.target.value as 'portrait'|'landscape')}><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></label></Stack>
   <Action icon="▤" label="Size" disabled/><Action icon="▥" label="Columns" disabled/>
   <Stack><Small label="Breaks ▾" disabled/><Small label="Section Pane" disabled/></Stack>
  </Group>
  <Group name="Paragraph"><div className="word-numeric-grid"><label>Left indent <input type="number" min="0" max="8" step=".5" disabled defaultValue="0"/> cm</label><label>Right indent <input type="number" min="0" max="8" step=".5" disabled defaultValue="0"/> cm</label><label>Before <input type="number" min="0" disabled defaultValue="0"/> pt</label><label>After <input type="number" min="0" disabled defaultValue="4"/> pt</label></div></Group>
  <Group name="Arrange"><Action icon="▧" label="Position" disabled/><Action icon="▤" label="Wrap Text" disabled/><Stack><Small label="Bring Forward" disabled/><Small label="Send Backward" disabled/><Small label="Selection Pane" disabled/></Stack></Group>
 </>;
 if (p.tab==='References') return <>
  <Group name="Table of Contents"><Action icon="▤" label="Table of Contents" disabled/><Stack><Small label="Add Text" disabled/><Small label="Update Table" disabled/></Stack></Group>
  <Group name="Footnotes"><Action icon="¹" label="Insert Footnote" disabled/><Stack><Small label="Insert Endnote" disabled/><Small label="Next Footnote" disabled/><Small label="Show Notes" disabled/></Stack></Group>
  <Group name="Research"><Action icon="⌕" label="Researcher" disabled/></Group>
  <Group name="Citations & Bibliography"><Action icon="❞" label="Insert Citation" disabled/><Stack><Small label="Manage Sources" disabled/><Small label="Style: APA" disabled/><Small label="Bibliography" disabled/></Stack></Group>
  <Group name="Captions"><Action icon="▣" label="Insert Caption" disabled/><Stack><Small label="Insert Table of Figures" disabled/><Small label="Update Table" disabled/><Small label="Cross-reference" disabled/></Stack></Group>
  <Group name="Index"><Action icon="A" label="Mark Entry" disabled/><Stack><Small label="Insert Index" disabled/><Small label="Update Index" disabled/></Stack></Group>
 </>;
 if (p.tab==='Review') return <>
  <Group name="Proofing"><Action icon="✓" label="Spelling & Grammar" disabled/><Stack><Small label="Thesaurus" disabled/><Small label="Word Count" onClick={p.onWordCount}/></Stack></Group>
  <Group name="Accessibility"><Action icon="♙" label="Check Accessibility" disabled/></Group>
  <Group name="Language"><Action icon="文" label="Language" disabled/></Group>
  <Group name="Comments"><Action icon="▣" label="New Comment" disabled/><Stack><Small label="Delete" disabled/><Small label="Previous" disabled/><Small label="Next" disabled/></Stack></Group>
  <Group name="Tracking"><Action icon="▤" label="Track Changes" disabled/><Stack><Small label="All Markup" disabled/><Small label="Reviewing Pane" disabled/></Stack></Group>
  <Group name="Changes"><Action icon="⋯" label="Accept / Reject" disabled/></Group>
  <Group name="Compare"><Action icon="▣" label="Compare" disabled/></Group>
  <Group name="Protect"><Action icon="♙" label="Restrict Editing" disabled/></Group>
 </>;
 if (p.tab==='View') return <>
  <Group name="Views"><Action icon="▤" label="Print Layout" onClick={()=>p.setZoom(100)}/><Action icon="◉" label="Web Layout" disabled/><Stack><Small label="Outline" disabled/><Small label="Draft" disabled/></Stack></Group>
  <Group name="Immersive"><Action icon="⛶" label="Focus" onClick={p.onFullscreen}/></Group>
  <Group name="Page Movement"><Action icon="▤" label="Vertical" disabled/><Action icon="▥" label="Side to Side" disabled/></Group>
  <Group name="Show"><Stack><label className="word-checkbox"><input type="checkbox" checked={p.ruler} onChange={e=>p.setRuler(e.target.checked)}/> Ruler</label><label className="word-checkbox"><input type="checkbox" checked={p.navigation} onChange={e=>p.setNavigation(e.target.checked)}/> Navigation Pane</label><label className="word-checkbox"><input type="checkbox" disabled/> Gridlines</label></Stack></Group>
  <Group name="Zoom"><Stack><Small label="Zoom out −" onClick={()=>p.setZoom(Math.max(50,p.zoom-10))}/><Small label={p.zoom+'% (reset)'} onClick={()=>p.setZoom(100)}/><Small label="Zoom in +" onClick={()=>p.setZoom(Math.min(200,p.zoom+10))}/></Stack></Group>
  <Group name="Dark Mode"><Action icon="◐" label="Switch Modes" disabled/><Action icon="▣" label="Interface Theme" disabled/></Group>
  <Group name="Window"><Action icon="▥" label="Window" disabled/></Group>
  <Group name="Templates"><Action icon="▤" label="Templates" disabled/></Group>
 </>;
 return null;
}
