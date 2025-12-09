const express = require('express') ;
const app = express();

// Parse form data
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Name Form</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 500px;
                    margin: 50px auto;
                    padding: 20px;
                    background: #f0f0f0;
                }
                form {
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                }
                input, textarea, button {
                    width: 100%;
                    padding: 10px;
                    margin: 10px 0;
                    font-size: 16px;
                    border: 2px solid #ddd;
                    border-radius: 5px;
                    box-sizing: border-box;
                }
                button {
                    background: #667eea;
                    color: white;
                    border: none;
                    cursor: pointer;
                }
                button:hover {
                    background: #5568d3;
                }
            </style>
        </head>
        <body>
            <h1>📧 Contact Form</h1>
            <form method="POST" action="/submit">
                <label>Enter your name:</label>
                <input type="text" name="name" required>
                <label>Enter your email:</label>
                <input type="email" name="email" required>
                <label>Enter a message:</label>
                <textarea name="message" rows="5" cols="50" required></textarea>
                <button type="submit">Submit</button>
            </form>
        </body>
        </html>
    `);
});

// POST  Request
app.post('/submit', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Success!</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 500px;
                    margin: 50px auto;
                    padding: 20px;
                    text-align: center;
                }
                .success {
                    background: #d4edda;
                    color: #155724;
                    padding: 30px;
                    border-radius: 10px;
                button {
                    width: 100%;
                    padding: 10px;
                    margin: 10px 0;
                    font-size: 16px;
                    border: 2px solid #ddd;
                    border-radius: 5px;
                    box-sizing: border-box;
                    background-color: #155724;
                    color: white;
                    border: none;
                    cursor: pointer;
                }
                button:hover {
                    background-color: color: #155724;
                }
                a {
                text-decoration:  none;
                color: white;
                }
            </style>
        </head>
        <body>
            <div class="success">
                <h1>✅ Thanks, ${name}!</h1>
                <p>We received your message:</p>
                <blockquote>${message}</blockquote>
                <p>We'll reply to: ${email}</p>
                <button><a href="/">← Go Back</a></button>
            </div>
        </body>
        </html>
    `);
});

app.listen(3000, () => {
    console.log('🚀 Express server running at http://localhost:3000/');
});