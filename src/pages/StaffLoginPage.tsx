import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';
import { useAuth } from '../contexts/AuthContext';
import { adminApi } from '../services/adminApi';
import { STAFF_PORTAL_PATH } from '../config/adminRoutes';

/**
 * The staff front door — replaces signing into /admin/ on the Django side.
 *
 * Deliberately austere and unbranded compared with the public login pages:
 * no marketing copy, no "create an account" link, no password reset flow, and
 * no hint that a different portal exists. It asks for a username because the
 * accounts behind it are the same Django superuser accounts as before.
 */
const StaffLoginPage = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const turnstileRef = useRef<{ reset: () => void } | null>(null);

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already signed in as an admin? Go straight through.
  useEffect(() => {
    const stored = user ?? JSON.parse(localStorage.getItem('user') || 'null');
    if (stored?.role === 'Admin' && localStorage.getItem('token')) {
      navigate(STAFF_PORTAL_PATH, { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    document.title = 'Staff sign in · PropertySpotter';
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
    setError(null);
  };

  const resetChallenge = () => {
    turnstileRef.current?.reset();
    setTurnstileToken('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (siteKey && !turnstileToken) {
      setError('Please complete the security check.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await adminApi.login({
        username: form.username.trim(),
        password: form.password,
        turnstileToken: turnstileToken || undefined,
      });

      // Write both token keys so the rest of the app sees one session.
      login(data.token, data.user as never);
      localStorage.setItem('token', data.token);
      if (data.user.agency) {
        localStorage.setItem('agency', JSON.stringify(data.user.agency));
      }

      navigate(STAFF_PORTAL_PATH, { replace: true });
    } catch (err) {
      resetChallenge();
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center px-4 py-12">
      {/* Restrained background — this is a back-office door, not a landing page */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-[#225AE3]/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-[#F59E0B]/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-[#225AE3] to-[#F59E0B] shadow-lg mb-5">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white">Control Centre</h1>
          <p className="text-sm text-gray-400 mt-1.5">
            Staff access only. All sign-in attempts are logged.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
            >
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                autoFocus
                required
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/15 outline-none transition-all"
                placeholder="Your staff username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#225AE3] focus:ring-4 focus:ring-[#225AE3]/15 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {siteKey && (
              <div className="flex justify-center pt-1">
                <Turnstile
                  ref={turnstileRef as never}
                  siteKey={siteKey}
                  onSuccess={setTurnstileToken}
                  onError={() => {
                    setTurnstileToken('');
                    setError('Security check failed. Please try again.');
                  }}
                  onExpire={() => setTurnstileToken('')}
                  options={{ theme: 'light', size: 'normal' }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (Boolean(siteKey) && !turnstileToken)}
              className="w-full bg-gradient-to-r from-[#225AE3] to-[#F59E0B] text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Signing in…
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Six failed attempts locks this account and address for 10 minutes.
        </p>
      </div>
    </div>
  );
};

export default StaffLoginPage;
