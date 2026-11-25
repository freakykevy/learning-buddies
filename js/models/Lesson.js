"use strict";
/** A lesson plus its quiz. Either a narrated video, or an interactive slide lesson (`slides`). */
class Lesson {
  constructor({ id, week, dates, start, end, subject, title, icon, questions, randomCount = false, slides = null }) {
    Object.assign(this, { id, week, dates, start, end, subject, title, icon, questions, randomCount, slides });
  }
  /** Questions for one quiz run. Random-count lessons (Week 1) get a shuffled
   *  subset of 3..all questions, so the length differs every time. */
  quizQuestions() {
    if (!this.randomCount) return this.questions;
    const min = Math.min(3, this.questions.length), n = min + Math.floor(Math.random() * (this.questions.length - min + 1));
    return Utils.shuffle(this.questions).slice(0, n);
  }
  /** True for slide-based lessons (no video file needed). */
  get interactive() { return Array.isArray(this.slides) && this.slides.length > 0; }
  get videoUrl() { return `${CONFIG.VIDEO_DIR}lesson_${this.id}.mp4`; }
  /** True if today's date falls inside this lesson's scheduled week. */
  isCurrent(today = Utils.day(Date.now())) { return today >= this.start && today <= this.end; }
}
