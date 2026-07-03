const sources = [
  { key: "words", label: "单词", url: "words.html", selector: ".word-grid > span, .family-card li" },
  { key: "phrases", label: "固定搭配", url: "phrases.html", selector: ".phrase-list span" },
  { key: "phrases", label: "完形搭配", url: "cloze.html", selector: ".phrase-list span" },
  { key: "sentences", label: "短句", url: "sentences.html", selector: ".phrase-list span" },
  { key: "adverbs", label: "副词", url: "adverbs.html", selector: ".phrase-list span" },
];

const fallbackEntries = [
  { english: "important", chinese: "重要的", source: "单词", bank: "words" },
  { english: "improve", chinese: "提高，改善", source: "单词", bank: "words" },
  { english: "depend on", chinese: "依靠，取决于", source: "固定搭配", bank: "phrases" },
  { english: "as a result", chinese: "结果，因此", source: "固定搭配", bank: "phrases" },
  { english: "I study English every day.", chinese: "我每天学习英语。", source: "短句", bank: "sentences" },
  { english: "however", chinese: "然而", source: "副词", bank: "adverbs" },
];

const els = {
  mode: document.querySelector("#modeSelect"),
  bank: document.querySelector("#bankSelect"),
  voice: document.querySelector("#voiceSelect"),
  speak: document.querySelector("#speakBtn"),
  next: document.querySelector("#nextBtn"),
  check: document.querySelector("#checkBtn"),
  show: document.querySelector("#showBtn"),
  mark: document.querySelector("#markBtn"),
  clearWrong: document.querySelector("#clearWrongBtn"),
  total: document.querySelector("#totalCount"),
  done: document.querySelector("#doneCount"),
  correct: document.querySelector("#correctCount"),
  wrong: document.querySelector("#wrongCount"),
  source: document.querySelector("#sourceTag"),
  progress: document.querySelector("#progressTag"),
  questionLabel: document.querySelector("#questionLabel"),
  answerLabel: document.querySelector("#answerLabel"),
  prompt: document.querySelector("#promptText"),
  hint: document.querySelector("#hintText"),
  answer: document.querySelector("#answerInput"),
  feedback: document.querySelector("#feedback"),
  wrongList: document.querySelector("#wrongList"),
};

let allEntries = [];
let currentPool = [];
let current = null;
let queue = [];
let stats = { done: 0, correct: 0, wrong: 0 };
let voices = [];
let answerState = "idle";
let submitLocked = false;
let autoNextTimer = null;
let questionNumber = 0;
let currentScored = false;
let currentHadWrong = false;
const groupPracticeKey = "englishStudyPracticeGroup";

function getWrongItems() {
  try {
    return JSON.parse(localStorage.getItem("englishStudyWrongItems") || "[]");
  } catch {
    return [];
  }
}

function setWrongItems(items) {
  localStorage.setItem("englishStudyWrongItems", JSON.stringify(items.slice(0, 300)));
}

