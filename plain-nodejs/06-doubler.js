const fs = require('fs').promises;

async function doubleIt() {
    console.log("Starting the multiplier...");
    try {
        const data = await fs.readFile('count.txt', 'utf8');
        console.log("I read the number:", data);

        const number = parseInt(data);
        const doubled = number * 2;
        console.log("Doubled number will be:", doubled);

        await fs.writeFile('count.txt', doubled.toString());

            console.log(`Changed ${number} to ${doubled}`);
    } catch (error) {
        console.log("Oops! Something went wrong:", error);
    }
}

doubleIt();
console.log("I called the function!");
