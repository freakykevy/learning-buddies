"use strict";
/** Application controller: owns state, services, and navigation between views. */
class App {
  constructor() {
    this.root = document.querySelector("#app");
    this.lessons = LessonCatalog.build();
    this.badges = BadgeCatalog.all(this.lessons);
    this.settings = new Settings();
    this.sound = new SoundFx(this.settings);
    this.store = new AttemptStore(new RemoteDb());
    this.user = null;                       // { name, sid, av, role }
    this.dashboard = new DashboardView(this);
  }
  async init() {
    this.settings.apply();
    document.querySelector("#out").onclick = () => this.showLogin();
    document.querySelector("#gr").onclick = () => new SettingsView(this).render();
    document.querySelector("#lg").onclick = () => (this.user ? this.goHome() : this.showLogin());
    this.store.connect();                   // shared storage connects in the background
    this.showLogin();
  }
  lesson(id) { return this.lessons.find(l => l.id === id); }
  student(sid) { return new Student(sid, this.store.rows, this.badges); }
  chrome() {
    document.querySelector("#out").style.display = this.user ? "" : "none";
    document.querySelector("#who").textContent = this.user ? `${this.user.av} ${this.user.name}` : "";
  }
  // ---- navigation
  showLogin() { this.user = null; this.chrome(); new LoginView(this).render(); }
  showPin() { new PinView(this).render(); }
  enterStudent(name, av) {
    this.user = { name, sid: Utils.sid(name), av, role: "student" };
    try { localStorage.setItem(CONFIG.LAST_KEY, JSON.stringify({ name, av })); } catch (e) {}
    this.chrome(); this.goHome();
  }
  enterTeacher() { this.user = { name: "Teacher", sid: "teacher", av: "🧑‍🏫", role: "teacher" }; this.chrome(); this.goHome(); }
  goHome() {
    if (!this.user) return this.showLogin();
    this.chrome();
    this.store.load(() => (this.user.role === "teacher" ? this.dashboard.render() : new HomeView(this).render()));
  }
  watch(lesson) { this.store.onRemote = null; (lesson.interactive ? new SlideView(this, lesson) : new WatchView(this, lesson)).render(); }
  quiz(questions, lessonId, type, title) { this.store.onRemote = null; new QuizView(this, questions, lessonId, type, title).render(); }
  practice() {
    const st = this.student(this.user.sid), pool = [];
    this.lessons.filter(l => st.done.has(l.id) || st.watched.has(l.id)).forEach(l => pool.push(...l.questions));
    if (pool.length < 3) {
      this.root.innerHTML = `<h1>🎯 Practice time</h1><div class="card ctr"><p>Watch a lesson first, then come back to practice what you learned!</p></div><div class="row"><button class="btn" id="bk">OK</button></div>`;
      document.querySelector("#bk").onclick = () => this.goHome(); return;
    }
    this.quiz(Utils.shuffle(pool).slice(0, 6), "practice", "practice", "Practice time");
  }
}
