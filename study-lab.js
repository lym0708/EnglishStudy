const labConfigs = {
  "/phrases.html": {
    label: "Collocation Lab",
    title: "搭配训练台",
    intro: "搭配不是看懂就算会。你要能看到中文写英文，看到动词知道后面跟哪个介词。",
    mode: "phrase",
    primary: "遮中文背英文",
    secondary: "遮英文说中文",
    coach: [
      ["动词核心", "先抓动词：look, take, make, give。动词决定后面的介词和结构。"],
      ["介词锁定", "把介词当成搭配的一部分背，不要只背中文意思。"],
      ["输出标准", "能自己造一句，才算真正会用。"],
    ],
  },
  "/sentences.html": {
    label: "Sentence Lab",
    title: "句型输出台",
    intro: "短句页的目标不是收藏句子，而是形成语感。读、遮、复述、替换主语和动词。",
    mode: "sentence",
    primary: "听读跟读",
    secondary: "遮中文复述",
    coach: [
      ["读成块", "不要逐词念，把主语、谓语、宾语读成完整语块。"],
      ["替换训练", "I study every day 可以替换成 She works every day。"],
      ["作文迁移", "万能短句要能直接放进作文。"],
    ],
  },
  "/adverbs.html": {
    label: "Logic Lab",
    title: "副词逻辑台",
    intro: "副词和连接词是阅读、完形、作文的方向盘。看到 however 就要准备转折，看到 therefore 就找结果。",
    mode: "phrase",
    primary: "判断逻辑",
    secondary: "中英互背",
    coach: [
      ["频率", "always, usually, often, sometimes, never 表示动作频率。"],
      ["程度", "very, quite, extremely 改变形容词或副词强度。"],
      ["逻辑", "however 转折，therefore 结果，besides 递进。"],
    ],
  },
  "/grammar.html": {
    label: "Grammar Lab",
    title: "语法结构台",
    intro: "语法不要整页背。每次只拿一个结构：看公式、读例句、自己造句。",
    mode: "grammar",
    primary: "看口诀说结构",
    secondary: "看例句判规则",
    coach: [
      ["先找谓语", "任何句子先找动词，再判断时态、语态、主谓一致。"],
      ["看空前后", "选择题不要凭感觉，先看空格前后结构。"],
      ["造句验收", "一个语法点至少自己造 3 句。"],
    ],
  },
  "/cloze.html": {
    label: "Cloze Lab",
    title: "完形判断台",
    intro: "完形不是翻译题。先判断空格考搭配、语法还是逻辑，再看选项。",
    mode: "cloze",
    primary: "语境判断",
    secondary: "搭配复盘",
    coach: [
      ["搭配优先", "看到介词空，先想固定搭配。"],
      ["逻辑词", "前后句相反用 however/but，因果用 because/so/therefore。"],
      ["动词形式", "介词后 doing，情态动词后原形。"],
    ],
  },
  "/tenses.html": {
    label: "Tense Lab",
    title: "时态诊断台",
    intro: "16 个时态不用平均用力。先会一般现在、一般过去、现在完成、现在进行，再识别其他形式。",
    mode: "tense",
    primary: "看句子判时态",
    secondary: "看结构造句",
    coach: [
      ["时间", "先看 yesterday, now, tomorrow, since, for。"],
      ["状态", "一般是常态，进行是正在，完成是已经，完成进行是一直。"],
      ["结构", "看助动词组合：be doing, have done, will do。"],
    ],
  },
};

const clozeQuestions = [
  {
    stem: "I am interested ___ learning English.",
    answer: "in",
    reason: "be interested in 是固定搭配。",
  },
  {
    stem: "She finished ___ her homework before dinner.",
    answer: "doing",
    reason: "finish 后面接 doing。",
  },
  {
    stem: "He was tired, ___ he kept studying.",
    answer: "but",
    reason: "前后意思转折，用 but/however。",
  },
  {
    stem: "The result depends ___ your effort.",
    answer: "on",
    reason: "depend on 表示取决于/依靠。",
  },
  {
    stem: "We should pay attention ___ pronunciation.",
    answer: "to",
    reason: "pay attention to 是固定搭配。",
  },
  {
    stem: "She is good ___ solving problems.",
    answer: "at",
    reason: "be good at doing 表示擅长做。",
  },
  {
    stem: "The meeting was put ___ because of the rain.",
    answer: "off",
    reason: "put off 表示推迟。",
  },
  {
    stem: "He gave ___ smoking last year.",
    answer: "up",
    reason: "give up doing 表示放弃做。",
  },
  {
    stem: "I look forward to ___ from you.",
    answer: "hearing",
    reason: "look forward to 后接 doing。",
  },
  {
    stem: "The book is worth ___.",
    answer: "reading",
    reason: "be worth doing 表示值得做。",
  },
  {
    stem: "___ he is young, he knows a lot.",
    answer: "Although",
    reason: "前后有让步关系，用 although/though。",
  },
  {
    stem: "Study hard, ___ you will make progress.",
    answer: "and",
    reason: "祈使句 + and + 结果。",
  },
  {
    stem: "Hurry up, ___ you will miss the bus.",
    answer: "or",
    reason: "祈使句 + or + 否则。",
  },
  {
    stem: "The number of students ___ increasing.",
    answer: "is",
    reason: "the number of 作主语，谓语用单数。",
  },
  {
    stem: "A number of students ___ absent today.",
    answer: "are",
    reason: "a number of 表许多，谓语用复数。",
  },
];

