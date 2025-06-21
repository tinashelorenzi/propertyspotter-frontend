import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Turnstile } from '@marsidev/react-turnstile';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  BuildingOfficeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

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
  const turnstileRef = useRef<any>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null); // Clear error when user types
  };

  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
  };

  const handleTurnstileError = () => {
    setTurnstileToken('');
    setError('Security verification failed. Please try again.');
  };

  const handleTurnstileExpire = () => {
    setTurnstileToken('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if turnstile token is present
    if (!turnstileToken) {
      setError('Please complete the security verification.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_API;
      const response = await axios.post<LoginResponse>(
        `${backendUrl}api/users/login/`,
        {
          ...formData,
          turnstileToken // Include the turnstile token
        }
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
      
      // Reset turnstile on error
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }
      setTurnstileToken('');
      
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E9EEFB]/60 via-white to-[#F59E0B]/20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#225AE3]/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-bl from-[#F59E0B]/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-gradient-to-tr from-[#225AE3]/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Branding */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
          <div className="max-w-md w-full">
            <div className="text-center lg:text-left">
              {/* Logo/Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-3xl mb-8 shadow-2xl">
                <BuildingOfficeIcon className="h-10 w-10 text-white" />
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                Agency & Agent
                <span className="block bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">
                  Portal
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Manage your property listings, track leads, and grow your real estate business with our powerful platform.
              </p>

              {/* Feature List */}
              <div className="space-y-4 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-full"></div>
                  <span className="text-gray-700">Comprehensive lead management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-full"></div>
                  <span className="text-gray-700">Real-time analytics & reporting</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-full"></div>
                  <span className="text-gray-700">Agent performance tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
          <div className="max-w-md w-full">
            {/* Login Card */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-3xl blur opacity-25"></div>
              <div className="relative bg-white rounded-3xl p-8 lg:p-10 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-gray-900 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-gray-600">
                    Sign in to your agency portal
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-3">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 shadow-sm text-gray-900 placeholder-gray-500"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-3">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-12 pr-12 py-4 bg-white rounded-xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 shadow-sm text-gray-900 placeholder-gray-500"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <Link 
                      to="/forgot-password" 
                      className="text-sm font-semibold text-[#225AE3] hover:text-[#F59E0B] transition-colors duration-300"
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  {/* Turnstile Component */}
                  <div className="flex justify-center">
                    <Turnstile
                      ref={turnstileRef}
                      siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                      onSuccess={handleTurnstileSuccess}
                      onError={handleTurnstileError}
                      onExpire={handleTurnstileExpire}
                      options={{
                        theme: 'light',
                        size: 'normal',
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !turnstileToken}
                    className="w-full bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Sign In</span>
                        <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    )}
                  </button>
                </form>

                {/* Footer Links */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Looking for the spotter portal?{' '}
                      <Link 
                        to="/login" 
                        className="font-semibold text-[#225AE3] hover:text-[#F59E0B] transition-colors duration-300"
                      >
                        Sign in here
                      </Link>
                    </p>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Need help?{' '}
                      <Link 
                        to="/contact" 
                        className="font-semibold text-[#225AE3] hover:text-[#F59E0B] transition-colors duration-300"
                      >
                        Contact Support
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyLoginPage;