/**
 * index.ts
 * 
 * Ponto de entrada principal da biblioteca module-doc-lib.
 * Exporta a função de geração, modelo e tipos para uso externo.
 * 
 * Processos:
 * - Exporta função generate() do controller
 * - Exporta classe ModuleGenerator do model
 * - Exporta tipos do SEON para conveniência
 */

/**
 * Main generation function
 * 
 * Generates Vue.js modules from a SEON ProjectAbstraction.
 * Creates API, controllers, routes, types, and views for each entity.
 * 
 * @example
 * ```typescript
 * import { generate } from 'module-doc-lib';
 * import { ProjectAbstraction } from 'seon-lib-implementation';
 * 
 * const project = new ProjectAbstraction(...);
 * generate(project, './output');
 * ```
 */
export { generate } from './controllers/ModuleGeneratorController.js';

/**
 * Model class for module generation
 * 
 * Encapsulates ProjectAbstraction and provides methods to extract entities.
 */
export { ModuleGenerator } from './models/ModuleGenerator.js';

/**
 * Type aliases from SEON library
 * 
 * Re-exported for convenience when using the library.
 */
export type { ClassAbstraction, ProjectAbstraction } from './types/index.js';