
import "../styles/footer.css";

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <section className="footer-content">
                <article className="footer-section">
                    <h4>À propos</h4>
                    <p>Entreprise spécialisée dans la gestion de stock pour une chaîne de magasins.</p>
                </article>

                <article className="footer-section">
                    <h4>Contact</h4>
                    <address>
                        <p>Email : <a href="#">contact@StockManager.com</a></p>
                        <p>Tél : <a href="#">+33 XX XX XX XX XX</a></p>
                    </address>
                </article>

                <nav className="footer-section" aria-label="Liens utiles">
                    <h4>Liens utiles</h4>
                    <ul>
                        <li><a href="#">Mentions légales</a></li>
                        <li><a href="#">Politique de confidentialité</a></li>
                    </ul>
                </nav>
            </section>

            <div className="footer-bottom">
                &copy; {currentYear} Entreprise. Tous droits réservés.
            </div>
        </footer>
    );
}

export default Footer;
