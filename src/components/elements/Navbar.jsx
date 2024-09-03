import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../providers/UserProvider';

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 p-4 flex flex-wrap items-center justify-between">
      <div className="flex items-center">
        <img src="/Log2.PNG" alt="Logo" className="h-10 mr-2" />
        <div>
          <div className="text-white text-3xl font-bold" style={{ fontFamily: 'Tilda Script Bold' }}>
            Book Spot
          </div>
          <div className="text-white text-sm mt-1" style={{ fontFamily: 'Serif' }}>
            Bibliothèque accessible à tous
          </div>
        </div>
      </div>
      <div className="block lg:hidden">
        <button
          onClick={toggleMenu}
          className="text-white focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
      <div className={`w-full lg:flex lg:items-center lg:w-auto ${isOpen ? 'block' : 'hidden'}`}>
        <div className="text-sm lg:flex-grow">
          <Link to="/" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4">
            Home
          </Link>
          <Link to="/catalog" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4">
            Catalog
          </Link>
          <Link to="/sellBooks" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4">
            Sell Books
          </Link>
          <Link to="/borrowBooks" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4">
            Borrow Books
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4">
                Profile
              </Link>
              <button
                onClick={logout}
                className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4">
                Login
              </Link>
              <Link to="/signup" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
