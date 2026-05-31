import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, Eye, AlertTriangle, FileText, Settings, LogOut, Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import RobotBackground from './RobotBackground';

// Map routes to robot variants
function getRobotVariant(pathname) {
  if (pathname === '/dashboard') return 'smile';
  if (pathname === '/trackers')  return 'salute';
  if (pathname.startsWith('/payment')) return 'heart';
  return null; // no robot on other pages
}

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const currentLabel = navItems.find(item => item.path === location.pathname)?.label || 'PrivacyGuard';

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-800">
        <Link to="/dashboard" className="flex items-center space-x-2" onClick={() => setMobileOpen(false)}>
          <Shield className="w-8 h-8 text-cyber-teal" />
          <span className="text-xl font-bold glow-text">PrivacyGuard</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
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
        <div className="flex items-center space-x-3 mb-4 px-2">
          <div className="w-9 h-9 rounded-full bg-cyber-teal flex items-center justify-center text-cyber-dark font-bold text-sm flex-shrink-0">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user?.email}</div>
            <div className="text-xs text-cyber-teal">{user?.plan}</div>
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
    </>
  );

  const robotVariant = getRobotVariant(location.pathname);

  return (
    <div className="min-h-screen flex bg-cyber-dark">
      {/* Robot background — fixed behind everything */}
      {robotVariant && <RobotBackground variant={robotVariant} />}
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-cyber-darker border-r border-gray-800 flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-cyber-darker border-r border-gray-800 flex flex-col z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-cyber-darker border-b border-gray-800 flex items-center justify-between px-4 md:px-8 flex-shrink-0">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-gray-400 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold">{currentLabel}</h1>
          </div>
          <button className="relative p-2 text-gray-400 hover:text-gray-100 transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-cyber-red rounded-full animate-pulse" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
