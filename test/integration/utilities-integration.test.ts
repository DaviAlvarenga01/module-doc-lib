/**
 * utilities-integration.test.ts
 * 
 * Integration tests: Utils working together
 */

import { describe, it, expect } from 'vitest';
import { ModelController } from '../../src/controllers/ModelController';
import { ModuleModel } from '../../src/models/ModuleModel';
import { isModule, isLocalEntity } from '../../src/utils/TypeGuards';
import { toPascalCase, toCamelCase } from '../../src/utils/StringUtils';

describe('Integration: Utilities', () => {
  
  it('deve usar TypeGuards para filtrar elementos', () => {
    const model = ModelController.createModel({
      name: 'System',
      version: '1.0.0'
    });
    
    const mod = model.addModule({ name: 'Core' });
    const modModel = new ModuleModel(mod);
    modModel.addEntity({ name: 'User' });
    
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
    const modModel = new ModuleModel(mod);
    modModel.addEntity({ name: 'Entity1' });
    modModel.addEntity({ name: 'Entity2' });
    
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
