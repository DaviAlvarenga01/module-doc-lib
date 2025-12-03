/**
 * AST Builders - Helper functions for creating AST nodes
 * 
 * These helpers create valid AST nodes (LocalEntity, EnumX, etc.)
 * that can be pushed directly into Module.elements[]
 */

import type { LocalEntity, EnumX, Attribute, Relation, Module, Metadata } from '../../src/types';

/**
 * Create a minimal valid Metadata object
 */
export function buildMetadata(overrides?: Partial<Metadata>): Metadata {
  return {
    description: '',
    tags: [],
    requirements: [],
    author: 'Test',
    createdAt: new Date(),
    modifiedAt: new Date(),
    ...overrides
  };
}

/**
 * Add a LocalEntity to a Module
 * 
 * @param module - The module to add the entity to
 * @param name - Entity name
 * @param options - Additional entity properties
 * @returns The created entity
 */
export function addEntityToModule(
  module: Module,
  name: string,
  options?: {
    isAbstract?: boolean;
    description?: string;
    attributes?: Attribute[];
    relations?: Relation[];
  }
): LocalEntity {
  const entity: LocalEntity = {
    $type: 'LocalEntity',
    $container: module,
    name,
    attributes: options?.attributes || [],
    relations: options?.relations || [],
    functions: [],
    is_abstract: options?.isAbstract || false,
    metadata: buildMetadata({ description: options?.description || '' })
  };

  module.elements.push(entity);
  return entity;
}

/**
 * Add an EnumX to a Module
 * 
 * @param module - The module to add the enum to
 * @param name - Enum name
 * @param literals - Array of literal values
 * @returns The created enum
 */
export function addEnumToModule(
  module: Module,
  name: string,
  literals: string[]
): EnumX {
  const enumX: EnumX = {
    $type: 'EnumX',
    $container: module,
    name,
    literals: literals.map(lit => ({
      $type: 'EnumLiteral',
      name: lit,
      value: lit
    })),
    metadata: buildMetadata()
  };

  module.elements.push(enumX);
  return enumX;
}
