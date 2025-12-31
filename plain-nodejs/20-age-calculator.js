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
                <title>Age calculator</title>
            </head>
            <body>
                <h1>⏳ Age Calculator</h1>
                <form method="POST" action="/submit">
                    <label>What year were you born?</label>
                    <br>
                    <input type="number" name="birthYear" placeholder="What's your day of birth" required>
                    <button type="submit">Calculate</button>
                </form>
            </body>
            </html>
        `;

        response.end(html);
    }

    else if (url === '/submit' && method === 'POST') {
        let body = '';

        request.on('data', (chunk) => {
            body += chunk.toString();
        });

        request.on('end', () => {

            const params = new URLSearchParams(body);
            const birthYear = parseFloat(params.get('birthYear'));
            const currentYear = new Date().getFullYear();;
            const age = currentYear - birthYear;

            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

            const html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Age calculator</title>
                </head>
                <body>
                    <p>You where born in <strong>${birthYear}</strong>, you are <strong>${age}</strong> years old!</p>
                    <a href="/">← Go back</a>
                </body>
                </html>
            `;
            response.end(html);
        });
    }
    else{
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end('404');
    }
});

server.listen(3000, () => {
    console.log('👴🏾 Age Calculator app running at http://localhost:3000/');
})