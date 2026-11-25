"use strict";
/** Interactive lesson player: big pictures + narration, one slide at a time. Ends with the quiz. */
class SlideView extends View {
  constructor(app, lesson) { super(app); this.lesson = lesson; this.i = 0; }
  render() {
    const l = this.lesson, s = l.slides[this.i], n = l.slides.length, last = this.i === n - 1, e = Utils.esc;
    const items = s.items ? `<div class="its">${s.items.map((it, k) => `<span class="it ${it.gone ? "gone" : ""}" style="animation-delay:${k * .12}s">${e(it.e)}</span>`).join("")}</div>` : "";
    const groups = s.groups ? `<div class="grps">${s.groups.map((g, k) => `<div class="grp" style="animation-delay:${k * .25}s">${e(g)}</div>`).join("")}</div>` : "";
    this.mount(`<h1>${l.icon} ${e(l.title)}</h1>
      <div class="bar"><i style="width:${(this.i + 1) / n * 100}%"></i></div>
      <div class="card ctr slide" style="margin-top:14px">
        <h2 style="margin-top:0">${e(s.head)}</h2>
        ${s.pic ? `<div class="spic">${e(s.pic)}</div>` : ""}${items}${groups}
        ${s.eq ? `<div class="eqn">${e(s.eq)}</div>` : ""}
        <p class="say">${e(s.say)}</p>
      </div>
      <div class="row"><button class="btn o" id="bk">← Back</button><button class="btn y" id="hr">🔊 Hear it</button><button class="btn g" id="nx">${last ? "Start the quiz ▶" : "Next →"}</button></div>
      <p class="mut ctr">Slide ${this.i + 1} of ${n} · <a href="#" id="sk" style="color:var(--blue)">Skip to quiz</a></p>`);
    const say = () => this.app.sound.say(s.say);
    this.$("#hr").onclick = say; this.app.sound.say(s.say, false);
    this.$("#bk").onclick = () => { this.stop(); if (this.i === 0) this.app.goHome(); else { this.i--; this.render(); } };
    this.$("#nx").onclick = () => { if (last) this.finish(true); else { this.i++; this.render(); } };
    this.$("#sk").onclick = ev => { ev.preventDefault(); this.finish(false); };
  }
  stop() { try { speechSynthesis.cancel(); } catch (e) {} }
  finish(watched) {
    const app = this.app, l = this.lesson; this.stop();
    if (watched) app.store.add({ student: app.user.name, av: app.user.av, lesson: l.id, type: "watch" }, app.user);
    app.quiz(l.quizQuestions(), l.id, "quiz", l.title);
  }
}