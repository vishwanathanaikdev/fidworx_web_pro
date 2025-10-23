import{c as s}from"./WishlistSidebar-CNTDz3PB.js";import{g as r}from"./AuthModal-Brs5OU3Q.js";/**
 * @license lucide-react v0.540.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],l=s("circle-check-big",o),f=async(t=1,a=10,c={})=>{const n={page:t,size:a,...c},e=await r("/api/searchManageOfficeData",n);return e?.data?{data:e.data,total:e.total||0,page:e.page||t,size:e.size||a,...c}:{data:[],total:0,page:t,size:a}},g=async t=>{try{return(await r("/api/getManagedOfficeDataWithId",{Id:t}))?.data||null}catch(a){return console.error("Managed Office By ID Service Error:",a),null}};export{l as C,g,f as s};
