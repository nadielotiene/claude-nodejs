const http = require('http');

const server = http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    response.end('Hello! Welcome to my server! 🎉');
});

server.listen(3000, () => {
    console.log('🚀 Server is running at http://localhost:3000/');
    console.log('Press Ctrl+C to stop the server');
});