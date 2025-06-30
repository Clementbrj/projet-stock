const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const port = 3100;
const sequelize = require('./config/database');
const {
  Entrepot,
  Fournisseur,
  Produit,
  Commande,
  ProduitCommande,
  Stock,
  FournisseurProduit
} = require('./models');

// Test connexion Sequelize
sequelize.authenticate()
    .then(() => console.log('Connexion Sequelize OK'))
    .catch((err) => console.error('Erreur Sequelize :', err));

// Routes
app.get('/', (req, res) => {
  res.status(200).send('API Sequelize prête');
});

/* ---------- ENTREPOT ---------- */
app.post('/entrepot/create', async (req, res) => {
  try {
    const entrepot = await Entrepot.create(req.body);
    res.status(201).json(entrepot);
  } catch (err) {
    res.status(500).send("Erreur Sequelize C-Entrepôt");
  }
});

app.get('/entrepot/read', async (req, res) => {
  try {
    const entrepots = await Entrepot.findAll({ order: [['nom', 'ASC']] });
    res.status(200).json(entrepots);
  } catch (err) {
    res.status(500).send("Erreur Sequelize R-Entrepôt");
  }
});

app.put('/entrepot/update/:id', async (req, res) => {
  try {
    const [updated] = await Entrepot.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).send("Entrepôt non trouvé");
    res.status(200).send("success");
  } catch (err) {
    res.status(500).send("Erreur Sequelize U-Entrepôt");
  }
});

app.delete('/entrepot/delete/:id', async (req, res) => {
  try {
    const deleted = await Entrepot.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).send("Entrepôt non trouvé");
    res.status(200).send("success");
  } catch (err) {
    res.status(500).send("Erreur Sequelize D-Entrepôt");
  }
});

/* ---------- FOURNISSEUR ---------- */
app.post('/fournisseur/create', async (req, res) => {
  try {
    const fournisseur = await Fournisseur.create(req.body);
    res.status(201).json(fournisseur);
  } catch (err) {
    res.status(500).send("Erreur Sequelize C-Fournisseur");
  }
});

app.get('/fournisseur/read', async (req, res) => {
  try {
    const fournisseurs = await Fournisseur.findAll({ order: [['nom', 'ASC']] });
    res.status(200).json(fournisseurs);
  } catch (err) {
    res.status(500).send("Erreur Sequelize R-Fournisseur");
  }
});

app.put('/fournisseur/update/:id', async (req, res) => {
  try {
    const [updated] = await Fournisseur.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).send("Fournisseur non trouvé");
    res.status(200).send("success");
  } catch (err) {
    res.status(500).send("Erreur Sequelize U-Fournisseur");
  }
});

app.delete('/fournisseur/delete/:id', async (req, res) => {
  try {
    const deleted = await Fournisseur.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).send("Fournisseur non trouvé");
    res.status(200).send("success");
  } catch (err) {
    res.status(500).send("Erreur Sequelize D-Fournisseur");
  }
});

/* ---------- PRODUIT ---------- */
app.post('/produit/create', async (req, res) => {
  try {
    const produit = await Produit.create(req.body);
    res.status(201).json(produit);
  } catch (err) {
    res.status(500).send("Erreur Sequelize C-Produit");
  }
});

app.get('/produit/read', async (req, res) => {
  try {
    const produits = await Produit.findAll({ order: [['nom', 'ASC']] });
    res.status(200).json(produits);
  } catch (err) {
    res.status(500).send("Erreur Sequelize R-Produit");
  }
});

app.put('/produit/update/:id', async (req, res) => {
  try {
    const [updated] = await Produit.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).send("Produit non trouvé");
    res.status(200).send("success");
  } catch (err) {
    res.status(500).send("Erreur Sequelize U-Produit");
  }
});

app.delete('/produit/delete/:id', async (req, res) => {
  try {
    const deleted = await Produit.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).send("Produit non trouvé");
    res.status(200).send("success");
  } catch (err) {
    res.status(500).send("Erreur Sequelize D-Produit");
  }
});

/* ---------- STOCK ---------- */
app.post('/stock/create', async (req, res) => {
  try {
    const stock = await Stock.create(req.body);
    res.status(201).json(stock);
  } catch (err) {
    res.status(500).send("Erreur Sequelize C-Stock");
  }
});

