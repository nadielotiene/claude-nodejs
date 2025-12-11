const express = require('express');
const app = express();

// Tell Express to parse JSON from request
app.use(express.json());

// Simple JSON endpoint
app.get('/api/hello', (req, res) => {
    res.json({
        message: "Hello from the API",
        timestamp: new Date(),
        success: true
    });
});

app.get('/api/user', (req, res) => {
    res.json({
        name: "Kenny",
        age: 25,
        hobbies: ["programming", "gaming"],
        location: "San Juan"
    });
});

// Math facts
app.get('/api/math', (req, res) => {
    res.json({
        pi: 3.14159,
        goldenRatio: 1.618,
        euler: 2.718
    });
});

app.listen(3000, () => {
    console.log('🌐 JSON API running at http://localhost:3000/');
});