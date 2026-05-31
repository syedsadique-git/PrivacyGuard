import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import Landing from './features/landing/Landing';
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import Onboarding from './features/onboarding/Onboarding';
import Dashboard from './features/dashboard/Dashboard';
import Trackers from './features/trackers/Trackers';
import Breaches from './features/breaches/Breaches';
import Reports from './features/reports/Reports';
import Settings from './features/settings/Settings';
import PaymentSuccess from './features/payment/PaymentSuccess';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cyber-teal text-xl font-mono">Loading...</div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/trackers" element={<PrivateRoute><Trackers /></PrivateRoute>} />
        <Route path="/breaches" element={<PrivateRoute><Breaches /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/payment/success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
