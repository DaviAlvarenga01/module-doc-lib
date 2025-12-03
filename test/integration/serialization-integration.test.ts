/**
 * serialization-integration.test.ts
 * 
 * Integration tests: Model + Serialization (Export/Import)
 */

import { describe, it, expect } from 'vitest';
import { ModelController } from '../../src/controllers/ModelController';
import { ValidationController } from '../../src/controllers/ValidationController';
import { ModuleModel } from '../../src/models/ModuleModel';

describe('Integration: Serialization', () => {
  
  it('deve exportar para JSON e re-importar', () => {
    const original = ModelController.createModel({
      name: 'TestModel',
      version: '1.0.0'
    });
    
    original.addModule({ name: 'Module1' });
    
    // Exportar
    const json = ModelController.exportToJSON(original);
    expect(json).toBeDefined();
    expect(typeof json).toBe('object');
    
    // Re-importar
    const imported = ModelController.importModel(json);
    expect(imported).toBeDefined();
    
    // Validar que estrutura foi preservada
    expect(imported.getAllModules().length).toBe(original.getAllModules().length);
  });

  it('deve manter integridade após ciclo export-import', () => {
    const model = ModelController.createModel({
      name: 'ComplexModel',
      version: '1.0.0'
    });
    
    const mod = model.addModule({ name: 'Sales' });
    const modModel = new ModuleModel(mod);
    modModel.addEntity({ name: 'Product' });
    
    // Validar antes
    const validBefore = ValidationController.isValid(model.getModel());
    expect(validBefore).toBe(true);
    
    // Ciclo export-import
    const json = ModelController.exportToJSON(model);
    const restored = ModelController.importModel(json);
    
    // Validar depois
    const validAfter = ValidationController.isValid(restored.getModel());
    expect(validAfter).toBe(true);
  });

  it('deve preservar metadados no ciclo export-import', () => {
    const model = ModelController.createModel({
      name: 'MetadataModel',
      version: '1.0.0',
      description: 'Test description',
      author: 'Test Author'
    });
    
    // Export-import
    const json = ModelController.exportToJSON(model);
    const restored = ModelController.importModel(json);
    
    // Verificar metadados
    const restoredModel = restored.getModel();
    expect(restoredModel.configuration?.name).toBeDefined();
  });
});
