import { Link } from 'react-router-dom';
import { Shield, Eye, AlertTriangle, Lock, Chrome, TrendingUp, Check, X, Terminal, Zap, Users, Database } from 'lucide-react';
import PrivacyScoreRing from '../../components/PrivacyScoreRing';
import { useState, useEffect, useRef } from 'react';

export default function Landing() {
  const [score, setScore] = useState(0);
  const [counters, setCounters] = useState({ trackers: 0, users: 0, scans: 0, improvements: 0 });
  const [terminalLines, setTerminalLines] = useState([]);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const observerRef = useRef(null);

  // Animate score on load
  useEffect(() => {
    setTimeout(() => setScore(42), 500);
  }, []);

  // Animated counters
  useEffect(() => {
    const targets = { trackers: 2847392, users: 15847, scans: 892341, improvements: 94 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounters({
        trackers: Math.floor(targets.trackers * progress),
        users: Math.floor(targets.users * progress),
        scans: Math.floor(targets.scans * progress),
        improvements: Math.floor(targets.improvements * progress)
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Terminal animation
  useEffect(() => {
    const lines = [
      { text: '> Initializing PrivacyGuard scanner...', delay: 0 },
      { text: '> Analyzing browser fingerprint...', delay: 800 },
      { text: '> Detecting active trackers...', delay: 1600 },
      { text: '> Found 47 tracking scripts', delay: 2400, highlight: true },
      { text: '> Blocking malicious requests...', delay: 3200 },
      { text: '> Generating privacy score...', delay: 4000 },
      { text: '> Scan complete. Privacy score: 42/100', delay: 4800, highlight: true }
    ];

    lines.forEach(line => {
      setTimeout(() => {
        setTerminalLines(prev => [...prev, line]);
      }, line.delay);
    });
  }, []);

  // Scroll reveal observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.dataset.section]));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-section]').forEach(el => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const threats = [
    'Google Analytics tracked you 847 times',
    'Facebook Pixel collected your data on 23 sites',
    'DoubleClick fingerprinted your device',
    'LinkedIn Insights monitored your behavior',
    'Hotjar recorded your mouse movements',
    'Taboola shared your data with 15 partners',
    'Criteo built advertising profile',
    'Amazon tracking pixel active',
    'Twitter analytics collecting data'
  ];

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-cyber-dark relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="cyber-grid"></div>
      
      {/* Floating Particles */}
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-cyber-darker/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-cyber-teal animate-pulse-glow" />
            <span className="text-2xl font-bold glow-text">PrivacyGuard</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/signup" className="btn-primary-enhanced">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative">
        {/* Radial Glow Background */}
        <div className="hero-glow"></div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-6xl font-bold leading-tight">
              Your Privacy Has Been{' '}
              <span className="text-cyber-red glow-text-red">Compromised</span>.{' '}
              <span className="glow-text">We Prove It.</span>
            </h1>
            <p className="text-xl text-gray-400">
              Every website you visit tracks you. PrivacyGuard is the only centralized dashboard 
              that shows you exactly who's watching, what they know, and how to stop them.
            </p>
            <div className="flex space-x-4">
              <Link to="/signup" className="btn-primary-enhanced text-lg px-8 py-4">
                <Zap className="w-5 h-5 inline mr-2" />
                Start Free Scan
              </Link>
              <Link to="#features" className="btn-secondary-enhanced text-lg px-8 py-4">
                See How It Works
              </Link>
            </div>
          </div>
          <div className="flex justify-center animate-fade-in-scale">
            <div style={{
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              borderRadius: 0,
            }}>
              <PrivacyScoreRing score={score} size="large" />
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Threat Feed */}
      <section className="border-y border-gray-800 bg-cyber-darker/30 backdrop-blur-sm py-4 overflow-hidden relative">
        <div className="threat-feed-glow"></div>
        <div className="flex space-x-8 animate-marquee-smooth whitespace-nowrap">
          {[...threats, ...threats, ...threats].map((threat, i) => (
            <div key={i} className="flex items-center space-x-2 text-cyber-red font-mono text-sm threat-item">
              <AlertTriangle className="w-4 h-4 animate-pulse" />
              <span>{threat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Animated Stats Counter */}
      <section className="max-w-7xl mx-auto px-6 py-20" data-section="stats">
        <div className={`grid md:grid-cols-4 gap-8 ${visibleSections.has('stats') ? 'animate-fade-up' : 'opacity-0'}`}>
          {[
            { icon: Shield, label: 'Trackers Blocked', value: counters.trackers, suffix: '+' },
            { icon: Users, label: 'Users Protected', value: counters.users, suffix: '+' },
            { icon: Database, label: 'Breach Scans', value: counters.scans, suffix: '+' },
            { icon: TrendingUp, label: 'Avg Score Improvement', value: counters.improvements, suffix: '%' }
          ].map((stat, i) => (
            <div
              key={i}
              className="stat-card"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <stat.icon className="w-10 h-10 text-cyber-teal mb-4" />
              <div className="text-4xl font-bold glow-text mb-2">
                {formatNumber(stat.value)}{stat.suffix}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Terminal Scanner Section */}
      <section className="max-w-7xl mx-auto px-6 py-20" data-section="terminal">
        <div className={`max-w-3xl mx-auto ${visibleSections.has('terminal') ? 'animate-fade-up' : 'opacity-0'}`}>
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyber-teal" />
                <span className="text-sm font-mono">PrivacyGuard Scanner v2.0</span>
              </div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-cyber-red"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-cyber-green"></div>
              </div>
            </div>
            <div className="terminal-body">
              {terminalLines.map((line, i) => (
                <div
                  key={i}
                  className={`terminal-line ${line.highlight ? 'text-cyber-teal' : 'text-gray-400'}`}
                >
                  {line.text}
                  {i === terminalLines.length - 1 && <span className="terminal-cursor">_</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20" data-section="features">
        <h2 className="text-4xl font-bold text-center mb-12">
          One Dashboard. <span className="glow-text">Total Control.</span>
        </h2>
        <div className={`grid md:grid-cols-3 gap-8 ${visibleSections.has('features') ? '' : 'opacity-0'}`}>
          {[
            {
              icon: Eye,
              title: 'Tracker Analyzer',
              description: 'See every tracker, cookie, and fingerprinting script across all your browsing. Real-time detection with risk scoring.'
            },
            {
              icon: TrendingUp,
              title: 'Privacy Score',
              description: 'Get a live privacy score (0-100) based on your exposure. Track improvements over time with detailed analytics.'
            },
            {
              icon: AlertTriangle,
              title: 'Breach Alerts',
              description: 'Instant notifications when your email appears in data breaches. Monitor multiple addresses automatically.'
            },
            {
              icon: Lock,
              title: 'One-Click Blocking',
              description: 'Block trackers globally or per-site. No technical knowledge required. Works across all browsers.'
            },
            {
              icon: Chrome,
              title: 'Browser Extension',
              description: 'Lightweight extension reports trackers in real-time. Syncs with your dashboard automatically.'
            },
            {
              icon: Shield,
              title: 'Privacy Reports',
              description: 'Monthly reports with charts, trends, and actionable insights. Export as PDF for records.'
            }
          ].map((feature, i) => (
            <div
              key={i}
              className={`feature-card ${visibleSections.has('features') ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="feature-icon-wrapper">
                <feature.icon className="w-12 h-12 text-cyber-teal" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-7xl mx-auto px-6 py-20" data-section="comparison">
        <h2 className="text-4xl font-bold text-center mb-12">
          Why <span className="glow-text">PrivacyGuard</span> Wins
        </h2>
        <div className={`card-premium overflow-x-auto ${visibleSections.has('comparison') ? 'animate-fade-up' : 'opacity-0'}`}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-4">Feature</th>
                <th className="text-center py-4 px-4 text-cyber-teal font-bold">PrivacyGuard</th>
                <th className="text-center py-4 px-4 text-gray-400">Ghostery</th>
                <th className="text-center py-4 px-4 text-gray-400">Privacy Badger</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {[
                ['Centralized Dashboard', true, false, false],
                ['Real-time Tracker Detection', true, true, true],
                ['Privacy Score', true, false, false],
                ['Breach Monitoring', true, false, false],
                ['Cross-Browser Sync', true, false, false],
                ['Monthly Reports', true, false, false],
                ['Risk Level Analysis', true, false, false]
              ].map(([feature, pg, gh, pb], i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-cyber-blue/20 transition-colors">
                  <td className="py-4 px-4">{feature}</td>
                  <td className="text-center py-4 px-4">
                    {pg ? <Check className="w-5 h-5 text-cyber-green mx-auto animate-check" /> : <X className="w-5 h-5 text-gray-600 mx-auto" />}
                  </td>
                  <td className="text-center py-4 px-4">
                    {gh ? <Check className="w-5 h-5 text-gray-400 mx-auto" /> : <X className="w-5 h-5 text-gray-600 mx-auto" />}
                  </td>
                  <td className="text-center py-4 px-4">
                    {pb ? <Check className="w-5 h-5 text-gray-400 mx-auto" /> : <X className="w-5 h-5 text-gray-600 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-6 py-20" data-section="pricing">
        <h2 className="text-4xl font-bold text-center mb-12">
          Simple, <span className="glow-text">Transparent</span> Pricing
        </h2>
        <div className={`grid md:grid-cols-2 gap-8 max-w-4xl mx-auto ${visibleSections.has('pricing') ? '' : 'opacity-0'}`}>
          <div className={`pricing-card ${visibleSections.has('pricing') ? 'animate-fade-up' : ''}`}>
            <div className="text-sm text-gray-400 font-semibold mb-2 uppercase tracking-wider">FREE</div>
            <div className="text-5xl font-bold mb-4">
              $0<span className="text-lg text-gray-400">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {['Tracker detection', 'Privacy score', 'Basic breach check', 'Browser extension', 'Up to 100 trackers/month'].map((item, i) => (
                <li key={i} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-cyber-green flex-shrink-0" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/signup" className="btn-secondary-enhanced w-full text-center block">
              Get Started
            </Link>
          </div>
          <div className={`pricing-card-premium ${visibleSections.has('pricing') ? 'animate-fade-up' : ''}`} style={{ animationDelay: '100ms' }}>
            <div className="premium-badge">MOST POPULAR</div>
            <div className="text-sm text-cyber-teal font-semibold mb-2 uppercase tracking-wider">PREMIUM</div>
            <div className="text-5xl font-bold mb-4">
              $9<span className="text-lg text-gray-400">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {['Everything in Free', 'Unlimited trackers', 'Monthly reports & PDF export', 'Email breach monitoring', 'Priority support', 'Advanced analytics'].map((item, i) => (
                <li key={i} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-cyber-teal flex-shrink-0" />
                  <span className="text-gray-100">{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/signup" className="btn-primary-enhanced w-full text-center block">
              <Zap className="w-5 h-5 inline mr-2" />
              Upgrade to Premium
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-cyber-darker py-12 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-cyber-teal" />
                <span className="font-bold">PrivacyGuard</span>
              </div>
              <p className="text-sm text-gray-400">
                Your privacy command center. Take control of your digital footprint.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-cyber-teal transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-cyber-teal transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-cyber-teal transition-colors">Extension</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-cyber-teal transition-colors">About</a></li>
                <li><a href="#" className="hover:text-cyber-teal transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-cyber-teal transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-cyber-teal transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-cyber-teal transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2026 PrivacyGuard. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
