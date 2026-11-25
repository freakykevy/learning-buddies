"use strict";
/** Teacher dashboard with three tabs (overview, students, assign) and a student detail page. */
class DashboardView extends View {
  constructor(app) { super(app); this.tab = "ov"; this.query = ""; this.selected = null; this.confirmReset = false; }
  get rows() { return this.app.store.rows; }

  render() {
    const tabs = [["ov", "📊 Overview"], ["st", "👩‍🎓 Students"], ["as", "📌 Assign"]];
    this.mount(`<h1>Teacher Dashboard</h1>
      <div class="tabs">${tabs.map(t => `<button class="tab ${this.tab === t[0] ? "on" : ""}" data-t="${t[0]}">${t[1]}</button>`).join("")}</div>
      <div id="tb"></div><p class="mut">${this.app.store.shared ? "Scores are shared across devices." : "Scores shown are from this device."} <button class="btn s o" id="dbt">🔌 Test database</button></p><pre id="dbo" class="mut" style="white-space:pre-wrap;word-break:break-all"></pre>`);
    this.$$(".tab").forEach(b => (b.onclick = () => { this.tab = b.dataset.t; this.selected = null; this.render(); }));
    this.$("#tb").innerHTML = this.selected ? this.detailHtml() : { ov: () => this.overviewHtml(), st: () => this.studentsHtml(), as: () => this.assignHtml() }[this.tab]();
    this.bind();
    const dbt = this.$("#dbt");
    if (dbt) dbt.onclick = async () => { const o = this.$("#dbo"); o.textContent = "Testing…"; o.textContent = (await this.app.store.remote.test()).join("\n"); };
  }

  overviewHtml() {
    const e = Utils.esc, rows = this.rows, quizzes = rows.filter(r => r.type === "quiz"), roster = this.app.store.roster();
    const needs = roster.filter(s => { const w = this.app.student(s.sid).worstScore; return w != null && w < .6; });
    const avg = Utils.avg(quizzes);
    return `<div class="grid">
        <div class="card ctr"><b style="font-size:32px">${roster.length}</b><div class="mut">Students</div></div>
        <div class="card ctr"><b style="font-size:32px">${rows.filter(r => r.type === "watch").length}</b><div class="mut">Lessons watched</div></div>
        <div class="card ctr"><b style="font-size:32px">${avg == null ? "–" : avg + "%"}</b><div class="mut">Average score</div></div>
        <div class="card ctr"><b style="font-size:32px">${rows.filter(r => r.type === "practice").length}</b><div class="mut">Practice rounds</div></div></div>
      <h2>By lesson</h2><div class="card xs"><table><tr><th>Lesson</th><th>Watched</th><th>Quizzes</th><th>Avg</th></tr>
      ${this.app.lessons.map(l => { const z = quizzes.filter(r => r.lesson === l.id), a = Utils.avg(z);
        return `<tr><td>${l.icon} ${l.title}</td><td>${rows.filter(r => r.type === "watch" && r.lesson === l.id).length}</td><td>${z.length}</td><td>${a == null ? "–" : a + "%"}</td></tr>`; }).join("")}</table></div>
      <h2>⚠ Needs help</h2><div class="card">${needs.length ? needs.map(s => `<div class="sw"><span>${e(s.avatar)} ${e(s.name)}</span><button class="btn s o" data-sid="${e(s.sid)}">View</button></div>`).join("") : '<span class="mut">No one is below 60% — great!</span>'}</div>`;
  }

