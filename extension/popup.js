// PrivacyGuard Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  const trackerCountEl = document.getElementById('tracker-count');
  const trackerListEl = document.getElementById('tracker-list');
  const blockingToggle = document.getElementById('blocking-toggle');
  const openDashboardBtn = document.getElementById('open-dashboard');

  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Load trackers for current tab
  chrome.runtime.sendMessage(
    { action: 'getTrackers', tabId: tab.id },
    (response) => {
      const trackers = response.trackers || [];
      trackerCountEl.textContent = trackers.length;

      if (trackers.length === 0) {
        trackerListEl.innerHTML = '<div class="empty-state">No trackers detected on this page</div>';
      } else {
        trackerListEl.innerHTML = trackers.map(tracker => `
          <div class="tracker-item">
            <div class="tracker-name">${tracker.trackerName}</div>
            <div class="tracker-domain">${tracker.domain}</div>
            <span class="category category-${tracker.category.toLowerCase()}">${tracker.category}</span>
          </div>
        `).join('');
      }
    }
  );

  // Load blocking state
  chrome.storage.local.get('globalBlocking', (data) => {
    if (data.globalBlocking) {
      blockingToggle.classList.add('active');
    }
  });

  // Toggle blocking
  blockingToggle.addEventListener('click', () => {
    const isActive = blockingToggle.classList.toggle('active');
    chrome.runtime.sendMessage({
      action: 'toggleBlocking',
      enabled: isActive
    });
  });

  // Open dashboard
  openDashboardBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:5173/dashboard' });
  });
});
