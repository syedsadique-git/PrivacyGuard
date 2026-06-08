import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Eye, Shield, AlertTriangle, Clock, Activity, Zap, Bell, X } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import DashboardLayout from '../../components/DashboardLayout';
import PrivacyScoreRing from '../../components/PrivacyScoreRing';
import api from '../../lib/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveActivity, setLiveActivity] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Live Activity Feed Simulation
  useEffect(() => {
    const activityTypes = [
      { type: 'blocked', icon: '🛡️', message: 'Facebook Pixel blocked', color: 'text-cyber-green' },
      { type: 'detected', icon: '👁️', message: 'Google Analytics detected', color: 'text-yellow-500' },
      { type: 'prevented', icon: '⚠️', message: 'Fingerprinting attempt prevented', color: 'text-cyber-teal' },
      { type: 'blocked', icon: '🍪', message: 'Cookie blocked', color: 'text-cyber-green' },
      { type: 'detected', icon: '📊', message: 'Hotjar tracking detected', color: 'text-yellow-500' },
      { type: 'blocked', icon: '🛡️', message: 'DoubleClick blocked', color: 'text-cyber-green' },
      { type: 'prevented', icon: '🔒', message: 'Canvas fingerprinting blocked', color: 'text-cyber-teal' },
      { type: 'detected', icon: '👁️', message: 'LinkedIn Insights active', color: 'text-yellow-500' },
      { type: 'blocked', icon: '🛡️', message: 'Taboola tracker blocked', color: 'text-cyber-green' },
      { type: 'prevented', icon: '⚠️', message: 'WebRTC leak prevented', color: 'text-cyber-teal' }
    ];

    const interval = setInterval(() => {
      const randomActivity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const newActivity = {
        id: Date.now(),
        ...randomActivity,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setLiveActivity(prev => [newActivity, ...prev.slice(0, 9)]);
      
      // Add notification
      if (Math.random() > 0.7) {
        setNotifications(prev => [newActivity, ...prev.slice(0, 4)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/summary');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGlobalBlocking = async () => {
    try {
      await api.patch('/settings', { globalBlocking: !data.globalBlocking });
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to toggle blocking:', error);
    }
  };

  const startScan = () => {
    setScanning(true);
    setScanProgress(0);
    
    const messages = [
      'Initializing privacy scan...',
      'Analyzing browser fingerprint...',
      'Detecting active trackers...',
      'Checking cookie policies...',
      'Scanning for data leaks...',
      'Evaluating privacy settings...',
      'Calculating privacy score...',
      'Scan complete!'
    ];

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setScanProgress((step / messages.length) * 100);
      setScanMessage(messages[step - 1]);
      
      if (step >= messages.length) {
        clearInterval(interval);
        setTimeout(() => {
          setScanning(false);
          fetchDashboardData();
        }, 1000);
      }
    }, 800);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-cyber-teal text-xl font-mono animate-pulse">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  const categoryColors = {
    Analytics: '#00E5CC',
    Advertising: '#FF4D4D',
    Social: '#FFA500',
    Fingerprinting: '#FF1493',
    Other: '#808080'
  };

  const categoryData = Object.entries(data.trackerStats.categoryBreakdown).map(([name, value]) => ({
    name,
    value,
    color: categoryColors[name] || '#808080'
  }));

  const privacyTips = [
    {
      title: 'Use a VPN for Public WiFi',
      description: 'Public networks expose your traffic. Always use a VPN when connecting to untrusted networks.',
      link: '#'
    },
    {
      title: 'Enable Two-Factor Authentication',
      description: 'Add an extra layer of security to your accounts with 2FA. It prevents 99% of automated attacks.',
      link: '#'
    },
    {
      title: 'Review App Permissions',
      description: 'Mobile apps often request unnecessary permissions. Audit and revoke access to sensitive data.',
      link: '#'
    }
  ];

  return (
    <DashboardLayout>
      {/* Scanning Overlay */}
      {scanning && (
        <div className="fixed inset-0 bg-cyber-dark/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="max-w-md w-full mx-4">
            <div className="scan-window">
              <div className="text-center mb-8">
                <Activity className="w-16 h-16 text-cyber-teal mx-auto mb-4 animate-spin-slow" />
                <h2 className="text-2xl font-bold mb-2">Privacy Scan in Progress</h2>
                <p className="text-gray-400 font-mono text-sm">{scanMessage}</p>
              </div>
              
              <div className="relative h-4 bg-cyber-darker rounded-full overflow-hidden mb-4">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyber-teal to-cyan-400 transition-all duration-300 scan-progress-bar"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
              
              <div className="text-center text-sm text-gray-400 font-mono">
                {Math.round(scanProgress)}% Complete
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Top Bar with Scan Button and Notifications */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Privacy Command Center</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={startScan}
              className="btn-primary-enhanced flex items-center space-x-2"
              disabled={scanning}
            >
              <Zap className="w-4 h-4" />
              <span>Start Free Scan</span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 rounded-lg bg-cyber-darker border border-gray-800 hover:border-cyber-teal transition-all notification-bell"
              >
                <Bell className={`w-5 h-5 ${notifications.length > 0 ? 'text-cyber-teal animate-bell-ring' : 'text-gray-400'}`} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyber-red rounded-full text-xs flex items-center justify-center font-bold animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-cyber-darker border border-gray-800 rounded-lg shadow-xl z-50 notification-panel">
                  <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                    <h3 className="font-semibold">Notifications</h3>
                    <button onClick={() => setShowNotifications(false)}>
                      <X className="w-4 h-4 text-gray-400 hover:text-white" />
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-400 text-sm">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className="p-4 border-b border-gray-800 hover:bg-cyber-blue/20 transition-colors">
                          <div className="flex items-start space-x-3">
                            <span className="text-xl">{notif.icon}</span>
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${notif.color}`}>{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notif.timestamp}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="stat-card-enhanced">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Privacy Score</span>
              <Shield className="w-5 h-5 text-cyber-teal" />
            </div>
            <div className="text-3xl font-bold font-mono glow-text">{data.privacyScore}</div>
            <div className="text-xs text-gray-500 mt-1">
              {data.privacyScore >= 70 ? 'Protected' : data.privacyScore >= 40 ? 'Fair' : 'At Risk'}
            </div>
          </div>

          <div className="stat-card-enhanced">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Trackers Today</span>
              <Eye className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold font-mono">{data.trackerStats.today}</div>
            <div className="text-xs text-gray-500 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              Active monitoring
            </div>
          </div>

          <div className="stat-card-enhanced">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Blocked</span>
              <Shield className="w-5 h-5 text-cyber-green" />
            </div>
            <div className="text-3xl font-bold font-mono text-cyber-green">{data.trackerStats.blocked}</div>
            <div className="text-xs text-gray-500 mt-1">
              {Math.round((data.trackerStats.blocked / data.trackerStats.total) * 100)}% of total
            </div>
          </div>

          <div className="stat-card-enhanced">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Unique Domains</span>
              <Eye className="w-5 h-5 text-cyber-red" />
            </div>
            <div className="text-3xl font-bold font-mono text-cyber-red">{data.trackerStats.uniqueDomains}</div>
            <div className="text-xs text-gray-500 mt-1">Tracking you</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Privacy Score Ring — floats with no card background */}
          <div style={{
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            borderRadius: 0,
            padding: '2rem 0',
          }} className="flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold mb-6">Your Privacy Score</h3>
            <PrivacyScoreRing score={data.privacyScore} size="large" />
            <p className="text-sm text-gray-400 mt-6 text-center max-w-xs">
              Your score is calculated based on tracker exposure, blocking status, and breach history.
            </p>
          </div>

          {/* Live Tracker Activity Feed */}
          <div className="card-hover-enhanced">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Activity className="w-5 h-5 text-cyber-teal animate-pulse" />
                <span>Live Activity Feed</span>
              </h3>
              <span className="text-xs text-gray-500 font-mono">REAL-TIME</span>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
              {liveActivity.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Monitoring for tracker activity...</p>
                </div>
              ) : (
                liveActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="activity-item flex items-center space-x-3 p-3 rounded-lg bg-cyber-blue/10 border border-gray-800 hover:border-cyber-teal transition-all"
                  >
                    <span className="text-2xl">{activity.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${activity.color}`}>{activity.message}</p>
                      <p className="text-xs text-gray-500 font-mono">{activity.timestamp}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Global Blocking Toggle */}
          <div className="card-hover-enhanced">
            <h3 className="text-lg font-semibold mb-4">Global Protection</h3>
            <div className="flex items-center justify-center py-8">
              <button
                onClick={toggleGlobalBlocking}
                className={`relative w-20 h-10 rounded-full transition-all duration-300 toggle-switch ${
                  data.globalBlocking ? 'bg-cyber-teal shadow-glow-teal' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-8 h-8 bg-white rounded-full transition-transform duration-300 ${
                    data.globalBlocking ? 'transform translate-x-10' : ''
                  }`}
                />
              </button>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold mb-2 ${data.globalBlocking ? 'text-cyber-teal glow-text' : 'text-gray-400'}`}>
                {data.globalBlocking ? 'ACTIVE' : 'INACTIVE'}
              </div>
              <p className="text-sm text-gray-400">
                {data.globalBlocking
                  ? 'All trackers are being blocked automatically'
                  : 'Click to enable automatic tracker blocking'}
              </p>
            </div>
          </div>
        </div>

        {/* Breach Alert */}
        {data.breachStatus.hasBreaches && (
          <div className="breach-alert">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-6 h-6 text-cyber-red flex-shrink-0 mt-1 animate-pulse" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-cyber-red mb-2">Data Breach Detected</h3>
                <p className="text-gray-300 mb-4">
                  Your email was found in {data.breachStatus.count} data breach{data.breachStatus.count > 1 ? 'es' : ''}. 
                  Immediate action recommended.
                </p>
                <Link to="/breaches" className="btn-primary-enhanced inline-block">
                  View Details & Take Action
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Top Trackers Table */}
        <div className="card-hover-enhanced">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Top Trackers</h3>
            <Link to="/trackers" className="text-cyber-teal hover:underline text-sm flex items-center space-x-1 hover-glow">
              <span>View All</span>
              <span>→</span>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full tracker-table">
              <thead>
                <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                  <th className="pb-3">Tracker</th>
                  <th className="pb-3">Domain</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-right">Count</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm">
                {data.topTrackers.slice(0, 8).map((tracker) => (
                  <tr key={tracker.id} className="border-b border-gray-800 tracker-row">
                    <td className="py-3">{tracker.trackerName}</td>
                    <td className="py-3 text-gray-400">{tracker.domain}</td>
                    <td className="py-3">
                      <span className="category-badge" style={{ 
                        backgroundColor: `${categoryColors[tracker.category]}20`,
                        color: categoryColors[tracker.category]
                      }}>
                        {tracker.category}
                      </span>
                    </td>
                    <td className="py-3 text-right">{tracker.count}</td>
                    <td className="py-3 text-center">
                      {tracker.isBlocked ? (
                        <span className="status-badge status-blocked">Blocked</span>
                      ) : (
                        <span className="status-badge status-active">Active</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity & Privacy Tips */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="card-hover-enhanced">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {data.recentActivity.slice(0, 6).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 text-sm recent-activity-item">
                  <Clock className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{activity.trackerName}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(activity.lastSeen).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-gray-400 text-xs">{activity.domain}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Tips */}
          <div className="card-hover-enhanced">
            <h3 className="text-lg font-semibold mb-4">Privacy Tips</h3>
            <div className="space-y-4">
              {privacyTips.map((tip, i) => (
                <div key={i} className="privacy-tip">
                  <h4 className="font-semibold text-sm mb-1">{tip.title}</h4>
                  <p className="text-xs text-gray-400">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
