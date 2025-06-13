// Utility functions for handling cached data
const cacheUtils = {
  CACHE_PREFIX: 'yt_studio_enhancer_',
  CACHE_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours in milliseconds

  getCacheKey(videoId) {
    return `${this.CACHE_PREFIX}cc_${videoId}`;
  },

  setCachedCaptions(videoId, captions) {
    const cacheData = {
      timestamp: Date.now(),
      captions: captions
    };
    localStorage.setItem(this.getCacheKey(videoId), JSON.stringify(cacheData));
  },

  getCachedCaptions(videoId) {
    const cacheKey = this.getCacheKey(videoId);
    const cachedData = localStorage.getItem(cacheKey);
    
    if (!cachedData) {
      return null;
    }

    const { timestamp, captions } = JSON.parse(cachedData);
    const isExpired = Date.now() - timestamp > this.CACHE_EXPIRY;

    if (isExpired) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return captions;
  },



  clearExpiredCache() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.CACHE_PREFIX)) {
        const cachedData = localStorage.getItem(key);
        if (cachedData) {
          const { timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp > this.CACHE_EXPIRY) {
            localStorage.removeItem(key);
          }
        }
      }
    });
  }
};

window.cacheUtils = cacheUtils;