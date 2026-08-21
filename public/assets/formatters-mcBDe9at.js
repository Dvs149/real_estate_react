import{c}from"./index-BVaVEPA7.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],y=c("Calendar",s);function d(t){if(!t)return"TBD";try{let e=String(t).trim();e.includes("T")&&(e=e.split("T")[0]);const r=e.split("-");if(r.length===3){const a=parseInt(r[0],10),i=parseInt(r[1],10)-1,o=parseInt(r[2],10);if(!isNaN(a)&&!isNaN(i)&&!isNaN(o))return new Date(a,i,o).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}const n=new Date(t);return isNaN(n.getTime())?String(t):n.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}catch{return String(t)}}export{y as C,d as f};
