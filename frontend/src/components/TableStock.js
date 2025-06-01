import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Title,
} from "chart.js";

ChartJS.register(
    BarElement,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Title
);

function TableStock({ selectedProduitId }) {
    const [stocks, setStocks] = useState([]);
    const [condensedView, setCondensedView] = useState(true);
    const [filterPeriod, setFilterPeriod] = useState("all");
    const [sortKey, setSortKey] = useState("date_desc");
    const [showChart, setShowChart] = useState(false);
    const [chartType, setChartType] = useState("bar");

    useEffect(() => {
        axios.get("http://localhost:3100/stock/read")
            .then((res) => setStocks(res.data))
            .catch((err) => console.error("Erreur chargement stocks :", err));
    }, []);

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
            entrepot: Array.from(item.entrepots)
                .map((e) => (typeof e === "object" && e.nom ? e.nom : e))
                .join(", "),
            produit: item.produit,
            quantite: item.quantite,
            date_maj: item.date_maj,
        }));
    } else {
        displayData = filtered;
    }

    displayData.sort((a, b) => {
        const getValue = (obj, key) => (obj[key] || "").toString().toLowerCase();

        switch (sortKey) {
            case "date_asc":
                return new Date(a.date_maj) - new Date(b.date_maj);
            case "date_desc":
                return new Date(b.date_maj) - new Date(a.date_maj);
            case "produit_asc":
                return getValue(a, "produit").localeCompare(getValue(b, "produit"));
            case "produit_desc":
                return getValue(b, "produit").localeCompare(getValue(a, "produit"));
            case "entrepot_asc":
                return getValue(a, "entrepot").localeCompare(getValue(b, "entrepot"));
            case "entrepot_desc":
                return getValue(b, "entrepot").localeCompare(getValue(a, "entrepot"));
            default:
                return 0;
        }
    });

    const chartData = condensedView
        ? {
            labels: displayData.map((item) =>
                typeof item.produit === "object" ? item.produit.nom : item.produit
            ),
            datasets: [
                {
                    label: "Quantité en stock",
                    data: displayData.map((item) => item.quantite),
                    backgroundColor: "rgba(75, 192, 192, 0.5)",
                },
            ],
        }
        : {
            labels: displayData.map((item) => {
                const produitLabel =
                    typeof item.produit === "object" ? item.produit.nom : item.produit;
                return `${produitLabel} (${item.entrepot}) - ${new Date(item.date_maj).toLocaleDateString()}`;
            }),
            datasets: [
                {
                    label: "Quantité par enregistrement",
                    data: displayData.map((item) => item.quantite),
                    backgroundColor: "rgba(153, 102, 255, 0.6)",
                    borderColor: "rgba(153, 102, 255, 1)",
                    fill: false,
                    tension: 0.3,
                },
            ],
        };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Quantités en stock par produit" },
        },
    };

    return (
        <section className="liste-stock">
            <div className="container_titre_stock">
                <div className="container_titre_filtre">
                    <h2 className="titre_stock">Liste des stocks</h2>
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

                    <div className="tri-generale">
                        <label htmlFor="sortKey">Trier par :</label>
                        <select
                            id="sortKey"
                            value={sortKey}
                            onChange={(e) => setSortKey(e.target.value)}
                            className="sort-select"
                        >
                            <option value="date_desc">Date (récentes → anciennes)</option>
                            <option value="date_asc">Date (anciennes → récentes)</option>
                            <option value="produit_asc">Produit (A → Z)</option>
                            <option value="produit_desc">Produit (Z → A)</option>
                            <option value="entrepot_asc">Entrepôt (A → Z)</option>
                            <option value="entrepot_desc">Entrepôt (Z → A)</option>
                        </select>
                    </div>
                </div>

                <button
                    className="toggle-view-btn"
                    onClick={() => setCondensedView(!condensedView)}
                >
                    {condensedView ? "Voir toutes les lignes" : "Voir le résumé par produit"}
                </button>

                <button
                    className="chart-btn"
                    onClick={() => setShowChart(!showChart)}
                    style={{ marginLeft: "10px" }}
                >
                    {showChart ? "Masquer le graphique" : "Afficher le graphique"}
                </button>

                {showChart && (
                    <button
                        className="chart-type-toggle-btn"
                        onClick={() => setChartType(chartType === "bar" ? "line" : "bar")}
                        style={{ marginLeft: "10px" }}
                    >
                        Changer de type de graphique ({chartType === "bar" ? "Lignes" : "Barres"})
                    </button>
                )}
            </div>

            {showChart ? (
                <div style={{ maxWidth: "800px", margin: "20px auto" }}>
                    {chartType === "bar" ? (
                        <Bar data={chartData} options={chartOptions} />
                    ) : (
                        <Line data={chartData} options={chartOptions} />
                    )}
                </div>
            ) : (
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
                    {displayData.map((s, index) => {
                        const entrepotNom =
                            typeof s.entrepot === "object" ? s.entrepot.nom : s.entrepot;
                        const produitNom =
                            typeof s.produit === "object"
                                ? `${s.produit.nom} (${s.produit.prix ?? "?"}€)`
                                : s.produit;

                        return (
                            <tr key={index}>
                                <td>{entrepotNom}</td>
                                <td>{produitNom}</td>
                                <td>{s.quantite}</td>
                                <td>
                                    {s.date_maj
                                        ? new Date(s.date_maj).toLocaleString()
                                        : "Date manquante"}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>

                </table>
            )}
        </section>
    );
}

export default TableStock;
