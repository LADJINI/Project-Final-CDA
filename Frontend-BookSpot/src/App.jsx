// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import SignupForm from './components/elements/SignupForm';
import LoginForm from './components/elements/LoginForm';
import Navbar from './components/elements/Navbar';
import Footer from './components/elements/Footer';
import Profile from './components/pages/profile';
import Catalog from './components/pages/Catalog';
import SellBooks from './components/pages/SellBooks';
import BorrowBooks from './components/pages/BorrowBooks';
import { UserProvider } from './components/providers/UserProvider';

const App = () => (
  <UserProvider>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/loginForm" element={<LoginForm />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/catalog">
        <Route path="sell" element={<SellBooks />} />
        <Route path="borrow" element={<BorrowBooks />} />
      </Route>
    </Routes>
    <Footer />
  </UserProvider>
);

export default App;
