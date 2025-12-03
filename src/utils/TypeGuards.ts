/**
 * TypeGuards.ts
 * 
 * Título: Verificadores de Tipo (Type Guards)
 * 
 * Descrição:
 * Fornece funções de verificação de tipo (type guards) para todos os elementos
 * do modelo de domínio. Type guards permitem ao TypeScript refinar tipos em
 * tempo de compilação, garantindo type-safety ao trabalhar com estruturas
 * polimórficas como a AST (Abstract Syntax Tree).
 * 
 * Processos:
 * 1. Verifica propriedade $type dos elementos
 * 2. Refina tipo para TypeScript em tempo de compilação
 * 3. Habilita acesso seguro a propriedades específicas do tipo
 * 4. Facilita pattern matching e discriminação de tipos
 * 
 * @module utils/TypeGuards
 * @author module-doc-lib
 * @version 1.0.0
 */

import type {
    Model,
    Module,
    LocalEntity,
    Attribute,
    EnumX,
    AttributeEnum,
    FunctionEntity,
    Parameter,
    OneToOne,
    OneToMany,
    ManyToOne,
    ManyToMany,
    Relation,
    Entity,
    AbstractElement,
    Configuration
} from '../types/index.js';

/**
 * isModel
 * 
 * Título: Verificador de Tipo Model
 * 
 * Descrição:
 * Verifica se um objeto é do tipo Model (raiz da hierarquia).
 * Type guard que permite ao TypeScript refinar o tipo automaticamente.
 * 
 * Processos:
 * 1. Verifica se objeto não é nulo/undefined
 * 2. Verifica se possui propriedade $type
 * 3. Compara $type com 'Model'
 * 4. Retorna boolean com type predicate
 * 
 * Casos de uso:
 * - Navegação na AST até encontrar raiz
 * - Processamento de elementos polimórficos
 * - Validação de estrutura antes de operações
 * 
 * @param item - Objeto a ser verificado
 * @returns true se item é Model, false caso contrário
 * 
 * @example
 * ```typescript
 * function processElement(element: AstNode) {
 *   if (isModel(element)) {
 *     // TypeScript sabe que element é Model aqui
 *     console.log(element.abstractElements);
 *     console.log(element.configuration);
 *   }
 * }
 * ```
 */
export function isModel(item: any): item is Model {
    return item != null && typeof item === 'object' && item.$type === 'Model';
}

/**
 * isModule
 * 
 * Título: Verificador de Tipo Module
 * 
 * Descrição:
 * Verifica se um objeto é do tipo Module (container de entidades).
 * 
 * @param item - Objeto a ser verificado
 * @returns true se item é Module
 * 
 * @example
 * ```typescript
 * if (isModule(element)) {
 *   console.log(element.name);      // QualifiedName
 *   console.log(element.elements);  // Array<AbstractElement>
 * }
 * ```
 */
export function isModule(item: any): item is Module {
    return item != null && typeof item === 'object' && item.$type === 'Module';
}

/**
 * isLocalEntity
 * 
 * Título: Verificador de Tipo LocalEntity
 * 
 * Descrição:
 * Verifica se um objeto é do tipo LocalEntity (entidade de domínio).
 * 
 * @param item - Objeto a ser verificado
 * @returns true se item é LocalEntity
 * 
 * @example
 * ```typescript
 * if (isLocalEntity(element)) {
 *   console.log(element.attributes);  // Array<Attribute>
 *   console.log(element.relations);   // Array<Relation>
 *   console.log(element.functions);   // Array<FunctionEntity>
 * }
 * ```
 */
export function isLocalEntity(item: any): item is LocalEntity {
    return item != null && typeof item === 'object' && item.$type === 'LocalEntity';
}

/**
 * isAttribute
 * 
 * Título: Verificador de Tipo Attribute
 * 
 * Descrição:
 * Verifica se um objeto é do tipo Attribute (propriedade de entidade).
 * 
 * @param item - Objeto a ser verificado
 * @returns true se item é Attribute
 * 
 * @example
 * ```typescript
 * if (isAttribute(element)) {
 *   console.log(element.type);    // DATATYPE ou Reference<EnumX>
 *   console.log(element.unique);  // boolean
 *   console.log(element.blank);   // boolean
 * }
 * ```
 */
export function isAttribute(item: any): item is Attribute {
    return item != null && typeof item === 'object' && item.$type === 'Attribute';
}

/**
 * isEnumX
 * 
 * Título: Verificador de Tipo EnumX
 * 
 * Descrição:
 * Verifica se um objeto é do tipo EnumX (enumeração).
 * 
 * @param item - Objeto a ser verificado
 * @returns true se item é EnumX
 * 
 * @example
 * ```typescript
 * if (isEnumX(element)) {
 *   console.log(element.literals);  // Array<AttributeEnum>
 * }
 * ```
 */
