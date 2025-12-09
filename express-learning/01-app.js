const express = require('express') ;
const app = express();

// Homepage
app.get('/', (req, res) => {
    res.send(`
        <h1>🏠 Welcome to my Express App!</h1>
        <p>Visit these pages:</p>
        <ul>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/hello/Kenny">Say Hello</a></li>
        </ul>
    `);
});

// About page
app.get('/about', (req, res) => {
    res.send('<h1>📖 About Me</h1><p>I am Learning Express!</p>');
});

// Contact page
app.get('/contact', (req, res) => {
    res.send('<h1>📧 Contact Me</h1><p>Email: kenny@example.com</p>');
});

// Dynamic route with parameter
app.get('/hello/:name', (req, res) => {
    const name = req.params.name;
    res.send(`<h1>👋 Hello, ${name}</h1>`);
});

// 404 - Must be LAST!
app.use((req, res) => {
    res.status(404).send('<h1>404 - Page Not Found</h1>');
})

// Start the server
app.listen(3000, () => {
    console.log('🚀 Express server running at http://localhost:3000/');
});