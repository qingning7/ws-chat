const express = require('express');
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const PORT = 3000;

app.use(express.static('public'));

wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.send(JSON.stringify({
        type: "system",
        text: "Welcome!"
    }));

    ws.on("message", (data) => {
        const message = JSON.parse(data.toString());

        if (message.type !== "chat") return;

        const payload = JSON.stringify({
            type: "chat",
            username: message.username,
            text: message.text
        });

        console.log("Received message:", message);

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
            }
        })
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Service is running at http://localhost:${PORT}`);
});