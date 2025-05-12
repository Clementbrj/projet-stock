// config serveur
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
app.use(cors());
const port = 3100;

// config MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'tech',
  password: 'App2025',
  database: 'filrouge'
});

// liaison Express - MySQL
db.connect((err) => {
  if (err) {
    console.error('Connexion MySQL ', err);
    return;
  }
});

app.use(express.json());

/* ------------------
    Routes
-------------------*/
// Route par défaut
app.get('/', (req, res) => {
  res.status(200).send('Liaison MySQL active');
});

// --
// Entrepôt
// --
//  Create---------------------------------------
app.post('/entrepot/create', (req, res) => {
  const { nom, adresse, capacite } = req.body;

  if (!nom || !adresse || !capacite) {
    return res.status(400).send("Le nom, l'adresse et la capacité de l'entrepôt sont obligatoires");
  }

  const query = 'INSERT INTO entrepot (nom, adresse, capacite) VALUES (?, ?, ?)';

  db.query(query, [nom, adresse, capacite], (err, result) => {
    if (err) {
      return res.status(500).send('Problème MySQL C-Entrepôt');
    }

    res.status(200).json({ id: result.insertId, nom, adresse, capacite });
  });
});

// Read---------------------------------------
app.get('/entrepot/read', (req, res) => {
  const sortBy = req.query.sortBy || 'nom';
  const query = `SELECT * FROM entrepot ORDER BY ${sortBy} ASC`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Problème MySQL R-Entrepôt');
    }

    res.status(200).json(results); 
  });
});

// Update---------------------------------------
app.put('/entrepot/update/:id', (req, res) => {
  const { id } = req.params;
  const { nom, adresse, capacite } = req.body;

  if (!nom || !adresse || !capacite) {
    return res.status(400).send('Tous les champs sont requis');
  }

  const query = 'UPDATE entrepot SET nom = ?, adresse = ?, capacite = ? WHERE id = ?';

  db.query(query, [nom, adresse, capacite, id], (err) => {
    if (err) {
      return res.status(500).send('Problème MySQL U-Entrepôt');
    }

    res.status(200).send("success");
  });
});

// Delete---------------------------------------
app.delete('/entrepot/delete/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM entrepot WHERE id = ?';

  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).send('Problème MySQL D-Entrepôt');
    }

    res.status(200).send("success");
  });
});

// --
// Fournisseur
// --
// Create---------------------------------------
app.post('/fournisseur/create', (req, res) => {
  const { nom, adresse } = req.body;  // Utilise req.body

  if (!nom || !adresse) {
    return res.status(400).send("Le nom et l'adresse du fournisseur sont obligatoires");
  }

  const query = 'INSERT INTO fournisseur (nom, adresse) VALUES (?, ?)';

  db.query(query, [nom, adresse], (err, result) => {
    if (err) {
      return res.status(500).send('Problème MySQL C-Fournisseur');
    }

    res.status(200).json({ id: result.insertId, nom, adresse });
  });
});

// Read---------------------------------------
app.get('/fournisseur/read', (req, res) => {
  const sortBy = req.query.sortBy || 'nom';
  const query = `SELECT * FROM fournisseur ORDER BY ${sortBy} ASC`;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Problème MySQL R-Fournisseur');
    }
    res.status(200).json(results); 
  });
});  

// Update---------------------------------------
app.put('/fournisseur/update/:id', (req, res) => {
  const { id } = req.params;
  const { nom, adresse } = req.body;

  if (!nom || !adresse) {
    return res.status(400).send('Tous les champs sont requis');
  }

  const query = 'UPDATE fournisseur SET nom = ?, adresse = ? WHERE id = ?';

  db.query(query, [nom, adresse, id], (err) => {
    if (err) {
      return res.status(500).send('Problème MySQL U-Fournisseur');
    }

    res.status(200).send("success");
  });
});

// Delete---------------------------------------
app.delete('/fournisseur/delete/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM fournisseur WHERE id = ?';

  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).send('Problème MySQL D-Fournisseur');
    }

    res.status(200).send("success");
  });
});
// --
// Produit
// --

