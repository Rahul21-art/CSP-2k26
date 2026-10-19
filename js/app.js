import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import * as A from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import * as F from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import * as R from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase once.
const app = initializeApp(firebaseConfig);

// Firebase services.
export const auth = A.getAuth(app);
export const db = F.getFirestore(app);
export const rtdb = R.getDatabase(app);

// Export Firebase modules.
export { A, F, R };

// DOM helper.
export const $ = selector => document.querySelector(selector);

// Escape HTML.
export const esc = value =>
    String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[character]));

// Complaint stages.
export const STAGES = [
    "Submitted",
    "Assigned",
    "In Progress",
    "Resolved"
];

const STE = [
    "నమోదైంది",
    "కేటాయించారు",
    "పురోగతిలో ఉంది",
    "పరిష్కరించారు"
];

// Complaint categories.
export const CATS = {
    roads: ["🛣️", "Roads", "రోడ్లు"],
    water: ["🚰", "Water Supply", "తాగునీరు"],
    electricity: ["⚡", "Electricity", "విద్యుత్"],
    streetlights: ["💡", "Street Lights", "వీధి దీపాలు"],
    drainage: ["🌊", "Drainage", "డ్రైనేజీ"]
};

// Language.
let lang = localStorage.lang || "en";

// Translations.
export const catName = key =>
    CATS[key]?.[lang === "te" ? 2 : 1] || key;

export const stName = stage =>
    lang === "te"
        ? STE[STAGES.indexOf(stage)] || stage
        : stage;

export const pct = stage =>
    (STAGES.indexOf(stage) + 1) * 25;

const T = {
    en: {
        reg: "Register complaint",
        trk: "Track complaint",
        login: "Login",
        out: "Logout",
        dash: "My dashboard",
        admin: "Admin",
        h1: "Report it. Watch it get fixed.",
        sub: "Raise a village or ward issue with your Sachivalayam and follow it from submission to resolution.",
        tot: "Total complaints",
        act: "Active",
        res: "Resolved",
        jr: "How a complaint moves",
        cat: "What you can report",
        att: "Attach a photo or file (optional)",
        attHint: "Photo, PDF or Word file. Photos are shrunk automatically; PDF and Word files can be up to 600 KB."
    },

    te: {
        reg: "ఫిర్యాదు నమోదు",
        trk: "ఫిర్యాదు ట్రాక్",
        login: "లాగిన్",
        out: "లాగౌట్",
        dash: "నా డాష్‌బోర్డ్",
        admin: "అడ్మిన్",
        h1: "తెలియజేయండి. పరిష్కారం చూడండి.",
        sub: "మీ సచివాలయానికి గ్రామ లేదా వార్డు సమస్యను తెలిపి, పరిష్కారం వరకు ట్రాక్ చేయండి.",
        tot: "మొత్తం ఫిర్యాదులు",
        act: "క్రియాశీలమైనవి",
        res: "పరిష్కరించినవి",
        jr: "ఫిర్యాదు ఎలా ముందుకు సాగుతుంది",
        cat: "మీరు తెలియజేయగల సమస్యలు",
        att: "ఫోటో లేదా ఫైల్ జోడించండి (ఐచ్ఛికం)",
        attHint: "ఫోటో, PDF లేదా Word ఫైల్. ఫోటోలు స్వయంచాలకంగా చిన్నవి అవుతాయి; PDF, Word ఫైళ్లు 600 KB వరకు."
    }
};

export const tr = key =>
    T[lang][key] || T.en[key] || key;

// Complaint progress bar.
export const bar = stage =>
    `<div class="bar"><i style="width:${pct(stage)}%"></i></div>`;

// Format dates.
export const when = timestamp =>
    new Date(timestamp).toLocaleString(
        lang === "te" ? "te-IN" : "en-IN"
    );

// Complaint timeline.
export const tl = items =>
    `<ol class="tl">${items.map(item => `
        <li>
            <b>${stName(item.s)}</b>
            <small>${when(item.t)}${item.n ? ": " + esc(item.n) : ""}</small>
        </li>
    `).join("")}</ol>`;

