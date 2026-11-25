import os, sys, math, subprocess, wave, random, textwrap
import numpy as np
from PIL import Image, ImageDraw, ImageFont
W, H, FPS = 1280, 720, 24
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.environ.get("OUT_DIR", os.path.join(HERE, "..", "assets", "videos")); WORK = os.environ.get("WORK_DIR", "/tmp/lesson_build"); FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"; EF = "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf"
def F(s): return ImageFont.truetype(FB, max(8, int(s)))
NAVY, BLUE, YEL, COR, GRN, PUR, CREAM = "#22314A", "#4FA7DE", "#FFC93C", "#FF6B6B", "#6BCB77", "#9B7EDE", "#FFF8E7"
PAL = [COR, BLUE, YEL, GRN, PUR]
NUM = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]
_ef = ImageFont.truetype(EF, 109); _ec = {}
def emoji(ch, size):
    size = max(8, int(size // 4 * 4))
    if (ch, size) not in _ec:
        im = Image.new("RGBA", (160, 160), (0, 0, 0, 0)); ImageDraw.Draw(im).text((10, 10), ch, font=_ef, embedded_color=True); im = im.crop(im.getbbox())
        r = size / max(im.size); _ec[(ch, size)] = im.resize((max(1, int(im.width * r)), max(1, int(im.height * r))), Image.LANCZOS)
    return _ec[(ch, size)]
def put(im, ch, cx, cy, size):
    e = emoji(ch, size); im.paste(e, (int(cx - e.width / 2), int(cy - e.height / 2)), e)
def ctext(d, s, cx, y, font, fill): d.text((cx - d.textlength(s, font=font) / 2, y), s, font=font, fill=fill)
def eob(x): c1 = 1.70158; c3 = c1 + 1; return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2
beats = []
def B(narr, sc, silence=0.0, cap=None, gap=0.8): beats.append(dict(narr=narr, sc=sc, sil=silence, gap=gap, cap=cap if cap is not None else (narr or "")))
def lesson_count2():
    K = [("🦆", "ducks"), ("🐟", "fish"), ("🍪", "cookies"), ("🐝", "bees"), ("🎃", "pumpkins")]
    r2 = lambda e, n, lab=True: [dict(e=e, lab=str(i + 1) if lab else None, w=92, sz=80) for i in range(n)]
    B("Hi friends! It's Buddy! Welcome back to Learning Buddies!", dict(mode="title"))
    B("Today we will count from six all the way to ten. Let's go!", dict(head="Count 6 to 10", items=[dict(t=str(i), c=PAL[i % 5], w=170) for i in range(6, 11)], shown=5))
    for j, n in enumerate(range(6, 11)):
        e, p = K[j]; its = r2(e, n)
        for i in range(1, n + 1):
            B(NUM[i].capitalize() + ("." if i < n else "!"), dict(head=f"Let's count the {p}!", items=its, shown=i, new=[i - 1]), cap=" ".join(str(k) for k in range(1, i + 1)), gap=0.25)
        B(f"{NUM[n].capitalize()}! There are {NUM[n]} {p}.", dict(head=f"{n} {p}", items=its, shown=n, big=str(n), new=[]))
    for e, n, nm in (("🐝", 7, "bees"), ("🍪", 9, "cookies")):
        its = r2(e, n, False)
        B(f"How many {nm} do you see?", dict(head="Quick recap", items=its, shown=n))
        B(None, dict(head="Quick recap", items=its, shown=n, new=[], think=1), silence=4.5, cap="Count them out loud!")
        B(f"{NUM[n].capitalize()} {nm}! You got it!", dict(head="Quick recap", items=r2(e, n), shown=n, big=str(n), new=[]))
    B("Hooray! You can count to ten! See you in our next lesson. Bye bye!", dict(mode="confetti", msg="You can count to 10!"))
def lesson_letters2():
    L = [("F", "Eff", "fish", "🐟"), ("G", "Jee", "grapes", "🍇"), ("H", "Aitch", "hat", "🎩"), ("I", "Eye", "ice cream", "🍦"), ("J", "Jay", "juice", "🧃")]
    B("Hi friends! It's Buddy! Welcome back to Learning Buddies!", dict(mode="title"))
    B("Today we will learn five more letters. F, G, H, I, and J. Let's go!", dict(head="Letters F to J", items=[dict(t=l[0], c=PAL[i], w=170) for i, l in enumerate(L)], shown=5))
    for i, (l, sp, w, e) in enumerate(L):
        its = [dict(t=l + l.lower(), c=PAL[i], w=330), dict(e=e, w=330)]
        B(f"{sp}. {sp}. Say it with me. {sp}!", dict(head=f"Letter {l}", items=its, shown=1), cap=f"Letter {l}. Say it with me: {l}!")
        B(f"{sp} is for {w}. {w}!", dict(head=f"Letter {l}", items=its, shown=2, sub=f"{l} is for {w}!"))
    for l, sp, w, e in (L[0], L[2], L[3]):
        B(f"What letter does {w} start with?", dict(head="Quick recap", items=[dict(e=e, w=300)], shown=1))
        B(None, dict(head="Quick recap", items=[dict(e=e, w=300)], shown=1, new=[], think=1), silence=3.5, cap="Think and say the letter!")
        B(f"{sp}! {w} starts with {sp}. You got it!", dict(head="Quick recap", items=[dict(t=l, c=GRN, w=240), dict(e=e, w=300)], shown=2, sub=f"{l} is for {w}!"))
    B("Hooray! You know ten letters now! See you next time. Bye bye!", dict(mode="confetti", msg="You know 10 letters!"))
def lesson_shapes():
    S = [("circle", "⚽", "ball"), ("square", "🎁", "present"), ("triangle", "🍕", "pizza slice"), ("rectangle", "🚪", "door"), ("star", "🌟", "star")]
    B("Hi friends! It's Buddy! Welcome to Learning Buddies!", dict(mode="title"))
    B("Shapes are all around us! Today we will learn five shapes. Let's go!", dict(head="Five shapes", items=[dict(shape=s[0], c=PAL[i], w=190) for i, s in enumerate(S)], shown=5))
    for i, (k, e, nm) in enumerate(S):
        its = [dict(shape=k, c=PAL[i], w=330), dict(e=e, w=300)]
        B(f"This shape is a {k}. {k}!", dict(head=k.capitalize(), items=its, shown=1, sub=k.upper(), subc=PAL[i]))
        B(f"Look! A {nm} is a {k} shape!", dict(head=k.capitalize(), items=its, shown=2, sub=k.upper(), subc=PAL[i]))
    for i in (2, 0, 4):
        k = S[i][0]; it = [dict(shape=k, c=PAL[i], w=300)]
        B("What shape is this?", dict(head="Quick recap", items=it, shown=1))
        B(None, dict(head="Quick recap", items=it, shown=1, new=[], think=1), silence=3.5, cap="Think and say the shape!")
        B(f"A {k}! You got it!", dict(head="Quick recap", items=it, shown=1, sub=k.upper(), subc=PAL[i], new=[]))
    B("Hooray! You know five shapes! See you next time. Bye bye!", dict(mode="confetti", msg="You know 5 shapes!"))
def lesson_count():
    K = [("🍎", "apple"), ("⭐", "stars"), ("🎈", "balloons"), ("🌸", "flowers"), ("🎃", "pumpkins")]
    r1 = lambda e, n, lab=True: [dict(e=e, lab=str(i + 1) if lab else None, w=190, sz=110 if n < 4 else 96) for i in range(n)]
    B("Hi friends! I am Buddy. Welcome to Learning Buddies!", dict(mode="title"))
    B("Today we will learn to count from one to five. Let's go!", dict(head="Count 1 to 5", items=[dict(t=str(i), c=PAL[i - 1], w=170) for i in range(1, 6)], shown=5))
    for j, n in enumerate(range(1, 6)):
        e, p = K[j]; its = r1(e, n)
        for i in range(1, n + 1):
            B(NUM[i].capitalize() + "!", dict(head=f"Let's count the {p}!", items=its, shown=i, new=[i - 1]), cap=" ".join(str(k) for k in range(1, i + 1)) if i > 1 else "One!", gap=0.3)
        B(f"{NUM[n].capitalize()}! There {'is' if n == 1 else 'are'} {NUM[n]} {p}.", dict(head=f"{n} {p}", items=its, shown=n, big=str(n), new=[]))
    its = r1("🎈", 4, False)
    B("Now it is your turn! Count the balloons with me. Ready?", dict(head="Your turn!", items=its, shown=4, new=[]))
    B("How many balloons are there? Say it out loud!", dict(head="Your turn!", items=its, shown=4, new=[]))
    B(None, dict(head="Your turn!", items=its, shown=4, new=[], think=1), silence=4.5, cap="Count out loud!")
    B("One, two, three, four. Four balloons! Great job!", dict(head="Four balloons!", items=r1("🎈", 4), shown=4, big="4", new=[]))
    for e, n, nm in (("⭐", 2, "stars"), ("🎃", 5, "pumpkins"), ("🌸", 3, "flowers")):
        B(f"How many {nm} do you see?", dict(head="Quick recap", items=r1(e, n, False), shown=n))
        B(None, dict(head="Quick recap", items=r1(e, n, False), shown=n, new=[], think=1), silence=4.5, cap="Think and say the number!")
        B(f"{NUM[n].capitalize()} {nm}! You got it!", dict(head="Quick recap", items=r1(e, n), shown=n, big=str(n), new=[]))
    B("Hooray! You can count from one to five! You are a super learner. See you in our next lesson, where we learn letters. Bye bye!", dict(mode="confetti", msg="You can count to 5!"))
def lesson_letters():
    L = [("A", "Ay", "apple", "🍎"), ("B", "Bee", "ball", "⚽"), ("C", "See", "cat", "🐱"), ("D", "Dee", "dog", "🐶"), ("E", "Eee", "egg", "🥚")]
    B("Hi friends! It's Buddy again! Welcome back to Learning Buddies!", dict(mode="title"))
    B("Today we will learn five letters. A, B, C, D, and E. Let's go!", dict(head="Letters A to E", items=[dict(t=l[0], c=PAL[i], w=170) for i, l in enumerate(L)], shown=5))
    for i, (l, sp, w, e) in enumerate(L):
        its = [dict(t=l + l.lower(), c=PAL[i], w=330), dict(e=e, w=330)]
        B(f"Letter {l}. Say it with me. {sp}!", dict(head=f"Letter {l}", items=its, shown=1), cap=f"Letter {l}. Say it with me: {l}!")
        B(f"{sp} is for {w}. {w}!", dict(head=f"Letter {l}", items=its, shown=2, sub=f"{l} is for {w}!"))
    for l, sp, w, e in (L[2], L[0], L[3]):
        B(f"What letter does {w} start with?", dict(head="Quick recap", items=[dict(e=e, w=300)], shown=1))
        B(None, dict(head="Quick recap", items=[dict(e=e, w=300)], shown=1, new=[], think=1), silence=4.0, cap="Think and say the letter!")
        B(f"{sp}! {w} starts with {sp}. You got it!", dict(head="Quick recap", items=[dict(t=l, c=GRN, w=240), dict(e=e, w=300)], shown=2, sub=f"{l} is for {w}!"))
    B("Hooray! You know the letters A, B, C, D, and E! See you in our next lesson, where we learn colors. Bye bye!", dict(mode="confetti", msg="You know 5 letters!"))
def lesson_colors():
    CO = {"red": "#E53935", "blue": BLUE, "yellow": YEL, "green": GRN, "orange": "#FF9F1C"}
    C = [("red", ["🍎", "🍓"]), ("blue", ["🐳", "🧢"]), ("yellow", ["🍌", "🌻"]), ("green", ["🐸", "🥦"]), ("orange", ["🎃", "🍊"])]
    B("Hi friends! It's Buddy! Welcome to Learning Buddies!", dict(mode="title"))
    B("October is full of colors! Today we will learn five colors. Let's go!", dict(head="Five colors", items=[dict(shape="circle", c=CO[c], w=190) for c, _ in C], shown=5))
    for c, es in C:
        sw = dict(shape="circle", c=CO[c], w=200); its = [sw] + [dict(e=e, w=190) for e in es]
        B(f"This color is {c}. {c}!", dict(head=c.capitalize(), items=its, shown=1, sub=c.upper(), subc=CO[c]))
        B(f"Look! These are {c} too!", dict(head=c.capitalize(), items=its, shown=3, sub=c.upper(), subc=CO[c]))
    for e, nm, c in (("🍌", "banana", "yellow"), ("🐸", "frog", "green"), ("🎃", "pumpkin", "orange")):
        B(f"What color is the {nm}?", dict(head="Quick recap", items=[dict(e=e, w=300)], shown=1))
        B(None, dict(head="Quick recap", items=[dict(e=e, w=300)], shown=1, new=[], think=1), silence=4.0, cap="Think and say the color!")
        B(f"{c.capitalize()}! The {nm} is {c}. You got it!", dict(head="Quick recap", items=[dict(shape="circle", c=CO[c], w=240), dict(e=e, w=300)], shown=2, sub=c.upper(), subc=CO[c]))
    B("Hooray! You know five colors! See you in our next lesson, where we learn to add. Bye bye!", dict(mode="confetti", msg="You know 5 colors!"))
def lesson_add():
    def eq(a, b, e, upto):
        g = lambda n: dict(e=e, n=n, sz=70, w=n * 74 + 50)
        its = [g(a), dict(t="+", c=NAVY, f=80, w=130), g(b), dict(t="=", c=NAVY, f=80, w=130), dict(t=str(a + b), c=GRN, f=90, w=170)]
        return its, upto
    B("Hi friends! It's Buddy! Welcome to Learning Buddies!", dict(mode="title"))
    B("Today we will learn to add. Adding means putting groups together. Let's go!", dict(head="Adding", items=[dict(t="+", c=COR, f=110, w=240)], shown=1))
    W1 = {"⭐": "star", "🎈": "balloon", "🍎": "apple", "🎃": "pumpkin"}
    for a, b, e in ((1, 1, "⭐"), (2, 1, "🎈"), (2, 2, "🍎"), (3, 2, "🎃")):
        w = W1[e]; pl = lambda n: w if n == 1 else w + "s"; its, _ = eq(a, b, e, 0); hd = f"{a} + {b} = ?"
        B(f"{NUM[a].capitalize()} {pl(a)}.", dict(head=hd, items=its, shown=1), cap=f"{a} {pl(a)}")
        B(f"Plus {NUM[b]} {pl(b)}.", dict(head=hd, items=its, shown=3, new=[1, 2]), cap=f"Plus {b} {pl(b)}")
        B(f"{NUM[a].capitalize()} plus {NUM[b]} equals {NUM[a + b]}!", dict(head=f"{a} + {b} = {a + b}", items=its, shown=5, new=[3, 4]), cap=f"{a} + {b} = {a + b}!")
    for a, b, e, nm in ((1, 2, "🍎", "apples"), (2, 3, "🎈", "balloons")):
        its, _ = eq(a, b, e, 0)
        B(f"How many {nm} in all?", dict(head="Quick recap", items=its[:3], shown=3))
        B("Count them all together!", dict(head="Quick recap", items=its[:3], shown=3, new=[], think=1), silence=4.5, cap="Count them all together!")
        B(f"{NUM[a + b].capitalize()}! {NUM[a]} plus {NUM[b]} equals {NUM[a + b]}. Great job!", dict(head="Quick recap", items=its, shown=5, new=[]))
    B("Hooray! You can add! You are a super learner. See you in our next lesson. Bye bye!", dict(mode="confetti", msg="You can add!"))
def tenframes(e, n, lab=None):
    return dict(mode="frames", e=e, n=n, lab=lab)
def lesson_count3():
    K = ["🍎", "🎈", "🐥", "🌟", "🍪"]
    B("Hi friends! It's Buddy! Welcome back to Learning Buddies!", dict(mode="title"))
    B("Today we will count from eleven to fifteen. Let's go!", dict(head="Count 11 to 15", items=[dict(t=str(i), c=PAL[i % 5], w=190) for i in range(11, 16)], shown=5))
    B("First, let's count to ten. Count along with me!", dict(head="Let's count to ten", **tenframes("🍎", 0)))
    for i in range(1, 11):
        B(NUM[i].capitalize() + ("." if i < 10 else "!"), dict(head="Let's count to ten", new=i - 1, **tenframes("🍎", i)), cap=" ".join(str(k) for k in range(1, i + 1)), gap=0.25)
    B("Ten! The box is full. That is ten!", dict(head="A full ten frame", big="10", **tenframes("🍎", 10)))
    TEEN = ["eleven", "twelve", "thirteen", "fourteen", "fifteen"]
    for j, n in enumerate(range(11, 16)):
        e = K[j]
        B(f"Ten, and {NUM[n - 10]} more.", dict(head=f"Ten and {n - 10} more", new=n - 1, **tenframes(e, n)), cap=f"10 and {n - 10} more")
        B(f"{TEEN[j].capitalize()}! There are {TEEN[j]}.", dict(head=f"{n}", big=str(n), **tenframes(e, n)))
    for e, n in (("🐥", 13), ("🌟", 15), ("🍪", 12)):
        B("How many do you see?", dict(head="Quick recap", **tenframes(e, n)))
        B(None, dict(head="Quick recap", think=1, **tenframes(e, n)), silence=5.0, cap="Count them out loud!")
        B(f"{TEEN[n - 11].capitalize()}! You got it!", dict(head="Quick recap", big=str(n), **tenframes(e, n)))
    B("Hooray! You can count to fifteen! See you in our next lesson. Bye bye!", dict(mode="confetti", msg="You can count to 15!"))
LES = {"count": ("Lesson 1: Counting 1 to 5", "Week 1", lesson_count), "letters": ("Lesson 2: Letters A to E", "Week 2", lesson_letters), "colors": ("Lesson 3: Colors", "Week 3", lesson_colors), "add": ("Lesson 4: Simple Addition", "Week 4", lesson_add), "count2": ("Lesson 6: Counting 6 to 10", "Week 1", lesson_count2), "letters2": ("Lesson 7: Letters F to J", "Week 2", lesson_letters2), "shapes": ("Lesson 8: Shapes", "Week 3", lesson_shapes), "count3": ("Lesson 9: Counting 11 to 15", "Week 4", lesson_count3)}
key = sys.argv[1]; TITLE, WEEK, fn = LES[key]; fn(); SHORT = TITLE.split(": ")[1]; os.makedirs(OUT, exist_ok=True)
# ---- Voice: Kokoro neural text-to-speech (natural human-sounding voice) via sherpa-onnx ----
# Set KOKORO_DIR (model folder: model.onnx, voices.bin, tokens.txt, espeak-ng-data) and SHERPA_DIR
# (sherpa-onnx folder with bin/ and lib/). See README "Rebuilding lesson videos".
import hashlib
KOKORO = os.environ.get("KOKORO_DIR", "/home/claude/tts/kokoro-en-v0_19"); SHERPA = os.environ.get("SHERPA_DIR", "/home/claude/tts/sherpa-onnx-v1.12.20-linux-x64-shared")
SPEAKER = os.environ.get("VOICE_SID", "1")   # 1 = af_bella (warm, friendly). 2 = af_nicole, 3 = af_sarah, 4 = af_sky
SPEED = os.environ.get("VOICE_SPEED", "0.92")  # slightly slow and clear for young learners
def speak(text, path):
    cmd = [f"{SHERPA}/bin/sherpa-onnx-offline-tts", f"--kokoro-model={KOKORO}/model.onnx", f"--kokoro-voices={KOKORO}/voices.bin", f"--kokoro-tokens={KOKORO}/tokens.txt",
           f"--kokoro-data-dir={KOKORO}/espeak-ng-data", "--num-threads=4", f"--sid={SPEAKER}", f"--kokoro-speed={SPEED}", f"--output-filename={path}", text]
    r = subprocess.run(cmd, env=dict(os.environ, LD_LIBRARY_PATH=f"{SHERPA}/lib"), capture_output=True)
    if r.returncode != 0 and "kokoro-speed" in " ".join(cmd):   # older builds have no speed flag
        cmd = [c for c in cmd if not c.startswith("--kokoro-speed")]; r = subprocess.run(cmd, env=dict(os.environ, LD_LIBRARY_PATH=f"{SHERPA}/lib"), capture_output=True)
    if r.returncode != 0: raise SystemExit(r.stderr.decode()[-500:])
def clip(text):
    """Speech for one beat as float samples at the model's sample rate, with edge silence trimmed."""
    cache = f"{WORK}/tts_{SPEAKER}_{SPEED}_{hashlib.md5(text.encode()).hexdigest()[:12]}.wav"
    if not os.path.exists(cache): speak(text, cache)
    with wave.open(cache) as w: rate = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32)
    loud = np.where(np.abs(x) > 600)[0]
    if len(loud): x = x[max(0, loud[0] - int(rate * .04)):loud[-1] + int(rate * .12)]
    n = int(rate * .02); x[:n] *= np.linspace(0, 1, n); x[-n:] *= np.linspace(1, 0, n)
    return rate, x
D = f"{WORK}/{key}"; os.makedirs(D, exist_ok=True); chunks = []; RATE = None; spans = []; pos = 0
for i, b in enumerate(beats):
    s0 = pos
    if b["narr"]:
        rate, x = clip(b["narr"]); RATE = RATE or rate; chunks.append(x); pos += len(x); sp = pos
        g = np.zeros(int(RATE * b["gap"]), dtype=np.float32); chunks.append(g); pos += len(g)
    else:
        sp = s0; g = np.zeros(int(RATE * b["sil"]), dtype=np.float32); chunks.append(g); pos += len(g)
    spans.append((s0, sp, pos))
pcm = np.concatenate(chunks).astype(np.int16).tobytes()
with wave.open(f"{D}/raw.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(RATE); w.writeframes(pcm)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{D}/raw.wav", "-af", "aresample=44100,highpass=f=70,acompressor=threshold=-22dB:ratio=2.5:attack=8:release=120,loudnorm=I=-16:TP=-1.5", f"{D}/voice.wav"], check=True)
sig = np.frombuffer(bytes(pcm), dtype=np.int16).astype(np.float32)
_w = int(RATE * 0.04); _r = np.array([np.sqrt((sig[k:k + 2 * _w] ** 2).mean()) for k in range(0, max(1, len(sig) - 2 * _w), _w)]); MOUTH_REF = max(1.0, float(np.percentile(_r[_r > 200], 90)) if (_r > 200).any() else 4500.0)
def mouth_at(t):
    c = int(t * RATE); seg = sig[max(0, c - _w):c + _w]
    return 0.0 if len(seg) == 0 else min(1.0, float(np.sqrt((seg ** 2).mean())) / MOUTH_REF)
