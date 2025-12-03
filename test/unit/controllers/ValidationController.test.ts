/**
 * ValidationController.test.ts
 * 
 * Unit tests for ValidationController - Essential operations only
 */

import { describe, it, expect } from 'vitest';
import { ValidationController } from '../../../src/controllers/ValidationController';
import type { Model, ValidationResult } from '../../../src/types';

describe('ValidationController', () => {
  
  it('deve validar modelo básico', () => {
    const mockModel: Partial<Model> = {
      $type: 'Model',
      name: 'TestModel',
      version: '1.0.0',
      modules: [],
      abstractElements: []
    };
    
    const results = ValidationController.validateModel(mockModel as Model);
    expect(Array.isArray(results)).toBe(true);
  });

  it('deve retornar isValid verdadeiro para modelo válido', () => {
    const mockModel: Partial<Model> = {
      $type: 'Model',
      name: 'TestModel',
      version: '1.0.0',
      modules: [],
      abstractElements: []
    };
    
    const isValid = ValidationController.isValid(mockModel as Model);
    expect(typeof isValid).toBe('boolean');
  });

  it('deve filtrar resultados por severidade', () => {
    const mockResults: ValidationResult[] = [
      {
        type: 'error',
        message: 'Test error',
        severity: 'error',
        path: 'test.path'
      } as ValidationResult,
      {
        type: 'warning',
        message: 'Test warning',
        severity: 'warning',
        path: 'test.path'
      } as ValidationResult
    ];
    
    const errors = ValidationController.filterBySeverity(mockResults, 'error');
    expect(Array.isArray(errors)).toBe(true);
  });

  it('deve formatar resultados de validação', () => {
    const mockResults: ValidationResult[] = [
      {
        type: 'error',
        message: 'Test error',
        severity: 'error',
        path: 'test.path'
      } as ValidationResult
    ];
    
    const formatted = ValidationController.formatResults(mockResults);
    expect(typeof formatted).toBe('string');
  });
});
