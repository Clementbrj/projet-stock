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
  const { nom } = req.query;
  
  if (!nom) {
    return res.status(400).send("Le nom de l'entrepôt est obligatoire");
  }

  const query = 'INSERT INTO entrepot (nom) VALUES (?)';

  db.query(query, [nom], (err) => {
    if (err) {
      return res.status(500).send('Problème MySQL C-Entrepôt');
    }

    res.status(200).send("success");
  });
});

// Read---------------------------------------
app.get('/entrepot/read', (req,res) => {
  const query = 'SELECT * FROM entrepot';

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

/* ------------------
    Express
-------------------*/
// Lancer le serveur Express
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
