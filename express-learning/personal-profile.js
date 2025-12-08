const express = require('express') ;
const app = express();

app.get('/', (req, res) => {
    res.send(`
        <h1>📖 Welcome to Kenny's Profile!</h1>
        <p>Learn more about me:</p>
        <ul>
            <li><a href="/name">Name</a></li>
            <li><a href="/number">Lucky Number</a></li>
            <li><a href="/hobbies">Hobbies</a></li>
        </ul>
    `);
});

app.get('/name', (req, res) => {
    res.send('<h1>👨🏾‍💻 My name is Kenny!</h1><p><a href="/">←Back to home</a></p>');
});

app.get('/number', (req, res) => {
    res.send('<h1>☄️ My lucky number is 7!</h1><p><a href="/">←Back to home</a></p>');
});

app.get('/hobbies', (req, res) => {
    res.send('<h1>💻 My favorite hobbie is programming!</h1><p><a href="/">←Back to home</a></p>');
});

app.use((req, res) => {
    res.status(404).send('<h1>404 - Page Not Found</h1><p><a href="/">←Back to home</a></p>');
})

app.listen(3000, () => {
    console.log('🚀 Express server running at http://localhost:3000/');
});