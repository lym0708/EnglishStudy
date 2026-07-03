const navIcons = {
  "index.html": "⌂",
  "study.html": "◫",
  "exercises.html": "✎",
  "words.html": "Aa",
  "practice.html": "✎",
  "phrases.html": "≋",
  "sentences.html": "¶",
  "adverbs.html": "↯",
  "grammar.html": "◇",
  "cloze.html": "▣",
  "tenses.html": "◷",
  "ai.html": "AI",
  "my.html": "ME",
};

const navigationModel = [
  { label: "首页", href: "index.html", icon: "⌂" },
  { label: "学习", href: "study.html", icon: "◫" },
  { label: "练习", href: "exercises.html", icon: "✎" },
  { label: "AI老师", href: "ai.html", icon: "AI" },
  { label: "我的", href: "my.html", icon: "ME" },
];

const pageMeta = {
  "/": { label: "首页", desc: "从今日目标开始，按学习路径推进。" },
  "/index.html": { label: "首页", desc: "从今日目标开始，按学习路径推进。" },
  "/study.html": { label: "学习", desc: "单词、搭配、短句、副词、语法和时态的学习入口。" },
  "/exercises.html": { label: "练习", desc: "单词练习、完形训练和错题复盘入口。" },
  "/words.html": { label: "词汇资产", desc: "按主题沉淀单词、音标、词性、搭配和变化。" },
  "/practice.html": { label: "智能训练", desc: "默写、听写、英汉互译、错题复练。" },
  "/must.html": { label: "今日任务", desc: "把当天应该完成的任务拆成可执行清单。" },
  "/phrases.html": { label: "固定搭配", desc: "考试高频搭配和动词结构集中背诵。" },
  "/sentences.html": { label: "短句语料", desc: "把词放进句子里，提升阅读和写作反应。" },
  "/adverbs.html": { label: "副词连接", desc: "掌握频率、程度、逻辑和时间表达。" },
  "/grammar.html": { label: "语法体系", desc: "用结构化方式记住考试核心语法。" },
  "/cloze.html": { label: "完形填空", desc: "用搭配和语境训练选择题判断。" },
  "/tenses.html": { label: "16 大时态", desc: "把时态结构和信号词一次梳理清楚。" },
  "/ai.html": { label: "AI老师", desc: "把不会的单词、句子和语法变成可追问的问题。" },
  "/my.html": { label: "我的学习", desc: "查看收藏、掌握、错题和每日进度。" },
};

const sectionPathMap = {
  "/": "index.html",
  "/index.html": "index.html",
  "/must.html": "index.html",
  "/study.html": "study.html",
  "/words.html": "study.html",
  "/phrases.html": "study.html",
  "/sentences.html": "study.html",
  "/adverbs.html": "study.html",
  "/grammar.html": "study.html",
  "/tenses.html": "study.html",
  "/exercises.html": "exercises.html",
  "/practice.html": "exercises.html",
  "/cloze.html": "exercises.html",
  "/ai.html": "ai.html",
  "/my.html": "my.html",
};

function currentPath() {
  const path = window.location.pathname;
  return path.endsWith("/") ? "/" : path;
}

function daysUntilDecember() {
  const now = new Date();
  const target = new Date(now.getFullYear(), 11, 1);
  const ms = target.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.max(0, Math.ceil(ms / 86400000));
}

function hrefToPath(href) {
  return `/${href.split("?")[0]}`;
}

function isActiveHref(href, path = currentPath()) {
  const target = hrefToPath(href);
  return path === target || (path === "/" && target === "/index.html");
}

function renderNavigation(nav, path) {
  nav.innerHTML = navigationModel.map((item) => {
    const sectionHref = sectionPathMap[path] || "index.html";
    const parentActive = item.href === sectionHref;
    const parentClass = parentActive ? "nav-parent active" : "nav-parent";
    return `
      <div class="nav-group">
        <a class="${parentClass}" href="${item.href}" data-icon="${item.icon}">${item.label}</a>
      </div>
    `;
  }).join("");
}

