import { useEffect, useState } from "react";
import axios from "axios";

function TableStock({ selectedProduitId }) {
    const [stocks, setStocks] = useState([]);
    const [condensedView, setCondensedView] = useState(true);
    const [filterPeriod, setFilterPeriod] = useState("all");

    useEffect(() => {
        axios.get("http://localhost:3100/stock/read")
            .then((res) => {
                setStocks(res.data);
            })
            .catch((err) => {
                console.error("Erreur chargement stocks :", err);
            });
    }, []);

    // Fonction de filtrage par période
    const filterByPeriod = (data, period) => {
        if (period === "all") return data;

        const now = new Date();
        let threshold;

        switch (period) {
            case "day":
                threshold = new Date(now.setDate(now.getDate() - 1));
                break;
            case "week":
                threshold = new Date(now.setDate(now.getDate() - 7));
                break;
            case "month":
                threshold = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case "year":
                threshold = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            default:
                return data;
        }

        return data.filter((s) => new Date(s.date_maj) >= threshold);
    };

    let displayData = [];

    // Appliquer le filtre produit + période
    const filtered = selectedProduitId
        ? filterByPeriod(
            stocks.filter((s) => parseInt(s.id_produit) === parseInt(selectedProduitId)),
            filterPeriod
        )
        : filterByPeriod(stocks, filterPeriod);

    if (condensedView) {
        const grouped = {};
        filtered.forEach((s) => {
            const key = s.id_produit;
            if (!grouped[key]) {
                grouped[key] = {
                    entrepots: new Set(),
                    produit: s.produit,
                    quantite: 0,
                    date_maj: s.date_maj,
                };
            }
            grouped[key].entrepots.add(s.entrepot);
            grouped[key].quantite += s.quantite;

            if (new Date(s.date_maj) > new Date(grouped[key].date_maj)) {
                grouped[key].date_maj = s.date_maj;
            }
        });

        displayData = Object.values(grouped).map((item) => ({
            entrepot: Array.from(item.entrepots).join(", "),
            produit: item.produit,
            quantite: item.quantite,
            date_maj: item.date_maj,
        }));
    } else {
        displayData = filtered;
    }

    return (
        <section className="liste-stock">
            <div className="container_titre_stock">
                <div className="container_titre_filtre">
                    <h2>Liste des stocks</h2>
                    <div className="filtre-periode">
                        <label htmlFor="period">Filtrer par période :</label>
                        <select
                            id="period"
                            value={filterPeriod}
                            onChange={(e) => setFilterPeriod(e.target.value)}
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
                <button
                    className="toggle-view-btn"
                    onClick={() => setCondensedView(!condensedView)}
                >
                    {condensedView ? "Voir toutes les lignes" : "Voir le résumé par produit"}
                </button>
            </div>


            <table className="table_stock">
                <thead>
                <tr>
                    <th>Entrepôt</th>
                    <th>Produit</th>
                    <th>Quantité</th>
                    <th>Date de mise à jour</th>
                </tr>
                </thead>
                <tbody>
                {displayData.map((s, index) => (
                    <tr key={index}>
                        <td>{s.entrepot || "Inconnu"}</td>
                        <td>{s.produit || "Inconnu"}</td>
                        <td>{s.quantite}</td>
                        <td>
                            {s.date_maj
                                ? new Date(s.date_maj).toLocaleString()
                                : "Date manquante"}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </section>
    );
}

export default TableStock;
