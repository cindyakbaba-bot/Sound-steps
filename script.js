/* ---------- Content data ---------- */

// Initial sound isolation: word + first-sound letter, distractors are other letters
const ISOLATION_WORDS = [
  { word: "cat", sound: "c" },
  { word: "sun", sound: "s" },
  { word: "dog", sound: "d" },
  { word: "fish", sound: "f" },
  { word: "map", sound: "m" },
  { word: "bed", sound: "b" },
  { word: "pig", sound: "p" },
  { word: "red", sound: "r" },
  { word: "hot", sound: "h" },
  { word: "leg", sound: "l" },
  { word: "net", sound: "n" },
  { word: "top", sound: "t" },
  { word: "van", sound: "v" },
  { word: "win", sound: "w" },
  { word: "zoo", sound: "z" },
  { word: "gum", sound: "g" },
  { word: "kite", sound: "k" },
  { word: "jam", sound: "j" },
];
const ALL_LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

// Minimal pairs — common ESL confusions
const MINIMAL_PAIRS = [
  ["ship", "sheep"], ["bit", "beat"], ["live", "leave"], ["sit", "seat"],
  ["fill", "feel"], ["bad", "bed"], ["cat", "cut"], ["hat", "hot"],
  ["right", "light"], ["rice", "lice"], ["road", "load"],
  ["berry", "very"], ["boat", "vote"],
  ["think", "sink"], ["thin", "fin"], ["three", "free"],
  ["chip", "ship"], ["cheap", "sheep"],
  ["van", "fan"], ["vine", "fine"],
];

// Word families for the Rhyme Song builder — words that share an ending sound
const WORD_FAMILIES = [
  { label: "-at", words: ["cat", "hat", "bat", "mat", "rat", "sat"] },
  { label: "-og", words: ["dog", "log", "fog", "jog", "frog"] },
  { label: "-un", words: ["sun", "fun", "run", "bun"] },
  { label: "-ig", words: ["pig", "big", "dig", "wig"] },
  { label: "-ee", words: ["bee", "tree", "see", "free"] },
  { label: "-op", words: ["hop", "top", "mop", "pop", "stop"] },
];

// Blending: word + distractor whole-words. The word is spelled out letter by
// letter (using the same recorded letter sounds as the Sound Explorer) then
// spoken whole — see playCurrentAudio()'s spellWord handling.
const BLEND_WORDS = [
  { word: "cat", distractors: ["dog", "sun"] },
  { word: "map", distractors: ["cup", "bed"] },
  { word: "sun", distractors: ["cat", "top"] },
  { word: "dog", distractors: ["pig", "van"] },
  { word: "bed", distractors: ["hat", "net"] },
  { word: "pin", distractors: ["cup", "dog"] },
  { word: "top", distractors: ["bed", "sun"] },
  { word: "cup", distractors: ["cat", "leg"] },
];

const QUESTIONS_PER_SESSION = 8;

// Approximate phonetic sound for each letter, for the Sound Explorer.
// Each entry is a single short nonsense syllable rather than a repeated
// letter (e.g. "muh" not "mmmm") — repeated-letter strings aren't real
// words, so many TTS engines fall back to spelling them out letter by
// letter instead of holding the sound, which is heard as the sound
// stuttering/repeating.
const LETTER_SOUNDS = {
  a: "a", b: "buh", c: "kuh", d: "duh", e: "eh", f: "fuh", g: "guh",
  h: "huh", i: "ih", j: "juh", k: "kuh", l: "luh", m: "muh", n: "nuh",
  o: "aw", p: "puh", q: "kwuh", r: "ruh", s: "suh", t: "tuh", u: "uh",
  v: "vuh", w: "wuh", x: "ks", y: "yuh", z: "zuh",
};

// Words with a real recorded clip at audio/words/{word}.mp3 (generated from
// a local neural TTS voice — see audio/README.md). Anything not in this set
// falls back to the browser's built-in speech synthesis, which is why the
// Sound Explorer still works for arbitrary typed words.
const WORD_AUDIO = new Set([
  "bad", "bat", "beat", "bed", "bee", "berry", "big", "bit", "boat", "bun",
  "cat", "cheap", "chip", "cup", "cut", "dig", "dog", "fan", "feel", "fill",
  "fin", "fine", "fish", "fog", "free", "frog", "fun", "gum", "hat", "hop",
  "hot", "jam", "jog", "kite", "leave", "leg", "lice", "light", "live",
  "load", "log", "map", "mat", "mop", "net", "pig", "pin", "pop", "rat",
  "red", "rice", "right", "road", "run", "sat", "seat", "see", "sheep",
  "ship", "sink", "sit", "stop", "sun", "thin", "think", "three", "top",
  "tree", "van", "very", "vine", "vote", "wig", "win", "zoo",
]);

