// Popup script for Social Media Content Blocker
class PopupManager {
  constructor() {
    this.settings = null;
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.updateUI();
  }

  async loadSettings() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
      if (response.success) {
        this.settings = response.data;
      } else {
        console.error('Failed to load settings');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  async saveSettings() {
    try {
      await chrome.runtime.sendMessage({ 
        action: 'updateSettings', 
        data: this.settings 
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  setupEventListeners() {
    // Toggle switches
    document.getElementById('enableToggle').addEventListener('click', () => {
      this.toggleSetting('enabled');
    });

    document.getElementById('blockVideosToggle').addEventListener('click', () => {
      this.toggleSetting('blockVideos');
    });

    document.getElementById('blockInfluencersToggle').addEventListener('click', () => {
      this.toggleSetting('blockInfluencers');
    });

    // Keyword management
    document.getElementById('addKeywordBtn').addEventListener('click', () => {
      this.addKeyword();
    });

    document.getElementById('keywordInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addKeyword();
      }
    });

    // Options link
    document.getElementById('optionsLink').addEventListener('click', (e) => {
      e.preventDefault();
      chrome.runtime.openOptionsPage();
    });
  }

  async toggleSetting(settingName) {
    if (!this.settings) return;

    this.settings[settingName] = !this.settings[settingName];
    await this.saveSettings();
    this.updateUI();
    
    // Refresh active tabs to apply changes
    this.refreshActiveTabs();
  }

  async addKeyword() {
    const input = document.getElementById('keywordInput');
    const keyword = input.value.trim();

    if (!keyword || !this.settings) return;

    if (!this.settings.blockedKeywords) {
      this.settings.blockedKeywords = [];
    }

    // Check if keyword already exists
    if (this.settings.blockedKeywords.includes(keyword)) {
      input.value = '';
      return;
    }

    this.settings.blockedKeywords.push(keyword);
    await this.saveSettings();
    input.value = '';
    this.updateKeywordList();
    
    // Refresh active tabs to apply changes
    this.refreshActiveTabs();
  }

  async removeKeyword(keyword) {
    if (!this.settings || !this.settings.blockedKeywords) return;

    const index = this.settings.blockedKeywords.indexOf(keyword);
    if (index > -1) {
      this.settings.blockedKeywords.splice(index, 1);
      await this.saveSettings();
      this.updateKeywordList();
      
      // Refresh active tabs to apply changes
      this.refreshActiveTabs();
    }
  }

  updateUI() {
    if (!this.settings) return;

    // Update toggle switches
    this.updateToggle('enableToggle', this.settings.enabled);
    this.updateToggle('blockVideosToggle', this.settings.blockVideos);
    this.updateToggle('blockInfluencersToggle', this.settings.blockInfluencers);

    // Update stats
    this.updateStats();

    // Update keyword list
    this.updateKeywordList();
  }

  updateToggle(toggleId, isActive) {
    const toggle = document.getElementById(toggleId);
    if (toggle) {
      toggle.classList.toggle('active', isActive);
    }
  }

  updateStats() {
    if (!this.settings || !this.settings.stats) return;

    const stats = this.settings.stats;
    document.getElementById('totalBlocked').textContent = stats.totalBlocked || 0;
    document.getElementById('videosBlocked').textContent = stats.videosBlocked || 0;
    document.getElementById('keywordBlocked').textContent = stats.keywordBlocked || 0;
    document.getElementById('influencersBlocked').textContent = stats.influencersBlocked || 0;
  }

  updateKeywordList() {
    const keywordList = document.getElementById('keywordList');
    
    if (!this.settings || !this.settings.blockedKeywords || this.settings.blockedKeywords.length === 0) {
      keywordList.innerHTML = '<div class="empty-state">No keywords blocked yet</div>';
      return;
    }

    keywordList.innerHTML = this.settings.blockedKeywords.map(keyword => 
      `<span class="keyword-tag">
        ${keyword}
        <button class="keyword-remove" data-keyword="${keyword}">×</button>
      </span>`
    ).join('');

    // Add event listeners to remove buttons
    keywordList.querySelectorAll('.keyword-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const keyword = e.target.getAttribute('data-keyword');
        this.removeKeyword(keyword);
      });
    });
  }

  async refreshActiveTabs() {
    try {
      // Get all tabs with supported URLs
      const tabs = await chrome.tabs.query({
        url: ['https://twitter.com/*', 'https://x.com/*', 'https://www.linkedin.com/*']
      });

      // Reload each tab to apply new settings
      tabs.forEach(tab => {
        chrome.tabs.reload(tab.id);
      });
    } catch (error) {
      console.error('Error refreshing tabs:', error);
    }
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});