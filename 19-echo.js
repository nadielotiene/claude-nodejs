const http = require('http');

const server = http.createServer((request, response) => {
    const method = request.method;
    const url = request.url;

    if (url === '/' && method === 'GET') {
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Echo</title>
            </head>
            <body>
                <h1>🔊 Echo App</h1>
                <form method="POST" action="/echo">
                    <input type="text" name="message" placeholder="Say something..." required>
                    <button type="submit">Send</button>
                </form>
            </body>
            </html>
        `;

        response.end(html);
    }

    else if (url === '/echo' && method === 'POST') {
        let body = '';

        request.on('data', (chunk) => {
            body += chunk.toString();
        });

        request.on('end', () => {
            const params = new URLSearchParams(body);
            const message = params.get('message');

            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

            const html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Echo</title>
                </head>
                <body>
                    <h1>You said:</h1>
                    <p><strong>${message}</p>
                    <a href="/">← Go back</a>
                </body>
                </html>
            `;
            response.end(html);
        })
    }
    else {
        response.write(404, {'Content-Type': 'text/plain'});
        response.end('404');
    }
});

server.listen(3000, () => {
    console.log('🔊 Echo app running at http://localhost:3000/');
});