const sequelize = require('../config/database');

// Import des modèles
const Entrepot = require('./Entrepot');
const Produit = require('./Produit');
const Fournisseur = require('./Fournisseur');
const Stock = require('./Stock');
const Commande = require('./Commande');
const FournisseurProduit = require('./FournisseurProduit');
const ProduitCommande = require('./ProduitCommande');

// ====== ASSOCIATIONS ====== //

// --- Produit <-> Fournisseur (Many-to-Many)
Produit.belongsToMany(Fournisseur, {
    through: FournisseurProduit,
    foreignKey: 'id_produit',
    otherKey: 'id_fournisseur',
    as: 'fournisseurs'
});
Fournisseur.belongsToMany(Produit, {
    through: FournisseurProduit,
    foreignKey: 'id_fournisseur',
    otherKey: 'id_produit',
    as: 'produits'
});

// --- Stock <-> Entrepot
Entrepot.hasMany(Stock, {
    foreignKey: 'id_entrepot',
    as: 'stocks'
});
Stock.belongsTo(Entrepot, {
    foreignKey: 'id_entrepot',
    as: 'entrepot_stock'
});

// --- Stock <-> Produit
Produit.hasMany(Stock, {
    foreignKey: 'id_produit',
    as: 'stocks'
});
Stock.belongsTo(Produit, {
    foreignKey: 'id_produit',
    as: 'produit_stock'
});

// --- Fournisseur <-> Commande
Fournisseur.hasMany(Commande, {
    foreignKey: 'id_fournisseur',
    as: 'commandes_fournisseur'
});
Commande.belongsTo(Fournisseur, {
    foreignKey: 'id_fournisseur',
    as: 'fournisseur'
});

// --- Entrepot <-> Commande
Entrepot.hasMany(Commande, {
    foreignKey: 'id_entrepot',
    as: 'commandes'
});
Commande.belongsTo(Entrepot, {
    foreignKey: 'id_entrepot',
    as: 'entrepot'
});

// --- Commande <-> Produit (Many-to-Many via ProduitCommande)
Commande.belongsToMany(Produit, {
    through: ProduitCommande,
    foreignKey: 'id_commande',
    otherKey: 'id_produit',
    as: 'produits'
});
Produit.belongsToMany(Commande, {
    through: ProduitCommande,
    foreignKey: 'id_produit',
    otherKey: 'id_commande',
    as: 'commandes'
});

// ====== EXPORT DES MODÈLES ====== //
module.exports = {
    sequelize,
    Entrepot,
    Produit,
    Fournisseur,
    Stock,
    Commande,
    FournisseurProduit,
    ProduitCommande
};
