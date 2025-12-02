/**
 * File System Validation Helpers
 * 
 * Utilities for checking directory and file existence and content.
 * 
 * @module tests/helpers/checkers
 */

import fs from 'fs';
import path from 'path';

/**
 * Checks if a path is a directory
 * 
 * @param {string} dirPath - Path to check
 * @throws {Error} If path is not a directory
 */
export function checkIsDir(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        throw new Error(`Directory does not exist: ${dirPath}`);
    }
    
    if (!fs.statSync(dirPath).isDirectory()) {
        throw new Error(`Path is not a directory: ${dirPath}`);
    }
}

/**
 * Checks if a path is a file
 * 
 * @param {string} filePath - Path to check
 * @throws {Error} If path is not a file
 */
export function checkIsFile(filePath: string): void {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File does not exist: ${filePath}`);
    }
    
    if (!fs.statSync(filePath).isFile()) {
        throw new Error(`Path is not a file: ${filePath}`);
    }
}

/**
 * Checks if a file contains a specific string
 * 
 * @param {string} filePath - Path to the file
 * @param {string} searchString - String to search for
 * @throws {Error} If file doesn't contain the string
 */
export function checkFileContains(filePath: string, searchString: string): void {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File does not exist: ${filePath}`);
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    
    if (!content.includes(searchString)) {
        throw new Error(`File ${filePath} does not contain: "${searchString}"`);
    }
}
