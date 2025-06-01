import { useEffect, useState } from "react";
import "../styles/entrepot.css";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import axios from "axios";

function CommandePage() {
    const [commandes, setCommandes] = useState([]);
    const [groupedCommandes, setGroupedCommandes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        fournisseur_id: "",
        entrepot_id: "",
        produit_id: "",
        quantite: "",
        status: "en attente"
    });

    const [fournisseurs, setFournisseurs] = useState([]);
    const [entrepots, setEntrepots] = useState([]);
    const [produits, setProduits] = useState([]);

    // --- Fetch functions ---
    const fetchCommandes = () => {
        setLoading(true);
        axios.get("http://localhost:3100/commande/read2")
            .then(res => {
                setCommandes(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Erreur lors de la récupération des commandes.");
                setLoading(false);
            });
    };

    const fetchFournisseurs = () => {
        axios.get("http://localhost:3100/fournisseur/read")
            .then(res => setFournisseurs(res.data))
            .catch((err) => {
                console.error(err);
                setError("Erreur lors de la récupération des fournisseurs.");
            });
    };

    const fetchEntrepots = () => {
        axios.get("http://localhost:3100/entrepot/read")
            .then(res => setEntrepots(res.data))
            .catch((err) => {
                console.error(err);
                setError("Erreur lors de la récupération des entrepôts.");
            });
    };

    const fetchProduits = () => {
        axios.get("http://localhost:3100/produit/read")
            .then(res => setProduits(res.data))
            .catch((err) => {
                console.error(err);
                setError("Erreur lors de la récupération des produits.");
            });
    };

    // --- Load all at mount ---
    useEffect(() => {
        fetchCommandes();
        fetchFournisseurs();
        fetchEntrepots();
        fetchProduits();
    }, []);

    // --- Regroup commandes (basé sur structure correcte de /read2) ---
    useEffect(() => {
        const grouped = {};

        commandes.forEach(c => {
            grouped[c.id] = {
                fournisseur: c.fournisseur,
                entrepot: c.entrepot,
                date_commande: c.date_commande,
                status: c.status,
                produits: c.produits.map(p => ({
                    id: p.id,
                    nom: p.nom,
                    quantite: p.ProduitCommande?.quantite ?? "N/A"
                }))
            };
        });

        setGroupedCommandes(grouped);
    }, [commandes]);

    const createCommande = () => {
        const { fournisseur_id, entrepot_id, produit_id, quantite, status } = formData;

        if (!fournisseur_id || !entrepot_id || !produit_id || !quantite) {
            alert("Tous les champs sont requis.");
            return;
        }

        const commandeData = {
            id_fournisseur: fournisseur_id,
            id_entrepot: entrepot_id,
            produits: [{
                id_produit: produit_id,
                quantite: parseInt(quantite, 10)
            }],
            status
        };

        axios.post("http://localhost:3100/commande/create", commandeData)
            .then(() => {
                setFormData({
                    fournisseur_id: "",
                    entrepot_id: "",
                    produit_id: "",
                    quantite: "",
                    status: "en attente"
                });
                fetchCommandes();
            })
            .catch((err) => {
                console.error(err);
                setError("Erreur lors de la création de la commande.");
            });
    };

    const updateCommandeStatus = (id, status) => {
        axios.put(`http://localhost:3100/commande/update-status/${id}`, { status })
            .then(() => fetchCommandes())
            .catch((err) => {
                console.error(err);
                setError("Erreur mise à jour du statut.");
            });
    };

    return (
        <div>
            <Navbar />
            <main className="entrepot">
                <h1 className="title">Créer une commande</h1>

                <div className="formulaire">
                    <select value={formData.fournisseur_id}
                            onChange={(e) => setFormData({ ...formData, fournisseur_id: e.target.value })}>
                        <option value="">-- Choisir un fournisseur --</option>
                        {fournisseurs.map(f => (
                            <option key={f.id} value={f.id}>
                                {f.nom || "Nom inconnu"} ({f.id})
                            </option>
                        ))}
                    </select>

                    <select value={formData.entrepot_id}
                            onChange={(e) => setFormData({ ...formData, entrepot_id: e.target.value })}>
                        <option value="">-- Choisir un entrepôt --</option>
                        {entrepots.map(ent => (
                            <option key={ent.id} value={ent.id}>
                                {ent.nom || "Nom inconnu"} ({ent.id})
                            </option>
                        ))}
                    </select>

                    <select value={formData.produit_id}
                            onChange={(e) => setFormData({ ...formData, produit_id: e.target.value })}>
                        <option value="">-- Choisir un produit --</option>
                        {produits.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.nom || "Nom inconnu"} ({p.id})
                            </option>
                        ))}
                    </select>

                    <input type="number" placeholder="Quantité" min="1" value={formData.quantite}
                           onChange={(e) => setFormData({ ...formData, quantite: e.target.value })} />

                    <select value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                        <option value="en attente">En attente</option>
                        <option value="annulée">Annulée</option>
                        <option value="en retard">En retard</option>
                        <option value="reçue">Reçue</option>
                    </select>

                    <button onClick={createCommande} className="button-enregistrer">Ajouter une commande</button>
                </div>

                <h1 className="title">Liste détaillée des commandes</h1>
                {loading ? (
                    <p>Chargement...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <table className="table_entrepot">
                        <thead>
                        <tr>
                            <th>N° Commande</th>
                            <th>Fournisseur</th>
                            <th>Entrepôt</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Produit</th>
                            <th>Quantité</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.entries(groupedCommandes).map(([id, data]) => {
                            const produitsCount = data.produits.length;
                            return data.produits.map((prod, index) => (
                                <tr key={`${id}-${prod.id}`}>
                                    {index === 0 && (
                                        <>
                                            <td rowSpan={produitsCount}>{id}</td>
                                            <td rowSpan={produitsCount}>{data.fournisseur?.nom || "Nom inconnu"}</td>
                                            <td rowSpan={produitsCount}>{data.entrepot?.nom || "Nom inconnu"}</td>
                                            <td rowSpan={produitsCount}>{new Date(data.date_commande).toLocaleDateString()}</td>
                                            <td rowSpan={produitsCount}>
                                                <select
                                                    value={data.status}
                                                    onChange={(e) => updateCommandeStatus(id, e.target.value)}
                                                >
                                                    <option value="en attente">En attente</option>
                                                    <option value="annulée">Annulée</option>
                                                    <option value="en retard">En retard</option>
                                                    <option value="reçue">Reçue</option>
                                                </select>
                                            </td>
                                        </>
                                    )}
                                    <td>{prod.nom}</td>
                                    <td>{prod.quantite}</td>
                                </tr>
                            ));
                        })}
                        </tbody>
                    </table>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default CommandePage;
