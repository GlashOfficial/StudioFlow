function injectStylesheet(filePath) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL(filePath);
    document.head.appendChild(link);
  }
  
  injectStylesheet('styles.css');
  