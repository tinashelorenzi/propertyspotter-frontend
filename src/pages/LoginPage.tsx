import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
  };
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
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
    console.log('Attempting login with:', formData);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}api/users/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: LoginResponse = await response.json();
      console.log('Login response:', data);

      if (response.ok) {
        // Store auth token
        localStorage.setItem('authToken', data.token);
        
        // Store user data
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('firstName', data.user.first_name);
        localStorage.setItem('lastName', data.user.last_name);
        localStorage.setItem('isActive', String(data.user.is_active));

        console.log('Stored user data:', {
          token: data.token,
          userId: data.user.id,
          email: data.user.email,
          username: data.user.username,
          role: data.user.role,
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          isActive: data.user.is_active
        });

        setToast({
          message: 'Login successful! Redirecting...',
          type: 'success',
          isVisible: true,
        });

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        console.error('Login failed:', data);
        setToast({
          message: (data as any).message || 'Login failed. Please check your credentials.',
          type: 'error',
          isVisible: true,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setToast({
        message: 'An error occurred. Please try again.',
        type: 'error',
        isVisible: true,
      });
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
        <h1 className="text-3xl font-extrabold text-[#225AE3] mb-6 text-center">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#225AE3] focus:border-[#225AE3]"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#225AE3] focus:border-[#225AE3]"
              required
            />
          </div>
          <button type="submit" className="w-full btn-primary text-lg shadow-lg">Sign In</button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account? <Link to="/register" className="text-[#225AE3] hover:underline">Sign up</Link>
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

export default LoginPage; 