import React, { useState } from 'react';
import './App.css';

function App() {
  const [isInstalled, setIsInstalled] = useState(false);

  React.useEffect(() => {
    // Check if Chrome extension APIs are available
    if (typeof window.chrome !== 'undefined' && window.chrome.runtime) {
      setIsInstalled(true);
    }
  }, []);

  const openChromeExtensions = () => {
    window.open('chrome://extensions/', '_blank');
  };

  const openTwitter = () => {
    window.open('https://twitter.com', '_blank');
  };

  const openLinkedIn = () => {
    window.open('https://linkedin.com', '_blank');
  };

  const downloadExtension = () => {
    // In a real scenario, this would trigger a download or show instructions
    alert('Extension files are located in the browser-extension folder. See installation instructions below!');
  };

  return (
    <div className="App">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                🚫 Social Media Content Blocker
              </h1>
              <p className="hero-subtitle">
                Take control of your social media feeds. Block unwanted videos, keywords, and influencers from X (Twitter) and LinkedIn.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">2</span>
                  <span className="stat-label">Platforms Supported</span>
                </div>
                <div className="stat">
                  <span className="stat-number">∞</span>
                  <span className="stat-label">Keywords Blocked</span>
                </div>
                <div className="stat">
                  <span className="stat-number">0s</span>
                  <span className="stat-label">Setup Time</span>
                </div>
              </div>
              <div className="hero-buttons">
                <button className="btn btn-primary btn-large" onClick={downloadExtension}>
                  📦 Get Extension
                </button>
                <button className="btn btn-secondary btn-large" onClick={openChromeExtensions}>
                  ⚙️ Chrome Extensions
                </button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="browser-mockup">
                <div className="browser-header">
                  <div className="browser-buttons">
                    <span className="browser-button red"></span>
                    <span className="browser-button yellow"></span>
                    <span className="browser-button green"></span>
                  </div>
                  <div className="browser-url">chrome-extension://...</div>
                </div>
                <div className="browser-content">
                  <div className="extension-popup">
                    <div className="popup-header">
                      <h3>🚫 Content Blocker</h3>
                      <p>Clean up your social media feeds</p>
                    </div>
                    <div className="popup-toggles">
                      <div className="toggle-item">
                        <span>Enable Blocker</span>
                        <div className="toggle active"></div>
                      </div>
                      <div className="toggle-item">
                        <span>Block Videos</span>
                        <div className="toggle active"></div>
                      </div>
                      <div className="toggle-item">
                        <span>Block Influencers</span>
                        <div className="toggle"></div>
                      </div>
                    </div>
                    <div className="popup-stats">
                      <div className="mini-stat">
                        <div className="mini-stat-number">247</div>
                        <div className="mini-stat-label">Blocked Today</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">✨ Powerful Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎥</div>
              <h3>Video Blocking</h3>
              <p>Automatically hide video posts and reels from your social media feeds. Perfect for staying focused during work hours.</p>
              <div className="feature-status working">✅ Working</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Keyword Filtering</h3>
              <p>Block posts containing specific keywords like "crypto", "sponsored", or any terms you want to avoid.</p>
              <div className="feature-status working">✅ Working</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👤</div>
              <h3>User Blocking</h3>
              <p>Manually block specific users by username. Keep your feeds clean from accounts you don't want to see.</p>
              <div className="feature-status working">✅ Working</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👑</div>
              <h3>Influencer Blocking</h3>
              <p>Automatically block users with more than 50K followers. Reduce promotional content and focus on personal connections.</p>
              <div className="feature-status pending">🚧 Coming Soon</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Real-time Stats</h3>
              <p>Track how much content you've blocked. See statistics on videos, keywords, and influencers filtered out.</p>
              <div className="feature-status working">✅ Working</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚙️</div>
              <h3>Easy Management</h3>
              <p>Simple popup for quick toggles and advanced settings page for comprehensive control over your blocking rules.</p>
              <div className="feature-status working">✅ Working</div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section className="installation">
        <div className="container">
          <h2 className="section-title">🔧 Installation Guide</h2>
          <div className="installation-content">
            <div className="installation-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Enable Developer Mode</h3>
                  <p>Open Chrome and navigate to <code>chrome://extensions/</code>. Toggle "Developer mode" in the top-right corner.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Load Extension</h3>
                  <p>Click "Load unpacked" and select the <code>browser-extension</code> folder from this project.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Pin Extension</h3>
                  <p>Click the puzzle piece icon in Chrome's toolbar and pin "Social Media Content Blocker".</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Configure & Test</h3>
                  <p>Click the extension icon to configure settings, then visit X (Twitter) or LinkedIn to see it in action!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testing Section */}
      <section className="testing">
        <div className="container">
          <h2 className="section-title">🧪 Test the Extension</h2>
          <div className="testing-content">
            <div className="test-description">
              <p>Once you've installed the extension, test it on these supported platforms:</p>
            </div>
            <div className="test-buttons">
              <button className="btn btn-twitter" onClick={openTwitter}>
                <span className="btn-icon">🐦</span>
                Test on X (Twitter)
              </button>
              <button className="btn btn-linkedin" onClick={openLinkedIn}>
                <span className="btn-icon">💼</span>
                Test on LinkedIn
              </button>
            </div>
            <div className="test-tips">
              <h3>Testing Tips:</h3>
              <ul>
                <li>Add keywords like "sponsored", "crypto", or "NFT" to see blocking in action</li>
                <li>Look for the blocked content overlays with "Content Blocked" messages</li>
                <li>Check the real-time counter in the top-right corner of the page</li>
                <li>Try the "Show Content" button to reveal blocked posts temporarily</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="status">
        <div className="container">
          <h2 className="section-title">📋 Current Status</h2>
          <div className="status-grid">
            <div className="status-card completed">
              <h3>✅ Completed Features</h3>
              <ul>
                <li>Chrome extension architecture</li>
                <li>X (Twitter) content detection & blocking</li>
                <li>LinkedIn content detection & blocking</li>
                <li>Keyword filtering system</li>
                <li>Video/reel detection</li>
                <li>User blocking functionality</li>
                <li>Popup interface</li>
                <li>Advanced settings page</li>
                <li>Real-time statistics</li>
                <li>Settings import/export</li>
              </ul>
            </div>
            <div className="status-card pending">
              <h3>🚧 Next Phase</h3>
              <ul>
                <li>Follower count scraping for influencer detection</li>
                <li>Machine learning content classification</li>
                <li>Instagram & TikTok support</li>
                <li>Advanced scheduling rules</li>
                <li>Sentiment analysis</li>
                <li>Cloud settings sync</li>
                <li>Team/family sharing features</li>
                <li>Browser compatibility (Firefox, Safari)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-text">
              <h3>🚫 Social Media Content Blocker</h3>
              <p>Take control of your social media experience. Block unwanted content and stay focused on what matters to you.</p>
            </div>
            <div className="footer-links">
              <button className="btn btn-outline" onClick={openChromeExtensions}>
                Chrome Extensions
              </button>
              <button className="btn btn-outline" onClick={() => window.open('/browser-extension/README.md', '_blank')}>
                Documentation
              </button>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Social Media Content Blocker. Open source project for cleaner social media feeds.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;