  studentsHtml() {
    const e = Utils.esc, list = this.app.store.roster().filter(s => s.name.toLowerCase().includes(this.query.toLowerCase()));
    return `<div class="row" style="justify-content:space-between"><input type="search" id="sq" placeholder="Search students" value="${e(this.query)}" aria-label="Search students"><button class="btn s o" id="csv">📋 Copy CSV</button></div>
      <div class="card xs">${list.length ? `<table><tr><th>Student</th><th>Done</th><th>⭐</th><th>Best</th><th>Latest</th><th></th></tr>${list.map(s => {
        const x = this.app.student(s.sid), l = x.latestQuiz;
        return `<tr class="cl" data-sid="${e(s.sid)}"><td>${e(s.avatar)} ${e(s.name)}</td><td>${x.done.size}/${this.app.lessons.length}</td><td>${x.stars}</td><td>${x.bestScore == null ? "–" : Math.round(x.bestScore * 100) + "%"}</td><td>${l ? l.score + "/" + l.total : "–"}</td><td>${x.worstScore != null && x.worstScore < .6 ? "⚠" : ""}</td></tr>`;
      }).join("")}</table>` : '<p class="mut">No students yet. Log in as a student, watch a lesson, and take the quiz.</p>'}</div><div id="csvo"></div>
      <div class="row">${this.confirmReset ? '<button class="btn s" style="background:var(--cor)" id="rs">Tap again to erase this device’s data</button>' : '<button class="btn s o" id="rs">🗑 Reset this device’s data</button>'}</div>`;
  }

  detailHtml() {
    const e = Utils.esc, s = this.app.store.roster().find(x => x.sid === this.selected) || { name: this.selected, avatar: "🙂" }, x = this.app.student(this.selected);
    const title = id => (this.app.lesson(id) ? this.app.lesson(id).title : "Practice");
    return `<button class="btn s o" id="bk2">← All students</button><h2>${e(s.avatar)} ${e(s.name)}</h2>
      <div class="chips"><span class="chip">✅ ${x.done.size}/${this.app.lessons.length} lessons</span><span class="chip">⭐ ${x.stars}</span><span class="chip">🔥 ${x.streak}</span><span class="chip">🏅 ${x.earned.length}</span></div>
      <div class="card xs"><table><tr><th>When</th><th>Lesson</th><th>Type</th><th>Result</th></tr>${x.records.filter(r => r.type !== "assign").slice().reverse().map(r =>
        `<tr><td>${new Date(r.ts).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td><td>${title(r.lesson)}</td><td>${r.type}</td><td>${r.type === "watch" ? "👀" : r.score + "/" + r.total}</td></tr>`).join("")}</table></div>`;
  }

  assignHtml() {
    const as = this.app.store.assignments();
    return `<p class="mut">Pick lessons for your class. Students see them first, tagged “From your teacher”.</p>` + this.app.lessons.map(l =>
      `<div class="card les" style="cursor:default"><div class="i">${l.icon}</div><div style="flex:1"><b>${l.title}</b><div class="mut">${l.week} · ${l.dates}</div></div><button class="btn s ${as[l.id] ? "g" : "o"}" data-as="${l.id}">${as[l.id] ? "✔ Assigned" : "Assign"}</button></div>`).join("");
  }

  bind() {
    const app = this.app;
    this.$$("[data-sid]").forEach(b => (b.onclick = () => { this.selected = b.dataset.sid; this.tab = "st"; this.render(); }));
    const back = this.$("#bk2"); if (back) back.onclick = () => { this.selected = null; this.render(); };
    const search = this.$("#sq");
    if (search) search.oninput = () => { this.query = search.value; const p = search.selectionStart; this.render(); const n = this.$("#sq"); n.focus(); n.setSelectionRange(p, p); };
    const csv = this.$("#csv");
    if (csv) csv.onclick = () => {
      const text = app.store.toCsv(), fallback = () => { this.$("#csvo").innerHTML = `<p class="mut">Copy this text:</p><textarea readonly style="width:100%;height:120px">${Utils.esc(text)}</textarea>`; };
      try { navigator.clipboard.writeText(text).then(() => (csv.textContent = "✔ Copied!"), fallback); } catch (err) { fallback(); }
    };
    const reset = this.$("#rs");
    if (reset) reset.onclick = () => { if (!this.confirmReset) { this.confirmReset = true; this.render(); return; } this.confirmReset = false; app.store.clearLocal(); this.render(); };
    this.$$("[data-as]").forEach(b => (b.onclick = async () => {
      const on = !app.store.assignments()[b.dataset.as];
      await app.store.add({ student: "teacher", av: "🧑‍🏫", lesson: b.dataset.as, type: "assign", on }, app.user); this.render();
    }));
  }
}