app.get('/stock/read', async (req, res) => {
  try {
    const stocks = await Stock.findAll({
      include: ['entrepot', 'produit'],
      order: [['date_maj', 'DESC']]
    });
    res.status(200).json(stocks);
  } catch (err) {
    res.status(500).send("Erreur Sequelize R-Stock");
  }
});

app.put('/stock/update/:id', async (req, res) => {
  try {
    const [updated] = await Stock.update(
        { ...req.body, date_maj: new Date() },
        { where: { id: req.params.id } }
    );
    if (!updated) return res.status(404).send("Stock non trouvé");
    res.status(200).send("success");
  } catch (err) {
    res.status(500).send("Erreur Sequelize U-Stock");
  }
});

app.delete('/stock/delete/:id', async (req, res) => {
  try {
    const deleted = await Stock.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).send("Stock non trouvé");
    res.status(200).send("success");
  } catch (err) {
    res.status(500).send("Erreur Sequelize D-Stock");
  }
});

/* ---------- FOURNISSEUR_PRODUIT ---------- */
app.post('/fournisseur-produit/create', async (req, res) => {
  try {
    const link = await FournisseurProduit.create(req.body);
    res.status(201).json(link);
  } catch (err) {
    res.status(500).send("Erreur Sequelize C-Fournisseur_Produit");
  }
});

app.get('/fournisseur-produit/read', async (req, res) => {
  try {
    const links = await FournisseurProduit.findAll({
      include: ['fournisseur', 'produit']
    });
    res.status(200).json(links);
  } catch (err) {
    res.status(500).send("Erreur Sequelize R-Fournisseur_Produit");
  }
});

app.delete('/fournisseur-produit/delete', async (req, res) => {
  try {
    const { id_fournisseur, id_produit } = req.body;
    const deleted = await FournisseurProduit.destroy({ where: { id_fournisseur, id_produit } });
    if (!deleted) return res.status(404).send("Lien non trouvé");
    res.status(200).send("success");
  } catch (err) {
    res.status(500).send("Erreur Sequelize D-Fournisseur_Produit");
  }
});

/* ---------- COMMANDE + PRODUIT_COMMANDE ---------- */
app.post('/commande/create', async (req, res) => {
  const { id_fournisseur, id_entrepot, produits } = req.body;

  if (!id_fournisseur || !id_entrepot || !produits || !Array.isArray(produits)) {
    return res.status(400).send("Champs manquants ou format invalide");
  }

  try {
    const commande = await Commande.create({
      id_fournisseur,
      id_entrepot,
      date_commande: new Date(),
      status: 'en attente'
    });

    const pcData = produits.map(p => ({
      id_commande: commande.id,
      id_produit: p.id_produit,
      quantite: p.quantite
    }));

    await ProduitCommande.bulkCreate(pcData);

    res.status(201).send("Commande créée avec succès");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur Sequelize C-Commande");
  }
});

app.get('/commande/read2', async (req, res) => {
  try {
    const commandes = await Commande.findAll({
      include: [
        {
          model: Fournisseur,
          as: 'fournisseur', // alias bien défini dans les associations
        },
        {
          model: Entrepot,
          as: 'entrepot', // alias correct dans index.js
        },
        {
          model: Produit,
          as: 'produits', // Many-to-Many avec alias 'produits'
          through: {
            attributes: ['quantite'], // récupère la quantité depuis ProduitCommande
          },
        }
      ],
      order: [['date_commande', 'DESC']]
    });

    res.status(200).json(commandes);
  } catch (err) {
    res.status(500).send("Erreur Sequelize R-Commande");
  }
});






app.put('/commande/update-status/:id', async (req, res) => {
  const { status } = req.body;

  try {
    const commande = await Commande.findByPk(req.params.id, {
      include: [
        { model: Produit, as: 'produits', through: { attributes: ['quantite'] } },
        { model: Entrepot, as: 'entrepot' }
      ]
    });

    if (!commande) return res.status(404).send("Commande non trouvée");

    await Commande.update({ status }, { where: { id: req.params.id } });

    if (status === 'reçue') {
      for (const produit of commande.produits) {
        const [stock, created] = await Stock.findOrCreate({
          where: {
            id_produit: produit.id,
            id_entrepot: commande.id_entrepot
          },
          defaults: {
            quantite: 0,
            date_maj: new Date()
          }
        });

        await stock.update({
          quantite: stock.quantite + produit.ProduitCommande.quantite,
          date_maj: new Date()
        });
      }
    }

    res.status(200).send("success");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur Sequelize U-Commande");
  }
});


