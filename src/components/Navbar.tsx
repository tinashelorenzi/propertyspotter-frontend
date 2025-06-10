import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex flex-col items-center">
              <img 
                src="https://raw.githubusercontent.com/tinashelorenzi/propertyspotter-prod/refs/heads/main/static/images/logo.png"
                alt="PropertySpotter Logo"
                className="h-10 w-auto"
              />
              <p className="text-sm text-gray-500 mt-1">Your property, our pleasure</p>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/how-it-works" className="text-gray-600 hover:text-[#225AE3]">How It Works</Link>
            <Link to="/blog" className="text-gray-600 hover:text-[#225AE3]">Blog</Link>
            <Link to="/login" className="btn-secondary">Sign In</Link>
            <Link to="/register" className="btn-primary text-lg shadow-xl">Get Started</Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 