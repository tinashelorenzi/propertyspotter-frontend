import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  React.useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <img 
                src="https://raw.githubusercontent.com/tinashelorenzi/propertyspotter-prod/refs/heads/main/static/images/logo.png"
                alt="PropertySpotter Logo"
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-[#225AE3]/20 to-[#F59E0B]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">
                PropertySpotter
              </h1>
              <p className="text-sm text-gray-600 font-medium">Your property, our treasure</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <Link 
                to="/properties" 
                className="relative text-gray-700 hover:text-[#225AE3] font-medium transition-colors duration-200 group"
              >
                Properties
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/blog" 
                className="relative text-gray-700 hover:text-[#225AE3] font-medium transition-colors duration-200 group"
              >
                Blog
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/how-it-works" 
                className="relative text-gray-700 hover:text-[#225AE3] font-medium transition-colors duration-200 group"
              >
                How It Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="px-6 py-2.5 text-gray-700 hover:text-[#225AE3] font-semibold transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="relative px-6 py-2.5 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B] to-[#225AE3] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`w-5 h-0.5 bg-[#225AE3] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-[#225AE3] transition-all duration-300 mt-1 ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-[#225AE3] transition-all duration-300 mt-1 ${menuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        menuOpen 
          ? 'max-h-screen opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200/20 shadow-lg">
          <div className="flex flex-col py-6 space-y-4 px-4">
            <Link 
              to="/properties" 
              className="text-gray-700 hover:text-[#225AE3] font-medium text-lg py-2 px-4 rounded-lg hover:bg-[#E9EEFB]/50 transition-all duration-200" 
              onClick={() => setMenuOpen(false)}
            >
              Properties
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-gray-700 hover:text-[#225AE3] font-medium text-lg py-2 px-4 rounded-lg hover:bg-[#E9EEFB]/50 transition-all duration-200" 
              onClick={() => setMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              to="/blog" 
              className="text-gray-700 hover:text-[#225AE3] font-medium text-lg py-2 px-4 rounded-lg hover:bg-[#E9EEFB]/50 transition-all duration-200" 
              onClick={() => setMenuOpen(false)}
            >
              Blog
            </Link>
            
            <div className="pt-4 border-t border-gray-200/50 space-y-3">
              <Link 
                to="/login" 
                className="block w-full py-3 px-4 text-center text-gray-700 hover:text-[#225AE3] font-semibold rounded-lg hover:bg-[#E9EEFB]/50 transition-all duration-200" 
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="block w-full py-3 px-4 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white font-semibold text-center rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300" 
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}