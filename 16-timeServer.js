const http = require('http');
const fs = require('fs').promises;

const server = http.createServer(async (request, response) => {

    // Handle CSS files
    if (request.url === '/16-styles.css') {
        try {
            const css = await fs.readFile('16-styles.css', 'utf8');
            response.writeHead(200, {'Content-Type': 'text/css; charset=utf-8'});
            response.end(css);
            return;
        } catch (error) {
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.end('CSS file not found');
            return;
        }
    } 

    // Set HTML headers
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

    // Date data
    const now = new Date();
    const month = now.toLocaleString('en', {month: 'long'});
    const weekday = now.toLocaleDateString('en', {weekday:'long'});
    const day = now.getDate();
    const year = now.getFullYear();
    const time = now.toLocaleTimeString();
    const fullDate = `Today is ${weekday}, ${month} ${day}, ${year}`
    

    // Greeting data
    let greeting = '';
    const greetingHour = now.getHours();
    
    if (greetingHour < 12) {
        greeting = '<p>🌅 Good Morning!</p>';
    } else if (greetingHour < 18) {
        greeting = '<p>🌞 Good Afternoon!</p>';
    } else {
        greeting = '<p>🌙 Good Evening!</p>';
    }


    // World Clocks
    const sanFrancisco = now.toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle:'h12',
    });
    
    const tokyo = now.toLocaleString('ja-JP', {
        timeZone: 'Asia/Tokyo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle:'h12',
    });
    
    const rome = now.toLocaleString('it-IT', {
        timeZone: 'Europe/Rome',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle:'h12',
    });

    // Countdown
    const midnight = new Date();
    midnight.setDate(midnight.getDate() + 1);
    midnight.setHours(0, 0, 0, 0);
    const diff = midnight - now;

    const hoursUntilMidnight = Math.floor(diff / (1000 * 60 * 60));
    const minutesUntilMidnight = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secondsUntilMidnight = Math.floor((diff % (1000 * 60)) / 1000);

    const paddedHours = String(hoursUntilMidnight).padStart(2, '0');
    const paddedMinutes = String(minutesUntilMidnight).padStart(2, '0');
    const paddedSeconds = String(secondsUntilMidnight).padStart(2, '0');


    // HTML
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <!-- <meta http-equiv="refresh" content="1"> -->
            <link rel="stylesheet" href="/16-styles.css">
            <title>Cronus</title>
        </head>
        <body>
            <h1>Cronus</h1>
            <h2>${greeting}</h2>
            <p class="date">🕰️ ${fullDate}</p>
            <p class="date">📍 Current Location: ${time}</p>
            <p class="date">🌉 San Francisco: ${sanFrancisco}</p>
            <p class="date">🗼 Tokyo: ${tokyo}</p>
            <p class="date">⚔️ Rome: ${rome}</p>
            <hr>            
            <div class="countdown">
                <h3>⏳ Countdown to Midnight:</h3>
                <div class="countdown-display">
                    <span class="countdown-number">${paddedHours}</span>
                    <span class="countdown-label">hours</span>
                    <span class="countdown-number">${paddedMinutes}</span>
                    <span class="countdown-label">minutes</span>
                    <span class="countdown-number">${paddedSeconds}</span>
                    <span class="countdown-label">seconds</span>
                </div>
            </div>

            <footer>
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