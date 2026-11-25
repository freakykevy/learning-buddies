"use strict";
/** Base class for every screen. Subclasses implement render(). */
class View {
  constructor(app) { this.app = app; }
  mount(html) { this.app.root.innerHTML = html; window.scrollTo(0, 0); }
  $(sel) { return this.app.root.querySelector(sel); }
  $$(sel) { return this.app.root.querySelectorAll(sel); }
  render() { throw new Error("render() not implemented"); }
  /** Shared mascot graphic. */
  static get BUDDY() {
    return `<svg class="buddy" viewBox="0 0 100 100" aria-hidden="true"><line x1="50" y1="14" x2="50" y2="4" stroke="#fff" stroke-width="3"/><circle cx="50" cy="5" r="5" fill="#FFC93C"/><circle cx="50" cy="55" r="42" fill="#4FA7DE" stroke="#fff" stroke-width="3"/><circle cx="36" cy="48" r="8" fill="#fff"/><circle cx="64" cy="48" r="8" fill="#fff"/><circle cx="37" cy="49" r="4" fill="#22314A"/><circle cx="65" cy="49" r="4" fill="#22314A"/><circle cx="27" cy="64" r="6" fill="#FF9AA2"/><circle cx="73" cy="64" r="6" fill="#FF9AA2"/><path d="M38 68q12 12 24 0" stroke="#22314A" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;
  }
}
