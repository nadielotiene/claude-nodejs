const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/info', (req, res) => {
    res.json({
        name: "Kenny",
        age: 37,
        location: "Rio Grande",
    });
});

app.get('/api/hobbies', (req, res) => {
    res.json({
        hobbies: ["programming", "gaming", "learning"],
    });
});

app.get('/api/favorites', (req, res) => {
    res.json({
        food: ["mofongo", "tripletas", "alcapurrias", "sushi", "fried rice"],
        color: ["black", "blue", "gold"],
        number: 7,
        movies: ["The Godfather I & II", "Airplane", "Naked Gun 1-3"]
    });
});

app.get('/api/stats', (req, res) => {
    res.json({
        dreamProjects: ["JRPG", "anti-procrastination app", "videogames website", "something new, inovative"]
    });
});

app.get('/api/random-fact', (req, res) => {
    const facts = [
        "I'm learning Node.js!",
        "My lucky number is 7",
        "I want to build a JRPG someday",
        "Mofongo is my favorite food",
        "I'm from Rio Grande, Puerto Rico"
    ];

    const randomFact = facts[Math.floor(Math.random() * facts.length)];

    res.json({
        fact: randomFact,
        timestamp: new Date()
    });
});

app.listen(3000, () => {
    console.log('🌐 JSON API running at http://localhost:3000/');
});