// Complaint card.
export const card = complaint => `
    <article class="card">
        <div class="row">
            <b>${esc(complaint.id)}</b>
            <span class="tag s${STAGES.indexOf(complaint.status)}">
                ${stName(complaint.status)}
            </span>
        </div>

        <p>
            ${CATS[complaint.category]?.[0] || ""}
            ${catName(complaint.category)},
            ${esc(complaint.place)}
            ${complaint.hasFile ? " 📎" : ""}
        </p>

        <p class="mut">${esc(complaint.description)}</p>

        ${bar(complaint.status)}

        <a href="track.html?id=${encodeURIComponent(complaint.id)}">
            Track
        </a>

        &nbsp;

        <a href="receipt.html?id=${encodeURIComponent(complaint.id)}">
            Receipt
        </a>
    </article>
`;

// Generate complaint ID.
export const newId = () =>
    "CMP-" +
    [...crypto.getRandomValues(new Uint8Array(8))]
        .map(byte =>
            "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[byte % 32]
        )
        .join("");

// Hash helper.
export const hash = async value =>
    [...new Uint8Array(
        await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(value.trim().toLowerCase())
        )
    )]
        .slice(0, 12)
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");

// Toast notifications.
export const toast = (
    message,
    ms = Math.min(10000, Math.max(4500, String(message).length * 70))
) => {
    let holder = document.getElementById("toasts");

    if (!holder) {
        holder = document.createElement("div");
        holder.id = "toasts";
        holder.setAttribute("role", "status");
        holder.setAttribute("aria-live", "polite");

        holder.style.cssText =
            "position:fixed;top:0;left:0;right:0;padding:12px 4vw;" +
            "display:flex;flex-direction:column;align-items:center;" +
            "gap:8px;z-index:2147483000;pointer-events:none";

        document.body.append(holder);
    }

    const notification = document.createElement("div");

    notification.textContent = message;
    notification.title = "Tap to close";

    notification.style.cssText =
        "position:relative;pointer-events:auto;cursor:pointer;" +
        "max-width:min(92vw,440px);box-sizing:border-box;" +
        "background:#fff;color:#101b3d;font:600 16px/1.4 system-ui,sans-serif;" +
        "padding:12px 18px;border:1px solid #101b3d;" +
        "border-left:8px solid #f2a93b;border-radius:10px;" +
        "box-shadow:0 8px 24px rgba(0,0,0,.45);" +
        "overflow-wrap:anywhere;margin:0";

    notification.onclick = () => notification.remove();

    holder.append(notification);

    setTimeout(() => notification.remove(), ms);
};

// Attachment configuration.
const MIME = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
};

const LIM = 850000;

const okData = data =>
    typeof data === "string" &&
    /^data:[\w.+/-]*;base64,/.test(data.slice(0, 100));

// Compress image attachments.
const shrink = (file, width, quality) =>
    new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const image = new Image();

        image.onload = () => {
            const scale = Math.min(
                1,
                width / Math.max(image.width, image.height)
            );

            const canvas = document.createElement("canvas");

            canvas.width = Math.max(
                1,
                Math.round(image.width * scale)
            );

            canvas.height = Math.max(
                1,
                Math.round(image.height * scale)
            );

            const context = canvas.getContext("2d");

            context.fillStyle = "#fff";
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.drawImage(
                image,
                0,
                0,
                canvas.width,
                canvas.height
            );

            URL.revokeObjectURL(url);

            resolve(canvas.toDataURL("image/jpeg", quality));
        };

        image.onerror = () => {
            URL.revokeObjectURL(url);

            reject(
                new Error(
                    "This photo format is not supported. Please use a JPG or PNG photo."
                )
            );
        };

        image.src = url;
    });

// Read file.
const readURL = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);

        reader.onerror = () =>
            reject(new Error("Could not read the file."));

        reader.readAsDataURL(file);
    });

// Prepare file attachment.
export async function prepareFile(file) {
    if (file.size > 25e6) {
        throw new Error("File is too large.");
    }

    if (file.type.startsWith("image/")) {
        for (const [width, quality] of [
            [1280, 0.78],
            [1024, 0.65],
            [800, 0.55],
            [640, 0.45]
        ]) {
            const data = await shrink(file, width, quality);

            if (data.length <= LIM) {
                return {
                    name: file.name.replace(/\.[^.]+$/, "") + ".jpg",
                    type: "image/jpeg",
                    size: Math.round(data.length * 0.75),
                    data
                };
            }
        }

        throw new Error(
            "Could not shrink this photo enough. Try a smaller one."
        );
    }

    const extension =
        (file.name.split(".").pop() || "").toLowerCase();

    const type = MIME[extension];

    if (!type) {
        throw new Error(
            "Only photos, PDF or Word files can be attached."
        );
    }

    if (file.size > 600 * 1024) {
        throw new Error(
            "This file is over 600 KB. Attach a smaller file, or a photo of it."
        );
    }

    return {
        name: file.name,
        type,
        size: file.size,
        data: await readURL(file)
    };
}

