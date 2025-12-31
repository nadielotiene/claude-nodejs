const fs = require('fs').promises;

async function convertTemp() {
    try {
        const data = await fs.readFile('celsius.txt', 'utf8');
        console.log(`The temperature in celsius is ${data}˚C`);

        const celsius = parseInt(data);
        const fahrenheit = (celsius * 9/5) + 32;
        console.log(`The temperature in Fahrenheit is ${fahrenheit}˚F`);

        const message = `${celsius}˚C is equal to ${fahrenheit}˚F`

        await fs.writeFile('result.txt', message);

        console.log(`${celsius}˚C is equal to ${fahrenheit}˚F`);
    } catch (error) {
        console.log("Oops! Something went wrong:", error);
    }
}

convertTemp();