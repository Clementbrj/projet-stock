import { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, createUserWithEmailAndPassword } from "./firebaseconfig";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const auth = getAuth();
  const navigate = useNavigate();

  // Login state
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/statistiques");
    } catch (error) {
      console.error("Connexion Firebase : ", error.message);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/PageConnexion");
    } catch (error) {
      console.error("Déconnexion Firebase : ", error.message);
    }
  };

  // Password Reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Un email de réinitialisation a été envoyé !");
    } catch (error) {
      console.error("PasswordReset FireBase : ", error.message);
    }
  };

  // Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Inscription réussie !");
      navigate("/statistiques");
    } catch (error) {
      console.error("Inscription Firebase : ", error.message);
    }
  };

  // ---------------------------
  // Dynamic management
  // ---------------------------
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, [auth, navigate]);

  return { email, setEmail, password, setPassword, handleLogin, handleLogout, handlePasswordReset, handleSignUp, user };
};
