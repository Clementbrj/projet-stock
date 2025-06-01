const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fournisseur = sequelize.define('Fournisseur', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nom: DataTypes.STRING,
    adresse: DataTypes.STRING,
}, {
    tableName: 'fournisseur',
    timestamps: false
});

module.exports = Fournisseur;
