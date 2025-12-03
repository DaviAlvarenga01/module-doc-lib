/**
 * model-controller-integration.test.ts
 * 
 * Integration tests: Model + Controller + Validation
 */

import { describe, it, expect } from 'vitest';
import { ModelController } from '../../src/controllers/ModelController';
import { ValidationController } from '../../src/controllers/ValidationController';
import { TransformController, NamingConvention } from '../../src/controllers/TransformController';
import { ModuleModel } from '../../src/models/ModuleModel';
import { DATATYPE } from '../../src/types';

describe('Integration: Model + Controller + Validation', () => {
  
  it('deve criar modelo, adicionar estruturas e validar', () => {
    // Criar modelo
    const model = ModelController.createModel({
      name: 'TestSystem',
      version: '1.0.0'
    });
    
    // Adicionar módulo
    model.addModule({
      name: 'Sales',
      description: 'Sales module'
    });
    
    // Validar
    const results = ValidationController.validateModel(model.getModel());
    const isValid = ValidationController.isValid(model.getModel());
    
    expect(isValid).toBe(true);
    expect(Array.isArray(results)).toBe(true);
  });

  it('deve aplicar transformações e re-validar', () => {
    // Criar modelo
    const model = ModelController.createModel({
      name: 'test_system',
      version: '1.0.0'
    });
    
    model.addModule({ name: 'user_module' });
    
    // Transformar
    const result = TransformController.normalizeModuleNames(
      model,
      NamingConvention.PASCAL_CASE
    );
    
    expect(result.success).toBe(true);
    expect(result.affectedCount).toBeGreaterThan(0);
    
    // Re-validar
    const isValid = ValidationController.isValid(model.getModel());
    expect(isValid).toBe(true);
  });

  it('deve adicionar timestamps e validar integridade', () => {
    const model = ModelController.createModel({
      name: 'System',
      version: '1.0.0'
    });
    
    const mod = model.addModule({ name: 'Core' });
    const modModel = new ModuleModel(mod);
    modModel.addEntity({ name: 'User' });
    
    // Adicionar timestamps
    const result = TransformController.addTimestamps(model, true, true);
    
    expect(result.success).toBe(true);
    
    // Validar
    const isValid = ValidationController.isValid(model.getModel());
    expect(isValid).toBe(true);
  });

  it('deve obter estatísticas de modelo complexo', () => {
    const model = ModelController.createModel({
      name: 'ComplexSystem',
      version: '1.0.0'
    });
    
    const mod1 = model.addModule({ name: 'Module1' });
    const mod2 = model.addModule({ name: 'Module2' });
    
    const mod1Model = new ModuleModel(mod1);
    mod1Model.addEntity({ name: 'Entity1' });
    mod1Model.addEntity({ name: 'Entity2' });
    const mod2Model = new ModuleModel(mod2);
    mod2Model.addEntity({ name: 'Entity3' });
    
    const stats = ModelController.getStatistics(model);
    
    expect(stats).toHaveProperty('totalModules');
    expect(stats).toHaveProperty('totalEntities');
    expect(stats.totalModules).toBeGreaterThanOrEqual(2);
    expect(stats.totalEntities).toBeGreaterThanOrEqual(3);
  });

  it('deve clonar modelo sem afetar original', () => {
    const model = ModelController.createModel({
      name: 'Original',
      version: '1.0.0'
    });
    
    model.addModule({ name: 'Module1' });
    
    const cloned = ModelController.cloneModel(model);
    
    // Modificar clone
    cloned.addModule({ name: 'Module2' });
    
    // Verificar que original não foi afetado
    expect(model.getAllModules().length).not.toBe(cloned.getAllModules().length);
  });
});
