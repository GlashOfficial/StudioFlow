// CC Status Bar Component
const ccStatusBar = {
  createStatusBar() {
    const statusBar = domUtils.createElement('div', 'cc-status-bar');
    statusBar.innerHTML = `
      <div class="status-content">
        <div class="status-message">
          <span class="status-icon loading"></span>
          <span class="message">Checking captions status...</span>
        </div>
        <button class="refresh-button" title="Check again" style="display: none">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
        </button>
      </div>
      <a href="https://support.google.com/youtube/answer/2734796" target="_blank" class="help-link" style="display: none">
        See how to enable them
      </a>
    `;

    return statusBar;
  },

  async updateStatus(statusBar, videoId) {
    if (!statusBar || !videoId) return;

    const messageElement = statusBar.querySelector('.message');
    const statusIcon = statusBar.querySelector('.status-icon');
    const helpLink = statusBar.querySelector('.help-link');
    const refreshButton = statusBar.querySelector('.refresh-button');
    
    // Show loading state
    statusIcon.className = 'status-icon loading';
    messageElement.textContent = 'Checking captions status...';
    helpLink.style.display = 'none';
    refreshButton.style.display = 'none';

    const { hasCaptions, fromCache, error } = await window.statusUtils.checkCaptionsStatus(videoId);

    if (hasCaptions) {
      statusIcon.className = 'status-icon success';
      messageElement.textContent = 'Your video is ready to generate content';
      helpLink.style.display = 'none';
      refreshButton.style.display = 'none';
    } else {
      statusIcon.className = 'status-icon error';
      messageElement.textContent = 'This video doesn\'t have captions ';
      helpLink.style.display = 'inline';
      refreshButton.style.display = 'block';
    }
  },

  injectStatusBar() {
    const videoInfo = domUtils.querySelector('.ytcp-video-info');
    if (!videoInfo) return;

    // Remove existing status bar if present
    const existingStatusBar = videoInfo.querySelector('.cc-status-bar');
    if (existingStatusBar) {
      existingStatusBar.remove();
    }

    // Create and inject the status bar
    const statusBar = this.createStatusBar();
    videoInfo.appendChild(statusBar);

    // Get video ID and update status
    const videoId = window.navigationUtils.extractVideoIdFromUrl();
    
    if (videoId) {
      this.updateStatus(statusBar, videoId);

      // Add refresh button handler
      const refreshButton = statusBar.querySelector('.refresh-button');
      refreshButton.addEventListener('click', () => {
        this.updateStatus(statusBar, videoId);
      });
    }

    return statusBar;
  }
};

window.Bar = ccStatusBar;