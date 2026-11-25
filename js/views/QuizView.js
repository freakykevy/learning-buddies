"use strict";
/** Runs one quiz (lesson quiz or mixed practice) and shows the result. */
class QuizView extends View {
  constructor(app, questions, lessonId, type, title) {
    super(app); Object.assign(this, { questions, lessonId, type, title });
    this.index = 0; this.score = 0; this.badgesBefore = app.student(app.user.sid).earned;
  }
  render() {
    const q = this.questions[this.index], e = Utils.esc, { app } = this, n = this.questions.length;
    this.mount(`<div class="chips"><span class="chip">${e(this.title)}</span><span class="chip">Question ${this.index + 1} of ${n}</span></div>
      <div class="bar"><i style="width:${this.index / n * 100}%"></i></div>
      <div class="card ctr" style="margin-top:14px"><p style="font-size:20px">${e(q.prompt)} <button class="btn o s" id="sp" aria-label="Read aloud">🔊</button></p><div class="pic">${e(q.picture)}</div></div>
      <div class="opts">${q.options.map(o => `<button class="opt" data-n="${e(o)}">${e(o)}</button>`).join("")}</div><div class="fb" id="fb"></div>`);
    const say = () => app.sound.speak(q.prompt.replace(/[“”]/g, ""));
    this.$("#sp").onclick = say; if (app.settings.get("auto")) say();
    this.$$(".opt").forEach(b => (b.onclick = () => this.answer(q, b)));
  }
  answer(q, button) {
    const ok = q.isCorrect(button.dataset.n);
    this.$$(".opt").forEach(x => (x.disabled = true)); button.classList.add(ok ? "ok" : "no");
    if (!ok) this.$(`[data-n="${q.answer}"]`).classList.add("ok");
    if (ok) this.score++; this.app.sound.beep(ok ? "ok" : "no");
    this.$("#fb").textContent = ok ? ["Great job! 🎉", "Super! ⭐", "You got it! 👏"][this.index % 3] : `Good try! The answer is ${q.answer}.`;
    setTimeout(() => (++this.index < this.questions.length ? this.render() : this.finish()), 1400);
  }
  async finish() {
    const { app } = this, e = Utils.esc, n = this.questions.length, s = this.score, stars = Math.round(s / n * 5);
    await app.store.add({ student: app.user.name, av: app.user.av, lesson: this.lessonId, type: this.type, score: s, total: n }, app.user);
    const fresh = app.student(app.user.sid).earned.filter(b => !this.badgesBefore.includes(b)).map(id => app.badges.find(b => b.id === id));
    app.sound.beep("win"); if (s >= n / 2) app.sound.confetti();
    const isLesson = !!app.lesson(this.lessonId);
    this.mount(`<h1 class="ctr">All done, ${e(app.user.name)}!</h1>
      <div class="card ctr"><div style="font-size:50px">${"⭐".repeat(stars)}${"☆".repeat(5 - stars)}</div><p style="font-size:24px">You got <b>${s} out of ${n}</b>!</p>
      <p>${s === n ? "Perfect! You're a super learner!" : s >= n / 2 ? "Nice work! Watch again to get even better." : "Keep practicing — watch the video again!"}</p></div>
      ${fresh.length ? `<h2 class="ctr">New badge${fresh.length > 1 ? "s" : ""}! 🎉</h2><div class="badges">${fresh.map(b => `<div class="card bd"><div class="i">${b.icon}</div><b>${b.title}</b><small>${b.hint}</small></div>`).join("")}</div>` : ""}
      <div class="row">${isLesson ? '<button class="btn o" id="re">↻ Watch again</button>' : '<button class="btn y" id="pa">🎯 Practice more</button>'}<button class="btn g" id="mn">Back to lessons</button></div>`);
    if (isLesson) this.$("#re").onclick = () => app.watch(app.lesson(this.lessonId)); else this.$("#pa").onclick = () => app.practice();
    this.$("#mn").onclick = () => app.goHome();
  }
}
