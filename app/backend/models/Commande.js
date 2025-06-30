const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Commande = sequelize.define('Commande', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_fournisseur: DataTypes.INTEGER,
    id_entrepot: DataTypes.INTEGER,
    date_commande: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'en attente'
    }
}, {
    tableName: 'commande',
    timestamps: false
});

module.exports = Commande;
