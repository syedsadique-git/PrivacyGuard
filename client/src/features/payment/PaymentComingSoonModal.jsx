import { X, Clock, Mail } from 'lucide-react';

export default function PaymentComingSoonModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
         style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="relative w-full max-w-md card text-center py-10 px-8 animate-fadeIn">

        {/* Close button */}
        <button onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full mx-auto mb-6"
             style={{ background: 'rgba(0,229,204,0.1)', border: '2px solid #00E5CC' }}>
          <Clock className="w-10 h-10 text-cyber-teal" />
        </div>

        <h2 className="text-2xl font-bold mb-3">Payment Coming Soon</h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          We're working on bringing Premium to you. Payment options are not available yet —
          but we'll notify you as soon as they're live!
        </p>

        {/* Feature list */}
        <div className="text-left space-y-2 mb-8 bg-cyber-blue rounded-xl p-4 border border-gray-700">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">What you'll get with Premium</p>
          {[
            'Monthly privacy reports + PDF export',
            'Advanced analytics & tracker trends',
            'Email breach monitoring',
            'Priority support',
          ].map((f) => (
            <div key={f} className="flex items-center space-x-2 text-sm text-gray-300">
              <span className="text-cyber-teal">✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>

        {/* Notify CTA */}
        <a href="mailto:support@privacyguard.com?subject=Notify me when Premium launches"
           className="btn-primary w-full flex items-center justify-center space-x-2 mb-3">
          <Mail className="w-4 h-4" />
          <span>Notify Me When It's Ready</span>
        </a>

        <button onClick={onClose}
          className="w-full text-sm text-gray-500 hover:text-gray-300 transition-colors py-2">
          Maybe later
        </button>
      </div>
    </div>
  );
}