// Display file attachment.
export function fileEl(attachment) {
    const wrapper = document.createElement("div");

    try {
        if (!attachment || !okData(attachment.data)) {
            return wrapper;
        }

        if (attachment.type === "image/jpeg") {
            const image = new Image();

            image.className = "att";
            image.alt = attachment.name;
            image.src = attachment.data;

            wrapper.append(image);
        } else if (Object.values(MIME).includes(attachment.type)) {
            const link = document.createElement("a");

            const base64 = atob(
                attachment.data.split(",")[1]
            );

            const bytes = new Uint8Array(base64.length);

            for (let i = 0; i < base64.length; i++) {
                bytes[i] = base64.charCodeAt(i);
            }

            link.className = "btn sm";
            link.textContent = "📎 " + attachment.name;
            link.target = "_blank";
            link.rel = "noopener";

            if (attachment.type !== "application/pdf") {
                link.download = attachment.name;
            }

            link.href = URL.createObjectURL(
                new Blob([bytes], { type: attachment.type })
            );

            wrapper.append(link);
        }
    } catch (error) {
        console.error("Attachment display error:", error);
    }

    return wrapper;
}

// Firebase authentication error messages.
export const authErr = error => ({
    "auth/invalid-credential": "Wrong email or password.",
    "auth/user-not-found": "No account found for this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/email-already-in-use": "This email is already registered. Log in instead.",
    "auth/weak-password": "Password needs at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Try again in a few minutes."
}[error.code] || error.message || "An unexpected error occurred.");

// Sort complaints by newest first.
export const byNew = (a, b) =>
    (b.createdAt?.seconds || 0) -
    (a.createdAt?.seconds || 0);

// Check whether the authenticated user is an admin.
export async function isAdmin(user) {
    if (!user) {
        return false;
    }

    try {
        const snapshot = await R.get(
            R.ref(rtdb, "admins/" + user.uid)
        );

        return snapshot.val() === true;
    } catch (error) {
        console.error("Admin status check failed:", error);
        throw error;
    }
}

// Initialize navigation and user state.
export async function boot() {
    await auth.authStateReady();

    const user = auth.currentUser;
    let admin = false;

    if (user) {
        try {
            admin = await isAdmin(user);
        } catch (error) {
            console.error(
                "Could not verify admin status:",
                error.code,
                error.message
            );
        }
    }

    const nav = $("#nav");

    if (nav) {
        nav.innerHTML = `
            <a class="brand" href="index.html">
                Sachivalayam<span>CMS</span>
            </a>

            <nav>
                <a href="complaint.html" data-i18n="reg"></a>
                <a href="track.html" data-i18n="trk"></a>

                ${
                    user
                        ? `
                            <a href="${admin ? "admin" : "dashboard"}.html"
                               data-i18n="${admin ? "admin" : "dash"}"></a>
                            <a href="#" id="out" data-i18n="out"></a>
                          `
                        : `
                            <a href="login.html" data-i18n="login"></a>
                          `
                }

                <button id="lg" aria-label="Language">
                    ${lang === "te" ? "English" : "తెలుగు"}
                </button>
            </nav>
        `;

        $("#lg").onclick = () => {
            localStorage.lang = lang === "te" ? "en" : "te";
            location.reload();
        };

        const logout = $("#out");

        if (logout) {
            logout.onclick = async event => {
                event.preventDefault();

                await A.signOut(auth);

                location.href = "index.html";
            };
        }

        document.documentElement.lang = lang;

        document
            .querySelectorAll("[data-i18n]")
            .forEach(element => {
                element.textContent = tr(element.dataset.i18n);
            });
    }

    return {
        u: user,
        adm: admin
    };
}

// Protect pages that require login or admin access.
export async function guard(requireAdmin = false) {
    const state = await boot();

    if (!state.u) {
        location.href =
            "login.html?next=" +
            encodeURIComponent(
                location.pathname.split("/").pop() + location.search
            );

        throw new Error("Login required.");
    }

    if (requireAdmin && !state.adm) {
        location.href = "dashboard.html";

        throw new Error("Administrator access required.");
    }

    return state.u;
}