function enhanceNavigation() {
  const header = document.querySelector(".topbar");
  const nav = document.querySelector(".nav");
  if (!header || !nav) return;

  const path = currentPath();
  const meta = pageMeta[path] || pageMeta["/index.html"];
  header.classList.add("app-topbar");
  renderNavigation(nav, path);

  document.querySelectorAll(".nav a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const key = href.split("?")[0];
    link.dataset.icon = navIcons[key] || "•";
    if (sectionPathMap[path] === key || path.endsWith(`/${key}`) || (path === "/" && key === "index.html")) {
      link.classList.add("active");
    }
  });

  const toggle = document.createElement("button");
  toggle.className = "nav-toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-label", "打开导航");
  toggle.textContent = "☰";

  const status = document.createElement("div");
  status.className = "app-status";
  status.innerHTML = `
    <span class="status-page">${meta.label}</span>
    <span class="status-divider"></span>
    <span>${daysUntilDecember()} 天到 12 月冲刺期</span>
  `;

  header.prepend(toggle);
  header.append(status);

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("nav-open");
  });

  nav.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
  });
}

function todayMissionStats() {
  const ids = ["words", "phrases", "grammar", "sentences", "wrong"];
  const today = new Date().toISOString().slice(0, 10);
  let state = {};
  try {
    state = JSON.parse(localStorage.getItem(`englishStudyDailyMission:${today}`) || "{}");
  } catch {
    state = {};
  }
  const completed = ids.filter((id) => state[id]).length;
  const percent = Math.round((completed / ids.length) * 100);
  let streak = 0;
  for (let offset = 0; offset < 365; offset += 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const key = `englishStudyDailyMission:${date.toISOString().slice(0, 10)}`;
    let dayState = {};
    try {
      dayState = JSON.parse(localStorage.getItem(key) || "{}");
    } catch {
      dayState = {};
    }
    if (ids.some((id) => dayState[id])) streak += 1;
    else if (offset > 0) break;
  }
  return { completed, total: ids.length, percent, streak };
}

function enhanceHomeMissionCard() {
  if (currentPath() !== "/" && currentPath() !== "/index.html") return;
  const head = document.querySelector(".page-head");
  if (!head || document.querySelector(".home-mission-card")) return;
  const stats = todayMissionStats();
  const card = document.createElement("section");
  card.className = "home-mission-card";
  card.innerHTML = `
    <div class="mission-copy">
      <span>今日目标</span>
      <strong>单词 40 个 + 搭配 10 个 + 语法 1 点 + 短句 10 个 + 错题复盘</strong>
      <p>先完成今天，再谈扩展。路径是：首页看目标，单词和语法打底，练习里默写检查。</p>
      <a class="mission-start-btn" href="study.html">开始学习</a>
    </div>
    <div class="mission-metrics">
      <div><span>已完成</span><strong>${stats.completed}/${stats.total}</strong></div>
      <div><span>学习进度</span><strong>${stats.percent}%</strong></div>
      <div><span>连续学习</span><strong>${stats.streak} 天</strong></div>
    </div>
    <div class="mission-progress-line"><span style="width:${stats.percent}%"></span></div>
  `;
  head.after(card);
}

function enhancePageHead() {
  const head = document.querySelector(".page-head");
  if (!head || head.dataset.enhanced) return;
  head.dataset.enhanced = "true";

  const meta = pageMeta[currentPath()] || pageMeta["/index.html"];
  const summary = document.createElement("div");
  summary.className = "head-summary";
  summary.innerHTML = `
    <span><b>${meta.label}</b>${meta.desc}</span>
    <span><b>学习目标</b>12 月考试前完成词汇、语法、搭配和默写闭环。</span>
  `;
  head.append(summary);
}

function enhanceDashboard() {
  if (!document.body || currentPath() !== "/" && currentPath() !== "/index.html") return;
  const firstBand = document.querySelector(".band");
  if (!firstBand || document.querySelector(".dashboard-grid")) return;

  const grid = document.createElement("section");
  grid.className = "dashboard-grid";
  grid.innerHTML = `
    <a class="metric-card" href="study.html"><span>第一步</span><strong>学习</strong><em>单词、搭配、短句、副词、语法和时态</em></a>
    <a class="metric-card" href="exercises.html"><span>第二步</span><strong>练习</strong><em>单词练习、完形训练和错题复盘</em></a>
    <a class="metric-card" href="ai.html"><span>第三步</span><strong>AI答疑</strong><em>把不会的题整理成可追问的问题</em></a>
    <a class="metric-card" href="my.html"><span>第四步</span><strong>我的</strong><em>查看收藏、掌握、错题和学习进度</em></a>
  `;
  firstBand.before(grid);
}

