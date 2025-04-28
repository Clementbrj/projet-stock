FireBase pour tout faire, voir la grille 

# Backend
## Installer express
Installer les dépendances 

    npm install express mysql2

Lancer le server express

    node server.js

## Initialiser la DB
Avoir [Mysql Server](https://dev.mysql.com/downloads/installer/), ouvrir le terminale MySQL  et suivez ces étapes : 

    CREATE DATABASE filrouge; (créer la DB)
    CREATE USER 'tech'@'localhost' IDENTIFIED BY 'mdp'; (créer un user pour la DB)
    GRANT SELECT, INSERT, UPDATE, DELETE ON filrouge.* TO 'tech'@'localhost'; (donner à notre user les permissions CRUD)
    FLUSH PRIVILEGES; (appliquer les changements)

Avoir l'architecture de la BDD du projet : 
faire : 

    USE filrouge;

puis créer les tables : 

    CREATE TABLE fournisseur (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nom VARCHAR(100),
        adresse VARCHAR(100)
    );

    CREATE TABLE produit (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nom VARCHAR(100),
        prix float
    );

    CREATE TABLE entrepot (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nom VARCHAR(100),
        adresse VARCHAR(255),
        capacite INT
    );


    CREATE TABLE fournisseur_produit (
        id_fournisseur INT,
        id_produit INT,
        PRIMARY KEY (id_fournisseur, id_produit),
        FOREIGN KEY (id_fournisseur) REFERENCES fournisseur(id),
        FOREIGN KEY (id_produit) REFERENCES produit(id)
    );

    CREATE TABLE stock (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_entrepot INT,
    id_produit INT,
    quantite INT,
    valeur float,
    date_maj TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_entrepot) REFERENCES entrepot(id),
    FOREIGN KEY (id_produit) REFERENCES produit(id)
    );

    CREATE TABLE commande (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_fournisseur INT,
    id_produit INT,
    quantite INT,  -- Quantité commandée
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_fournisseur) REFERENCES fournisseur(id),
    FOREIGN KEY (id_produit) REFERENCES produit(id)
    );