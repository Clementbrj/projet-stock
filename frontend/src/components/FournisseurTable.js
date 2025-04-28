import { useEffect, useState } from 'react';
import axios from 'axios';

function TableEntrepot() {
    const [entrepots, setEntrepots] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3100/entrepot/read')
            .then((res) => {
                console.log("Données récupérées des entrepôts :", res.data);
                setEntrepots(res.data);
            })
            .catch((err) => {
                console.error("Erreur lors de la récupération des entrepôts :", err);
            });
    }, []);

    // Fonction pour afficher les détails de l'entrepôt dans la console
    const handleClick = (id) => {
        const entrepot = entrepots.find((ent) => ent.id === id);

        // Affichage des détails dans la console
        console.log("Détails de l'entrepôt sélectionné :");
        console.log(`ID: ${entrepot.id}`);
        console.log(`Nom: ${entrepot.nom}`);
        console.log(`Adresse: ${entrepot.adresse}`);
        console.log(`Capacité: ${entrepot.capacite}`);
    };

    return (
        <section className="liste-entrepot">
            <h2>Liste des entrepôts</h2>
            <table className="table_entrepot">
                <thead>
                <tr>
                    <th scope="col">Nom</th>
                </tr>
                </thead>
                <tbody>
                {entrepots.map((entrepot) => (
                    <tr key={entrepot.id}>
                        <td>
                            {/* Lien pour afficher les détails de l'entrepôt */}
                            <button onClick={() => handleClick(entrepot.id)}>{entrepot.nom}</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </section>
    );
}

export default TableEntrepot;
