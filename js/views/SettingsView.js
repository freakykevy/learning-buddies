"use strict";
class SettingsView extends View {
  render() {
    const s = this.app.settings;
    const row = (k, t) => `<div class="sw"><span>${t}</span><button class="btn s ${s.get(k) ? "g" : "o"}" data-k="${k}">${s.get(k) ? "On" : "Off"}</button></div>`;
    this.mount(`<h1>Settings ⚙️</h1><div class="card">${row("snd", "🔊 Sound effects")}${row("big", "🔎 Bigger text")}${row("auto", "🗣️ Read questions aloud automatically")}</div>
      <div class="row"><button class="btn" id="bk">Done</button></div>`);
    this.$$("[data-k]").forEach(b => (b.onclick = () => { s.toggle(b.dataset.k); this.render(); }));
    this.$("#bk").onclick = () => this.app.goHome();
  }
}
