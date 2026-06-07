import { useEffect, useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Download, Lock, TrendingUp } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../auth/AuthContext';
import { useUpgrade } from '../payment/useUpgrade';
import PaymentComingSoonModal from '../payment/PaymentComingSoonModal';
import api from '../../lib/api';

export default function Reports() {
  const { user } = useAuth();
  const { startUpgrade, showModal, closeModal } = useUpgrade();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isPremium = user?.plan === 'PREMIUM';

  useEffect(() => {
    if (isPremium) {
      fetchReportData();
    } else {
      setLoading(false);
    }
  }, [isPremium]);

  const fetchReportData = async () => {
    try {
      const response = await api.get('/reports/monthly');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isPremium) {
    return (
      <DashboardLayout>
        {showModal && <PaymentComingSoonModal onClose={closeModal} />}
        <div className="max-w-4xl mx-auto">
          <div className="card text-center py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-teal/5 to-transparent" />
            <div className="relative z-10">
              <Lock className="w-16 h-16 text-cyber-teal mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Premium Feature</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Monthly privacy reports with detailed analytics and PDF export are available with Premium.
              </p>
              <div className="space-y-4 max-w-sm mx-auto mb-8">
                {['Tracker trends over time','Category breakdown analysis','Privacy score history','Export reports as PDF','Advanced insights'].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3 text-left">
                    <div className="w-2 h-2 bg-cyber-teal rounded-full" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              <button onClick={startUpgrade} className="btn-primary text-lg px-8 py-4 mx-auto">
                Upgrade to Premium — $9/month
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-cyber-teal text-xl font-mono">Loading report...</div>
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

  const categoryData = Object.entries(data.categoryBreakdown).map(([name, value]) => ({
    name,
    value,
    color: categoryColors[name]
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Monthly Privacy Report</h1>
            <p className="text-gray-400">
              {new Date(data.period.start).toLocaleDateString()} - {new Date(data.period.end).toLocaleDateString()}
            </p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export PDF</span>
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="card text-center">
            <div className="text-3xl font-bold font-mono text-cyber-teal">{data.summary.totalTrackers}</div>
            <div className="text-sm text-gray-400 mt-1">Total Trackers</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold font-mono">{data.summary.uniqueDomains}</div>
            <div className="text-sm text-gray-400 mt-1">Unique Domains</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold font-mono text-cyber-green">{data.summary.blockedCount}</div>
            <div className="text-sm text-gray-400 mt-1">Blocked</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold font-mono">{data.summary.averagePerDay}</div>
            <div className="text-sm text-gray-400 mt-1">Avg Per Day</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Tracker Timeline */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-6">Tracker Activity Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.timeline}>
                <XAxis
                  dataKey="date"
                  stroke="#6B7280"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A1628',
                    border: '1px solid #1A2942',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#00E5CC" strokeWidth={2} name="Total" />
                <Line type="monotone" dataKey="blocked" stroke="#00C853" strokeWidth={2} name="Blocked" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-6">Trackers by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
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
          </div>

          {/* Privacy Score History */}
          <div className="card lg:col-span-2">
            <h3 className="text-lg font-semibold mb-6">Privacy Score Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.scoreHistory}>
                <XAxis
                  dataKey="date"
                  stroke="#6B7280"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A1628',
                    border: '1px solid #1A2942',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="score" stroke="#00E5CC" strokeWidth={3} name="Privacy Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-cyber-teal flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Tracker Activity</h4>
                <p className="text-sm text-gray-400">
                  You encountered an average of {data.summary.averagePerDay} trackers per day this month.
                  {parseFloat(data.summary.averagePerDay) > 20 && ' This is higher than average - consider enabling global blocking.'}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-cyber-green flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Blocking Effectiveness</h4>
                <p className="text-sm text-gray-400">
                  You blocked {Math.round((data.summary.blockedCount / data.summary.totalTrackers) * 100)}% of detected trackers.
                  {data.summary.blockedCount / data.summary.totalTrackers < 0.5 && ' Consider blocking more trackers to improve your privacy score.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
