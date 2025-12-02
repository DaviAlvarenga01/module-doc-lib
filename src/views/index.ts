/**
 * index.ts (views)
 * 
 * Índice de exportação de todos os geradores de código.
 * Cada gerador é responsável por criar partes específicas da estrutura do módulo.
 * 
 * Processos:
 * - Exporta ApiGenerator, ControllerGenerator, RouteGenerator
 * - Exporta TypeGenerator, ViewGenerator
 */

export * as ApiGenerator from './ApiGenerator.js';
export * as ControllerGenerator from './ControllerGenerator.js';
export * as RouteGenerator from './RouteGenerator.js';
export * as TypeGenerator from './TypeGenerator.js';
export * as ViewGenerator from './ViewGenerator.js';