base = Image.new("RGB", (W, H), CREAM); bd = ImageDraw.Draw(base); bd.rectangle([0, 0, W, 86], fill=NAVY); bd.text((40, 22), "Learning Buddies", font=F(34), fill=YEL)
bd.text((W - 40 - bd.textlength(TITLE, font=F(26)), 28), TITLE, font=F(26), fill="white")
def mascot(im, d, t, a):
    cx, cy, r = 135, 505 + 6 * math.sin(t * 3.9), 85; ax = 6 * math.sin(t * 2.5)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=BLUE, outline=NAVY, width=5); d.line([cx, cy - r, cx + ax, cy - r - 30], fill=NAVY, width=5)
    d.ellipse([cx - 12 + ax, cy - r - 45, cx + 12 + ax, cy - r - 21], fill=YEL, outline=NAVY, width=3); blink = (t % 3.4) < 0.14
    for ex in (-30, 30):
        if blink: d.line([cx + ex - 12, cy - 10, cx + ex + 12, cy - 10], fill=NAVY, width=4)
        else: d.ellipse([cx + ex - 14, cy - 25, cx + ex + 14, cy + 5], fill="white", outline=NAVY, width=3); d.ellipse([cx + ex - 6, cy - 17, cx + ex + 6, cy - 3], fill=NAVY)
    for ex in (-52, 52): d.ellipse([cx + ex - 12, cy + 12, cx + ex + 12, cy + 28], fill="#FF9AA2")
    if a < 0.12: d.arc([cx - 28, cy + 8, cx + 28, cy + 52], 20, 160, fill=NAVY, width=6)
    else:
        hh = 8 + 30 * a; d.ellipse([cx - 14 - 8 * a, cy + 26, cx + 14 + 8 * a, cy + 26 + hh], fill=NAVY)
        if a > .45: d.ellipse([cx - 9, cy + 26 + hh - 12, cx + 9, cy + 26 + hh - 2], fill=COR)
