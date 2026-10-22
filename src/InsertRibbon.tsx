import {createPortal} from 'react-dom';
import {useEffect,useRef,useState,type ReactNode} from 'react';
type Props={
 onCover:()=>void;onBlank:()=>void;onPageBreak:()=>void;onTable:(rows:number,cols:number)=>void;
 onPicture:()=>void;onLink:()=>void;onBookmark:()=>void;onTextBox:()=>void;
 onDate:()=>void;onTime:()=>void;onRule:()=>void;onSymbol:(s:string)=>void;
 onHeader:()=>void;onFooter:()=>void;onPageNumber:()=>void;
 onQuickTable:(kind:'calendar'|'comparison'|'schedule')=>void;
};
function Group({title,children}:{title:string;children:ReactNode}){return <section className="ribbon-group"><div className="ribbon-tools">{children}</div><small>{title}</small></section>}
function Item({icon,label,onClick,disabled=false}:{icon:string;label:string;onClick?:()=>void;disabled?:boolean}){return <button className="insert-item" disabled={disabled} onClick={onClick} title={disabled?label+' — planned':label}><span className="insert-symbol">{icon}</span><span>{label}</span></button>}
function Stack({children}:{children:ReactNode}){return <div className="insert-stack">{children}</div>}
function TablePicker({onInsert,onQuickTable}:{onInsert:(rows:number,cols:number)=>void;onQuickTable:Props['onQuickTable']}) {
 const [open,setOpen]=useState(false),[hover,setHover]=useState<[number,number]>([0,0]);
 const [dialog,setDialog]=useState(false),[rows,setRows]=useState(3),[cols,setCols]=useState(3);
 const [quick,setQuick]=useState(false);
 const ref=useRef<HTMLDivElement>(null);
 const menuRef=useRef<HTMLDivElement>(null);
 const [position,setPosition]=useState({top:0,left:0});
 useEffect(()=>{if(!open)return;const update=()=>{const rect=ref.current?.getBoundingClientRect();if(rect)setPosition({top:Math.min(rect.bottom+5,window.innerHeight-24),left:Math.max(8,Math.min(rect.left,window.innerWidth-322))})};update();window.addEventListener('resize',update);window.addEventListener('scroll',update,true);return()=>{window.removeEventListener('resize',update);window.removeEventListener('scroll',update,true)}},[open]);
 useEffect(()=>{if(!open)return;const close=(e:PointerEvent)=>{if(ref.current&&!ref.current.contains(e.target as globalThis.Node)&&!menuRef.current?.contains(e.target as globalThis.Node))setOpen(false)};const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);setDialog(false)}};document.addEventListener('pointerdown',close);document.addEventListener('keydown',escape);return()=>{document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',escape)}},[open]);
 const insert=(r:number,c:number)=>{onInsert(r,c);setOpen(false);setDialog(false);setHover([0,0])};
 return <div className="table-picker" ref={ref}>
  <button className={'table-picker-trigger'+(open?' selected':'')} aria-expanded={open} aria-haspopup="menu" onClick={()=>setOpen(v=>!v)}><span className="insert-symbol">▦</span><span>Table⌄</span></button>
  {open&&createPortal(<div className="table-picker-menu" ref={menuRef} role="menu" style={{position:"fixed",top:position.top,left:position.left}}>
   <strong>Insert Table</strong><div className="table-picker-caption">{hover[0]&&hover[1]?hover[0]+' × '+hover[1]+' Table':'Select the number of columns and rows'}</div>
   <div className="table-picker-grid" onMouseLeave={()=>setHover([0,0])}>{Array.from({length:80},(_,i)=>{const c=i%10+1,r=Math.floor(i/10)+1;return <button key={i} type="button" aria-label={c+' columns by '+r+' rows'} className={c<=hover[0]&&r<=hover[1]?'highlighted':''} onMouseEnter={()=>setHover([c,r])} onFocus={()=>setHover([c,r])} onClick={()=>insert(r,c)}/>})}</div>
   <div className="table-picker-actions"><button onClick={()=>setDialog(v=>!v)}>▦ Insert Table…</button>
   {dialog&&<form className="table-dimensions" onSubmit={e=>{e.preventDefault();insert(rows,cols)}}><label>Columns <input type="number" min="1" max="30" value={cols} onChange={e=>setCols(Math.max(1,Math.min(30,Number(e.target.value)||1)))}/></label><label>Rows <input type="number" min="1" max="100" value={rows} onChange={e=>setRows(Math.max(1,Math.min(100,Number(e.target.value)||1)))}/></label><button type="submit">Insert</button></form>}
   <button disabled title="Freehand table drawing requires additional editor support">✎ Draw Table</button>
   <button disabled title="Text-to-table conversion is planned">▤ Convert Text to Table…</button>
   <button disabled title="Embedded spreadsheet objects are not supported">▦ Excel Spreadsheet</button>
   <button onClick={()=>setQuick(v=>!v)} aria-expanded={quick}>▦ Quick Tables ▸</button>
   {quick&&<div className="quick-table-options">{(['calendar','comparison','schedule'] as const).map(kind=><button key={kind} onClick={()=>{onQuickTable(kind);setOpen(false)}}>{kind[0].toUpperCase()+kind.slice(1)}</button>)}</div>}
   </div>
  </div>,document.body)}
 </div>;
}
export default function InsertRibbon(p:Props){return <>
 <Group title="Pages"><Stack><button onClick={p.onCover}>▤ Cover Page</button><button onClick={p.onBlank}>▤ Blank Page</button><button onClick={p.onPageBreak}>↵ Page Break</button></Stack></Group>
 <Group title="Tables"><TablePicker onInsert={p.onTable} onQuickTable={p.onQuickTable}/></Group>
 <Group title="Illustrations"><Item icon="▧" label="Pictures" onClick={p.onPicture}/><Item icon="◩" label="Shapes" disabled/><Stack><button disabled>◉ Icons</button><button disabled>♧ SmartArt</button><button disabled>▥ Chart</button></Stack></Group>
 <Group title="Links"><Stack><button onClick={p.onLink}>↗ Link</button><button onClick={p.onBookmark}>⚑ Bookmark</button><button disabled>↳ Cross-reference</button></Stack></Group>
 <Group title="Comments"><Item icon="▣" label="Comment" disabled/></Group>
 <Group title="Header & Footer"><Item icon="▤" label="Header" onClick={p.onHeader}/><Item icon="▤" label="Footer" onClick={p.onFooter}/><Item icon="#" label="Page Number" onClick={p.onPageNumber}/></Group>
 <Group title="Text"><Item icon="▣" label="Text Box" onClick={p.onTextBox}/><Stack><button disabled>▦ Quick Parts</button><button disabled>A WordArt</button><button disabled>▤ Drop Cap</button></Stack><Stack><button onClick={p.onDate}>◷ Date</button><button onClick={p.onTime}>◴ Time</button><button onClick={p.onRule}>─ Divider</button></Stack></Group>
 <Group title="Symbols"><Item icon="π" label="Equation" disabled/><label className="insert-grid-control"><span className="insert-symbol">Ω</span><span>Symbol</span><select aria-label="Insert symbol" defaultValue="" onChange={e=>{if(e.target.value)p.onSymbol(e.target.value);e.target.value=''}}><option value="">Choose ▾</option>{['©','®','™','—','–','•','°','±','÷','×','€','£','¥','§','¶','∞','Ω','π','α','β','γ','√','≠','≤','≥','→','←','✓','★'].map(v=><option key={v} value={v}>{v}</option>)}</select></label></Group>
 </>}
