/**
 * Module Generator Controller
 * 
 * Main controller responsible for orchestrating the entire module generation process.
 * This is the Controller layer in the MVC architecture.
 * 
 * Responsibilities:
 * - Coordinate between Models and Views (generators)
 * - Validate inputs
 * - Manage the generation workflow
 * - Handle errors gracefully
 * 
 * Following KISS principle - simple coordination logic.
 * Follows ISO/IEC 25010 - maintainability and modularity.
 * 
 * @module controllers/ModuleGeneratorController
 * @version 1.0.0
 */

import path from 'path';
import fs from 'fs';
import { ModuleGenerator } from '../models/index.js';
import { ProjectAbstraction, ClassAbstraction } from '../types/index.js';
import { createPath, writeFile } from '../utils/index.js';
import * as ApiGenerator from '../views/ApiGenerator.js';
import * as ControllerGenerator from '../views/ControllerGenerator.js';
import * as RouteGenerator from '../views/RouteGenerator.js';
import * as TypeGenerator from '../views/TypeGenerator.js';
import * as ViewGenerator from '../views/ViewGenerator.js';

/**
 * Main generation function
 * 
 * Orchestrates the complete module generation process.
 * This is the main entry point for the library.
 * 
 * Process:
 * 1. Validate inputs
 * 2. Create Model instance
 * 3. Extract entities
 * 4. Generate main index file
 * 5. Generate module for each entity
 * 
 * @param {ProjectAbstraction} projectAbstraction - SEON project abstraction
 * @param {string} targetFolder - Destination folder for generated modules
 * 
 * @throws {Error} If projectAbstraction is invalid
 * @throws {Error} If targetFolder is invalid
 * 
 * @example
 * ```typescript
 * import { generate } from 'module-doc-lib'
 * 
 * generate(myProjectAbstraction, './src/modules')
 * ```
 */
export function generate(
    projectAbstraction: ProjectAbstraction,
    targetFolder: string
): void {
    // Validation
    if (!projectAbstraction) {
        throw new Error('ProjectAbstraction is required');
    }

    if (!targetFolder || typeof targetFolder !== 'string') {
        throw new Error('Target folder must be a valid string path');
    }

    // Create Model instance
    const generator = new ModuleGenerator(projectAbstraction);

    // Check if project has entities
    if (!generator.hasEntities()) {
        console.warn('⚠️  No entities found in project. Nothing to generate.');
        return;
    }

    // Extract entities
    const entities = generator.getEntities();

    console.log(`📦 Generating modules for ${entities.length} entities...`);

    // Ensure target folder exists
    createPath(targetFolder);

    // Generate main index file
    generateMainIndex(entities, targetFolder);

    // Generate module for each entity
    for (const entity of entities) {
        generateModuleForEntity(projectAbstraction, entity, targetFolder);
    }

    console.log(`✅ Successfully generated ${entities.length} modules in ${targetFolder}`);
}

/**
 * Generates the main index file for all modules
 * 
 * Creates an index.ts that exports all module routes,
 * serving as the entry point for the modules system.
 * 
 * @param {ClassAbstraction[]} entities - List of entities
 * @param {string} targetFolder - Destination folder
 * 
 * @private
 */
function generateMainIndex(
    entities: ClassAbstraction[],
    targetFolder: string
): void {
    const imports: string[] = [];
    const exports: string[] = [];

    for (const entity of entities) {
        const entityName = entity.getName();
        const varName = `${entityName.toLowerCase()}Route`;
        
        imports.push(`import { routes as ${varName} } from './${entityName}'`);
        exports.push(`  ...${varName},`);
    }

    const content = `import { type RouteRecordRaw } from 'vue-router'

${imports.join('\n')}

export const routes: RouteRecordRaw[] = [
${exports.join('\n')}
]
`;

    writeFile(path.join(targetFolder, 'index.ts'), content);
}

/**
 * Generates a complete module for a single entity
 * 
 * Creates the folder structure and generates all layers:
 * - API integration
 * - Controllers (business logic)
 * - Routes
 * - Types
 * - Views (Vue components)
 * 
 * @param {ProjectAbstraction} projectAbstraction - Project abstraction
 * @param {ClassAbstraction} entity - Entity to generate module for
 * @param {string} targetFolder - Base target folder
 * 
 * @private
 */
function generateModuleForEntity(
    projectAbstraction: ProjectAbstraction,
    entity: ClassAbstraction,
    targetFolder: string
): void {
    const entityName = entity.getName();
    const entityFolder = createPath(targetFolder, entityName);

    console.log(`  📄 Generating module: ${entityName}`);

    // Generate module index
    generateModuleIndex(entity, entityFolder);

    // Create subfolders
    const apiFolder = createPath(entityFolder, 'api');
    const controllersFolder = createPath(entityFolder, 'controllers');
    const routesFolder = createPath(entityFolder, 'routes');
    const typesFolder = createPath(entityFolder, 'types');
    const viewsFolder = createPath(entityFolder, 'views');

    // Generate all layers using Views (generators)
    console.log(`    📡 Generating API layer...`);
    ApiGenerator.generate(projectAbstraction, entity, apiFolder);
    
    console.log(`    🎮 Generating Controller layer...`);
    ControllerGenerator.generate(projectAbstraction, entity, controllersFolder);
    
    console.log(`    🛣️  Generating Routes...`);
    RouteGenerator.generate(projectAbstraction, entity, routesFolder);
    
    console.log(`    📝 Generating Types...`);
    TypeGenerator.generate(projectAbstraction, entity, typesFolder);
    
    console.log(`    🖼️  Generating Views...`);
    ViewGenerator.generate(projectAbstraction, entity, viewsFolder);
    
    console.log(`    ✅ Module ${entityName} generated successfully`);
}

/**
 * Generates the module's own index file
 * 
 * Creates an index.ts for the module that exports its routes
 * with proper path and authentication settings.
 * 
 * @param {ClassAbstraction} entity - Entity
 * @param {string} moduleFolder - Module folder path
 * 
 * @private
 */
function generateModuleIndex(
    entity: ClassAbstraction,
    moduleFolder: string
): void {
    const entityName = entity.getName();

    const content = `import { type RouteRecordRaw } from 'vue-router'
import { routes as _routes } from './routes'

export const routes: RouteRecordRaw[] = [
  {
    path: '/${entityName}',
    children: _routes,
    meta: {
      requiresAuth: true
    }
  }
]
`;

    writeFile(path.join(moduleFolder, 'index.ts'), content);
}
