/**
 * complete-normalization-workflow.e2e.test.ts
 * 
 * E2E Test: Normalização completa de nomenclatura
 */

import { describe, it, expect } from 'vitest';
import { ModelController } from '../../src/controllers/ModelController';
import { ValidationController } from '../../src/controllers/ValidationController';
import { TransformController, NamingConvention } from '../../src/controllers/TransformController';
import { ModuleModel } from '../../src/models/ModuleModel';
import { EntityModel } from '../../src/models/EntityModel';

describe('E2E: Complete Normalization Workflow', () => {
  
  it('deve normalizar nomes em todos os níveis', () => {
    // 1. Criar modelo com nomes inconsistentes
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
    
    entityModel.addAttribute({
      name: 'last_name',
      type: 'STRING' as any
    });
    
    // 2. Validar antes das transformações
    const validBefore = ValidationController.isValid(model.getModel());
    expect(validBefore).toBe(true);
    
    // 3. Normalizar módulos para PascalCase
    const result1 = TransformController.normalizeModuleNames(
      model,
      NamingConvention.PASCAL_CASE
    );
    
    expect(result1.success).toBe(true);
    expect(result1.affectedCount).toBeGreaterThan(0);
    
    // 4. Normalizar entidades para PascalCase
    const result2 = TransformController.normalizeEntityNames(
      model,
      NamingConvention.PASCAL_CASE
    );
    
    expect(result2.success).toBe(true);
    expect(result2.affectedCount).toBeGreaterThan(0);
    
    // 5. Normalizar atributos para camelCase
    const result3 = TransformController.normalizeAttributeNames(
      model,
      NamingConvention.CAMEL_CASE
    );
    
    expect(result3.success).toBe(true);
    expect(result3.affectedCount).toBeGreaterThan(0);
    
    // 6. Validar após transformações
    const validAfter = ValidationController.isValid(model.getModel());
    expect(validAfter).toBe(true);
    
    // 7. Verificar que nomes foram normalizados
    const modules = model.getAllModules();
    expect(modules.length).toBeGreaterThan(0);
    
    // 8. Exportar resultado
    const json = ModelController.exportToJSON(model);
    expect(json).toBeDefined();
    
    // 9. Obter estatísticas finais
    const stats = ModelController.getStatistics(model);
    expect(stats).toBeDefined();
    expect(stats.totalModules).toBeGreaterThan(0);
    expect(stats.totalEntities).toBeGreaterThan(0);
  });

  it('deve aplicar múltiplas transformações em sequência', () => {
    const model = ModelController.createModel({
      name: 'TransformTest',
      version: '1.0.0'
    });
    
    const mod = model.addModule({ name: 'test_module' });
    const modModel = new ModuleModel(mod);
    const entity = modModel.addEntity({ name: 'test_entity' });
    const entityModel = new EntityModel(entity);
    entityModel.addAttribute({ name: 'TestAttr', type: 'STRING' as any });
    
    // Validar inicial
    const valid1 = ValidationController.isValid(model.getModel());
    
    // Transformação 1: Normalizar módulos
    TransformController.normalizeModuleNames(model, NamingConvention.PASCAL_CASE);
    const valid2 = ValidationController.isValid(model.getModel());
    
    // Transformação 2: Normalizar entidades
    TransformController.normalizeEntityNames(model, NamingConvention.PASCAL_CASE);
    const valid3 = ValidationController.isValid(model.getModel());
    
    // Transformação 3: Normalizar atributos
    TransformController.normalizeAttributeNames(model, NamingConvention.CAMEL_CASE);
    const valid4 = ValidationController.isValid(model.getModel());
    
    // Transformação 4: Adicionar timestamps
    TransformController.addTimestamps(model, true, true);
    const valid5 = ValidationController.isValid(model.getModel());
    
    // Todas as validações devem passar
    expect(valid1).toBe(true);
    expect(valid2).toBe(true);
    expect(valid3).toBe(true);
    expect(valid4).toBe(true);
    expect(valid5).toBe(true);
  });
});
