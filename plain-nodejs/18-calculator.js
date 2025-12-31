const http = require('http');
const fs = require('fs').promises;

const server = http.createServer(async (request, response) => {
    const method = request.method;
    const url = request.url;

    // Serve CSS
    if (request.url === '/18-style.css') {
        try {
            const css = await fs.readFile('18-style.css', 'utf8');
            response.writeHead(200, {'Content-Type': 'text/css; charset=utf-8'});
            response.end(css);
            return;
        } catch (error) {
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.end('CSS file not found');
            return;
        }
    }
    
    // Show the calculator form (GET request)
    if (url === '/' && method ==='GET') {
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="/18-style.css">
                <title>Calculator</title>
            </head>
            <body>
                <h1>🧮 Calculator</h1>
                <form method="POST" action="/submit">
                    <label>Enter first Number</label>
                    <input type="number" name="num1" required>
                    <select name="operation">
                        <option value="add">➕</option>
                        <option value="subtract">➖</option>
                        <option value="multiply">✖️</option>
                        <option value="divide">➗</option>
                    </select>
                    <label>Enter second Number</label>
                    <input type="number" name="num2" required>
                    <button type="submit">🟰</button>
                </form>
            </body>
            </html>
        `;

        response.end(html);
    }

    // Handle the calculation (POST request)
    else if (url === '/submit' && method === 'POST') {
        let body = '';
        
        // Collect chunks
        request.on('data', (chunk) => {
            body += chunk.toString();
            console.log('Receiving data', chunk.toString());
        })
        
        // ALL code that uses the data goes HERE!
        // Parse data
        // Do calculations
        // Send response
        request.on('end', () => {
            console.log('Complete data:', body);
            
            // Parse the form data
            const params = new URLSearchParams(body);  
            const num1 = parseFloat(params.get('num1'));
            const num2 = parseFloat(params.get('num2'));
            const operation = params.get('operation');
            
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
                result = num1 / num2;
                symbol = '÷';
            } else {
                result = 'Error';
                symbol = '';
            }
    
            // Send the result page
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            
            const html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="stylesheet" href="/18-style.css">
                    <title>Calculator</title>
                </head>
                <body>
                    <div class="result">
                        <h1>🧮 Calculator</h1>
                        <h2>Result</h2>
                        <p class="calculation">${num1} ${symbol} ${num2} = <strong>${result}</strong></p>
                        <a href="/">← Calculate Again</a>
                    </div>
                </body>
                </html>
            `;
            response.end(html);
        });
    }
        
    // 404 for everything else
    else {
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end('404 - Page not found');
    }

});

server.listen(3000, () => {
    console.log('🚀 Server running at http://localhost:3000/');
});