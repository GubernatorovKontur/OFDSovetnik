// Сценарии
const scenarios = [
    {
        id: 0,
        text: "Советник по ОФД: продление\nНажмите 'Начать работу' для старта.",
        options: [
            { text: "Начать работу", next: 1, log: "Менеджер начал работу" }
        ]
    },
    {
        id: 1,
        text: "Перед звонком изучите клиента в Контур.Продажи: сколько касс, срок подписки, кто ЛПР. Готовы звонить?",
        options: [
            { text: "Да, готов", next: 2, log: "Менеджер подготовился к звонку" },
            { text: "Нет, нужно уточнить", next: "hint1", log: "Менеджер уточняет данные" }
        ]
    },
    {
        id: "hint1",
        text: "Подсказка: Проверьте количество касс и дату окончания подписки в КП. Готовы теперь?",
        options: [
            { text: "Да, готов", next: 2, log: "Менеджер подготовился после уточнения" }
        ]
    },
    {
        id: 2,
        text: "Добрый день. Меня зовут Анна. Компания Контур. Звоню в ООО Ромашка, верно?",
        options: [
            { text: "Да, верно", next: 3, log: "Клиент подтвердил организацию" },
            { text: "Нет, не туда", next: "end1", log: "Неверный контакт" }
        ]
    },
    {
        id: 3,
        text: "Звоню по продлению Контур.ОФД. Вы отвечаете за кассы?",
        options: [
            { text: "Да", next: 4, log: "Клиент — ЛПР" },
            { text: "Нет", next: "lpr1", log: "Менеджер ищет ЛПР" }
        ]
    },
    {
        id: "lpr1",
        text: "С кем могу обсудить продление?",
        options: [
            { text: "Дайте контакты", next: "lpr2", log: "Уточнил контакты ЛПР" },
            { text: "Отправьте на почту", next: "lpr3", log: "Клиент предложил почту" }
        ]
    },
    {
        id: "lpr2",
        text: "Спасибо, свяжусь с ответственным. До свидания.",
        options: [
            { text: "Завершить", next: "end2", log: "Итог: Уточнены контакты ЛПР" }
        ]
    },
    {
        id: "lpr3",
        text: "Звоню по продлению ОФД, без него касса остановится. Как связаться с ответственным?",
        options: [
            { text: "Дали контакты", next: "lpr2", log: "Клиент дал контакты после аргумента" },
            { text: "Отказ", next: "end3", log: "Итог: Отказ связать с ЛПР" }
        ]
    },
    {
        id: 4,
        text: "У вас заканчивается подписка 30 апреля 2025. Есть ли вопросы по сервису?",
        options: [
            { text: "Нет, всё хорошо", next: 5, log: "Клиент доволен сервисом" },
            { text: "Да, есть проблемы", next: "q1", log: "Клиент сообщил о проблемах" }
        ]
    },
    {
        id: "q1",
        text: "Какие проблемы? Мы решим через техподдержку. Уточните.",
        options: [
            { text: "Решили, продолжаем", next: 5, log: "Проблема решена" }
        ]
    },
    {
        id: 5,
        text: "Сколько у вас касс сейчас?",
        options: [
            { text: "2 кассы", next: 6, log: "Клиент: 2 кассы" },
            { text: "1 касса", next: 6, log: "Клиент: 1 касса" }
        ]
    },
    {
        id: 6,
        text: "Самый выгодный тариф — 3 года за 7000₽ (2300₽/год). Подойдёт?",
        options: [
            { text: "Да, подходит", next: 7, log: "Клиент согласен на тариф 3 года" },
            { text: "Дорого", next: "obj1", log: "Возражение: дорого" },
            { text: "Продлю у конкурента", next: "obj2", log: "Возражение: конкурент" }
        ]
    },
    {
        id: "obj1",
        text: "Есть тариф на 15 месяцев за 3700₽ или Контур.Бонус. Что скажете?",
        options: [
            { text: "Согласен на 15 месяцев", next: 7, log: "Клиент выбрал 15 месяцев" },
            { text: "Нет, отказ", next: "ref1", log: "Итог: Отказ из-за цены" }
        ]
    },
    {
        id: "obj2",
        text: "Что предлагают конкуренты? У нас отложенный старт — оплатите сейчас, начнёте позже.",
        options: [
            { text: "Согласен с отложенным стартом", next: 7, log: "Клиент согласен на отложенный старт" },
            { text: "Нет, останусь у конкурента", next: "ref2", log: "Итог: Отказ, конкурент" }
        ]
    },
    {
        id: 7,
        text: "Формирую счёт на [тариф]. Отправлю на почту. Когда сможете оплатить?",
        options: [
            { text: "Согласен, отправляйте", next: 8, log: "Клиент согласен на счёт" },
            { text: "Нужно согласовать", next: "coord1", log: "Клиент согласовывает" }
        ]
    },
    {
        id: 8,
        text: "Уточните почту. Перезвоню 10 апреля. Всё верно?",
        options: [
            { text: "Да, верно", next: "end4", log: "Итог: Завершено успешно" }
        ]
    },
    {
        id: "coord1",
        text: "С кем согласовать? Когда узнаете решение?",
        options: [
            { text: "С директором, через 2 дня", next: "end5", log: "Итог: Ждёт согласования" }
        ]
    },
    {
        id: "ref1",
        text: "Причина отказа: дорого. Завершить?",
        options: [
            { text: "Завершить", next: "end6", log: "Итог: Отказ из-за цены" }
        ]
    },
    {
        id: "ref2",
        text: "Причина отказа: конкурент. Завершить?",
        options: [
            { text: "Завершить", next: "end7", log: "Итог: Отказ, конкурент" }
        ]
    },
    {
        id: "end1",
        text: "Сделка завершена: Неверный контакт.",
        options: [
            { text: "Начать заново", next: 0, log: "Менеджер начал заново" }
        ]
    },
    {
        id: "end2",
        text: "Сделка завершена: Уточнены контакты ЛПР.",
        options: [
            { text: "Начать заново", next: 0, log: "Менеджер начал заново" }
        ]
    },
    {
        id: "end3",
        text: "Сделка завершена: Отказ связать с ЛПР.",
        options: [
            { text: "Начать заново", next: 0, log: "Менеджер начал заново" }
        ]
    },
    {
        id: "end4",
        text: "Сделка завершена: Успешно. Лог сохранён.",
        options: [
            { text: "Начать заново", next: 0, log: "Менеджер начал заново" }
        ]
    },
    {
        id: "end5",
        text: "Сделка завершена: Ждёт согласования.",
        options: [
            { text: "Начать заново", next: 0, log: "Менеджер начал заново" }
        ]
    },
    {
        id: "end6",
        text: "Сделка завершена: Отказ из-за цены.",
        options: [
            { text: "Начать заново", next: 0, log: "Менеджер начал заново" }
        ]
    },
    {
        id: "end7",
        text: "Сделка завершена: Отказ, конкурент.",
        options: [
            { text: "Начать заново", next: 0, log: "Менеджер начал заново" }
        ]
    }
];

// Логика приложения
let currentStage = 0;
let logEntries = [];
let history = [];

function displayStage(stageId) {
    const stage = scenarios.find(s => s.id === stageId);
    if (!stage) return;

    // Обновляем историю
    history.push(currentStage);
    currentStage = stageId;

    // Отображаем текст этапа
    document.getElementById("stage-text").innerText = stage.text;

    // Отображаем варианты
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

    // Показываем кнопку "Назад", если есть история
    const backBtn = document.getElementById("back-btn");
    backBtn.style.display = history.length > 0 ? "block" : "none";
}

function updateLog() {
    document.getElementById("log").value = logEntries.join("\n");
}

function goBack() {
    if (history.length > 0) {
        logEntries.pop(); // Удаляем последний лог
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

// Старт
displayStage(0);
