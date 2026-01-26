# Sidebark 🐾

Your loyal Shiba companion in the browser. A premium universal sidebar for Chrome.

## Features

- **Pinned Sites**: Quick access to your favorite sites in the side panel.
- **Mobile View**: Toggle mobile User-Agent for specific sites.
- **Tab Trigger**: Easily insert the current URL into any input field with `@tab`.
- **Customizable**: Change your trigger and sync settings.
- **Cute Shiba**: A faithful companion who reacts to your actions.

## Installation

1. Clone this repository.
2. Run `npm install` and `npm run build`.
3. Open Chrome and go to `chrome://extensions/`.
4. Enable "Developer mode".
5. Click "Load unpacked" and select the `dist` folder.

## Privacy and Permissions

- **`<all_urls>`**: Required to display any site within the iframe in the side panel.
- **`sidePanel`**: For the core sidebar experience.
- **`storage`**: To save your pinned sites and settings (synced across devices).
- **declarativeNetRequest**: To toggle mobile view by modifying headers.

## Known Limitations

Some high-security websites (e.g., Gmail, Instagram, and banking sites) cannot be displayed within the side panel. This is due to strict security policies implemented by these providers:

- **Security Headers**: Policies like `X-Frame-Options: SAMEORIGIN` or `Content-Security-Policy: frame-ancestors 'self'` explicitly block embedding in other pages/extensions.
- **Authentication Security**: These sites often use strict Cookie settings (SameSite) to prevent unauthorized access from within other frames.
- **Anti-Framing Measures**: Many services use Javascript to detect and block being loaded inside an iframe for security reasons.

## Important: Sync Settings

Sidebark uses Chrome's sync storage (`chrome.storage.sync`) to save your pinned sites and settings. To ensure your data syncs across devices:

1. **Sign in to Chrome** with your Google account.
2. **Enable Chrome Sync**: Go to `chrome://settings/syncSetup` and make sure sync is turned on.
3. **Verify "Extensions" sync is enabled**: In sync settings, ensure that "Extensions" is included in the items being synced.

## License

AGPL-3.0-or-later
