const STORAGE_KEY = "attivixMissioneFelicitaState";

const tasks = {
  digital: {
    id: "digital",
    title: "Lezione digitale",
    person: "Franco",
    description: "Franco vuole imparare a usare i servizi online senza sentirsi perso davanti a ogni schermata.",
    happiness: 18,
    points: 7,
    icon: "01",
    npc: "franco",
    target: { left: "19%", top: "42%" },
    activity: "Hai aiutato Franco a muoversi online con più autonomia."
  },
  groceries: {
    id: "groceries",
    title: "Spesa solidale",
    person: "Anna",
    description: "Anna ha bisogno di una mano per portare la spesa e di qualcuno con cui scambiare due parole.",
    happiness: 20,
    points: 8,
    icon: "02",
    npc: "anna",
    target: { left: "74%", top: "30%" },
    activity: "Hai dato una mano ad Anna con la spesa solidale."
  },
  park: {
    id: "park",
    title: "Cura del parco",
    person: "La piazza",
    description: "Un piccolo gesto di cura rende più bello il luogo che tutti condividono ogni giorno.",
    happiness: 14,
    points: 5,
    icon: "03",
    npc: "park",
    target: { left: "43%", top: "70%" },
    activity: "Hai partecipato alla cura del parco della comunità."
  },
  company: {
    id: "company",
    title: "Un po' di compagnia",
    person: "Lucia",
    description: "Lucia non ha bisogno di grandi cose: un ascolto sincero può cambiare il tono della sua giornata.",
    happiness: 16,
    points: 6,
    icon: "04",
    npc: "lucia",
    target: { left: "80%", top: "67%" },
    activity: "Hai dedicato tempo e ascolto a Lucia."
  }
};

const MAX_HAPPINESS = Object.values(tasks).reduce((total, task) => total + task.happiness, 0);

const initialState = {
  wallet: 0,
  happiness: 0,
  npcHappiness: { franco: 0, anna: 0, park: 0, lucia: 0 },
  completed: [],
  activities: []
};

let state = loadState();
let selectedTaskId = null;
let isBusy = false;

const communityHappiness = document.getElementById("communityHappiness");
const communityMeter = document.getElementById("communityMeter");
const walletPoints = document.getElementById("walletPoints");
const walletPointsLarge = document.getElementById("walletPointsLarge");
const walletLevel = document.getElementById("walletLevel");
const statusText = document.getElementById("statusText");
const missionCount = document.getElementById("missionCount");
const missionList = document.getElementById("missionList");
const activityList = document.getElementById("activityList");
const volunteer = document.getElementById("volunteer");
const impactBurst = document.getElementById("impactBurst");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalIcon = document.getElementById("modalIcon");
const modalEyebrow = document.getElementById("modalEyebrow");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalReward = document.getElementById("modalReward");
const startMissionButton = document.getElementById("startMissionButton");
const resetButton = document.getElementById("resetButton");

