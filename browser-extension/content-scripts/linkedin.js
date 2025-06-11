// LinkedIn Content Blocker
class LinkedInContentBlocker {
  constructor() {
    this.settings = null;
    this.blockedCount = 0;
    this.observer = null;
    this.init();
  }

  async init() {
    console.log('LinkedIn Content Blocker initialized');
    
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
          // Check if new posts were added
          for (let node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.querySelector('.feed-shared-update-v2') || 
                  node.classList.contains('feed-shared-update-v2')) {
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
    // Find all post elements
    const posts = document.querySelectorAll('.feed-shared-update-v2:not(.smcb-processed)');
    
    posts.forEach(post => {
      post.classList.add('smcb-processed');
      this.processPost(post);
    });
  }

  processPost(postElement) {
    try {
      // Extract post data
      const postData = this.extractPostData(postElement);
      
      if (!postData) return;

      // Check blocking criteria
      const blockReason = this.shouldBlockPost(postData);
      
      if (blockReason) {
        this.blockPost(postElement, blockReason);
      }
    } catch (error) {
      console.error('Error processing LinkedIn post:', error);
    }
  }

  extractPostData(postElement) {
    try {
      // Extract author name
      const authorElement = postElement.querySelector('.feed-shared-actor__name');
      const authorName = authorElement ? authorElement.textContent.trim() : '';

      // Extract post text
      const postTextElement = postElement.querySelector('.feed-shared-text');
      const postText = postTextElement ? postTextElement.textContent.trim() : '';

      // Check for video content
      const hasVideo = postElement.querySelector('video') !== null ||
                      postElement.querySelector('.feed-shared-video') !== null ||
                      postElement.querySelector('[data-test="video-player"]') !== null;

      // Extract profile link for follower checking
      const profileElement = postElement.querySelector('.feed-shared-actor__container-link');
      const profileLink = profileElement ? profileElement.href : '';

      return {
        authorName,
        postText,
        hasVideo,
        profileLink,
        element: postElement
      };
    } catch (error) {
      console.error('Error extracting LinkedIn post data:', error);
      return null;
    }
  }

  shouldBlockPost(postData) {
    if (!this.settings) return null;

    // Check for video content
    if (this.settings.blockVideos && postData.hasVideo) {
      return 'Contains video content';
    }

    // Check for blocked keywords
    if (this.settings.blockedKeywords && this.settings.blockedKeywords.length > 0) {
      const lowerText = postData.postText.toLowerCase();
      for (let keyword of this.settings.blockedKeywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          return `Contains blocked keyword: "${keyword}"`;
        }
      }
    }

    // Check for blocked users
    if (this.settings.blockedUsers && this.settings.blockedUsers.length > 0) {
      const lowerAuthor = postData.authorName.toLowerCase();
      for (let blockedUser of this.settings.blockedUsers) {
        if (lowerAuthor.includes(blockedUser.toLowerCase())) {
          return `Blocked user: ${blockedUser}`;
        }
      }
    }

    return null;
  }

  async blockPost(postElement, reason) {
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
      postElement.style.display = 'block';
    });

    // Hide original content and show overlay
    postElement.style.display = 'none';
    postElement.parentNode.insertBefore(overlay, postElement.nextSibling);

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
    new LinkedInContentBlocker();
  });
} else {
  new LinkedInContentBlocker();
}