const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const messages = document.getElementById("messages");
const onlineCount = document.getElementById("online-count");
const STORAGE_KEY = "ws-chat-history";
const username = prompt("Enter your username:") || "Anonymous";

loadHistory();

const socket = new WebSocket(`ws://${location.host}`);

socket.addEventListener("open", () => {
    addMessage("Connected to the server", new Date().toISOString());
});

socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "chat") {
        addMessage(`${message.username}: ${message.text}`, message.time);
        saveChatHistory(message);
    }

    if (message.type === "system") {
        addMessage(message.text, message.time);
    }

    if (message.type === "onlineCount") {
        onlineCount.textContent = `Online Users: ${message.count}`;
    }
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    socket.send(JSON.stringify({
        type: "chat",
        username,
        text
    }));

    input.value = "";
    input.focus();
});

function addMessage(text, time) {
    const li = document.createElement("li");
    const formattedTime = formatTime(time);
    li.textContent = `[${formattedTime}] ${text}`;
    messages.appendChild(li);
}

function formatTime(time) {
    const date = new Date(time);

    return date.toLocaleDateString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
}

function loadHistory() {
    const history = getStoredHistory();

    history.forEach((message) => {
        addMessage(`${message.username}: ${message.text}`, message.time);
    });
}

function saveChatHistory(message) {
    const history = getStoredHistory();

    history.push({
        type: "chat",
        username: message.username,
        text: message.test,
        time: message.time
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function getStoredHistory() {
    const rawHistory = localStorage.getItem(STORAGE_KEY);

    if (!rawHistory) return [];

    try {
        const history = JSON.parse(rawHistory);

        if (Array.isArray(history)) {
            return history;
        }

        return [];
    } catch (error) {
        return [];
    }
}