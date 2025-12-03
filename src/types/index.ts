/**
 * index.ts
 * 
 * Título: Exportação Central da Camada de Tipos
 * 
 * Descrição:
 * Ponto de entrada único para todos os tipos definidos na biblioteca module-doc-lib.
 * Facilita importações e mantém interface consistente para bibliotecas consumidoras
 * (leds-tools-andes e leds-tools-spark-lib).
 * 
 * Processos:
 * 1. Re-exporta todos os tipos de CoreTypes (tipos fundamentais)
 * 2. Re-exporta todos os tipos de EntityTypes (entidades e atributos)
 * 3. Re-exporta todos os tipos de RelationTypes (relacionamentos)
 * 4. Fornece interface unificada de importação
 * 
 * Conformidade:
 * - ISO/IEC 25010: Usabilidade através de interface clara
 * - ISO/IEC 12207: Documentação de interface de componente
 * 
 * @module types
 * @author module-doc-lib
 * @version 1.0.0
 * 
 * @example
 * ```typescript
 * // Importação simplificada para consumidores
 * import { 
 *   LocalEntity, 
 *   Attribute, 
 *   DATATYPE, 
 *   OneToMany 
 * } from 'module-doc-lib/types';
 * ```
 */

// ===== Tipos Fundamentais (CoreTypes) =====
export {
    DATATYPE,
    type Reference,
    type Container,
    type QualifiedName,
    type TypeIdentifier,
    type AstNode,
    type Metadata
} from './CoreTypes.js';

// ===== Tipos de Entidades (EntityTypes) =====
export {
    type Entity,
    type AbstractElement,
    type LocalEntity,
    type Attribute,
    type AttributeType,
    type EnumX,
    type AttributeEnum,
    type FunctionEntity,
    type Parameter,
    type Module
} from './EntityTypes.js';

// ===== Tipos de Relacionamentos (RelationTypes) =====
export {
    type Relation,
    type BaseRelation,
    type OneToOne,
    type OneToMany,
    type ManyToOne,
    type ManyToMany,
    RelationType,
    type RelationCardinality
} from './RelationTypes.js';

// ===== Tipos do Modelo (ModelTypes) =====
export {
    type Model,
    type Configuration,
    type DatabaseConfiguration
} from './ModelTypes.js';
