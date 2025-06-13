// Animation utility functions for comment summarizer
const animationUtils = {
  showLoadingAnimation(element) {
    if (!element) return;
    element.innerHTML = '<div class="loading-dots"><span>.</span><span>.</span><span>.</span></div>';
  },

  async animateText(element, text) {
    if (!element || !text) return;
    
    element.innerHTML = '';
    
    // Handle both string and object responses
    const content = typeof text === 'string' ? text : text.summary || '';
    if (!content) return;

    const words = content.split(' ');
    let currentIndex = 0;

    const animate = () => {
      if (currentIndex < words.length) {
        element.innerHTML += (currentIndex > 0 ? ' ' : '') + words[currentIndex];
        currentIndex++;
        requestAnimationFrame(() => {
          element.scrollTop = element.scrollHeight;
          setTimeout(animate, 50);
        });
      }
    };

    animate();
  }
};

window.commentSummarizerAnimationUtils = animationUtils;