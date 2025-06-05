import { useEffect, useState } from 'react';
import axios from 'axios';

function TableCommande({ selectedProduitId }) {
    const [commandes, setCommandes] = useState([]);
    const [periode, setPeriode] = useState("all");

    useEffect(() => {
        axios.get('http://localhost:3100/commande/read2')
            .then((res) => {
                setCommandes(res.data);
            })
            .catch((err) => {
                console.error('❌ Erreur lors de la récupération des commandes :', err);
                if (err.response) {
                    console.error('Réponse serveur :', err.response.data);
                }
            });
    }, []);

    const now = new Date();
    const getDateLimit = () => {
        const limit = new Date(now);
        switch (periode) {
            case "day":
                limit.setDate(limit.getDate() - 1);
                break;
            case "week":
                limit.setDate(limit.getDate() - 7);
                break;
            case "month":
                limit.setMonth(limit.getMonth() - 1);
                break;
            case "year":
                limit.setFullYear(limit.getFullYear() - 1);
                break;
            default:
                return null;
        }
        return limit;
    };

    const dateLimit = getDateLimit();

    const filteredCommandes = commandes.filter((c) => {
        const matchProduit = selectedProduitId
            ? c.produits?.some((p) => parseInt(p.id) === parseInt(selectedProduitId))
            : true;

        const matchDate = dateLimit
            ? new Date(c.date_commande) >= dateLimit
            : true;

        return matchProduit && matchDate;
    });

    return (
        <section className="liste-commande">
            <div className="container_titre_commande">
                <h2>Liste des commandes</h2>

                <div className="filtre-periode">
                    <label>Filtrer par période : </label>
                    <select
                        value={periode}
                        onChange={(e) => setPeriode(e.target.value)}
                        className="periode-select"
                    >
                        <option value="all">Toutes</option>
                        <option value="day">1 jour</option>
                        <option value="week">1 semaine</option>
                        <option value="month">1 mois</option>
                        <option value="year">1 an</option>
                    </select>
                </div>
            </div>

            {filteredCommandes.length === 0 ? (
                <p style={{ fontStyle: "italic", color: "#888" }}>
                    Aucune commande trouvée pour cette période.
                </p>
            ) : (
                <table className="table_commande">
                    <thead>
                    <tr>
                        <th>N°Commande</th>
                        <th>Nom Fournisseur</th>
                        <th>Produit(s)</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredCommandes.map((c) => (
                        <tr key={c.id}>
                            <td>{c.id}</td>
                            <td>{c.fournisseur?.nom || 'Fournisseur inconnu'}</td>

                            <td>
                                {Array.isArray(c.produits) && c.produits.length > 0 ? (
                                    c.produits.map((p, i) => (
                                        <span key={i}>
                                                {p.nom}
                                            {i < c.produits.length - 1 ? ', ' : ''}
                                            </span>
                                    ))
                                ) : (
                                    'Produit inconnu'
                                )}
                            </td>



                            <td>
                                {c.date_commande
                                    ? new Date(c.date_commande).toLocaleString()
                                    : 'Date manquante'}
                            </td>
                            <td>{c.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}

export default TableCommande;
