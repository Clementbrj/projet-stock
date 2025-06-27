# API StockManager – Documentation

Cette API Express + Sequelize permet la gestion des entités suivantes : **Entrepôt**, **Fournisseur**, **Produit**, **Stock**, **Commande**, **FournisseurProduit**.

---

## Configuration

- **Port** : `3100`
- **Base de données** : Sequelize + MySQL
- **Format JSON** requis pour toutes les requêtes `POST` et `PUT`

---

## Endpoints

### Entrepôt

| Méthode | URL | Description |
|--------|-----|-------------|
| `POST` | `/entrepot/create` | Créer un entrepôt |
| `GET` | `/entrepot/read` | Lister les entrepôts |
| `PUT` | `/entrepot/update/:id` | Modifier un entrepôt |
| `DELETE` | `/entrepot/delete/:id` | Supprimer un entrepôt |

---

### Fournisseur

| Méthode | URL | Description |
|--------|-----|-------------|
| `POST` | `/fournisseur/create` | Créer un fournisseur |
| `GET` | `/fournisseur/read` | Lister les fournisseurs |
| `PUT` | `/fournisseur/update/:id` | Modifier un fournisseur |
| `DELETE` | `/fournisseur/delete/:id` | Supprimer un fournisseur |

---

### Produit

| Méthode | URL | Description |
|--------|-----|-------------|
| `POST` | `/produit/create` | Créer un produit |
| `GET` | `/produit/read` | Lister les produits |
| `PUT` | `/produit/update/:id` | Modifier un produit |
| `DELETE` | `/produit/delete/:id` | Supprimer un produit |

---

### Stock

| Méthode | URL | Description |
|--------|-----|-------------|
| `POST` | `/stock/create` | Créer une entrée de stock |
| `GET` | `/stock/read` | Lister les stocks (avec entrepôt + produit) |
| `PUT` | `/stock/update/:id` | Modifier une entrée de stock |
| `DELETE` | `/stock/delete/:id` | Supprimer une entrée de stock |

---

### Fournisseur ↔ Produit

| Méthode | URL | Description |
|--------|-----|-------------|
| `POST` | `/fournisseur-produit/create` | Créer une association |
| `GET` | `/fournisseur-produit/read` | Lister les associations |
| `DELETE` | `/fournisseur-produit/delete` | Supprimer une association (via `body`) |

#### Exemple de body pour DELETE :
\`\`\`json
{
  "id_fournisseur": 1,
  "id_produit": 3
}
\`\`\`

---

### Commande

| Méthode | URL | Description |
|--------|-----|-------------|
| `POST` | `/commande/create` | Créer une commande avec produits |
| `GET` | `/commande/read2` | Lister les commandes (détails inclus) |

#### Exemple de body pour créer une commande :
\`\`\`json
{
  "id_fournisseur": 1,
  "id_entrepot": 2,
  "produits": [
    { "id_produit": 4, "quantite": 10 },
    { "id_produit": 7, "quantite": 5 }
  ]
}
\`\`\`

---

## Test de l'API

- Tester via **Postman**, **Insomnia** ou `curl`
- Tous les endpoints attendent un `Content-Type: application/json`

---

## Stack technique

- Node.js + Express
- Sequelize (ORM)
- MySQL
- Middleware : `cors`, `express.json()`
- Architecture en routes séparées
- Associations définies avec alias (`as: 'produits'`, etc.)


<div align="center">
  <img src="img.png" alt="coucou" width="256" height="256"/>
</div>
