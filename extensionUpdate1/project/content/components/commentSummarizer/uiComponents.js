// UI components for comment summarizer
const uiComponents = {
  createSummarizeButton() {
    const button = domUtils.createElement('a', 'summarize-button');
    button.innerHTML = `
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
        <path fill="currentColor" d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"/>
      </svg>
      <span>Summarize Comments</span>
    `;
    return button;
  },

  createSummaryBox() {
    const summaryBox = domUtils.createElement('div', 'summary-box');
    summaryBox.innerHTML = `
      <div class="summary-header">
        <h3>Comment Summary</h3>
        <button class="close-summary">×</button>
      </div>
      <div class="summary-content"></div>
    `;
    return summaryBox;
  },

  createOrGetSummaryBox() {
    let summaryBox = document.querySelector('.summary-box');
    
    if (!summaryBox) {
      summaryBox = this.createSummaryBox();
      const closeButton = summaryBox.querySelector('.close-summary');
      closeButton.addEventListener('click', () => {
        summaryBox.style.display = 'none';
      });

      const filterBar = domUtils.querySelector('ytcp-filter-bar');
      if (filterBar) {
        filterBar.parentNode.insertBefore(summaryBox, filterBar.nextSibling);
      }
    }

    return summaryBox;
  }
};

window.commentSummarizerUiComponents = uiComponents;