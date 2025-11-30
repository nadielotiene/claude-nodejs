/**
 * Create a program that:

 - Reads a file containing a number
 - Adds 10 to that number
 - Writes the new number to a different file

This combines file reading, processing, and file writing!
Hint: You'll need fs.readFile() and fs.writeFile(). 
Look up how to use writeFile in the Node.js documentation or 
try experimenting!
 */
const fs = require('fs');

fs.readFile('number.txt', 'utf8', (error, data) => {
    if (error) {
        console.log("Error reading:", error);
        return;
    }
    const newNumber = parseInt(data) + 10;
    
    fs.writeFile('newNumber.txt', newNumber.toString(), (error, data) => {
        if (error) {
            console.log("Error writing:", error);
            return;
        }
        console.log("Success! Wrote:", newNumber);
    });
});
