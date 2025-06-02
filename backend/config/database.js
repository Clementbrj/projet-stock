// config/database.js
const { Sequelize } = require('sequelize');

// MySQL login
const sequelize = new Sequelize('filrouge', 'tech', 'App2025', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
