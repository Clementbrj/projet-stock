import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Home from "./pages/home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route par défaut (accueil) */}
        <Route path="/" element={<Navigate to="/home" />} />
        {/* Liste des routes */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;