import "../styles/statistique.css";
import {useEffect, useState} from "react";
import axios from "axios";
import {useAuthContext} from "./AuthProvider";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import TableProduit from "../components/TableProduit";
import TableCommande from "../components/TableCommande";
import TableStock from "../components/TableStock";

function Statistiques() {
    const {handleLogout} = useAuthContext();
    const [produits, setProduits] = useState([]);
    const [selectedProduitId, setSelectedProduitId] = useState("");

    useEffect(() => {
        axios.get("http://localhost:3100/produit/read")
            .then((res) => {
                setProduits(res.data);
            })
            .catch((err) => {
                console.error("Erreur chargement produits :", err);
            });
    }, []);

    return (
        <>
            <Navbar/>
            <main className="statistique">
                <h1 className="title">Tableau de bord</h1>

                {/* Select de filtrage */}
                <div className="filtre-produit">
                    <label htmlFor="filtre">Filtrer par produit: </label>
                    <select
                        id="filtre"
                        value={selectedProduitId}
                        onChange={(e) => setSelectedProduitId(e.target.value)}
                    >
                        <option value="">Tous les produits</option>
                        {produits.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nom}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grille-tableaux">
                    <div className="ligne-tableaux">
                        <TableProduit selectedProduitId={selectedProduitId} />
                        <TableCommande selectedProduitId={selectedProduitId} />
                    </div>
                    <div className="ligne-tableaux">
                        <TableStock selectedProduitId={selectedProduitId} />

                    </div>
                </div>

            </main>
            <Footer/>
        </>
    );
}

export default Statistiques;
