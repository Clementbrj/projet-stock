const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Entrepot = sequelize.define('Entrepot', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nom: DataTypes.STRING,
    adresse: DataTypes.STRING,
    capacite: DataTypes.INTEGER
}, {
    tableName: 'entrepot',
    timestamps: false
});

module.exports = Entrepot;
