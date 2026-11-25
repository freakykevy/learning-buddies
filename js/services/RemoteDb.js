"use strict";
/**
 * Optional free cloud database (Supabase REST API, no libraries).
 * Active only when CONFIG.SUPABASE_URL and CONFIG.SUPABASE_ANON_KEY are filled in.
 * Table + security rules: supabase/schema.sql   Setup guide: docs/DATABASE.md
 */
class RemoteDb {
  get enabled() { return !!(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY); }
  /** Accepts "https://xxx.supabase.co" even if "/" or "/rest/v1" was pasted on the end. */
  #endpoint() { return `${CONFIG.SUPABASE_URL.trim().replace(/\/rest\/v1.*$/i, "").replace(/\/+$/, "")}/rest/v1/attempts`; }
  /** New "sb_publishable_…" keys go in `apikey` only; legacy anon keys (JWT, start with "eyJ") also go in Authorization. */
  #headers(extra = {}) {
    const k = CONFIG.SUPABASE_ANON_KEY, h = { apikey: k, ...extra };
    if (/^eyJ/.test(k)) h.Authorization = `Bearer ${k}`;
    return h;
  }

  async fetchAll() {
    const res = await fetch(`${this.#endpoint()}?select=*&order=ts.asc&limit=10000`, { headers: this.#headers() });
    if (!res.ok) throw new Error("fetch failed " + res.status + " " + await res.text());
    return (await res.json()).map(RemoteDb.fromRow);
  }
  /** Insert one or many records; records that already exist (same id) are ignored. */
  async insert(records) {
    const list = (Array.isArray(records) ? records : [records]).map(RemoteDb.toRow);
    if (!list.length) return;
    const res = await fetch(this.#endpoint(), {
      method: "POST",
      headers: this.#headers({ "Content-Type": "application/json", Prefer: "resolution=ignore-duplicates,return=minimal" }),
      body: JSON.stringify(list),
    });
    if (!res.ok) throw new Error("insert failed " + res.status + " " + await res.text());
  }
  /** Connection check for the teacher dashboard: returns lines of plain text. */
  async test() {
    const out = [], k = CONFIG.SUPABASE_ANON_KEY || "";
    out.push("URL in config.js: " + JSON.stringify(CONFIG.SUPABASE_URL));
    out.push("Key starts with: " + JSON.stringify(k.slice(0, 14)) + " (length " + k.length + ")");
    if (!this.enabled) { out.push("❌ URL or key is empty in js/config.js"); return out; }
    out.push("Address used: " + this.#endpoint());
    try {
      const r = await fetch(`${this.#endpoint()}?select=id&limit=1`, { headers: this.#headers() });
      out.push((r.ok ? "✅ Read OK " : "❌ Read failed ") + r.status + (r.ok ? "" : " " + (await r.text())));
    } catch (e) { out.push("❌ Read: could not reach the address (" + e.message + ") – check the URL for typos"); return out; }
    try {
      const rec = { id: "connection-test", ts: Date.now(), sid: "teacher", student: "teacher", av: null, lesson: "_test", type: "assign", on: false };
      await this.insert(rec); out.push("✅ Save OK");
    } catch (e) { out.push("❌ Save failed: " + e.message); }
    return out;
  }
  static toRow(r) {
    return { id: r.id, ts: r.ts, sid: r.sid, student: r.student, av: r.av || null, lesson: r.lesson, type: r.type,
      score: r.score ?? null, total: r.total ?? null, assigned: r.type === "assign" ? !!r.on : null };
  }
  static fromRow(x) {
    const r = { id: x.id, ts: Number(x.ts), sid: x.sid, student: x.student, av: x.av, lesson: x.lesson, type: x.type };
    if (x.score != null) r.score = x.score;
    if (x.total != null) r.total = x.total;
    if (x.type === "assign") r.on = !!x.assigned;
    return r;
  }
}