import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PageConnexion from "./pages/connect_page";
import Statistiques from "./pages/statistique_page";
import Fournisseur from "./pages/fournisseur_page";
import Entrepot from "./pages/entrepot_page";
import CommandePage from "./pages/commande_page";
import ProduitPage from "./pages/produit";

import { AuthProvider, useAuthContext } from "./pages/AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext();
  return user ? children : <Navigate to="/PageConnexion" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/PageConnexion" />} />
          <Route path="/PageConnexion" element={<PageConnexion />} />
          <Route path="/statistiques" element={<Statistiques />} />
          <Route path="/fournisseur" element={<Fournisseur />} />
          <Route path="/entrepot" element={<Entrepot />} />
          <Route path="/commande" element={<CommandePage />} />
          <Route path="/produit" element={<ProduitPage/>}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;