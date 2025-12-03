/**
 * Test Helpers: Custom Assertions
 * 
 * Custom assertion functions to make tests more expressive and readable.
 */

import { expect } from 'vitest';
import {
  Domain,
  Module,
  Entity,
  Attribute,
  Relation,
  EnumX,
  ValidationError,
  SEVERITY
} from '../../src/types';

/**
 * Asserts that a Domain is valid (has required properties)
 */
export function assertValidDomain(domain: Domain): void {
  expect(domain).toBeDefined();
  expect(domain.name).toBeTruthy();
  expect(domain.version).toBeTruthy();
  expect(domain.modules).toBeInstanceOf(Array);
  expect(domain.configuration).toBeDefined();
}

/**
 * Asserts that a Module is valid
 */
export function assertValidModule(module: Module): void {
  expect(module).toBeDefined();
  expect(module.name).toBeTruthy();
  expect(module.entities).toBeInstanceOf(Array);
  expect(module.enums).toBeInstanceOf(Array);
}

/**
 * Asserts that an Entity is valid
 */
export function assertValidEntity(entity: Entity): void {
  expect(entity).toBeDefined();
  expect(entity.name).toBeTruthy();
  expect(entity.attributes).toBeInstanceOf(Array);
  expect(entity.relations).toBeInstanceOf(Array);
  expect(entity.functions).toBeInstanceOf(Array);
}

/**
 * Asserts that an Attribute is valid
 */
export function assertValidAttribute(attribute: Attribute): void {
  expect(attribute).toBeDefined();
  expect(attribute.name).toBeTruthy();
  expect(attribute.type).toBeDefined();
  expect(typeof attribute.required).toBe('boolean');
}

/**
 * Asserts that a Relation is valid
 */
export function assertValidRelation(relation: Relation): void {
  expect(relation).toBeDefined();
  expect(relation.name).toBeTruthy();
  expect(relation.type).toBeDefined();
  expect(relation.entity).toBeDefined();
  expect(relation.entity.$ref).toBeTruthy();
  expect(relation.multiplicity).toBeDefined();
}

/**
 * Asserts that an EnumX is valid
 */
export function assertValidEnum(enumX: EnumX): void {
  expect(enumX).toBeDefined();
  expect(enumX.name).toBeTruthy();
  expect(enumX.values).toBeInstanceOf(Array);
  expect(enumX.values.length).toBeGreaterThan(0);
  
  enumX.values.forEach(value => {
    expect(value.name).toBeTruthy();
    expect(value.value).toBeDefined();
  });
}

/**
 * Asserts that validation errors contain specific error
 */
export function assertHasValidationError(
  errors: ValidationError[],
  errorCode: string
): void {
  const found = errors.some(e => e.code === errorCode);
  expect(found).toBe(true);
  if (!found) {
    throw new Error(
      `Expected validation error "${errorCode}" not found. ` +
      `Actual errors: ${errors.map(e => e.code).join(', ')}`
    );
  }
}

/**
 * Asserts that validation errors have specific severity
 */
export function assertValidationSeverity(
  errors: ValidationError[],
  severity: SEVERITY
): void {
  const allMatch = errors.every(e => e.severity === severity);
  expect(allMatch).toBe(true);
  if (!allMatch) {
    throw new Error(
      `Expected all errors to have severity "${severity}". ` +
      `Found: ${errors.map(e => e.severity).join(', ')}`
    );
  }
}

/**
 * Asserts that a reference path is valid
 */
