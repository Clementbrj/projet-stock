import { Link } from "react-router-dom";

function NavBar() {
    return (
        <nav className="nav-statistique">
            <div className="liste-pages">
                <img src="logo192.png" alt="logo entreprise" className="image_entreprise" />
                <Link to="/statistiques" className="lien-page-statistiques">Statistiques</Link>
                <Link to="/fournisseur" className="lien-page-fournisseur">Liste Fournisseur</Link>
            </div>
            <button className="button-deconnexion">Se déconnecter</button>
        </nav>
    );
}

export default NavBar;
