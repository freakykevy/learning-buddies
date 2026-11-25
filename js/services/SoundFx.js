"use strict";
/** Sound effects, read-aloud, and confetti. */
class SoundFx {
  constructor(settings) { this.settings = settings; this.ctx = null; try { speechSynthesis.getVoices(); } catch (e) {} }
  beep(kind) {
    if (!this.settings.get("snd")) return;
    try {
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      const seq = { ok: [[660, .1], [880, .15]], no: [[300, .2]], win: [[523, .12], [659, .12], [784, .12], [1047, .3]] }[kind];
      let t = this.ctx.currentTime;
      for (const [f, d] of seq) {
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.frequency.value = f; o.type = "triangle";
        g.gain.setValueAtTime(.18, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
        o.connect(g); g.connect(this.ctx.destination); o.start(t); o.stop(t + d); t += d;
      }
    } catch (e) {}
  }
  /** Slug used for the recorded clip of a prompt, e.g. "How many do you see?" -> "how_many_do_you_see". */
  static clipName(text) { return text.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""); }
  /** Plays the recorded human voice for this prompt; falls back to the browser voice if no clip exists. */
  speak(text) {
    try { speechSynthesis.cancel(); } catch (e) {}
    if (this.clip) { this.clip.pause(); this.clip = null; }
    const a = new Audio(`${CONFIG.AUDIO_DIR}${SoundFx.clipName(text)}.mp3`); this.clip = a;
    a.onerror = () => this.speakFallback(text);
    a.play().catch(() => this.speakFallback(text));
  }
  /** Reads lesson narration with the browser voice (respects the sound setting unless forced). */
  say(text, force = true) { if (force || this.settings.get("snd")) this.speakFallback(text); }
  /** Picks the warmest-sounding female English voice the device offers. */
  static pickVoice() {
    let vs = []; try { vs = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang)); } catch (e) {}
    const female = /samantha|karen|moira|tessa|serena|fiona|susan|zira|hazel|aria|jenny|libby|sonia|catherine|female|google uk english female/i;
    return vs.find(v => female.test(v.name) && /en-(US|GB|AU)/i.test(v.lang)) || vs.find(v => female.test(v.name)) || vs.find(v => /en-(US|GB)/i.test(v.lang)) || vs[0] || null;
  }
  /** Speaks like a patient teacher: sentence by sentence, with pauses and a lifted tone on questions. */
  speakFallback(text) {
    try {
      speechSynthesis.cancel();
      const V = CONFIG.VOICE, token = (this.token = (this.token || 0) + 1), voice = SoundFx.pickVoice();
      const parts = String(text).match(/[^.!?]+[.!?]*/g) || [text];
      const next = i => {
        if (token !== this.token || i >= parts.length) return;
        const p = parts[i].trim(); if (!p) return next(i + 1);
        const u = new SpeechSynthesisUtterance(p), q = /\?$/.test(p), cheer = /!$/.test(p);
        if (voice) u.voice = voice;
        u.rate = V.rate; u.pitch = q ? V.questionPitch : cheer ? V.pitch + .08 : V.pitch;
        u.onend = () => setTimeout(() => next(i + 1), q || cheer ? V.pause : V.softPause);
        speechSynthesis.speak(u);
      };
      next(0);
    } catch (e) {}
  }
  confetti() {
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const box = document.querySelector("#cf"), icons = ["⭐", "🎃", "🎈", "🌸", "🎉"];
    box.innerHTML = [...Array(26)].map(() =>
      `<span class="cf" style="left:${Math.random() * 100}%;animation-delay:${Math.random() * 1.2}s">${icons[Math.floor(Math.random() * 5)]}</span>`).join("");
    setTimeout(() => (box.innerHTML = ""), 4500);
  }
}