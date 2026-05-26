// ======= CONFIG =======
export const ADMIN_PASS = "ProfitAdda@2025";
export const SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbywfTWFTZnvIFvLdb-LFDrduFGVq9L9xUA2Q_yyVLjoLhBftoO92lhsXY5fG3vC56M0/exec";
export const USE_SHEETS = true;

// ======= STORAGE (always local cache + optional Sheets sync) =======
export const GU = () => JSON.parse(localStorage.getItem("pa_users") || "[]");
export const SU = (u) => localStorage.setItem("pa_users", JSON.stringify(u));
export const GC = () => JSON.parse(localStorage.getItem("pa_campaigns") || "[]");
export const SC = (c) => localStorage.setItem("pa_campaigns", JSON.stringify(c));
export const GS = () => JSON.parse(localStorage.getItem("pa_submissions") || "[]");
export const SS = (s) => localStorage.setItem("pa_submissions", JSON.stringify(s));
export const GW = () => JSON.parse(localStorage.getItem("pa_withdrawals") || "[]");
export const SW = (w) => localStorage.setItem("pa_withdrawals", JSON.stringify(w));

// ======= LOCAL STORAGE FALLBACK (Demo / Offline mode) =======
export function localFallback(action, payload) {
  const getRaw = (k) => JSON.parse(localStorage.getItem(k) || "[]");
  const setRaw = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  if (action === "getUsers") {
    return { ok: true, users: getRaw("pa_users") };
  }
  if (action === "getCampaigns") {
    return { ok: true, campaigns: getRaw("pa_campaigns") };
  }
  if (action === "getSubmissions") {
    return { ok: true, submissions: getRaw("pa_submissions") };
  }
  if (action === "getWithdrawals") {
    return { ok: true, withdrawals: getRaw("pa_withdrawals") };
  }
  if (action === "register") {
    const users = getRaw("pa_users");
    if (users.find((u) => u.phone === payload.phone))
      return {
        ok: false,
        msg: "❌ Is phone number se already account bana hua hai",
      };
    if (users.find((u) => u.email === payload.email))
      return {
        ok: false,
        msg: "❌ Is email se already account bana hua hai",
      };
    const uid = genUID(users);
    const user = {
      userId: uid,
      ...payload,
      password: payload.password,
      createdAt: payload.createdAt,
    };
    users.push(user);
    setRaw("pa_users", users);
    return { ok: true, userId: uid };
  }
  if (action === "addCampaign") {
    const camps = getRaw("pa_campaigns");
    const camp = { id: payload.id || "c_" + Date.now(), ...payload };
    camps.push(camp);
    setRaw("pa_campaigns", camps);
    return { ok: true };
  }
  if (action === "editCampaign") {
    const camps = getRaw("pa_campaigns");
    const i = camps.findIndex((c) => c.id === payload.id);
    if (i > -1) camps[i] = { ...camps[i], ...payload };
    setRaw("pa_campaigns", camps);
    return { ok: true };
  }
  if (action === "deleteCampaign") {
    setRaw(
      "pa_campaigns",
      getRaw("pa_campaigns").filter((c) => c.id !== payload.id),
    );
    return { ok: true };
  }
  if (action === "addSubmission") {
    const subs = getRaw("pa_submissions");
    subs.push(payload);
    setRaw("pa_submissions", subs);
    return { ok: true };
  }
  if (action === "updateSubmission") {
    const subs = getRaw("pa_submissions");
    const i = subs.findIndex((s) => s.id === payload.id);
    if (i > -1) {
      subs[i].status = payload.status;
      subs[i].adminNote = payload.adminNote || "";
      subs[i].updatedAt = payload.updatedAt || "";
    }
    setRaw("pa_submissions", subs);
    return { ok: true };
  }
  if (action === "addWithdrawal") {
    const wds = getRaw("pa_withdrawals");
    wds.push(payload);
    setRaw("pa_withdrawals", wds);
    return { ok: true };
  }
  if (action === "updateWithdrawal") {
    const wds = getRaw("pa_withdrawals");
    const i = wds.findIndex((w) => w.id === payload.id);
    if (i > -1) {
      wds[i].status = payload.status;
      if (payload.reason) wds[i].rejectionReason = payload.reason;
      wds[i].updatedAt = new Date().toLocaleString("en-IN");
    }
    setRaw("pa_withdrawals", wds);
    return { ok: true };
  }
  return { ok: false, msg: "Unknown action" };
}

// ======= SHEETS API CALL =======
export async function sheetsAPI(action, payload = {}, onLoadingChange = null) {
  if (!USE_SHEETS) return localFallback(action, payload);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    if (onLoadingChange) {
      const msg = action === "register"
        ? "Account bana rahe hain..."
        : action === "addCampaign"
          ? "Campaign save ho rahi hai..."
          : "Loading...";
      onLoadingChange(true, msg);
    }
    const res = await fetch(SHEETS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" }, // text/plain avoids CORS preflight
      body: JSON.stringify({ action, ...payload }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const data = await res.json();
    if (onLoadingChange) onLoadingChange(false, null);
    return data;
  } catch (e) {
    clearTimeout(timeoutId);
    if (onLoadingChange) onLoadingChange(false, null);
    console.warn("Sheets API error, using local fallback:", e);
    return localFallback(action, payload);
  }
}

// ======= SYNC FROM SHEETS ON LOAD =======
export async function syncFromSheets(onLoadingChange = null) {
  if (!USE_SHEETS) return false;
  try {
    const [ur, cr, sr, wr] = await Promise.all([
      sheetsAPI("getUsers", {}, onLoadingChange),
      sheetsAPI("getCampaigns", {}, onLoadingChange),
      sheetsAPI("getSubmissions", {}, onLoadingChange),
      sheetsAPI("getWithdrawals", {}, onLoadingChange),
    ]);
    const usersOk = ur.ok && Array.isArray(ur.users);
    const campsOk = cr.ok && Array.isArray(cr.campaigns);
    const subsOk = sr.ok && Array.isArray(sr.submissions);
    const wdsOk = wr.ok && Array.isArray(wr.withdrawals);
    if (usersOk) SU(ur.users);
    if (campsOk) SC(cr.campaigns);
    if (subsOk) SS(sr.submissions);
    if (wdsOk) SW(wr.withdrawals);
    return usersOk || campsOk;
  } catch (e) {
    console.warn("syncFromSheets error:", e);
    return false;
  }
}

// ======= USER ID GENERATOR =======
export function genUID(existingUsers) {
  const users = existingUsers || GU();
  const ex = users.map((u) => u.userId);
  let id;
  do {
    id = "PA" + String(Math.floor(100000 + Math.random() * 900000));
  } while (ex.includes(id));
  return id;
}

// ======= COMPRESS IMAGE =======
export function compressImage(src, cb) {
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    const M = 400;
    let w = img.width,
      h = img.height;
    if (w > M || h > M) {
      if (w > h) {
        h = h * (M / w);
        w = M;
      } else {
        w = w * (M / h);
        h = M;
      }
    }
    c.width = w;
    c.height = h;
    c.getContext("2d").drawImage(img, 0, 0, w, h);
    cb(c.toDataURL("image/jpeg", 0.6));
  };
  img.src = src;
}
