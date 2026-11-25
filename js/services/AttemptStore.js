"use strict";
/**
 * Stores every watch / quiz / practice / assign record.
 * Always saved on this device (localStorage). When CONFIG.SUPABASE_* is set, records are also
 * saved to the free Supabase database so the teacher dashboard sees every device.
 * (Inside a Claude artifact the built-in "db" capability is used instead, if present.)
 */
class AttemptStore {
  constructor(remote = null) {
    this.rows = []; this.db = null; this.subscribed = false; this.onRemote = null;
    this.remote = remote; this.remoteOk = false; this.lastSync = 0;
  }
  /** True when scores are shared between devices. */
  get shared() { return !!this.db || this.remoteOk; }

  async connect() {
    try { if (typeof claude !== "undefined") this.db = await claude.use("db"); } catch (e) { this.db = null; }
  }
  static makeId(r, salt = "") { return `${r.sid}-${r.ts}-${r.type}-${r.lesson}${salt}`; }
  #readLocal() { try { return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || "[]"); } catch (e) { return []; } }
  #writeLocal(r) { try { const a = this.#readLocal(); a.push(r); localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(a)); } catch (e) {} }

  /** Load records, call `render`, and re-call it when shared data arrives. */
  load(render) {
    this.rows = this.#readLocal(); render(); this.onRemote = render;
    if (this.db && !this.subscribed) {
      try {
        this.db.collection("attempts").onSnapshot(snap => {
          const d = snap.docs.map(x => x.data());
          if (d.length) { this.rows = d; if (this.onRemote) this.onRemote(); }
        }, () => {});
        this.subscribed = true;
      } catch (e) {}
    }
    this.#sync();
  }
  /** Pull shared records from Supabase and upload any this device has not sent yet. */
  async #sync() {
    if (!this.remote || !this.remote.enabled || Date.now() - this.lastSync < 4000) return;
    this.lastSync = Date.now();
    try {
      const remote = await this.remote.fetchAll(), have = new Set(remote.map(r => r.id));
      const local = this.#readLocal().map(r => (r.id ? r : { ...r, id: AttemptStore.makeId(r) }));
      const missing = local.filter(r => !have.has(r.id));
      if (missing.length) await this.remote.insert(missing);
      const seen = new Set();
      this.rows = [...remote, ...missing].filter(r => !seen.has(r.id) && seen.add(r.id)).sort((a, b) => a.ts - b.ts);
      this.remoteOk = true;
      if (this.onRemote) this.onRemote();
    } catch (e) { this.remoteOk = false; console.warn("[Learning Buddies] database sync failed:", e.message); }   // keep working locally
  }
  async add(record, user) {
    record.ts = Date.now(); record.sid = user.sid;
    record.id = AttemptStore.makeId(record, "-" + Math.random().toString(36).slice(2, 6));
    this.rows.push(record); this.#writeLocal(record);
    if (this.db) { try { await this.db.collection("attempts").doc("a" + record.ts + Math.random().toString(36).slice(2, 6)).set(record); } catch (e) {} }
    if (this.remote && this.remote.enabled) { try { await this.remote.insert(record); } catch (e) { console.warn("[Learning Buddies] could not save to database:", e.message); } }
  }
  clearLocal() { try { localStorage.removeItem(CONFIG.STORAGE_KEY); } catch (e) {} this.rows = []; this.lastSync = 0; }

  /** Latest assignment state per lesson id: { lessonId: true|false }. */
  assignments() {
    const m = {};
    this.rows.filter(r => r.type === "assign").sort((a, b) => a.ts - b.ts).forEach(r => (m[r.lesson] = r.on));
    return m;
  }
  /** Everyone who has any activity. */
  roster() {
    const m = {};
    this.rows.filter(r => r.type !== "assign").forEach(r => {
      const k = r.sid || String(r.student || "").toLowerCase();
      if (!m[k]) m[k] = { sid: k, name: r.student, avatar: r.av };
    });
    return Object.values(m).sort((a, b) => a.name.localeCompare(b.name));
  }
  toCsv() {
    const q = v => '"' + String(v).replace(/"/g, '""') + '"';
    return ["student,lesson,type,score,total,time"].concat(this.rows.filter(r => r.type !== "assign")
      .map(r => [r.student, r.lesson, r.type, r.score ?? "", r.total ?? "", new Date(r.ts).toISOString()].map(q).join(","))).join("\n");
  }
}