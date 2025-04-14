let scenarios = [];
let myDiagram;

function initDiagram() {
    const $ = go.GraphObject.make;
    myDiagram = $(go.Diagram, "diagram", {
        "undoManager.isEnabled": true,
        layout: $(go.TreeLayout, { angle: 90, layerSpacing: 35 })
    });

    myDiagram.nodeTemplate = $(
        go.Node, "Auto",
        { isShadowed: true, shadowOffset: new go.Point(0, 3) },
        $(go.Shape, "RoundedRectangle", {
            fill: "#fff", stroke: "#00CCAE", strokeWidth: 2
        }),
        $(go.Panel, "Vertical",
            $(go.TextBlock, {
                margin: 8, font: "bold 14px Roboto", stroke: "#222",
                text: "Этап"
            }, new go.Binding("text", "id", id => `Этап ${id}`)),
            $(go.TextBlock, {
                margin: 8, maxSize: new go.Size(200, 60), wrap: go.TextBlock.WrapFit,
                font: "12px Roboto", stroke: "#333"
            }, new go.Binding("text", "text")),
            $(go.Panel, "Vertical",
                { margin: 8 },
                new go.Binding("itemArray", "options"),
                {
                    itemTemplate: $(
                        go.Panel, "Horizontal",
                        $(go.TextBlock, {
                            margin: new go.Margin(2, 5), font: "12px Roboto",
                            stroke: "#555"
                        }, new go.Binding("text", "text")),
                        $(go.TextBlock, {
                            margin: new go.Margin(2, 5), font: "italic 12px Roboto",
                            stroke: "#888"
                        }, new go.Binding("text", "next", next => `→ ${next}`))
                    )
                }
            )
        ),
        {
            click: (e, node) => editNode(node.data)
        }
    );

    myDiagram.linkTemplate = $(
        go.Link,
        { routing: go.Link.Orthogonal, corner: 10 },
        $(go.Shape, { stroke: "#00A88F", strokeWidth: 2 }),
        $(go.Shape, { toArrow: "Standard", fill: "#00A88F", stroke: null })
    );

    updateDiagram();
}

function updateDiagram() {
    const nodes = scenarios.map(stage => ({
        key: stage.id,
        id: stage.id,
        text: stage.text,
        options: stage.options
    }));

    const links = scenarios.flatMap(stage =>
        stage.options
            .filter(opt => opt.next)
            .map(opt => ({ from: stage.id, to: opt.next }))
    );

    myDiagram.model = new go.GraphLinksModel(nodes, links);
    updateJsonOutput();
}

function editNode(data) {
    const form = document.createElement("div");
    form.className = "edit-form";
    form.innerHTML = `
        <h3>Редактировать этап ${data.id}</h3>
        <div class="form-group">
            <label>ID:</label>
            <input type="text" id="edit-id" value="${data.id}">
        </div>
        <div class="form-group">
            <label>Текст:</label>
            <textarea id="edit-text">${data.text}</textarea>
        </div>
        <h4>Варианты ответов</h4>
        <div id="edit-options">
            ${data.options.map((opt, i) => `
                <div class="option-card">
                    <label>Текст варианта:</label>
                    <input type="text" value="${opt.text}" data-index="${i}" class="opt-text">
                    <label>Следующий этап:</label>
                    <input type="text" value="${opt.next}" data-index="${i}" class="opt-next">
                    <label>Лог:</label>
                    <input type="text" value="${opt.log}" data-index="${i}" class="opt-log">
                    <button onclick="deleteOptionForm(${i})">Удалить</button>
                </div>
            `).join("")}
        </div>
        <button onclick="addOptionForm()">Добавить вариант</button>
        <button onclick="saveNode()">Сохранить</button>
        <button onclick="deleteNode('${data.id}')">Удалить этап</button>
    `;
    document.getElementById("editor-content").appendChild(form);
}

function addOptionForm() {
    const optionsDiv = document.getElementById("edit-options");
    const index = optionsDiv.children.length;
    const optCard = document.createElement("div");
    optCard.className = "option-card";
    optCard.innerHTML = `
        <label>Текст варианта:</label>
        <input type="text" data-index="${index}" class="opt-text">
        <label>Следующий этап:</label>
        <input type="text" data-index="${index}" class="opt-next">
        <label>Лог:</label>
        <input type="text" data-index="${index}" class="opt-log">
        <button onclick="deleteOptionForm(${index})">Удалить</button>
    `;
    optionsDiv.appendChild(optCard);
}

window.deleteOptionForm = (index) => {
    const optCard = document.querySelector(`.option-card input[data-index="${index}"]`).parentElement;
    optCard.remove();
};

window.saveNode = () => {
    const id = document.getElementById("edit-id").value;
    const text = document.getElementById("edit-text").value;
    const options = Array.from(document.querySelectorAll(".option-card")).map(card => ({
        text: card.querySelector(".opt-text").value,
        next: card.querySelector(".opt-next").value,
        log: card.querySelector(".opt-log").value
    }));

    const stageIndex = scenarios.findIndex(s => s.id === id);
    if (stageIndex >= 0) {
        scenarios[stageIndex] = { id, text, options };
    } else {
        scenarios.push({ id, text, options });
    }

    document.querySelector(".edit-form").remove();
    updateDiagram();
};

window.deleteNode = (id) => {
    scenarios = scenarios.filter(s => s.id !== id);
    document.querySelector(".edit-form").remove();
    updateDiagram();
};

function addStage() {
    const newId = `stage_${scenarios.length}`;
    scenarios.push({
        id: newId,
        text: "Новый этап",
        options: []
    });
    updateDiagram();
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
                updateDiagram();
            } catch (error) {
                alert("Ошибка загрузки JSON: " + error.message);
            }
        };
        reader.readAsText(file);
    }
};

// Инициализация
initDiagram();
