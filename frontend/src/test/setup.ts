import '@testing-library/jest-dom';

// Mock Firebase
global.matchMedia = global.matchMedia || function (query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: function () {},
    removeListener: function () {},
    addEventListener: function () {},
    removeEventListener: function () {},
    dispatchEvent: function () {},
  };
};

// Mock IntersectionObserver
global.IntersectionObserver = global.IntersectionObserver || class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Polyfill for ArrayBuffer.prototype.resizable and SharedArrayBuffer.prototype.growable
// These are newer features that might not be available in jsdom environment
if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.prototype) {
  if (!Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'resizable')) {
    Object.defineProperty(ArrayBuffer.prototype, 'resizable', {
      get: function() { return false; },
      configurable: true,
      enumerable: true
    });
  }
}

if (typeof SharedArrayBuffer !== 'undefined' && SharedArrayBuffer.prototype) {
  if (!Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, 'growable')) {
    Object.defineProperty(SharedArrayBuffer.prototype, 'growable', {
      get: function() { return false; },
      configurable: true,
      enumerable: true
    });
  }
}