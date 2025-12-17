const Database = require('better-sqlite3');

const db = new Database('recipes.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL,
        prep_time INTEGER NOT NULL,
        cook_time INTEGER NOT NULL,
        servings INTEGER NOT NULL,
        difficulty TEXT NOT NULL,
        favorite INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
    )    
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TEXT NOT NULL
    )    
`);

console.log('📚 Database initialized!')

module.exports = db;


// recipes table:
// - id (auto-increment)
// - title (required)
// - ingredients (text - required)
// - instructions (text - required)
// - prep_time (minutes - required)
// - cook_time (minutes - required)
// - servings (number - required)
// - difficulty (easy/medium/hard - required)
// - favorite (boolean - default false)
// - created_at (timestamp)