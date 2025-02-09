import { useAuth } from "../services/firebaseconnect";
import "../css/statistique.css";
import {Link} from "react-router-dom";
import React from "react";
import { useAuthContext } from "./AuthProvider";
import NavBar from "../components/NavBar";


function Statistiques() {
  /*  const { email, setEmail, password, setPassword, handleLogin, handleLogout, handlePasswordReset } = useAuth();
*/
    const { user, handleLogout } = useAuthContext();
    return (
        <>
            <NavBar />
            <main className="statistique">
                <h1 className="title">Tableau de board</h1>
            </main>

        </>
    );
};
export default Statistiques;
