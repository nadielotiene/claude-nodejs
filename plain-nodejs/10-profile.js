const fs = require('fs').promises;

async function profile() {
    try {
        const name = await fs.readFile('name.txt', 'utf8');
        console.log("I read the name:", name);
        
        const number = await fs.readFile('number.txt', 'utf8');
        console.log("I read the number:", number);

        const luckyNumber = parseInt(number);
        const doubleLucky = luckyNumber * 2;
        console.log("I read the multiplied number:", doubleLucky);

        const profileInfo = `Name: ${name}\nLucky Number: ${luckyNumber}\nDouble Lucky Number: ${doubleLucky}`;

        await fs.writeFile('profile.txt', profileInfo);

        console.log("✅ Profile created! Check profile.txt");

    } catch (error) {
      console.log("Oops! Something went wrong:", error);
    } 
}

profile();