def draw_item(im, d, it, cx, sc):
    cy = 330
    if "shape" in it:
        k = it["shape"]; c = it["c"]; r = 95 * sc; o = dict(fill=c, outline=NAVY, width=5)
        if k == "circle": d.ellipse([cx - r, cy - r, cx + r, cy + r], **o)
        elif k == "square": d.rectangle([cx - r, cy - r, cx + r, cy + r], **o)
        elif k == "rectangle": d.rectangle([cx - r * 1.4, cy - r * .7, cx + r * 1.4, cy + r * .7], **o)
        elif k == "triangle": d.polygon([(cx, cy - r), (cx - r * 1.1, cy + r * .85), (cx + r * 1.1, cy + r * .85)], **o)
        elif k == "star": d.polygon([(cx + (r * 1.15 if j % 2 == 0 else r * .5) * math.cos(-math.pi / 2 + j * math.pi / 5), cy + (r * 1.15 if j % 2 == 0 else r * .5) * math.sin(-math.pi / 2 + j * math.pi / 5)) for j in range(10)], **o)
    elif "t" in it:
        f = it.get("f", 100); s = it["t"]; fs = F(f * sc); w = d.textlength(s, font=fs) + 60 * sc; hh = (f + 50) * sc
        d.rounded_rectangle([cx - w / 2, cy - hh / 2, cx + w / 2, cy + hh / 2], 28 * sc, fill=it["c"])
        d.text((cx - d.textlength(s, font=fs) / 2, cy - f * sc * 0.62), s, font=fs, fill="white")
    elif "e" in it:
        n = it.get("n", 1); sz = (it.get("sz") or (70 if n > 1 else 126)) * sc; sp = 72 * sc
        for k in range(n): put(im, it["e"], cx + (k - (n - 1) / 2) * sp, cy, sz)
    if it.get("lab"): d.ellipse([cx - 30, 455, cx + 30, 515], fill=NAVY); ctext(d, it["lab"], cx, 458, F(40), "white")
