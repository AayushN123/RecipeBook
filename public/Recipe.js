// In your Recipe.js model file

const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Recipe = sequelize.define('Recipe', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cuisineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    time: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    indexes: [
        {
            unique: false,
            fields: ['name'], // Index on the 'name' column
        },
        {
            fields: ['cuisineId'], // Index on the 'cuisineId' column
        },
    ],
});

module.exports = Recipe;
