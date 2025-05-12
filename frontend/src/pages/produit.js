import { useEffect, useState } from "react";
import "../styles/entrepot.css";
import Footer from "../components/Footer";
import Navbar from "../components/NavBar";
import axios from "axios";

function ProduitPage() {
    const [produits, setProduits] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [formData, setFormData] = useState({
        nom: "",
        prix: ""
    });

    // Create product
    const createProduit = () => {
        if (!formData.nom || !formData.prix) {
            alert("Tous les champs sont requis.");
            return;
        }

        axios.post("http://localhost:3100/produit/create", formData)
            .then(() => {
                setFormData({ nom: "", prix: 0 });
                fetchProduits();
            })
            .catch(() => setError("Erreur lors de la création du produit."));
    };


    // get Product
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

    // ---------------------------
    // Dynamic management
    // ---------------------------
    useEffect(() => {
        fetchProduits();
    }, []);

    return (
        <div>
            <Navbar/>
            <main className="entrepot">
                <h1 className="title">Créer un produit</h1>
                {/* Form */}
                <div className="formulaire">
                    <input type="text" placeholder="Nom du produit" value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
                    <input type="number" placeholder="Prix" value={formData.prix}
                        onChange={(e) => setFormData({ ...formData, prix: e.target.value })} />
                    <button onClick={createProduit} className="button-enregistrer">Ajouter un produit</button>
                </div>

                {/* Display product list */}
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
                            </tr>
                        </thead>
                        <tbody>
                            {produits.map((produit) => (
                                <tr key={produit.id}>
                                    <td>{produit.nom}</td>
                                    <td>{produit.prix}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
            <Footer/>
        </div>
    );
}

export default ProduitPage;
