/**
 * model-merge-workflow.e2e.test.ts
 * 
 * E2E Test: Mesclagem de modelos com resolução de conflitos
 */

import { describe, it, expect } from 'vitest';
import { ModelController } from '../../src/controllers/ModelController';
import { ValidationController } from '../../src/controllers/ValidationController';
import { TransformController } from '../../src/controllers/TransformController';
import { ModuleModel } from '../../src/models/ModuleModel';
import { EntityModel } from '../../src/models/EntityModel';

describe('E2E: Model Merge Workflow', () => {
  
  it('deve mesclar dois modelos com estratégia rename', () => {
    // 1. Criar primeiro modelo
    const modelA = ModelController.createModel({
      name: 'SystemA',
      version: '1.0.0'
    });
    
    const modA = modelA.addModule({ name: 'Core' });
    const modAModel = new ModuleModel(modA);
    const entityA = modAModel.addEntity({ name: 'User' });
    const entityAModel = new EntityModel(entityA);
    entityAModel.addAttribute({
      name: 'username',
      type: 'STRING' as any
    });
    
    // 2. Criar segundo modelo
    const modelB = ModelController.createModel({
      name: 'SystemB',
      version: '1.0.0'
    });
    
    const modB = modelB.addModule({ name: 'Core' }); // Conflito de nome!
    const modBModel = new ModuleModel(modB);
    const entityB = modBModel.addEntity({ name: 'Product' });
    const entityBModel = new EntityModel(entityB);
    entityBModel.addAttribute({
      name: 'productName',
      type: 'STRING' as any
    });
    
    // 3. Validar modelos originais
    const validA = ValidationController.isValid(modelA.getModel());
    const validB = ValidationController.isValid(modelB.getModel());
    
    expect(validA).toBe(true);
    expect(validB).toBe(true);
    
    // 4. Mesclar com renomeação
    const merged = TransformController.mergeModels(modelA, modelB, {
      conflictResolution: 'rename',
      renamePrefix: 'imported_',
      mergeMetadata: true
    });
    
    expect(merged).toBeDefined();
    
    // 5. Validar modelo mesclado
    const validMerged = ValidationController.isValid(merged.getModel());
    expect(validMerged).toBe(true);
    
    // 6. Verificar estatísticas
    const stats = ModelController.getStatistics(merged);
    expect(stats.totalModules).toBeGreaterThanOrEqual(2);
    
    // 7. Exportar resultado
    const json = ModelController.exportToJSON(merged);
    expect(json).toBeDefined();
  });

  it('deve mesclar modelos com estratégia skip', () => {
    const modelA = ModelController.createModel({
      name: 'SystemA',
      version: '1.0.0'
    });
    modelA.addModule({ name: 'Shared' });
    
    const modelB = ModelController.createModel({
      name: 'SystemB',
      version: '1.0.0'
    });
    modelB.addModule({ name: 'Shared' });
    modelB.addModule({ name: 'Extensions' });
    
    // Mesclar com skip
    const merged = TransformController.mergeModels(modelA, modelB, {
      conflictResolution: 'skip'
    });
    
    const validMerged = ValidationController.isValid(merged.getModel());
    expect(validMerged).toBe(true);
    
    const stats = ModelController.getStatistics(merged);
    expect(stats.totalModules).toBeGreaterThanOrEqual(1);
  });

  it('deve mesclar modelos com estratégia overwrite', () => {
    const modelA = ModelController.createModel({
      name: 'SystemA',
      version: '1.0.0'
    });
    const modA = modelA.addModule({ name: 'Core' });
    const modAModel = new ModuleModel(modA);
    modAModel.addEntity({ name: 'OldEntity' });
    
    const modelB = ModelController.createModel({
      name: 'SystemB',
      version: '1.0.0'
    });
    const modB = modelB.addModule({ name: 'Core' });
    const modBModel = new ModuleModel(modB);
    modBModel.addEntity({ name: 'NewEntity' });
    
    // Mesclar com overwrite
    const merged = TransformController.mergeModels(modelA, modelB, {
      conflictResolution: 'overwrite'
    });
    
    const validMerged = ValidationController.isValid(merged.getModel());
    expect(validMerged).toBe(true);
  });
});
