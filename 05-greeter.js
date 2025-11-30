const fs = require('fs');

fs.readFile('name.txt', 'utf8', (error, data) => {
    if (error) {
        console.log("Couldn't read the file!", error);
        return;
    }
    console.log(`Hello, ${data}! Welcome to Node.js!`)
})