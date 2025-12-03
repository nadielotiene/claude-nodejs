const http = require('http');

const server = http.createServer((request, response) => {

    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

    const now = new Date();
    const month = now.toLocaleString('en', {month: 'long'});
    const weekday = now.toLocaleDateString('en', {weekday:'long'});
    const day = now.getDate();
    const year = now.getFullYear();
    const time = now.toLocaleTimeString();
    const fullDate = `Today is ${weekday}, ${month} ${day}, ${year}`
    

    let greeting = '';
    const greetingHour = now.getHours();
    
    if (greetingHour < 12) {
        greeting = '<p>🌅 Good Morning!</p>';
    } else if (greetingHour < 18) {
        greeting = '<p>🌞 Good Afternoon!</p>';
    } else {
        greeting = '<p>🌙 Good Evening!</p>';
    }


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


    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <!-- <meta http-equiv="refresh" content="1"> -->
            <title>Cronus</title>
            <style>
                html {
                    height: 100%;
                }

                body {
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 50px auto;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                h1, h2, h3, footer { 
                    color: pink; 
                }
                h2 {
                    font-size: 1rem;
                }
                ul {
                    list-style: none;
                    padding: 0;
                }
                p {
                    color: #333;
                    margin: 10px 0;
                    padding: 10px;
                    background: white;
                    border-radius: 5px;
                }
                p:hover {
                    background: #e0e0e0;
                }
                hr {
                    border: none;
                    border-top: 2px solid #777;
                    border-radius: 5px;
                }

                .contdown-display {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                    font-size: 2rem
                    
                }
                .countdown-number {
                    background: rgba(255, 255, 255, 0.2);
                    padding: 10px 20px;
                    border-radius: 10px;
                    font-weight: bold;
                    fonc-size: 2.5rem;
                    color: #ffd93d;
                }
                .countdown-label {
                    color: #e0e0e0;
                    font-size: 1rem;
                    opacity: 0.8;
                    margin-right: 15px;
                }

                footer {
                    text-align: center; 
                    margin-top: 30px;
                }
            </style>
        </head>
        <body>
            <h1>Cronus</h1>
            <h2>${greeting}</h2>
            <p class="date">🕰️ ${fullDate}, ${time}</p>
            <p class="date">🌉 San Francisco: ${sanFrancisco}</p>
            <p class="date">🗼 Tokyo: ${tokyo}</p>
            <p class="date">⚔️ Rome: ${rome}</p>
            <hr>
            <p>${paddedHours}:${paddedMinutes}:${paddedSeconds}</p>
            
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

            <hr>
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
})