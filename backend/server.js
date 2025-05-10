/* ------------------
    Config
-------------------*/
// config serveur
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
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
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));


/* ------------------
    Routes
-------------------*/
// Route par défaut
app.get('/', (req,res) => {
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

//  Update---------------------------------------
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

//  Delete---------------------------------------
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
//  Create---------------------------------------
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
  
  //  Update---------------------------------------
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
  
  //  Delete---------------------------------------
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
// Commande
// --
// Create---------------------------------------
app.post('/commande/create', (req, res) => {
  const { fournisseur_id, entrepot_id, date_commande, statut } = req.body;

  if (!fournisseur_id || !entrepot_id || !date_commande || !statut) {
    return res.status(400).send("Tous les champs sont obligatoires");
  }

  const query = 'INSERT INTO commande (fournisseur_id, entrepot_id, date_commande, statut) VALUES (?, ?, ?, ?)';

  db.query(query, [fournisseur_id, entrepot_id, date_commande, statut], (err, result) => {
    if (err) {
      return res.status(500).send('Problème MySQL C-Commande');
    }

    res.status(200).json({ id: result.insertId, fournisseur_id, entrepot_id, date_commande, statut });
  });
});

// Read---------------------------------------
app.get('/commande/read', (req, res) => {
  const sortBy = req.query.sortBy || 'date_commande';
  const query = `
    SELECT commande.*, fournisseur.nom AS fournisseur_nom, entrepot.nom AS entrepot_nom
    FROM commande
    JOIN fournisseur ON commande.fournisseur_id = fournisseur.id
    JOIN entrepot ON commande.entrepot_id = entrepot.id
    ORDER BY ${sortBy} DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Problème MySQL R-Commande');
    }

    res.status(200).json(results); 
  });
});

// Update---------------------------------------
app.put('/commande/update/:id', (req, res) => {
  const { id } = req.params;
  const { fournisseur_id, entrepot_id, date_commande, statut } = req.body;

  if (!fournisseur_id || !entrepot_id || !date_commande || !statut) {
    return res.status(400).send("Tous les champs sont requis");
  }

  const query = `
    UPDATE commande
    SET fournisseur_id = ?, entrepot_id = ?, date_commande = ?, statut = ?
    WHERE id = ?
  `;

  db.query(query, [fournisseur_id, entrepot_id, date_commande, statut, id], (err) => {
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

  
/* ------------------
    Express
-------------------*/
// Lancer le serveur Express
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
