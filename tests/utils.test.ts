/**
 * Utilities Tests
 * 
 * Test suite for utility functions (template strings and file operations).
 * 
 * @module tests/utils
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { expandToString, createPath, writeFile, pathExists, capitalizeString } from '../src/utils/index.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('Template String Utilities', () => {
    describe('expandToString', () => {
        test('Should process simple template literal', () => {
            const result = expandToString`Hello World`;
            expect(result).toBe('Hello World');
        });

        test('Should interpolate values correctly', () => {
            const name = 'Test';
            const result = expandToString`Hello ${name}`;
            expect(result).toBe('Hello Test');
        });

        test('Should handle multiline strings', () => {
            const result = expandToString`Line 1
Line 2
Line 3`;
            expect(result).toContain('Line 1');
            expect(result).toContain('Line 2');
            expect(result).toContain('Line 3');
        });

        test('Should use platform-specific EOL', () => {
            const result = expandToString`Line 1
Line 2`;
            const eol = os.EOL;
            expect(result).toContain(eol);
        });
    });
});

describe('File System Utilities', () => {
    const testDir = path.join(__dirname, 'test-temp');

    beforeEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    describe('createPath', () => {
        test('Should create a directory', () => {
            const dirPath = path.join(testDir, 'newdir');
            const result = createPath(dirPath);
            
            expect(fs.existsSync(dirPath)).toBe(true);
            expect(fs.statSync(dirPath).isDirectory()).toBe(true);
            expect(result).toBe(dirPath);
        });

        test('Should create nested directories', () => {
            const dirPath = path.join(testDir, 'level1', 'level2', 'level3');
            createPath(dirPath);
            
            expect(fs.existsSync(dirPath)).toBe(true);
            expect(fs.statSync(dirPath).isDirectory()).toBe(true);
        });

        test('Should not throw if directory already exists', () => {
            const dirPath = path.join(testDir, 'existing');
            createPath(dirPath);
            
            expect(() => createPath(dirPath)).not.toThrow();
        });
    });

    describe('writeFile', () => {
        test('Should write content to a file', () => {
            const filePath = path.join(testDir, 'test.txt');
            const content = 'Hello World';
            
            writeFile(filePath, content);
            
            expect(fs.existsSync(filePath)).toBe(true);
            expect(fs.readFileSync(filePath, 'utf-8')).toBe(content);
        });

        test('Should create parent directories if they do not exist', () => {
            const filePath = path.join(testDir, 'nested', 'deep', 'file.txt');
            const content = 'Test content';
            
            writeFile(filePath, content);
            
            expect(fs.existsSync(filePath)).toBe(true);
            expect(fs.readFileSync(filePath, 'utf-8')).toBe(content);
        });

        test('Should overwrite existing files', () => {
            const filePath = path.join(testDir, 'overwrite.txt');
            
            writeFile(filePath, 'Original');
            writeFile(filePath, 'Updated');
            
            expect(fs.readFileSync(filePath, 'utf-8')).toBe('Updated');
        });
    });

    describe('pathExists', () => {
        test('Should return true for existing directory', () => {
            createPath(testDir);
            expect(pathExists(testDir)).toBe(true);
        });

        test('Should return true for existing file', () => {
            const filePath = path.join(testDir, 'exists.txt');
            createPath(testDir);
            fs.writeFileSync(filePath, 'content');
            
            expect(pathExists(filePath)).toBe(true);
        });

        test('Should return false for non-existing path', () => {
            const nonExistentPath = path.join(testDir, 'does-not-exist');
            expect(pathExists(nonExistentPath)).toBe(false);
        });
    });

    describe('capitalizeString', () => {
        test('Should capitalize first letter', () => {
            expect(capitalizeString('hello')).toBe('Hello');
        });

        test('Should handle already capitalized strings', () => {
            expect(capitalizeString('Hello')).toBe('Hello');
        });

        test('Should handle single character', () => {
            expect(capitalizeString('a')).toBe('A');
        });

        test('Should handle empty string', () => {
            expect(capitalizeString('')).toBe('');
        });

        test('Should preserve rest of the string', () => {
            expect(capitalizeString('helloWorld')).toBe('HelloWorld');
        });
    });
});
