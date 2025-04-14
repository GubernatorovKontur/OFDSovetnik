let scenarios = [];

function renderDiagram() {
    const diagram = document.getElementById("diagram");
    diagram.innerHTML = `
        <svg id="arrows" style="position: absolute; width: 100%; height: 100%; z-index: -1;"></svg>
        <div id="stages"></div>
    `;

    const stagesDiv = document.getElementById("stages");
    let yOffset = 20;
    const arrows = [];

    scenarios.forEach((stage, stageIndex) => {
        const stageDiv = document.createElement("div");
        stageDiv.className = "stage-card";
        stageDiv.style.top = `${yOffset}px`;
        stageDiv.innerHTML = `
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
                            <label>Текст:</label>
                            <input type="text" value="${opt.text}" onchange="updateOption(${stageIndex}, ${optIndex}, 'text', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Следующий (ID):</label>
                            <select onchange="updateOption(${stageIndex}, ${optIndex}, 'next', this.value)">
                                <option value="">Выберите этап</option>
                                ${scenarios.map(s => `<option value="${s.id}" ${opt.next === s.id ? "selected" : ""}>${s.id}</option>`).join("")}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Лог:</label>
                            <input type="text" value="${opt.log}" onchange="updateOption(${stageIndex}, ${optIndex}, 'log', this.value)">
                        </div>
                        <button onclick="deleteOption(${stageIndex}, ${optIndex})">Удалить</button>
                    </div>
                `).join("")}
            </div>
            <button onclick="addOption(${stageIndex})">Добавить вариант</button>
            <button onclick="deleteStage(${stageIndex})">Удалить этап</button>
        `;
        stagesDiv.appendChild(stageDiv);

        const stageHeight = stageDiv.offsetHeight || 200;
        yOffset += stageHeight + 60;

        stage.options.forEach((opt, optIndex) => {
            if (opt.next) {
                arrows.push({ fromStage: stage.id, toStage: opt.next, optionIndex: optIndex });
            }
        });
    });

    diagram.style.height = `${yOffset + 100}px`;

    const svg = document.getElementById("arrows");
    svg.setAttribute("height", yOffset + 100);
    svg.innerHTML = "";
    arrows.forEach(arrow => {
        const fromDiv = Array.from(document.querySelectorAll(".stage-card")).find(
            card => card.querySelector("h3").textContent.includes(arrow.fromStage)
        );
        const toDiv = Array.from(document.querySelectorAll(".stage-card")).find(
            card => card.querySelector("h3").textContent.includes(arrow.toStage)
        );
        if (fromDiv && toDiv) {
            const fromOption = fromDiv.querySelectorAll(".option-card")[arrow.optionIndex];
            if (fromOption) {
                const fromY = parseInt(fromDiv.style.top) + fromOption.offsetTop + fromOption.offsetHeight / 2;
                const toY = parseInt(toDiv.style.top) + 20;
                const x1 = 600;
                const x2 = 300;
                svg.innerHTML += `
                    <path d="M${x1},${fromY} C${x1 + 50},${fromY} ${x2 - 50},${toY} ${x2},${toY}" 
                          stroke="#00A88F" stroke-width="2" fill="none"/>
                    <polygon points="${x2-5},${toY-5} ${x2+5},${toY-5} ${x2},${toY}" fill="#00A88F"/>
                `;
            }
        }
    });

    updateJsonOutput();
}

function updateStage(stageIndex, field, value) {
    scenarios[stageIndex][field] = value;
    renderDiagram();
}

function updateOption(stageIndex, optIndex, field, value) {
    scenarios[stageIndex].options[optIndex][field] = value;
    renderDiagram();
}

function addStage() {
    scenarios.push({
        id: `stage_${scenarios.length}`,
        text: "Новый этап",
        options: []
    });
    renderDiagram();
}

function addOption(stageIndex) {
    scenarios[stageIndex].options.push({
        text: "Новый вариант",
        next: "",
        log: "Действие менеджера"
    });
    renderDiagram();
}

function deleteStage(stageIndex) {
    scenarios.splice(stageIndex, 1);
    renderDiagram();
}

function deleteOption(stageIndex, optIndex) {
    scenarios[stageIndex].options.splice(optIndex, 1);
    renderDiagram();
}

function updateJsonOutput() {
    const jsonOutput = document.getElementById("json-output");
    jsonOutput.value = JSON.stringify(scenarios, null, 2);
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
                renderDiagram();
                updateJsonOutput(); // Явно обновляем JSON-код
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
renderDiagram();
