/**
 * Shared Map Utilities
 * 
 * This module contains only truly shared utilities used by both
 * city maps and media maps.
 */

const MapUtils = {
  /**
   * Debounce function for performance optimization
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Handle errors gracefully with user-friendly messages
   */
  handleError(error, context = '') {
    console.error(`Error ${context}:`, error);
    
    const userMessage = this.getErrorMessage(error);
    this.showNotification(userMessage, 'error');
    
    return userMessage;
  },

  /**
   * Get user-friendly error message
   */
  getErrorMessage(error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return 'Netzwerkfehler: Daten konnten nicht geladen werden.';
    }
    
    if (error.status === 404) {
      return 'Die angeforderten Daten wurden nicht gefunden.';
    }
    
    if (error.status >= 500) {
      return 'Serverfehler: Bitte versuchen Sie es später erneut.';
    }
    
    return 'Ein unerwarteter Fehler ist aufgetreten.';
  },

  /**
   * Show notification to user
   */
  showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('notification--visible'), 100);
    
    // Auto remove
    setTimeout(() => {
      notification.classList.remove('notification--visible');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);
    
    return notification;
  },

  /**
   * Initialize responsive behavior
   */
  initResponsive(map) {
    const updateMapSize = this.debounce(() => {
      if (map) {
        map.invalidateSize();
      }
    }, 250);
    
    window.addEventListener('resize', updateMapSize);
    
    return () => {
      window.removeEventListener('resize', updateMapSize);
    };
  },

  /**
   * Handle external map control events
   */
  setupExternalEvents(map) {
    document.addEventListener('changeMapViewEvent', (event) => {
      const { coordinates, zoom } = event.detail;
      if (coordinates && zoom && map) {
        map.setView(coordinates, zoom);
      }
    });
  }
};

// Export utilities
window.MapUtils = MapUtils;
