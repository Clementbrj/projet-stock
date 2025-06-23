// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('filrouge2', 'tech', '12345', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
