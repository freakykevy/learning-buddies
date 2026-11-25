"use strict";
/** On-screen keypad for the teacher PIN (no pop-up prompt, works on phones). */
class PinView extends View {
  render() {
    let pin = "";
    this.mount(`<h1 class="ctr">Teacher login</h1><div class="dots" id="dt"></div><div class="err" id="er"></div>
      <div class="pin">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫", 0, "✔"].map(k => `<button class="opt" data-k="${k}">${k}</button>`).join("")}</div>
      <div class="row"><button class="btn o" id="bk">Back</button></div><p class="mut ctr">Demo PIN: ${CONFIG.TEACHER_PIN}</p>`);
    const dots = () => { this.$("#dt").textContent = "●".repeat(pin.length) || " "; };
    const check = () => {
      if (pin === CONFIG.TEACHER_PIN) this.app.enterTeacher();
      else { pin = ""; dots(); this.$("#er").textContent = "Wrong PIN, try again."; }
    };
    dots();
    this.$$(".pin .opt").forEach(b => (b.onclick = () => {
      const k = b.dataset.k; this.$("#er").textContent = "";
      if (k === "⌫") pin = pin.slice(0, -1);
      else if (k === "✔") check();
      else if (pin.length < 4) { pin += k; if (pin.length === 4) { dots(); check(); return; } }
      dots();
    }));
    this.$("#bk").onclick = () => this.app.showLogin();
  }
}
