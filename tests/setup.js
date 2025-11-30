import { beforeEach, afterEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = String(value);
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

global.localStorage = localStorageMock;

// Mock performance.now()
global.performance = {
  now: vi.fn(() => Date.now())
};

// Reset mocks before each test
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

// Cleanup after each test
afterEach(() => {
  vi.restoreAllMocks();
});
