// Main comment summarizer component
const commentSummarizerModule = {
  async handleSummarization(button) {
    try {
      if (!button) {
        toastManager.show('Internal error: Button not found', 'error');
        return;
      }

      uiControls.setButtonLoading(button, true);
   
      const videoId = window.navigationUtils.extractVideoIdFromUrl();
      if (!videoId) {
        toastManager.show('Could not find video ID', 'error');
        return;
      }

      const comments = await window.commentUtils.fetchComments(videoId);
      if (!comments || !comments.length) {
        toastManager.show('No comments found', 'error');
        return;
      }

      const summaryBox = window.commentSummarizerUiComponents.createOrGetSummaryBox();
      summaryBox.style.display = 'block';
      
      const contentElement = summaryBox.querySelector('.summary-content');
      window.commentSummarizerAnimationUtils.showLoadingAnimation(contentElement);

   
      const response = await chrome.runtime.sendMessage({
        type: 'SUMMARIZE_COMMENTS',
        data: { comments }
      });
    
      // Explicit response checking
      if (response === undefined) {
        console.error('No response received from background script');
        console.error('Possible issues:');
        console.error('1. Background script not running');
        console.error('2. Message listener not set up');
        console.error('3. sendResponse not called');
        throw new Error('No response from background script');
      }
      

      const rawData = window.commentSummarizerResponseHandler.validateResponse(response);
      const processedData = window.commentSummarizerResponseHandler.processResponseData(rawData);
    
      // Animate the processed text
      await window.commentSummarizerAnimationUtils.animateText(contentElement, processedData);
      toastManager.show('Comments summarized successfully!', 'success');
    } catch (error) {
      console.error('Error processing response:', error);
      contentElement.innerHTML = `Error: ${error.message}`;
      toastManager.show('Error processing summary', 'error');
    } finally {
      uiControls.setButtonLoading(button, false);
    }
  },

  injectSummarizeButton() {
    const filterBar = domUtils.querySelector('ytcp-filter-bar');
    if (!filterBar) return;

    const existingButton = filterBar.querySelector('.summarize-button');
    if (existingButton) {
      existingButton.remove();
    }

    const button = window.commentSummarizerUiComponents.createSummarizeButton();
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      await this.handleSummarization(button);
    });
    
    filterBar.appendChild(button);
  }
};

// Export the module
window.commentSummarizer = commentSummarizerModule;