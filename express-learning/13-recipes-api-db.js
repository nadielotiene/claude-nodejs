const express = require('express');
const db = require('./recipes-database');

const app = express();
app.use(express.json());

const count = db.prepare('SELECT COUNT(*) as count FROM recipes').get();
if (count.count === 0) {
    const insert = db.prepare(`
        INSERT INTO recipes (title, ingredients, instructions, prep_time, 
            cook_time, servings, difficulty, favorite, created_at, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
    `);

    insert.run('Rice', 'water, rice, oil, salt', 'add ingredients, cook', 
        4, 20, 4, 'easy', 1, new Date().toISOString(), 1);
    insert.run('Beans', 'water, beans, oil, salt, seasoning', 'add ingredients, cook', 
        7, 30, 6, 'medium', 0, new Date().toISOString(), 2);
    insert.run('Pork Chops', 'Pork Chop, seasoning, oil', 'add ingredients, cook', 
        2, 10, 2, 'hard', 0, new Date().toISOString(), 1);

    console.log('🍚 New recipe added!');
}

app.get('/api/recipes', (req, res) => {
    const filter = req.query.filter;

    let query = `
        SELECT recipes.*, users.username AS author 
        FROM recipes 
        JOIN users ON recipes.user_id = users.id
    `;
    
    if (filter === 'easy') {
        query += " WHERE difficulty = 'easy'";
    } else if (filter === 'medium') {
        query += " WHERE difficulty = 'medium'";
    } else if (filter === 'hard') {
        query += " WHERE difficulty = 'hard'";
    } else if (filter === 'favorite') {
        query += " WHERE favorite = 1";
    } else if (filter === 'notFavorite') {
        query += " WHERE favorite = 0";
    }
    
    const recipes = db.prepare(query).all();

    res.json({
        count: recipes.length,
        recipes: recipes
    });
});

app.get('/api/recipes/search', (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({
            error: "Search query required",
            example: "/api/recipes/search?q=rice"
        });
    }

    const searchPattern = `%${query}%`;
    const results = db.prepare(`
        SELECT * FROM recipes
        WHERE title LIKE ? OR ingredients LIKE ?
    `).all(searchPattern, searchPattern);

    res.json({
        query: query,
        count: results.length,
        results: results
    });
});

app.get('/api/recipes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);

    if (!recipe) {
        return res.status(404).json({
            error: "Recipe not found",
            id: id
        });
    }

    res.json(recipe);
});

app.post('/api/recipes', (req, res) => {
    const { title, ingredients, instructions, prep_time, cook_time, 
        servings, difficulty, favorite } = req.body;

    if (!title || !ingredients || !instructions || !prep_time || 
        !cook_time || !servings || !difficulty || !favorite) {
        return res.status(400).json({
            error: "Missing required fields",
            required: ["title", "ingredients", "instructions", "prep_time", 
                "cook_time", "servings", "difficulty", "favorite"]
        });
    }

    const insert = db.prepare(`
        INSERT INTO recipes (title, ingredients, instructions, prep_time, 
        cook_time, servings, difficulty, favorite, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
    `);

    const result = insert.run(title, ingredients, instructions, prep_time, 
        cook_time, servings, difficulty, favorite ? 1 : 0, new Date().toISOString());

    const newRecipe = db.prepare
        ('SELECT * FROM recipes WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
        message: "Recipe created successfully",
        recipe: newRecipe
    });
});

app.put('/api/recipes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, ingredients, instructions, prep_time, 
        cook_time, servings, difficulty, favorite } = req.body;

    const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);

    if (!recipe) {
        return res.status(404).json({
            error: "Recipe not found",
            id: id
        });
    }

    const update = db.prepare(`
        UPDATE recipes
        SET title = ?, ingredients = ?, instructions = ?, prep_time = ?, 
            cook_time = ?, servings = ?, difficulty = ?, favorite = ?
        WHERE ID = ?    
    `);

    update.run(
        title !== undefined ? title : recipe.title,
        ingredients !== undefined ? ingredients : recipe.ingredients, 
        instructions !== undefined ? instructions : recipe.instructions, 
        prep_time !== undefined ? prep_time : recipe.prep_time, 
        cook_time !== undefined ? cook_time : recipe.cook_time, 
        servings !== undefined ? servings : recipe.servings, 
        difficulty !== undefined ? difficulty : recipe.difficulty, 
        favorite !== undefined ? favorite : recipe.favorite,
        id
    );

    const updateRecipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);

    res.json({
        message: "Recipe updated successfully",
        recipe: updateRecipe
    });
});

app.patch('/api/recipes/:id/toggle', (req, res) => {
    const id = parseInt(req.params.id);
    const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);

    if (!recipe) {
        return res.status(404).json({
            error: "Recipe not found"
        });
    }

    const newFavoriteStatus = recipe.favorite === 1 ? 0 : 1;

    db.prepare
        ('UPDATE recipes SET favorite = ? WHERE id = ?').run(newFavoriteStatus, id);

    const updateRecipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
    
    res.json({
        message: "Recipe toggled",
        recipe: updateRecipe
    });
});

app.delete('/api/recipes/:id',(req, res) => {
    const id = parseInt(req.params.id);
    const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);

    if (!recipe) {
        return res.status(404).json({
            error: "Recipe not found",
            id: id
        });
    }

    db.prepare('DELETE FROM recipes WHERE id = ?').run(id);

    res.json({
        message: "Recipe deleted successfully",
        recipe: recipe
    });
});

app.get('/api/stats', (req, res) => {
    const total = db.prepare('SELECT COUNT(*) as count FROM recipes').get().count;
    const favorite = db.prepare
        ('SELECT COUNT(*) as count FROM recipes WHERE favorite = 1').get().count;
    const notFavorite = total - favorite;

    res.json({
        total: total,
        favorite: favorite,
        notFavorite: notFavorite,
        completionRate: total > 0 ? Math.round((favorite / total) * 100) : 0
    });
});

app.listen(3000, () => {
    console.log('📚 Recipes API with Database running at http://localhost:3000/');
    console.log('\nEndpoints:');
    console.log('  GET    /api/recipes              - Get all recipes');
    console.log('  GET    /api/recipes?filter=...   - Filter recipes');
    console.log('  GET    /api/recipes/search?q=... - Search recipes');
    console.log('  GET    /api/recipes/:id          - Get one recipes');
    console.log('  POST   /api/recipes              - Create recipes');
    console.log('  PUT    /api/recipes/:id          - Update recipes');
    console.log('  PATCH  /api/recipes/:id/toggle   - Toggle completed status');
    console.log('  DELETE /api/recipes/:id          - Delete recipes');
    console.log('  GET    /api/stats                - Get statistics');
});