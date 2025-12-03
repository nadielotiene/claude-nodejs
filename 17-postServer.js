const http = require('http');
const fs = require('fs').promises;

const server = http.createServer(async (request, response) => {
    const method = request.method;
    const url = request.url;

    if (request.url === '/17-style.css') {
        try {
            const css = await fs.readFile('17-style.css', 'utf8');
            response.writeHead(200, {'Content-Type': 'text/css; charset=utf-8'});
            response.end(css);
            return;
        } catch (error) {
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.end('CSS file not found');
            return;
        }
    }

    // Show the form (GET request)
    if (url === '/' && method === 'GET') {
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="/17-style.css">
                <title>Name Form</title>
            </head>
            <body>
                <h1>👋 What's Your Name?</h1>
                <form method="POST" action="/submit">
                    <label>Enter your name:</label>
                    <input type="text" name="username" required>
                    <label>Enter your email:</label>
                    <input type="email" name="email" required>
                    <label>Enter a message:</label>
                    <textarea name="message" rows="5" cols="50" required></textarea>
                    <button type="submit">Submit</button>
                </form>
            </body>
            </html>
        `;
        response.end(html);
    }
    // Handle the form submission (POST request)
    else if (url === '/submit' && method === 'POST') {
        let body = '';

        // Collect data chunks
        request.on('data', (chunk) => {
            body += chunk.toString();
            console.log('Receiving data:', chunk.toString());
        })

        // When all data is received
        request.on('end', () => {
            console.log('Complete data:', body);

            // Parse the form data (it comes as: "username=Kenny")
            const params = new URLSearchParams(body);
            const username = params.get('username');
            const email = params.get('email');
            const message = params.get('message');

            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

            const html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="stylesheet" href="/17-style.css">
                    <title>Success!</title>
                </head>
                <body>
                    <div class="success">
                        <h1> Thanks, ${username}!</h1>
                        <p>We received your message:</p>
                        <blockquote>${message}</blockquote>
                        <p>We'll reply to: ${email}</p>
                        <a href="/">← Go Back</a>
                    </div>
                </body>
                </html>
            `;

            response.end(html);
        });
    }

    // 404 for everything else
    else {
        response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
        response.end('404 - Page not found');
    }

});

server.listen(3000, () => {
    console.log('🚀 Server running at http://localhost:3000/');
});