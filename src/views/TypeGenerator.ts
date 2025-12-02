/**
 * Type Generator
 * 
 * Generates TypeScript type definition files (.d.ts) for each entity module.
 * Creates interface definitions for entity data and form structures.
 * 
 * Based on the original implementation from leds-tools-spark-lib.
 * 
 * @module views/TypeGenerator
 * @version 1.0.0
 */

import path from 'path';
import { ClassAbstraction, ProjectAbstraction } from '../types/index.js';
import { writeFile, expandToString } from '../utils/index.js';

/**
 * Generates type definitions for an entity
 * 
 * Creates a TypeScript declaration file with:
 * - Interface for entity data
 * - Interface for form structure
 * 
 * @param {ProjectAbstraction} projectAbstraction - Project metadata
 * @param {ClassAbstraction} entity - Entity to generate types for
 * @param {string} targetFolder - Destination folder
 */
export function generate(
    projectAbstraction: ProjectAbstraction,
    entity: ClassAbstraction,
    targetFolder: string
): void {
    const content = generateTypeContent(entity);
    
    writeFile(path.join(targetFolder, `${entity.getName()}.d.ts`), content);
}

/**
 * Generates the type definition content
 * 
 * Maps Java/SEON types to TypeScript types:
 * - String -> string
 * - Integer/Long/Double/Float -> number
 * - Boolean -> boolean
 * - Date -> Date
 * - Others -> any
 * 
 * @param {ClassAbstraction} entity - Entity class
 * @returns {string} Generated type definitions
 * @private
 */
function generateTypeContent(entity: ClassAbstraction): string {
    const entityName = entity.getName();
    const attributes = entity.getAttributes();
    
    // Generate interface properties
    const properties = attributes
        .map((attr: any) => {
            const attrName = attr.getName();
            const attrType = mapTypeToTypeScript(attr.getType());
            return `  ${attrName}: ${attrType};`;
        })
        .join('\n');
    
    return expandToString`
/**
 * Type definitions for ${entityName} entity
 * @module types/${entityName}
 */

/**
 * ${entityName} data structure
 */
export interface ${entityName} {
${properties}
}

/**
 * ${entityName} form structure
 * Used for create/edit operations
 */
export interface ${entityName}Form {
${properties}
}
`;
}

/**
 * Maps SEON/Java types to TypeScript types
 * 
 * @param {string} javaType - Java/SEON type name
 * @returns {string} Corresponding TypeScript type
 * @private
 */
function mapTypeToTypeScript(javaType: string): string {
    const typeMap: Record<string, string> = {
        'String': 'string',
        'Integer': 'number',
        'Long': 'number',
        'Double': 'number',
        'Float': 'number',
        'Boolean': 'boolean',
        'Date': 'Date',
    };
    
    return typeMap[javaType] || 'any';
}
