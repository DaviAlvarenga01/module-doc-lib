/**
 * Cleanup Helper
 * 
 * Utilities for cleaning up test artifacts.
 * 
 * @module tests/helpers/cleanup
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