export function isEnumX(item: any): item is EnumX {
    return item != null && typeof item === 'object' && item.$type === 'EnumX';
}

/**
 * isAttributeEnum
 * 
 * Título: Verificador de Tipo AttributeEnum
 * 
 * Descrição:
 * Verifica se um objeto é do tipo AttributeEnum (literal de enumeração).
 * 
 * @param item - Objeto a ser verificado
 * @returns true se item é AttributeEnum
 * 
 * @example
 * ```typescript
 * if (isAttributeEnum(element)) {
 *   console.log(element.name);   // string
 *   console.log(element.value);  // number | undefined
 * }
 * ```
 */
export function isAttributeEnum(item: any): item is AttributeEnum {
    return item != null && typeof item === 'object' && item.$type === 'AttributeEnum';
}

/**
 * isFunctionEntity
 * 
 * Título: Verificador de Tipo FunctionEntity
 * 
 * Descrição:
 * Verifica se um objeto é do tipo FunctionEntity (método de entidade).
 * 
 * @param item - Objeto a ser verificado
 * @returns true se item é FunctionEntity
 * 
 * @example
 * ```typescript
 * if (isFunctionEntity(element)) {
 *   console.log(element.parameters);  // Array<Parameter>
 *   console.log(element.response);    // tipo de retorno
 * }
 * ```
 */
export function isFunctionEntity(item: any): item is FunctionEntity {
    return item != null && typeof item === 'object' && item.$type === 'FunctionEntity';
}

/**
 * isParameter
 * 
 * Título: Verificador de Tipo Parameter
 * 
 * Descrição:
 * Verifica se um objeto é do tipo Parameter (parâmetro de função).
 * 
 * @param item - Objeto a ser verificado
 * @returns true se item é Parameter
 * 
 * @example
 * ```typescript
 * if (isParameter(element)) {
 *   console.log(element.name);  // string
 *   console.log(element.type);  // tipo do parâmetro
 * }
 * ```
 */
export function isParameter(item: any): item is Parameter {
    return item != null && typeof item === 'object' && item.$type === 'Parameter';
}

/**
 * isOneToOne
 * 
 * Título: Verificador de Tipo OneToOne
 * 
 * Descrição:
 * Verifica se um objeto é do tipo OneToOne (relacionamento 1:1).
 * 
 * @param item - Objeto a ser verificado
 * @returns true se item é OneToOne
 * 
 * @example
 * ```typescript
 * if (isOneToOne(relation)) {
 *   console.log(relation.opposite);  // string | undefined
 *   console.log(relation.required);  // boolean | undefined
 * }
 * ```
 */
export function isOneToOne(item: any): item is OneToOne {
    return item != null && typeof item === 'object' && item.$type === 'OneToOne';
}

/**
 * isOneToMany
 * 
 * Título: Verificador de Tipo OneToMany
 * 
 * Descrição:
 * Verifica se um objeto é do tipo OneToMany (relacionamento 1:N).
 * 
 * @param item - Objeto a ser verificado
 * @returns true se item é OneToMany
 * 
 * @example
 * ```typescript
 * if (isOneToMany(relation)) {
 *   console.log(relation.cascade);  // boolean | undefined
 *   console.log(relation.eager);    // boolean | undefined
 * }
 * ```
 */
export function isOneToMany(item: any): item is OneToMany {
    return item != null && typeof item === 'object' && item.$type === 'OneToMany';
}

/**
 * isManyToOne
 * 
 * Título: Verificador de Tipo ManyToOne
 * 
 * Descrição:
 * Verifica se um objeto é do tipo ManyToOne (relacionamento N:1).
 * 
 * @param item - Objeto a ser verificado
 * @returns true se item é ManyToOne
 * 
 * @example
 * ```typescript
 * if (isManyToOne(relation)) {
 *   console.log(relation.required);  // boolean | undefined
 *   console.log(relation.eager);     // boolean | undefined
 * }
 * ```
 */
export function isManyToOne(item: any): item is ManyToOne {
    return item != null && typeof item === 'object' && item.$type === 'ManyToOne';
}

/**
 * isManyToMany
 * 
 * Título: Verificador de Tipo ManyToMany
 * 
 * Descrição:
 * Verifica se um objeto é do tipo ManyToMany (relacionamento N:M).
 * 
 * @param item - Objeto a ser verificado
 * @returns true se item é ManyToMany
 * 
 * @example
 * ```typescript
 * if (isManyToMany(relation)) {
 *   console.log(relation.joinTable);  // string | undefined
 *   console.log(relation.cascade);    // boolean | undefined
 * }
 * ```
 */
export function isManyToMany(item: any): item is ManyToMany {
    return item != null && typeof item === 'object' && item.$type === 'ManyToMany';
}

