const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const Recipe = require('./public/Recipe'); 
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

app.delete('/deleteRecipe/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM Recipes WHERE id = ?';
    const values = [id];

    db.run(sql, values, (err) => {
        if (err) {
            console.error('Error deleting recipe:', err);
            res.status(500).send('Error deleting the recipe.');
        } else {
            console.log('Recipe deleted successfully');
            res.sendStatus(200);
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

app.put('/updateRecipe/:id', (req, res) => {
    const { id } = req.params;
    const { recipeName, cuisineId, time } = req.body;

    const sql = 'UPDATE Recipes SET name = ?, cuisineId = ?, time = ? WHERE id = ?';
    const values = [recipeName, cuisineId, time, id];

    db.run(sql, values, (err) => {
        if (err) {
            console.error('Error updating recipe:', err);
            res.status(500).send('Error updating the recipe.');
        } else {
            console.log('Recipe updated successfully');
            res.redirect('/');
        }
    });
});

app.put('/updateRecipe/:id', async (req, res) => {
    const { id } = req.params;
    const { recipeName, cuisineId, time } = req.body;

    try {
        const recipe = await Recipe.findByPk(id);

        if (!recipe) {
            return res.status(404).send('Recipe not found');
        }

        recipe.name = recipeName;
        recipe.cuisineId = cuisineId;
        recipe.time = time;

        await recipe.save();

        console.log('Recipe updated successfully');
        res.sendStatus(200);
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).send('Error updating the recipe.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
