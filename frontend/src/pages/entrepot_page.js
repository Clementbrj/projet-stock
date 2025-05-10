import { useEffect, useState } from "react";
import { useAuth } from "../services/firebaseconnect";
import "../styles/entrepot.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Entrepot() {
    const { handleLogout } = useAuth();
    const [entrepots, setEntrepots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ nom: "", adresse: "", capacite: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [sortBy, setSortBy] = useState("nom");

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:3100/entrepot/read?sortBy=${sortBy}`)
            .then((response) => {
                setEntrepots(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Erreur lors de la récupération des entrepôts.");
                setLoading(false);
            });
    }, [sortBy]);

    const deleteEntrepot = (id) => {
        axios.delete(`http://localhost:3100/entrepot/delete/${id}`)
            .then(() => {
                setEntrepots(entrepots.filter(e => e.id !== id));
            })
            .catch(() => {
                setError("Erreur lors de la suppression.");
            });
    };

    const create = () => {
        if (!formData.nom || !formData.adresse || !formData.capacite) {
            alert("Il manque un champ obligatoire !");
            return;
        }
        axios.post("http://localhost:3100/entrepot/create", formData)
            .then((response) => {
                setEntrepots([...entrepots, response.data]);
                setFormData({ nom: "", adresse: "", capacite: "" });
            })
            .catch(() => {
                setError("Erreur lors de l'ajout.");
            });
    };

    const edit = (id) => {
        const e = entrepots.find(e => e.id === id);
        setFormData({ nom: e.nom, adresse: e.adresse, capacite: e.capacite });
        setIsEditing(true);
        setEditingId(id);
    };

    const update = () => {
        if (!formData.nom || !formData.adresse || !formData.capacite) {
            alert("Il manque un champ obligatoire !");
            return;
        }
        axios.put(`http://localhost:3100/entrepot/update/${editingId}`, formData)
            .then(() => {
                setEntrepots(entrepots.map(e =>
                    e.id === editingId ? { ...e, ...formData } : e
                ));
                setIsEditing(false);
                setEditingId(null);
                setFormData({ nom: "", adresse: "", capacite: "" });
            })
            .catch(() => {
                setError("Erreur lors de la mise à jour.");
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
                <h1 className="title">Liste des entrepôts</h1>

                <div className="formulaire">
                    <input type="text" placeholder="Nom" value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
                    <input type="text" placeholder="Adresse" value={formData.adresse}
                        onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} />
                    <input type="number" placeholder="Capacité" value={formData.capacite}
                        onChange={(e) => setFormData({ ...formData, capacite: e.target.value })} />
                    <button onClick={isEditing ? update : create} className="button-enregistrer">
                        {isEditing ? "Mettre à jour" : "Ajouter un entrepôt"}
                    </button>
                </div>

                <div className="container_titre">
                    <select className="select_entrepot" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="nom">Nom</option>
                        <option value="adresse">Adresse</option>
                        <option value="capacite">Capacité</option>
                    </select>
                </div>

                <div className="liste-entrepot">
                    {error && <p className="error">{error}</p>}
                    {loading ? <p>Chargement...</p> : (
                        <table className="table_entrepot">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Adresse</th>
                                    <th>Capacité</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entrepots.length === 0 ? (
                                    <tr><td colSpan="4">Aucun entrepôt trouvé.</td></tr>
                                ) : (
                                    entrepots.map(e => (
                                        <tr key={e.id}>
                                            <td>{e.nom}</td>
                                            <td>{e.adresse}</td>
                                            <td>{e.capacite}</td>
                                            <td>
                                                <button onClick={() => edit(e.id)}>Modifier</button>
                                                <button onClick={() => deleteEntrepot(e.id)}>❌</button>
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

export default Entrepot;
