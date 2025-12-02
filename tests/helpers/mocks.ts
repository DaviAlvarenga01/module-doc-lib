/**
 * mocks.ts
 * 
 * Cria abstrações SEON usando classes REAIS da seon-lib-implementation.
 * Usa as mesmas entidades da leds-tools-spark-lib para consistência.
 * 
 * Processos:
 * - createTestProject: cria projeto com Entidade1 (nome, numero) e Entidade2 (nome, verificacao)
 * - createEmptyProject: cria projeto vazio para teste de edge cases
 * - Usa ProjectAbstraction, PackageAbstraction, ClassAbstraction reais
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
