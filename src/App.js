import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Test from "./pages/connect_page";
import Statistiques from "./pages/statistique_page";
import Fournisseur from "./pages/fournisseur_page";
import { AuthProvider, useAuthContext } from "./pages/AuthProvider";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuthContext();
    return user ? children : <Navigate to="/test" />;
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Route par défaut (accueil) */}
                    <Route path="/" element={<Navigate to="/test" />} />
                    <Route
                        path="/test"
                        element={
                                <Test />
                        }
                    />
                    {/* Routes accessible que après s'être connecté */}
                    <Route
                        path="/statistiques"
                        element={
                            <ProtectedRoute>
                                <Statistiques />
                           </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/fournisseur"
                        element={
                            <ProtectedRoute>
                                <Fournisseur />
                           </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
