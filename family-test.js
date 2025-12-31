/* اختبار ربط بسيط مع Google Apps Script Web App
   لا يعتمد على أي ملفات أخرى */
(function () {
  const $ = (id) => document.getElementById(id);
  const out = $("out");

  function log(msg, obj) {
    const t = new Date().toISOString();
    out.textContent = `[${t}] ${msg}` + (obj ? `\n${JSON.stringify(obj, null, 2)}` : "");
  }

  async function postJson(url, body) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch (e) { json = { raw: text }; }
    return { status: res.status, json, raw: text };
  }

  async function loginAdmin() {
    const url = $("apiUrl").value.trim();
    const pin = $("adminPin").value.trim();
    if (!url) return log("ضع رابط exec");
    if (!pin) return log("ضع رمز المدير");

    log("إرسال طلب دخول المدير...");
    try {
      const r = await postJson(url, { action: "دخول مدير", payload: { "رمز الدخول": pin } });
      log("تم استلام رد", r);
    } catch (err) {
      log("تعذر الاتصال (غالبا CORS)", { message: String(err && err.message ? err.message : err) });
    }
  }

  async function loginMember() {
    const url = $("apiUrl").value.trim();
    const pin = $("memberPin").value.trim();
    if (!url) return log("ضع رابط exec");
    if (!pin) return log("ضع رمز المشترك");

    log("إرسال طلب دخول المشترك...");
    try {
      const r = await postJson(url, { action: "دخول مشترك", payload: { "رمز الدخول": pin } });
      log("تم استلام رد", r);
    } catch (err) {
      log("تعذر الاتصال (غالبا CORS)", { message: String(err && err.message ? err.message : err) });
    }
  }

  $("btnAdmin").addEventListener("click", (e) => { e.preventDefault(); loginAdmin(); });
  $("btnMember").addEventListener("click", (e) => { e.preventDefault(); loginMember(); });
})();
