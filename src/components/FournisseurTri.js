function FournisseurTri() {
    return (
        <div>
            <h1 className="title">Liste des fournisseurs</h1>
            <div className="container_titre">
                <div className="container_recherche">
                    <input type="text" className="recherche_fournisseur" placeholder="Rechercher un fournisseur 🔍" />
                    <button className="button_recherche">🔍</button>
                </div>
                <select className="select_fournisseur">
                    <option value="" selected disabled>Trier par ...</option>
                    <option value="">Lorem ipsum</option>
                    <option value="">Lorem ipsum</option>
                </select>
            </div>
        </div>
    );
}

export default FournisseurTri;
