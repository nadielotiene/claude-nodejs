// Step 1: Get the toolbox that lets us read/write files
const fs = require('fs');

// Step 2: Read the file
fs.readFile('number.txt', 'utf8', (error, data) => {
    // This function runs LATER when the file is done reading
    
    // Did something go wrong?
    if (error) {
        console.log("Oops! Couldn't find the file:", error);
        return; // Stop here
    }

    // We got the number! Let's add 10
    console.log("I read the number:", data);
    const oldNumber = parseInt(data); // Turn "5" into 5
    const newNumber = oldNumber + 10;  // 5 + 10 = 15
    console.log("New number will be:", newNumber);

    // Now write it to a new file
    fs.writeFile('newNumber.txt', newNumber.toString(), (error) => {
        // This function runs LATER when writing is done

        if (error) {
            console.log("Oops! Couldn't write the file:", error);
            return;
        }

        console.log("✅ Success! Check newNumber.txt");
    });
});

console.log("📝 I started the process!");

/*
```

**Run it:** `node solution1-callbacks.js`

**What you'll see:**
```
📝 I started the process!
I read the number: 5
New number will be: 15
✅ Success! Check newNumber.txt
*/