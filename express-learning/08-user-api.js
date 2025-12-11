const express = require('express');
const app = express();

app.use(express.json());

// Our "database" - just an array in memory for now
let users = [
    { id: 1, name: "Kenny", age: 37, city: "Rio Grande" },
    { id: 2, name: "Sarah", age: 28, city: "San Juan" },
    { id: 3, name: "Alex", age: 32, city: "Ponce" },
];

// ID counter  for new users
let nextId = 4;

// Add this BEFORE your API routes
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>User API Tester</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 50px auto;
                    padding: 20px;
                    background: #f5f5f5;
                }
                .section {
                    background: white;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                button {
                    padding: 10px 20px;
                    margin: 5px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
                button:hover {
                    background: #5568d3;
                }
                input, select {
                    padding: 8px;
                    margin: 5px;
                    border: 2px solid #ddd;
                    border-radius: 5px;
                }
                #result {
                    margin-top: 20px;
                    padding: 15px;
                    background: #f0f0f0;
                    border-radius: 5px;
                    white-space: pre-wrap;
                    font-family: monospace;
                }
            </style>
        </head>
        <body>
            <h1>👥 User API Tester</h1>
            
            <div class="section">
                <h2>📖 Get All Users</h2>
                <button onclick="getAllUsers()">Get All Users</button>
            </div>
            
            <div class="section">
                <h2>🔍 Get One User</h2>
                <input type="number" id="getUserId" placeholder="User ID">
                <button onclick="getOneUser()">Get User</button>
            </div>
            
            <div class="section">
                <h2>➕ Create User</h2>
                <input type="text" id="createName" placeholder="Name">
                <input type="number" id="createAge" placeholder="Age">
                <input type="text" id="createCity" placeholder="City">
                <button onclick="createUser()">Create User</button>
            </div>
            
            <div class="section">
                <h2>✏️ Update User</h2>
                <input type="number" id="updateId" placeholder="User ID">
                <input type="text" id="updateName" placeholder="New Name">
                <input type="number" id="updateAge" placeholder="New Age">
                <input type="text" id="updateCity" placeholder="New City">
                <button onclick="updateUser()">Update User</button>
            </div>
            
            <div class="section">
                <h2>🗑️ Delete User</h2>
                <input type="number" id="deleteId" placeholder="User ID">
                <button onclick="deleteUser()">Delete User</button>
            </div>
            
            <div id="result"></div>
            
            <script>
                async function getAllUsers() {
                    const response = await fetch('/api/users');
                    const data = await response.json();
                    document.getElementById('result').textContent = JSON.stringify(data, null, 2);
                }
                
                async function getOneUser() {
                    const id = document.getElementById('getUserId').value;
                    const response = await fetch('/api/users/' + id);
                    const data = await response.json();
                    document.getElementById('result').textContent = JSON.stringify(data, null, 2);
                }
                
                async function createUser() {
                    const name = document.getElementById('createName').value;
                    const age = document.getElementById('createAge').value;
                    const city = document.getElementById('createCity').value;
                    
                    const response = await fetch('/api/users', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, age: parseInt(age), city })
                    });
                    
                    const data = await response.json();
                    document.getElementById('result').textContent = JSON.stringify(data, null, 2);
                    getAllUsers();
                }
                
                async function updateUser() {
                    const id = document.getElementById('updateId').value;
                    const name = document.getElementById('updateName').value;
                    const age = document.getElementById('updateAge').value;
                    const city = document.getElementById('updateCity').value;
                    
                    const response = await fetch('/api/users/' + id, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, age: parseInt(age), city })
                    });
                    
                    const data = await response.json();
                    document.getElementById('result').textContent = JSON.stringify(data, null, 2);
                    getAllUsers();
                }
                
                async function deleteUser() {
                    const id = document.getElementById('deleteId').value;
                    
                    const response = await fetch('/api/users/' + id, {
                        method: 'DELETE'
                    });
                    
                    const data = await response.json();
                    document.getElementById('result').textContent = JSON.stringify(data, null, 2);
                    getAllUsers();
                }
            </script>
        </body>
        </html>
    `);
});

// READ - GET all users
app.get('/api/users', (req, res) => {
    res.json({
        count: users.length,
        users: users,
    });
});

// READ - GET one user by ID
app.get('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id); // Find one item

    if (!user) {
        return res.status(404).json({
            error: "User not found",
            id: id
        });
    }

    res.json(user)
});

// CREATE - Add a new user
app.post('/api/users', (req, res) => {
    const { name, age, city } = req.body;

    // Validate input
    if (!name || !age || !city) {
        return res.status(400).json({
            error: "Missing required fields",
            required: ["name", "age", "city"]
        });
    }

    // Create new user
    const newUser = {
        id: nextId++,
        name: name,
        age: age,
        city: city,
    };

    users.push(newUser); // Add user to end

    res.status(201).json({
        message: "User created successfully",
        user: newUser,
    });
});

// UPDATE - Update an existing user
app.put('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, age, city } = req.body;

    // Find the user
    const userIndex = users.findIndex(u => u.id === id); // Find position of item

    if (userIndex  === -1) {
        return res.status(404).json({
            error: "User not found",
            id: id
        });
    }

    // UPDATE the user
    users[userIndex] = {
        id: id,
        name: name || users[userIndex].name,
        age: age || users[userIndex].age,
        city: city || users[userIndex].city
    };

    res.json({
        message: "User updated successfully",
        user: users[userIndex]
    });
});

// DELETE - Remove a user
app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({
            error: "User not found",
            id: id
        });
    }

    const deletedUser = users[userIndex];
    users.splice(userIndex, 1); // Remove item at position

    res.json({
        message: "User deleted successfully",
        user: deletedUser
    });
});

app.listen(3000, () => {
    console.log('👥 User API running at http://localhost:3000/');
    console.log('Endpoints:');
    console.log('  GET    /api/users      - Get all users');
    console.log('  GET    /api/users/:id  - Get one user');
    console.log('  POST   /api/users      - Create user');
    console.log('  PUT    /api/users/:id  - Update user');
    console.log('  DELETE /api/users/:id  - Delete user');
});