/* ---------- Speech ---------- */

// A single shared "now playing" clip so overlapping taps interrupt cleanly,
// the same way speechSynthesis.cancel() interrupts a queued utterance.
let activeClip = null;

function playClip(url, { rate = 1, pause = 0 } = {}) {
  return new Promise((resolve) => {
    if (activeClip) activeClip.pause();
    const audio = new Audio(url);
    activeClip = audio;
    audio.playbackRate = rate;
    const done = () => {
      if (activeClip === audio) activeClip = null;
      setTimeout(resolve, pause);
    };
    audio.onended = done;
    audio.onerror = done;
    audio.play().catch(done);
  });
}

function speakLetter(letter, { rate = 1, pause = 0 } = {}) {
  return playClip(`audio/letters/${letter}.mp3`, { rate, pause }).catch(() =>
    speak(LETTER_SOUNDS[letter] || letter, { pause })
  );
}

function speakWord(word, { rate = 1, pitch = 1, pause = 0 } = {}) {
  const normalized = word.toLowerCase();
  if (WORD_AUDIO.has(normalized)) {
    return playClip(`audio/words/${normalized}.mp3`, { rate, pause });
  }
  return speak(word, { rate: rate * 0.85, pitch, pause });
}

// speechSynthesis.getVoices() is often empty until the async "voiceschanged"
// event fires — cache it and re-pick once real voices are available so we
// don't get stuck on a low-quality default voice.
let preferredVoice = null;

function pickPreferredVoice(voices) {
  if (!voices.length) return null;
  const enVoices = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("en"));
  const pool = enVoices.length ? enVoices : voices;
  return pool.find((v) => v.localService) || pool[0];
}

if ("speechSynthesis" in window) {
  preferredVoice = pickPreferredVoice(window.speechSynthesis.getVoices());
  window.speechSynthesis.onvoiceschanged = () => {
    preferredVoice = pickPreferredVoice(window.speechSynthesis.getVoices());
  };
}

function speak(text, { rate = 0.85, pitch = 1, pause = 0 } = {}) {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) { resolve(); return; }
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = rate;
    utter.pitch = pitch;
    if (preferredVoice) utter.voice = preferredVoice;
    utter.onend = () => setTimeout(resolve, pause);
    utter.onerror = () => resolve();
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  });
}

/* ---------- Utilities ---------- */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickN(arr, n) {
  return shuffle(arr).slice(0, n);
}

/* ---------- Question builders ---------- */
// Each builder returns { prompt, playText | playSequence, choices: [{label, correct}] }

function buildIsolationQuestion() {
  const item = ISOLATION_WORDS[Math.floor(Math.random() * ISOLATION_WORDS.length)];
  const distractors = pickN(ALL_LETTERS.filter(l => l !== item.sound), 2);
  const choices = shuffle([
    { label: item.sound, correct: true },
    ...distractors.map(l => ({ label: l, correct: false })),
  ]);
  return {
    prompt: "What sound does this word start with?",
    playText: item.word,
    choices,
  };
}

function buildMinimalPairQuestion() {
  const [a, b] = MINIMAL_PAIRS[Math.floor(Math.random() * MINIMAL_PAIRS.length)];
  const answer = Math.random() < 0.5 ? a : b;
  const choices = shuffle([
    { label: a, correct: a === answer },
    { label: b, correct: b === answer },
  ]);
  return {
    prompt: "Which word did you hear?",
    playText: answer,
    choices,
  };
}

function buildBlendQuestion() {
  const item = BLEND_WORDS[Math.floor(Math.random() * BLEND_WORDS.length)];
  const choices = shuffle([
    { label: item.word, correct: true },
    ...item.distractors.map(d => ({ label: d, correct: false })),
  ]);
  return {
    prompt: "Listen to the sounds. What word do they make?",
    spellWord: item.word,
    choices,
  };
}

const BUILDERS = {
  isolation: buildIsolationQuestion,
  minimalpairs: buildMinimalPairQuestion,
  blending: buildBlendQuestion,
};

const ACTIVITY_TITLES = {
  isolation: "First Sound",
  minimalpairs: "Sound Pairs",
  blending: "Blend It",
};

/* ---------- App state ---------- */

const state = {
  activity: null,
  questions: [],
  index: 0,
  correctCount: 0,
  answered: false,
};

/* ---------- DOM refs ---------- */

