let scenarios = [];

function renderScenarios() {
    const stagesDiv = document.getElementById("stages");
    stagesDiv.innerHTML = "";
    scenarios.forEach((stage, stageIndex) => {
        const stageCard = document.createElement("div");
        stageCard.className = "stage-card";
        stageCard.innerHTML = `
            <h3>Этап ${stage.id}</h3>
            <div class="form-group">
                <label>ID:</label>
                <input type="text" value="${stage.id}" onchange="updateStage(${stageIndex}, 'id', this.value)">
            </div>
            <div class="form-group">
                <label>Текст:</label>
                <textarea onchange="updateStage(${stageIndex}, 'text', this.value)">${stage.text}</textarea>
            </div>
            <h4>Варианты ответов</h4>
            <div class="options">
                ${stage.options.map((opt, optIndex) => `
                    <div class="option-card">
                        <div class="form-group">
                            <label>Текст варианта:</label>
                            <input type="text" value="${opt.text}" onchange="updateOption(${stageIndex}, ${optIndex}, 'text', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Следующий этап:</label>
                            <input type="text" value="${opt.next}" onchange="updateOption(${stageIndex}, ${optIndex}, 'next', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Лог:</label>
                            <input type="text" value="${opt.log}" onchange="updateOption(${stageIndex}, ${optIndex}, 'log', this.value)">
                        </div>
                        <button onclick="deleteOption(${stageIndex}, ${optIndex})">Удалить вариант</button>
                    </div>
                `).join("")}
            </div>
            <button onclick="addOption(${stageIndex})">Добавить вариант</button>
            <button onclick="deleteStage(${stageIndex})">Удалить этап</button>
        `;
        stagesDiv.appendChild(stageCard);
    });
    updateJsonOutput();
}

function updateStage(stageIndex, field, value) {
    scenarios[stageIndex][field] = value;
    renderScenarios();
}

function updateOption(stageIndex, optIndex, field, value) {
    scenarios[stageIndex].options[optIndex][field] = value;
    renderScenarios();
}

function addStage() {
    scenarios.push({
        id: `stage_${scenarios.length}`,
        text: "Новый этап",
        options: []
    });
    renderScenarios();
}

function addOption(stageIndex) {
    scenarios[stageIndex].options.push({
        text: "Новый вариант",
        next: "",
        log: "Действие менеджера"
    });
    renderScenarios();
}

function deleteStage(stageIndex) {
    scenarios.splice(stageIndex, 1);
    renderScenarios();
}

function deleteOption(stageIndex, optIndex) {
    scenarios[stageIndex].options.splice(optIndex, 1);
    renderScenarios();
}

function updateJsonOutput() {
    document.getElementById("json-output").value = JSON.stringify(scenarios, null, 2);
}

document.getElementById("add-stage-btn").onclick = addStage;

document.getElementById("save-json-btn").onclick = () => {
    const blob = new Blob([JSON.stringify(scenarios, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scenarios.json";
    a.click();
    URL.revokeObjectURL(url);
};

document.getElementById("load-json-btn").onclick = () => {
    document.getElementById("json-file").click();
};

document.getElementById("json-file").onchange = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                scenarios = JSON.parse(e.target.result);
                renderScenarios();
            } catch (error) {
                alert("Ошибка загрузки JSON: " + error.message);
            }
        };
        reader.readAsText(file);
    }
};

// Инициализация
scenarios = [{
    id: "0",
    text: "Начальный этап",
    options: []
}];
renderScenarios();
