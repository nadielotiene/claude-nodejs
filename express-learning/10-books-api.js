const express = require('express');
const app = express();

app.use(express.json());

let books = [
    { id: 1, title: "The hobbit", author: "J.R.R Tolkien", year: 1937, read: false },
    { id: 2, title: "Mastery", author: "Robert Greene", year: 2012, read: true },
    { id: 3, title: "Eloquent JavaScript", author: "Marijn Haverbeke", year: 2011, read: false },
];

let nextId = 4;

app.get('/api/books', (req, res) => {
    const filter = req.query.filter;

    let filteredBooks = books;

    if (filter === 'read') {
        filteredBooks = books.filter(b => b.read === true);
    } else if (filter === 'unread') {
        filteredBooks = books.filter(b => b.read === false);
    }

    res.json({
        count: filteredBooks.length,
        books: filteredBooks
    });
});

app.get('/api/books/search', (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({
            error: "Search query required",
            example: "/api/books/search?q=hobbit"
        });
    }

    const results = books.filter(book => {
        const titleMatch = book.title.toLowerCase().includes(query.toLowerCase());
        const authorMatch = book.author.toLowerCase().includes(query.toLowerCase());
        return titleMatch || authorMatch;
    });

    res.json({
        query: query,
        count: results.length,
        results: results
    });
});

app.get('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const book = books.find(u => u.id === id);

    if (!book) {
        return res.status(404).json({
            error: "Book not found",
            id: id
        });
    }

    res.json(book)
});

app.post('/api/books', (req, res) => {
    const { title, author, year, read } = req.body;

    if (!title || !author || !year) {
        return res.status(400).json({
            error: "Missing required fields",
            required: ["title", "author", "year"]
        });
    }

    const newBook = {
        id: nextId++,
        title: title,
        author: author,
        year: year,
        read: read || false,
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book created successfully",
        book: newBook,
    });
});

app.put('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, author, year, read } = req.body;

    const bookIndex = books.findIndex(u => u.id === id);

    if (bookIndex === -1) {
        return res.status(404).json({
            error: "Book not found",
            id: id,
        });
    }

    // Update only provided fields
    if (title !== undefined) books[bookIndex].title = title;
    if (author !== undefined) books[bookIndex].author = author;
    if (year !== undefined) books[bookIndex].year = year;
    if (read !== undefined) books[bookIndex].read = read;

    res.json({
        message: "Book updated successfully",
        book: books[bookIndex]
    });
});

app.patch('/api/books/:id/toggle', (req, res) => {
    const id = parseInt(req.params.id);
    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            error: "Book not found"
        });
    }

    book.read = !book.read;

    res.json({
        message: "Book toggled",
        book: book
    });
});

app.delete('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const bookIndex = books.findIndex(u => u.id === id);

    if (bookIndex === -1) {
        return res.status(404).json({
            error: "Book not found",
            id: id
        });
    }

    const deletedBook = books[bookIndex];
    books.splice(bookIndex, 1);

    res.json({
        message: "Book deleted successfully",
        book: deletedBook,
    });
});

app.get('/api/stats', (req, res) => {
    const total = books.length;
    const read = books.filter(b => b.read).length;
    const unread = total - read;

    res.json({
        total: total,
        read: read,
        unread: unread,
        completionRate: total > 0 ? Math.round((read / total) * 100) : 0
    });
});

app.listen(3000, () => {
    console.log('📚 Books API running at http://localhost:3000/');
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
