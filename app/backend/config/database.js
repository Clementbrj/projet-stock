// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('filrouge2', 'tech', 'App2025', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
