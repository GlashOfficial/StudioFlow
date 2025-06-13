function createButton(text, onClickHandler) {
  const button = domUtils.createElement('button', 'button');
  
  // Store original text for later use
  button.dataset.originalContent = text;
  
  button.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M5 12h14"></path>
      <path d="M12 5v14"></path>
    </svg>
    <span>${text}</span>
  `;
  
  button.addEventListener('click', onClickHandler);
  return button;
}

function createButtonContainer() {
  return domUtils.createElement('div', 'container');
}

function showSuccessMessage(button, message, isError = false) {
  const container = button.closest('.container');
  if (!container) return;
  
  const existingMessage = container.querySelector('.success-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  const messageDiv = domUtils.createElement('div', `success-message ${isError ? 'error' : 'success'}`, message);
  container.appendChild(messageDiv);
  setTimeout(() => messageDiv.remove(), 3000);
}

function setButtonLoading(button, isLoading) {
  if (!button) return;
  
  if (isLoading) {
    button.classList.add('loading');
    const svg = button.querySelector('svg');
    if (svg) {
      svg.style.opacity = '0';
    }
    button.style.pointerEvents = 'none';
  } else {
    button.classList.remove('loading');
    const svg = button.querySelector('svg');
    if (svg) {
      svg.style.opacity = '1';
    }
    button.style.pointerEvents = 'auto';
  }
}

window.uiControls = {
  createButton,
  createButtonContainer,
  showSuccessMessage,
  setButtonLoading,
};