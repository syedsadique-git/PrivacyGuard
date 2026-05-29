import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Chrome, Mail, Settings as SettingsIcon, Check } from 'lucide-react';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [blockingPreference, setBlockingPreference] = useState('ask');
  const navigate = useNavigate();

  const steps = [
    {
      title: 'Welcome to PrivacyGuard',
      description: 'Your centralized privacy command center',
      icon: Shield
    },
    {
      title: 'Install Browser Extension',
      description: 'Connect your browser to start tracking detection',
      icon: Chrome
    },
    {
      title: 'Monitor Data Breaches',
      description: 'Get alerts when your email appears in breaches',
      icon: Mail
    },
    {
      title: 'Set Blocking Preferences',
      description: 'Choose how you want to handle trackers',
      icon: SettingsIcon
    }
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-darker to-cyber-dark flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`flex items-center ${i < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    i + 1 <= step
                      ? 'bg-cyber-teal text-cyber-dark'
                      : 'bg-cyber-blue text-gray-400'
                  }`}
                >
                  {i + 1 < step ? <Check className="w-5 h-5" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      i + 1 < step ? 'bg-cyber-teal' : 'bg-cyber-blue'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-400">
            Step {step} of {steps.length}
          </div>
        </div>

        {/* Content Card */}
        <div className="card animate-slide-up">
          <div className="text-center mb-8">
            {React.createElement(steps[step - 1].icon, {
              className: 'w-16 h-16 text-cyber-teal mx-auto mb-4'
            })}
            <h1 className="text-3xl font-bold mb-2">{steps[step - 1].title}</h1>
            <p className="text-gray-400">{steps[step - 1].description}</p>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {step === 1 && (
              <div className="space-y-4 text-center">
                <p className="text-gray-300">
                  PrivacyGuard helps you take control of your digital privacy by:
                </p>
                <ul className="space-y-3 text-left max-w-md mx-auto">
                  {[
                    'Detecting trackers across all your browsing',
                    'Calculating your real-time privacy score',
                    'Monitoring for data breaches',
                    'Blocking invasive trackers automatically'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-cyber-teal flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-cyber-blue p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Install the Extension</h3>
                  <div className="space-y-3">
                    <a
                      href="#"
                      className="btn-primary w-full text-center block"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Chrome className="w-5 h-5 inline mr-2" />
                      Install for Chrome
                    </a>
                    <a
                      href="#"
                      className="btn-secondary w-full text-center block"
                      onClick={(e) => e.preventDefault()}
                    >
                      Install for Firefox
                    </a>
                  </div>
                </div>
                <p className="text-sm text-gray-400 text-center">
                  The extension runs in the background and automatically reports trackers to your dashboard.
                  You can skip this step and install it later from Settings.
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address to Monitor
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input-field w-full"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    We'll check this email against known data breaches and alert you to any exposures.
                  </p>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <p className="text-gray-300 mb-4">
                  How would you like PrivacyGuard to handle detected trackers?
                </p>
                <div className="space-y-3">
                  {[
                    { value: 'block', label: 'Block All Trackers', desc: 'Maximum privacy protection' },
                    { value: 'ask', label: 'Ask Me First', desc: 'Review each tracker before blocking' },
                    { value: 'allow', label: 'Allow All (Monitor Only)', desc: 'Track but don\'t block' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        blockingPreference === option.value
                          ? 'border-cyber-teal bg-cyber-teal/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="blocking"
                        value={option.value}
                        checked={blockingPreference === option.value}
                        onChange={(e) => setBlockingPreference(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-start">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5 ${
                            blockingPreference === option.value
                              ? 'border-cyber-teal bg-cyber-teal'
                              : 'border-gray-600'
                          }`}
                        >
                          {blockingPreference === option.value && (
                            <div className="w-2 h-2 bg-cyber-dark rounded-full" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold">{option.label}</div>
                          <div className="text-sm text-gray-400">{option.desc}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Skip Setup
            </button>
            <div className="flex space-x-3">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="btn-secondary"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="btn-primary"
              >
                {step === steps.length ? 'Get Started' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
