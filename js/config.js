"use strict";
/** App-wide constants. */
const CONFIG = Object.freeze({
  TEACHER_PIN: "9876",              // demo PIN – change before real use
  STORAGE_KEY: "lb_attempts",
  LAST_KEY: "lb_last",
  SETTINGS_KEY: "lb_set",
  AVATARS: ["🐻", "🐰", "🦊", "🐼", "🐸", "🦁"],
  VIDEO_DIR: "assets/videos/",
  AUDIO_DIR: "assets/audio/",       // pre-recorded human-sounding quiz prompts
  // Free shared database (Supabase). Leave both empty to keep everything on this device only.
  // The anon/publishable key is safe to publish; NEVER put a service_role key here. See docs/DATABASE.md
  // Teacher voice for read-aloud (browser voice): warm, moderate pace, slightly lower pitch.
  VOICE: { rate: 0.82, pitch: 0.95, questionPitch: 1.12, pause: 450, softPause: 220 },
  SUPABASE_URL: "https://jyiypjqflzvaigridcqh.supabase.co",                 // e.g. "https://abcdxyz.supabase.co"
  SUPABASE_ANON_KEY: "sb_publishable_5cd1nwSY-AggxSLwm5Uzsw_4SLe4kzd",
});

/** Small static helpers shared by every layer. */
class Utils {
  static esc(s) {
    return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }
  static shuffle(a) { return [...a].sort(() => Math.random() - .5); }
  /** Up to 4 numbers near n, clamped to [lo, hi]. */
  static nearby(n, lo, hi) {
    return [...new Set([n, Math.max(lo, n - 1), Math.min(hi, n + 1), Math.min(hi, n + 2), Math.max(lo, n - 2)])].slice(0, 4).sort((a, b) => a - b);
  }
  /** Shuffle options, guaranteeing the answer is among them. */
  static ensure(options, answer) {
    return Utils.shuffle(options.includes(answer) ? options : [answer, ...options.slice(1)]);
  }
  static sid(name) { return name.trim().replace(/\s+/g, " ").toLowerCase(); }
  static day(ts) {
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  static avg(list) {
    return list.length ? Math.round(list.reduce((x, r) => x + r.score / r.total, 0) / list.length * 100) : null;
  }
}
