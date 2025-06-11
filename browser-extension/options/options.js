// Options page script for Social Media Content Blocker
class OptionsManager {
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

    // Follower threshold
    document.getElementById('followerThreshold').addEventListener('change', (e) => {
      if (this.settings) {
        this.settings.followerThreshold = parseInt(e.target.value);
        this.saveSettings();
      }
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

    // User management
    document.getElementById('addUserBtn').addEventListener('click', () => {
      this.addUser();
    });

    document.getElementById('userInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addUser();
      }
    });

    // Import/Export
    document.getElementById('exportBtn').addEventListener('click', () => {
      this.exportSettings();
    });

    document.getElementById('importBtn').addEventListener('click', () => {
      document.getElementById('importFile').click();
    });

    document.getElementById('importFile').addEventListener('change', (e) => {
      this.importSettings(e.target.files[0]);
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
      this.resetSettings();
    });
  }

  async toggleSetting(settingName) {
    if (!this.settings) return;

    this.settings[settingName] = !this.settings[settingName];
    await this.saveSettings();
    this.updateUI();
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
  }

  async removeKeyword(keyword) {
    if (!this.settings || !this.settings.blockedKeywords) return;

    const index = this.settings.blockedKeywords.indexOf(keyword);
    if (index > -1) {
      this.settings.blockedKeywords.splice(index, 1);
      await this.saveSettings();
      this.updateKeywordList();
    }
  }

  async addUser() {
    const input = document.getElementById('userInput');
    const username = input.value.trim().replace('@', '');

    if (!username || !this.settings) return;

    if (!this.settings.blockedUsers) {
      this.settings.blockedUsers = [];
    }

    // Check if user already exists
    if (this.settings.blockedUsers.includes(username)) {
      input.value = '';
      return;
    }

    this.settings.blockedUsers.push(username);
    await this.saveSettings();
    input.value = '';
    this.updateUserList();
  }

  async removeUser(username) {
    if (!this.settings || !this.settings.blockedUsers) return;

    const index = this.settings.blockedUsers.indexOf(username);
    if (index > -1) {
      this.settings.blockedUsers.splice(index, 1);
      await this.saveSettings();
      this.updateUserList();
    }
  }

  updateUI() {
    if (!this.settings) return;

    // Update toggle switches
    this.updateToggle('enableToggle', this.settings.enabled);
    this.updateToggle('blockVideosToggle', this.settings.blockVideos);
    this.updateToggle('blockInfluencersToggle', this.settings.blockInfluencers);

    // Update follower threshold
    document.getElementById('followerThreshold').value = this.settings.followerThreshold || 50000;

    // Update stats
    this.updateStats();

    // Update lists
    this.updateKeywordList();
    this.updateUserList();
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
      `<div class="list-item">
        <span class="list-item-text">${keyword}</span>
        <button class="btn btn-danger" onclick="optionsManager.removeKeyword('${keyword}')">Remove</button>
      </div>`
    ).join('');
  }

  updateUserList() {
    const userList = document.getElementById('userList');
    
    if (!this.settings || !this.settings.blockedUsers || this.settings.blockedUsers.length === 0) {
      userList.innerHTML = '<div class="empty-state">No users blocked yet</div>';
      return;
    }

    userList.innerHTML = this.settings.blockedUsers.map(username => 
      `<div class="list-item">
        <span class="list-item-text">@${username}</span>
        <button class="btn btn-danger" onclick="optionsManager.removeUser('${username}')">Unblock</button>
      </div>`
    ).join('');
  }

  exportSettings() {
    if (!this.settings) return;

    const dataStr = JSON.stringify(this.settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'content-blocker-settings.json';
    link.click();
  }

  async importSettings(file) {
    if (!file) return;

    try {
      const text = await file.text();
      const importedSettings = JSON.parse(text);
      
      // Validate settings structure
      if (typeof importedSettings === 'object' && importedSettings !== null) {
        this.settings = { ...this.settings, ...importedSettings };
        await this.saveSettings();
        this.updateUI();
        alert('Settings imported successfully!');
      } else {
        alert('Invalid settings file format.');
      }
    } catch (error) {
      console.error('Error importing settings:', error);
      alert('Error importing settings. Please check the file format.');
    }
  }

  async resetSettings() {
    if (!confirm('Are you sure you want to reset all settings? This action cannot be undone.')) {
      return;
    }

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

    this.settings = defaultSettings;
    await this.saveSettings();
    this.updateUI();
    alert('Settings have been reset to defaults.');
  }
}

// Initialize options manager
let optionsManager;
document.addEventListener('DOMContentLoaded', () => {
  optionsManager = new OptionsManager();
});