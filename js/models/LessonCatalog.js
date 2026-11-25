"use strict";
/** Builds the lesson plan: 8 video lessons (October) + 7 interactive slide lessons (November). */
class LessonCatalog {
  static counting(items, lo, hi) {
    return items.map(([e, n]) => new Question(e.repeat(n), "How many do you see?", Utils.ensure(Utils.nearby(n, lo, hi), n), n));
  }
  static letters(items, pool) {
    return items.map(([e, l]) => new Question(e, "What letter does it start with?", Utils.ensure(Utils.shuffle(pool.split("")).slice(0, 4), l), l));
  }
  /** n emoji in a row; the last `gone` of them are marked as taken away. */
  static row(e, n, gone = 0) { return [...Array(n)].map((_, i) => ({ e, gone: i >= n - gone })); }
  /** g equal groups of n emoji (as strings). */
  static groups(e, n, g) { return Array(g).fill(e.repeat(n)); }

  // ---------- interactive lessons (slides: head, say = narration, pic | items | groups, eq) ----------
  static subtractSlides() {
    const R = this.row;
    return [
      { head: "Taking away", say: "Hello, my wonderful friends! Today we will learn to take away. Taking away is called subtracting. Let's go!", pic: "➖" },
      { head: "3 apples", say: "Look! I have three apples.", items: R("🍎", 3) },
      { head: "Take 1 away", say: "Buddy eats one apple. Take one away!", items: R("🍎", 3, 1) },
      { head: "3 − 1 = 2", say: "Three take away one leaves two apples.", items: R("🍎", 3, 1), eq: "3 − 1 = 2" },
      { head: "5 cookies", say: "Here are five cookies. Two cookies get eaten. Take two away.", items: R("🍪", 5, 2) },
      { head: "5 − 2 = 3", say: "Five take away two leaves three cookies.", items: R("🍪", 5, 2), eq: "5 − 2 = 3" },
      { head: "Your turn!", say: "Four balloons. One balloon pops! How many are left?", items: R("🎈", 4, 1) },
      { head: "4 − 1 = 3", say: "Three balloons are left. Wonderful work, friends!", items: R("🎈", 4, 1), eq: "4 − 1 = 3" },
    ];
  }
  static multiplySlides() {
    const G = this.groups;
    return [
      { head: "Equal groups", say: "Hello, my wonderful friends! Today we will learn multiplying. Multiplying means making equal groups and counting them all.", pic: "✖️" },
      { head: "2 plates", say: "Here are two plates. Each plate has three cookies.", groups: G("🍪", 3, 2) },
      { head: "Count them all", say: "Three plus three makes six. Two groups of three make six cookies.", groups: G("🍪", 3, 2), eq: "3 + 3 = 6" },
      { head: "2 × 3 = 6", say: "We say two times three equals six.", groups: G("🍪", 3, 2), eq: "2 × 3 = 6" },
      { head: "3 bags", say: "Here are three bags. Each bag has two stars.", groups: G("⭐", 2, 3) },
      { head: "3 × 2 = 6", say: "Two plus two plus two makes six. Three times two equals six!", groups: G("⭐", 2, 3), eq: "3 × 2 = 6" },
      { head: "Your turn!", say: "Four nests. Each nest has two eggs. How many eggs in all?", groups: G("🥚", 2, 4) },
      { head: "4 × 2 = 8", say: "Two, four, six, eight! Eight eggs. Hooray! Well done, friends!", groups: G("🥚", 2, 4), eq: "4 × 2 = 8" },
    ];
  }
  static divideSlides() {
    return [
      { head: "Fair sharing", say: "Hello, my wonderful friends! Today we will learn dividing. Dividing means sharing, so everyone gets the same.", pic: "➗" },
      { head: "6 cookies", say: "We have six cookies to share with two friends.", pic: "🐻 🍪🍪🍪🍪🍪🍪 🐰" },
      { head: "Share one by one", say: "One for you, one for you. Keep going until the cookies are all shared!", groups: ["🐻🍪🍪🍪", "🐰🍪🍪🍪"] },
      { head: "6 ÷ 2 = 3", say: "Six shared by two friends is three each.", groups: ["🐻🍪🍪🍪", "🐰🍪🍪🍪"], eq: "6 ÷ 2 = 3" },
      { head: "8 stars", say: "Now we have eight stars to share with four friends.", pic: "🐶🐱🐸🐼 ⭐⭐⭐⭐⭐⭐⭐⭐" },
      { head: "8 ÷ 4 = 2", say: "Everyone gets two stars. Eight shared by four is two.", groups: ["🐶⭐⭐", "🐱⭐⭐", "🐸⭐⭐", "🐼⭐⭐"], eq: "8 ÷ 4 = 2" },
      { head: "Your turn!", say: "Four balloons and two kids. How many balloons does each kid get?", pic: "🧒🧒 🎈🎈🎈🎈" },
      { head: "4 ÷ 2 = 2", say: "Each kid gets two balloons. Wonderful sharing, friends!", groups: ["🧒🎈🎈", "🧒🎈🎈"], eq: "4 ÷ 2 = 2" },
    ];
  }
  static compareSlides() {
    const a = ["🍎🍎🍎🍎🍎", "🍎🍎"];
    return [
      { head: "More or fewer?", say: "Hello, my wonderful friends! Today we will compare groups. We find which group has more, and which has fewer.", pic: "⚖️" },
      { head: "Which has more?", say: "This side has five apples. This side has two apples.", groups: a },
      { head: "5 is more", say: "Five is more than two. The left side has more!", groups: a, eq: "5 > 2" },
      { head: "Fewer", say: "Two is fewer than five. Fewer means not as many.", groups: a, eq: "2 < 5" },
      { head: "The same!", say: "Look! Three and three. They are the same!", groups: ["🍌🍌🍌", "🍌🍌🍌"], eq: "3 = 3" },
      { head: "Your turn!", say: "Which side has more stars?", groups: ["⭐⭐⭐⭐", "⭐⭐"] },
      { head: "Left has more!", say: "Four is more than two. The left side has more. Super!", groups: ["⭐⭐⭐⭐", "⭐⭐"], eq: "4 > 2" },
    ];
  }
  static patternSlides() {
    return [
      { head: "Patterns", say: "Hello, my wonderful friends! Today we will learn patterns. A pattern is something that repeats again and again.", pic: "🔴🔵🔴🔵🔴🔵" },
      { head: "Red, blue", say: "Red, blue, red, blue, red, blue. The pattern repeats!", pic: "🔴🔵🔴🔵🔴🔵" },
      { head: "What is next?", say: "What comes next? Red, blue, red, blue, red, then what?", pic: "🔴🔵🔴🔵🔴❓" },
      { head: "Blue!", say: "Blue! The pattern goes red, blue, red, blue.", pic: "🔴🔵🔴🔵🔴🔵", eq: "Blue!" },
      { head: "Apple, banana", say: "Apple, banana, apple, banana, apple. What comes next?", pic: "🍎🍌🍎🍌🍎❓" },
      { head: "Banana!", say: "Banana! You are a pattern pro!", pic: "🍎🍌🍎🍌🍎🍌", eq: "Banana!" },
      { head: "A longer pattern", say: "Dog, cat, cat, dog, cat, cat. Can you see how it repeats?", pic: "🐶🐱🐱🐶🐱🐱" },
    ];
  }
  static oppositeSlides() {
    const pair = (w1, w2, e1, e2, say) => ({ head: `${w1} and ${w2}`, say, pic: `${e1}  ↔  ${e2}`, eq: `${w1} ↔ ${w2}` });
    return [
      { head: "Opposites", say: "Hello, my wonderful friends! Today we will learn opposites. Opposites are things that are very different.", pic: "↔️" },
      pair("Hot", "cold", "🔥", "🧊", "Fire is hot. Ice is cold. Hot and cold are opposites!"),
      pair("Big", "small", "🐘", "🐭", "An elephant is big. A mouse is small. Big and small are opposites!"),
      pair("Up", "down", "⬆️", "⬇️", "The arrow goes up. The arrow goes down. Up and down are opposites!"),
      pair("Day", "night", "☀️", "🌙", "The sun shines in the day. The moon shines at night. Day and night are opposites!"),
      pair("Happy", "sad", "😀", "😢", "This face is happy. This face is sad. Happy and sad are opposites!"),
    ];
  }
  static animalSlides() {
    const a = (name, e, sound) => ({ head: name, say: `A ${name.toLowerCase()} says ${sound.toLowerCase()}!`, pic: e, eq: `${sound}!` });
    return [
      { head: "Animal sounds", say: "Hello, my wonderful friends! Today we will learn the sounds animals make. Listen carefully!", pic: "🐾" },
      a("Cow", "🐮", "Moo"), a("Cat", "🐱", "Meow"), a("Dog", "🐶", "Woof"), a("Duck", "🦆", "Quack"), a("Sheep", "🐑", "Baa"),
    ];
  }

