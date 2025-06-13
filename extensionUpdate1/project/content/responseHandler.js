// Handles server responses and input field updates
const responseHandler = {
  async updateTitleField(content) {
    const titleInput = domUtils.querySelector(domUtils.SELECTORS.TITLE_INPUT);
    if (titleInput) {
      titleInput.textContent = content;
      this.triggerInputEvents(titleInput);
      return true;
    }
    return false;
  },

  async updateDescriptionField(content, keepExisting = false) {
    const descInput = domUtils.querySelector(domUtils.SELECTORS.DESCRIPTION_INPUT);
    if (descInput) {
      if (keepExisting) {
        const existingContent = descInput.textContent;
        descInput.textContent = existingContent + '\n\n' + content;
      } else {
        descInput.textContent = content;
      }
      this.triggerInputEvents(descInput);
      return true;
    }
    return false;
  },

  async updateTagsField(tags) {
    const tagsInput = domUtils.querySelector(domUtils.SELECTORS.TAGS_INPUT);
    if (tagsInput) {
      if (typeof tags === 'string') {
        // First, clear any existing value
   
        tagsInput.value = '';
      
        this.triggerInputEvents(tagsInput);

        // Get all tags as a single string
        const tagList = tags.split(',')
          .map(tag => tag.trim())
          .filter(tag => tag);

        // Set the full tag string and trigger input event
        tagsInput.value = tagList.join(', ');
        this.triggerInputEvents(tagsInput);

        // Simulate Enter key press to submit all tags at once
        tagsInput.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true
        }));

        return true;
      } else {
        console.error('Invalid tags format received:', tags);
        return false;
      }
    }
    return false;
  },

  triggerInputEvents(element) {
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }
};

window.responseHandler = responseHandler;