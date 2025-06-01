const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FournisseurProduit = sequelize.define('FournisseurProduit', {
    id_fournisseur: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    id_produit: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
}, {
    tableName: 'fournisseur_produit',
    timestamps: false
});

module.exports = FournisseurProduit;
