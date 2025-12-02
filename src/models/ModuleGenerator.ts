/**
 * Module Generator Model
 * 
 * Main model class responsible for orchestrating module generation.
 * This class encapsulates the SEON ProjectAbstraction and provides
 * methods to extract entities and generate modules.
 * 
 * Following MVC pattern - this is the Model layer.
 * Follows KISS principle - simple and focused responsibilities.
 * 
 * @module models/ModuleGenerator
 * @version 1.0.0
 */

import { ProjectAbstraction, ClassAbstraction } from '../types/index.js';

/**
 * ModuleGenerator Class
 * 
 * Encapsulates the project abstraction and provides methods to
 * access and process entities for module generation.
 * 
 * @class ModuleGenerator
 * 
 * @example
 * ```typescript
 * const generator = new ModuleGenerator(projectAbstraction);
 * const entities = generator.getEntities();
 * // Returns: [ClassAbstraction(User), ClassAbstraction(Product)]
 * ```
 */
export class ModuleGenerator {
    /**
     * SEON project abstraction containing all project metadata
     * @private
     * @readonly
     */
    private readonly projectAbstraction: ProjectAbstraction;

    /**
     * Creates a new ModuleGenerator instance
     * 
     * @param {ProjectAbstraction} projectAbstraction - SEON project abstraction
     * 
     * @throws {Error} If projectAbstraction is null or undefined
     */
    constructor(projectAbstraction: ProjectAbstraction) {
        if (!projectAbstraction) {
            throw new Error('ProjectAbstraction is required');
        }
        this.projectAbstraction = projectAbstraction;
    }

    /**
     * Extracts all entity classes from the project
     * 
     * Iterates through all packages in the project and collects
     * all class abstractions (entities) to be generated.
     * 
     * @returns {ClassAbstraction[]} Array of entity classes
     * 
     * @example
     * ```typescript
     * const entities = generator.getEntities();
     * // [
     * //   ClassAbstraction { name: 'User', attributes: [...] },
     * //   ClassAbstraction { name: 'Product', attributes: [...] }
     * // ]
     * ```
     */
    public getEntities(): ClassAbstraction[] {
        const entities: ClassAbstraction[] = [];

        // Iterate through all packages in the project
        for (const pkg of this.projectAbstraction.getCoresPackages()) {
            // Extract all classes from each package
            for (const clazz of pkg.getPackageLevelClasses()) {
                entities.push(clazz);
            }
        }

        return entities;
    }

    /**
     * Gets the project abstraction
     * 
     * @returns {ProjectAbstraction} The SEON project abstraction
     */
    public getProjectAbstraction(): ProjectAbstraction {
        return this.projectAbstraction;
    }

    /**
     * Gets the project name
     * 
     * @returns {string} Project name
     */
    public getProjectName(): string {
        return this.projectAbstraction.getProjectName();
    }

    /**
     * Checks if the project has any entities
     * 
     * @returns {boolean} True if project has entities
     */
    public hasEntities(): boolean {
        return this.getEntities().length > 0;
    }

    /**
     * Gets the number of entities in the project
     * 
     * @returns {number} Number of entities
     */
    public getEntityCount(): number {
        return this.getEntities().length;
    }
}
