// Twitter/X Content Blocker
class TwitterContentBlocker {
  constructor() {
    this.settings = null;
    this.blockedCount = 0;
    this.observer = null;
    this.init();
  }

  async init() {
    console.log('Twitter Content Blocker initialized');
    
    // Get settings from background script
    await this.loadSettings();
    
    if (!this.settings || !this.settings.enabled) {
      return;
    }

    // Start monitoring the feed
    this.startMonitoring();
    
    // Show stats badge
    this.showStatsBadge();
  }

  async loadSettings() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
      if (response.success) {
        this.settings = response.data;
        console.log('Settings loaded:', this.settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  startMonitoring() {
    // Initial scan
    this.scanAndBlockContent();

    // Set up mutation observer for dynamic content
    this.observer = new MutationObserver((mutations) => {
      let shouldScan = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if new tweets were added
          for (let node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.querySelector('[data-testid="tweet"]') || 
                  node.getAttribute('data-testid') === 'tweet') {
                shouldScan = true;
                break;
              }
            }
          }
        }
      });

      if (shouldScan) {
        setTimeout(() => this.scanAndBlockContent(), 500);
      }
    });

    // Start observing
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  scanAndBlockContent() {
    // Find all tweet elements
    const tweets = document.querySelectorAll('[data-testid="tweet"]:not(.smcb-processed)');
    
    tweets.forEach(tweet => {
      tweet.classList.add('smcb-processed');
      this.processTweet(tweet);
    });
  }

  processTweet(tweetElement) {
    try {
      // Extract tweet data
      const tweetData = this.extractTweetData(tweetElement);
      
      if (!tweetData) return;

      // Check blocking criteria
      const blockReason = this.shouldBlockTweet(tweetData);
      
      if (blockReason) {
        this.blockTweet(tweetElement, blockReason);
      }
    } catch (error) {
      console.error('Error processing tweet:', error);
    }
  }

  extractTweetData(tweetElement) {
    try {
      // Extract username
      const usernameElement = tweetElement.querySelector('[data-testid="User-Name"] a[role="link"]');
      const username = usernameElement ? usernameElement.textContent.trim() : '';

      // Extract tweet text
      const tweetTextElement = tweetElement.querySelector('[data-testid="tweetText"]');
      const tweetText = tweetTextElement ? tweetTextElement.textContent.trim() : '';

      // Check for video content
      const hasVideo = tweetElement.querySelector('[data-testid="videoPlayer"]') !== null ||
                      tweetElement.querySelector('video') !== null;

      // Extract profile link for follower checking
      const profileLink = usernameElement ? usernameElement.href : '';

      return {
        username,
        tweetText,
        hasVideo,
        profileLink,
        element: tweetElement
      };
    } catch (error) {
      console.error('Error extracting tweet data:', error);
      return null;
    }
  }

  shouldBlockTweet(tweetData) {
    if (!this.settings) return null;

    // Check for video content
    if (this.settings.blockVideos && tweetData.hasVideo) {
      return 'Contains video/reel content';
    }

    // Check for blocked keywords
    if (this.settings.blockedKeywords && this.settings.blockedKeywords.length > 0) {
      const lowerText = tweetData.tweetText.toLowerCase();
      for (let keyword of this.settings.blockedKeywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          return `Contains blocked keyword: "${keyword}"`;
        }
      }
    }

    // Check for blocked users
    if (this.settings.blockedUsers && this.settings.blockedUsers.length > 0) {
      const lowerUsername = tweetData.username.toLowerCase();
      for (let blockedUser of this.settings.blockedUsers) {
        if (lowerUsername.includes(blockedUser.toLowerCase())) {
          return `Blocked user: ${blockedUser}`;
        }
      }
    }

    return null;
  }

  async blockTweet(tweetElement, reason) {
    // Increment stats
    try {
      const statType = reason.includes('video') ? 'videosBlocked' : 
                      reason.includes('keyword') ? 'keywordBlocked' : 
                      'influencersBlocked';
      
      await chrome.runtime.sendMessage({ 
        action: 'incrementStats', 
        type: statType 
      });
      
      this.blockedCount++;
    } catch (error) {
      console.error('Error updating stats:', error);
    }

    // Create blocked content overlay
    const overlay = document.createElement('div');
    overlay.className = 'smcb-blocked-overlay';
    overlay.innerHTML = `
      <div class="smcb-blocked-message">🚫 Content blocked by Social Media Content Blocker</div>
      <div class="smcb-blocked-reason">${reason}</div>
      <button class="smcb-show-content">Show Content</button>
    `;

    // Add show content functionality
    const showButton = overlay.querySelector('.smcb-show-content');
    showButton.addEventListener('click', () => {
      overlay.style.display = 'none';
      tweetElement.style.display = 'block';
    });

    // Hide original content and show overlay
    tweetElement.style.display = 'none';
    tweetElement.parentNode.insertBefore(overlay, tweetElement.nextSibling);

    // Update stats badge
    this.updateStatsBadge();
  }

  showStatsBadge() {
    const badge = document.createElement('div');
    badge.id = 'smcb-stats-badge';
    badge.className = 'smcb-stats-badge';
    badge.innerHTML = '🚫 0 blocked';
    document.body.appendChild(badge);
  }

  updateStatsBadge() {
    const badge = document.getElementById('smcb-stats-badge');
    if (badge) {
      badge.innerHTML = `🚫 ${this.blockedCount} blocked`;
    }
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    
    const badge = document.getElementById('smcb-stats-badge');
    if (badge) {
      badge.remove();
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new TwitterContentBlocker();
  });
} else {
  new TwitterContentBlocker();
}