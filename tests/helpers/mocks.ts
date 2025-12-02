/**
 * Mock Data Helper
 * 
 * Creates SEON abstractions using REAL classes from seon-lib-implementation.
 * Uses the same entities as leds-tools-spark-lib for consistency:
 * - Entidade1: nome (string), numero (integer)
 * - Entidade2: nome (string), verificacao (boolean)
 * 
 * @module tests/helpers/mocks
 */

import { 
    ProjectAbstraction, 
    PackageAbstraction, 
    ClassAbstraction,
    TypeScriptAttribute,
    PrimitiveTypeAbstraction,
    vueModularArchProjectSettings
} from 'seon-lib-implementation';

/**
 * Creates a test project with Entidade1 and Entidade2
 * 
 * @returns {ProjectAbstraction} Test project with 2 entities
 */
export function createTestProject(): ProjectAbstraction {
    return new ProjectAbstraction(
        'Test',
        'Testes dos geradores de módulos',
        vueModularArchProjectSettings,
        [
            new PackageAbstraction('Entidade1', [
                new ClassAbstraction('Entidade1', [], [
                    new TypeScriptAttribute('nome', new PrimitiveTypeAbstraction('string')),
                    new TypeScriptAttribute('numero', new PrimitiveTypeAbstraction('integer')),
                ]),
            ]),
            new PackageAbstraction('Entidade2', [
                new ClassAbstraction('Entidade2', [], [
                    new TypeScriptAttribute('nome', new PrimitiveTypeAbstraction('string')),
                    new TypeScriptAttribute('verificacao', new PrimitiveTypeAbstraction('boolean')),
                ]),
            ]),
        ]
    );
}

/**
 * Creates an empty project for edge case testing
 * 
 * @returns {ProjectAbstraction} Empty project
 */
export function createEmptyProject(): ProjectAbstraction {
    return new ProjectAbstraction(
        'EmptyProject',
        'Project without entities',
        vueModularArchProjectSettings,
        []
    );
}