function enhanceWordsPage() {
  const sections = Array.from(document.querySelectorAll(".word-section"));
  if (!sections.length || !document.querySelector("#wordSearch") || document.querySelector(".word-overview")) return;

  const overview = document.createElement("section");
  overview.className = "word-overview";
  overview.innerHTML = `
    <div><span>主题分组</span><strong>${sections.length}</strong></div>
    <div><span>词卡数量</span><strong id="wordCardCount">--</strong></div>
    <div><span>固定搭配</span><strong id="collocationCount">--</strong></div>
    <div><span>动词变化</span><strong id="verbChangeCount">--</strong></div>
  `;
  const toolbar = document.querySelector(".toolbar");
  toolbar?.before(overview);

  window.setTimeout(() => {
    const cards = Array.from(document.querySelectorAll(".word-card-enhanced"));
    document.querySelector("#wordCardCount").textContent = cards.length;
    document.querySelector("#collocationCount").textContent = cards.filter((card) => card.querySelector(".dict-extra")).length;
    document.querySelector("#verbChangeCount").textContent = cards.filter((card) => card.querySelector(".dict-change")).length;
  }, 120);
}

function enhanceAiTeacher() {
  const form = document.querySelector("#aiTeacherForm");
  if (!form) return;
  const type = document.querySelector("#aiQuestionType");
  const input = document.querySelector("#aiQuestionInput");
  const output = document.querySelector("#aiPromptOutput");
  const button = document.querySelector("#aiBuildPrompt");
  const templates = {
    word: "请像英语老师一样讲清楚这个单词：词性、核心意思、英式发音、常见搭配、例句、容易混淆的词。",
    grammar: "请用零基础能听懂的方式讲这个语法点：结构、中文理解、3 个例句、常见错误、一个练习题。",
    sentence: "请分析这个句子：主谓宾结构、每个关键词词性、中文翻译、可以替换的表达。",
    cloze: "请按完形填空思路分析：上下文线索、固定搭配、逻辑关系、为什么选这个答案。",
  };
  button?.addEventListener("click", () => {
    const question = input.value.trim();
    const prefix = templates[type.value] || templates.grammar;
    output.textContent = question
      ? `${prefix}\n\n我的问题：${question}\n\n请最后给我 3 个可以马上背的句子。`
      : "先输入你不会的单词、句子、语法或完形题，我会帮你整理成适合追问 AI 的问题。";
  });
}

function enhanceMyPage() {
  const panel = document.querySelector("#myStatsPanel");
  if (!panel) return;
  const readArray = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
      return [];
    }
  };
  const mission = todayMissionStats();
  const wrong = readArray("englishStudyWrongItems");
  const favorites = readArray("englishStudyFavoriteWords");
  const mastered = readArray("englishStudyMasteredWords");
  panel.innerHTML = `
    <article class="profile-stat"><span>今日进度</span><strong>${mission.percent}%</strong><em>${mission.completed}/${mission.total} 项完成</em></article>
    <article class="profile-stat"><span>连续学习</span><strong>${mission.streak} 天</strong><em>按每日任务记录统计</em></article>
    <article class="profile-stat"><span>收藏单词</span><strong>${favorites.length}</strong><em>单词页收藏</em></article>
    <article class="profile-stat"><span>已掌握</span><strong>${mastered.length}</strong><em>单词页标记</em></article>
    <article class="profile-stat"><span>错题本</span><strong>${wrong.length}</strong><em>练习自动记录</em></article>
  `;
}

function addBackTop() {
  if (document.querySelector(".back-top")) return;
  const button = document.createElement("button");
  button.className = "back-top";
  button.type = "button";
  button.setAttribute("aria-label", "返回顶部");
  button.textContent = "↑";
  document.body.append(button);

  button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => {
    button.classList.toggle("show", window.scrollY > 420);
  }, { passive: true });
}

function markReady() {
  requestAnimationFrame(() => document.body.classList.add("app-ready"));
}

enhanceNavigation();
enhancePageHead();
enhanceHomeMissionCard();
enhanceDashboard();
enhanceWordsPage();
enhanceAiTeacher();
enhanceMyPage();
addBackTop();
markReady();
