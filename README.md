# Learning Buddies – Video-Based CAI

A pre-school / kindergarten Computer-Aided Instruction app: lessons (narrated videos or interactive
slides) → picture quiz → stars, badges, and a teacher dashboard. Plain HTML/CSS/JavaScript (no build step, no libraries).

## Run it
Open `index.html` in a browser (double-click works). Data is saved on that device (localStorage).
For a classroom, host the folder on any static web host (GitHub Pages, school server).
Progress is saved on the device; connect the **free Supabase database** to share it across devices
(see [docs/DATABASE.md](docs/DATABASE.md)).

## Lessons (15)
| Type | Lessons |
|---|---|
| 🎬 Video (Oct) | Counting 1–5, 6–10, 11–15 · Simple Addition · Letters A–E, F–J · Five Colors · Shapes |
| 🧩 Interactive (Nov) | Simple Subtraction · More or Fewer · Patterns · Opposites · Equal Groups (multiplying) · Animal Sounds · Fair Sharing (dividing) |

Interactive lessons are animated slides with read-aloud narration, followed by the same quiz.
The read-aloud voice is tuned like a warm teacher (slower pace, pauses after each sentence, lifted tone on questions);
tweak `CONFIG.VOICE` in `js/config.js`. It uses the best female English voice the device has installed.

## Publish on GitHub Pages
1. Create a repository and push this folder (the videos total about 15 MB – fine for GitHub).
2. Repo **Settings → Pages → Deploy from a branch → `main` / root**.
3. Open `https://<your-user>.github.io/<repo>/`.
4. Change the teacher PIN in `js/config.js` (it only hides the screen; it is not real security).
Teacher demo PIN: **1234** (change it in `js/config.js`).

## Folder structure
```
learning-buddies/
├── index.html                 page shell + script load order
├── css/styles.css             design tokens, components, dark mode
├── assets/videos/             narrated lesson videos (8) (lesson_<id>.mp4)
├── assets/audio/              recorded quiz prompts for the 🔊 button (human voice)
├── js/
│   ├── config.js              CONFIG constants + Utils helpers
│   ├── main.js                entry point → new App().init()
│   ├── App.js                 controller: state, services, navigation
│   ├── models/                (data classes – no HTML)
│   │   ├── Question.js        one multiple-choice question
│   │   ├── Lesson.js          lesson = video + questions + schedule
│   │   ├── LessonCatalog.js   builds the 15-lesson plan (8 video + 7 interactive)
│   │   ├── Badge.js           Badge + BadgeCatalog (8 achievements)
│   │   └── Student.js         computes stars, streak, badges from records
│   ├── services/              (behaviour – no screens)
│   │   ├── Settings.js        sound / big text / read-aloud preferences
│   │   ├── SoundFx.js         beeps, read-aloud, confetti
│   │   ├── RemoteDb.js        optional free Supabase database (REST)
│   │   └── AttemptStore.js    saves watch/quiz/practice/assign records (device + optional cloud)
│   └── views/                 (screens – each extends View)
│       ├── View.js            base class (mount, $, $$)
│       ├── LoginView.js       avatar + name login
│       ├── PinView.js         teacher PIN keypad
│       ├── HomeView.js        student home, lessons, badges, certificate
│       ├── WatchView.js       video player
│       ├── SlideView.js       interactive slide lessons (no video needed)
│       ├── QuizView.js        quiz / practice + result screen
│       ├── SettingsView.js
│       └── DashboardView.js   teacher: Overview · Students · Assign
├── supabase/schema.sql        table + security rules for the free database
├── docs/DATABASE.md           database setup guide
└── tools/build_lessons.py     script that builds all 8 lesson videos
                               (ffmpeg, Pillow, numpy + Kokoro voice, see below)
```

## Class overview
- **App** owns `LessonCatalog`, `BadgeCatalog`, `Settings`, `SoundFx`, `AttemptStore` and opens each **View**.
- **Student** is built from the attempt records → `stars`, `streak`, `done`, `earned` badges.
- **AttemptStore** → one place that reads/writes records; `assignments()`, `roster()`, `toCsv()`.

## How to add a lesson
**Video lesson:** put the video in `assets/videos/lesson_<id>.mp4`, then add one `L("<id>", …)` entry in `js/models/LessonCatalog.js` with its questions.

**Interactive lesson (no video):** add an `L("<id>", …, { slides: [...] })` entry. Each slide is
`{ head, say, pic | items | groups, eq }` – `say` is the narration, `items` uses `this.row("🍎", 3, 1)`
(3 apples, 1 taken away), `groups` uses `this.groups("🍪", 3, 2)` (2 plates of 3 cookies), `eq` is a big equation.
Menus, badges and the dashboard pick new lessons up automatically.

## Rebuilding lesson videos (human voice)
`tools/build_lessons.py <id>` renders `assets/videos/lesson_<id>.mp4` (ids: count, letters, colors, add, count2, letters2, shapes, count3).
The narration uses the Kokoro neural voice (natural, human-sounding) through the sherpa-onnx command line tool:
1. Download `sherpa-onnx-<version>-linux-x64-shared.tar.bz2` and `kokoro-en-v0_19.tar.bz2` from the k2-fsa/sherpa-onnx GitHub releases and unpack them.
2. Run with `KOKORO_DIR=<kokoro folder> SHERPA_DIR=<sherpa folder> python3 tools/build_lessons.py count3`.
3. Optional: `VOICE_SID` (1 = Bella, 2 = Nicole, 3 = Sarah, 4 = Sky) and `VOICE_SPEED` (default 0.92).
To edit what the narrator says, change the `B("...")` lines inside the lesson function.
The quiz 🔊 button plays `assets/audio/<prompt>.mp3`; if a clip is missing it falls back to the browser voice.
