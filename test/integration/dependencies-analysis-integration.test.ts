/**
 * dependencies-analysis-integration.test.ts
 * 
 * Integration tests: Dependencies + Topological Order
 */

import { describe, it, expect } from 'vitest';
import { ModelController } from '../../src/controllers/ModelController';
import { ValidationController } from '../../src/controllers/ValidationController';
import type { LocalEntity } from '../../src/types';

describe('Integration: Dependencies Analysis', () => {
  
  it('deve analisar dependências entre módulos', () => {
    const model = ModelController.createModel({
      name: 'System',
      version: '1.0.0'
    });
    
    model.addModule({ name: 'Core' });
    model.addModule({ name: 'Extensions' });
    
    const deps = ModelController.analyzeDependencies(model);
    
    expect(Array.isArray(deps)).toBe(true);
  });

  it('deve obter ordem topológica dos módulos', () => {
    const model = ModelController.createModel({
      name: 'System',
      version: '1.0.0'
    });
    
    model.addModule({ name: 'Module1' });
    model.addModule({ name: 'Module2' });
    model.addModule({ name: 'Module3' });
    
    const order = ModelController.getTopologicalOrder(model);
    
    expect(Array.isArray(order)).toBe(true);
    expect(order.length).toBeGreaterThanOrEqual(3);
  });

  it('deve combinar análise de dependências com estatísticas', () => {
    const model = ModelController.createModel({
      name: 'ComplexSystem',
      version: '1.0.0'
    });
    
    const mod1 = model.addModule({ name: 'Core' });
    const mod2 = model.addModule({ name: 'Utils' });
    
    const entity1: LocalEntity = {
      $type: 'LocalEntity',
      $container: mod1,
      name: 'Entity1',
      attributes: [],
      relations: [],
      functions: [],
      is_abstract: false,
      metadata: {
        description: '',
        tags: [],
        requirements: [],
        author: 'Test',
        createdAt: new Date(),
        modifiedAt: new Date()
      }
    };
    mod1.elements.push(entity1);

    const entity2: LocalEntity = {
      $type: 'LocalEntity',
      $container: mod2,
      name: 'Entity2',
      attributes: [],
      relations: [],
      functions: [],
      is_abstract: false,
      metadata: {
        description: '',
        tags: [],
        requirements: [],
        author: 'Test',
        createdAt: new Date(),
        modifiedAt: new Date()
      }
    };
    mod2.elements.push(entity2);
    
    const deps = ModelController.analyzeDependencies(model);
    const stats = ModelController.getStatistics(model);
    
    expect(deps).toBeDefined();
    expect(stats).toBeDefined();
    expect(stats.totalModules).toBe(2);
    expect(stats.totalEntities).toBeGreaterThanOrEqual(2);
  });
});
