import { useEffect, useState } from "react";
import { useAuth } from "../services/firebaseconnect";
import "../styles/fournisseur.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Fournisseur() {
    const { handleLogout } = useAuth();
    const [fournisseurs, setFournisseurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({ nom: "", adresse: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [sortBy, setSortBy] = useState('nom'); // État pour suivre le critère de tri

    // Lire les fournisseurs depuis le serveur
    useEffect(() => {
        setLoading(true); // Remise à zéro du loading lors du changement de tri
        axios.get(`http://localhost:3100/fournisseur/read?sortBy=${sortBy}`)
            .then((response) => {
                setFournisseurs(response.data); // Mettre à jour la liste des fournisseurs triée
                setLoading(false); // Fin du chargement
            })
            .catch((err) => {
                setError("R-Fournisseur");
                setLoading(false); // Fin du chargement en cas d'erreur
            });
    }, [sortBy]); // Ce useEffect se déclenche à chaque changement de sortBy

    // Fonction pour supprimer un fournisseur
    const deleteFournisseur = (id) => {
        axios.delete(`http://localhost:3100/fournisseur/delete/${id}`)
            .then(() => {
                setFournisseurs(fournisseurs.filter(fournisseur => fournisseur.id !== id));
            })
            .catch((err) => {
                setError("D-Fournisseur");
            });
    };

    // Fonction pour créer un fournisseur
    const create = () => {
        axios.post("http://localhost:3100/fournisseur/create", formData)
            .then((response) => {
                const newFournisseur = response.data;
                setFournisseurs([...fournisseurs, newFournisseur]);
                setFormData({ nom: "", adresse: "" });
            })
            .catch((err) => {
                setError("C-Fournisseur");
            });
    };

    // Fonction pour modifier un fournisseur
    const edit = (id) => {
        const fournisseur = fournisseurs.find(f => f.id === id);
        setFormData({ nom: fournisseur.nom, adresse: fournisseur.adresse });
        setIsEditing(true);
        setEditingId(id);
    };

    // Fonction pour mettre à jour un fournisseur
    const update = () => {
        axios.put(`http://localhost:3100/fournisseur/update/${editingId}`, formData)
            .then(() => {
                setFournisseurs(fournisseurs.map(fournisseur =>
                    fournisseur.id === editingId ? { ...fournisseur, ...formData } : fournisseur
                ));
                setIsEditing(false);
                setEditingId(null);
            })
            .catch((err) => {
                setError("U-Fournisseur");
            });
    };

    // Fonction pour gérer la sélection du critère de tri
    const handleSortChange = (event) => {
        setSortBy(event.target.value); // Mettre à jour l'état du critère de tri
    };

    return (
        <div>
            <nav className="nav-statistique">
                <div className="liste-pages">
                    <img src="logo192.png" alt="logo entreprise" className="image_entreprise" />
                    <Link to="/statistiques" className="lien-page-statistiques">Statistiques</Link>
                    <Link to="/fournisseur" className="lien-page-fournisseur">Liste Fournisseur</Link>
                </div>
                <button onClick={handleLogout} className="button-deconnexion">Se déconnecter</button>
            </nav>

            <main className="fournisseur">
                <h1 className="title">Liste des fournisseurs</h1>

                {/* Formulaire pour ajouter ou modifier un fournisseur */}
                <div className="formulaire">
                    <input 
                        type="text" 
                        placeholder="Nom du fournisseur" 
                        value={formData.nom} 
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })} 
                    />
                    <input 
                        type="text" 
                        placeholder="Adresse du fournisseur" 
                        value={formData.adresse} 
                        onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} 
                    />
                    <button 
                        onClick={isEditing ? update : create} 
                        className="button-enregistrer">
                        {isEditing ? "Mettre à jour" : "Ajouter un fournisseur"}
                    </button>
                </div>

                <div className="container_titre">
                    <select 
                        className="select_fournisseur"
                        value={sortBy}
                        onChange={handleSortChange}
                    >
                        <option value="nom">Nom</option>
                        <option value="adresse">Adresse</option>
                    </select>
                </div>

                <div className="liste-fournisseur">
                    {error && <p className="error">{error}</p>}

                    {loading ? (
                        <p>Chargement...</p>
                    ) : (
                        <table className="table_fournisseur">
                            <thead>
                                <tr>
                                    <th scope="col">Nom</th>
                                    <th scope="col">Adresse</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fournisseurs.length === 0 ? (
                                    <tr>
                                        <td colSpan="3">Aucun fournisseur trouvé.</td>
                                    </tr>
                                ) : (
                                    fournisseurs.map((fournisseur) => (
                                        <tr key={fournisseur.id}>
                                            <td>{fournisseur.nom}</td>
                                            <td>{fournisseur.adresse}</td>
                                            <td>
                                                <button onClick={() => edit(fournisseur.id)}>Modifier</button>
                                                <button onClick={() => deleteFournisseur(fournisseur.id)}>❌</button>
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

export default Fournisseur;
