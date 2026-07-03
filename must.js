const taskDateKey = new Date().toISOString().slice(0, 10);
const storageKey = `englishStudyDailyMission:${taskDateKey}`;
const taskItems = Array.from(document.querySelectorAll(".task-item"));
const missionPercent = document.querySelector("#missionPercent");
const missionBar = document.querySelector("#missionBar");
const missionSummary = document.querySelector("#missionSummary");
const todayLabel = document.querySelector("#todayLabel");

function readMissionState() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "{}");
  } catch {
    return {};
  }
}

function saveMissionState(state) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function formatToday() {
  const formatter = new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });
  return formatter.format(new Date());
}

function updateMissionProgress() {
  const total = taskItems.length;
  const completed = taskItems.filter((item) => item.querySelector("input")?.checked).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  missionPercent.textContent = `${percent}%`;
  missionBar.style.width = `${percent}%`;
  missionSummary.textContent = completed === total
    ? "今天任务完成。现在可以去智能练习里做错题复盘。"
    : `完成 ${completed} / ${total} 项。下一步：继续完成未勾选任务。`;

  taskItems.forEach((item) => {
    item.classList.toggle("done", item.querySelector("input")?.checked);
  });
}

function initMissionBoard() {
  const state = readMissionState();
  todayLabel.textContent = formatToday();

  taskItems.forEach((item) => {
    const checkbox = item.querySelector("input");
    const id = item.dataset.taskId;
    checkbox.checked = Boolean(state[id]);
    checkbox.addEventListener("change", () => {
      const nextState = readMissionState();
      nextState[id] = checkbox.checked;
      saveMissionState(nextState);
      updateMissionProgress();
    });
  });

  updateMissionProgress();
}

initMissionBoard();
