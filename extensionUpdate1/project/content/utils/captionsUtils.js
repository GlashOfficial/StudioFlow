// Utility functions for handling YouTube captions
const captionsUtils = {
  async fetchYoutubeCaptions(videoId) {
    try {
      console.log('Checking cache for video ID:', videoId);
      
      // Check cache first
      const cachedCaptions = window.cacheUtils.getCachedCaptions(videoId);
      if (cachedCaptions) {
        console.log('Using cached captions for video ID:', videoId);
        return cachedCaptions;
      }

      console.log('Requesting captions for video ID:', videoId);
      
      const response = await chrome.runtime.sendMessage({
        type: 'FETCH_CAPTIONS',
        videoId: videoId
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch captions');
      }

      // Cache the fetched captions
      window.cacheUtils.setCachedCaptions(videoId, response.data);

      console.log('Successfully received and cached captions from background script');
      return response.data;
    } catch (error) {
      console.error('Error fetching YouTube captions:', error);
      throw error;
    }
  },

  extractVideoId(url) {
    try {
      console.log('Extracting video ID from URL:', url);
      
      if (!url) {
        throw new Error('No URL provided');
      }

      // Handle different URL formats
      let videoId = null;
      
      if (url.includes('youtu.be/')) {
        // Handle shortened URLs (e.g., https://youtu.be/VIDEO_ID)
        const urlParts = url.split('youtu.be/');
        if (urlParts.length > 1) {
          videoId = urlParts[1].split('?')[0].split('&')[0];
        }
      } else if (url.includes('youtube.com')) {
        // Handle standard URLs (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v');
      }
      
      console.log('Extracted video ID:', videoId);
      
      if (!videoId) {
        throw new Error('Could not extract video ID from URL');
      }
      
      return videoId;
    } catch (error) {
      console.error('Error extracting video ID:', error);
      throw error;
    }
  }
};

window.captionsUtils = captionsUtils;