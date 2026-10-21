import type {ReactNode} from 'react';
type Props={
 onCover:()=>void;onBlank:()=>void;onPageBreak:()=>void;onTable:(rows:number,cols:number)=>void;
 onPicture:()=>void;onLink:()=>void;onBookmark:()=>void;onTextBox:()=>void;
 onDate:()=>void;onTime:()=>void;onRule:()=>void;onSymbol:(s:string)=>void;
 onHeader:()=>void;onFooter:()=>void;onPageNumber:()=>void;
};
function Group({title,children}:{title:string;children:ReactNode}){return <section className="ribbon-group"><div className="ribbon-tools">{children}</div><small>{title}</small></section>}
function Item({icon,label,onClick,disabled=false}:{icon:string;label:string;onClick?:()=>void;disabled?:boolean}){return <button className="insert-item" disabled={disabled} onClick={onClick} title={disabled?label+' — planned':label}><span className="insert-symbol">{icon}</span><span>{label}</span></button>}
function Stack({children}:{children:ReactNode}){return <div className="insert-stack">{children}</div>}
export default function InsertRibbon(p:Props){return <>
 <Group title="Pages"><Stack><button onClick={p.onCover}>▤ Cover Page</button><button onClick={p.onBlank}>▤ Blank Page</button><button onClick={p.onPageBreak}>↵ Page Break</button></Stack></Group>
 <Group title="Tables"><label className="insert-grid-control"><span className="insert-symbol">▦</span><span>Table</span><select aria-label="Insert table" defaultValue="" onChange={e=>{const [r,c]=e.target.value.split('x').map(Number);if(r&&c)p.onTable(r,c);e.target.value=''}}><option value="">Choose size ▾</option>{[2,3,4,5,6].flatMap(r=>[2,3,4,5].map(c=><option key={r+'x'+c} value={r+'x'+c}>{c} columns × {r} rows</option>))}</select></label></Group>
 <Group title="Illustrations"><Item icon="▧" label="Pictures" onClick={p.onPicture}/><Item icon="◩" label="Shapes" disabled/><Stack><button disabled>◉ Icons</button><button disabled>♧ SmartArt</button><button disabled>▥ Chart</button></Stack></Group>
 <Group title="Links"><Stack><button onClick={p.onLink}>↗ Link</button><button onClick={p.onBookmark}>⚑ Bookmark</button><button disabled>↳ Cross-reference</button></Stack></Group>
 <Group title="Comments"><Item icon="▣" label="Comment" disabled/></Group>
 <Group title="Header & Footer"><Item icon="▤" label="Header" onClick={p.onHeader}/><Item icon="▤" label="Footer" onClick={p.onFooter}/><Item icon="#" label="Page Number" onClick={p.onPageNumber}/></Group>
 <Group title="Text"><Item icon="▣" label="Text Box" onClick={p.onTextBox}/><Stack><button disabled>▦ Quick Parts</button><button disabled>A WordArt</button><button disabled>▤ Drop Cap</button></Stack><Stack><button onClick={p.onDate}>◷ Date</button><button onClick={p.onTime}>◴ Time</button><button onClick={p.onRule}>─ Divider</button></Stack></Group>
 <Group title="Symbols"><Item icon="π" label="Equation" disabled/><label className="insert-grid-control"><span className="insert-symbol">Ω</span><span>Symbol</span><select aria-label="Insert symbol" defaultValue="" onChange={e=>{if(e.target.value)p.onSymbol(e.target.value);e.target.value=''}}><option value="">Choose ▾</option>{['©','®','™','—','–','•','°','±','÷','×','€','£','¥','§','¶','∞','Ω','π','α','β','γ','√','≠','≤','≥','→','←','✓','★'].map(v=><option key={v} value={v}>{v}</option>)}</select></label></Group>
 </>}
