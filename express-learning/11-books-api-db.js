const express = require('express');
const db = require('./books-database'); // import database

const app = express();
app.use(express.json());

// Insert some sample books (only if table is empty)
const count = db.prepare('SELECT COUNT(*) as count FROM books').get();
if (count.count === 0) {
    const insert = db.prepare(`
        INSERT INTO books (title, author, year, read)
        VALUES (?, ?, ?, ?)
    `);

    insert.run('The Hobbit', 'J.R.R. Tolkien', 1937, 0);
    insert.run('Mastery', 'Robert Greene', 2012, 1);
    insert.run('Eloquent JavaScript', 'Marijn Haverbeke', 2011, 0);

    console.log('📚 Sample books added!');
}

// GET all books (with optional filter)
app.get('/api/books', (req, res) => {
    const filter = req.query.filter;

    let query = 'SELECT * FROM books';
    let books;

    if (filter === 'read') {
        books = db.prepare(query + ' WHERE read = 1').all();
    } else if (filter === 'unread') {
        books = db.prepare(query + ' WHERE read = 0').all();
    } else {
        books = db.prepare(query).all();
    }

    res.json({
        count: books.length,
        books: books
    });
});

// SEARCH books
app.get('/api/books/search', (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({
            error: "Search query required",
            example: "/api/books/search?q=hobbit"
        });
    }

    const searchPattern = `%${query}%`;
    const results = db.prepare(`
        SELECT * FROM books
        WHERE title LIKE ? OR author LIKE ?
    `).all(searchPattern, searchPattern);

    res.json({
        query: query,
        count: results.length,
        results: results
    });
});

// GET one book
app.get('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(id);

    if (!book) {
        return res.status(404).json({
            error: "Book not found",
            id: id
        });
    }

    res.json(book);
});

// CREATE a book
app.post('/api/books', (req, res) => {
    const { title, author, year, read } = req.body;

    if (!title || !author || !year) {
        return res.status(400).json({
            error: "Missing required fields",
            required: ["title", "author", "year"]
        });
    }

    const insert = db.prepare(`
           INSERT INTO books (title, author, year, read)
           VALUES (?, ?, ?, ?) 
    `);

    const result = insert.run(title, author, year, read ? 1 : 0);

    const newBook = db.prepare('SELECT * FROM books WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
        message: "Book created successfully",
        book: newBook
    });
});

// UPDATE book
app.put('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, author, year, read } = req.body;

    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(id);

    if (!book) {
        return res.status(404).json({
            error: "Book not found",
            id: id
        });
    }

    const update = db.prepare(`
        UPDATE books
        SET title = ?, author = ?, year = ?, read = ?
        WHERE id = ?    
    `);

    update.run(
        title !== undefined ? title : book.title,
        author !== undefined ? author : book.author,
        year !== undefined ? year : book.year,
        read !== undefined ? (read ? 1 : 0) : book.read,
        id
    );

    const updatedBook = db.prepare('SELECT * FROM books WHERE id = ?').get(id);

    res.json({
        message: "Book updated successfully",
        book: updatedBook
    });
});

// TOGGLE read status
app.patch('/api/books/:id/toggle', (req, res) => {
    const id = parseInt(req.params.id);

    // ⚠️ WARNING: If you forget WHERE, it updates EVERY row!
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(id);

    if (!book) {
        return res.status(404).json({
            error:"Book not found"
        });
    }

    const newReadStatus = book.read === 1 ? 0 : 1;

    db.prepare('UPDATE books SET read = ? WHERE id = ?').run(newReadStatus, id);

    const updateBook = db.prepare('SELECT * FROM books WHERE id = ?').get(id);
    
    res.json({
        message: "Book toggled",
        book: updateBook
    });
});

// DELETE a book
app.delete('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);

    // ⚠️ WARNING: If you forget WHERE, it deletes EVERYTHING!
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(id);

    if (!book) {
        return res.status(404).json({
            error: "Book not found",
            id: id
        });
    }

    db.prepare('DELETE FROM books WHERE id = ?').run(id);

    res.json({
        message: "Book deleted successfully",
        book: book
    });
});

// GET statistics
app.get('/api/stats', (req, res) => {
    const total = db.prepare('SELECT COUNT(*) as count FROM books').get().count;
    const read = db.prepare('SELECT COUNT(*) as count FROM books WHERE read = 1').get().count;
    const unread = total - read;

    res.json({
        total: total,
        read: read,
        unread: unread,
        completionRate: total > 0 ? Math.round((read / total) * 100) : 0
    });
});

app.listen(3000, () => {
    console.log('📚 Books API with Database running at http://localhost:3000/');
    console.log('\nEndpoints:');
    console.log('  GET    /api/books              - Get all books');
    console.log('  GET    /api/books?filter=...   - Filter books');
    console.log('  GET    /api/books/search?q=... - Search books');
    console.log('  GET    /api/books/:id          - Get one book');
    console.log('  POST   /api/books              - Create book');
    console.log('  PUT    /api/books/:id          - Update book');
    console.log('  PATCH  /api/books/:id/toggle   - Toggle read status');
    console.log('  DELETE /api/books/:id          - Delete book');
    console.log('  GET    /api/stats              - Get statistics');
});