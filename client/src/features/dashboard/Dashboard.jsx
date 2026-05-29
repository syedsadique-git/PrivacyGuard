import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Eye, Shield, AlertTriangle, Clock } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import DashboardLayout from '../../components/DashboardLayout';
import PrivacyScoreRing from '../../components/PrivacyScoreRing';
import api from '../../lib/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-cyber-teal text-xl font-mono">Loading dashboard...</div>
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
      <div className="space-y-6">
        {/* Top Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="card-hover">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Privacy Score</span>
              <Shield className="w-5 h-5 text-cyber-teal" />
            </div>
            <div className="text-3xl font-bold font-mono">{data.privacyScore}</div>
            <div className="text-xs text-gray-500 mt-1">
              {data.privacyScore >= 70 ? 'Protected' : data.privacyScore >= 40 ? 'Fair' : 'At Risk'}
            </div>
          </div>

          <div className="card-hover">
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

          <div className="card-hover">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Blocked</span>
              <Shield className="w-5 h-5 text-cyber-green" />
            </div>
            <div className="text-3xl font-bold font-mono">{data.trackerStats.blocked}</div>
            <div className="text-xs text-gray-500 mt-1">
              {Math.round((data.trackerStats.blocked / data.trackerStats.total) * 100)}% of total
            </div>
          </div>

          <div className="card-hover">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Unique Domains</span>
              <Eye className="w-5 h-5 text-cyber-red" />
            </div>
            <div className="text-3xl font-bold font-mono">{data.trackerStats.uniqueDomains}</div>
            <div className="text-xs text-gray-500 mt-1">Tracking you</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Privacy Score Ring */}
          <div className="card-hover flex flex-col items-center justify-center py-8">
            <h3 className="text-lg font-semibold mb-6">Your Privacy Score</h3>
            <PrivacyScoreRing score={data.privacyScore} size="large" />
            <p className="text-sm text-gray-400 mt-6 text-center max-w-xs">
              Your score is calculated based on tracker exposure, blocking status, and breach history.
            </p>
          </div>

          {/* Category Breakdown */}
          <div className="card-hover">
            <h3 className="text-lg font-semibold mb-4">Trackers by Category</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A1628',
                    border: '1px solid #1A2942',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span>{cat.name}</span>
                  </div>
                  <span className="font-mono text-gray-400">{cat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Global Blocking Toggle */}
          <div className="card-hover">
            <h3 className="text-lg font-semibold mb-4">Global Protection</h3>
            <div className="flex items-center justify-center py-8">
              <button
                onClick={toggleGlobalBlocking}
                className={`relative w-20 h-10 rounded-full transition-all ${
                  data.globalBlocking ? 'bg-cyber-teal' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-8 h-8 bg-white rounded-full transition-transform ${
                    data.globalBlocking ? 'transform translate-x-10' : ''
                  }`}
                />
              </button>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold mb-2 ${data.globalBlocking ? 'text-cyber-teal' : 'text-gray-400'}`}>
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
          <div className="bg-cyber-red/10 border border-cyber-red rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-6 h-6 text-cyber-red flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-cyber-red mb-2">Data Breach Detected</h3>
                <p className="text-gray-300 mb-4">
                  Your email was found in {data.breachStatus.count} data breach{data.breachStatus.count > 1 ? 'es' : ''}. 
                  Immediate action recommended.
                </p>
                <Link to="/breaches" className="btn-primary inline-block">
                  View Details & Take Action
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Top Trackers Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Top Trackers</h3>
            <Link to="/trackers" className="text-cyber-teal hover:underline text-sm">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
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
                  <tr key={tracker.id} className="border-b border-gray-800">
                    <td className="py-3">{tracker.trackerName}</td>
                    <td className="py-3 text-gray-400">{tracker.domain}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded text-xs" style={{ 
                        backgroundColor: `${categoryColors[tracker.category]}20`,
                        color: categoryColors[tracker.category]
                      }}>
                        {tracker.category}
                      </span>
                    </td>
                    <td className="py-3 text-right">{tracker.count}</td>
                    <td className="py-3 text-center">
                      {tracker.isBlocked ? (
                        <span className="text-cyber-green">Blocked</span>
                      ) : (
                        <span className="text-cyber-red">Active</span>
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
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {data.recentActivity.slice(0, 6).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 text-sm">
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
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Privacy Tips</h3>
            <div className="space-y-4">
              {privacyTips.map((tip, i) => (
                <div key={i} className="border-l-2 border-cyber-teal pl-4">
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
