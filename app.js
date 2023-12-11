const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 4000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = new sqlite3.Database('recipe_app.db');

// Route for adding a new recipe
app.post('/addRecipe', (req, res) => {
    const { recipeName, cuisineId, time } = req.body;

    const sql = 'INSERT INTO Recipes (name, cuisineId, time) VALUES (?, ?, ?)';
    const values = [recipeName, cuisineId, time];

    db.run(sql, values, (err) => {
        if (err) {
            console.error('Error adding recipe:', err);
            res.status(500).send('Error adding the recipe.');
        } else {
            console.log('Recipe added successfully');
            res.redirect('/');
        }
    });
});

// Route for deleting a recipe
app.delete('/deleteRecipe/:recipeId', (req, res) => {
    const recipeId = req.params.recipeId;

    const sql = 'DELETE FROM Recipes WHERE id = ?';
    const values = [recipeId];

    db.run(sql, values, (err) => {
        if (err) {
            console.error('Error deleting recipe:', err);
            res.status(500).json({ error: 'Error deleting recipe.' });
        } else {
            console.log('Recipe deleted successfully');
            res.sendStatus(204); // No content, successful deletion
        }
    });
});

// Route for filtering recipes
app.get('/filterRecipes', (req, res) => {
    const { filterCuisine } = req.query;

    let sql;
    let values;

    if (filterCuisine && filterCuisine !== 'all') {
        sql = 'SELECT * FROM Recipes WHERE cuisineId = ?';
        values = [filterCuisine];
    } else {
        sql = 'SELECT * FROM Recipes';
        values = [];
    }

    // Use prepared statement
    const stmt = db.prepare(sql);
    stmt.all(values, (err, recipes) => {
        stmt.finalize();
        if (err) {
            console.error('Error fetching recipes:', err);
            res.status(500).send('Error fetching recipes.');
        } else {
            res.status(200).json(recipes);
        }
    });
});

// Your existing code...

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