// Create---------------------------------------
app.post('/produit/create', (req, res) => {
  const { nom, prix } = req.body;

  if (!nom || prix == null) {
    return res.status(400).send("Le nom et le prix du produit sont obligatoires");
  }

  const query = 'INSERT INTO produit (nom, prix) VALUES (?, ?)';

  db.query(query, [nom, prix], (err) => {
    if (err) {
      return res.status(500).send('Problème MySQL C-Produit');
    }

    res.status(200).send("success");
  });
});

// Read---------------------------------------
app.get('/produit/read', (req, res) => {
  const query = 'SELECT * FROM produit';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Problème MySQL R-Produit');
    }

    res.status(200).json(results);
  });
});

// Update---------------------------------------
app.put('/produit/update/:id', (req, res) => {
  const { id } = req.params;
  const { nom, prix } = req.body;

  if (!nom || prix == null) {
    return res.status(400).send('Tous les champs sont requis');
  }

  const query = 'UPDATE produit SET nom = ?, prix = ? WHERE id = ?';

  db.query(query, [nom, prix, id], (err) => {
    if (err) {
      return res.status(500).send('Problème MySQL U-Produit');
    }

    res.status(200).send("success");
  });
});

// Delete---------------------------------------
app.delete('/produit/delete/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM produit WHERE id = ?';

  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).send('Problème MySQL D-Produit');
    }

    res.status(200).send("success");
  });
});
// --
// Commande
// --

// Create---------------------------------------
app.post('/commande/create', (req, res) => {
  const { id_fournisseur, id_entrepot, produits } = req.body;

  if (!id_fournisseur || !id_entrepot || !produits || !Array.isArray(produits)) {
    return res.status(400).send("Champs manquants ou format invalide");
  }

  const insertCommande = 'INSERT INTO commande (id_fournisseur, id_entrepot, date_commande, status) VALUES (?, ?, NOW(), "en attente")';

  db.query(insertCommande, [id_fournisseur, id_entrepot], (err, result) => {
    if (err) return res.status(500).send("Erreur création commande");

    const id_commande = result.insertId;

    const values = produits.map(p => [id_commande, p.id_produit, p.quantite]);
    const insertProduits = 'INSERT INTO produit_commande (id_commande, id_produit, quantite) VALUES ?';

    db.query(insertProduits, [values], (err2) => {
      if (err2) return res.status(500).send("Erreur ajout produits");

      res.status(200).send("Commande créée avec succès");
    });
  });
});

// Read---------------------------------------
app.get('/commande/read', (req, res) => {
  const query =
    `SELECT
      c.id,
      c.id_produit,
      f.nom AS fournisseur,
      p.nom AS produit,
      c.quantite,
      c.date_commande
    FROM commande c
           JOIN fournisseur f ON c.id_fournisseur = f.id
           JOIN produit p ON c.id_produit = p.id
    ORDER BY c.date_commande DESC`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Problème MySQL R-Commande');
    }

    res.status(200).json(results);
  });
});

// Read2---------------------------------------
app.get('/commande/read2', (req, res) => {
  const query =
    `SELECT c.id AS id_commande, f.nom AS fournisseur, e.nom AS entrepot, c.date_commande, c.status,
           p.nom AS produit, pc.quantite
    FROM commande c
    JOIN fournisseur f ON c.id_fournisseur = f.id
    JOIN entrepot e ON c.id_entrepot = e.id
    JOIN produit_commande pc ON c.id = pc.id_commande
    JOIN produit p ON pc.id_produit = p.id
    ORDER BY c.date_commande DESC`;

  db.query(query, (err, results) => {
    if (err) return res.status(500).send("Erreur lecture commande");

    res.status(200).json(results);
  });
});

// Update order status
app.put('/commande/update-status/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).send("Statut requis");
  }

  const query = 'UPDATE commande SET status = ? WHERE id = ?';

  db.query(query, [status, id], (err) => {
    if (err) {
      return res.status(500).send('Problème MySQL U-Commande');
    }

    res.status(200).send("success");
  });
});

