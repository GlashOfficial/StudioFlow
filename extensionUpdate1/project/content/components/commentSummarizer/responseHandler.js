// Response handler for comment summarizer
const commentSummarizerResponseHandler = {
  validateResponse(response) {
    if (!response) {
      throw new Error('No response received from server');
    }

    if (!response.success) {
      throw new Error(response.error || 'Server returned an error');
    }

    if (!response.data) {
      throw new Error('No data received in response');
    }

    return response.data;
  },

  processResponseData(data) {
    // Handle different response formats
    if (typeof data === 'string') {
      return data.trim();
    }
    
    if (typeof data === 'object') {
      if (data.summary) {
        return data.summary.trim();
      }
      if (data.result) {
        return data.result.trim();
      }
    }

    throw new Error('Invalid response data format');
  }
};

window.commentSummarizerResponseHandler = commentSummarizerResponseHandler;