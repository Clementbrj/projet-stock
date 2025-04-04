import { useAuth } from "../services/firebaseconnect";
import { Navigate } from "react-router-dom";
import "../styles/styles.css";

function PageConnexion() {
  const { email, setEmail, password, setPassword, handleLogin, user, handlePasswordReset } = useAuth();

  // Si l'utilisateur est déjà connecté, le rediriger vers /statistiques
  if (user) {
    return <Navigate to="/statistiques" />;
  }

  return (
      <main>
        <section className="container">
          <section className="container-login">
            <header>
              <h1 className="title">Sign in to your account</h1>
            </header>
            <form onSubmit={handleLogin} className="form-connexion">
                <label htmlFor="email" className="label-form-connexion">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="form-email"
                />
                <label htmlFor="password" className="label-form-connexion">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                    className="form-password"
                    autoComplete="username"
                />

              <section className="conteneur-reset-password">
                <button className="reset-password" onClick={handlePasswordReset}>Mot de passe oublié</button>
              </section>
              <button type="submit" className="form-submit">Se connecter</button>
            </form>
          </section>
        </section>
      </main>
  );
}

export default PageConnexion;