// Delete---------------------------------------
app.delete('/commande/delete/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM commande WHERE id = ?';

  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).send('Problème MySQL D-Commande');
    }

    res.status(200).send("success");
  });
});

// --
// Stock
// --

// Create---------------------------------------
app.post('/stock/create', (req, res) => {
  const { id_entrepot, id_produit, quantite, valeur } = req.body;

  if (!id_entrepot || !id_produit || quantite == null || valeur == null) {
    return res.status(400).send("Tous les champs sont requis");
  }

  const query =
    `INSERT INTO stock (id_entrepot, id_produit, quantite, valeur)
    VALUES (?, ?, ?, ?)`;

  db.query(query, [id_entrepot, id_produit, quantite, valeur], (err) => {
    if (err) {
      return res.status(500).send('Problème MySQL C-Stock');
    }

    res.status(200).send("success");
  });
});

// Read---------------------------------------
app.get('/stock/read', (req, res) => {
  const query =
    `SELECT
      s.id,
      s.id_produit,
      e.nom AS entrepot,
      p.nom AS produit,
      s.quantite,
      s.valeur,
      s.date_maj
    FROM stock s
           JOIN entrepot e ON s.id_entrepot = e.id
           JOIN produit p ON s.id_produit = p.id
    ORDER BY s.date_maj DESC`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Problème MySQL R-Stock');
    }

    res.status(200).json(results);
  });
});

// Update---------------------------------------
app.put('/stock/update/:id', (req, res) => {
  const { id } = req.params;
  const { quantite, valeur } = req.body;

  if (quantite == null || valeur == null) {
    return res.status(400).send("Quantité et valeur sont requis");
  }

  const query =
    `UPDATE stock SET quantite = ?, valeur = ?, date_maj = CURRENT_TIMESTAMP
    WHERE id = ?`;

  db.query(query, [quantite, valeur, id], (err) => {
    if (err) {
      return res.status(500).send('Problème MySQL U-Stock');
    }

    res.status(200).send("success");
  });
});

// Delete---------------------------------------
app.delete('/stock/delete/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM stock WHERE id = ?';

  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).send('Problème MySQL D-Stock');
    }

    res.status(200).send("success");
  });
});

// --
// Fournisseur_Produit
// --

// Create (lier un produit à un fournisseur)------------------------
app.post('/fournisseur-produit/create', (req, res) => {
  const { id_fournisseur, id_produit } = req.body;

  if (!id_fournisseur || !id_produit) {
    return res.status(400).send("ID fournisseur et ID produit sont requis");
  }

  const query =
    `INSERT INTO fournisseur_produit (id_fournisseur, id_produit)
    VALUES (?, ?)`;

  db.query(query, [id_fournisseur, id_produit], (err) => {
    if (err) {
      return res.status(500).send('Problème MySQL C-Fournisseur_Produit');
    }

    res.status(200).send("success");
  });
});

// Read (lister tous les liens)------------------------
app.get('/fournisseur-produit/read', (req, res) => {
  const query =
    `SELECT f.nom AS fournisseur, p.nom AS produit
    FROM fournisseur_produit fp
           JOIN fournisseur f ON fp.id_fournisseur = f.id
           JOIN produit p ON fp.id_produit = p.id
    ORDER BY f.nom`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Problème MySQL R-Fournisseur_Produit');
    }

    res.status(200).json(results);
  });
});

// Delete (supprimer un lien spécifique)------------------------
app.delete('/fournisseur-produit/delete', (req, res) => {
  const { id_fournisseur, id_produit } = req.body;

  if (!id_fournisseur || !id_produit) {
    return res.status(400).send("ID fournisseur et ID produit sont requis");
  }

  const query =
    `DELETE FROM fournisseur_produit
    WHERE id_fournisseur = ? AND id_produit = ?`;

  db.query(query, [id_fournisseur, id_produit], (err) => {
    if (err) {
      return res.status(500).send('Problème MySQL D-Fournisseur_Produit');
    }

    res.status(200).send("success");
  });
});

/* ------------------
    Express
-------------------*/
// Lancer le serveur Express
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