function getPracticeGroup() {
  try {
    const group = JSON.parse(localStorage.getItem(groupPracticeKey) || "null");
    if (!group?.entries?.length) return null;
    return group;
  } catch {
    return null;
  }
}

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[.,!?;:'"()，。！？；：“”‘’（）]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeChinese(text) {
  return String(text || "")
    .replace(/[.,!?;:'"()，。！？；：“”‘’（）\s]/g, "")
    .trim();
}

function hasChinese(text) {
  return /[\u3400-\u9fff]/.test(text);
}

function parseText(rawText, source) {
  const raw = rawText.replace(/\s+/g, " ").trim();
  if (!raw || !hasChinese(raw)) return [];

  return raw
    .split(" / ")
    .map((part) => part.trim())
    .map((part) => {
      const firstChinese = part.search(/[\u3400-\u9fff]/);
      if (firstChinese <= 0) return null;
      const english = part.slice(0, firstChinese).trim();
      const chinese = part.slice(firstChinese).trim();
      if (!english || !chinese) return null;
      return {
        english,
        chinese,
        source: source.label,
        bank: source.key,
        id: `${source.key}:${english.toLowerCase()}:${chinese}`,
      };
    })
    .filter(Boolean);
}

async function loadEntries() {
  const loaded = [];

  for (const source of sources) {
    try {
      const response = await fetch(source.url);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      doc.querySelectorAll(source.selector).forEach((node) => {
        loaded.push(...parseText(node.textContent, source));
      });
    } catch {
      // Keep loading other sources; fallback entries are added below if needed.
    }
  }

  const seen = new Set();
  allEntries = (loaded.length ? loaded : fallbackEntries).filter((entry) => {
    const key = `${entry.english.toLowerCase()}|${entry.chinese}|${entry.bank}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const group = getPracticeGroup();
  if (group) {
    const existingOption = els.bank.querySelector('option[value="group"]');
    if (!existingOption) {
      const option = document.createElement("option");
      option.value = "group";
      option.textContent = `本组单词：${group.title}`;
      els.bank.prepend(option);
    }
    const groupEntries = group.entries.map((entry) => ({
      english: entry.english,
      chinese: entry.chinese,
      source: group.title || "本组单词",
      bank: "group",
      id: entry.id || `group:${entry.english.toLowerCase()}:${entry.chinese}`,
    }));
    allEntries = [...groupEntries, ...allEntries];
    els.bank.value = "group";
  }
}

function updateVoices() {
  voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  const selected = els.voice.value;
  els.voice.innerHTML = '<option value="">固定英式发音</option>';

  voices
    .filter((voice) => voice.lang.toLowerCase().startsWith("en"))
    .forEach((voice) => {
      const option = document.createElement("option");
      option.value = voice.name;
      option.textContent = `${voice.name} (${voice.lang})`;
      els.voice.append(option);
    });

  els.voice.value = selected;
}

function speak(text = current?.english) {
  if (!text || !window.speechSynthesis) {
    els.feedback.textContent = "这个浏览器暂时不支持发音。";
    els.feedback.className = "feedback warn";
    return;
  }

  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const selectedVoice = voices.find((voice) => voice.name === els.voice.value);
  utterance.lang = selectedVoice?.lang || "en-GB";
  utterance.voice = selectedVoice || voices.find((voice) => voice.lang === "en-GB") || voices.find((voice) => voice.lang.toLowerCase().startsWith("en-gb")) || voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) || null;
  utterance.rate = 0.82;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
}

function buildPool() {
  clearAutoNext();
  const wrongItems = getWrongItems();

  if (els.mode.value === "wrong") {
    currentPool = wrongItems.map((item) => ({ ...item, source: item.source || "错题", bank: item.bank || "wrong" }));
  } else if (els.bank.value === "all") {
    currentPool = [...allEntries];
  } else {
    currentPool = allEntries.filter((entry) => entry.bank === els.bank.value);
  }

  queue = shuffle([...currentPool]);
  questionNumber = 0;
  els.total.textContent = currentPool.length;
  els.wrong.textContent = wrongItems.length;
  renderWrongList();
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function modeLabel() {
  const labels = {
    "en-cn": "看英语写中文",
    "cn-en": "看中文写英语",
    dictation: "听音默写英语",
    wrong: "只练错题",
  };
  return labels[els.mode.value] || "练习";
}

function bankLabel(entry = current) {
  if (entry?.bank === "group") return entry.source || "本组单词";
  const labels = {
    words: "单词",
    phrases: "固定搭配",
    sentences: "短句",
    adverbs: "副词",
    wrong: "错题",
  };
  return labels[entry?.bank] || entry?.source || "题目";
}

function clearAutoNext() {
  if (autoNextTimer) {
    window.clearTimeout(autoNextTimer);
    autoNextTimer = null;
  }
}

function lockSubmit(ms = 500) {
  submitLocked = true;
  updateActionButtons();
  window.setTimeout(() => {
    submitLocked = false;
    updateActionButtons();
  }, ms);
}

function updateActionButtons() {
  els.check.disabled = submitLocked || !currentPool.length;
  els.next.disabled = submitLocked || !currentPool.length;
  els.next.hidden = answerState === "idle" || answerState === "correct";
  els.show.hidden = answerState === "correct" || answerState === "complete" || !current;
  els.mark.hidden = answerState !== "wrong";

  if (answerState === "correct") {
    els.check.textContent = "下一题";
    els.next.textContent = "下一题";
  } else if (answerState === "wrong") {
    els.check.textContent = "再试一次";
    els.next.textContent = "下一题";
  } else if (answerState === "complete") {
    els.check.textContent = "重新练习";
    els.next.textContent = "查看错题";
  } else {
    els.check.textContent = "提交答案";
    els.next.textContent = "下一题";
  }
}

function setFeedback(type, html) {
  els.feedback.innerHTML = html;
  els.feedback.className = `feedback ${type}`;
}

function nextQuestion() {
  clearAutoNext();
  if (!currentPool.length) {
    answerState = "idle";
    current = null;
    els.prompt.textContent = els.mode.value === "wrong" ? "错题本现在是空的。" : "这个题库还没有内容。";
    els.hint.textContent = "";
    els.source.textContent = "无题目";
    els.questionLabel.textContent = "题目";
    els.answerLabel.textContent = "你的答案";
    els.progress.textContent = "0 / 0";
    els.answer.value = "";
    updateActionButtons();
    return;
  }

  if (!queue.length) {
    showCompletion();
    return;
  }

  current = queue.pop();
  questionNumber += 1;
  answerState = "idle";
  currentScored = false;
  currentHadWrong = false;
  els.answer.disabled = false;
  els.answer.value = "";
  els.feedback.textContent = "";
  els.feedback.className = "feedback";
  els.source.textContent = `${bankLabel(current)} ｜ ${modeLabel()}`;
  els.progress.textContent = `第 ${questionNumber} 题 / 共 ${currentPool.length} 题`;

  if (els.mode.value === "cn-en") {
    els.prompt.textContent = current.chinese;
    els.questionLabel.textContent = `题目：中文释义（${bankLabel(current)}）`;
    els.answerLabel.textContent = "你的答案：写英文";
    els.hint.textContent = "请根据中文写出英文，单词、短语和句子都按英文原文写。";
  } else if (els.mode.value === "dictation") {
    els.prompt.textContent = "听发音，默写英文";
    els.questionLabel.textContent = `题目：听音（${bankLabel(current)}）`;
    els.answerLabel.textContent = "你的答案：默写英文";
    els.hint.textContent = "可以反复点“播放发音”，听到什么就写什么。";
    window.setTimeout(() => speak(current.english), 250);
  } else if (els.mode.value === "wrong") {
    els.prompt.textContent = current.chinese;
    els.questionLabel.textContent = `题目：错题中文释义（${bankLabel(current)}）`;
    els.answerLabel.textContent = "你的答案：写英文";
    els.hint.textContent = "错题复练：根据中文写英文，答对会从错题本移除。";
  } else {
    els.prompt.textContent = current.english;
    els.questionLabel.textContent = `题目：英文（${bankLabel(current)}）`;
    els.answerLabel.textContent = "你的答案：写中文意思";
    els.hint.textContent = "请写中文意思。比如 new 可以写“新的”。";
  }

  updateActionButtons();
  els.answer.focus();
  window.setTimeout(() => speak(current.english), 180);
}

function checkAnswer() {
  if (!current) return;

  if (answerState === "complete") {
    resetAndStart();
    return;
  }

  if (answerState === "correct") {
    nextQuestion();
    return;
  }

  if (submitLocked) return;

  if (answerState === "wrong") {
    answerState = "idle";
    els.answer.value = "";
    els.feedback.textContent = "";
    els.feedback.className = "feedback";
    updateActionButtons();
    els.answer.focus();
    return;
  }

  const userAnswer = els.answer.value.trim();
  if (!userAnswer) {
    setFeedback("warn", "先写答案，再提交。");
    return;
  }

  lockSubmit(500);

  const mode = els.mode.value;
  const expectedEnglish = normalize(current.english);
  const expectedChinese = normalizeChinese(current.chinese);
  const userEnglish = normalize(userAnswer);
  const userChinese = normalizeChinese(userAnswer);
  const correct =
    mode === "en-cn"
      ? expectedChinese.includes(userChinese) || userChinese.includes(expectedChinese)
      : userEnglish === expectedEnglish || expectedEnglish.split(" / ").includes(userEnglish);

  if (!currentScored) {
    stats.done += 1;
    currentScored = true;
  }
  if (correct) {
    if (!currentHadWrong) stats.correct += 1;
    answerState = "correct";
    setFeedback("good", `<strong>回答正确。</strong> ${current.english} = ${current.chinese}`);
    if (!currentHadWrong) removeWrong(current);
    updateStats();
    updateActionButtons();
    autoNextTimer = window.setTimeout(() => {
      autoNextTimer = null;
      nextQuestion();
    }, 800);
  } else {
    if (!currentHadWrong) stats.wrong += 1;
    currentHadWrong = true;
    answerState = "wrong";
    setFeedback("bad", `<strong>回答错误。</strong> 正确答案：${current.english} = ${current.chinese}`);
    saveWrong(current, userAnswer, mode);
    updateStats();
    updateActionButtons();
  }
}

function saveWrong(entry, answer = "", mode = els.mode.value) {
  const items = getWrongItems();
  const existing = items.find((item) => item.id === entry.id);
  if (existing) {
    existing.times = (existing.times || 1) + 1;
    existing.answer = answer;
    existing.mode = mode;
    existing.lastAt = new Date().toISOString();
  } else {
    items.unshift({
      id: entry.id,
      english: entry.english,
      chinese: entry.chinese,
      source: entry.source,
      bank: entry.bank,
      answer,
      mode,
      times: 1,
      lastAt: new Date().toISOString(),
    });
  }
  setWrongItems(items);
  els.wrong.textContent = getWrongItems().length;
  renderWrongList();
}

function removeWrong(entry) {
  const items = getWrongItems().filter((item) => item.id !== entry.id);
  setWrongItems(items);
  els.wrong.textContent = items.length;
  renderWrongList();
}

function showAnswer() {
  if (!current) return;
  clearAutoNext();
  answerState = answerState === "correct" ? "correct" : "wrong";
  setFeedback("warn", `<strong>正确答案：</strong>${current.english} = ${current.chinese}`);
  updateActionButtons();
}

function updateStats() {
  els.done.textContent = stats.done;
  els.correct.textContent = stats.correct;
  els.wrong.textContent = getWrongItems().length;
}

function showCompletion() {
  clearAutoNext();
  answerState = "complete";
  current = null;
  const total = currentPool.length;
  const wrongCount = stats.wrong;
  const rate = stats.done ? Math.round((stats.correct / stats.done) * 100) : 0;

  els.source.textContent = "练习完成";
  els.progress.textContent = `${stats.done} / ${total}`;
  els.questionLabel.textContent = "完成";
  els.prompt.innerHTML = `
    <div class="complete-title">本组练习完成</div>
    <div class="complete-stats">
      <span><b>${total}</b>总题数</span>
      <span><b>${stats.correct}</b>正确数</span>
      <span><b>${wrongCount}</b>错误数</span>
      <span><b>${rate}%</b>正确率</span>
    </div>
  `;
  els.hint.textContent = "可以重新练习这一组，也可以去错题本复盘刚才做错的题。";
  els.answer.value = "";
  els.answerLabel.textContent = "练习结果";
  els.answer.disabled = true;
  setFeedback("good", "练习完成。继续保持这个节奏。");
  updateActionButtons();
  els.check.textContent = "重新练习";
  els.next.textContent = "查看错题";
}

function renderWrongList() {
  const items = getWrongItems();
  els.wrongList.innerHTML = "";

  if (!items.length) {
    els.wrongList.innerHTML = '<p class="muted-text">还没有错题。做错后会自动出现在这里。</p>';
    return;
  }

  items.slice(0, 80).forEach((item) => {
    const row = document.createElement("div");
    row.className = "wrong-item";
    row.innerHTML = `
      <div>
        <strong>${item.english}</strong>
        <span>${item.chinese}</span>
      </div>
      <button type="button" aria-label="播放 ${item.english}">播放</button>
    `;
    row.querySelector("button").addEventListener("click", () => speak(item.english));
    els.wrongList.append(row);
  });
}

function resetAndStart() {
  clearAutoNext();
  stats = { done: 0, correct: 0, wrong: 0 };
  current = null;
  answerState = "idle";
  submitLocked = false;
  currentScored = false;
  currentHadWrong = false;
  els.answer.disabled = false;
  buildPool();
  updateStats();
  nextQuestion();
}

function applyInitialPracticeParams() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  if (mode && Array.from(els.mode.options).some((option) => option.value === mode)) {
    els.mode.value = mode;
  }
}

els.mode.addEventListener("change", resetAndStart);
els.bank.addEventListener("change", resetAndStart);
els.speak.addEventListener("click", () => speak());
els.next.addEventListener("click", () => {
  if (answerState === "complete") {
    document.querySelector(".band")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  nextQuestion();
});
els.check.addEventListener("click", checkAnswer);
els.show.addEventListener("click", showAnswer);
els.mark.addEventListener("click", () => {
  if (!current) return;
  saveWrong(current, "手动加入", els.mode.value);
  setFeedback("warn", "已加入错题本。");
  updateActionButtons();
});
els.clearWrong.addEventListener("click", () => {
  setWrongItems([]);
  updateStats();
  buildPool();
});
els.answer.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    checkAnswer();
  }
});

if (window.speechSynthesis) {
  updateVoices();
  speechSynthesis.onvoiceschanged = updateVoices;
}

loadEntries().then(() => {
  applyInitialPracticeParams();
  resetAndStart();
});
