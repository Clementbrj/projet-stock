import "../styles/fournisseur.css";
import FournisseurNav from "../components/Fournisseur_navigation";
import TableFournisseur from "../components/Fournisseur_table";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

function Fournisseur() {
    return (
        <>
            <Navbar />
            <main className="fournisseur">
                <FournisseurNav />
                <TableFournisseur />
            </main>
            <Footer />

        </>
    );
};

export default Fournisseur;
