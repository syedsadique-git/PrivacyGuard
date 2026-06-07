import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from './AuthContext';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 8) return { label: 'Weak', color: 'text-cyber-red' };
    if (password.length < 12) return { label: 'Fair', color: 'text-yellow-500' };
    return { label: 'Strong', color: 'text-cyber-green' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await signup(email, password, confirmPassword);
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.details?.[0]?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Same implicit flow — no extra googleapis.com fetch from a proxy
  const signUpWithGoogle = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      setError('');
      setGoogleLoading(true);
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        if (!res.ok) throw new Error('Google userinfo fetch failed');
        const userInfo = await res.json();
        await googleLogin(userInfo);
        navigate('/onboarding');
      } catch (err) {
        setError(err.response?.data?.error || 'Google sign-up failed. Please try again.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (err) => {
      console.error('Google OAuth error:', err);
      setError('Google sign-in was cancelled or failed. Please try again.');
    },
  });

  const strength = passwordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-cyber-dark via-cyber-darker to-cyber-dark">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Shield className="w-10 h-10 text-cyber-teal" />
            <span className="text-3xl font-bold glow-text">PrivacyGuard</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
          <p className="text-gray-400">Start protecting your privacy today</p>
        </div>

        <div className="card">
          {error && (
            <div className="bg-cyber-red/10 border border-cyber-red rounded-lg p-4 flex items-start space-x-3 mb-6">
              <AlertCircle className="w-5 h-5 text-cyber-red flex-shrink-0 mt-0.5" />
              <p className="text-sm text-cyber-red">{error}</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => signUpWithGoogle()}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-lg border border-gray-600 bg-white/5 hover:bg-white/10 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <GoogleIcon />
            <span className="text-sm font-medium text-white">
              {googleLoading ? 'Signing up with Google...' : 'Continue with Google'}
            </span>
          </button>

          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="px-4 text-xs text-gray-500 uppercase tracking-wider">or</span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full pl-10" placeholder="you@example.com" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full pl-10" placeholder="••••••••" required />
              </div>
              {strength && (
                <div className="mt-2 flex items-center space-x-2">
                  <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full transition-all ${
                      strength.label === 'Weak' ? 'bg-cyber-red w-1/3' :
                      strength.label === 'Fair' ? 'bg-yellow-500 w-2/3' : 'bg-cyber-green w-full'
                    }`} />
                  </div>
                  <span className={`text-xs ${strength.color}`}>{strength.label}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field w-full pl-10" placeholder="••••••••" required />
                {confirmPassword && password === confirmPassword && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyber-green" />
                )}
              </div>
            </div>

            <button type="submit" disabled={loading || googleLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-400">Already have an account? </span>
            <Link to="/login" className="text-cyber-teal hover:underline font-semibold">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
