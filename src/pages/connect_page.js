import { useAuth } from "../services/firebaseconnect";
import { Navigate } from "react-router-dom";
import "../css/styles.css";

function PageConnexion() {
  const { email, setEmail, password, setPassword, handleLogin, user } = useAuth();

  // Si l'utilisateur est déjà connecté, le rediriger vers /test
  if (user) {
    return <Navigate to="/test" />;
  }

  return (
      <div className="container">
        <div className="container-login">
          <h1 className="title">Sign in to your account</h1>
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
            />
            <div className="conteneur-reset-password">
              <button className="reset-password" /* onClick={handlePasswordReset} */>Mot de passe oublié</button>
            </div>
            <button type="submit" className="form-submit">Se connecter</button>
          </form>

        </div>
      </div>
  );
}

export default PageConnexion;
