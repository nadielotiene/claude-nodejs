const fs = require('fs');

fs.readFile('02-message.txt', 'utf8', (error, data) => {
    if (error) {
        console.log("Oops, couildn't read the file");
        return;
    }
    console.log("File contents: ", data);
});

console.log("I asked to read the file!");