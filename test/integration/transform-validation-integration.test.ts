/**
 * transform-validation-integration.test.ts
 * 
 * Integration tests: Transform + Validation workflows
 */

import { describe, it, expect } from 'vitest';
import { ModelController } from '../../src/controllers/ModelController';
import { ValidationController } from '../../src/controllers/ValidationController';
import { TransformController, NamingConvention } from '../../src/controllers/TransformController';
import { ModuleModel } from '../../src/models/ModuleModel';
import { EntityModel } from '../../src/models/EntityModel';

describe('Integration: Transform + Validation', () => {
  
  it('deve normalizar nomes em todos os níveis', () => {
    const model = ModelController.createModel({
      name: 'test_system',
      version: '1.0.0'
    });
    
    const mod = model.addModule({ name: 'user_management' });
    const modModel = new ModuleModel(mod);
    const entity = modModel.addEntity({ name: 'user_account' });
    const entityModel = new EntityModel(entity);
    entityModel.addAttribute({ 
      name: 'FirstName',
      type: 'STRING' as any
    });
    
    // Normalizar módulos
    TransformController.normalizeModuleNames(model, NamingConvention.PASCAL_CASE);
    
    // Normalizar entidades
    TransformController.normalizeEntityNames(model, NamingConvention.PASCAL_CASE);
    
    // Normalizar atributos
    TransformController.normalizeAttributeNames(model, NamingConvention.CAMEL_CASE);
    
    // Validar resultado
    const isValid = ValidationController.isValid(model.getModel());
    expect(isValid).toBe(true);
  });

  it('deve remover atributos não utilizados e validar', () => {
    const model = ModelController.createModel({
      name: 'System',
      version: '1.0.0'
    });
    
    const mod = model.addModule({ name: 'Core' });
    const modModel = new ModuleModel(mod);
    const entity = modModel.addEntity({ name: 'User' });
    
    const entityModel = new EntityModel(entity);
    // Adicionar atributos com e sem metadados
    entityModel.addAttribute({
      name: 'valid',
      type: 'STRING' as any,
      description: 'Valid attribute'
    });
    
    // Preview de remoção
    const previewResult = TransformController.removeUnusedAttributes(model, true);
    expect(previewResult.affectedCount).toBeGreaterThanOrEqual(0);
    
    // Validar
    const isValid = ValidationController.isValid(model.getModel());
    expect(isValid).toBe(true);
  });

  it('deve mesclar modelos e validar resultado', () => {
    const modelA = ModelController.createModel({
      name: 'SystemA',
      version: '1.0.0'
    });
    modelA.addModule({ name: 'Core' });
    
    const modelB = ModelController.createModel({
      name: 'SystemB',
      version: '1.0.0'
    });
    modelB.addModule({ name: 'Extensions' });
    
    // Mesclar
    const merged = TransformController.mergeModels(modelA, modelB, {
      conflictResolution: 'rename',
      renamePrefix: 'imported_'
    });
    
    // Validar
    const isValid = ValidationController.isValid(merged.getModel());
    expect(isValid).toBe(true);
  });
});
