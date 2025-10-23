import{c as t}from"./WishlistSidebar-CNTDz3PB.js";import{g as c}from"./AuthModal-Brs5OU3Q.js";/**
 * @license lucide-react v0.540.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],n=t("check",a),i=async e=>{try{return(await c("/api/getUsersDataWithId",{Id:e}))?.data||null}catch(r){return console.error("Get User By ID Service Error:",r),null}};export{n as C,i as g};
