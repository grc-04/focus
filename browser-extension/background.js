// Background script for Social Media Content Blocker
class ContentBlockerBackground {
  constructor() {
    this.initializeExtension();
  }

  initializeExtension() {
    // Set default settings on installation
    chrome.runtime.onInstalled.addListener(() => {
      this.setDefaultSettings();
    });

    // Handle messages from content scripts
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep channel open for async responses
    });
  }

  async setDefaultSettings() {
    const defaultSettings = {
      enabled: true,
      blockVideos: true,
      blockInfluencers: true,
      followerThreshold: 50000,
      blockedKeywords: [],
      blockedUsers: [],
      stats: {
        totalBlocked: 0,
        videosBlocked: 0,
        influencersBlocked: 0,
        keywordBlocked: 0
      }
    };

    try {
      const result = await chrome.storage.sync.get(['settings']);
      if (!result.settings) {
        await chrome.storage.sync.set({ settings: defaultSettings });
        console.log('Default settings initialized');
      }
    } catch (error) {
      console.error('Error setting default settings:', error);
    }
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'getSettings':
          const settings = await this.getSettings();
          sendResponse({ success: true, data: settings });
          break;

        case 'updateSettings':
          await this.updateSettings(request.data);
          sendResponse({ success: true });
          break;

        case 'incrementStats':
          await this.incrementStats(request.type);
          sendResponse({ success: true });
          break;

        case 'getFollowerCount':
          const followerCount = await this.getFollowerCount(request.url);
          sendResponse({ success: true, data: followerCount });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Background script error:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async getSettings() {
    const result = await chrome.storage.sync.get(['settings']);
    return result.settings;
  }

  async updateSettings(newSettings) {
    await chrome.storage.sync.set({ settings: newSettings });
  }

  async incrementStats(type) {
    const settings = await this.getSettings();
    if (settings && settings.stats) {
      settings.stats.totalBlocked = (settings.stats.totalBlocked || 0) + 1;
      if (type) {
        settings.stats[type] = (settings.stats[type] || 0) + 1;
      }
      await this.updateSettings(settings);
    }
  }

  async getFollowerCount(profileUrl) {
    // This is a placeholder for follower count fetching
    // In practice, this would scrape the profile page or use APIs
    try {
      // For now, return a random number for testing
      // In real implementation, we'd need to:
      // 1. Fetch the profile page
      // 2. Parse the follower count from the HTML
      // 3. Handle rate limiting and errors
      
      return Math.floor(Math.random() * 100000);
    } catch (error) {
      console.error('Error fetching follower count:', error);
      return null;
    }
  }
}

// Initialize the background script
new ContentBlockerBackground();