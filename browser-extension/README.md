# Social Media Content Blocker

A Chrome browser extension that automatically blocks unwanted content from your X (Twitter) and LinkedIn feeds.

## Features

✅ **Block Video Content**: Hide all video posts and reels  
✅ **Keyword Filtering**: Block posts containing specific keywords  
✅ **User Blocking**: Block specific users manually  
🚧 **Influencer Blocking**: Block users with >50K followers (coming soon)  
📊 **Statistics**: Track what's been blocked  
⚙️ **Easy Management**: Simple popup and advanced settings page  

## Installation

### Loading the Extension in Chrome

1. **Download or Clone** this repository to your computer

2. **Open Chrome** and navigate to `chrome://extensions/`

3. **Enable Developer Mode** by clicking the toggle in the top-right corner

4. **Click "Load unpacked"** and select the `browser-extension` folder

5. **Pin the Extension** by clicking the puzzle piece icon in Chrome's toolbar and pinning "Social Media Content Blocker"

### First Time Setup

1. Click the extension icon in your Chrome toolbar
2. Toggle the settings you want:
   - **Enable Blocker**: Turn on/off the entire extension
   - **Block Videos**: Hide video/reel content
   - **Block Influencers**: Hide posts from high-follower accounts
3. Add keywords you want to block (e.g., "crypto", "NFT", "sponsored")
4. Visit X (Twitter) or LinkedIn to see the blocker in action!

## How It Works

The extension uses content scripts that run on X and LinkedIn pages to:

1. **Monitor your feed** for new posts as you scroll
2. **Analyze each post** for blocked content (videos, keywords, users)
3. **Hide unwanted posts** and show a "Content Blocked" message
4. **Provide statistics** on what's been blocked
5. **Allow you to reveal** blocked content if needed

## Usage

### Quick Access (Popup)
- Click the extension icon for quick toggles and keyword management
- View real-time statistics
- Add new keywords to block

### Advanced Settings
- Click "Advanced Settings" in the popup for comprehensive management
- Manage blocked users list
- Import/export your settings
- Reset to defaults
- View detailed statistics

### On Social Media Sites
- Blocked content shows as gray boxes with "Content Blocked" messages
- Click "Show Content" on any blocked post to reveal it temporarily
- See a live counter of blocked items in the top-right corner

## Supported Platforms

- ✅ **X (Twitter)**: twitter.com and x.com
- ✅ **LinkedIn**: linkedin.com
- 🚧 **More platforms**: Coming in future updates

## Current Limitations

- **Follower Count Detection**: Currently generates random numbers for testing. Real implementation would require scraping profile pages or API access
- **DOM Changes**: Social media sites frequently update their layouts, which may require selector updates
- **Rate Limiting**: No built-in rate limiting for follower count checking yet

## Privacy

This extension:
- ✅ Stores all settings locally in Chrome's sync storage
- ✅ Only runs on X and LinkedIn domains
- ✅ Does not send any data to external servers
- ✅ Does not track your browsing or personal information

## Development

### File Structure
```
browser-extension/
├── manifest.json              # Extension configuration
├── background.js              # Background service worker
├── content-scripts/
│   ├── twitter.js            # X/Twitter content blocking
│   └── linkedin.js           # LinkedIn content blocking
├── popup/
│   ├── popup.html            # Quick access popup UI
│   └── popup.js              # Popup functionality
├── options/
│   ├── options.html          # Advanced settings page
│   └── options.js            # Settings management
└── styles/
    └── content.css           # Styling for blocked content
```

### Adding New Platforms

1. Add the domain to `manifest.json` host_permissions
2. Create a new content script in `content-scripts/`
3. Add platform-specific selectors and logic
4. Update the manifest to include the new script

### Customizing Selectors

The extension uses CSS selectors to identify posts and content. These may need updates when platforms change their layouts:

**Twitter/X selectors:**
- Posts: `[data-testid="tweet"]`
- Video: `[data-testid="videoPlayer"]`
- Username: `[data-testid="User-Name"] a[role="link"]`

**LinkedIn selectors:**
- Posts: `.feed-shared-update-v2`
- Video: `video, .feed-shared-video`
- Author: `.feed-shared-actor__name`

## Troubleshooting

### Extension Not Working
1. Check that Developer Mode is enabled in `chrome://extensions/`
2. Ensure the extension is enabled and permissions are granted
3. Try reloading the extension or refreshing the social media page

### Content Not Being Blocked
1. Check that the extension is enabled in the popup
2. Verify your keywords and settings
3. Social media sites may have updated their layout - selectors might need updating

### Performance Issues
1. Try reducing the number of blocked keywords
2. The extension monitors page changes in real-time, which uses some resources
3. Consider disabling features you don't need

## Roadmap

- [ ] **Real Follower Count Detection**: Implement proper follower count scraping
- [ ] **Machine Learning**: AI-powered content classification
- [ ] **More Platforms**: Instagram, TikTok, Facebook support
- [ ] **Advanced Filters**: Sentiment analysis, image recognition
- [ ] **Scheduling**: Time-based blocking rules
- [ ] **Export Data**: Export statistics and blocked content logs

## Contributing

This is an open-source project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on X and LinkedIn
5. Submit a pull request

## License

MIT License - Feel free to modify and distribute.

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Look for error messages in Chrome's Developer Tools console
3. Try disabling and re-enabling the extension
4. Reset settings to defaults in the advanced settings page

---

**Enjoy a cleaner, more focused social media experience!** 🚫📱✨