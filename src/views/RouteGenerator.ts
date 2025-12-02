/**
 * Route Generator
 * 
 * Generates Vue Router configuration files for each entity module.
 * Creates route definitions for list and create/edit views.
 * 
 * Based on the original implementation from leds-tools-spark-lib.
 * 
 * @module views/RouteGenerator
 * @version 1.0.0
 */

import path from 'path';
import { ClassAbstraction, ProjectAbstraction } from '../types/index.js';
import { writeFile, expandToString } from '../utils/index.js';

/**
 * Generates route configuration for an entity
 * 
 * Creates a TypeScript file defining Vue Router routes for:
 * - List view ({entity}-home)
 * - Create/Edit view ({entity}-criar)
 * 
 * @param {ProjectAbstraction} projectAbstraction - Project metadata
 * @param {ClassAbstraction} entity - Entity to generate routes for
 * @param {string} targetFolder - Destination folder
 */
export function generate(
    projectAbstraction: ProjectAbstraction,
    entity: ClassAbstraction,
    targetFolder: string
): void {
    const content = generateRouteContent(entity);
    
    writeFile(path.join(targetFolder, 'index.ts'), content);
}

/**
 * Generates the route configuration content
 * 
 * @param {ClassAbstraction} entity - Entity class
 * @returns {string} Generated route configuration
 * @private
 */
function generateRouteContent(entity: ClassAbstraction): string {
    const entityName = entity.getName();
    const entityLower = entityName.toLowerCase();
    
    return expandToString`
import type { RouteRecordRaw } from 'vue-router'
import Listar from '../views/Listar.vue'
import Criar from '../views/Criar.vue'

export const routes: RouteRecordRaw[] = [
  {
    name: '${entityLower}-home',
    path: 'home',
    component: Listar,
  },
  {
    name: '${entityLower}-criar',
    path: 'criar/:id?',
    component: Criar,
  }
]

/**
 * @description Generates the route configuration implementation
 * @description Creates Vue Router route definitions for an entity's views
 * @description generateRoute${entityName}: Route configuration for ${entityName}
 * @param project_abstraction - Project metadata
 * @param cls - Class for which to generate route config
 * @returns {RouteRecordRaw[]} Vue Router configuration content
 */
`;
}
