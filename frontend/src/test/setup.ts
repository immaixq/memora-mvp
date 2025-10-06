// Polyfill for ArrayBuffer.prototype.resizable and SharedArrayBuffer.prototype.growable
// Must be first to prevent webidl-conversions errors
if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.prototype) {
  if (!Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'resizable')) {
    Object.defineProperty(ArrayBuffer.prototype, 'resizable', {
      get: function() { return false; },
      configurable: true,
      enumerable: false
    });
  }
  if (!Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'maxByteLength')) {
    Object.defineProperty(ArrayBuffer.prototype, 'maxByteLength', {
      get: function() { return this.byteLength; },
      configurable: true,
      enumerable: false
    });
  }
}

if (typeof SharedArrayBuffer !== 'undefined' && SharedArrayBuffer.prototype) {
  if (!Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, 'growable')) {
    Object.defineProperty(SharedArrayBuffer.prototype, 'growable', {
      get: function() { return false; },
      configurable: true,
      enumerable: false
    });
  }
  if (!Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, 'maxByteLength')) {
    Object.defineProperty(SharedArrayBuffer.prototype, 'maxByteLength', {
      get: function() { return this.byteLength; },
      configurable: true,
      enumerable: false
    });
  }
}

import '@testing-library/jest-dom';

// Mock essential browser APIs
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

global.IntersectionObserver = global.IntersectionObserver || class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};