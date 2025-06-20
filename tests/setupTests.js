// Import jest-dom extensions
require('@testing-library/jest-dom');

// Mock functions that are not available in jsdom
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// Mock SVG elements
SVGElement.prototype.getBBox = function() {
  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
};

// Mock animation functions
window.requestAnimationFrame = function(callback) {
  return setTimeout(callback, 0);
};

window.cancelAnimationFrame = function(id) {
  clearTimeout(id);
};

// Set up a mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    removeItem: function(key) {
      delete store[key];
    },
    clear: function() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});
