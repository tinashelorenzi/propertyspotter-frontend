import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Turnstile } from '@marsidev/react-turnstile';
import Toast from './Toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const turnstileRef = useRef<any>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
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

  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
  };

  const handleTurnstileError = () => {
    setTurnstileToken('');
    setToast({
      message: 'Security verification failed. Please try again.',
      type: 'error',
      isVisible: true,
    });
  };

  const handleTurnstileExpire = () => {
    setTurnstileToken('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if turnstile token is present
    if (!turnstileToken) {
      setToast({
        message: 'Please complete the security verification.',
        type: 'error',
        isVisible: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}api/users/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          turnstileToken // Include the turnstile token
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
        
        // Route based on user role
        if (data.user.role === 'Spotter') {
          navigate('/dashboard');
        } else if (data.user.role === 'Agency_Admin') {
          navigate('/agency-dashboard');
        } else if (data.user.role === 'Agent') {
          navigate('/agent-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        // Reset turnstile on error
        if (turnstileRef.current) {
          turnstileRef.current.reset();
        }
        setTurnstileToken('');
        
        setToast({
          message: data.message || 'Login failed. Please check your credentials.',
          type: 'error',
          isVisible: true,
        });
      }
    } catch (error) {
      // Reset turnstile on error
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }
      setTurnstileToken('');
      
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
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E9EEFB]/40 via-white to-[#F59E0B]/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#225AE3]/20 to-transparent rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-bl from-[#F59E0B]/20 to-transparent rounded-full blur-3xl animate-float-slower"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-tr from-[#225AE3]/15 to-transparent rounded-full blur-3xl animate-float-reverse"></div>
      </div>

      {/* Floating Home Button */}
      <Link
        to="/"
        className="fixed top-6 left-6 z-50 inline-flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 group"
        title="Back to Home"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#225AE3] group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </Link>
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16">
        {/* Floating Elements */}
        <div className="absolute top-40 left-10 w-20 h-20 bg-gradient-to-r from-[#225AE3]/30 to-[#F59E0B]/30 rounded-full blur-xl animate-bounce-slow"></div>
        <div className="absolute top-60 right-20 w-16 h-16 bg-gradient-to-r from-[#F59E0B]/40 to-[#225AE3]/40 rounded-full blur-lg animate-pulse-slow"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-[#225AE3]/20 shadow-lg mb-8 animate-fade-in-up">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-700">Welcome back to PropertySpotter</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 animate-fade-in-up delay-100">
            <span className="block bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">
              Welcome
            </span>
            <span className="block text-gray-900">
              Back
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Sign in to continue your property spotting journey and start earning money today.
          </p>
        </div>
      </section>

      {/* Login Form Section */}
      <section className="pb-24">
        <div className="w-full max-w-md mx-auto px-4 relative z-10">
          <div className="relative animate-fade-in-up delay-300">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#225AE3]/10 via-[#F59E0B]/10 to-[#225AE3]/10 rounded-3xl blur opacity-50"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-xl border border-white/50">
              
              {/* Form Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-2xl mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">
                  Sign <span className="bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">In</span>
                </h2>
                <p className="text-gray-600">Access your PropertySpotter account</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-3">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 text-lg shadow-lg"
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
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="current-password"
                      className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border-2 border-gray-200 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/20 transition-all duration-300 text-lg shadow-lg"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-[#225AE3] hover:text-[#F59E0B] font-semibold transition-colors duration-200 hover:underline"
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
                  className="relative w-full bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                      Signing In...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Sign In to Dashboard
                    </div>
                  )}
                </button>
              </form>

              {/* Register Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">
                  Don't have an account?
                </p>
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:from-[#225AE3]/5 hover:to-[#F59E0B]/5 hover:border-[#225AE3]/30 transition-all duration-300 shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create New Account
                </Link>
              </div>

              {/* Benefits Preview */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                  Ready to start <span className="bg-gradient-to-r from-[#225AE3] to-[#F59E0B] bg-clip-text text-transparent">earning</span>?
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-lg flex items-center justify-center mb-2">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">Spot Properties</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#F59E0B] to-[#225AE3] rounded-lg flex items-center justify-center mb-2">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">Earn Money</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#225AE3] to-[#F59E0B] rounded-lg flex items-center justify-center mb-2">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">Get Paid Fast</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
        />
      )}

      {/* Custom Animations Styles */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(30px) rotate(-180deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(90deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 10s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 8s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default Login;