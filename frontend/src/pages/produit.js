import { useEffect, useState } from "react";
import "../styles/entrepot.css";
import Footer from "../components/Footer";
import Navbar from "../components/NavBar";
import axios from "axios";

function ProduitPage() {
    const [produits, setProduits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ nom: "", prix: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchProduits = () => {
        setLoading(true);
        axios.get("http://localhost:3100/produit/read")
            .then((res) => {
                setProduits(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Erreur lors de la récupération des produits.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchProduits();
    }, []);

    const createProduit = () => {
        if (!formData.nom || !formData.prix) {
            alert("Tous les champs sont requis.");
            return;
        }

        axios.post("http://localhost:3100/produit/create", formData)
            .then(() => {
                setFormData({ nom: "", prix: "" });
                fetchProduits();
            })
            .catch(() => setError("Erreur lors de la création du produit."));
    };

    const editProduit = (id) => {
        const produit = produits.find(p => p.id === id);
        setFormData({ nom: produit.nom, prix: produit.prix });
        setIsEditing(true);
        setEditingId(id);
    };

    const updateProduit = () => {
        axios.put(`http://localhost:3100/produit/update/${editingId}`, formData)
            .then(() => {
                setProduits(produits.map(p =>
                    p.id === editingId ? { ...p, ...formData } : p
                ));
                setIsEditing(false);
                setEditingId(null);
                setFormData({ nom: "", prix: "" });
            })
            .catch(() => setError("Erreur lors de la mise à jour du produit."));
    };

    const deleteProduit = (id) => {
        axios.delete(`http://localhost:3100/produit/delete/${id}`)
            .then(() => {
                setProduits(produits.filter(p => p.id !== id));
            })
            .catch(() => setError("Erreur lors de la suppression du produit."));
    };

    return (
        <div>
            <Navbar />
            <main className="entrepot">
                <h1 className="title">{isEditing ? "Modifier le produit" : "Créer un produit"}</h1>

                <div className="formulaire">
                    <input
                        type="text"
                        placeholder="Nom du produit"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Prix"
                        value={formData.prix}
                        onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                    />
                    <button
                        onClick={isEditing ? updateProduit : createProduit}
                        className="button-enregistrer"
                    >
                        {isEditing ? "Mettre à jour" : "Ajouter un produit"}
                    </button>
                </div>

                <h1 className="title">Liste des produits</h1>
                {loading ? (
                    <p>Chargement...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <table className="table_entrepot">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Prix</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produits.map((produit) => (
                                <tr key={produit.id}>
                                    <td>{produit.nom}</td>
                                    <td>{produit.prix} €</td>
                                    <td>
                                        <button onClick={() => editProduit(produit.id)}>Editer</button>
                                        <button onClick={() => deleteProduit(produit.id)}>❌</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default ProduitPage;
