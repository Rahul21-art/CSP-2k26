import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import *as A from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import *as F from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
const app = initializeApp(firebaseConfig);
export const auth = A.getAuth(app), db = F.getFirestore(app); export { A, F };
export const $ = s => document.querySelector(s);
export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const STAGES = ["Submitted", "Assigned", "In Progress", "Resolved"];
const STE = ["నమోదైంది", "కేటాయించారు", "పురోగతిలో ఉంది", "పరిష్కరించారు"];
export const CATS = { roads: ["🛣️", "Roads", "రోడ్లు"], water: ["🚰", "Water Supply", "తాగునీరు"], electricity: ["⚡", "Electricity", "విద్యుత్"], streetlights: ["💡", "Street Lights", "వీధి దీపాలు"], drainage: ["🌊", "Drainage", "డ్రైనేజీ"] };
let lang = localStorage.lang || "en";
export const catName = k => CATS[k]?.[lang == "te" ? 2 : 1] || k;
export const stName = s => lang == "te" ? STE[STAGES.indexOf(s)] || s : s;
export const pct = s => (STAGES.indexOf(s) + 1) * 25;
const T = {
    en: { reg: "Register complaint", trk: "Track complaint", login: "Login", out: "Logout", dash: "My dashboard", admin: "Admin", h1: "Report it. Watch it get fixed.", sub: "Raise a village or ward issue with your Sachivalayam and follow it from submission to resolution.", tot: "Total complaints", act: "Active", res: "Resolved", jr: "How a complaint moves", cat: "What you can report", att: "Attach a photo or file (optional)", attHint: "Photo, PDF or Word file. Photos are shrunk automatically; PDF and Word files can be up to 600 KB." },
    te: { reg: "ఫిర్యాదు నమోదు", trk: "ఫిర్యాదు ట్రాక్", login: "లాగిన్", out: "లాగౌట్", dash: "నా డాష్‌బోర్డ్", admin: "అడ్మిన్", h1: "తెలియజేయండి. పరిష్కారం చూడండి.", sub: "మీ సచివాలయానికి గ్రామ లేదా వార్డు సమస్యను తెలిపి, పరిష్కారం వరకు ట్రాక్ చేయండి.", tot: "మొత్తం ఫిర్యాదులు", act: "క్రియాశీలమైనవి", res: "పరిష్కరించినవి", jr: "ఫిర్యాదు ఎలా ముందుకు సాగుతుంది", cat: "మీరు తెలియజేయగల సమస్యలు", att: "ఫోటో లేదా ఫైల్ జోడించండి (ఐచ్ఛికం)", attHint: "ఫోటో, PDF లేదా Word ఫైల్. ఫోటోలు స్వయంచాలకంగా చిన్నవి అవుతాయి; PDF, Word ఫైళ్లు 600 KB వరకు." }
};
export const tr = k => T[lang][k] || T.en[k] || k;
export const bar = s => `<div class="bar"><i style="width:${pct(s)}%"></i></div>`;
export const when = t => new Date(t).toLocaleString(lang == "te" ? "te-IN" : "en-IN");
export const tl = a => `<ol class="tl">${a.map(x => `<li><b>${stName(x.s)}</b><small>${when(x.t)}${x.n ? ": " + esc(x.n) : ""}</small></li>`).join("")}</ol>`;
export const card = c => `<article class="card"><div class="row"><b>${esc(c.id)}</b><span class="tag s${STAGES.indexOf(c.status)}">${stName(c.status)}</span></div><p>${CATS[c.category]?.[0] || ""} ${catName(c.category)}, ${esc(c.place)}${c.hasFile ? " 📎" : ""}</p><p class="mut">${esc(c.description)}</p>${bar(c.status)}<a href="track.html?id=${esc(c.id)}">Track</a> &nbsp; <a href="receipt.html?id=${esc(c.id)}">Receipt</a></article>`;
export const newId = () => "CMP-" + [...crypto.getRandomValues(new Uint8Array(8))].map(b => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[b % 32]).join("");
export const hash = async s => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s.trim().toLowerCase())))].slice(0, 12).map(b => b.toString(16).padStart(2, "0")).join("");
export const toast = (m, ms = Math.min(10000, Math.max(4500, String(m).length * 70))) => {
    let h = document.getElementById("toasts");
    if (!h) {
        h = document.createElement("div"); h.id = "toasts"; h.setAttribute("role", "status"); h.setAttribute("aria-live", "polite");
        h.style.cssText = "position:fixed;top:0;left:0;right:0;padding:12px 4vw;display:flex;flex-direction:column;align-items:center;gap:8px;z-index:2147483000;pointer-events:none"; document.body.append(h)
    }
    const d = document.createElement("div"); d.textContent = m; d.title = "Tap to close";
    d.style.cssText = "position:relative;left:auto;right:auto;top:auto;bottom:auto;transform:none;pointer-events:auto;cursor:pointer;max-width:min(92vw,440px);box-sizing:border-box;background:#fff;color:#101b3d;font:600 16px/1.4 system-ui,sans-serif;padding:12px 18px;border:1px solid #101b3d;border-left:8px solid #f2a93b;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.45);overflow-wrap:anywhere;margin:0";
    d.onclick = () => d.remove(); h.append(d); setTimeout(() => d.remove(), ms)
};
const MIME = { pdf: "application/pdf", doc: "application/msword", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }, LIM = 850000;
const okData = d => typeof d == "string" && /^data:[\w.+\/-]*;base64,/.test(d.slice(0, 100));
const shrink = (f, w, q) => new Promise((y, n) => { const u = URL.createObjectURL(f), i = new Image(); i.onload = () => { const k = Math.min(1, w / Math.max(i.width, i.height)), c = document.createElement("canvas"), x = c.getContext("2d"); c.width = Math.max(1, Math.round(i.width * k)); c.height = Math.max(1, Math.round(i.height * k)); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(i, 0, 0, c.width, c.height); URL.revokeObjectURL(u); y(c.toDataURL("image/jpeg", q)) }; i.onerror = () => { URL.revokeObjectURL(u); n(new Error("This photo format is not supported. Please use a JPG or PNG photo.")) }; i.src = u });
const readURL = f => new Promise((y, n) => { const r = new FileReader(); r.onload = () => y(r.result); r.onerror = () => n(new Error("Could not read the file.")); r.readAsDataURL(f) });
export async function prepareFile(f) {
    if (f.size > 25e6) throw new Error("File is too large.");
    if (f.type.startsWith("image/")) { for (const [w, q] of [[1280, .78], [1024, .65], [800, .55], [640, .45]]) { const data = await shrink(f, w, q); if (data.length <= LIM) return { name: f.name.replace(/\.[^.]+$/, "") + ".jpg", type: "image/jpeg", size: Math.round(data.length * .75), data } } throw new Error("Could not shrink this photo enough. Try a smaller one.") }
    const type = MIME[(f.name.split(".").pop() || "").toLowerCase()];
    if (!type) throw new Error("Only photos, PDF or Word files can be attached.");
    if (f.size > 600 * 1024) throw new Error("This file is over 600 KB. Attach a smaller file, or a photo of it.");
    return { name: f.name, type, size: f.size, data: await readURL(f) };
}
export function fileEl(a) {
    const w = document.createElement("div");
    try {
        if (!a || !okData(a.data)) return w;
        if (a.type == "image/jpeg") { const i = new Image(); i.className = "att"; i.alt = a.name; i.src = a.data; w.append(i) }
        else if (Object.values(MIME).includes(a.type)) {
            const l = document.createElement("a"), b = atob(a.data.split(",")[1]), u = new Uint8Array(b.length); for (let k = 0; k < b.length; k++)u[k] = b.charCodeAt(k);
            l.className = "btn sm"; l.textContent = "📎 " + a.name; l.target = "_blank"; l.rel = "noopener"; if (a.type != "application/pdf") l.download = a.name;
            l.href = URL.createObjectURL(new Blob([u], { type: a.type })); w.append(l)
        }
    } catch { }
    return w
}
export const authErr = e => ({ "auth/invalid-credential": "Wrong email or password.", "auth/email-already-in-use": "This email is already registered. Log in instead.", "auth/weak-password": "Password needs at least 6 characters.", "auth/too-many-requests": "Too many attempts. Try again in a few minutes." }[e.code] || e.message);
export const byNew = (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
export async function boot() {
    await auth.authStateReady(); const u = auth.currentUser; let adm = false;
    if (u) try { adm = (await F.getDoc(F.doc(db, "admins", u.uid))).exists() } catch { }
    $("#nav").innerHTML = `<a class="brand" href="index.html">Sachivalayam<span>CMS</span></a><nav><a href="complaint.html" data-i18n="reg"></a><a href="track.html" data-i18n="trk"></a>${u ? `<a href="${adm ? "admin" : "dashboard"}.html" data-i18n="${adm ? "admin" : "dash"}"></a><a href="#" id="out" data-i18n="out"></a>` : `<a href="login.html" data-i18n="login"></a>`}<button id="lg" aria-label="Language">${lang == "te" ? "English" : "తెలుగు"}</button></nav>`;
    $("#lg").onclick = () => { localStorage.lang = lang == "te" ? "en" : "te"; location.reload() };
    $("#out") && ($("#out").onclick = async e => { e.preventDefault(); await A.signOut(auth); location.href = "index.html" });
    document.documentElement.lang = lang; document.querySelectorAll("[data-i18n]").forEach(e => e.textContent = tr(e.dataset.i18n));
    return { u, adm };
}
export async function guard(admin) {
    const s = await boot();
    if (!s.u) { location.href = "login.html?next=" + encodeURIComponent(location.pathname.split("/").pop() + location.search); throw 0 }
    if (admin && !s.adm) { location.href = "dashboard.html"; throw 0 }
    return s.u;
}