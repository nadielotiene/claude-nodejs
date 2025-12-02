const http = require('http');

const server = http.createServer((request, response) => {
    const url = request.url;

    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

    let content = '';

    if (url === '/') {
        content = `
            <h1>📖 Welcome to Kenny's Profile!</h1>
            <p>Learn more about me:</p>
            <ul>
                <li><a href="/name">My Name</a></li>
                <li><a href="/number">Lucky Number</a></li>
                <li><a href="/hobbies">Hobbies</a></li>
            </ul>
        `;
    } else if (url === '/name') {
        content = '<h1>👨🏾‍💻 My name is Kenny!</h1><p><a href="/">←Back to home</a></p>';
    } else if (url === '/number') {
        content = '<h1> ☄️ My lucky number is 7!</h1><p><a href="/">←Back to home</a></p>';
    } else if (url === '/hobbies') {
        content = '<h1>💻 My favorite hobbie is programming!</h1><p><a href="/">←Back to home</a></p>';
    } else {
        content = '<h1>❌ Page not found! Try /, /name, /number, or /hobbies</h1><p><a href="/">←Go home</a></p>';
    }
    
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Kenny's Profile</title>
        <style>
            body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
            }
            h1 { color: #333; }
            a { color: #0066cc; text-decoration: none; }
            a:hover { text-decoration: underline; }
            ul {
                list-style: none;
                padding: 0;
            }
            li {
                margin: 10px 0;
                padding: 10px;
                background: white;
                border-radius: 5px;
            }
            li:hover {
                background: #e0e0e0;
            }
        </style>
    </head>
    <body>
        ${content}
        <hr>
        <footer style="text-align: center; color: #666; margin-top: 30px;">
            Made with ❤️ by Kenny
        </footer>
    </body>
    </html>
    `;
    
    response.end(html);
});

server.listen(3000, () => {
    console.log('🚀 Server running at http://localhost:3000/');
});