const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Our todos database
let todos = [
    { id: 1, title: "Learn Node.js", completed: true, createdAt: new Date() },
    { id: 2, title: "Build and API", completed: true, createdAt: new Date() },
    { id: 3, title: "Master Express", completed: false, createdAt: new Date() },
];

let nextId = 4;

// GET all todos (with optional filter)
app.get('/api/todos', (req, res) =>{
    const filter = req.query.filter; // gives ?filter=completed

    let filteredTodos = todos;

    if (filter === 'completed') {
        filteredTodos = todos.filter(t => t.completed === true);
    } else if (filter === 'active') {
        filteredTodos = todos.filter(t => t.completed === false);
    }

    res.json({
        count: filteredTodos.length,
        todos: filteredTodos
    });
});

// GET one todo
app.get('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);

    if (!todo) {
        return res.status(404).json({
            error: "Todo not found"
        });
    }

    res.json(todo);
});

// CREATE a new todo
app.post('/api/todos', (req, res) => {
    const { title } = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    const newTodo = {
        id: nextId++,
        title: title.trim(),
        completed: false,
        createdAt: new Date()
    };

    todos.push(newTodo);

    res.status(201).json({
        message: "Todo created",
        todo: newTodo
    });
});

// UPDATE a todo
app.put('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, completed } = req.body;

    const todoIndex = todos.findIndex(t => t.id === id);

    if (todoIndex === -1) {
        return res.status(404).json({
            error: "Todo not found"
        });
    }
    
    // Update fields if provided
    if (title !== undefined) {
        todos[todoIndex].title = title.trim();
    }
    if (completed !== undefined) {
        todos[todoIndex].completed = completed;
    }

    res.json({
        message: "Todo updated",
        todo: todos[todoIndex]
    });
});

// TOGGLE todo completion
app.patch('/api/todos/:id/toggle', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);

    if (!todo) {
        return res.status(404).json({
            error: "Todo not found"
        });
    }

    todo.completed = !todo.completed;

    res.json({
        message: "Todo toggled",
        todo: todo
    });
});

// DELETE a todo
app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todoIndex = todos.findIndex(t => t.id === id);

    if (todoIndex === -1) {
        return res.status(404).json({
            error: "Todo not found"
        });
    }

    const deletedTodo = todos[todoIndex];
    todos.splice(todoIndex, 1);

    res.json({
        message: "Todo deleted",
        todo: deletedTodo
    });
});

// DELETE all completed todos
app.delete('/api/todos/completed/all', (req, res) => {
    const completedCount = todos.filter(t => t.completed).length;
    todos = todos.filter(t => !t.completed);

    res.json({
        message: `Deleted ${completedCount} completed todos`,
        remaining: todos.length
    });
});

// GET statistics
app.get('/api/stats', (req, res) => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;

    res.json({
        total: total,
        completed: completed,
        active: active,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    });
});

app.listen(3000, () => {
    console.log('📝 Todo API running at http://localhost:3000/');
    console.log('\nEndpoints:');
    console.log('  GET    /api/todos              - Get all todos');
    console.log('  GET    /api/todos?filter=...   - Filter todos');
    console.log('  GET    /api/todos/:id          - Get one todo');
    console.log('  POST   /api/todos              - Create todo');
    console.log('  PUT    /api/todos/:id          - Update todo');
    console.log('  PATCH  /api/todos/:id/toggle   - Toggle completion');
    console.log('  DELETE /api/todos/:id          - Delete todo');
    console.log('  DELETE /api/todos/completed/all - Delete all completed');
    console.log('  GET    /api/stats              - Get statistics');

});