// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../services/firebaseconnect";
import React from "react";

function Navbar() {
    const { handleLogout } = useAuth();

    return (
        <header className="header">
            <nav className="nav-statistique">
                <div className="liste-pages">
                    <img src="logo192.png" alt="logo entreprise" className="image_entreprise" />
                    <Link to="/statistiques" className="lien">Statistiques</Link>
                    <Link to="/fournisseur" className="lien">Fournisseur</Link>
                    <Link to="/entrepot" className="lien">Entrepôt</Link>
                    <Link to="/commande" className="lien">Commande</Link>
                    <Link to="/produit" className="lien">Produit</Link>
                </div>
                <button onClick={handleLogout} className="button-deconnexion">Se déconnecter</button>
            </nav>
        </header>
    );
}

export default Navbar;
