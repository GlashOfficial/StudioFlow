// DOM utility functions
const SELECTORS = {
  TITLE_INPUT: '#textbox.style-scope.ytcp-social-suggestions-textbox',
  DESCRIPTION_INPUT: '#description-textarea #textbox.style-scope.ytcp-social-suggestions-textbox',
  VIDEO_LINK: '.video-url-fadeable.style-scope.ytcp-video-info a',
  TAGS_DIV: '.style-scope.ytcp-video-metadata-editor', 
  TAGS_INPUT: '#text-input.style-scope.ytcp-chip-bar',
  SHOW_MORE_BUTTON: '.ytcp-button-shape-impl[aria-label="Show more"]',
  SHOW_LESS_BUTTON: '.ytcp-button-shape-impl[aria-label="Show less"]'
};

function querySelector(selector) {
  return document.querySelector(selector);
}

function querySelectorAll(selector) {
  return document.querySelectorAll(selector);
}

function createElement(tag, className, innerHTML = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.innerHTML = innerHTML;
  return element;
}

function getVideoLink() {
  const linkElement = querySelector(SELECTORS.VIDEO_LINK);
  console.log('Found video link element:', linkElement);
  const href = linkElement ? linkElement.href : null;
  console.log('Extracted video URL:', href);
  return href;
}

window.domUtils = {
  SELECTORS,
  querySelector,
  querySelectorAll,
  createElement,
  getVideoLink,
};