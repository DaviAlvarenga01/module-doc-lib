/**
 * ModelController.test.ts
 * 
 * Unit tests for ModelController - Essential operations only
 */

import { describe, it, expect } from 'vitest';
import { ModelController } from '../../../src/controllers/ModelController';
import { DomainModel } from '../../../src/models/DomainModel';
import type { Model } from '../../../src/types';

describe('ModelController', () => {
  
  it('deve criar modelo com opções básicas', () => {
    const model = ModelController.createModel({
      name: 'TestModel',
      version: '1.0.0'
    });
    
    expect(model).toBeInstanceOf(DomainModel);
  });

  it('deve importar modelo do AST', () => {
    const mockAST: Partial<Model> = {
      $type: 'Model',
      name: 'TestModel',
      version: '1.0.0',
      modules: []
    };
    
    const model = ModelController.importModel(mockAST as Model);
    expect(model).toBeInstanceOf(DomainModel);
  });

  it('deve analisar dependências do modelo', () => {
    const model = ModelController.createModel({
      name: 'TestModel',
      version: '1.0.0'
    });
    
    const dependencies = ModelController.analyzeDependencies(model);
    expect(Array.isArray(dependencies)).toBe(true);
  });

  it('deve obter estatísticas do modelo', () => {
    const model = ModelController.createModel({
      name: 'TestModel',
      version: '1.0.0'
    });
    
    const stats = ModelController.getStatistics(model);
    expect(stats).toHaveProperty('totalModules');
    expect(stats).toHaveProperty('totalEntities');
  });

  it('deve obter ordem topológica dos módulos', () => {
    const model = ModelController.createModel({
      name: 'TestModel',
      version: '1.0.0'
    });
    
    const order = ModelController.getTopologicalOrder(model);
    expect(Array.isArray(order)).toBe(true);
  });

  it('deve validar modelo', () => {
    const model = ModelController.createModel({
      name: 'TestModel',
      version: '1.0.0'
    });
    
    const errors = ModelController.validate(model);
    expect(Array.isArray(errors)).toBe(true);
  });

  it('deve exportar modelo para JSON', () => {
    const model = ModelController.createModel({
      name: 'TestModel',
      version: '1.0.0'
    });
    
    const json = ModelController.exportToJSON(model);
    expect(json).toBeDefined();
    expect(typeof json).toBe('object');
  });

  it('deve clonar modelo', () => {
    const model = ModelController.createModel({
      name: 'TestModel',
      version: '1.0.0'
    });
    
    const cloned = ModelController.cloneModel(model);
    expect(cloned).toBeInstanceOf(DomainModel);
    expect(cloned).not.toBe(model);
  });
});
