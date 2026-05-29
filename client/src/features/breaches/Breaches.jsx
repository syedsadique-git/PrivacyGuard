import { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Mail, Calendar, Database } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../lib/api';

export default function Breaches() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const checkBreach = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await api.get(`/breaches?email=${encodeURIComponent(email)}`);
      setResult(response.data);
    } catch (err) {
      setError('Failed to check breach status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const monitorEmail = async () => {
    try {
      await api.post('/breaches/monitor', { email });
      alert('Email added to monitoring. You will receive alerts for new breaches.');
    } catch (err) {
      alert('Failed to add email to monitoring.');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Data Breach Monitor</h1>
          <p className="text-gray-400">
            Check if your email has been compromised in known data breaches
          </p>
        </div>

        {/* Search Form */}
        <div className="card">
          <form onSubmit={checkBreach} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address to check..."
                className="input-field w-full pl-10"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyber-dark mr-2"></div>
                  Checking...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Search className="w-5 h-5 mr-2" />
                  Check for Breaches
                </span>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-cyber-red/10 border border-cyber-red rounded-lg p-4 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-cyber-red flex-shrink-0 mt-0.5" />
              <p className="text-sm text-cyber-red">{error}</p>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-slide-up">
            {result.breached ? (
              <>
                {/* Breach Alert */}
                <div className="bg-cyber-red/10 border-2 border-cyber-red rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <AlertTriangle className="w-8 h-8 text-cyber-red flex-shrink-0" />
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-cyber-red mb-2">
                        Breach Detected
                      </h2>
                      <p className="text-gray-300 mb-4">
                        This email address was found in {result.breaches.length} data breach
                        {result.breaches.length > 1 ? 'es' : ''}. Your personal information may have been exposed.
                      </p>
                      <button
                        onClick={monitorEmail}
                        className="btn-primary"
                      >
                        Monitor This Email
                      </button>
                    </div>
                  </div>
                </div>

                {/* Breach Details */}
                <div className="space-y-4">
                  {result.breaches.map((breach, index) => (
                    <div key={index} className="card-hover">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{breach.title || breach.name}</h3>
                          {breach.domain && (
                            <p className="text-sm text-gray-400 font-mono">{breach.domain}</p>
                          )}
                        </div>
                        {breach.isVerified && (
                          <span className="px-3 py-1 bg-cyber-red/20 text-cyber-red rounded-full text-xs font-semibold">
                            Verified
                          </span>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400">Breach Date:</span>
                          <span className="font-semibold">
                            {new Date(breach.breachDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Database className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400">Added:</span>
                          <span className="font-semibold">
                            {new Date(breach.addedDate || breach.breachDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {breach.description && (
                        <p className="text-sm text-gray-400 mb-4">{breach.description}</p>
                      )}

                      <div>
                        <h4 className="text-sm font-semibold mb-2">Compromised Data:</h4>
                        <div className="flex flex-wrap gap-2">
                          {breach.dataClasses.map((dataClass, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-cyber-blue text-gray-300 rounded-full text-xs"
                            >
                              {dataClass}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <h4 className="text-sm font-semibold mb-2">Recommended Actions:</h4>
                        <ul className="text-sm text-gray-400 space-y-1">
                          {breach.dataClasses.includes('Passwords') && (
                            <li>• Change your password immediately on {breach.domain || 'this service'}</li>
                          )}
                          <li>• Enable two-factor authentication if available</li>
                          <li>• Monitor your accounts for suspicious activity</li>
                          {breach.dataClasses.includes('Credit cards') && (
                            <li>• Contact your bank and consider freezing your credit</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-cyber-green/10 border-2 border-cyber-green rounded-lg p-8 text-center">
                <CheckCircle className="w-16 h-16 text-cyber-green mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-cyber-green mb-2">All Clear!</h2>
                <p className="text-gray-300 mb-6">
                  This email address was not found in any known data breaches.
                </p>
                <button
                  onClick={monitorEmail}
                  className="btn-primary"
                >
                  Monitor This Email
                </button>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">About Data Breaches</h3>
          <div className="space-y-3 text-sm text-gray-400">
            <p>
              A data breach occurs when sensitive information is accessed, stolen, or used by unauthorized individuals.
              This can include passwords, email addresses, credit card numbers, and other personal data.
            </p>
            <p>
              We check your email against a database of known breaches from major services and websites.
              If your email appears in a breach, it means your data was exposed and may be available to malicious actors.
            </p>
            <p className="text-cyber-teal">
              <strong>What to do if you're breached:</strong> Change your passwords immediately, enable two-factor
              authentication, and monitor your accounts for suspicious activity.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
