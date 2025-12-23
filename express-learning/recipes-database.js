const Database = require('better-sqlite3');
const db = new Database('recipes.db');

db.pragma('foreign_keys = ON');

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TEXT NOT NULL
    )    
`);

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
        user_id INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )    
`);

const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (userCount.count === 0) {
    const insertUser = db.prepare(`
        INSERT INTO users (username, email, created_at)
        VALUES (?, ?, ?)
    `);

    insertUser.run('john_chef', 'john@recipes.com', new Date().toISOString());
    insertUser.run('maria_cook', 'maria@recipes.com', new Date().toISOString());
    insertUser.run('alex_baker', 'alex@recipes.com', new Date().toISOString());

    console.log('✅ Sample users created!');
}

console.log('📚 Database initialized!');
module.exports = db;