function cloneInitialState() {
  return JSON.parse(JSON.stringify(initialState));
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return cloneInitialState();

    const parsed = JSON.parse(saved);
    return {
      ...cloneInitialState(),
      ...parsed,
      npcHappiness: { ...initialState.npcHappiness, ...(parsed.npcHappiness || {}) },
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      activities: Array.isArray(parsed.activities) ? parsed.activities : []
    };
  } catch {
    return cloneInitialState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getWalletLevel(points) {
  if (points >= 26) return "Custode della città";
  if (points >= 15) return "Presenza che conta";
  if (points >= 7) return "Volontario in movimento";
  return "Volontario alle prime missioni";
}

function getCommunityPercentage() {
  return Math.round((state.happiness / MAX_HAPPINESS) * 100);
}

function renderDashboard() {
  const communityPercentage = getCommunityPercentage();

  communityHappiness.textContent = `${communityPercentage}%`;
  communityMeter.style.width = `${communityPercentage}%`;
  walletPoints.textContent = state.wallet;
  walletPointsLarge.textContent = `${state.wallet} PX`;
  walletLevel.textContent = getWalletLevel(state.wallet);
  missionCount.textContent = `${state.completed.length} / ${Object.keys(tasks).length}`;

  Object.entries(state.npcHappiness).forEach(([npc, value]) => {
    const bar = document.querySelector(`[data-npc-bar="${npc}"]`);
    const task = Object.values(tasks).find((item) => item.npc === npc);
    const percentage = task ? Math.min(100, Math.round((value / task.happiness) * 100)) : 0;

    if (bar) bar.style.width = `${percentage}%`;
  });

  document.querySelectorAll(".mission-point").forEach((element) => {
    const task = tasks[element.dataset.task];
    const isCompleted = state.completed.includes(task.id);

    element.classList.toggle("completed", isCompleted);
    element.disabled = isBusy || isCompleted;
  });

  renderMissionList();
  renderActivityList();
}

function renderMissionList() {
  missionList.innerHTML = "";

  Object.values(tasks).forEach((task) => {
    const isCompleted = state.completed.includes(task.id);
    const button = document.createElement("button");

    button.type = "button";
    button.dataset.task = task.id;
    button.disabled = isBusy || isCompleted;
    button.innerHTML = `
      <span class="mission-icon">${isCompleted ? "OK" : task.icon}</span>
      <span>
        <strong>${task.title}</strong>
        <small>${isCompleted ? "Gestito: l'impatto resta." : `${task.person} ti aspetta.`}</small>
      </span>
      <span class="reward-mini">${isCompleted ? "FATTO" : `+${task.points} PX`}</span>
    `;

    missionList.appendChild(button);
  });
}

function renderActivityList() {
  activityList.innerHTML = "";

  if (!state.activities.length) {
    const item = document.createElement("li");
    item.className = "empty-activity";
    item.textContent = "Nessuna traccia ancora. La città aspetta il primo gesto.";
    activityList.appendChild(item);
    return;
  }

  state.activities.slice(0, 4).forEach((activity) => {
    const item = document.createElement("li");
    item.innerHTML = `<span><strong>${activity.title}</strong><br>${activity.description}</span>`;
    activityList.appendChild(item);
  });
}

function openMission(taskId) {
  if (isBusy || state.completed.includes(taskId)) return;

  selectedTaskId = taskId;
  const task = tasks[taskId];

  modalIcon.textContent = task.icon;
  modalEyebrow.textContent = `CHIAMATA / ${task.person.toUpperCase()}`;
  modalTitle.textContent = task.title;
  modalDescription.textContent = task.description;
  modalReward.textContent = `+${task.happiness} felicità · +${task.points} PX`;
  modalBackdrop.hidden = false;
  startMissionButton.focus();
}

function closeModal() {
  modalBackdrop.hidden = true;
  selectedTaskId = null;
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function runMission() {
  if (!selectedTaskId || isBusy) return;

  const task = tasks[selectedTaskId];
  isBusy = true;
  modalBackdrop.hidden = true;
  statusText.textContent = `In cammino: ${task.title}.`;
  renderDashboard();

  volunteer.style.left = task.target.left;
  volunteer.style.top = task.target.top;

  await wait(1100);

  volunteer.classList.add("working");
  statusText.textContent = `Gesto in corso: ${task.title}.`;
  await wait(1300);

  volunteer.classList.remove("working");
  state.wallet += task.points;
  state.happiness += task.happiness;
  state.npcHappiness[task.npc] += task.happiness;
  state.completed.push(task.id);

  state.activities.unshift({
    title: task.title,
    description: `${task.activity} +${task.points} PX nel portafoglio Attivix.`
  });

  state.activities = state.activities.slice(0, 20);
  saveState();

  impactBurst.textContent = `+${task.happiness} FELICITÀ / +${task.points} PX`;
  impactBurst.classList.remove("show");
  void impactBurst.offsetWidth;
  impactBurst.classList.add("show");

  renderDashboard();

  statusText.textContent = state.completed.length === Object.keys(tasks).length
    ? "Tutte le chiamate sono state raccolte. La città è più viva."
    : `Gesto concluso: ${task.title}. Una chiamata alla volta, la città cambia.`;

  await wait(650);
  volunteer.style.left = "13%";
  volunteer.style.top = "70%";

  await wait(950);
  isBusy = false;
  selectedTaskId = null;
  renderDashboard();
}

function resetGame() {
  const shouldReset = window.confirm("Vuoi azzerare punti, impatto e diario di questa partita?");
  if (!shouldReset) return;

  state = cloneInitialState();
  saveState();
  selectedTaskId = null;
  isBusy = false;
  modalBackdrop.hidden = true;
  volunteer.classList.remove("working");
  volunteer.style.left = "13%";
  volunteer.style.top = "70%";
  statusText.textContent = "Scegli un punto sulla mappa.";
  renderDashboard();
}

function bindMissionTriggers() {
  document.querySelectorAll(".mission-point").forEach((element) => {
    element.addEventListener("click", () => openMission(element.dataset.task));
  });
}

missionList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-task]");
  if (button) openMission(button.dataset.task);
});

startMissionButton.addEventListener("click", runMission);
modalClose.addEventListener("click", closeModal);
resetButton.addEventListener("click", resetGame);

modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modalBackdrop.hidden) closeModal();
});

bindMissionTriggers();
renderDashboard();
