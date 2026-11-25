"use strict";
/** Student home: progress, next-up lesson, all lessons, badges, certificate. */
class HomeView extends View {
  render() {
    const { app } = this, e = Utils.esc, user = app.user, lessons = app.lessons;
    const st = app.student(user.sid), assigned = app.store.assignments(), today = Utils.day(Date.now());
    const next = lessons.find(l => assigned[l.id] && !st.done.has(l.id)) || lessons.find(l => !st.done.has(l.id));
    const pct = Math.round(st.done.size / lessons.length * 100); let lastWeek = "";
    this.mount(`<div class="hero">${View.BUDDY}<div style="flex:1"><h1>Hi ${e(user.name)}!</h1><p>${st.done.size === lessons.length ? "You finished every lesson! 🎉" : "Ready to learn something new?"}</p></div></div>
      <div class="chips"><span class="chip">⭐ ${st.stars} stars</span><span class="chip">🏅 ${st.earned.length} badges</span><span class="chip">🔥 ${st.streak} day${st.streak === 1 ? "" : "s"}</span></div>
      <div class="card"><b>My progress</b> <span class="mut">${st.done.size} of ${lessons.length} lessons</span><div class="bar" style="margin-top:8px"><i style="width:${pct}%"></i></div></div>
      ${next ? `<h2>Next up</h2><div class="card les" id="nx"><div class="i">${next.icon}</div><div style="flex:1"><b style="font-size:20px">${next.title}</b>${assigned[next.id] ? '<span class="tag t2">From your teacher</span>' : ""}<div class="mut">${next.week} · ${next.subject}</div></div><span class="btn g s">▶ Start</span></div>` : ""}
      <div class="row"><button class="btn y" id="pr">🎯 Practice time</button></div>
      <h2>All lessons</h2>
      ${lessons.map(l => {
        const head = l.week !== lastWeek ? `<div class="wk">${l.week} · ${l.dates}</div>` : ""; lastWeek = l.week; const b = st.best[l.id];
        return head + `<div class="card les" data-id="${l.id}" ${l.isCurrent(today) ? 'style="border-color:var(--yel)"' : ""}><div class="i">${l.icon}</div><div style="flex:1"><b>${l.title}</b>${l.isCurrent(today) ? '<span class="tag t1">This week</span>' : ""}${assigned[l.id] ? '<span class="tag t2">Assigned</span>' : ""}<div class="mut">${l.subject}${b != null ? " · best " + Math.round(b * 100) + "%" : ""}</div></div><div>${b != null ? "⭐".repeat(Math.round(b * 5) || 1) : "▶"}</div></div>`;
      }).join("")}
      <h2>My badges</h2><div class="badges">${app.badges.map(b => `<div class="card bd ${st.earned.includes(b.id) ? "" : "off"}"><div class="i">${b.icon}</div><b>${b.title}</b><small>${b.hint}</small></div>`).join("")}</div>
      ${st.done.size === lessons.length ? `<h2>My certificate</h2><div class="cert"><div style="font-size:48px">🏆</div><h2>Certificate of Completion</h2><p>This certifies that</p><h1 style="color:var(--cor)">${e(user.name)}</h1><p>finished all ${lessons.length} Learning Buddies lessons!</p><p>⭐ ${st.stars} stars · 🏅 ${st.earned.length} badges</p><p class="mut">Take a screenshot to keep or print it.</p></div>` : ""}`);
    this.$$(".les[data-id]").forEach(c => (c.onclick = () => app.watch(app.lesson(c.dataset.id))));
    if (next) this.$("#nx").onclick = () => app.watch(next);
    this.$("#pr").onclick = () => app.practice();
  }
}
