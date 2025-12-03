/**
 * index.ts
 * 
 * Título: Exportação Central da Camada de Modelos
 * 
 * Descrição:
 * Ponto de entrada único para todas as classes de modelo da biblioteca
 * module-doc-lib. Facilita importações e fornece interface consistente para
 * manipulação orientada a objetos de elementos do modelo de domínio.
 * 
 * Processos:
 * 1. Re-exporta classe DomainModel (modelo raiz)
 * 2. Re-exporta classe ModuleModel (módulos/namespaces)
 * 3. Re-exporta classe EntityModel (entidades de domínio)
 * 4. Re-exporta interfaces de opções e estatísticas
 * 5. Fornece interface OOP unificada
 * 
 * 
 * @module models
 * @author module-doc-lib
 * @version 1.0.0
 * 
 * @example
 * ```typescript
 * // Importação simplificada para consumidores
 * import { 
 *   DomainModel,
 *   ModuleModel,
 *   EntityModel,
 *   type DomainModelOptions,
 *   type ModuleModelOptions,
 *   type EntityModelOptions
 * } from 'module-doc-lib/models';
 * 
 * // Criar modelo completo
 * const model = new DomainModel({
 *   name: 'ECommerce',
 *   version: '1.0.0'
 * });
 * 
 * // Adicionar módulo
 * const vendas = model.addModule({
 *   name: 'Vendas',
 *   description: 'Módulo de vendas'
 * });
 * 
 * // Adicionar entidade
 * const cliente = model.addModule('Vendas').addEntity({
 *   name: 'Cliente'
 * });
 * ```
 */

// ===== Classes de Modelo =====

/**
 * Classe DomainModel
 * 
 * Representa o modelo de domínio completo (raiz da hierarquia).
 * Encapsula tipo Model e fornece API de alto nível para gerenciamento
 * de módulos, elementos abstratos, configurações e validações.
 */
export { DomainModel } from './DomainModel.js';

/**
 * Classe ModuleModel
 * 
 * Representa um módulo (namespace) contendo entidades, enumerações e
 * submódulos relacionados. Suporta hierarquia aninhada de módulos.
 */
export { ModuleModel } from './ModuleModel.js';

/**
 * Classe EntityModel
 * 
 * Representa uma entidade de domínio (classe de negócio) com atributos,
 * relacionamentos e métodos. Suporta herança e validações ISO.
 */
export { EntityModel } from './EntityModel.js';

// ===== Interfaces e Tipos de DomainModel =====

/**
 * Opções para criação de DomainModel
 */
export type {
    DomainModelOptions,
    ValidationError,
    ModelStatistics
} from './DomainModel.js';

// ===== Interfaces e Tipos de ModuleModel =====

/**
 * Opções para criação de ModuleModel
 */
export type {
    ModuleModelOptions,
    ModuleStatistics
} from './ModuleModel.js';

// ===== Interfaces e Tipos de EntityModel =====

/**
 * Opções para criação de EntityModel e manipulação de elementos
 */
export type {
    EntityModelOptions,
    AddAttributeOptions,
    AddRelationOptions,
    AddFunctionOptions,
    EntityStatistics
} from './EntityModel.js';
