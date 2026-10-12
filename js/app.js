import{initializeApp}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import*as A from"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import*as F from"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import{firebaseConfig}from"./firebase-config.js";
const app=initializeApp(firebaseConfig);
export const auth=A.getAuth(app),db=F.getFirestore(app);export{A,F};
export const $=s=>document.querySelector(s);
export const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const STAGES=["Submitted","Assigned","In Progress","Resolved"];
const STE=["నమోదైంది","కేటాయించారు","పురోగతిలో ఉంది","పరిష్కరించారు"];
export const CATS={roads:["🛣️","Roads","రోడ్లు"],water:["🚰","Water Supply","తాగునీరు"],electricity:["⚡","Electricity","విద్యుత్"],streetlights:["💡","Street Lights","వీధి దీపాలు"],drainage:["🌊","Drainage","డ్రైనేజీ"]};
let lang=localStorage.lang||"en";
export const catName=k=>CATS[k]?.[lang=="te"?2:1]||k;
export const stName=s=>lang=="te"?STE[STAGES.indexOf(s)]||s:s;
export const pct=s=>(STAGES.indexOf(s)+1)*25;
const T={en:{reg:"Register complaint",trk:"Track complaint",login:"Login",out:"Logout",dash:"My dashboard",admin:"Admin",h1:"Report it. Watch it get fixed.",sub:"Raise a village or ward issue with your Sachivalayam and follow it from submission to resolution.",tot:"Total complaints",act:"Active",res:"Resolved",jr:"How a complaint moves",cat:"What you can report"},
te:{reg:"ఫిర్యాదు నమోదు",trk:"ఫిర్యాదు ట్రాక్",login:"లాగిన్",out:"లాగౌట్",dash:"నా డాష్‌బోర్డ్",admin:"అడ్మిన్",h1:"తెలియజేయండి. పరిష్కారం చూడండి.",sub:"మీ సచివాలయానికి గ్రామ లేదా వార్డు సమస్యను తెలిపి, పరిష్కారం వరకు ట్రాక్ చేయండి.",tot:"మొత్తం ఫిర్యాదులు",act:"క్రియాశీలమైనవి",res:"పరిష్కరించినవి",jr:"ఫిర్యాదు ఎలా ముందుకు సాగుతుంది",cat:"మీరు తెలియజేయగల సమస్యలు"}};
export const tr=k=>T[lang][k]||T.en[k]||k;
export const bar=s=>`<div class="bar"><i style="width:${pct(s)}%"></i></div>`;
export const when=t=>new Date(t).toLocaleString(lang=="te"?"te-IN":"en-IN");
export const tl=a=>`<ol class="tl">${a.map(x=>`<li><b>${stName(x.s)}</b><small>${when(x.t)}${x.n?": "+esc(x.n):""}</small></li>`).join("")}</ol>`;
export const card=c=>`<article class="card"><div class="row"><b>${esc(c.id)}</b><span class="tag s${STAGES.indexOf(c.status)}">${stName(c.status)}</span></div><p>${CATS[c.category]?.[0]||""} ${catName(c.category)}, ${esc(c.place)}</p><p class="mut">${esc(c.description)}</p>${bar(c.status)}<a href="track.html?id=${esc(c.id)}">Track</a> &nbsp; <a href="receipt.html?id=${esc(c.id)}">Receipt</a></article>`;
export const newId=()=>"CMP-"+[...crypto.getRandomValues(new Uint8Array(8))].map(b=>"ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[b%32]).join("");
export const hash=async s=>[...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s.trim().toLowerCase())))].slice(0,12).map(b=>b.toString(16).padStart(2,"0")).join("");
export const toast=m=>{const d=document.createElement("div");d.className="toast";d.textContent=m;document.body.append(d);setTimeout(()=>d.remove(),3500)};
export const authErr=e=>({"auth/invalid-credential":"Wrong email or password.","auth/email-already-in-use":"This email is already registered. Log in instead.","auth/weak-password":"Password needs at least 6 characters.","auth/too-many-requests":"Too many attempts. Try again in a few minutes."}[e.code]||e.message);
export const byNew=(a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0);
export async function boot(){
 await auth.authStateReady();const u=auth.currentUser;let adm=false;
 if(u)try{adm=(await F.getDoc(F.doc(db,"admins",u.uid))).exists()}catch{}
 $("#nav").innerHTML=`<a class="brand" href="index.html">Sachivalayam<span>CMS</span></a><nav><a href="complaint.html" data-i18n="reg"></a><a href="track.html" data-i18n="trk"></a>${u?`<a href="${adm?"admin":"dashboard"}.html" data-i18n="${adm?"admin":"dash"}"></a><a href="#" id="out" data-i18n="out"></a>`:`<a href="login.html" data-i18n="login"></a>`}<button id="lg" aria-label="Language">${lang=="te"?"English":"తెలుగు"}</button></nav>`;
 $("#lg").onclick=()=>{localStorage.lang=lang=="te"?"en":"te";location.reload()};
 $("#out")&&($("#out").onclick=async e=>{e.preventDefault();await A.signOut(auth);location.href="index.html"});
 document.documentElement.lang=lang;document.querySelectorAll("[data-i18n]").forEach(e=>e.textContent=tr(e.dataset.i18n));
 return{u,adm};
}
export async function guard(admin){
 const s=await boot();
 if(!s.u){location.href="login.html?next="+encodeURIComponent(location.pathname.split("/").pop()+location.search);throw 0}
 if(admin&&!s.adm){location.href="dashboard.html";throw 0}
 return s.u;
}
