const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 4000;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database('recipe_app.db');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Handle form submission to add a new recipe
app.post('/addRecipe', (req, res) => {
    const { recipeName, cuisine, description, instructions, time } = req.body;

    // Insert the recipe into the 'recipes' table
    const sql = `INSERT INTO recipes (name, cuisine, description, instructions, time) VALUES (?, ?, ?, ?, ?)`;
    const values = [recipeName, cuisine, description, instructions, time];

    db.run(sql, values, (err) => {
        if (err) {
            console.error('Error inserting recipe:', err);
            res.status(500).send('Error adding the recipe.');
        } else {
            console.log('Recipe inserted successfully');
            res.status(200).send('Recipe added successfully.');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
