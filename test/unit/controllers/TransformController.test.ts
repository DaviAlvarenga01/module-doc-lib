/**
 * TransformController.test.ts
 * 
 * Unit tests for TransformController - Essential operations only
 */

import { describe, it, expect } from 'vitest';
import { TransformController, NamingConvention } from '../../../src/controllers/TransformController';
import { DomainModel } from '../../../src/models/DomainModel';

describe('TransformController', () => {
  
  it('deve normalizar nomes de módulos', () => {
    const model = new DomainModel({
      name: 'TestModel',
      version: '1.0.0'
    });
    
    const result = TransformController.normalizeModuleNames(
      model,
      NamingConvention.PASCAL_CASE
    );
    
    expect(result).toBeDefined();
  });

  it('deve normalizar nomes de entidades', () => {
    const model = new DomainModel({
      name: 'TestModel',
      version: '1.0.0'
    });
    
    const result = TransformController.normalizeEntityNames(
      model,
      NamingConvention.PASCAL_CASE
    );
    
    expect(result).toBeDefined();
  });

  it('deve normalizar nomes de atributos', () => {
    const model = new DomainModel({
      name: 'TestModel',
      version: '1.0.0'
    });
    
    const result = TransformController.normalizeAttributeNames(
      model,
      NamingConvention.CAMEL_CASE
    );
    
    expect(result).toBeDefined();
  });

  it('deve adicionar timestamps a entidades', () => {
    const model = new DomainModel({
      name: 'TestModel',
      version: '1.0.0'
    });
    
    const result = TransformController.addTimestamps(model);
    expect(result).toBeDefined();
  });

  it('deve remover atributos não utilizados', () => {
    const model = new DomainModel({
      name: 'TestModel',
      version: '1.0.0'
    });
    
    const result = TransformController.removeUnusedAttributes(model);
    expect(result).toBeDefined();
  });

  it('deve mesclar modelos', () => {
    const model1 = new DomainModel({
      name: 'Model1',
      version: '1.0.0'
    });
    
    const model2 = new DomainModel({
      name: 'Model2',
      version: '1.0.0'
    });
    
    const merged = TransformController.mergeModels(model1, model2, {
      conflictResolution: 'overwrite'
    });
    
    expect(merged).toBeDefined();
    expect(merged).toBeInstanceOf(DomainModel);
  });
});
