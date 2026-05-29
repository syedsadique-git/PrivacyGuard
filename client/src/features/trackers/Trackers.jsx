import { useEffect, useState } from 'react';
import { Search, Filter, Shield, X, Check } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../lib/api';

export default function Trackers() {
  const [trackers, setTrackers] = useState([]);
  const [filteredTrackers, setFilteredTrackers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTracker, setSelectedTracker] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchTrackers();
  }, []);

  useEffect(() => {
    filterTrackers();
  }, [trackers, searchTerm, categoryFilter, statusFilter]);

  const fetchTrackers = async () => {
    try {
      const response = await api.get('/trackers');
      setTrackers(response.data.trackers);
    } catch (error) {
      console.error('Failed to fetch trackers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTrackers = () => {
    let filtered = [...trackers];

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.trackerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.domain.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((t) => t.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((t) => 
        statusFilter === 'blocked' ? t.isBlocked : !t.isBlocked
      );
    }

    setFilteredTrackers(filtered);
  };

  const toggleBlock = async (id) => {
    try {
      await api.patch(`/trackers/${id}/block`);
      fetchTrackers();
    } catch (error) {
      console.error('Failed to toggle block:', error);
    }
  };

  const bulkBlock = async (block) => {
    try {
      await api.post('/trackers/bulk-block', { trackerIds: selectedIds, block });
      setSelectedIds([]);
      fetchTrackers();
    } catch (error) {
      console.error('Failed to bulk block:', error);
    }
  };

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const categories = ['all', 'Analytics', 'Advertising', 'Social', 'Fingerprinting', 'Other'];
  const categoryColors = {
    Analytics: '#00E5CC',
    Advertising: '#FF4D4D',
    Social: '#FFA500',
    Fingerprinting: '#FF1493',
    Other: '#808080'
  };

  const riskColors = {
    low: 'text-cyber-green',
    medium: 'text-yellow-500',
    high: 'text-cyber-red'
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-cyber-teal text-xl font-mono">Loading trackers...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Filters */}
        <div className="card">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search trackers or domains..."
                className="input-field w-full pl-10"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="blocked">Blocked</option>
              <option value="active">Active</option>
            </select>
          </div>

          {selectedIds.length > 0 && (
            <div className="mt-4 flex items-center justify-between bg-cyber-blue p-4 rounded-lg">
              <span className="text-sm">
                {selectedIds.length} tracker{selectedIds.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => bulkBlock(true)}
                  className="btn-primary text-sm px-4 py-2"
                >
                  Block Selected
                </button>
                <button
                  onClick={() => bulkBlock(false)}
                  className="btn-secondary text-sm px-4 py-2"
                >
                  Allow Selected
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-3xl font-bold font-mono">{trackers.length}</div>
            <div className="text-sm text-gray-400 mt-1">Total Trackers</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold font-mono text-cyber-green">
              {trackers.filter((t) => t.isBlocked).length}
            </div>
            <div className="text-sm text-gray-400 mt-1">Blocked</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold font-mono text-cyber-red">
              {trackers.filter((t) => !t.isBlocked).length}
            </div>
            <div className="text-sm text-gray-400 mt-1">Active</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold font-mono">
              {new Set(trackers.map((t) => t.domain)).size}
            </div>
            <div className="text-sm text-gray-400 mt-1">Unique Domains</div>
          </div>
        </div>

        {/* Trackers Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                  <th className="pb-3 w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredTrackers.length && filteredTrackers.length > 0}
                      onChange={(e) =>
                        setSelectedIds(e.target.checked ? filteredTrackers.map((t) => t.id) : [])
                      }
                      className="rounded border-gray-700"
                    />
                  </th>
                  <th className="pb-3">Tracker Name</th>
                  <th className="pb-3">Domain</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Risk</th>
                  <th className="pb-3 text-right">Count</th>
                  <th className="pb-3">Last Seen</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredTrackers.map((tracker) => (
                  <tr
                    key={tracker.id}
                    className="border-b border-gray-800 hover:bg-cyber-blue/20 transition-colors cursor-pointer"
                    onClick={() => setSelectedTracker(tracker)}
                  >
                    <td className="py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(tracker.id)}
                        onChange={() => toggleSelection(tracker.id)}
                        className="rounded border-gray-700"
                      />
                    </td>
                    <td className="py-3 font-medium">{tracker.trackerName}</td>
                    <td className="py-3 text-gray-400 font-mono text-xs">{tracker.domain}</td>
                    <td className="py-3">
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: `${categoryColors[tracker.category]}20`,
                          color: categoryColors[tracker.category]
                        }}
                      >
                        {tracker.category}
                      </span>
                    </td>
                    <td className={`py-3 font-semibold uppercase text-xs ${riskColors[tracker.riskLevel]}`}>
                      {tracker.riskLevel}
                    </td>
                    <td className="py-3 text-right font-mono">{tracker.count}</td>
                    <td className="py-3 text-gray-400 text-xs">
                      {new Date(tracker.lastSeen).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-center">
                      {tracker.isBlocked ? (
                        <span className="text-cyber-green flex items-center justify-center">
                          <Shield className="w-4 h-4 mr-1" />
                          Blocked
                        </span>
                      ) : (
                        <span className="text-cyber-red">Active</span>
                      )}
                    </td>
                    <td className="py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleBlock(tracker.id)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                          tracker.isBlocked
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            : 'bg-cyber-teal hover:bg-cyan-400 text-cyber-dark'
                        }`}
                      >
                        {tracker.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTrackers.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No trackers found matching your filters.
            </div>
          )}
        </div>
      </div>

      {/* Tracker Detail Modal */}
      {selectedTracker && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6"
          onClick={() => setSelectedTracker(null)}
        >
          <div
            className="card max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedTracker.trackerName}</h2>
                <p className="text-gray-400 font-mono text-sm">{selectedTracker.domain}</p>
              </div>
              <button
                onClick={() => setSelectedTracker(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Category</div>
                  <div className="font-semibold">{selectedTracker.category}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Risk Level</div>
                  <div className={`font-semibold uppercase ${riskColors[selectedTracker.riskLevel]}`}>
                    {selectedTracker.riskLevel}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Times Detected</div>
                  <div className="font-semibold font-mono">{selectedTracker.count}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Status</div>
                  <div className={selectedTracker.isBlocked ? 'text-cyber-green' : 'text-cyber-red'}>
                    {selectedTracker.isBlocked ? 'Blocked' : 'Active'}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h3 className="font-semibold mb-2">What This Tracker Collects</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Browsing history and page views</li>
                  <li>• Device information and screen resolution</li>
                  <li>• Geographic location (IP-based)</li>
                  <li>• Referrer URLs and click patterns</li>
                  {selectedTracker.category === 'Fingerprinting' && (
                    <li>• Unique device fingerprint for tracking</li>
                  )}
                </ul>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h3 className="font-semibold mb-2">Privacy Impact</h3>
                <p className="text-sm text-gray-400">
                  {selectedTracker.riskLevel === 'high'
                    ? 'This tracker poses a significant privacy risk. It can build detailed profiles of your online behavior and share data with third parties.'
                    : selectedTracker.riskLevel === 'medium'
                    ? 'This tracker collects moderate amounts of data. While not as invasive as high-risk trackers, it still monitors your activity.'
                    : 'This tracker has limited data collection capabilities. It primarily collects basic analytics data.'}
                </p>
              </div>

              <button
                onClick={() => {
                  toggleBlock(selectedTracker.id);
                  setSelectedTracker(null);
                }}
                className="btn-primary w-full mt-4"
              >
                {selectedTracker.isBlocked ? 'Unblock This Tracker' : 'Block This Tracker'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
