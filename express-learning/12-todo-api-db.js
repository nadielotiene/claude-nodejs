const express = require('express');
const db = require('./todos-database');

const app = express();
app.use(express.json());

const count = db.prepare('SELECT COUNT(*) as count FROM todos').get();
if (count.count === 0) {
    const insert = db.prepare(`
        INSERT INTO todos (title, completed, createdAt)
        VALUES (?, ?, ?)
    `);

    insert.run('Learn Node.js', 1, new Date().toISOString());
    insert.run('Build and API', 1, new Date().toISOString());
    insert.run('Master Databases', 0, new Date().toISOString());

    console.log('☑️ New task added');
}

app.get('/api/todos', (req, res) => {
    const filter = req.query.filter;

    let query = 'SELECT * FROM todos';
    let todos;

    if (filter === 'completed') {
        todos = db.prepare(query + ' WHERE completed = 1').all();
    } else if (filter === 'active') {
        todos = db.prepare(query + ' WHERE completed = 0').all();
    } else {
        todos = db.prepare(query).all();
    }

    res.json({
        count: todos.length,
        todos: todos
    });
});

app.get('/api/todos/search', (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({
            error: "Search query required",
            example: "/api/todos/search?q=study"
        });
    }

    const searchPattern = `%${query}%`;
    const results = db.prepare(`
        SELECT * FROM todos
        WHERE title LIKE ?
    `).all(searchPattern);

    res.json({
        query: query,
        results: results.length,
        results: results
    });
});

app.get('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);

    if (!todo) {
        return res.status(404).json({
            error: "Todo not found",
            id: id
        });
    }

    res.json(todo);
});

app.post('/api/todos', (req, res) => {
    const { title, completed, createdAt } = req.body;

    if (!title) {
        return res.status(400).json({
            error: "Missing required fields",
        });
    }

    const insert = db.prepare(`
        INSERT INTO todos (title, completed, createdAt)
        VALUES (?, ?, ?)
    `);

    const result = insert.run(title, completed ? 1 : 0, new Date().toISOString());

    const newTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
        message: "Task created successfully",
        todo: newTodo
    });
});

app.put('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, completed } = req.body;

    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);

    if (!todo) {
        return res.status(404).json({
            error: "Task not found",
            id: id
        });
    }

    const update = db.prepare(`
        UPDATE todos
        SET title = ?, completed = ?
        WHERE id = ?    
    `);

    update.run(
        title !== undefined ? title : todo.title,
        completed !== undefined ? completed : todo.completed,
        id
    );

    const updatedTask = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);

    res.json({
        message: "Task updated successfully",
        todo: updatedTask
    });
});

app.patch('/api/todos/:id/toggle', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);

    if (!todo) {
        return res.status(404).json({
            error:"Task not found"
        });
    }

    const newCompletedStatus = todo.completed === 1 ? 0 : 1;

    db.prepare('UPDATE todos SET completed = ? WHERE id = ?').run(newCompletedStatus, id);

    const updatedTask = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);

    res.json({
        message: "checkmark toggled",
        todo: updatedTask
    });
});

app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);

    if (!todo) {
        return res.status(404).json({
            error: "Task not found",
            id: id
        });
    }

    db.prepare('DELETE FROM todos WHERE id = ?').run(id);

    res.json({
        message: "Task deleted successfully",
        todo: todo
    });
});

app.get('/api/stats', (req, res) => {
    const total = db.prepare('SELECT COUNT(*) as count FROM todos').get().count;
    const completed = db.prepare('SELECT COUNT(*) as count FROM todos WHERE completed = 1').get().count;
    const active = total - completed;

    res.json({
        total: total,
        completed: completed,
        active: active,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    });
});

app.listen(3000, () => {
    console.log('📚 Todos API with Database running at http://localhost:3000/');
    console.log('\nEndpoints:');
    console.log('  GET    /api/todos              - Get all todos');
    console.log('  GET    /api/todos?filter=...   - Filter todos');
    console.log('  GET    /api/todos/search?q=... - Search todos');
    console.log('  GET    /api/todos/:id          - Get one todos');
    console.log('  POST   /api/todos              - Create todos');
    console.log('  PUT    /api/todos/:id          - Update todos');
    console.log('  PATCH  /api/todos/:id/toggle   - Toggle completed status');
    console.log('  DELETE /api/todos/:id          - Delete todos');
    console.log('  GET    /api/stats              - Get statistics');
});