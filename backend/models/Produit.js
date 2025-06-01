const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Produit = sequelize.define('Produit', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nom: DataTypes.STRING,
    prix: DataTypes.FLOAT,
}, {
    tableName: 'produit',
    timestamps: false
});

module.exports = Produit;
