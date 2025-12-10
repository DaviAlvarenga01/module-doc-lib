// Export version
export const version = '1.17.0';

// Export all types and interfaces from model
export * from './models/model.js';

// Export additional entity types
export type { FunctionEntity, ImportedEntity } from './models/entity.js';
export { isFunctionEntity, isImportedEntity, isLocalEntity } from './models/entity.js';

// Export additional attribute types  
export type { Attribute, AttributeEnum } from './models/atribute.js';
export { isAttribute, isAttributeEnum } from './models/atribute.js';

// Export additional actor functions
export { isActor } from './models/actor.js';
