const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'recipe_app.db', // Your SQLite database file
});

module.exports = sequelize;