const tenseQuestions = [
  ["I study English every day.", "一般现在时", "every day 表习惯，动词用原形/三单。"],
  ["She is reading now.", "现在进行时", "now 表正在，结构是 be doing。"],
  ["They have finished the work.", "现在完成时", "have/has done 表完成并有影响。"],
  ["I was watching TV at eight yesterday.", "过去进行时", "过去某时正在做，结构 was/were doing。"],
  ["He will come tomorrow.", "一般将来时", "tomorrow 表将来，结构 will do。"],
  ["Water boils at 100 degrees.", "一般现在时", "客观事实用一般现在时。"],
  ["I met my teacher yesterday.", "一般过去时", "yesterday 是明确过去时间。"],
  ["They were playing football at five yesterday.", "过去进行时", "过去某时正在做，was/were doing。"],
  ["He had finished the work before I arrived.", "过去完成时", "before I arrived 表过去的过去。"],
  ["We have lived here for ten years.", "现在完成时", "for ten years 表从过去延续到现在。"],
  ["I have been learning English since 2024.", "现在完成进行时", "since 表从过去开始一直持续。"],
  ["The problem was solved yesterday.", "一般过去时被动", "was/were done 表过去被动。"],
  ["The room is cleaned every day.", "一般现在时被动", "am/is/are done 表现在被动。"],
  ["The bridge will be built next year.", "一般将来时被动", "will be done 表将来被动。"],
  ["At this time tomorrow, I will be taking an exam.", "将来进行时", "将来某时正在做，will be doing。"],
  ["By next month, I will have finished the course.", "将来完成时", "by next month 表到将来某时已经完成。"],
];

function labPath() {
  const path = window.location.pathname;
  return path.endsWith("/") ? "/index.html" : path;
}

function splitEntry(text) {
  const raw = String(text || "").replace(/\s+/g, " ").trim();
  const firstChinese = raw.search(/[\u3400-\u9fff]/);
  if (firstChinese <= 0) return null;
  return {
    english: raw.slice(0, firstChinese).trim(),
    chinese: raw.slice(firstChinese).trim(),
  };
}

function collectEntries(config) {
  if (config.mode === "grammar") {
    return Array.from(document.querySelectorAll(".card"))
      .map((card) => ({
        english: card.querySelector("h2")?.textContent.trim() || "语法点",
        chinese: card.querySelector(".verse")?.textContent.trim() || card.querySelector("p")?.textContent.trim() || "",
      }))
      .filter((entry) => entry.chinese);
  }

  return Array.from(document.querySelectorAll(".phrase-list span, .memory-row span"))
    .map((node) => splitEntry(node.textContent))
    .filter(Boolean);
}

function speakLabText(text) {
  if (!text || !window.speechSynthesis) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  utterance.voice = voices.find((voice) => voice.lang === "en-GB") || voices.find((voice) => voice.lang.toLowerCase().startsWith("en-gb")) || voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) || null;
  utterance.lang = utterance.voice?.lang || "en-GB";
  utterance.rate = 0.84;
  speechSynthesis.speak(utterance);
}

function storageKey(config) {
  return `englishStudyLab:${labPath()}:${config.mode}`;
}

function readMastered(config) {
  try {
    return new Set(JSON.parse(localStorage.getItem(storageKey(config)) || "[]"));
  } catch {
    return new Set();
  }
}

function writeMastered(config, mastered) {
  localStorage.setItem(storageKey(config), JSON.stringify([...mastered].slice(0, 500)));
}

function buildProfessorCards(config) {
  return config.coach.map(([title, body]) => `
    <article class="professor-card">
      <span>${title}</span>
      <p>${body}</p>
    </article>
  `).join("");
}

