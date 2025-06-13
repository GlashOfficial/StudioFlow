// Utility functions for handling navigation and URL changes
const navigationUtils = {
  extractVideoIdFromUrl() {
    const url = window.location.href;
    
    // Handle video page URL format
    const videoMatch = url.match(/\/video\/([^/?]+)/);
    if (videoMatch) return videoMatch[1];
    
    // Handle upload page URL format with udvid parameter
    const params = new URLSearchParams(window.location.search);
    const udvid = params.get('udvid');
    if (udvid) return udvid;
    
    return null;
  },

  setupNavigationObserver(callback) {
    let lastUrl = window.location.href;
    
    // Create a new observer instance
    const observer = new MutationObserver(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        callback(currentUrl);
      }
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return observer;
  }
};

window.navigationUtils = navigationUtils;