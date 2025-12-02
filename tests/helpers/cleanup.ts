/**
 * cleanup.ts
 * 
 * Utilitários para limpeza de artefatos de teste.
 * Remove diretórios e arquivos gerados durante testes.
 * 
 * Processos:
 * - deleteFolderRecursive: deleta pasta e todo seu conteúdo recursivamente
 * - Usa fs.rmSync com recursive e force para garantir limpeza completa
 */

import fs from 'fs';
import path from 'path';

/**
 * Recursively deletes a folder and all its contents
 * 
 * @param {string} folderPath - Path to the folder to delete
 */
export function deleteFolderRecursive(folderPath: string): void {
    if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true, force: true });
    }
}
