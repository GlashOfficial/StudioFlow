// Utility functions for handling status checks and updates
const statusUtils = {
  async checkCaptionsStatus(videoId) {
    try {
      if (!videoId) return { hasCaptions: false, error: 'No video ID provided' };

      const cachedCaptions = window.cacheUtils.getCachedCaptions(videoId);
      if (cachedCaptions) {
        return { hasCaptions: true, fromCache: true };
      }

      const response = await chrome.runtime.sendMessage({
        type: 'FETCH_CAPTIONS',
        videoId: videoId
      });

      if (response.success && response.data) {
        window.cacheUtils.setCachedCaptions(videoId, response.data);
        return { hasCaptions: true, fromCache: false };
      }

      return { hasCaptions: false, error: response.error };
    } catch (error) {
      console.error('Error checking captions status:', error);
      return { hasCaptions: false, error: error.message };
    }
  }
};

window.statusUtils = statusUtils;