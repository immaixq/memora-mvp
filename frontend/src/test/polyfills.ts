// Polyfills for webidl-conversions compatibility
// This must run before any other imports to prevent errors

// Polyfill ArrayBuffer.prototype.resizable and related properties
if (typeof ArrayBuffer !== 'undefined') {
  const arrayBufferProto = ArrayBuffer.prototype;
  
  // Only add if not already present
  if (!Object.hasOwnProperty.call(arrayBufferProto, 'resizable')) {
    Object.defineProperty(arrayBufferProto, 'resizable', {
      get: function() { return false; },
      configurable: true,
      enumerable: false
    });
  }
  
  if (!Object.hasOwnProperty.call(arrayBufferProto, 'maxByteLength')) {
    Object.defineProperty(arrayBufferProto, 'maxByteLength', {
      get: function() { return this.byteLength; },
      configurable: true,
      enumerable: false
    });
  }
  
  if (!Object.hasOwnProperty.call(arrayBufferProto, 'resize')) {
    Object.defineProperty(arrayBufferProto, 'resize', {
      value: function() { throw new TypeError('ArrayBuffer is not resizable'); },
      configurable: true,
      enumerable: false
    });
  }
}

// Polyfill SharedArrayBuffer.prototype.growable and related properties
if (typeof SharedArrayBuffer !== 'undefined') {
  const sharedArrayBufferProto = SharedArrayBuffer.prototype;
  
  if (!Object.hasOwnProperty.call(sharedArrayBufferProto, 'growable')) {
    Object.defineProperty(sharedArrayBufferProto, 'growable', {
      get: function() { return false; },
      configurable: true,
      enumerable: false
    });
  }
  
  if (!Object.hasOwnProperty.call(sharedArrayBufferProto, 'maxByteLength')) {
    Object.defineProperty(sharedArrayBufferProto, 'maxByteLength', {
      get: function() { return this.byteLength; },
      configurable: true,
      enumerable: false
    });
  }
  
  if (!Object.hasOwnProperty.call(sharedArrayBufferProto, 'grow')) {
    Object.defineProperty(sharedArrayBufferProto, 'grow', {
      value: function() { throw new TypeError('SharedArrayBuffer is not growable'); },
      configurable: true,
      enumerable: false
    });
  }
}

// Additional Web API polyfills for jsdom environment
if (typeof global !== 'undefined') {
  // Ensure URL and URLSearchParams are available
  if (typeof global.URL === 'undefined') {
    global.URL = class URL {
      constructor(url: string, base?: string) {
        // Basic URL implementation for testing
        this.href = url;
        this.origin = '';
        this.protocol = '';
        this.host = '';
        this.hostname = '';
        this.port = '';
        this.pathname = '';
        this.search = '';
        this.hash = '';
      }
      href: string;
      origin: string;
      protocol: string;
      host: string;
      hostname: string;
      port: string;
      pathname: string;
      search: string;
      hash: string;
      toString() { return this.href; }
    };
  }
  
  if (typeof global.URLSearchParams === 'undefined') {
    global.URLSearchParams = class URLSearchParams {
      constructor(init?: string | string[][] | Record<string, string>) {
        // Basic URLSearchParams implementation for testing
      }
      append() {}
      delete() {}
      get() { return null; }
      getAll() { return []; }
      has() { return false; }
      set() {}
      toString() { return ''; }
    };
  }
}