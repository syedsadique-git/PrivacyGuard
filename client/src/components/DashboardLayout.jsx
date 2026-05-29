import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, Eye, AlertTriangle, FileText, Settings, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/trackers', icon: Eye, label: 'Trackers' },
    { path: '/breaches', icon: AlertTriangle, label: 'Breaches' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-cyber-darker border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-cyber-teal" />
            <span className="text-xl font-bold glow-text">PrivacyGuard</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-cyber-teal text-cyber-dark font-semibold'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-cyber-blue'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-cyber-teal flex items-center justify-center text-cyber-dark font-bold">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user?.email}</div>
                <div className="text-xs text-gray-400">{user?.plan}</div>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-gray-100 hover:bg-cyber-blue rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-cyber-darker border-b border-gray-800 flex items-center justify-between px-8">
          <h1 className="text-2xl font-bold">
            {navItems.find(item => item.path === location.pathname)?.label || 'PrivacyGuard'}
          </h1>
          <button className="relative p-2 text-gray-400 hover:text-gray-100 transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-cyber-red rounded-full"></span>
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
