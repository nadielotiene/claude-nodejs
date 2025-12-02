const http = require('http');

const server = http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});

    const data = {
        message: 'Hello from the API!',
        timestamp: new Date(),
        visitors: 42,
        isAwasome: true,
    };

    response.end(JSON.stringify(data));
});

server.listen(3000, () => {
    console.log('🚀 API server running at http://localhost:3000/');
});