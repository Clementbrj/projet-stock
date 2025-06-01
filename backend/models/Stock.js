const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Import des modèles liés
const Entrepot = require('./Entrepot');
const Produit = require('./Produit');

const Stock = sequelize.define('Stock', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_entrepot: { type: DataTypes.INTEGER },
    id_produit: { type: DataTypes.INTEGER },
    quantite: { type: DataTypes.INTEGER },
    valeur: { type: DataTypes.FLOAT },
    date_maj: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'stock',
    timestamps: false
});

// 👇 Ajoute les associations
Stock.belongsTo(Entrepot, { foreignKey: 'id_entrepot', as: 'entrepot' });
Stock.belongsTo(Produit, { foreignKey: 'id_produit', as: 'produit' });

module.exports = Stock;
