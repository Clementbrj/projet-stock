import { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "./firebaseconfig";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/statistiques");
    } catch (error) {
      console.error("Erreur de connexion : ", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/PageConnexion");
    } catch (error) {
      console.error("Erreur lors de la déconnexion : ", error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, [auth, navigate]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Un email de réinitialisation a été envoyé !");
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe : ", error.message);
    }
  };

  return { email, setEmail, password, setPassword, handleLogin, handleLogout, handlePasswordReset, user };
};
