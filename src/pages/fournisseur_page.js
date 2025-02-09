import { useAuth } from "../services/firebaseconnect";
import "../css/fournisseur.css";
import NavBar from "../components/NavBar";
import FournisseurTri from "../components/FournisseurTri";
import FournisseurTable from "../components/FournisseurTable";
import { Link } from "react-router-dom";

function Fournisseur() {
    return (
        <>
            <NavBar />
            <main className="fournisseur">
                <FournisseurTri />
                <FournisseurTable />
            </main>
        </>
    );
}

export default Fournisseur;
