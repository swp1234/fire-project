// __APP_TITLE__ - Main Application
(function() {
  'use strict';

  // Hide app loader
  window.addEventListener('load', () => {
    const loader = document.getElementById('app-loader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 500);
    }
  });

  // Safety timeout for loader
  setTimeout(() => {
    const loader = document.getElementById('app-loader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 500);
    }
  }, 5000);

  // App logic here

})();
