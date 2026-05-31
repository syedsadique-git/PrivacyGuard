import { useState, useEffect } from 'react';
import { User, Bell, Shield, CreditCard, Trash2, Save, AlertCircle, Loader, CheckCircle, XCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../auth/AuthContext';
import { useUpgrade } from '../payment/useUpgrade';
import api from '../../lib/api';

export default function Settings() {
  const { user } = useAuth();
  const { startUpgrade, upgrading, error: upgradeError } = useUpgrade();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [subStatus, setSubStatus] = useState(null);
  const [cancellingPlan, setCancellingPlan] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (activeTab === 'subscription') {
      fetchSubscriptionStatus();
    }
  }, [activeTab]);

  const fetchSubscriptionStatus = async () => {
    try {
      const res = await api.get('/payment/subscription-status');
      setSubStatus(res.data);
    } catch (e) {
      // not critical
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Cancel your Premium subscription? You will keep access until the end of the billing period.')) return;
    setCancellingPlan(true);
    try {
      await api.post('/payment/cancel-subscription');
      setMessage('Subscription will be cancelled at the end of the billing period.');
      await fetchSubscriptionStatus();
    } catch (e) {
      setMessage(e.response?.data?.error || 'Failed to cancel subscription.');
    } finally {
      setCancellingPlan(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings(response.data.settings);
      setEmail(response.data.profile.email);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const updateData = { email };
      
      if (currentPassword && newPassword) {
        if (newPassword !== confirmPassword) {
          setMessage('New passwords do not match');
          setSaving(false);
          return;
        }
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      await api.patch('/settings', updateData);
      setMessage('Profile updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await api.patch('/settings', {
        emailAlerts: settings.emailAlerts,
        weeklyReport: settings.weeklyReport
      });
      setMessage('Notification preferences saved');
    } catch (error) {
      setMessage('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBlocking = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await api.patch('/settings', {
        globalBlocking: settings.globalBlocking
      });
      setMessage('Blocking preferences saved');
    } catch (error) {
      setMessage('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete('/settings/account');
      window.location.href = '/';
    } catch (error) {
      setMessage('Failed to delete account');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'blocking', label: 'Blocking Rules', icon: Shield },
    { id: 'subscription', label: 'Subscription', icon: CreditCard }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-cyber-teal text-xl font-mono">Loading settings...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6 border-b border-gray-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMessage('');
                }}
                className={`flex items-center space-x-2 px-6 py-3 font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'text-cyber-teal border-b-2 border-cyber-teal'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${
            message.includes('success') || message.includes('saved')
              ? 'bg-cyber-green/10 border border-cyber-green'
              : 'bg-cyber-red/10 border border-cyber-red'
          }`}>
            <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              message.includes('success') || message.includes('saved') ? 'text-cyber-green' : 'text-cyber-red'
            }`} />
            <p className={`text-sm ${
              message.includes('success') || message.includes('saved') ? 'text-cyber-green' : 'text-cyber-red'
            }`}>
              {message}
            </p>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full"
                />
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="input-field w-full"
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-field w-full"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn-primary">
                <Save className="w-5 h-5 inline mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
            <form onSubmit={handleSaveNotifications} className="space-y-6">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailAlerts}
                  onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
                  className="mt-1 rounded border-gray-700"
                />
                <div>
                  <div className="font-semibold">Email Alerts</div>
                  <div className="text-sm text-gray-400">
                    Receive email notifications when new data breaches are detected
                  </div>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.weeklyReport}
                  onChange={(e) => setSettings({ ...settings, weeklyReport: e.target.checked })}
                  className="mt-1 rounded border-gray-700"
                />
                <div>
                  <div className="font-semibold">Weekly Summary</div>
                  <div className="text-sm text-gray-400">
                    Get a weekly email with your privacy score and tracker statistics
                  </div>
                </div>
              </label>

              <button type="submit" disabled={saving} className="btn-primary">
                <Save className="w-5 h-5 inline mr-2" />
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </form>
          </div>
        )}

        {/* Blocking Tab */}
        {activeTab === 'blocking' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Blocking Rules</h2>
            <form onSubmit={handleSaveBlocking} className="space-y-6">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.globalBlocking}
                  onChange={(e) => setSettings({ ...settings, globalBlocking: e.target.checked })}
                  className="mt-1 rounded border-gray-700"
                />
                <div>
                  <div className="font-semibold">Global Tracker Blocking</div>
                  <div className="text-sm text-gray-400">
                    Automatically block all detected trackers across all websites
                  </div>
                </div>
              </label>

              <div className="bg-cyber-blue p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Extension Status</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Browser extension: <span className="text-cyber-red">Not Connected</span>
                </p>
                <button type="button" className="btn-secondary text-sm">
                  Install Extension
                </button>
              </div>

              <button type="submit" disabled={saving} className="btn-primary">
                <Save className="w-5 h-5 inline mr-2" />
                {saving ? 'Saving...' : 'Save Rules'}
              </button>
            </form>
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Subscription</h2>

              {/* Current Plan */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-cyber-blue border border-gray-700 mb-6">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Current Plan</div>
                  <div className={`text-2xl font-bold ${user.plan === 'PREMIUM' ? 'text-cyber-teal' : 'text-white'}`}>
                    {user.plan === 'PREMIUM' ? '⭐ Premium' : 'Free'}
                  </div>
                  {subStatus?.subscription?.currentPeriodEnd && (
                    <div className="text-xs text-gray-400 mt-1">
                      {subStatus.subscription.cancelAtPeriodEnd
                        ? `Cancels on ${new Date(subStatus.subscription.currentPeriodEnd).toLocaleDateString()}`
                        : `Renews on ${new Date(subStatus.subscription.currentPeriodEnd).toLocaleDateString()}`}
                    </div>
                  )}
                </div>
                {user.plan === 'FREE' ? (
                  <button
                    onClick={startUpgrade}
                    disabled={upgrading}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-60"
                  >
                    {upgrading && <Loader className="w-4 h-4 animate-spin" />}
                    <span>{upgrading ? 'Redirecting…' : 'Upgrade to Premium'}</span>
                  </button>
                ) : (
                  <span className="flex items-center space-x-2 text-cyber-teal font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    <span>Active</span>
                  </span>
                )}
              </div>
              {upgradeError && <p className="text-cyber-red text-sm mb-4">{upgradeError}</p>}

              {/* Feature comparison */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-gray-700">
                  <h3 className="font-semibold mb-3 text-gray-300">Free</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    {['Basic tracker detection', 'Limited to 50 trackers/month', 'Basic dashboard'].map((f) => (
                      <li key={f} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-gray-500" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-lg border border-cyber-teal bg-cyber-teal/5">
                  <h3 className="font-semibold mb-3 text-cyber-teal">Premium — $9/month</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    {[
                      'Unlimited tracker detection',
                      'Monthly privacy reports + PDF export',
                      'Email breach monitoring',
                      'Advanced analytics & insights',
                      'Priority support',
                    ].map((f) => (
                      <li key={f} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-cyber-teal" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Cancel subscription */}
              {user.plan === 'PREMIUM' && subStatus?.subscription && !subStatus.subscription.cancelAtPeriodEnd && (
                <div className="border-t border-gray-700 mt-6 pt-6">
                  <h3 className="font-semibold mb-2 text-gray-300">Manage Subscription</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Cancelling will keep Premium active until the end of your current billing period.
                  </p>
                  <button
                    onClick={handleCancelSubscription}
                    disabled={cancellingPlan}
                    className="flex items-center space-x-2 text-cyber-red border border-cyber-red px-4 py-2 rounded-lg hover:bg-cyber-red/10 transition-colors disabled:opacity-60 text-sm"
                  >
                    {cancellingPlan ? <Loader className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    <span>{cancellingPlan ? 'Cancelling…' : 'Cancel Subscription'}</span>
                  </button>
                </div>
              )}
              {subStatus?.subscription?.cancelAtPeriodEnd && (
                <div className="border-t border-gray-700 mt-6 pt-6">
                  <p className="text-sm text-amber-400">
                    ⚠️ Your subscription is set to cancel on{' '}
                    {new Date(subStatus.subscription.currentPeriodEnd).toLocaleDateString()}.
                    You will retain Premium access until then.
                  </p>
                </div>
              )}
            </div>

            <div className="card border-cyber-red">
              <h2 className="text-2xl font-bold mb-4 text-cyber-red">Danger Zone</h2>
              <p className="text-gray-400 mb-6">
                Once you delete your account, there is no going back. All your data will be permanently removed.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="bg-cyber-red hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-all flex items-center space-x-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
