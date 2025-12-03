/**
 * index.ts
 * 
 * Título: Ponto de Entrada Principal da Biblioteca module-doc-lib
 * 
 * Descrição:
 * Exportação centralizada de todos os componentes da biblioteca module-doc-lib.
 * Fornece acesso unificado a tipos, utilitários, modelos, controllers e views
 * para manipulação de modelos de domínio compartilhados entre leds-tools-andes
 * e leds-tools-spark-lib.
 * 
 * Arquitetura MVC:
 * - Types: Definições de tipos TypeScript (interfaces, enums, types)
 * - Utils: Funções utilitárias (string, path, AST, graph, etc)
 * - Models: Classes de modelo orientadas a objeto (DomainModel, ModuleModel, EntityModel)
 * - Controllers: Lógica de negócio e orquestração
 * - Views: Formatação e serialização de saída
 * 
 * 
 * @module module-doc-lib
 * @author module-doc-lib
 * @version 1.0.0
 * 
 * @example
 * ```typescript
 * // Importação completa
 * import {
 *   // Types
 *   DATATYPE,
 *   LocalEntity,
 *   Module,
 *   Model,
 *   
 *   // Utils
 *   capitalizeString,
 *   createPath,
 *   isLocalEntity,
 *   getQualifiedName,
 *   
 *   // Models
 *   DomainModel,
 *   ModuleModel,
 *   EntityModel
 * } from 'module-doc-lib';
 * 
 * // Criar modelo
 * const model = new DomainModel({
 *   name: 'SistemaVendas',
 *   version: '1.0.0'
 * });
 * ```
 */

// ===== Versão da Biblioteca =====

/**
 * Versão atual da biblioteca module-doc-lib
 * Segue Semantic Versioning (semver.org)
 */
export const version = '1.0.0';

// ===== Camada Types =====

/**
 * Tipos fundamentais, entidades, relacionamentos, modelos e configurações
 */
export * from './types/index.js';

// ===== Camada Utils =====

/**
 * Funções utilitárias para manipulação de strings, paths, AST,
 * grafos, relacionamentos e templates
 */
export * from './utils/index.js';

// ===== Camada Models =====

/**
 * Classes de modelo orientadas a objeto para manipulação de alto nível
 * do modelo de domínio
 */
export * from './models/index.js';

// ===== Camada Controllers =====

/**
 * Controllers que implementam lógica de negócio de alto nível,
 * coordenando operações sobre modelos
 */
export * from './controllers/index.js';

// ===== Camada Views =====

/**
 * Views para serialização e apresentação de modelos em diferentes formatos
 * (JSON, Markdown, etc)
 */
export * from './views/index.js';