  static build() {
    const L = (id, week, dates, start, end, subject, title, icon, questions, opts = {}) =>
      new Lesson({ id, week, dates, start, end, subject, title, icon, questions, ...opts });
    return [
      L("count", "Week 1", "Oct 1–9", "2026-10-01", "2026-10-09", "Math", "Counting 1 to 5", "🔢",
        this.counting([["🍎", 1], ["⭐", 2], ["🎈", 3], ["🌸", 4], ["🎃", 5], ["🎈", 4], ["⭐", 5]], 1, 5), { randomCount: true }),
      L("count2", "Week 1", "Oct 1–9", "2026-10-01", "2026-10-09", "Math", "Counting 6 to 10", "🔟",
        this.counting([["🦆", 6], ["🐟", 7], ["🍪", 8], ["🐝", 9], ["🎃", 10], ["🐝", 7]], 6, 10), { randomCount: true }),
      L("letters", "Week 2", "Oct 12–16", "2026-10-12", "2026-10-16", "Letters", "Letters A to E", "🔤",
        this.letters([["🐱", "C"], ["🍎", "A"], ["🐶", "D"], ["🥚", "E"], ["⚽", "B"]], "ABCDE")),
      L("letters2", "Week 2", "Oct 12–16", "2026-10-12", "2026-10-16", "Letters", "Letters F to J", "🔡",
        this.letters([["🐟", "F"], ["🎩", "H"], ["🍦", "I"], ["🍇", "G"], ["🧃", "J"]], "FGHIJ")),
      L("colors", "Week 3", "Oct 19–23", "2026-10-19", "2026-10-23", "Colors", "Five Colors", "🎨",
        [["🍌", "🟡"], ["🐸", "🟢"], ["🎃", "🟠"], ["🍎", "🔴"], ["🐳", "🔵"]].map(([p, c]) =>
          new Question(p, "What color is it?", Utils.ensure(Utils.shuffle(["🔴", "🔵", "🟡", "🟢", "🟠"]).slice(0, 4), c), c))),
      L("shapes", "Week 3", "Oct 19–23", "2026-10-19", "2026-10-23", "Shapes", "Shapes", "🔺",
        [["circle", "🔴"], ["square", "🟥"], ["triangle", "🔺"], ["star", "⭐"]].map(([w, e]) =>
          new Question(w.toUpperCase(), `Which one is a ${w}?`, Utils.ensure(Utils.shuffle(["🔴", "🟥", "🔺", "⭐"]).slice(0, 4), e), e))),
      L("count3", "Week 4", "Oct 26–30", "2026-10-26", "2026-10-30", "Math", "Counting 11 to 15", "🧮",
        this.counting([["🍎", 11], ["🎈", 12], ["🐥", 13], ["🌟", 14], ["🍪", 15], ["🎈", 13], ["🌟", 12]], 11, 15)),
      L("add", "Week 4", "Oct 26–30", "2026-10-26", "2026-10-30", "Math", "Simple Addition", "➕",
        [[1, 1, "⭐"], [2, 1, "🎈"], [2, 2, "🍎"], [3, 1, "🎃"], [3, 2, "🍎"]].map(([a, b, e]) =>
          new Question(`${e.repeat(a)} + ${e.repeat(b)}`, "How many in all?", Utils.ensure(Utils.nearby(a + b, 2, 6), a + b), a + b))),

      // ---- November: interactive lessons (slides + quiz, no video file needed)
      L("subtract", "Week 5", "Nov 2–6", "2026-11-02", "2026-11-06", "Math", "Simple Subtraction", "➖",
        [[3, 1, "⭐"], [4, 2, "🍎"], [5, 1, "🎈"], [5, 3, "🍪"], [2, 1, "🐥"]].map(([a, b, e]) =>
          new Question(`${e.repeat(a)} − ${e.repeat(b)}`, "How many are left?", Utils.ensure(Utils.nearby(a - b, 0, 5), a - b), a - b)),
        { slides: this.subtractSlides() }),
      L("compare", "Week 5", "Nov 2–6", "2026-11-02", "2026-11-06", "Math", "More or Fewer", "⚖️",
        [[4, 2, "🍎"], [1, 3, "⭐"], [5, 3, "🎈"], [2, 2, "🍪"], [3, 5, "🐥"]].map(([a, b, e]) =>
          new Question(`${e.repeat(a)}  vs  ${e.repeat(b)}`, "Which side has more?", Utils.shuffle(["Left", "Right", "Same"]), a > b ? "Left" : a < b ? "Right" : "Same")),
        { slides: this.compareSlides() }),
      L("patterns", "Week 6", "Nov 9–13", "2026-11-09", "2026-11-13", "Patterns", "Patterns", "🔴",
        [["🔴", "🔵"], ["🍎", "🍌"], ["⭐", "🌙"], ["🐶", "🐱", "🐱"], ["🟡", "🟡", "🟢"]].map(u => {
          const seq = [...Array(5)].map((_, i) => u[i % u.length]).join(""), ans = u[5 % u.length];
          return new Question(seq + "❓", "What comes next?", Utils.ensure(Utils.shuffle([...new Set([...u, "🐸", "🎈"])]).slice(0, 4), ans), ans);
        }), { slides: this.patternSlides() }),
      L("opposites", "Week 6", "Nov 9–13", "2026-11-09", "2026-11-13", "Words", "Opposites", "↔️",
        [["hot", "cold", "🔥"], ["big", "small", "🐘"], ["up", "down", "⬆️"], ["day", "night", "☀️"], ["happy", "sad", "😀"]].map(([w, o, e]) =>
          new Question(e, `What is the opposite of ${w}?`, Utils.ensure(Utils.shuffle(["hot", "cold", "big", "small", "up", "down", "day", "night", "happy", "sad"].filter(x => x !== w)).slice(0, 4), o), o)),
        { slides: this.oppositeSlides() }),
      L("multiply", "Week 7", "Nov 16–20", "2026-11-16", "2026-11-20", "Math", "Equal Groups (Multiplying)", "✖️",
        [[3, 2, "🍪"], [2, 3, "⭐"], [2, 2, "🍎"], [2, 4, "🥚"], [3, 3, "🎈"]].map(([n, g, e]) =>
          new Question(this.groups(e, n, g).join(" | "), "How many in all?", Utils.ensure(Utils.nearby(n * g, 2, 12), n * g), n * g)),
        { slides: this.multiplySlides() }),
      L("animals", "Week 7", "Nov 16–20", "2026-11-16", "2026-11-20", "Words", "Animal Sounds", "🐮",
        [["🐮", "Moo"], ["🐱", "Meow"], ["🐶", "Woof"], ["🦆", "Quack"], ["🐑", "Baa"]].map(([e, snd]) =>
          new Question(e, "What sound does it make?", Utils.ensure(Utils.shuffle(["Moo", "Meow", "Woof", "Quack", "Baa"].filter(x => x !== snd)).slice(0, 3), snd), snd)),
        { slides: this.animalSlides() }),
      L("divide", "Week 8", "Nov 23–27", "2026-11-23", "2026-11-27", "Math", "Fair Sharing (Dividing)", "➗",
        [[4, 2, "🍪", "👧"], [6, 2, "🍎", "👦"], [6, 3, "⭐", "🧒"], [8, 2, "🎈", "👧"], [8, 4, "🍬", "🧒"]].map(([t, k, e, f]) =>
          new Question(`${e.repeat(t)} ➗ ${f.repeat(k)}`, "How many does each friend get?", Utils.ensure(Utils.nearby(t / k, 1, 5), t / k), t / k)),
        { slides: this.divideSlides() }),
    ];
  }
}
