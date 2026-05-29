// PrivacyGuard Content Script
// Runs on every page to detect cookies and additional tracking

(function() {
  'use strict';

  // Report cookies to background script
  function reportCookies() {
    const cookies = document.cookie.split(';').map(c => c.trim());
    
    // Filter for tracking cookies (simplified detection)
    const trackingCookies = cookies.filter(cookie => {
      const name = cookie.split('=')[0].toLowerCase();
      return name.includes('_ga') || // Google Analytics
             name.includes('_fb') || // Facebook
             name.includes('_utm') || // UTM tracking
             name.includes('_hjid') || // Hotjar
             name.includes('mp_'); // Mixpanel
    });

    if (trackingCookies.length > 0) {
      chrome.runtime.sendMessage({
        action: 'cookiesDetected',
        cookies: trackingCookies,
        url: window.location.href
      });
    }
  }

  // Detect canvas fingerprinting attempts
  const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.toDataURL = function() {
    chrome.runtime.sendMessage({
      action: 'fingerprintingDetected',
      type: 'canvas',
      url: window.location.href
    });
    return originalToDataURL.apply(this, arguments);
  };

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', reportCookies);
  } else {
    reportCookies();
  }

  // Monitor for dynamically added tracking scripts
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.tagName === 'SCRIPT' && node.src) {
          const src = node.src.toLowerCase();
          if (src.includes('analytics') || 
              src.includes('tracking') || 
              src.includes('pixel')) {
            chrome.runtime.sendMessage({
              action: 'scriptDetected',
              src: node.src,
              url: window.location.href
            });
          }
        }
      });
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  console.log('PrivacyGuard content script loaded');
})();
