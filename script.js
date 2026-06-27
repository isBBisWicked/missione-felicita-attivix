const STORAGE_KEY = "attivixMissioneFelicitaState";

const tasks = {
  digital: {
    id: "digital",
    title: "Lezione digitale",
    person: "Franco",
    description: "Franco vuole imparare a usare i servizi online senza sentirsi perso davanti a ogni schermata.",
    happiness: 18,
    points: 7,
    icon: "⌘",
    npc: "franco",
    target: { left: "23%", top: "48%" },
    activity: "Hai aiutato Franco a muoversi online con più autonomia."
  },
  groceries: {
    id: "groceries",
    title: "Spesa solidale",
    person: "Anna",
    description: "Anna ha bisogno di una mano per portare la spesa e di qualcuno con cui scambiare due parole.",
    happiness: 20,
    points: 8,
    icon: "♧",
    npc: "anna",
    target: { left: "73%", top: "41%" },
    activity: "Hai dato una mano ad Anna con la spesa solidale."
  },
  park: {
    id: "park",
    title: "Cura del parco",
    person: "La piazza",
    description: "Un piccolo gesto di cura rende più bello il luogo che tutti condividono ogni giorno.",
    happiness: 14,
    points: 5,
    icon: "♻",
    npc: "park",
    target: { left: "43%", top: "65%" },
    activity: "Hai partecipato alla cura del parco della comunità."
  },
  company: {
    id: "company",
    title: "Un po' di compagnia",
    person: "Lucia",
    description: "Lucia non ha bisogno di grandi cose: un ascolto sincero può cambiare il tono della sua giornata.",
    happiness: 16,
    points: 6,
    icon: "♥",
    npc: "lucia",
    target: { left: "79%", top: "67%" },
    activity: "Hai dedicato tempo e ascolto a Lucia."
  }
};

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

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return structuredClone(initialState);

    const parsed = JSON.parse(saved);
    return {
      ...structuredClone(initialState),
      ...parsed,
      npcHappiness: { ...initialState.npcHappiness, ...(parsed.npcHappiness || {}) },
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      activities: Array.isArray(parsed.activities) ? parsed.activities : []
    };
  } catch {
    return structuredClone(initialState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getWalletLevel(points) {
  if (points >= 70) return "Ambasciatore di comunità";
  if (points >= 35) return "Volontario di quartiere";
  if (points >= 15) return "Presenza che conta";
  return "Volontario alle prime missioni";
}

function renderDashboard() {
  communityHappiness.textContent = `${Math.min(state.happiness, 100)}%`;
  walletPoints.textContent = state.wallet;
  walletPointsLarge.textContent = `${state.wallet} PX`;
  walletLevel.textContent = getWalletLevel(state.wallet);
  missionCount.textContent = `${state.completed.length}/${Object.keys(tasks).length}`;

  Object.entries(state.npcHappiness).forEach(([npc, value]) => {
    const bar = document.querySelector(`[data-npc-bar="${npc}"]`);
    if (bar) bar.style.width = `${Math.min(value, 100)}%`;
  });

  document.querySelectorAll(".mission-point").forEach((element) => {
    const task = tasks[element.dataset.task];
    element.classList.toggle("completed", state.completed.includes(task.id));
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
    button.disabled = isBusy;
    button.innerHTML = `
      <span class="mission-icon">${isCompleted ? "✓" : task.icon}</span>
      <span>
        <strong>${task.title}</strong>
        <small>${isCompleted ? "Hai già diffuso felicità qui." : `${task.person} ti aspetta.`}</small>
      </span>
      <span class="reward-mini">+${task.points} PX</span>
    `;
    missionList.appendChild(button);
  });
}

function renderActivityList() {
  activityList.innerHTML = "";

  if (!state.activities.length) {
    const item = document.createElement("li");
    item.className = "empty-activity";
    item.textContent = "La piazza aspetta il primo gesto di cura.";
    activityList.appendChild(item);
    return;
  }

  state.activities.slice(0, 4).forEach((activity) => {
    const item = document.createElement("li");
    item.innerHTML = `<span><strong>${activity.title}</strong><br />${activity.description}</span>`;
    activityList.appendChild(item);
  });
}

function openMission(taskId) {
  if (isBusy) return;

  selectedTaskId = taskId;
  const task = tasks[taskId];

  modalIcon.textContent = task.icon;
  modalEyebrow.textContent = `RICHIESTA DI ${task.person.toUpperCase()}`;
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
  statusText.textContent = `Ti stai muovendo verso: ${task.title}`;
  renderMissionList();

  volunteer.style.left = task.target.left;
  volunteer.style.top = task.target.top;

  await wait(1150);

  volunteer.classList.add("working");
  statusText.textContent = `Missione in corso: ${task.title}`;
  await wait(1550);

  volunteer.classList.remove("working");
  state.wallet += task.points;
  state.happiness = Math.min(100, state.happiness + task.happiness);
  state.npcHappiness[task.npc] = Math.min(100, state.npcHappiness[task.npc] + task.happiness);

  if (!state.completed.includes(task.id)) {
    state.completed.push(task.id);
  }

  state.activities.unshift({
    title: task.title,
    description: `${task.activity} +${task.points} PX nel portafoglio Attivix.`
  });

  state.activities = state.activities.slice(0, 20);
  saveState();

  impactBurst.textContent = `+${task.happiness} felicità · +${task.points} PX`;
  impactBurst.classList.remove("show");
  void impactBurst.offsetWidth;
  impactBurst.classList.add("show");

  statusText.textContent = `Missione completata: ${task.title}. La piazza è un po' più felice.`;
  renderDashboard();

  await wait(550);
  volunteer.style.left = "12%";
  volunteer.style.top = "64%";
  await wait(1100);

  statusText.textContent = state.completed.length === Object.keys(tasks).length
    ? "Tutte le missioni completate. La comunità ha fatto squadra."
    : "Scegli una nuova richiesta di aiuto.";

  isBusy = false;
  selectedTaskId = null;
  renderMissionList();
}

function resetGame() {
  const shouldReset = window.confirm("Vuoi azzerare felicità, punti e diario di questa partita?");
  if (!shouldReset) return;

  state = structuredClone(initialState);
  saveState();
  volunteer.style.left = "12%";
  volunteer.style.top = "64%";
  statusText.textContent = "Scegli una richiesta di aiuto.";
  renderDashboard();
}

function bindMissionTriggers() {
  document.querySelectorAll("[data-task]").forEach((element) => {
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