def draw_frames(im, d, e, n, new, tb):
    """Two ten-frames (2 rows x 5). Objects fill the first frame, then the second."""
    cell = 78; fw, fh, gap = 5 * cell, 2 * cell, 56; x0 = 760 - (2 * fw + gap) / 2; y0 = 300
    for f in range(2):
        fx = x0 + f * (fw + gap); d.rounded_rectangle([fx - 8, y0 - 8, fx + fw + 8, y0 + fh + 8], 14, fill="white", outline=NAVY, width=4)
        for k in range(1, 5): d.line([fx + k * cell, y0, fx + k * cell, y0 + fh], fill="#D5DCE8", width=2)
        d.line([fx, y0 + cell, fx + fw, y0 + cell], fill="#D5DCE8", width=2)
        for k in range(10):
            if f * 10 + k < n:
                r, c = divmod(k, 5); sc = max(0.01, eob(min(1, tb / 0.4))) if f * 10 + k == new else 1.0
                put(im, e, fx + c * cell + cell / 2, y0 + r * cell + cell / 2, 62 * sc)
def scene(im, d, sc, tb, t):
    mode = sc.get("mode")
    if mode == "frames":
        if sc.get("head"): ctext(d, sc["head"], 760, 108, F(46), COR)
        draw_frames(im, d, sc["e"], sc["n"], sc.get("new"), tb)
        if sc.get("big"): d.text((W - 230, 120), sc["big"], font=F(150), fill=PUR)
        if sc.get("think"): ctext(d, "Your turn" + "!" * (int(tb * 2) % 3 + 1), 760, 490, F(54), GRN)
        return
    if mode == "title":
        p = eob(min(1, tb / 0.6)); ctext(d, "October  •  " + WEEK, 760, 140, F(36), COR); ctext(d, SHORT, 760, 230, F(78 if len(SHORT) < 18 else 64), NAVY)
        for i in range(5): put(im, ["⭐", "🎃", "🍎", "🎈", "🌸"][i], 470 + i * 130, 440 + 8 * math.sin(t * 3 + i), 90 * p)
        return
    if mode == "confetti":
        random.seed(5)
        for k in range(36): put(im, random.choice(["⭐", "🎃", "🎈", "🌸"]), random.randint(290, 1240), 100 + (random.randint(0, 600) + tb * random.randint(60, 140)) % 500, random.randint(24, 48))
        ctext(d, "Great job!", 760, 230, F(104 * min(1, eob(min(1, tb / .5)))), COR); ctext(d, sc["msg"], 760, 390, F(48), NAVY); return
    if sc.get("head"): ctext(d, sc["head"], 760, 108, F(46), COR)
    items = sc["items"]; shown = sc.get("shown", len(items)); new = sc.get("new", [shown - 1]); vis = items[:shown]; x = 760 - sum(i.get("w", 190) for i in vis) / 2
    for i, it in enumerate(vis):
        w = it.get("w", 190); cx = x + w / 2; x += w; draw_item(im, d, it, cx, max(0.01, eob(min(1, tb / 0.45)) if i in new else 1.0))
    if sc.get("big"): d.text((W - 230, 120), sc["big"], font=F(150), fill=PUR)
    if sc.get("sub"): ctext(d, sc["sub"], 760, 520, F(56), sc.get("subc", NAVY))
    if sc.get("think"): ctext(d, "Your turn" + "!" * (int(tb * 2) % 3 + 1), 760, 470, F(54), GRN)
