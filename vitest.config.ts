/**
 * Vitest Configuration
 * 
 * Test configuration following ISO/IEC 25010 quality standards.
 * Ensures comprehensive test coverage and maintainability.
 * 
 * @see https://vitest.dev/config/
 */

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Test environment
    environment: 'node',
    
    // Global test setup
    globals: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts', // Barrel exports
      ],
      // Target minimum 80% coverage (ISO/IEC 25010 - reliability)
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    } as any,
    
    // Test file patterns
    include: ['tests/*.test.ts'],
    exclude: [
      'node_modules/', 
      'dist/', 
      'tests/helpers/', 
      'tests/generated-modules/',
      'tests/generated-modules-content-validation/',
      'tests/integration-output/',
    ],
    
    // Test execution
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Reporter
    reporters: ['verbose'],
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
