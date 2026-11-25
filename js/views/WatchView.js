"use strict";
/** Video player screen; when the video ends the quiz starts. */
class WatchView extends View {
  constructor(app, lesson) { super(app); this.lesson = lesson; }
  render() {
    const l = this.lesson, app = this.app; let slow = false;
    this.mount(`<h1>${l.icon} ${Utils.esc(l.title)}</h1><div id="vb"></div>
      <div class="row"><button class="btn o" id="bk">← Back</button><button class="btn o" id="sl">🐢 Slow</button><button class="btn g" id="nx">Skip to quiz</button></div>
      <p class="mut ctr">Watch the whole video, then take the quiz!</p>`);
    const v = document.createElement("video");
    v.src = l.videoUrl; v.controls = true; v.playsInline = true; v.preload = "metadata"; this.$("#vb").append(v);
    v.addEventListener("ended", () => { app.store.add({ student: app.user.name, av: app.user.av, lesson: l.id, type: "watch" }, app.user); app.quiz(l.quizQuestions(), l.id, "quiz", l.title); });
    this.$("#sl").onclick = () => { slow = !slow; v.playbackRate = slow ? .75 : 1; this.$("#sl").textContent = slow ? "🐇 Normal" : "🐢 Slow"; };
    this.$("#bk").onclick = () => { v.pause(); app.goHome(); };
    this.$("#nx").onclick = () => { v.pause(); app.quiz(l.quizQuestions(), l.id, "quiz", l.title); };
  }
}
