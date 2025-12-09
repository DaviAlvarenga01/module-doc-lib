import { describe, it, expect } from 'vitest';
import type { LocalEntity, ImportedEntity, FunctionEntity } from '../../src/models/entity';
import type { Module, Model } from '../../src/models/model';
import type { Attribute } from '../../src/models/atribute';

describe('LocalEntity Model', () => {
  it('should create a valid LocalEntity with all required properties', () => {
    const module: Module = {
      $type: 'Module',
      name: 'user.module',
      elements: [],
      $container: {} as Model
    };

    const entity: LocalEntity = {
      $type: 'LocalEntity',
      $container: module,
      name: 'User',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    expect(entity.$type).toBe('LocalEntity');
    expect(entity.name).toBe('User');
    expect(entity.is_abstract).toBe(false);
    expect(entity.attributes).toEqual([]);
  });

  it('should support abstract entities', () => {
    const entity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'BaseEntity',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: true
    };

    expect(entity.is_abstract).toBe(true);
  });

  it('should contain attributes array', () => {
    const attribute: Attribute = {
      $type: 'Attribute',
      $container: {} as any,
      name: 'email',
      type: 'email',
      blank: false,
      unique: true
    };

    const entity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'User',
      attributes: [attribute],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    expect(entity.attributes).toHaveLength(1);
    expect(entity.attributes[0].name).toBe('email');
    expect(entity.attributes[0].type).toBe('email');
  });

  it('should support optional comment property', () => {
    const entity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'Product',
      comment: 'Represents a product in the system',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    expect(entity.comment).toBe('Represents a product in the system');
  });

  it('should support inheritance with superType', () => {
    const baseEntity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'BaseEntity',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: true
    };

    const derivedEntity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'User',
      superType: { ref: baseEntity },
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    expect(derivedEntity.superType).toBeDefined();
    expect((derivedEntity.superType as any).ref.name).toBe('BaseEntity');
  });
});

describe('ImportedEntity Model', () => {
  it('should create a valid ImportedEntity', () => {
    const entity: ImportedEntity = {
      $type: 'ImportedEntity',
      $container: {} as any,
      name: 'ExternalUser'
    };

    expect(entity.$type).toBe('ImportedEntity');
    expect(entity.name).toBe('ExternalUser');
  });

  it('should have only name as required property', () => {
    const entity: ImportedEntity = {
      $type: 'ImportedEntity',
      $container: {} as any,
      name: 'ImportedProduct'
    };

    expect(entity.name).toBe('ImportedProduct');
    expect(Object.keys(entity)).toContain('$type');
    expect(Object.keys(entity)).toContain('name');
  });
});

describe('FunctionEntity Model', () => {
  it('should create a valid FunctionEntity with parameters', () => {
    const func: FunctionEntity = {
      $type: 'FunctionEntity',
      $container: {} as any,
      name: 'calculateTotal',
      paramters: [],
      response: 'decimal'
    };

    expect(func.$type).toBe('FunctionEntity');
    expect(func.name).toBe('calculateTotal');
    expect(func.response).toBe('decimal');
    expect(func.paramters).toEqual([]);
  });

  it('should support optional comment', () => {
    const func: FunctionEntity = {
      $type: 'FunctionEntity',
      $container: {} as any,
      name: 'validateUser',
      comment: 'Validates user credentials',
      paramters: [],
      response: 'boolean'
    };

    expect(func.comment).toBe('Validates user credentials');
  });

  it('should handle different response types', () => {
    const responseTypes: Array<{ name: string; response: any }> = [
      { name: 'getString', response: 'string' },
      { name: 'getInt', response: 'integer' },
      { name: 'getBool', response: 'boolean' },
      { name: 'getDate', response: 'date' },
      { name: 'getVoid', response: 'void' },
      { name: 'getUUID', response: 'uuid' }
    ];

    responseTypes.forEach(({ name, response }) => {
      const func: FunctionEntity = {
        $type: 'FunctionEntity',
        $container: {} as any,
        name,
        paramters: [],
        response
      };

      expect(func.response).toBe(response);
    });
  });
});

describe('Entity Relationships', () => {
  it('should maintain container reference', () => {
    const module: Module = {
      $type: 'Module',
      name: 'test.module',
      elements: [],
      $container: {} as Model
    };

    const entity: LocalEntity = {
      $type: 'LocalEntity',
      $container: module,
      name: 'TestEntity',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    expect(entity.$container).toBe(module);
    expect(entity.$container.$type).toBe('Module');
  });

  it('should support multiple functions in an entity', () => {
    const func1: FunctionEntity = {
      $type: 'FunctionEntity',
      $container: {} as any,
      name: 'save',
      paramters: [],
      response: 'void'
    };

    const func2: FunctionEntity = {
      $type: 'FunctionEntity',
      $container: {} as any,
      name: 'delete',
      paramters: [],
      response: 'boolean'
    };

    const entity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'Repository',
      attributes: [],
      functions: [func1, func2],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    expect(entity.functions).toHaveLength(2);
    expect(entity.functions[0].name).toBe('save');
    expect(entity.functions[1].name).toBe('delete');
  });
});
