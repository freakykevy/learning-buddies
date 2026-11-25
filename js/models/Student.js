"use strict";
/** Progress summary for one student, computed from their attempt records. */
class Student {
  constructor(sid, records, badges) {
    this.sid = sid;
    this.records = records.filter(r => (r.sid || String(r.student || "").toLowerCase()) === sid);
    this.best = {}; this.perfect = 0; this.practiceRounds = 0;
    for (const r of this.records) {
      if (r.type === "quiz") {
        this.best[r.lesson] = Math.max(this.best[r.lesson] || 0, r.score / r.total);
        if (r.score === r.total) this.perfect++;
      } else if (r.type === "practice") this.practiceRounds++;
    }
    this.done = new Set(Object.keys(this.best));
    this.watched = new Set(this.records.filter(r => r.type === "watch").map(r => r.lesson));
    this.stars = Object.values(this.best).reduce((a, p) => a + Math.round(p * 5), 0);
    this.streak = this.#streak();
    this.earned = badges.filter(b => b.test(this)).map(b => b.id);
  }
  #streak() {
    const days = new Set(this.records.filter(r => r.type !== "assign").map(r => Utils.day(r.ts)));
    const d = new Date(); let n = 0;
    if (!days.has(Utils.day(d))) d.setDate(d.getDate() - 1);
    while (days.has(Utils.day(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  get worstScore() { const v = Object.values(this.best); return v.length ? Math.min(...v) : null; }
  get bestScore() { const v = Object.values(this.best); return v.length ? Math.max(...v) : null; }
  get latestQuiz() { return this.records.filter(r => r.type === "quiz").pop() || null; }
}
