import { useEffect, useState } from "react";
import "../styles/fournisseur.css";
import axios from "axios";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

function Fournisseur() {
    const [fournisseurs, setFournisseurs] = useState([]); // Provider list
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [formData, setFormData] = useState({ nom: "", adresse: "" }); // Form data
    const [isEditing, setIsEditing] = useState(false); // Editing state
    const [editingId, setEditingId] = useState(null); // ID of the provider being edited
    const [sortBy, setSortBy] = useState("nom"); // Sort by field

    // ---------------------------
    // Dynamic management
    // ---------------------------
    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:3100/fournisseur/read?sortBy=${sortBy}`)
            .then((response) => {
                setFournisseurs(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Error fetching providers.");
                setLoading(false);
            });
    }, [sortBy]);

    // Delete provider
    const deleteFournisseur = (id) => {
        axios.delete(`http://localhost:3100/fournisseur/delete/${id}`)
            .then(() => {
                setFournisseurs(fournisseurs.filter(f => f.id !== id));
            })
            .catch(() => {
                setError("Error deleting provider.");
            });
    };

    // Create provider
    const create = () => {
        axios.post("http://localhost:3100/fournisseur/create", formData)
            .then((response) => {
                setFournisseurs([...fournisseurs, response.data]);
                setFormData({ nom: "", adresse: "" });
            })
            .catch(() => {
                setError("Error adding provider.");
            });
    };

    // Edit provider
    const edit = (id) => {
        const f = fournisseurs.find(f => f.id === id);
        setFormData({ nom: f.nom, adresse: f.adresse });
        setIsEditing(true);
        setEditingId(id);
    };

    // Update provider
    const update = () => {
        axios.put(`http://localhost:3100/fournisseur/update/${editingId}`, formData)
            .then(() => {
                setFournisseurs(fournisseurs.map(f =>
                    f.id === editingId ? { ...f, ...formData } : f
                ));
                setIsEditing(false);
                setEditingId(null);
                setFormData({ nom: "", adresse: "" });
            })
            .catch(() => {
                setError("Error updating provider.");
            });
    };

    return (
        <div>
            <Navbar/>
            <main className="fournisseur">
                <h1 className="title">Provider List</h1>
                {/* ---------------------------
                    Form
                --------------------------- */}
                <div className="formulaire">
                    <input type="text" placeholder="Name" value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
                    <input type="text" placeholder="Address" value={formData.adresse}
                        onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} />
                    <button onClick={isEditing ? update : create} className="button-enregistrer">
                        {isEditing ? "Update" : "Add Provider"}
                    </button>
                </div>

                <div className="container_titre">
                    <select className="select_fournisseur" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="nom">Name</option>
                        <option value="adresse">Address</option>
                    </select>
                </div>
                {/* ---------------------------
                    Display provider list
                --------------------------- */}
                <div className="liste-fournisseur">
                    {error && <p className="error">{error}</p>}
                    {loading ? <p>Loading...</p> : (
                        <table className="table_fournisseur">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fournisseurs.length === 0 ? (
                                    <tr><td colSpan="3">No providers found.</td></tr>
                                ) : (
                                    fournisseurs.map(f => (
                                        <tr key={f.id}>
                                            <td>{f.nom}</td>
                                            <td>{f.adresse}</td>
                                            <td>
                                                <div className="container_button_action">
                                                    <button className="button_action" onClick={() => edit(f.id)}>Edit</button>
                                                    <button className="button_action" onClick={() => deleteFournisseur(f.id)}>❌</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
            <Footer/>
        </div>
    );
}

export default Fournisseur;
