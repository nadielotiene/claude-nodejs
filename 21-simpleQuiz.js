const http = require('http');

const server = http.createServer((request, response) => {
    const method = request.method;
    const url = request.url;

    if (url === '/' && method ==='GET') {
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Quiz</title>
                </head>
                <body>
                <h1>Quiz</h1>
                <form method="POST" action="/result">
                <label>What is 5 + 3?</label>
                    <input type="number" name="answer" required>
                    <button type="submit">Send</button>
                </form>
            </body>
            </html>
        `;
        response.end(html);
    }

    else if (url === '/result' && method === 'POST') {
        let body = '';

        request.on('data', (chunk) => {
            body += chunk.toString();
            console.log('Receiving data', chunk.toString());
        });

        request.on('end', () => {
            const params = new URLSearchParams(body);
            const userAnswer = parseInt(params.get('answer'));
            const correctAnswer = 8;

            const isCorrect = userAnswer === correctAnswer;

            // if (userAnswer === correctAnswer) {
            //     return "✅ Correct!";
            // } else {
            //     return "❌ Wrong! The answer is 8";
            // }

            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

            const html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Quiza</title>
                </head>
                <body>
                    <div class="${isCorrect ? 'correct' : 'wrong'}">
                        <h1>${isCorrect ? '✅' : '❌'}</h1>
                        <p>${isCorrect ? 'Correct!' : `Wrong! The answer is ${correctAnswer}`}</p>
                        <p>You answered: <strong>${userAnswer}</strong></p>
                        <a href="/">← Go back</a>
                    </div>
                </body>
                </html>
            `;
            response.end(html);
        })
    }
    else {
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end('404 - Page not found');
    }
});

server.listen(3000, () => {
    console.log('📝 Quiz App running at http://localhost:3000/');
});