export function assertValidReference(ref: string): void {
  expect(ref).toBeTruthy();
  expect(ref).toMatch(/^#\/modules\/.+\/(entities|enums)\/.+$/);
}

/**
 * Asserts that two domains are deeply equal (structural equality)
 */
export function assertDomainsEqual(actual: Domain, expected: Domain): void {
  expect(actual.name).toBe(expected.name);
  expect(actual.version).toBe(expected.version);
  expect(actual.modules.length).toBe(expected.modules.length);
  
  // Deep comparison of modules
  actual.modules.forEach((module, index) => {
    assertModulesEqual(module, expected.modules[index]);
  });
}

/**
 * Asserts that two modules are deeply equal
 */
export function assertModulesEqual(actual: Module, expected: Module): void {
  expect(actual.name).toBe(expected.name);
  expect(actual.entities.length).toBe(expected.entities.length);
  expect(actual.enums.length).toBe(expected.enums.length);
  
  // Deep comparison of entities
  actual.entities.forEach((entity, index) => {
    assertEntitiesEqual(entity, expected.entities[index]);
  });
}

/**
 * Asserts that two entities are deeply equal
 */
export function assertEntitiesEqual(actual: Entity, expected: Entity): void {
  expect(actual.name).toBe(expected.name);
  expect(actual.attributes.length).toBe(expected.attributes.length);
  expect(actual.relations.length).toBe(expected.relations.length);
  
  // Compare superType if exists
  if (actual.superType || expected.superType) {
    expect(actual.superType?.$ref).toBe(expected.superType?.$ref);
  }
  
  // Deep comparison of attributes
  actual.attributes.forEach((attr, index) => {
    assertAttributesEqual(attr, expected.attributes[index]);
  });
  
  // Deep comparison of relations
  actual.relations.forEach((rel, index) => {
    assertRelationsEqual(rel, expected.relations[index]);
  });
}

/**
 * Asserts that two attributes are equal
 */
export function assertAttributesEqual(actual: Attribute, expected: Attribute): void {
  expect(actual.name).toBe(expected.name);
  expect(actual.type).toEqual(expected.type);
  expect(actual.required).toBe(expected.required);
  
  if (actual.defaultValue || expected.defaultValue) {
    expect(actual.defaultValue).toBe(expected.defaultValue);
  }
}

/**
 * Asserts that two relations are equal
 */
export function assertRelationsEqual(actual: Relation, expected: Relation): void {
  expect(actual.name).toBe(expected.name);
  expect(actual.type).toBe(expected.type);
  expect(actual.entity.$ref).toBe(expected.entity.$ref);
  expect(actual.multiplicity).toBe(expected.multiplicity);
}

/**
 * Asserts that an object has all required keys
 */
export function assertHasKeys<T extends Record<string, any>>(
  obj: T,
  keys: (keyof T)[]
): void {
  keys.forEach(key => {
    expect(obj).toHaveProperty(key);
  });
}

/**
 * Asserts that JSON is parseable and returns parsed object
 */
export function assertValidJSON(json: string): any {
  let parsed: any;
  try {
    parsed = JSON.parse(json);
  } catch (error) {
    throw new Error(`Expected valid JSON, but got parse error: ${error}`);
  }
  expect(parsed).toBeDefined();
  return parsed;
}

/**
 * Asserts that markdown contains expected sections
 */
export function assertMarkdownHasSections(markdown: string, sections: string[]): void {
  sections.forEach(section => {
    const regex = new RegExp(`^#+\\s+${section}`, 'm');
    expect(markdown).toMatch(regex);
  });
}

/**
 * Asserts that a collection is not empty
 */
export function assertNotEmpty<T>(collection: T[]): void {
  expect(collection).toBeDefined();
  expect(collection.length).toBeGreaterThan(0);
}

/**
 * Asserts that a string contains all expected substrings
 */
export function assertContainsAll(text: string, substrings: string[]): void {
  substrings.forEach(substring => {
    expect(text).toContain(substring);
  });
}

/**
 * Asserts that two arrays have the same elements (order-independent)
 */
export function assertArraysEqualUnordered<T>(actual: T[], expected: T[]): void {
  expect(actual.length).toBe(expected.length);
  expected.forEach(item => {
    expect(actual).toContain(item);
  });
}

/**
 * Asserts that a number is within a range
 */
export function assertInRange(value: number, min: number, max: number): void {
  expect(value).toBeGreaterThanOrEqual(min);
  expect(value).toBeLessThanOrEqual(max);
}
