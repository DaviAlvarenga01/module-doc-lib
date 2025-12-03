/**
 * index.ts
 * 
 * Título: Exportação Central da Camada de Utilitários
 * 
 * Descrição:
 * Ponto de entrada único para todas as funções utilitárias da biblioteca
 * module-doc-lib. Facilita importações e mantém interface consistente para
 * bibliotecas consumidoras (leds-tools-andes e leds-tools-spark-lib).
 * 
 * Processos:
 * 1. Re-exporta todos os utilitários de StringUtils
 * 2. Re-exporta todos os utilitários de PathUtils
 * 3. Re-exporta todos os TypeGuards
 * 4. Re-exporta todos os utilitários de AstUtils
 * 5. Re-exporta todos os utilitários de GraphUtils
 * 6. Re-exporta todos os utilitários de RelationUtils
 * 7. Re-exporta todos os utilitários de TemplateUtils
 * 8. Fornece interface unificada de importação
 * 
 * 
 * @module utils
 * @author module-doc-lib
 * @version 1.0.0
 * 
 * @example
 * ```typescript
 * // Importação simplificada para consumidores
 * import { 
 *   capitalizeString,
 *   createPath,
 *   isLocalEntity,
 *   getQualifiedName,
 *   topologicalSort,
 *   processRelations,
 *   expandToString
 * } from 'module-doc-lib/utils';
 * ```
 */

// ===== String Utilities (StringUtils) =====
export {
    capitalizeString,
    uncapitalizeString,
    toSnakeCase,
    toPascalCase,
    toCamelCase,
    sanitizeIdentifier,
    pluralize
} from './StringUtils.js';

// ===== Path Utilities (PathUtils) =====
export {
    createPath,
    ensureDirectory,
    normalizePath,
    joinPaths,
    getRelativePath,
    getFileExtension,
    getFileName,
    getDirectoryName,
    ident_size,
    base_ident
} from './PathUtils.js';

// ===== Type Guards (TypeGuards) =====
export {
    isModel,
    isModule,
    isLocalEntity,
    isAttribute,
    isEnumX,
    isAttributeEnum,
    isFunctionEntity,
    isParameter,
    isOneToOne,
    isOneToMany,
    isManyToOne,
    isManyToMany,
    isRelation,
    isEntity,
    isAbstractElement,
    isConfiguration,
    hasContainer
} from './TypeGuards.js';

// ===== AST Utilities (AstUtils) =====
export {
    getQualifiedName,
    getContainer,
    findRootModel,
    findContainerOfType,
    getAllEntities,
    getAllModules,
    findEntityByName,
    resolveReference,
    getPath
} from './AstUtils.js';

// ===== Graph Utilities (GraphUtils) =====
export {
    Graph,
    topologicalSort,
    detectCycle,
    type Dependency,
    type Node
} from './GraphUtils.js';

// ===== Relation Utilities (RelationUtils) =====
export {
    processRelations,
    getRelationsForEntity,
    findOwnedRelations,
    findRelationByTarget,
    hasCircularRelation,
    type RelationTypeString,
    type RelationInfo
} from './RelationUtils.js';

// ===== Template Utilities (TemplateUtils) =====
export {
    expandToString,
    expandToStringWithNL,
    toString,
    indent,
    unindent,
    joinLines,
    trimEmptyLines,
    CompositeGeneratorNode,
    type Generated
} from './TemplateUtils.js';
