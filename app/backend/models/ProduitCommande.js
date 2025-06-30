const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProduitCommande = sequelize.define('ProduitCommande', {
    id_commande: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    id_produit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    quantite: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'produit_commande',
    timestamps: false
});

module.exports = ProduitCommande;
