let scenarios = [];
let currentStage = 0;
let logEntries = [];
let history = [];
let choiceHistory = []; // Для хранения истории выборов

async function loadScenarios() {
    try {
        const response = await fetch('scenarios.json');
        scenarios = await response.json();
        displayStage(0);
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
            choiceHistory.push({ stageId: currentStage, choice: option.text, next: option.next });
            updateLog();
            updateHistory();
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

function updateHistory() {
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = "";
    choiceHistory.forEach((entry, index) => {
        const li = document.createElement("li");
        li.innerText = `${entry.choice} (Этап ${entry.stageId})`;
        li.style.cursor = "pointer";
        li.onclick = () => {
            // Возвращаемся к выбранному этапу
            currentStage = entry.next;
            logEntries = logEntries.slice(0, index + 1); // Сохраняем лог до этого выбора
            history = history.slice(0, index + 1); // Обрезаем историю
            choiceHistory = choiceHistory.slice(0, index + 1); // Обрезаем историю выборов
            displayStage(currentStage);
            updateLog();
            updateHistory();
        };
        historyList.appendChild(li);
    });
}

function goBack() {
    if (history.length > 0) {
        currentStage = history.pop();
        // Не удаляем последний logEntries, просто возвращаемся
        choiceHistory.pop(); // Удаляем последний выбор из истории
        displayStage(currentStage);
        updateHistory();
    }
}

document.getElementById("back-btn").onclick = goBack;

document.getElementById("copy-log-btn").onclick = () => {
    const logText = document.getElementById("log");
    logText.select();
    document.execCommand("copy");
    alert("Лог скопирован!");
};

document.getElementById("clear-log-btn").onclick = () => {
    logEntries = [];
    updateLog();
    choiceHistory = [];
    updateHistory();
    alert("Лог очищен!");
};

document.getElementById("save-client-data").onclick = () => {
    const lprName = document.getElementById("lpr-name").value;
    const companyName = document.getElementById("company-name").value;
    const managerName = document.getElementById("manager-name").value;
    const cassCount = document.getElementById("cass-count").value;
    const subscriptionEnd = document.getElementById("subscription-end").value;
    const fnEnd = document.getElementById("fn-end").value;

    const clientData = [
        `Имя ЛПР: ${lprName || "не указано"}`,
        `Название компании: ${companyName || "не указано"}`,
        `Имя менеджера: ${managerName || "не указано"}`,
        `Количество касс: ${cassCount || "не указано"}`,
        `Окончание подписки: ${subscriptionEnd || "не указано"}`,
        `Окончание ФН: ${fnEnd || "не указано"}`
    ];
    logEntries.unshift("--- Данные клиента ---");
    logEntries.unshift(...clientData);
    updateLog();
};

// Загружаем сценарии при старте
loadScenarios();
