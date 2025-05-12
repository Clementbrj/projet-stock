import { useEffect, useState } from "react";
import "../styles/entrepot.css";
import axios from "axios";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

function Entrepot() {
    const [entrepots, setEntrepots] = useState([]); // Warehouse list
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [formData, setFormData] = useState({ nom: "", adresse: "", capacite: "" }); // Form data
    const [isEditing, setIsEditing] = useState(false); // Editing state
    const [editingId, setEditingId] = useState(null); // ID of the edited warehouse
    const [sortBy, setSortBy] = useState("nom");

    // ---------------------------
    // Dynamic management
    // ---------------------------
    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:3100/entrepot/read?sortBy=${sortBy}`)
            .then((response) => {
                setEntrepots(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Error fetching warehouses.");
                setLoading(false);
            });
    }, [sortBy]);

    // Delete warehouse
    const deleteEntrepot = (id) => {
        axios.delete(`http://localhost:3100/entrepot/delete/${id}`)
            .then(() => {
                setEntrepots(entrepots.filter(e => e.id !== id));
            })
            .catch(() => {
                setError("Error deleting warehouse.");
            });
    };

    // Create warehouse
    const create = () => {
        if (!formData.nom || !formData.adresse || !formData.capacite) {
            alert("Missing required field!");
            return;
        }
        axios.post("http://localhost:3100/entrepot/create", formData)
            .then((response) => {
                setEntrepots([...entrepots, response.data]);
                setFormData({ nom: "", adresse: "", capacite: "" });
            })
            .catch(() => {
                setError("Error adding warehouse.");
            });
    };

    // Edit warehouse
    const edit = (id) => {
        const e = entrepots.find(e => e.id === id);
        setFormData({ nom: e.nom, adresse: e.adresse, capacite: e.capacite });
        setIsEditing(true);
        setEditingId(id);
    };

    // Update warehouse
    const update = () => {
        if (!formData.nom || !formData.adresse || !formData.capacite) {
            alert("Missing required field!");
            return;
        }
        axios.put(`http://localhost:3100/entrepot/update/${editingId}`, formData)
            .then(() => {
                setEntrepots(entrepots.map(e =>
                    e.id === editingId ? { ...e, ...formData } : e
                ));
                setIsEditing(false);
                setEditingId(null);
                setFormData({ nom: "", adresse: "", capacite: "" });
            })
            .catch(() => {
                setError("Error updating warehouse.");
            });
    };

    return (
        <div>
            <Navbar/>

            <main className="entrepot">
                <h1 className="title">Warehouse List</h1>
                {/* ---------------------------
                    Form
                --------------------------- */}
                <div className="formulaire">
                    <input type="text" placeholder="Name" value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
                    <input type="text" placeholder="Address" value={formData.adresse}
                        onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} />
                    <input type="number" placeholder="Capacity" value={formData.capacite}
                        onChange={(e) => setFormData({ ...formData, capacite: e.target.value })} />
                    <button onClick={isEditing ? update : create} className="button-enregistrer">
                        {isEditing ? "Update" : "Add Warehouse"}
                    </button>
                </div>

                <div className="container_titre">
                    <select className="select_entrepot" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="nom">Name</option>
                        <option value="adresse">Address</option>
                        <option value="capacite">Capacity</option>
                    </select>
                </div>
                {/* ---------------------------
                    wareHouse List
                --------------------------- */}
                <div className="liste-entrepot">
                    {error && <p className="error">{error}</p>}
                    {loading ? <p>Loading...</p> : (
                        <table className="table_entrepot">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Capacity</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entrepots.length === 0 ? (
                                    <tr><td colSpan="4">No warehouses found.</td></tr>
                                ) : (
                                    entrepots.map(e => (
                                        <tr key={e.id}>
                                            <td>{e.nom}</td>
                                            <td>{e.adresse}</td>
                                            <td>{e.capacite}</td>
                                            <td>
                                                <button onClick={() => edit(e.id)}>Edit</button>
                                                <button onClick={() => deleteEntrepot(e.id)}>❌</button>
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

export default Entrepot;
