import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Agency {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string;
  license_valid_until: string | null;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    role: 'Agency_Admin' | 'Agent' | 'Spotter';
    first_name: string;
    last_name: string;
    is_active: boolean;
    agency: Agency;
  };
}

const AgencyLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_API;
      const response = await axios.post<LoginResponse>(
        `${backendUrl}api/users/login/`,
        formData
      );
      const { token, user } = response.data;

      // Store the token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('agency', JSON.stringify(user.agency));

      // Route based on user role
      if (user.role === 'Spotter') {
        navigate('/dashboard');
      } else if (user.role === 'Agency_Admin') {
        navigate('/agency-dashboard');
      } else if (user.role === 'Agent') {
        navigate('/agent-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 relative">
      {/* Floating Home Button */}
      <Link
        to="/"
        className="fixed top-4 left-4 z-50 bg-white rounded-full shadow-lg p-2 hover:shadow-xl transition-shadow border border-gray-200"
        title="Back to Home"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#225AE3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </Link>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Agency/Agent Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to manage your account.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#225AE3] focus:border-[#225AE3] sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#225AE3] focus:border-[#225AE3] sm:text-sm"
                />
                <div className="mt-1 text-right">
                  <Link to="/forgot-password" className="text-sm text-[#225AE3] hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#225AE3] hover:bg-[#1a4bc4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#225AE3] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgencyLoginPage; 