const screens = {
  home: document.getElementById("home"),
  explore: document.getElementById("explore"),
  rhymesong: document.getElementById("rhymesong"),
  quiz: document.getElementById("quiz"),
  results: document.getElementById("results"),
};
const scorePill = document.getElementById("scorePill");
const scoreText = document.getElementById("scoreText");
const progressFill = document.getElementById("progressFill");
const questionCount = document.getElementById("questionCount");
const quizPrompt = document.getElementById("quizPrompt");
const playSoundBtn = document.getElementById("playSoundBtn");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const resultsHeading = document.getElementById("resultsHeading");
const resultsSummary = document.getElementById("resultsSummary");
const retryBtn = document.getElementById("retryBtn");
const homeBtn = document.getElementById("homeBtn");

function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => { el.hidden = key !== name; });
}

/* ---------- Flow ---------- */

function startActivity(activity) {
  state.activity = activity;
  state.questions = Array.from({ length: QUESTIONS_PER_SESSION }, () => BUILDERS[activity]());
  state.index = 0;
  state.correctCount = 0;
  scorePill.hidden = false;
  updateScorePill();
  showScreen("quiz");
  renderQuestion();
}

function updateScorePill() {
  scoreText.textContent = `${state.correctCount} / ${state.index}`;
}

function currentQuestion() {
  return state.questions[state.index];
}

async function playCurrentAudio() {
  const q = currentQuestion();
  playSoundBtn.disabled = true;
  if (q.spellWord) {
    for (const letter of q.spellWord) {
      await speakLetter(letter, { pause: 120 });
    }
    await speakWord(q.spellWord);
  } else {
    await speakWord(q.playText);
  }
  playSoundBtn.disabled = false;
}

function renderQuestion() {
  state.answered = false;
  const q = currentQuestion();
  const total = state.questions.length;

  progressFill.style.width = `${(state.index / total) * 100}%`;
  questionCount.textContent = `${state.index + 1} / ${total}`;
  quizPrompt.textContent = q.prompt;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  nextBtn.hidden = true;

  choicesEl.innerHTML = "";
  q.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice.label;
    btn.addEventListener("click", () => handleAnswer(btn, choice));
    choicesEl.appendChild(btn);
  });

  playCurrentAudio();
}

function handleAnswer(btn, choice) {
  if (state.answered) return;
  state.answered = true;

  const buttons = [...choicesEl.querySelectorAll(".choice-btn")];
  buttons.forEach((b) => (b.disabled = true));

  if (choice.correct) {
    state.correctCount += 1;
    btn.classList.add("correct");
    feedbackEl.textContent = "Correct! 🎉";
    feedbackEl.className = "feedback correct";
  } else {
    btn.classList.add("incorrect");
    feedbackEl.textContent = "Not quite — listen again!";
    feedbackEl.className = "feedback incorrect";
    const correctBtn = buttons.find((b, i) => currentQuestion().choices[i].correct);
    if (correctBtn) correctBtn.classList.add("correct");
  }

  scoreText.textContent = `${state.correctCount} / ${state.index + 1}`;

  nextBtn.hidden = false;
  nextBtn.textContent = state.index + 1 >= state.questions.length ? "See Results →" : "Next →";
}

nextBtn.addEventListener("click", () => {
  state.index += 1;
  if (state.index >= state.questions.length) {
    finishSession();
  } else {
    renderQuestion();
  }
});

function finishSession() {
  const total = state.questions.length;
  const pct = Math.round((state.correctCount / total) * 100);
  resultsHeading.textContent =
    pct >= 80 ? "Great job! 🌟" : pct >= 50 ? "Nice work! 👍" : "Keep practicing! 💪";
  resultsSummary.textContent =
    `${ACTIVITY_TITLES[state.activity]}: you got ${state.correctCount} out of ${total} correct (${pct}%).`;
  scorePill.hidden = true;
  showScreen("results");
}

playSoundBtn.addEventListener("click", playCurrentAudio);

backBtn.addEventListener("click", () => {
  window.speechSynthesis.cancel();
  scorePill.hidden = true;
  showScreen("home");
});

retryBtn.addEventListener("click", () => startActivity(state.activity));
homeBtn.addEventListener("click", () => showScreen("home"));

document.querySelectorAll(".list-row").forEach((row) => {
  row.addEventListener("click", () => {
    const activity = row.dataset.activity;
    if (activity === "rhymesong") {
      openRhymeSong();
    } else {
      startActivity(activity);
    }
  });
});

/* ---------- Sound Explorer ---------- */

