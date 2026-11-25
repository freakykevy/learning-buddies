"use strict";
/** One multiple-choice quiz question. */
class Question {
  constructor(picture, prompt, options, answer) {
    this.picture = picture; this.prompt = prompt; this.options = options; this.answer = answer;
  }
  isCorrect(choice) { return String(choice) === String(this.answer); }
}
