import React, { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "./firebaseconfig";
import { useNavigate } from "react-router-dom";

// Déclarer les états email et password dans firebaseconnect
export const useAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const auth = getAuth();
  const navigate = useNavigate();

  // Fonction pour connecter un utilisateur
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/statistiques"); // Redirige vers statistique_page après connexion
    } catch (error) {
      console.error("Erreur de connexion : ", error.message);
    }
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/test"); // Redirige vers la page test après déconnexion
    } catch (error) {
      console.error("Erreur lors de la déconnexion : ", error.message);
    }
  };

  // Vérifier l'état de l'utilisateur à l'ouverture de l'application
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        navigate("/statistiques"); // Redirige vers statistique_page si l'utilisateur est connecté
      }
    });

    return () => {
      unsubscribe(); // Nettoyage de l'écouteur
    };
  }, [auth, navigate]);

  // Fonction pour envoyer un email de réinitialisation de mot de passe
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Un email de réinitialisation a été envoyé !");
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe : ", error.message);
    }
  };

  // Renvoi toutes les variables / Fonctions nécessaires au front
  return {email, setEmail, password, setPassword, user, handleLogin, handleLogout, handlePasswordReset
  };
};
