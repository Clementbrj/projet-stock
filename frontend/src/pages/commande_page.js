import { useEffect, useState } from "react";
import { useAuth } from "../services/firebaseconnect";
import "../styles/entrepot.css";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import axios from "axios";

function CommandePage() {
    const { handleLogout } = useAuth();
    const [commandes, setCommandes] = useState([]);
    const [groupedCommandes, setGroupedCommandes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        fournisseur_id: "",
        entrepot_id: "",
        produit_id: "",
        quantite: "" // Initialisez avec une chaîne vide pour le placeholder
    });

    const [fournisseurs, setFournisseurs] = useState([]);
    const [entrepots, setEntrepots] = useState([]);
    const [produits, setProduits] = useState([]);

    const fetchCommandes = () => {
        setLoading(true);
        axios.get("http://localhost:3100/commande/read2")
            .then((res) => {
                setCommandes(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Erreur lors de la récupération des commandes.");
                setLoading(false);
            });
    };

    const fetchFournisseurs = () => {
        axios.get("http://localhost:3100/fournisseur/read")
            .then(res => {
                console.log("Fournisseurs reçus :", res.data);
                setFournisseurs(res.data);
            })
            .catch(() => setError("Erreur lors de la récupération des fournisseurs."));
    };

    const fetchEntrepots = () => {
        axios.get("http://localhost:3100/entrepot/read")
            .then(res => {
                console.log("Entrepôts reçus :", res.data);
                setEntrepots(res.data);
            })
            .catch(() => setError("Erreur lors de la récupération des entrepôts."));
    };

    const fetchProduits = () => {
        axios.get("http://localhost:3100/produit/read")
            .then(res => {
                console.log("Produits reçus :", res.data);
                setProduits(res.data);
            })
            .catch(() => setError("Erreur lors de la récupération des produits."));
    };

    useEffect(() => {
        fetchCommandes();
        fetchFournisseurs();
        fetchEntrepots();
        fetchProduits();
    }, []);

    useEffect(() => {
        const grouped = {};
        commandes.forEach(c => {
            if (!grouped[c.id_commande]) {
                grouped[c.id_commande] = {
                    fournisseur: c.fournisseur,
                    entrepot: c.entrepot,
                    date_commande: c.date_commande,
                    status: c.status,
                    produits: []
                };
            }
            grouped[c.id_commande].produits.push({
                nom: c.produit,
                quantite: c.quantite
            });
        });
        setGroupedCommandes(grouped);
    }, [commandes]);

    const createCommande = () => {
        if (!formData.fournisseur_id || !formData.entrepot_id || !formData.produit_id || !formData.quantite) {
            alert("Tous les champs sont requis.");
            return;
        }

        const commandeData = {
            id_fournisseur: formData.fournisseur_id,
            id_entrepot: formData.entrepot_id,
            produits: [{
                id_produit: formData.produit_id,
                quantite: parseInt(formData.quantite) // Convertir en nombre avant l'envoi
            }]
        };

        axios.post("http://localhost:3100/commande/create", commandeData)
            .then(() => {
                setFormData({ fournisseur_id: "", entrepot_id: "", produit_id: "", quantite: "" });
                fetchCommandes();
            })
            .catch(() => setError("Erreur lors de la création de la commande."));
    };

    return (
        <div>
            <Navbar/>

            <main className="entrepot">
                <h1 className="title">Créer une commande</h1>
                <div className="formulaire">
                    <select value={formData.fournisseur_id}
                        onChange={(e) => setFormData({ ...formData, fournisseur_id: e.target.value })}>
                        <option value="">-- Choisir un fournisseur --</option>
                        {fournisseurs.map((f) => (
                            <option key={f.id} value={f.id}>
                                {(f.nom || "Nom inconnu")} ({f.id})
                            </option>
                        ))}
                    </select>

                    <select value={formData.entrepot_id}
                        onChange={(e) => setFormData({ ...formData, entrepot_id: e.target.value })}>
                        <option value="">-- Choisir un entrepôt --</option>
                        {entrepots.map((e) => (
                            <option key={e.id} value={e.id}>
                                {(e.nom || "Nom inconnu")} ({e.id})
                            </option>
                        ))}
                    </select>

                    <select value={formData.produit_id}
                        onChange={(e) => setFormData({ ...formData, produit_id: e.target.value })}>
                        <option value="">-- Choisir un produit --</option>
                        {produits.map((p) => (
                            <option key={p.id} value={p.id}>
                                {(p.nom || "Nom inconnu")} ({p.id})
                            </option>
                        ))}
                    </select>

                    <input type="number" placeholder="Quantité" value={formData.quantite}
                        onChange={(e) => setFormData({ ...formData, quantite: e.target.value })} />
                    <button onClick={createCommande} className="button-enregistrer">Ajouter une commande</button>
                </div>

                <h1 className="title">Liste détaillée des commandes</h1>
                {loading ? (
                    <p>Chargement...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    Object.entries(groupedCommandes).map(([id, data]) => (
                        <div key={id} className="commande-card">
                            <h3>Commande #{id}</h3>
                            <p><strong>Fournisseur:</strong> {data.fournisseur}</p>
                            <p><strong>Entrepôt:</strong> {data.entrepot}</p>
                            <p><strong>Date:</strong> {new Date(data.date_commande).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> {data.status}</p>
                            <table className="table_entrepot">
                                <thead>
                                    <tr>
                                        <th>Produit</th>
                                        <th>Quantité</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.produits.map((prod, i) => (
                                        <tr key={i}>
                                            <td>{prod.nom}</td>
                                            <td>{prod.quantite}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                )}
            </main>
            <Footer/>
        </div>
    );
}

export default CommandePage;
