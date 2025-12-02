/**
 * index.ts (utils)
 * 
 * Índice de exportação de todas as funções utilitárias.
 * Utilitários são usados em toda a biblioteca para operações comuns.
 * 
 * Processos:
 * - Exporta expandToString para template strings
 * - Exporta createPath, writeFile, pathExists, capitalizeString para sistema de arquivos
 */

export { expandToString } from './template-string.js';
export { createPath, writeFile, pathExists, capitalizeString } from './file-utils.js';
