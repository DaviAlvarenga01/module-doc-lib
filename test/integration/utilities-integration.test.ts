/**
 * utilities-integration.test.ts
 * 
 * Integration tests: Utils working together
 */

import { describe, it, expect } from 'vitest';
import { ModelController } from '../../src/controllers/ModelController';
import { isModule, isLocalEntity } from '../../src/utils/TypeGuards';
import { toPascalCase, toCamelCase } from '../../src/utils/StringUtils';
import type { LocalEntity } from '../../src/types';

describe('Integration: Utilities', () => {
  
  it('deve usar TypeGuards para filtrar elementos', () => {
    const model = ModelController.createModel({
      name: 'System',
      version: '1.0.0'
    });
    
    const mod = model.addModule({ name: 'Core' });
    
    const entity: LocalEntity = {
      $type: 'LocalEntity',
      $container: mod,
      name: 'User',
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
    mod.elements.push(entity);
    
    const modelAST = model.getModel();
    const modules = modelAST.abstractElements.filter(isModule);
    
    expect(modules.length).toBeGreaterThan(0);
  });

  it('deve aplicar transformações de string consistentemente', () => {
    const inputs = ['user_account', 'UserAccount', 'userAccount'];
    
    const pascalResults = inputs.map(toPascalCase);
    const camelResults = inputs.map(toCamelCase);
    
    // Todos devem convergir para o mesmo resultado
    expect(new Set(pascalResults).size).toBe(1);
    expect(new Set(camelResults).size).toBe(1);
  });

  it('deve integrar TypeGuards com navegação de modelo', () => {
    const model = ModelController.createModel({
      name: 'System',
      version: '1.0.0'
    });
    
    const mod = model.addModule({ name: 'Core' });
    
    const entity1: LocalEntity = {
      $type: 'LocalEntity',
      $container: mod,
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
    mod.elements.push(entity1);

    const entity2: LocalEntity = {
      $type: 'LocalEntity',
      $container: mod,
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
    mod.elements.push(entity2);
    
    const modelAST = model.getModel();
    const allModules = modelAST.abstractElements.filter(isModule);
    
    let entityCount = 0;
    for (const module of allModules) {
      const entities = module.elements.filter(isLocalEntity);
      entityCount += entities.length;
    }
    
    expect(entityCount).toBe(2);
  });
});
