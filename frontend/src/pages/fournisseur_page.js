import { useEffect, useState } from "react";
import { useAuth } from "../services/firebaseconnect";
import "../styles/fournisseur.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

function Fournisseur() {
    const { handleLogout } = useAuth();
    const [fournisseurs, setFournisseurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ nom: "", adresse: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [sortBy, setSortBy] = useState("nom");

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:3100/fournisseur/read?sortBy=${sortBy}`)
            .then((response) => {
                setFournisseurs(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Erreur lors de la récupération des fournisseurs.");
                setLoading(false);
            });
    }, [sortBy]);

    const deleteFournisseur = (id) => {
        axios.delete(`http://localhost:3100/fournisseur/delete/${id}`)
            .then(() => {
                setFournisseurs(fournisseurs.filter(f => f.id !== id));
            })
            .catch(() => {
                setError("Erreur lors de la suppression.");
            });
    };

    const create = () => {
        axios.post("http://localhost:3100/fournisseur/create", formData)
            .then((response) => {
                setFournisseurs([...fournisseurs, response.data]);
                setFormData({ nom: "", adresse: "" });
            })
            .catch(() => {
                setError("Erreur lors de l'ajout.");
            });
    };

    const edit = (id) => {
        const f = fournisseurs.find(f => f.id === id);
        setFormData({ nom: f.nom, adresse: f.adresse });
        setIsEditing(true);
        setEditingId(id);
    };

    const update = () => {
        axios.put(`http://localhost:3100/fournisseur/update/${editingId}`, formData)
            .then(() => {
                setFournisseurs(fournisseurs.map(f =>
                    f.id === editingId ? { ...f, ...formData } : f
                ));
                setIsEditing(false);
                setEditingId(null);
                setFormData({ nom: "", adresse: "" });
            })
            .catch(() => {
                setError("Erreur lors de la mise à jour.");
            });
    };

    return (
        <div>
            <Navbar/>

            <main className="fournisseur">
                <h1 className="title">Liste des fournisseurs</h1>

                <div className="formulaire">
                    <input type="text" placeholder="Nom" value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
                    <input type="text" placeholder="Adresse" value={formData.adresse}
                        onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} />
                    <button onClick={isEditing ? update : create} className="button-enregistrer">
                        {isEditing ? "Mettre à jour" : "Ajouter un fournisseur"}
                    </button>
                </div>

                <div className="container_titre">
                    <select className="select_fournisseur" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="nom">Nom</option>
                        <option value="adresse">Adresse</option>
                    </select>
                </div>

                <div className="liste-fournisseur">
                    {error && <p className="error">{error}</p>}
                    {loading ? <p>Chargement...</p> : (
                        <table className="table_fournisseur">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Adresse</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fournisseurs.length === 0 ? (
                                    <tr><td colSpan="3">Aucun fournisseur trouvé.</td></tr>
                                ) : (
                                    fournisseurs.map(f => (
                                        <tr key={f.id}>
                                            <td>{f.nom}</td>
                                            <td>{f.adresse}</td>
                                            <td>
                                                <button onClick={() => edit(f.id)}>Modifier</button>
                                                <button onClick={() => deleteFournisseur(f.id)}>❌</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
            <Footer/>
        </div>
    );
}

export default Fournisseur;
