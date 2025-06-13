// Utility functions for handling YouTube comments
const commentUtils = {
  async fetchComments(videoId) {
    try {
      console.log('Fetching comments for video ID:', videoId);
      
      // Get comments through the background script to avoid CORS issues
      const response = await chrome.runtime.sendMessage({
        type: 'FETCH_COMMENTS',
        videoId: videoId
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch comments');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }
};

window.commentUtils = commentUtils;