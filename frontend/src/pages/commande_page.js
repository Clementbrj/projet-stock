import { useEffect, useState } from "react";
import { useAuth } from "../services/firebaseconnect";
import "../styles/entrepot.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Commande() {
    const { handleLogout } = useAuth();
    const [commandes, setCommandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ fournisseur_id: "", entrepot_id: "", quantite: 0 });
    const [sortBy, setSortBy] = useState("date_commande");

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:3100/commande/read?sortBy=${sortBy}`)
            .then((response) => {
                setCommandes(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Erreur lors de la récupération des commandes.");
                setLoading(false);
            });
    }, [sortBy]);

    const deleteCommande = (id) => {
        axios.delete(`http://localhost:3100/commande/delete/${id}`)
            .then(() => {
                setCommandes(commandes.filter(c => c.id !== id));
            })
            .catch(() => {
                setError("Erreur lors de la suppression.");
            });
    };

    const create = () => {
        if (!formData.fournisseur_id || !formData.entrepot_id || !formData.quantite) {
            alert("Il manque un champ obligatoire !");
            return;
        }
        axios.post("http://localhost:3100/commande/create", formData)
            .then((response) => {
                setCommandes([...commandes, response.data]);
                setFormData({ fournisseur_id: "", entrepot_id: "", quantite: 0 });
            })
            .catch(() => {
                setError("Erreur lors de l'ajout.");
            });
    };

    return (
        <div>
            <nav className="nav-entrepot">
                <div className="liste-pages">
                    <img src="logo192.png" alt="logo entreprise" className="image_entreprise" />
                    <Link to="/statistiques" className="lien">Statistiques</Link>
                    <Link to="/fournisseur" className="lien">Fournisseur</Link>
                    <Link to="/entrepot" className="lien">Entrepôt</Link>
                    <Link to="/commande" className="lien">Commande</Link>
                </div>
                <button onClick={handleLogout} className="button-deconnexion">Se déconnecter</button>
            </nav>

            <main className="entrepot">
                <h1 className="title">Liste des commandes</h1>

                <div className="formulaire">
                    <input type="text" placeholder="ID Fournisseur" value={formData.fournisseur_id}
                        onChange={(e) => setFormData({ ...formData, fournisseur_id: e.target.value })} />
                    <input type="text" placeholder="ID Entrepôt" value={formData.entrepot_id}
                        onChange={(e) => setFormData({ ...formData, entrepot_id: e.target.value })} />
                    <input type="number" placeholder="Quantité" value={formData.quantite}
                        onChange={(e) => setFormData({ ...formData, quantite: e.target.value })} />
                    <button onClick={create} className="button-enregistrer">Ajouter une commande</button>
                </div>

                <div className="container_titre">
                    <select className="select_entrepot" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="date_commande">Date</option>
                        <option value="quantite">Quantité</option>
                    </select>
                </div>

                <div className="liste-entrepot">
                    {error && <p className="error">{error}</p>}
                    {loading ? <p>Chargement...</p> : (
                        <table className="table_entrepot">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fournisseur</th>
                                    <th>Entrepôt</th>
                                    <th>Quantité</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commandes.length === 0 ? (
                                    <tr><td colSpan="6">Aucune commande trouvée.</td></tr>
                                ) : (
                                    commandes.map(c => (
                                        <tr key={c.id}>
                                            <td>{c.id}</td>
                                            <td>{c.fournisseur_id}</td>
                                            <td>{c.entrepot_id}</td>
                                            <td>{c.quantite}</td>
                                            <td>{new Date(c.date_commande).toLocaleDateString()}</td>
                                            <td>
                                                <button onClick={() => deleteCommande(c.id)}>❌</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Commande;
