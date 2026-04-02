const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // lets you read req.body

const store = {}; // your in-memory database

function generateCode() {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

app.post('/shorten', (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "url is required" });
    }

    const code = generateCode();
    store[code] = url;

    res.status(201).json({ shortUrl: `http://localhost:3000/${code}` });
    
});

app.get('/:code', (req, res) => {
    const original = store[req.params.code];

    if (!original) {
        return res.status(404).json({ error: "Short URL not found" });
    }

    res.redirect(301, original);
});

app.listen(port, () => {
    console.log(`URL Shorten app listening on port ${port}`)
})
