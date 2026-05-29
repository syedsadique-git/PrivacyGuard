# PrivacyGuard Browser Extension

Lightweight browser extension that detects trackers in real-time and syncs with your PrivacyGuard dashboard.

## Features

- Real-time tracker detection
- Cookie monitoring
- Canvas fingerprinting detection
- Automatic blocking (when enabled)
- Badge counter showing trackers on current page
- Quick access popup

## Installation

### Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select this `extension` folder

### Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `manifest.json` from this folder

## Usage

1. Install the extension
2. Sign in to PrivacyGuard web app
3. The extension will automatically start detecting trackers
4. Click the extension icon to see trackers on the current page
5. Toggle global blocking on/off
6. Click "Open Dashboard" to view full analytics

## Files

- `manifest.json` — Extension configuration (Manifest V3)
- `background.js` — Service worker for tracker detection
- `content.js` — Content script for cookie/fingerprint detection
- `popup.html` — Extension popup UI
- `popup.js` — Popup logic
- `rules.json` — Declarative blocking rules

## Permissions

- `storage` — Store user token and settings
- `declarativeNetRequest` — Block tracker requests
- `tabs` — Track per-tab statistics
- `cookies` — Detect tracking cookies
- `<all_urls>` — Monitor all websites

## Privacy

The extension only sends tracker data to your PrivacyGuard account. No data is shared with third parties.

## Development

To modify the extension:

1. Make changes to the files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the PrivacyGuard extension
4. Test your changes

## Known Limitations

- Tracker detection is based on a simplified pattern list
- Full EasyList integration pending
- Some advanced fingerprinting techniques may not be detected

## Support

For issues, visit: https://github.com/yourusername/privacyguard/issues
