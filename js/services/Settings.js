"use strict";
/** User preferences (sound, big text, auto read-aloud), saved on this device. */
class Settings {
  constructor() {
    this.values = { snd: true, big: false, auto: false };
    try { Object.assign(this.values, JSON.parse(localStorage.getItem(CONFIG.SETTINGS_KEY) || "{}")); } catch (e) {}
  }
  get(k) { return this.values[k]; }
  toggle(k) { this.values[k] = !this.values[k]; this.apply(); }
  apply() {
    document.documentElement.classList.toggle("big", this.values.big);
    try { localStorage.setItem(CONFIG.SETTINGS_KEY, JSON.stringify(this.values)); } catch (e) {}
  }
}
