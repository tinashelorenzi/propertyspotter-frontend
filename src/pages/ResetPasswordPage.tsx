import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    password_confirm: '',
  });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.password_confirm) {
      setToast({
        message: 'Passwords do not match',
        type: 'error',
        isVisible: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}api/users/password-reset/confirm/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password,
          password_confirm: formData.password_confirm,
        }),
      });

      if (response.ok) {
        setToast({
          message: 'Password reset successful! Redirecting to login...',
          type: 'success',
          isVisible: true,
        });
        
        // Clear form
        setFormData({
          password: '',
          password_confirm: '',
        });

        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const data = await response.json();
        setToast({
          message: data.message || 'Failed to reset password. The link may be invalid or expired.',
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
          Please enter your new password below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#225AE3] focus:border-[#225AE3]"
              required
              minLength={8}
            />
          </div>
          <div>
            <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              id="password_confirm"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#225AE3] focus:border-[#225AE3]"
              required
              minLength={8}
            />
          </div>
          <button 
            type="submit" 
            className="w-full btn-primary text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
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

export default ResetPasswordPage; 