// import { useAuth } from "../services/firebaseconnect";
import "../styles/statistique.css";
import {Link} from "react-router-dom";
import React from "react";
import { useAuthContext } from "./AuthProvider";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";


function Statistiques() {
    const { handleLogout } = useAuthContext();
    return (
        <>
            <Navbar />
            <main className="statistique">
                <h1 className="title">Tableau de board</h1>
            </main>
            <Footer />
        </>
    );
};

export default Statistiques;
