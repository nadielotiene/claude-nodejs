const express = require('express') ;
const app = express();

// Serve Static Flies
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href="/css/04-style.css">
            <title>Name Form</title>
        </head>
        <body>
        <form method="POST" action="/submit">
                <h1>
                    <img class="calculator" src="/images/calculator.png" alt="Calculator">
                Calculator</h1>
                <label>Enter first Number</label>
                <input type="number" name="num1" required>
                <select name="operation">
                    <option value="add">➕</option>
                    <option value="subtract">➖</option>
                    <option value="multiply">✖️</option>
                    <option value="divide">➗</option>
                </select>
                <br>
                <label>Enter second Number</label>
                <input type="number" name="num2" required>
                <button type="submit">Calculate 🟰</button>
            </form>
        </body>
        </html>
    `);
});

// POST  Request
app.post('/submit', (req, res) => {
    const num1 = parseFloat(req.body.num1);
    const num2 = parseFloat(req.body.num2);
    const operation = req.body.operation;

    // Do the calculation
    let result;
    let symbol;

    if (operation === 'add') {
        result = num1 + num2;
        symbol = '+';
    } else if (operation === 'subtract') {
        result = num1 - num2;
        symbol = '-';
    } else if (operation === 'multiply') {
        result = num1 * num2;
        symbol = '×';
    } else if (operation === 'divide') {
        if (num2 === 0) {
            result = 'Cannot divide by zero!';
            symbol = '÷';
        } else {
            result = num1 / num2;
            symbol = '÷';
        }
    } else {
        result = 'Error';
        symbol = '';
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="icon" type="image/x-icon" href="/favicon.ico">
            <link rel="stylesheet" href="/css/04-style.css">
            <title>Success!</title>
        </head>
        <body>
            <div class="result">
                <h1>
                    <img class="calculator" src="/images/calculator.png" alt="Calculator">
                Calculator</h1>
                <h2>Result</h2>
                <p class="calculation">${num1} ${symbol} ${num2} = <strong>${result}</strong></p>
                <a href="/">← Calculate Again</a>
            </div>
        </body>
        </html>
    `);
});

app.listen(3000, () => {
    console.log('🚀 Express server running at http://localhost:3000/');
});