import { useState } from 'react';
import { Link } from 'react-router-dom';
import Toast from '../components/Toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}api/users/password-reset/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setToast({
          message: 'Password reset instructions have been sent to your email.',
          type: 'success',
          isVisible: true,
        });
        setEmail('');
      } else {
        const data = await response.json();
        setToast({
          message: data.message || 'Failed to send reset instructions. Please try again.',
          type: 'error',
          isVisible: true,
        });
      }
    } catch (error) {
      setToast({
        message: 'An error occurred. Please try again.',
        type: 'error',
        isVisible: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex items-center justify-center">
      <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-[#E9EEFB] via-white to-[#225AE3]/10 animate-gradient-move" />
      
      {/* Floating Home Button */}
      <Link 
        to="/" 
        className="fixed top-4 left-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-200"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 text-[#225AE3]" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
          />
        </svg>
      </Link>

      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-[#225AE3] mb-6 text-center">Reset Password</h1>
        <p className="text-gray-600 mb-6 text-center">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#225AE3] focus:border-[#225AE3]"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full btn-primary text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Instructions'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Remember your password? <Link to="/login" className="text-[#225AE3] hover:underline">Sign in</Link>
        </p>
      </div>
      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
        />
      )}
    </div>
  );
};

export default ForgotPasswordPage; 