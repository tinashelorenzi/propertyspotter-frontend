import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  React.useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-white/80 backdrop-blur shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex flex-col items-center">
            <img 
              src="https://raw.githubusercontent.com/tinashelorenzi/propertyspotter-prod/refs/heads/main/static/images/logo.png"
              alt="PropertySpotter Logo"
              className="h-10 w-auto"
            />
            <p className="text-sm text-gray-500 mt-1">Your property, our treasure</p>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/how-it-works" className="text-gray-600 hover:text-[#225AE3]">How It Works</Link>
            <Link to="/blog" className="text-gray-600 hover:text-[#225AE3]">Blog</Link>
            <Link to="/login" className="btn-secondary">Sign In</Link>
            <Link to="/register" className="btn-primary text-lg shadow-xl">Get Started</Link>
          </div>

          {/* Hamburger for mobile */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#225AE3]"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="h-7 w-7 text-[#225AE3]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 shadow-lg absolute top-16 left-0 w-full z-50 animate-fade-in">
          <div className="flex flex-col items-center py-4 space-y-2">
            <Link to="/how-it-works" className="text-gray-700 hover:text-[#225AE3] text-lg" onClick={() => setMenuOpen(false)}>How It Works</Link>
            <Link to="/blog" className="text-gray-700 hover:text-[#225AE3] text-lg" onClick={() => setMenuOpen(false)}>Blog</Link>
            <Link to="/login" className="btn-secondary w-4/5 text-center" onClick={() => setMenuOpen(false)}>Sign In</Link>
            <Link to="/register" className="btn-primary w-4/5 text-center text-lg shadow-xl" onClick={() => setMenuOpen(false)}>Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
} 