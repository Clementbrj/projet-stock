<div align="center">
  <img src="https://images.icon-icons.com/3261/PNG/512/github_logo_icon_206752.png" alt="Git Logo" width="256" height="256"/>
</div>



projet fil rouge.
édité le : 23/06/2025

# Contexte
Dans le cadre de notre 3ème année d'étude en développement informatique, ethan et moi-même avons dû réaliser un projet comprenant une application web et une application mobile.

C'est une simulation sur le thème de la logistique, une application web doit permettre aux managers d'avoir un back-office, une interface pour gérer l'approvisionnement, les statistiques et les commandes/fournisseurs, vente .. des l'entrepôts.

Et une application mobile déstinés aux ouvriers de logistiques, sur laquelle ils peuvent édité les stocks de chaques produits d'un entrepôt et avoir une notification en cas de stock trop faible pour prévenir leur manager.

Le projet doit inclure un système de connexion, un back-end et un front-end, avec une bonne persistance des données.

## Sommaire
- [Contexte](#contexte)
- [Installation WEB](#installation-web)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Présentation fonctionnelle](#présentation-fonctionnels)
- [Technologies utilisées](#technologies-utilisées)
- [Sécurité & RGPD](#sécurité--rgpd)
- [Améliorations futures](#améliorations-futures)


## Installation WEB
### Backend
Notre back-end web fonctionne en deux parties, le stockage des données avec une BDD MySQL et le serveur express.

#### Installer express

Installer les dépendances dans un terminal :

    cd backend
    npm install express mysql2 sequelize cors
 
#### Initialiser la BDD MySQL

Avoir [Mysql Server](https://dev.mysql.com/downloads/installer/), ouvrir le terminal de MySQL, connecter vous à l'utilisateur root(où admin) puis : 

    CREATE DATABASE filrouge; --(créer la DB)

    CREATE USER 'tech'@'localhost' IDENTIFIED BY 'mdp'; --(créer un user pour la DB)

    GRANT SELECT, INSERT, UPDATE, DELETE ON filrouge.* TO 'tech'@'localhost'; --(donner à notre user les permissions CRUD)

    FLUSH PRIVILEGES; --(appliquer les changements)

Pour avoir l'architecture de la BDD du projet et les bonnes tables, continuez :  

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
    id_entrepot INT,
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'en attente',
    FOREIGN KEY (id_fournisseur) REFERENCES fournisseur(id),
    FOREIGN KEY (id_entrepot) REFERENCES entrepot(id)
);

CREATE TABLE produit_commande (
    id_commande INT,
    id_produit INT,
    quantite INT,
    PRIMARY KEY (id_commande, id_produit),
    FOREIGN KEY (id_commande) REFERENCES commande(id),
    FOREIGN KEY (id_produit) REFERENCES produit(id)
);

**Modifier la config back-end MySQL**

Maintenant que la BDD est prête, il faut que vous renseignez votre utilisateur dans le fichier backend/config/database.js , mettez les bonnes informations sur votre utilisateur.


Maintenant vous pouvez démarrer le server express

    node server.js

### Frontend
#### Initialisation FireBase.
Normalement, vous n'aurez rien à faire et pourrez directement dans un second terminal effectuer :

    cd frontend
    npm i
    npm run start (ou dev)

Vous pourrez avoir accès aux fonctionnalités FireBase, si toute-fois notre projet vient à expirer sur le site, vous pouvez modifier la firebaseconfig dans /frontend/services/firebaseconfig.js .

 vous devrez vous créer un compte, puis créer un projet FireBase et activer **l'authentification**.

Puis remplacer l'actuel config par celle fournie par votre projet.

## Présentation fonctionnels : 
Page de connexion : 
    
    Se connecter
    S'inscrire
    Récupérer son compte (MDP. oublié)

Page statistiques : 

    Liste des produits en stock
    Trier par nom / quantités
    Liste de commande triable par date
    Liste des stocks triable par période où dates
    Graphiques en courbes où en nuage

Page Fournisseur / Entrepôt / Commande / Produit :

    Créer / Visualiser / Mettre à jour / Supprimer 
    Trier par nom où quantité selon la page.

Attention, pour passer commande, il faut un entrepôt et un fournisseur. Produit, entrepôt et fournisseurs sont indépendants. Les commandes elles dépendent de leurs informations renseigner, si vous supprimer un fournisseur utiliser dans une commande, la ligne renseignant la commande sera supprimer de la BDD.

## Technologies utilisées

- **Frontend** : React.js, Firebase (Auth), chartJS
- **Backend** : Node.js, Express, Sequelize OR
- **Base de données** : MySQL
- **Mobile** : Kotlin
- **Outils** : GitHub, VS Code, Android Studio, Trello, Figma

## Sécurité & RGPD

- Authentification sécurisée via Firebase (login / signup)
- Les mots de passe ne sont jamais stockés en clair
- Gestion des rôles et des accès (adapté aux exigences des responsables de cette matière et des projets en cours).
- Aucune donnée personnelle sensible n’est collectée hors champ de connexion
- Conformité RGPD simulée : suppression de compte possible, anonymisation sur demande

## Accessibilité & Performance

L’application a été testée avec l’outil [Lighthouse](https://developer.chrome.com/docs/lighthouse/).  
Objectif : score supérieur à 80 sur l’accessibilité, la performance et les bonnes pratiques, nous avons **86**.

- Texte suffisamment contrasté
- Interface responsive
- Navigation clavier fonctionnelle
- Composants réutilisables avec aria-labels

## Améliorations futures

- Séparation claires des utilisateurs (membre logistiques, manager)
- Retrait de l'inscription et création de compte uniquement possible via un Manager
- Couverture de tests unitaires
- Ajout d'un .env pour les informations sensibles

<div align="center">
  <img src="image.png" alt="coucou" width="256" height="256"/>
</div>