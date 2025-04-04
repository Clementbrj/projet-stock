// src/components/HeaderFournisseur.jsx

function FournisseurNav() {
    return (
        <section className="container_titre">
            <header>
                <h1 className="title">Liste des fournisseurs</h1>
            </header>

            <div className="container_recherche">
                <label htmlFor="recherche_fournisseur" className="visually-hidden">Rechercher un fournisseur</label>
                <input
                    type="text"
                    id="recherche_fournisseur"
                    className="recherche_fournisseur"
                    placeholder="Rechercher un fournisseur 🔍"
                />
                <button className="button_recherche" aria-label="Rechercher un fournisseur">🔍</button>
            </div>

            <nav aria-label="Trier les fournisseurs">
                <select className="select_fournisseur" aria-label="Options de tri">
                    <option value="" disabled selected>Trier par ...</option>
                    <option value="">Lorem ispum</option>
                    <option value="">Lorem ispum</option>
                </select>
            </nav>
        </section>
    );
}

export default FournisseurNav;
