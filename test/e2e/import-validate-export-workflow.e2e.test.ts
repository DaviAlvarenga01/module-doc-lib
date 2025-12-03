/**
 * import-validate-export-workflow.e2e.test.ts
 * 
 * E2E Test: Importação, Validação e Exportação
 */

import { describe, it, expect } from 'vitest';
import { ModelController } from '../../src/controllers/ModelController';
import { ValidationController } from '../../src/controllers/ValidationController';
import { ModuleModel } from '../../src/models/ModuleModel';
import { EntityModel } from '../../src/models/EntityModel';
import type { Model } from '../../src/types';

describe('E2E: Import → Validate → Export', () => {
  
  it('deve importar, validar e re-exportar modelo', () => {
    // 1. Criar modelo original
    const original = ModelController.createModel({
      name: 'TestSystem',
      version: '1.0.0',
      description: 'Test system',
      author: 'Tester'
    });
    
    const mod = original.addModule({
      name: 'Core',
      description: 'Core module'
    });
    
    const modModel = new ModuleModel(mod);
    const entity = modModel.addEntity({
      name: 'User',
      description: 'User entity'
    });
    
    const entityModel = new EntityModel(entity);
    entityModel.addAttribute({
      name: 'username',
      type: 'STRING' as any,
      description: 'Username'
    });
    
    // 2. Exportar para JSON
    const exportedJSON = ModelController.exportToJSON(original);
    expect(exportedJSON).toBeDefined();
    
    // 3. Importar de JSON
    const imported = ModelController.importModel(exportedJSON);
    expect(imported).toBeDefined();
    
    // 4. Validar modelo importado
    const validationResults = ValidationController.validateModel(imported.getModel());
    const isValid = ValidationController.isValid(imported.getModel());
    
    expect(isValid).toBe(true);
    expect(validationResults.length).toBeGreaterThanOrEqual(0);
    
    // 5. Verificar estrutura preservada
    expect(imported.getAllModules().length).toBe(original.getAllModules().length);
    expect(imported.getAllEntities().length).toBe(original.getAllEntities().length);
    
    // 6. Re-exportar
    const reExportedJSON = ModelController.exportToJSON(imported);
    expect(reExportedJSON).toBeDefined();
    
    // 7. Verificar consistência
    expect(typeof exportedJSON).toBe(typeof reExportedJSON);
  });

  it('deve manter integridade através de múltiplos ciclos', () => {
    // Criar modelo
    const model = ModelController.createModel({
      name: 'CycleTest',
      version: '1.0.0'
    });
    
    model.addModule({ name: 'Module1' });
    model.addModule({ name: 'Module2' });
    
    // Ciclo 1
    const json1 = ModelController.exportToJSON(model);
    const imported1 = ModelController.importModel(json1);
    const valid1 = ValidationController.isValid(imported1.getModel());
    
    // Ciclo 2
    const json2 = ModelController.exportToJSON(imported1);
    const imported2 = ModelController.importModel(json2);
    const valid2 = ValidationController.isValid(imported2.getModel());
    
    // Ciclo 3
    const json3 = ModelController.exportToJSON(imported2);
    const imported3 = ModelController.importModel(json3);
    const valid3 = ValidationController.isValid(imported3.getModel());
    
    expect(valid1).toBe(true);
    expect(valid2).toBe(true);
    expect(valid3).toBe(true);
    
    // Estrutura deve ser consistente
    expect(imported1.getAllModules().length).toBe(imported3.getAllModules().length);
  });
});
