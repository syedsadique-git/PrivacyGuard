import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import RobotBackground from '../../components/RobotBackground';

export default function PaymentSuccess() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const activate = async () => {
      try {
        await refreshUser();
        setStatus('success');
      } catch {
        setStatus('error');
      }
    };
    activate();
  }, []);

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => navigate('/reports'), 4000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyber-dark via-cyber-darker to-cyber-dark px-6">
      <RobotBackground variant="heart" />
      <div className="max-w-md w-full text-center card py-16 relative z-10">
        {status === 'loading' && (
          <>
            <Loader className="w-16 h-16 text-cyber-teal mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl font-bold mb-2">Activating Premium…</h1>
            <p className="text-gray-400">Please wait while we set up your account.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-20 h-20 text-cyber-teal mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-3 glow-text">Welcome to Premium! 🎉</h1>
            <p className="text-gray-400 mb-8">
              Your subscription is now active. All premium features have been unlocked.
            </p>
            <div className="space-y-2 text-sm text-gray-300 mb-8">
              {[
                'Monthly privacy reports with PDF export',
                'Advanced analytics & insights',
                'Email breach monitoring',
                'Priority support',
              ].map((f) => (
                <div key={f} className="flex items-center justify-center space-x-2">
                  <span className="text-cyber-teal text-base">✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">Redirecting to your reports in a moment…</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-5xl mb-6">⚠️</div>
            <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
            <p className="text-gray-400 mb-6">
              Your payment was received but we couldn't activate your plan. Please refresh or contact support.
            </p>
            <button onClick={() => navigate('/settings?tab=subscription')} className="btn-primary">
              Go to Settings
            </button>
          </>
        )}
      </div>
    </div>
  );
}
