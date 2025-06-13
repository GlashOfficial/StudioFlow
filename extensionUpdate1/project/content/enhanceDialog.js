// Handles the enhancement dialog UI
const enhanceDialog = {
  createDialog(contentType, currentContent, onEnhance) {
    // Remove any existing dialogs
    this.removeExistingDialog();

    const backdrop = domUtils.createElement('div', 'dialog-backdrop');
    const dialog = domUtils.createElement('div', 'enhance-dialog');
    const buttonRect = event.target.getBoundingClientRect();
    
    dialog.innerHTML = `
      <div class="dialog-content">
        <h3>Enhance ${contentType}</h3>
        ${contentType === 'Description' ? `
          <div class="keep-existing-checkbox">
            <input type="checkbox" id="keepExisting" checked>
            <label for="keepExisting">Keep existing content and append new content</label>
          </div>
        ` : ''}
        <textarea class="prompt-input" placeholder="Enter your enhancement instructions..."></textarea>
        <div class="dialog-buttons">
          <button class="cancel-button">Cancel</button>
          <button class="enhance-button">Enhance</button>
        </div>
      </div>
    `;

    const promptInput = dialog.querySelector('.prompt-input');
    const enhanceButton = dialog.querySelector('.enhance-button');
    const cancelButton = dialog.querySelector('.cancel-button');
    const keepExisting = dialog.querySelector('#keepExisting');

    const closeDialog = () => {
      dialog.classList.remove('show');
      backdrop.classList.remove('show');
      setTimeout(() => {
        dialog.remove();
        backdrop.remove();
      }, 300);
    };

    enhanceButton.addEventListener('click', () => {
      const userPrompt = promptInput.value.trim();
      if (!userPrompt) {
        toastManager.show('Please enter enhancement instructions', 'error');
        return;
      }
      onEnhance(userPrompt, keepExisting?.checked);
      closeDialog();
    });

    cancelButton.addEventListener('click', closeDialog);
    backdrop.addEventListener('click', closeDialog);

    // Position dialog near the button
    dialog.style.position = 'fixed';
    dialog.style.top = `${buttonRect.top}px`;
    dialog.style.left = `${buttonRect.left}px`;

    document.body.appendChild(backdrop);
    document.body.appendChild(dialog);

    // Trigger animations
    requestAnimationFrame(() => {
      backdrop.classList.add('show');
      dialog.classList.add('show');
    });

    promptInput.focus();
  },

  removeExistingDialog() {
    const existingDialog = document.querySelector('.enhance-dialog');
    const existingBackdrop = document.querySelector('.dialog-backdrop');
    
    if (existingDialog) {
      existingDialog.remove();
    }
    if (existingBackdrop) {
      existingBackdrop.remove();
    }
  }
};

window.enhanceDialog = enhanceDialog;