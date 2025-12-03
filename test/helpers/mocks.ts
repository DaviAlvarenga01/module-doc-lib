/**
 * Test Helpers: Mocks
 * 
 * Mock objects and spy functions for testing.
 */

import { vi } from 'vitest';
import {
  Domain,
  Module,
  Entity,
  ValidationError,
  SEVERITY
} from '../../src/types';

/**
 * Creates a mock ValidationController
 */
export function createMockValidationController() {
  return {
    validateModel: vi.fn().mockReturnValue([]),
    validateModule: vi.fn().mockReturnValue([]),
    validateEntity: vi.fn().mockReturnValue([]),
    validateAttribute: vi.fn().mockReturnValue([]),
    validateRelation: vi.fn().mockReturnValue([]),
    validateInheritance: vi.fn().mockReturnValue([]),
    isValid: vi.fn().mockReturnValue(true),
    filterBySeverity: vi.fn((errors: ValidationError[]) => errors),
    formatResults: vi.fn((errors: ValidationError[]) => 
      errors.map(e => `[${e.severity}] ${e.code}: ${e.message}`).join('\n')
    )
  };
}

/**
 * Creates a mock ModelController
 */
export function createMockModelController() {
  return {
    createModel: vi.fn(),
    importModel: vi.fn(),
    exportModel: vi.fn(),
    findEntity: vi.fn(),
    findModule: vi.fn(),
    analyzeDependencies: vi.fn().mockReturnValue([]),
    getTopologicalOrder: vi.fn().mockReturnValue([]),
    getStatistics: vi.fn().mockReturnValue({
      moduleCount: 0,
      entityCount: 0,
      enumCount: 0,
      attributeCount: 0,
      relationCount: 0
    }),
    getModuleStatistics: vi.fn(),
    getEntityStatistics: vi.fn()
  };
}

/**
 * Creates a mock JSONView
 */
export function createMockJSONView() {
  return {
    serialize: vi.fn((domain: Domain) => JSON.stringify(domain)),
    deserialize: vi.fn((json: string) => JSON.parse(json)),
    diff: vi.fn().mockReturnValue([]),
    validate: vi.fn().mockReturnValue(true)
  };
}

/**
 * Creates a mock MarkdownView
 */
export function createMockMarkdownView() {
  return {
    generate: vi.fn().mockReturnValue('# Test Documentation'),
    generateModuleDocByName: vi.fn().mockReturnValue('## Module Documentation'),
    generateEntityDocByName: vi.fn().mockReturnValue('### Entity Documentation')
  };
}

/**
 * Creates mock validation errors for testing
 */
export function createMockValidationErrors(count: number = 3): ValidationError[] {
  return Array.from({ length: count }, (_, i) => ({
    code: `TEST_ERROR_${i}`,
    message: `Test error message ${i}`,
    severity: i === 0 ? SEVERITY.ERROR : i === 1 ? SEVERITY.WARNING : SEVERITY.INFO,
    path: `#/modules/TestModule/entities/TestEntity${i}`
  }));
}

/**
 * Creates a spy for console methods
 */
export function createConsoleSpy() {
  return {
    log: vi.spyOn(console, 'log').mockImplementation(() => {}),
    warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
    error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    restore: () => {
      vi.restoreAllMocks();
    }
  };
}

/**
 * Creates a mock file system for testing
 */
export function createMockFileSystem() {
  const files = new Map<string, string>();
  
  return {
    readFile: vi.fn((path: string) => {
      const content = files.get(path);
      if (!content) throw new Error(`File not found: ${path}`);
      return Promise.resolve(content);
    }),
    writeFile: vi.fn((path: string, content: string) => {
      files.set(path, content);
      return Promise.resolve();
    }),
    exists: vi.fn((path: string) => {
      return Promise.resolve(files.has(path));
    }),
    deleteFile: vi.fn((path: string) => {
      files.delete(path);
      return Promise.resolve();
    }),
    clear: () => {
      files.clear();
    },
    getFiles: () => {
      return Array.from(files.keys());
    }
  };
}

/**
 * Creates a mock logger for testing
 */
export function createMockLogger() {
  const logs: string[] = [];
  
  return {
    info: vi.fn((message: string) => logs.push(`[INFO] ${message}`)),
    warn: vi.fn((message: string) => logs.push(`[WARN] ${message}`)),
    error: vi.fn((message: string) => logs.push(`[ERROR] ${message}`)),
    debug: vi.fn((message: string) => logs.push(`[DEBUG] ${message}`)),
    getLogs: () => [...logs],
    clear: () => logs.length = 0
  };
}

/**
 * Creates a mock timer for testing time-dependent code
 */
export function createMockTimer() {
  vi.useFakeTimers();
  
  return {
    advance: (ms: number) => vi.advanceTimersByTime(ms),
    advanceToNextTimer: () => vi.advanceTimersToNextTimer(),
    runAll: () => vi.runAllTimers(),
    restore: () => vi.useRealTimers()
  };
}

/**
 * Creates a mock DOM for testing (if needed for browser environments)
 */
export function createMockDOM() {
  const elements = new Map<string, any>();
  
  return {
    createElement: vi.fn((tag: string) => {
      const element = {
        tagName: tag,
        innerHTML: '',
        textContent: '',
        classList: {
          add: vi.fn(),
          remove: vi.fn(),
          contains: vi.fn()
        },
        setAttribute: vi.fn(),
        getAttribute: vi.fn(),
        appendChild: vi.fn()
      };
      return element;
    }),
    getElementById: vi.fn((id: string) => elements.get(id)),
    querySelector: vi.fn((selector: string) => elements.get(selector)),
    clear: () => elements.clear()
  };
}

/**
 * Utility to create a spy that tracks call history
 */
export function createSpyWithHistory<T extends (...args: any[]) => any>(
  implementation?: T
) {
  const calls: any[][] = [];
  const spy = vi.fn((...args: any[]) => {
    calls.push(args);
    return implementation?.(...args);
  });
  
  return {
    spy,
    getCalls: () => [...calls],
    getCallCount: () => calls.length,
    getLastCall: () => calls[calls.length - 1],
    clear: () => {
      calls.length = 0;
      spy.mockClear();
    }
  };
}

/**
 * Utility to create a mock promise that can be resolved/rejected manually
 */
export function createControlledPromise<T>() {
  let resolve: (value: T) => void;
  let reject: (error: any) => void;
  
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  
  return {
    promise,
    resolve: (value: T) => resolve(value),
    reject: (error: any) => reject(error)
  };
}

/**
 * Utility to wait for a condition to be true (useful for async tests)
 */
export async function waitFor(
  condition: () => boolean,
  timeout: number = 1000,
  interval: number = 50
): Promise<void> {
  const startTime = Date.now();
  
  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for condition');
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
}

/**
 * Utility to create a mock async iterator
 */
export function createMockAsyncIterator<T>(items: T[]) {
  let index = 0;
  
  return {
    [Symbol.asyncIterator]() {
      return {
        async next() {
          if (index < items.length) {
            return { value: items[index++], done: false };
          }
          return { value: undefined, done: true };
        }
      };
    }
  };
}
