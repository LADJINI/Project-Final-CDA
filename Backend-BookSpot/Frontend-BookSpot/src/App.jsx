import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { BookProvider } from './context/BookContext';
import { AuthProvider } from './context/AuthContext'; // Assurez-vous que ce chemin est correct

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CookieConsent from "./components/common/CookieConsent";

// Page Components
import Home from './pages/Home';
import Panier from './pages/Panier';
import NotFound from './pages/NotFound';
import AjouterLivreVente from './pages/books/AjouterLivreVente';
import AcheterLivre from './pages/books/AcheterLivre';
import AjouterLivrePret from './pages/books/AjouterLivrePret';
import EmprunterLivre from './pages/books/EmprunterLivre';
import SearchResultsPage from './pages/SearchResultsPage';
import Checkout from './pages/Checkout';
import UserProfile from './pages/UserProfile'; 

function App() {
  return (
    <AuthProvider> {/* Ajoutez le AuthProvider ici */}
      <BookProvider>
        <CartProvider>
          <div className="App">
            <Navbar />
            
            <main className="container mx-auto mt-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/panier" element={<Panier />} />
                <Route path="/ajouter-livre-vente" element={<AjouterLivreVente />} />
                <Route path="/acheter-livre" element={<AcheterLivre />} />
                <Route path="/ajouter-livre-pret" element={<AjouterLivrePret />} />
                <Route path="/emprunter-livre" element={<EmprunterLivre />} />
                <Route path="/search-results" element={<SearchResultsPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <CookieConsent />
          </div>
        </CartProvider>
      </BookProvider>
    </AuthProvider>
  );
}

export default App;
