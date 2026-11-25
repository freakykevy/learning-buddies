"use strict";
/** Student login: avatar + name, "continue as last student", teacher link. */
class LoginView extends View {
  render() {
    const e = Utils.esc; let avatar = CONFIG.AVATARS[0], last = null;
    try { last = JSON.parse(localStorage.getItem(CONFIG.LAST_KEY)); } catch (err) {}
    this.mount(`<div class="hero">${View.BUDDY}<div><h1>Hi friend!</h1><p>Who is learning today?</p></div></div>
      ${last ? `<div class="row"><button class="btn g" id="cont">Continue as ${e(last.av)} ${e(last.name)}</button></div><p class="mut ctr">or sign in as someone else</p>` : ""}
      <div class="row" id="avs">${CONFIG.AVATARS.map(a => `<button class="av ${a === avatar ? "on" : ""}" data-a="${a}" aria-label="Avatar ${a}">${a}</button>`).join("")}</div>
      <div class="row"><input type="text" id="nm" placeholder="Type your name" maxlength="20" autocomplete="off" aria-label="Your name"></div>
      <div class="err" id="er"></div>
      <div class="row"><button class="btn" id="go">Let's learn! 🚀</button></div>
      <p class="mut ctr">Teacher? <a href="#" id="t" style="color:var(--blue)">Open dashboard</a></p>`);
    if (last) this.$("#cont").onclick = () => this.app.enterStudent(last.name, last.av);
    this.$("#avs").onclick = ev => {
      const b = ev.target.closest("button"); if (!b) return;
      avatar = b.dataset.a; this.$$(".av").forEach(x => x.classList.toggle("on", x === b));
    };
    const submit = () => {
      const name = this.$("#nm").value.trim().replace(/\s+/g, " ");
      if (name.length < 2) { this.$("#er").textContent = "Please type your name (at least 2 letters)."; this.$("#nm").focus(); return; }
      this.app.enterStudent(name, avatar);
    };
    this.$("#go").onclick = submit;
    this.$("#nm").onkeydown = ev => { if (ev.key === "Enter") submit(); };
    this.$("#t").onclick = ev => { ev.preventDefault(); this.app.showPin(); };
  }
}
