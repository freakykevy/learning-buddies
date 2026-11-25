"use strict";
/** An achievement; `test(student)` decides if it is earned. */
class Badge {
  constructor(id, icon, title, hint, test) { Object.assign(this, { id, icon, title, hint, test }); }
}
class BadgeCatalog {
  static all(lessons) {
    const totalLessons = lessons.length, has = (s, ids) => ids.every(x => s.done.has(x));
    const mathIds = lessons.filter(l => l.subject === "Math").map(l => l.id);
    return [
      new Badge("first", "🌱", "First Steps", "Finish 1 lesson", s => s.done.size >= 1),
      new Badge("perfect", "💯", "Perfect Score", "Get every answer right", s => s.perfect > 0),
      new Badge("five", "🏆", "Super Learner", "Finish 5 lessons", s => s.done.size >= 5),
      new Badge("math", "🔢", "Math Whiz", "All math lessons", s => has(s, mathIds)),
      new Badge("abc", "🔤", "Letter Lover", "Both letter lessons", s => has(s, ["letters", "letters2"])),
      new Badge("prac", "🎯", "Practice Pro", "3 practice rounds", s => s.practiceRounds >= 3),
      new Badge("streak", "🔥", "3-Day Streak", "Learn 3 days in a row", s => s.streak >= 3),
      new Badge("all", "👑", "Learning Champion", "Finish every lesson", s => s.done.size >= totalLessons),
    ];
  }
}
