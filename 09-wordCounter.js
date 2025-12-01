/* 
Create `wordCounter.js` that:
   - Reads the file
   - Counts the words (hint: use `.split(' ')` to break text into words)
   - Prints: `This file has X words!`

**Super Challenge:** Also count how many times the letter 'e' appears!
*/

const fs = require('fs').promises;

async function wordCounter() {
    try {
        const data = await fs.readFile('story.txt', 'utf8');
        console.log("I read the story:", data);

        const wordSplit = data.split(' ');
        const wordCount = wordSplit.length;
        console.log("The word count is:", wordCount);

        const letterE = data.toLowerCase().split('e').length -1;
        console.log(`The letter 'e' appears ${letterE} times!`);

        const result = `Words: ${wordCount}\nLetter 'e': ${letterE}`;
        await fs.writeFile('wordCount.txt', result);

        console.log(`This file has ${wordCount} words!`)
    } catch (error) {
        console.log("Oops! Something went wrong:", error);
    }
}

wordCounter();