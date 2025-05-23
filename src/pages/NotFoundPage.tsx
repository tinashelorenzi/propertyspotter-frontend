import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans flex items-center justify-center">
      <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-[#E9EEFB] via-white to-[#225AE3]/10 animate-gradient-move" />
      <div className="text-center px-4">
        <h1 className="text-9xl font-extrabold text-[#225AE3] mb-4">404</h1>
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#225AE3] to-[#225AE3]/50 rounded-lg blur opacity-25"></div>
          <div className="relative bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Oops! The page you're looking for seems to have vanished into thin air. 
              Don't worry, you can always find your way back home.
            </p>
            <Link 
              to="/" 
              className="inline-block btn-primary text-lg shadow-lg"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 