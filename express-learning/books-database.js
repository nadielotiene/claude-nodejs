const Database = require('better-sqlite3');

// Create/open database file
const db = new Database('books.db');

// Create books table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS books (
        id INTERGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        year INTEGER NOT NULL,
        read INTEGER DEFAULT 0
    )
`);

console.log('📚 Database initialized!');

module.exports = db;