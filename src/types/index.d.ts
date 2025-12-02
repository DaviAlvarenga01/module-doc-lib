/**
 * index.d.ts
 * 
 * Definições de tipos para abstrações da biblioteca SEON.
 * Facilita importação de ProjectAbstraction e ClassAbstraction.
 * 
 * Processos:
 * - Importa tipos da biblioteca seon-lib-implementation
 * - Re-exporta como type aliases para uso interno
 */

import SEON from 'seon-lib-implementation';

/**
 * Entity class type from SEON library
 * Re-exported for convenience
 */
export type ClassAbstraction = SEON.ClassAbstraction;

/**
 * Project abstraction type from SEON library
 * Re-exported for convenience
 */
export type ProjectAbstraction = SEON.ProjectAbstraction;
