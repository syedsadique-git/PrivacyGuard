// PrivacyGuard Background Service Worker (Manifest V3 compatible)
const API_URL = 'http://localhost:3001/api';

// Known tracker domains
const TRACKER_PATTERNS = {
  'google-analytics.com': { name: 'Google Analytics', category: 'Analytics', risk: 'medium' },
  'doubleclick.net': { name: 'DoubleClick', category: 'Advertising', risk: 'high' },
  'connect.facebook.net': { name: 'Facebook SDK', category: 'Advertising', risk: 'high' },
  'tr.snapchat.com': { name: 'Snapchat Pixel', category: 'Advertising', risk: 'medium' },
  'ads.twitter.com': { name: 'Twitter Ads', category: 'Social', risk: 'medium' },
  'linkedin.com': { name: 'LinkedIn Insights', category: 'Social', risk: 'medium' },
  'hotjar.com': { name: 'Hotjar', category: 'Analytics', risk: 'medium' },
  'mixpanel.com': { name: 'Mixpanel', category: 'Analytics', risk: 'low' },
  'fingerprintjs.com': { name: 'FingerprintJS', category: 'Fingerprinting', risk: 'high' },
  'taboola.com': { name: 'Taboola', category: 'Advertising', risk: 'high' },
  'outbrain.com': { name: 'Outbrain', category: 'Advertising', risk: 'high' },
  'segment.com': { name: 'Segment', category: 'Analytics', risk: 'medium' }
};

// Track detected trackers per tab (in-memory, resets on service worker restart)
const tabTrackers = {};

// MV3: Use declarativeNetRequestFeedback to detect blocked requests
chrome.declarativeNetRequest.onRuleMatchedDebug?.addListener(
  (info) => {
    const { request, rule } = info;
    try {
      const url = new URL(request.url);
      const domain = url.hostname;
      for (const [pattern, trackerInfo] of Object.entries(TRACKER_PATTERNS)) {
        if (domain.includes(pattern)) {
          recordTracker(request.tabId, domain, trackerInfo);
          break;
        }
      }
    } catch (_) {}
  }
);

// Also detect via content script messages (see content.js)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'reportTracker') {
    const { domain, trackerName, category, riskLevel } = request;
    const tabId = sender.tab?.id;
    if (tabId) {
      recordTracker(tabId, domain, { name: trackerName, category, risk: riskLevel });
    }
    sendResponse({ success: true });
  } else if (request.action === 'getTrackers') {
    sendResponse({ trackers: tabTrackers[request.tabId] || [] });
  } else if (request.action === 'toggleBlocking') {
    chrome.storage.local.set({ globalBlocking: request.enabled });
    sendResponse({ success: true });
  }
  return true; // Keep channel open for async sendResponse
});

// Record tracker detection
function recordTracker(tabId, domain, info) {
  if (!tabTrackers[tabId]) {
    tabTrackers[tabId] = [];
  }
  const existing = tabTrackers[tabId].find(t => t.domain === domain);
  if (!existing) {
    tabTrackers[tabId].push({
      domain,
      trackerName: info.name,
      category: info.category,
      riskLevel: info.risk,
      timestamp: Date.now()
    });
    sendToBackend({ domain, trackerName: info.name, category: info.category, riskLevel: info.risk });
    updateBadge(tabId);
  }
}

// Send tracker data to backend
async function sendToBackend(tracker) {
  try {
    const result = await chrome.storage.local.get('token');
    const token = result.token;
    if (!token) return;
    await fetch(`${API_URL}/trackers/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(tracker)
    });
  } catch (error) {
    console.error('Failed to send tracker data:', error);
  }
}

// Update extension badge
function updateBadge(tabId) {
  const count = tabTrackers[tabId]?.length || 0;
  chrome.action.setBadgeText({ tabId, text: count > 0 ? count.toString() : '' });
  chrome.action.setBadgeBackgroundColor({ tabId, color: count > 0 ? '#FF4D4D' : '#00E5CC' });
}

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabTrackers[tabId];
});

// Reset tracker count when navigating to a new page
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    tabTrackers[tabId] = [];
    updateBadge(tabId);
  }
});

console.log('PrivacyGuard extension loaded');
