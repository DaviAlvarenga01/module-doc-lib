import { describe, it, expect } from 'vitest';
import { getRef, type Reference } from '../../src/models/model';
import type { LocalEntity } from '../../src/models/entity';

describe('getRef Utility Function', () => {
  it('should extract entity from Reference object with ref property', () => {
    const entity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'User',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };
    
    const reference: Reference<LocalEntity> = { ref: entity };
    const result = getRef(reference);
    
    expect(result).toBe(entity);
    expect(result.name).toBe('User');
  });

  it('should return the entity directly when passed without ref wrapper', () => {
    const entity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'Product',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };
    
    const result = getRef(entity);
    
    expect(result).toBe(entity);
    expect(result.name).toBe('Product');
  });

  it('should handle null values', () => {
    const result = getRef(null as any);
    expect(result).toBeNull();
  });

  it('should handle undefined values', () => {
    const result = getRef(undefined as any);
    expect(result).toBeUndefined();
  });

  it('should handle nested Reference structures', () => {
    const innerEntity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'Category',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };
    
    const reference: Reference<LocalEntity> = { ref: innerEntity };
    const extracted = getRef(reference);
    
    expect(extracted).toEqual(innerEntity);
  });

  it('should work with different entity types', () => {
    interface TestType {
      id: string;
      value: number;
    }
    
    const testObj: TestType = { id: 'test-1', value: 42 };
    const refWrapped: Reference<TestType> = { ref: testObj };
    
    expect(getRef(refWrapped)).toEqual(testObj);
    expect(getRef(testObj)).toEqual(testObj);
  });

  it('should preserve object properties when extracting', () => {
    const entity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'Order',
      attributes: [
        {
          $type: 'Attribute',
          $container: {} as any,
          name: 'total',
          type: 'decimal',
          blank: false,
          unique: false
        }
      ],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };
    
    const reference: Reference<LocalEntity> = { ref: entity };
    const result = getRef(reference);
    
    expect(result.attributes).toHaveLength(1);
    expect(result.attributes[0].name).toBe('total');
  });
});
