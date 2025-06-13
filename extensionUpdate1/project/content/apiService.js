// Handles all API communication
const apiService = {
  async generateContent(videoLink, choice) {
    try {
      console.log('Generating content for video:', videoLink);
      
      // Extract video ID and fetch captions
      const videoId = window.captionsUtils.extractVideoId(videoLink);
      console.log('Extracted video ID:', videoId);

      if (!videoId) {
        console.error('Failed to extract video ID from link:', videoLink);
        throw new Error('Invalid video URL');
      }

      const captions = await window.captionsUtils.fetchYoutubeCaptions(videoId);
      console.log('Fetched captions:', captions);

      // Prepare the captions data
      const captionsText = captions
        .map(caption => caption.text)
        .join(' ');

      console.log('Prepared captions text:', captionsText.substring(0, 100) + '...');

      const response = await chrome.runtime.sendMessage({
        type: 'GENERATE_CONTENT',
        data: { 
          prompt: videoLink, 
          choice,
          cc: captionsText
        },
      });

      console.log('Received response from backend:', response);
      return response;
    } catch (error) {
      console.error('Error in generateContent:', error);
      return { success: false, error: error.message };
    }
  },

  async enhanceContent(text, contentType, userPrompt) {
    const response = await chrome.runtime.sendMessage({
      type: 'ENHANCE_CONTENT',
      data: { text, contentType, userPrompt },
    });
    return response;
  }
};

window.apiService = apiService;