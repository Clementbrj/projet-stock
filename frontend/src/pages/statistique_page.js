// import { useAuth } from "../services/firebaseconnect";
import "../styles/statistique.css";
import {Link} from "react-router-dom";
import React from "react";
import { useAuthContext } from "./AuthProvider";


function Statistiques() {
    const { handleLogout } = useAuthContext();
    return (
        <>
            <nav className="nav-statistique">
                <div className="liste-pages">
                    <img src="logo192.png" alt="logo entreprise" className="image_entreprise" />
                    <Link to="/statistiques" className="lien">Statistiques</Link>
                    <Link to="/fournisseur" className="lien">Fournisseur</Link>
                    <Link to="/entrepot" className="lien">Entrepôt</Link>
                    <Link to="/commande" className="lien">Commande</Link>
                </div>
                <button onClick={handleLogout} className="button-deconnexion">Se déconnecter</button>
            </nav>
            <main className="statistique">
                <h1 className="title">Tableau de board</h1>
            </main>

        </>
    );
};

export default Statistiques;
