import { useState } from "react";
import { useAuth } from "../services/firebaseconnect";
import { Navigate } from "react-router-dom";
import "../styles/styles.css";

function PageConnexion() {
  const {
    email, setEmail,
    password, setPassword,
    handleLogin, handleSignUp,
    user, handlePasswordReset
  } = useAuth();

  const [isSignup, setIsSignup] = useState(false); // true = inscription, false = connexion

  if (user) {
    return <Navigate to="/statistiques" />;
  }

  const handleSubmit = (e) => {
    if (isSignup) {
      handleSignUp(e);
    } else {
      handleLogin(e);
    }
  };

  return (
    <div className="container">
      <div className="container-login">
        <h1 className="title">
          {isSignup ? "Créer un compte" : "Connexion à votre compte"}
        </h1>

        {/* Switch toggle */}
        <div className="switch-container">
          <span>{isSignup ? "Inscription" : "Connexion"}</span>
          <label className="switch">
            <input type="checkbox" checked={isSignup} onChange={() => setIsSignup(!isSignup)} />
            <span className="slider round"></span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="form-connexion">
          <label htmlFor="email" className="label-form-connexion">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="form-email"
          />
          <label htmlFor="password" className="label-form-connexion">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="form-password"
            autoComplete="current-password"
          />

          {!isSignup && (
            <div className="conteneur-reset-password">
              <button className="reset-password" onClick={handlePasswordReset}>
                Mot de passe oublié
              </button>
            </div>
          )}

          <button type="submit" className="form-submit">
            {isSignup ? "S'inscrire" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PageConnexion;
