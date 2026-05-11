const express = require('express');

const app = express();

const PORT = 3000;

app.use(express.static('public'));

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Service is running at http://localhost:${PORT}`);
});