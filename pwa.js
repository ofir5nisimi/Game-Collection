// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

// Improve touch interactions for mobile devices
document.addEventListener('DOMContentLoaded', () => {
  // Add active state to buttons for better touch feedback
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('touchstart', () => {
      button.classList.add('touch-active');
    });
    
    button.addEventListener('touchend', () => {
      button.classList.remove('touch-active');
    });
  });
  
  // Add touch-specific styles to game cards for better mobile interaction
  const gameCards = document.querySelectorAll('.game-card');
  gameCards.forEach(card => {
    card.addEventListener('touchstart', () => {
      card.classList.add('touch-highlight');
    });
    
    card.addEventListener('touchend', () => {
      card.classList.remove('touch-highlight');
    });
  });
});
