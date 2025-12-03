/**
 * clone-modify-compare-workflow.e2e.test.ts
 * 
 * E2E Test: Clonagem, modificação e comparação
 */

import { describe, it, expect } from 'vitest';
import { ModelController } from '../../src/controllers/ModelController';
import { ValidationController } from '../../src/controllers/ValidationController';
import { TransformController, NamingConvention } from '../../src/controllers/TransformController';
import { ModuleModel } from '../../src/models/ModuleModel';
import { EntityModel } from '../../src/models/EntityModel';

describe('E2E: Clone, Modify, Compare Workflow', () => {
  
  it('deve clonar, modificar e comparar modelos', () => {
    // 1. Criar modelo original
    const original = ModelController.createModel({
      name: 'OriginalSystem',
      version: '1.0.0'
    });
    
    const mod = original.addModule({ name: 'Core' });
    const modModel = new ModuleModel(mod);
    const entity = modModel.addEntity({ name: 'User' });
    const entityModel = new EntityModel(entity);
    entityModel.addAttribute({
      name: 'username',
      type: 'STRING' as any
    });
    
    // 2. Validar original
    const validOriginal = ValidationController.isValid(original.getModel());
    expect(validOriginal).toBe(true);
    
    // 3. Clonar
    const cloned = ModelController.cloneModel(original);
    expect(cloned).toBeDefined();
    
    // 4. Validar clone
    const validClone = ValidationController.isValid(cloned.getModel());
    expect(validClone).toBe(true);
    
    // 5. Modificar original
    original.addModule({ name: 'Extensions' });
    
    // 6. Modificar clone
    cloned.addModule({ name: 'Plugins' });
    
    // 7. Obter estatísticas de ambos
    const statsOriginal = ModelController.getStatistics(original);
    const statsClone = ModelController.getStatistics(cloned);
    
    // 8. Comparar estruturas
    expect(statsOriginal.totalModules).not.toBe(statsClone.totalModules);
    
    // 9. Validar ambos ainda são válidos
    const validOriginalAfter = ValidationController.isValid(original.getModel());
    const validCloneAfter = ValidationController.isValid(cloned.getModel());
    
    expect(validOriginalAfter).toBe(true);
    expect(validCloneAfter).toBe(true);
  });

  it('deve aplicar transformações diferentes a cópias', () => {
    // Criar base
    const base = ModelController.createModel({
      name: 'BaseSystem',
      version: '1.0.0'
    });
    
    const mod = base.addModule({ name: 'test_module' });
    const modModel = new ModuleModel(mod);
    modModel.addEntity({ name: 'test_entity' });
    
    // Clone 1: Normalizar para PascalCase
    const clone1 = ModelController.cloneModel(base);
    TransformController.normalizeModuleNames(clone1, NamingConvention.PASCAL_CASE);
    TransformController.normalizeEntityNames(clone1, NamingConvention.PASCAL_CASE);
    
    // Clone 2: Normalizar para snake_case
    const clone2 = ModelController.cloneModel(base);
    TransformController.normalizeModuleNames(clone2, NamingConvention.SNAKE_CASE);
    TransformController.normalizeEntityNames(clone2, NamingConvention.SNAKE_CASE);
    
    // Clone 3: Adicionar timestamps
    const clone3 = ModelController.cloneModel(base);
    TransformController.addTimestamps(clone3, true, true);
    
    // Todas as versões devem ser válidas
    expect(ValidationController.isValid(base.getModel())).toBe(true);
    expect(ValidationController.isValid(clone1.getModel())).toBe(true);
    expect(ValidationController.isValid(clone2.getModel())).toBe(true);
    expect(ValidationController.isValid(clone3.getModel())).toBe(true);
    
    // Estatísticas básicas devem ser iguais
    const statsBase = ModelController.getStatistics(base);
    const stats1 = ModelController.getStatistics(clone1);
    const stats2 = ModelController.getStatistics(clone2);
    const stats3 = ModelController.getStatistics(clone3);
    
    expect(statsBase.totalModules).toBe(stats1.totalModules);
    expect(statsBase.totalModules).toBe(stats2.totalModules);
    expect(statsBase.totalModules).toBe(stats3.totalModules);
  });
});
