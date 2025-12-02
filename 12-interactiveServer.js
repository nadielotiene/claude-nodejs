const http = require('http');

const server = http.createServer((request, response) => {
    const url = request.url;

    console.log(`Someone visited ${url}`);

    response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});

    if (url === '/') {
        response.end('Welcome to the homepage! 🏠');
    } else if (url === '/about') {
        response.end('This is the about page! 📖');
    } else if (url === '/hello') {
        response.end('Hello there, friend! 👋');
    } else {
        response.end('Page not found! Try /, /about, or /hello');
    }
});

server.listen(3000, () => {
    console.log('🚀 Server running at http://localhost:3000/');
});