const http = require('http');

const server = http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>My First Server</title>
        </head>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
            <h1>🎉 Welcome to My Server!</h1>
            <p>This is HTML served by Node.js!</p>
            <button onclick="alert('Hello from the browser!')">Click Me!</button>
        </body>
        </html>
    `;

    response.end(html);
});

server.listen(3000, () => {
    console.log('🚀 Server running at http://localhost:3000/');
});