import { useAuth } from "../services/firebaseconnect";
import "./fournisseur.css";
import {Link} from "react-router-dom";
function Fournisseur() {
    /*  const { email, setEmail, password, setPassword, handleLogin, handleLogout, handlePasswordReset } = useAuth();
  */
    return (
        <>
            <nav className="nav-statistique">
                <div className="liste-pages">
                    <img src="logo192.png" alt="logo entreprise" className="image_entreprise" />
                    <Link to="/statistiques" className="lien-page-statistiques">Statistiques</Link>
                    <Link to="/fournisseur" className="lien-page-fournisseur">Liste Fournisseur</Link>
                </div>
                <button /*onClick={handleLogout} */className="button-deconnexion">Se déconnecter</button>
            </nav>

            <main className="fournisseur">
                <h1 className="title">Liste des fournisseurs</h1>
                <div className="container_titre">
                    <div className="container_recherche">
                        <input type="text" className="recherche_fournisseur" placeholder="Rechercher un fournisseur 🔍" />
                        <button className="button_recherche">🔍</button>
                    </div>
                    <select className="select_fournisseur">
                        <option value="" selected disabled>Trier par ...</option>
                        <option value="">Lorem ispum</option>
                        <option value="">Lorem ispum</option>
                    </select>
                </div>
                <div className="liste-fournisseur">
                    <table className="table_fournisseur">
                        <thead>
                        <tr>
                            <th scope="col">Lorem ispum</th>
                            <th scope="col">Lorem ispum</th>
                            <th scope="col">Lorem ispum</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* a compléter en backend */}
                        </tbody>
                    </table>
                </div>
            </main>

        </>
    );
};
{/* <button onClick={handleLogout} className="button-deconnexion">Se déconnecter</button>*/}
export default Fournisseur;
