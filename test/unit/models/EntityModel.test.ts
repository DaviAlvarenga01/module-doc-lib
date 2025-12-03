/**
 * EntityModel.test.ts
 * 
 * Unit tests for EntityModel class - Essential operations only
 */

import { describe, it, expect } from 'vitest';
import { EntityModel } from '../../../src/models/EntityModel';
import type { LocalEntity } from '../../../src/types';

describe('EntityModel', () => {
  
  it('deve criar instância com entidade válida', () => {
    const mockEntity: Partial<LocalEntity> = {
      $type: 'LocalEntity',
      name: 'Customer',
      attributes: [],
      relations: [],
      functions: [],
      is_abstract: false
    };
    
    const entityModel = new EntityModel(mockEntity as LocalEntity);
    expect(entityModel).toBeInstanceOf(EntityModel);
  });

  it('deve retornar atributos da entidade', () => {
    const mockEntity: Partial<LocalEntity> = {
      $type: 'LocalEntity',
      name: 'Customer',
      attributes: [],
      relations: [],
      functions: [],
      is_abstract: false
    };
    
    const entityModel = new EntityModel(mockEntity as LocalEntity);
    const attributes = entityModel.getAttributes();
    
    expect(Array.isArray(attributes)).toBe(true);
  });

  it('deve retornar relações da entidade', () => {
    const mockEntity: Partial<LocalEntity> = {
      $type: 'LocalEntity',
      name: 'Customer',
      attributes: [],
      relations: [],
      functions: [],
      is_abstract: false
    };
    
    const entityModel = new EntityModel(mockEntity as LocalEntity);
    const relations = entityModel.getRelations();
    
    expect(Array.isArray(relations)).toBe(true);
  });

  it('deve validar entidade', () => {
    const mockEntity: Partial<LocalEntity> = {
      $type: 'LocalEntity',
      name: 'Customer',
      attributes: [],
      relations: [],
      functions: [],
      is_abstract: false
    };
    
    const entityModel = new EntityModel(mockEntity as LocalEntity);
    const errors = entityModel.validate();
    
    expect(Array.isArray(errors)).toBe(true);
  });
});
