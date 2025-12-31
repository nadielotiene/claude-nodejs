// Get the special promise version
const fs = require('fs').promises;

// Start the chain of promises
fs.readFile('number.txt', 'utf8')
    .then((data) => {
        // This runs when reading is done
        console.log("I read the number:", data);
        const oldNumber = parseInt(data);
        const newNumber = oldNumber + 10;
        console.log("New number will be:", newNumber);

        // Return another promise to write the file
        return fs.writeFile('newNumber.txt', newNumber.toString());
    })
    .then(() => {
        // This runs when writing is done
        console.log("✅ Success! Check newNumber.txt");
    })
    .catch((error) => {
        // If ANYTHING goes wrong, we end up here
        console.log("Oops! Something went wrong:", error);
    });

    console.log("📝 I started the process!");