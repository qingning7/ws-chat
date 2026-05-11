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
        addMessage(`${message.username}: ${message.text}`);
    }

    if (message.type === "system") {
        addMessage(message.text);
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

function addMessage(text) {
    const li = document.createElement("li");
    li.textContent = text;
    messages.appendChild(li);
}