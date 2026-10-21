import {Node, Mark} from '@tiptap/core';
export const ImageNode=Node.create({
 name:'verbumImage',group:'block',atom:true,draggable:true,
 addAttributes(){return {src:{default:null},alt:{default:''},width:{default:null}};},
 parseHTML(){return [{tag:'img[src]'}]},
 renderHTML({HTMLAttributes}){return ['img',{...HTMLAttributes,class:'verbum-inserted-image'}]},
});
export const PageBreakNode=Node.create({
 name:'pageBreak',group:'block',atom:true,selectable:true,
 parseHTML(){return [{tag:'div[data-page-break]'}]},
 renderHTML(){return ['div',{'data-page-break':'true',class:'verbum-page-break','aria-label':'Page break'}]},
});
export const LinkMark=Mark.create({
 name:'link',inclusive:false,
 addAttributes(){return {href:{default:null},target:{default:'_blank'},rel:{default:'noopener noreferrer'}}},
 parseHTML(){return [{tag:'a[href]'}]},
 renderHTML({HTMLAttributes}){return ['a',HTMLAttributes,0]},
});
export const TableNode=Node.create({
 name:'table',group:'block',content:'tableRow+',isolating:true,
 parseHTML(){return [{tag:'table'}]},renderHTML(){return ['table',{class:'verbum-table'},['tbody',0]]},
});
export const TableRowNode=Node.create({
 name:'tableRow',content:'tableCell+',parseHTML(){return [{tag:'tr'}]},renderHTML(){return ['tr',0]},
});
export const TableCellNode=Node.create({
 name:'tableCell',content:'paragraph+',isolating:true,
 parseHTML(){return [{tag:'td'},{tag:'th'}]},renderHTML(){return ['td',0]},
});
