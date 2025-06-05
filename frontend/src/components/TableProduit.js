import { useEffect, useState } from 'react';
import axios from 'axios';

function TableProduit({ selectedProduitId }) {
    const [produits, setProduits] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3100/produit/read')
            .then((res) => {
                setProduits(res.data);
            })
            .catch((err) => {
                console.error("❌ Erreur chargement produits :", err);
            });
    }, []);

    const filteredProduits = selectedProduitId
        ? produits.filter((p) => {
            return parseInt(p.id) === parseInt(selectedProduitId);
        })
        : produits;


    return (
        <section className="liste-produit">
            <h2>Liste des produits</h2>
            <table className="table_produit">
                <thead>
                <tr>
                    <th>N°Produit</th>
                    <th>Nom</th>
                    <th>Prix</th>
                </tr>
                </thead>
                <tbody>
                {filteredProduits.map((p) => (
                    <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.nom}</td>
                        <td>{p.prix} €</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </section>
    );
}

export default TableProduit;
