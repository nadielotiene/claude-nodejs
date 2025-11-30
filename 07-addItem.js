const fs = require('fs').promises;

fs.readFile('shopping.txt', 'utf8')
    .then((data) => {
        console.log("I read the list:", data);
        const newList = data + '\nChocolate\nBanana';
        console.log("the new items will be:", newList);

        return fs.writeFile('shopping.txt', newList)
    })
    .then(() => {
        console.log("✅ Success! Check shopping.txt");
    })
    .catch((error) => {
        console.log("Oops! Something went wrong:", error);
    })