app.delete('/commande/delete/:id', async (req, res) => {
  try {
    const deleted = await Commande.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).send("Commande non trouvée");
    res.status(200).send("success");
  } catch (err) {
    res.status(500).send("Erreur Sequelize D-Commande");
  }
});
/* ---------- FOURNISSEUR ---------- */
app.post('/fournisseur/create', async (req, res) => {
  try {
    const fournisseur = await Fournisseur.create(req.body);
    res.status(201).json(fournisseur);
  } catch (err) {
    res.status(500).send("Erreur Sequelize C-Fournisseur");
  }
});

app.get('/fournisseur/read', async (req, res) => {
  const sortBy = req.query.sortBy || 'nom'; // Valeur par défaut

  // Liste blanche des champs autorisés
  const allowedSortFields = ['nom', 'adresse'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'nom';

  console.log(`[BACK] Endpoint /fournisseur/read hit with sortBy = ${sortBy}`);

  try {
    const fournisseurs = await Fournisseur.findAll({
      order: [[sortField, 'ASC']]
    });

    console.log(`[BACK] Sorted result by ${sortField}:`, fournisseurs.map(f => f[sortField]));
    res.status(200).json(fournisseurs);
  } catch (err) {
    console.error("[BACK] Sequelize error:", err);
    res.status(500).send("Erreur Sequelize R-Fournisseur");
  }
});


app.put('/fournisseur/update/:id', async (req, res) => {
  try {
    const [updated] = await Fournisseur.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).send("Fournisseur non trouvé");
    res.status(200).send("success");
  } catch (err) {
    res.status(500).send("Erreur Sequelize U-Fournisseur");
  }
});

app.delete('/fournisseur/delete/:id', async (req, res) => {
  try {
    const deleted = await Fournisseur.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).send("Fournisseur non trouvé");
    res.status(200).send("success");
  } catch (err) {
    res.status(500).send("Erreur Sequelize D-Fournisseur");
  }
});
/* ---------- STOCK ---------- */
app.post('/stock/create', async (req, res) => {
  try {
    const stock = await Stock.create(req.body);
    res.status(201).json(stock);
  } catch (err) {
    res.status(500).send("Erreur Sequelize C-Stock");
  }
});

app.get('/stock/read', async (req, res) => {
  try {
    const stocks = await Stock.findAll({
      include: ['entrepot', 'produit'], // ⚠️ attention ici
      order: [['date_maj', 'DESC']]
    });
    res.status(200).json(stocks);
  } catch (err) {
    console.error(err); // Ajoute ceci
    res.status(500).send("Erreur Sequelize R-Stock");
  }
});


app.put('/stock/update/:id', async (req, res) => {
  try {
    const [updated] = await Stock.update(
        { ...req.body, date_maj: new Date() },
        { where: { id: req.params.id } }
    );
    if (!updated) return res.status(404).send("Stock non trouvé");
    res.status(200).send("success");
  } catch (err) {
    res.status(500).send("Erreur Sequelize U-Stock");
  }
});

app.delete('/stock/delete/:id', async (req, res) => {
  try {
    const deleted = await Stock.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).send("Stock non trouvé");
    res.status(200).send("success");
  } catch (err) {
    res.status(500).send("Erreur Sequelize D-Stock");
  }
});


app.put('/stock/update/:id', async (req, res) => {
  try {
    const [updated] = await Stock.update(
        { ...req.body, date_maj: new Date() },
        { where: { id: req.params.id } }
    );
    if (!updated) return res.status(404).send("Stock non trouvé");
    res.status(200).send("success");
  } catch (err) {
    res.status(500).send("Erreur Sequelize U-Stock");
  }
});

app.delete('/stock/delete/:id', async (req, res) => {
  try {
    const deleted = await Stock.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).send("Stock non trouvé");
    res.status(200).send("success");
  } catch (err) {
    res.status(500).send("Erreur Sequelize D-Stock");
  }
});


/* ---------- EXPRESS START ---------- */
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
