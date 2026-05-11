const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const messages = document.getElementById("messages");
const username = prompt("Enter your username:") || "Anonymous";

const socket = new WebSocket(`ws://${location.host}`);

socket.addEventListener("open", () => {
    addMessage("Connected to the server");
});

socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "chat") {
        addMessage(`${message.username}: ${message.text}`, message.time);
    }

    if (message.type === "system") {
        addMessage(message.text, message.time);
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