/**
 * isRelation
 * 
 * Título: Verificador Genérico de Relação
 * 
 * Descrição:
 * Verifica se um objeto é qualquer tipo de relacionamento (OneToOne,
 * OneToMany, ManyToOne ou ManyToMany).
 * 
 * Processos:
 * 1. Testa contra todos os tipos de relação
 * 2. Retorna true se for qualquer um deles
 * 3. Type guard para tipo união Relation
 * 
 * Casos de uso:
 * - Processamento genérico de relacionamentos
 * - Filtragem de elementos por categoria
 * - Validação de estrutura
 * 
 * @param item - Objeto a ser verificado
 * @returns true se item é algum tipo de Relation
 * 
 * @example
 * ```typescript
 * if (isRelation(element)) {
 *   // element é OneToOne | OneToMany | ManyToOne | ManyToMany
 *   console.log(element.name);    // comum a todos
 *   console.log(element.entity);  // comum a todos
 * }
 * ```
 */
export function isRelation(item: any): item is Relation {
    return isOneToOne(item) || isOneToMany(item) || 
           isManyToOne(item) || isManyToMany(item);
}

/**
 * isEntity
 * 
 * Título: Verificador Genérico de Entidade
 * 
 * Descrição:
 * Verifica se um objeto é qualquer tipo de entidade (atualmente apenas
 * LocalEntity, mas preparado para expansão futura).
 * 
 * @param item - Objeto a ser verificado
 * @returns true se item é Entity
 * 
 * @example
 * ```typescript
 * if (isEntity(element)) {
 *   // element é Entity (LocalEntity | outras futuras)
 *   console.log(element.name);
 * }
 * ```
 */
export function isEntity(item: any): item is Entity {
    return isLocalEntity(item);
}

/**
 * isAbstractElement
 * 
 * Título: Verificador de Elemento Abstrato
 * 
 * Descrição:
 * Verifica se um objeto é qualquer tipo de elemento abstrato que pode
 * estar contido em um Model ou Module (Module, LocalEntity, EnumX).
 * 
 * Processos:
 * 1. Verifica contra Module, LocalEntity e EnumX
 * 2. Retorna true se for qualquer um deles
 * 3. Type guard para tipo união AbstractElement
 * 
 * Casos de uso:
 * - Iteração sobre elementos de um módulo
 * - Processamento genérico de elementos
 * - Validação de containers
 * 
 * @param item - Objeto a ser verificado
 * @returns true se item é AbstractElement
 * 
 * @example
 * ```typescript
 * for (const element of module.elements) {
 *   if (isAbstractElement(element)) {
 *     // element é Module | LocalEntity | EnumX
 *     console.log(element.$type);
 *   }
 * }
 * ```
 */
export function isAbstractElement(item: any): item is AbstractElement {
    return isModule(item) || isLocalEntity(item) || isEnumX(item);
}

/**
 * isConfiguration
 * 
 * Título: Verificador de Configuração
 * 
 * Descrição:
 * Verifica se um objeto é do tipo Configuration. Como Configuration não
 * possui propriedade $type (não é AstNode), verifica pela estrutura.
 * 
 * Processos:
 * 1. Verifica se é objeto não-nulo
 * 2. Verifica presença de propriedades típicas de Configuration
 * 3. Retorna true se parecer ser Configuration
 * 
 * Casos de uso:
 * - Validação de configurações de modelo
 * - Processamento de metadados de geração
 * 
 * @param item - Objeto a ser verificado
 * @returns true se item parece ser Configuration
 * 
 * @example
 * ```typescript
 * if (isConfiguration(item)) {
 *   console.log(item.backendLanguage);
 *   console.log(item.frontendFramework);
 * }
 * ```
 */
export function isConfiguration(item: any): item is Configuration {
    return item != null && 
           typeof item === 'object' && 
           (item.name !== undefined || 
            item.backendLanguage !== undefined ||
            item.frontendFramework !== undefined ||
            item.database !== undefined);
}

/**
 * hasContainer
 * 
 * Título: Verificador de Container
 * 
 * Descrição:
 * Verifica se um objeto possui propriedade $container (é um nó filho
 * na AST e não a raiz).
 * 
 * Processos:
 * 1. Verifica se objeto tem propriedade $container
 * 2. Verifica se $container não é undefined
 * 3. Retorna boolean
 * 
 * Casos de uso:
 * - Navegação na AST
 * - Verificação se elemento não é raiz
 * - Validação de hierarquia
 * 
 * @param item - Objeto a ser verificado
 * @returns true se item tem container
 * 
 * @example
 * ```typescript
 * if (hasContainer(element)) {
 *   const parent = element.$container;
 *   console.log('Parent:', parent.$type);
 * }
 * ```
 */
export function hasContainer(item: any): boolean {
    return item != null && 
           typeof item === 'object' && 
           '$container' in item && 
           item.$container !== undefined;
}
