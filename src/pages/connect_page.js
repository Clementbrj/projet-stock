import { useAuth } from "../services/firebaseconnect";

function Test() {
  const { email, setEmail, password, setPassword, handleLogin, handleLogout, handlePasswordReset } = useAuth();

  return (
    <div>
      {/* Ton JSX ici pour afficher l'interface de connexion */}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
        />
        <button type="submit">Se connecter</button>
      </form>
      <button onClick={handlePasswordReset}>Mot de passe oublié</button>
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  );
};

export default Test;
