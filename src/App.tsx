import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import HomePage from './pages/HomePage'
import HowItWorksPage from './pages/HowItWorksPage'
import RegisterPage from './pages/RegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import NotFoundPage from './pages/NotFoundPage'
import AgencyLoginPage from './pages/AgencyLoginPage';
import AgencyDashboard from './pages/AgencyDashboard';
import AgentDashboard from './pages/AgentDashboard';
import SetPassword from './pages/SetPassword';
import TermsOfServicePage from './pages/TermsOfServicePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#225AE3]"></div>
      </div>
    );
  }
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AgencyRoute = ({ children }: { children: React.ReactNode }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) {
    return <Navigate to="/agency-login" />;
  }
  if (user.role !== 'Agency_Admin') {
    return <Navigate to="/agent-dashboard" />;
  }
  return <>{children}</>;
};

const AgentRoute = ({ children }: { children: React.ReactNode }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) {
    return <Navigate to="/agency-login" />;
  }
  if (user.role !== 'Agent') {
    return <Navigate to="/agency-dashboard" />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      <Route path="/agency-login" element={<AgencyLoginPage />} />
      <Route
        path="/agency-dashboard"
        element={
          <AgencyRoute>
            <AgencyDashboard />
          </AgencyRoute>
        }
      />
      <Route
        path="/agent-dashboard"
        element={
          <AgentRoute>
            <AgentDashboard />
          </AgentRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/set-password/:token" element={<SetPassword />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;