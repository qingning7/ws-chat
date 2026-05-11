const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const messages = document.getElementById("messages");

const socket = new WebSocket(`ws://${location.host}`);

socket.addEventListener("open", () => {
    addMessage("Connected to the server");
});

socket.addEventListener("message", (event) => {
    addMessage(event.data);
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    socket.send(text);

    input.value = "";
    input.focus();
});

function addMessage(text) {
    const li = document.createElement("li");
    li.textContent = text;
    messages.appendChild(li);
}