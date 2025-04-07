let scenarios = [];
let currentStage = 0;
let logEntries = [];
let history = [];

async function loadScenarios() {
    try {
        const response = await fetch('scenarios.json');
        scenarios = await response.json();
        displayStage(0); // Старт после загрузки
    } catch (error) {
        document.getElementById("stage-text").innerText = "Ошибка загрузки сценариев: " + error.message;
    }
}

function displayStage(stageId) {
    const stage = scenarios.find(s => s.id === stageId);
    if (!stage) return;

    history.push(currentStage);
    currentStage = stageId;

    document.getElementById("stage-text").innerText = stage.text;

    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";
    stage.options.forEach(option => {
        const btn = document.createElement("button");
        btn.innerText = option.text;
        btn.onclick = () => {
            logEntries.push(option.log);
            updateLog();
            displayStage(option.next);
        };
        optionsDiv.appendChild(btn);
    });

    const backBtn = document.getElementById("back-btn");
    backBtn.style.display = history.length > 0 ? "block" : "none";
}

function updateLog() {
    document.getElementById("log").value = logEntries.join("\n");
}

function goBack() {
    if (history.length > 0) {
        logEntries.pop();
        currentStage = history.pop();
        displayStage(currentStage);
        updateLog();
    }
}

document.getElementById("back-btn").onclick = goBack;

document.getElementById("copy-log-btn").onclick = () => {
    const logText = document.getElementById("log");
    logText.select();
    document.execCommand("copy");
    alert("Лог скопирован!");
};

// Загружаем сценарии при старте
loadScenarios();
