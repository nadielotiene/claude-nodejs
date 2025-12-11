const express = require('express');
const app = express();

// This let's us read JSON from POST requests,
// without this req.body would be undefined.
app.use(express.json());

// Test page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Calculator API Tester</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 500px;
                    margin: 50px auto;
                    padding: 20px;
                }
                input, select, button {
                    width: 100%;
                    padding: 10px;
                    margin: 10px 0;
                    font-size: 16px;
                }
                button {
                    background: #667eea;
                    color: white;
                    border: none;
                    cursor: pointer;
                }
                #result {
                    margin-top: 20px;
                    padding: 20px;
                    background: #f0f0f0;
                    border-radius: 10px;
                }
            </style>
        </head>
        <body>
            <h1>🧮 Calculator API Tester</h1>
            
            <input type="number" id="num1" placeholder="First number">
            
            <select id="operation">
                <option value="add">Add</option>
                <option value="subtract">Subtract</option>
                <option value="multiply">Multiply</option>
                <option value="divide">Divide</option>
            </select>
            
            <input type="number" id="num2" placeholder="Second number">
            
            <button onclick="calculate()">Calculate</button>
            
            <div id="result"></div>
            
            <script>
                async function calculate() {
                    const num1 = parseFloat(document.getElementById('num1').value);
                    const num2 = parseFloat(document.getElementById('num2').value);
                    const operation = document.getElementById('operation').value;
                    
                    try {
                        const response = await fetch('/api/calculate', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ num1, num2, operation })
                        });
                        
                        const data = await response.json();
                        
                        if (response.ok) {
                            document.getElementById('result').innerHTML = 
                                '<h2>Result: ' + data.result + '</h2>' +
                                '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                        } else {
                            document.getElementById('result').innerHTML = 
                                '<h2 style="color: red;">Error</h2>' +
                                '<p>' + data.error + '</p>';
                        }
                    } catch (error) {
                        document.getElementById('result').innerHTML = 
                            '<h2 style="color: red;">Error</h2>' +
                            '<p>' + error.message + '</p>';
                    }
                }
            </script>
        </body>
        </html>
    `);
});

// Calculator endponit
app.post('/api/calculate', (req, res) => {
    // Get data from the requiest body
    const { num1, num2, operation } = req.body;

    // Validate input
    if (!num1 || !num2 || !operation) {
        return res.status(400).json({
            error: "Missing required fileds",
            required: ["num1", "num2", "operation"]
        });
    }

    let result;

    if (operation === 'add') {
        result = num1 + num2;
    } else if (operation === 'subtract') {
        result = num1 - num2;
    } else if (operation === 'multiply') {
        result = num1 * num2;
    } else if (operation === 'divide') {
        if (num2 === 0) {
            return res.status(400).json({
                error: "Cannot divide by zero"
            });
        }
        result = num1 / num2;
    } else {
        return res.status(400).json({
            error: "Invalid operation",
            validOperations: ["add", "subtract", 
                "multiply", "divide"]
        });
    }

    // Send back the result
    res.json({
        num1: num1,
        num2: num2,
        operation: operation,
        result: result,
        timestamp: new Date(),
    });
});

app.listen(3000, () => {
    console.log('🧮 Calculator API running at http://localhost:3000/');
});