const exploreCta = document.getElementById("exploreCta");
const exploreBackBtn = document.getElementById("exploreBackBtn");
const wordInput = document.getElementById("wordInput");
const hearWordBtn = document.getElementById("hearWordBtn");
const wordLettersEl = document.getElementById("wordLetters");
const letterGridEl = document.getElementById("letterGrid");

exploreCta.addEventListener("click", () => {
  showScreen("explore");
  wordInput.focus();
});

exploreBackBtn.addEventListener("click", () => {
  window.speechSynthesis.cancel();
  showScreen("home");
});

// Build the tap-a-letter grid once
Object.keys(LETTER_SOUNDS).forEach((letter) => {
  const btn = document.createElement("button");
  btn.className = "letter-tile";
  btn.textContent = letter;
  btn.addEventListener("click", async () => {
    btn.classList.add("playing");
    await speakLetter(letter);
    btn.classList.remove("playing");
  });
  letterGridEl.appendChild(btn);
});

async function playWord(rawWord) {
  const word = rawWord.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return;

  wordLettersEl.innerHTML = "";
  const tiles = [...word].map((letter) => {
    const tile = document.createElement("span");
    tile.className = "word-letter-tile";
    tile.textContent = letter;
    wordLettersEl.appendChild(tile);
    return tile;
  });

  hearWordBtn.disabled = true;
  for (let i = 0; i < word.length; i++) {
    tiles[i].classList.add("active");
    await speakLetter(word[i], { pause: 120 });
    tiles[i].classList.remove("active");
  }
  tiles.forEach((t) => t.classList.add("active"));
  await speakWord(word);
  tiles.forEach((t) => t.classList.remove("active"));
  hearWordBtn.disabled = false;
}

hearWordBtn.addEventListener("click", () => playWord(wordInput.value));
wordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") playWord(wordInput.value);
});

/* ---------- Rhyme Song builder ---------- */

const songState = { family: WORD_FAMILIES[0], words: [] };

const songBackBtn = document.getElementById("songBackBtn");
const familyChipsEl = document.getElementById("familyChips");
const wordBankEl = document.getElementById("wordBank");
const songLineEl = document.getElementById("songLine");
const playSongBtn = document.getElementById("playSongBtn");
const clearSongBtn = document.getElementById("clearSongBtn");

function openRhymeSong() {
  songState.words = [];
  showScreen("rhymesong");
  renderFamilyChips();
  renderWordBank();
  renderSongLine();
}

function renderFamilyChips() {
  familyChipsEl.innerHTML = "";
  WORD_FAMILIES.forEach((family) => {
    const chip = document.createElement("button");
    chip.className = "family-chip" + (family === songState.family ? " active" : "");
    chip.textContent = family.label;
    chip.addEventListener("click", () => {
      songState.family = family;
      renderFamilyChips();
      renderWordBank();
    });
    familyChipsEl.appendChild(chip);
  });
}

function renderWordBank() {
  wordBankEl.innerHTML = "";
  songState.family.words.forEach((word) => {
    const tile = document.createElement("button");
    tile.className = "bank-tile";
    tile.textContent = word;
    tile.addEventListener("click", () => {
      speakWord(word);
      songState.words.push(word);
      renderSongLine();
    });
    wordBankEl.appendChild(tile);
  });
}

function renderSongLine() {
  songLineEl.innerHTML = "";
  if (songState.words.length === 0) {
    const empty = document.createElement("p");
    empty.className = "song-empty";
    empty.textContent = "Tap words above to build your song";
    songLineEl.appendChild(empty);
    return;
  }
  songState.words.forEach((word, i) => {
    const tile = document.createElement("button");
    tile.className = "song-tile";
    tile.textContent = word;
    tile.title = "Tap to remove";
    tile.addEventListener("click", () => {
      songState.words.splice(i, 1);
      renderSongLine();
    });
    songLineEl.appendChild(tile);
  });
}

async function playSong() {
  if (songState.words.length === 0) return;
  playSongBtn.disabled = true;
  const tiles = [...songLineEl.querySelectorAll(".song-tile")];
  for (let i = 0; i < songState.words.length; i++) {
    tiles[i]?.classList.add("singing");
    await speakWord(songState.words[i], {
      rate: i % 2 === 0 ? 1.15 : 0.88,
      pitch: i % 2 === 0 ? 1.25 : 0.9,
      pause: 220,
    });
    tiles[i]?.classList.remove("singing");
  }
  playSongBtn.disabled = false;
}

playSongBtn.addEventListener("click", playSong);
clearSongBtn.addEventListener("click", () => {
  songState.words = [];
  renderSongLine();
});
songBackBtn.addEventListener("click", () => {
  window.speechSynthesis.cancel();
  showScreen("home");
});

/* ---------- PWA install ---------- */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