def frame(bi, t):
    b = beats[bi]; s0, sp, e = spans[bi]; tb = t - s0 / RATE; im = base.copy(); d = ImageDraw.Draw(im); scene(im, d, b["sc"], tb, t)
    mascot(im, d, t, mouth_at(t) if t * RATE < sp else 0.0); d.rounded_rectangle([260, 600, W - 30, 700], 24, fill="white", outline=NAVY, width=3)
    fs = 32; ls = textwrap.wrap(b["cap"], 62)[:2]
    while max(d.textlength(l, font=F(fs)) for l in ls) > 930 and fs > 22: fs -= 2
    if len(ls) > 1: fs = min(fs, 30)
    for k, ln in enumerate(ls): ctext(d, ln, 745, 612 + k * 42 + (21 if len(ls) == 1 else 0), F(fs), NAVY)
    return im
total = len(sig) / RATE; nf = int(total * FPS)
ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", f"{D}/voice.wav", "-c:v", "libx264", "-preset", "veryfast", "-crf", "25", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", f"{OUT}/lesson_{key}.mp4"], stdin=subprocess.PIPE)
bi = 0; prev = None; last = None
for f in range(nf):
    t = f / FPS
    while bi < len(beats) - 1 and t * RATE >= spans[bi][2]: bi += 1; prev = last
    im = frame(bi, t); tb = t - spans[bi][0] / RATE
    if prev is not None and tb < 0.2: im = Image.blend(prev, im, min(1, tb / 0.2))
    last = im; ff.stdin.write(im.tobytes())
ff.stdin.close(); ff.wait(); print(key, "done", round(total, 1), "s")