function buildLabShell(config, entries) {
  const head = document.querySelector(".page-head");
  if (!head || document.querySelector(".study-lab")) return null;

  const section = document.createElement("section");
  section.className = "study-lab";
  section.innerHTML = `
    <div class="lab-header">
      <div>
        <p class="eyebrow">${config.label}</p>
        <h2>${config.title}</h2>
        <p>${config.intro}</p>
      </div>
      <div class="lab-stat">
        <span>训练素材</span>
        <strong>${entries.length || config.mode === "cloze" ? entries.length || clozeQuestions.length : tenseQuestions.length}</strong>
      </div>
    </div>
    <div class="professor-grid">${buildProfessorCards(config)}</div>
    <div class="lab-trainer">
      <div class="trainer-main">
        <span id="labMode">${config.primary}</span>
        <strong id="labPrompt">准备训练</strong>
        <p id="labAnswer">点击“抽一题”开始。</p>
      </div>
      <div class="trainer-actions">
        <button id="labNext" type="button">抽一题</button>
        <button id="labReveal" type="button">显示答案</button>
        <button id="labSpeak" type="button">读英文</button>
        <button id="labMaster" type="button">已掌握</button>
      </div>
      <p class="lab-feedback" id="labFeedback">教授建议：每题先自己说，再点答案。</p>
    </div>
  `;
  head.after(section);
  return section;
}

function createQuestion(config, entries) {
  if (config.mode === "cloze") {
    const item = clozeQuestions[Math.floor(Math.random() * clozeQuestions.length)];
    return {
      id: item.stem,
      prompt: item.stem,
      answer: `${item.answer}。${item.reason}`,
      speak: item.stem.replace("___", item.answer),
    };
  }

  if (config.mode === "tense") {
    const [sentence, tense, reason] = tenseQuestions[Math.floor(Math.random() * tenseQuestions.length)];
    return {
      id: sentence,
      prompt: sentence,
      answer: `${tense}。${reason}`,
      speak: sentence,
    };
  }

  const item = entries[Math.floor(Math.random() * entries.length)];
  if (!item) return null;
  const reverse = Math.random() > 0.5;
  return {
    id: `${item.english}|${item.chinese}`,
    prompt: reverse ? item.chinese : item.english,
    answer: reverse ? item.english : item.chinese,
    speak: item.english,
  };
}

function initTrainer(config, entries) {
  const shell = buildLabShell(config, entries);
  if (!shell) return;

  const mastered = readMastered(config);
  let current = null;
  const prompt = shell.querySelector("#labPrompt");
  const answer = shell.querySelector("#labAnswer");
  const feedback = shell.querySelector("#labFeedback");
  const mode = shell.querySelector("#labMode");

  function next() {
    current = createQuestion(config, entries);
    if (!current) return;
    prompt.textContent = current.prompt;
    answer.textContent = "先自己回答，再点显示答案。";
    mode.textContent = Math.random() > 0.5 ? config.primary : config.secondary;
    feedback.textContent = `已掌握 ${mastered.size} 项。`;
  }

  shell.querySelector("#labNext").addEventListener("click", next);
  shell.querySelector("#labReveal").addEventListener("click", () => {
    if (!current) next();
    if (current) answer.textContent = current.answer;
  });
  shell.querySelector("#labSpeak").addEventListener("click", () => {
    if (!current) next();
    if (current) speakLabText(current.speak);
  });
  shell.querySelector("#labMaster").addEventListener("click", () => {
    if (!current) return;
    mastered.add(current.id);
    writeMastered(config, mastered);
    feedback.textContent = `已记录掌握：${mastered.size} 项。继续下一题。`;
    next();
  });

  next();
}

function enhanceContentFilter() {
  const items = Array.from(document.querySelectorAll(".phrase-list span, .memory-row span"));
  if (!items.length || document.querySelector(".content-filter")) return;

  const host = document.querySelector(".study-lab") || document.querySelector(".page-head");
  const filter = document.createElement("section");
  filter.className = "content-filter";
  filter.innerHTML = `
    <div>
      <span>当前页面素材</span>
      <strong id="contentVisibleCount">${items.length}</strong>
      <em>/ ${items.length}</em>
    </div>
    <input id="contentSearch" type="search" placeholder="搜索英文或中文，例如 depend / 依靠 / therefore">
    <button id="contentClear" type="button">清空</button>
  `;
  host.after(filter);

  const input = filter.querySelector("#contentSearch");
  const clear = filter.querySelector("#contentClear");
  const count = filter.querySelector("#contentVisibleCount");

  function normalize(text) {
    return String(text || "").toLowerCase().replace(/[^\p{L}\p{N}\u3400-\u9fff]+/gu, "");
  }

  function refresh() {
    const keyword = normalize(input.value);
    let visible = 0;

    items.forEach((item) => {
      const matched = !keyword || normalize(item.textContent).includes(keyword);
      item.hidden = !matched;
      if (matched) visible += 1;
    });

    document.querySelectorAll(".card, .band").forEach((section) => {
      const sectionItems = Array.from(section.querySelectorAll(".phrase-list span, .memory-row span"));
      if (!sectionItems.length) return;
      section.hidden = keyword && sectionItems.every((item) => item.hidden);
    });

    count.textContent = visible;
  }

  input.addEventListener("input", refresh);
  clear.addEventListener("click", () => {
    input.value = "";
    refresh();
    input.focus();
  });
}

const currentConfig = labConfigs[labPath()];
if (currentConfig) {
  initTrainer(currentConfig, collectEntries(currentConfig));
  enhanceContentFilter();
}
