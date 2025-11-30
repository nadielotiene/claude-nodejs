// Get the special promise version
const fs = require('fs').promises;

// Create a special async function (it can use "await")
async function changeNumber() {
    try {
        // WAIT for the file to be read
        const data = await fs.readFile('number.txt', 'utf8');
        console.log("I read the number:", data);

        // Do the math
        const oldNumber = parseInt(data);
        const newNumber = oldNumber + 10;
        console.log("New number will be:", newNumber);

        // WAIT for the file to be written
        await fs.writeFile('newNumber.txt', newNumber.toString());

        console.log("✅ Success! Check newNumber.txt");
    } catch (error) {
        // If anything goes wrong, we end up here
        console.log("Oops! Something went wrong:", error);
    }
}

// Actually run our function!
changeNumber();

console.log("📝 I started the process!");

// This is the **easiest to read**! The `await` keyword means 
// "wait here until this finishes before moving to the next line."