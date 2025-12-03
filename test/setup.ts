/**
 * Global setup for Vitest
 * 
 * This file is executed before all test files.
 * Use it for global test configuration and setup.
 */

import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

// Global test timeout (10 seconds)
beforeAll(() => {
  // Setup that runs once before all tests
});

afterAll(() => {
  // Cleanup that runs once after all tests
});

beforeEach(() => {
  // Setup that runs before each test
});

afterEach(() => {
  // Cleanup that runs after each test
});

// Extend Vitest matchers if needed
declare module 'vitest' {
  interface Assertion<T = any> {
    // Add custom matchers here if needed
    // toBeValidModel(): void;
  }
}
