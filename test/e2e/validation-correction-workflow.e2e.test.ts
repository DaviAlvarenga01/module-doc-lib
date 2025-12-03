/**
 * validation-correction-workflow.e2e.test.ts
 * 
 * E2E Test: Validação com correção automática
 */

import { describe, it, expect } from 'vitest';
import { ModelController } from '../../src/controllers/ModelController';
import { ValidationController } from '../../src/controllers/ValidationController';
import { TransformController, NamingConvention } from '../../src/controllers/TransformController';
import { ModuleModel } from '../../src/models/ModuleModel';
import { EntityModel } from '../../src/models/EntityModel';

describe('E2E: Validation and Correction Workflow', () => {
  
  it('deve validar, identificar problemas e aplicar correções', () => {
    // 1. Criar modelo com nomes inconsistentes
    const model = ModelController.createModel({
      name: 'test_system',
      version: '1.0.0'
    });
    
    const mod = model.addModule({ name: 'USERS' });
    const modModel = new ModuleModel(mod);
    const entity = modModel.addEntity({ name: 'User_Account' });
    const entityModel = new EntityModel(entity);
    entityModel.addAttribute({
      name: 'FIRST_NAME',
      type: 'STRING' as any
    });
    
    // 2. Validar inicial
    const initialValidation = ValidationController.validateModel(model.getModel());
    const initialValid = ValidationController.isValid(model.getModel());
    
    expect(initialValid).toBe(true);
    expect(Array.isArray(initialValidation)).toBe(true);
    
    // 3. Aplicar correções de nomenclatura
    TransformController.normalizeModuleNames(model, NamingConvention.PASCAL_CASE);
    TransformController.normalizeEntityNames(model, NamingConvention.PASCAL_CASE);
    TransformController.normalizeAttributeNames(model, NamingConvention.CAMEL_CASE);
    
    // 4. Re-validar após correções
    const afterValidation = ValidationController.validateModel(model.getModel());
    const afterValid = ValidationController.isValid(model.getModel());
    
    expect(afterValid).toBe(true);
    
    // 5. Adicionar timestamps (melhoria)
    TransformController.addTimestamps(model, true, true);
    
    // 6. Validar final
    const finalValid = ValidationController.isValid(model.getModel());
    expect(finalValid).toBe(true);
    
    // 7. Obter estatísticas finais
    const stats = ModelController.getStatistics(model);
    expect(stats).toBeDefined();
  });

  it('deve iterar validação e correção até modelo perfeito', () => {
    const model = ModelController.createModel({
      name: 'IterativeSystem',
      version: '1.0.0'
    });
    
    const mod = model.addModule({ name: 'test_mod' });
    const modModel = new ModuleModel(mod);
    modModel.addEntity({ name: 'test_ent' });
    
    let iterations = 0;
    const maxIterations = 5;
    
    while (iterations < maxIterations) {
      // Validar
      const valid = ValidationController.isValid(model.getModel());
      
      if (!valid) {
        // Aplicar correções se necessário
        TransformController.normalizeModuleNames(model, NamingConvention.PASCAL_CASE);
        TransformController.normalizeEntityNames(model, NamingConvention.PASCAL_CASE);
      }
      
      iterations++;
      
      // Se modelo está válido, pode parar
      if (valid) break;
    }
    
    // Deve convergir para modelo válido
    const finalValid = ValidationController.isValid(model.getModel());
    expect(finalValid).toBe(true);
    expect(iterations).toBeLessThanOrEqual(maxIterations);
  });
});
