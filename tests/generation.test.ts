/**
 * Module Generation End-to-End Tests
 * 
 * Comprehensive test suite for validating the complete module generation process.
 * Tests directory structure, file creation, and critical content validation.
 * 
 * @module tests/generation
 */

import { afterAll, beforeAll, expect, test, describe } from "vitest";
import { generate } from "../src/controllers/ModuleGeneratorController.js";
import { checkIsDir, checkIsFile, checkFileContains } from "./helpers/checkers.js";
import { deleteFolderRecursive } from "./helpers/cleanup.js";
import { createTestProject } from "./helpers/mocks.js";
import path from 'path';

/**
 * Test project with Entidade1 and Entidade2
 */
const testProject = createTestProject();

/**
 * Output directory for generated modules
 */
const outputDir = path.join(__dirname, 'generated-modules');

/**
 * Setup: Generate modules before all tests
 */
beforeAll(() => {
    generate(testProject, outputDir);
});

/**
 * Cleanup: Remove generated files after all tests
 */
afterAll(() => {
    deleteFolderRecursive(outputDir);
});

/**
 * Expected directory structure
 */
const expectedFolders = [
    outputDir,
    path.join(outputDir, 'Entidade1'),
    path.join(outputDir, 'Entidade1', 'api'),
    path.join(outputDir, 'Entidade1', 'controllers'),
    path.join(outputDir, 'Entidade1', 'routes'),
    path.join(outputDir, 'Entidade1', 'types'),
    path.join(outputDir, 'Entidade1', 'views'),
    path.join(outputDir, 'Entidade2'),
    path.join(outputDir, 'Entidade2', 'api'),
    path.join(outputDir, 'Entidade2', 'controllers'),
    path.join(outputDir, 'Entidade2', 'routes'),
    path.join(outputDir, 'Entidade2', 'types'),
    path.join(outputDir, 'Entidade2', 'views'),
];

/**
 * Expected file structure
 */
const expectedFiles = [
    // Main index
    path.join(outputDir, 'index.ts'),
    
    // Entidade1 files
    path.join(outputDir, 'Entidade1', 'index.ts'),
    path.join(outputDir, 'Entidade1', 'api', 'entidade1.ts'),
    path.join(outputDir, 'Entidade1', 'controllers', 'entidade1.ts'),
    path.join(outputDir, 'Entidade1', 'routes', 'index.ts'),
    path.join(outputDir, 'Entidade1', 'types', 'Entidade1.d.ts'),
    path.join(outputDir, 'Entidade1', 'views', 'Listar.vue'),
    path.join(outputDir, 'Entidade1', 'views', 'Criar.vue'),
    
    // Entidade2 files
    path.join(outputDir, 'Entidade2', 'index.ts'),
    path.join(outputDir, 'Entidade2', 'api', 'entidade2.ts'),
    path.join(outputDir, 'Entidade2', 'controllers', 'entidade2.ts'),
    path.join(outputDir, 'Entidade2', 'routes', 'index.ts'),
    path.join(outputDir, 'Entidade2', 'types', 'Entidade2.d.ts'),
    path.join(outputDir, 'Entidade2', 'views', 'Listar.vue'),
    path.join(outputDir, 'Entidade2', 'views', 'Criar.vue'),
];

describe('Directory Structure', () => {
    test.each(expectedFolders)('Should create directory: %s', (dirPath) => {
        expect(() => checkIsDir(dirPath)).not.toThrow();
    });
});

describe('File Creation', () => {
    test.each(expectedFiles)('Should create file: %s', (filePath) => {
        expect(() => checkIsFile(filePath)).not.toThrow();
    });
});

describe('Main Index File', () => {
    const mainIndexPath = path.join(outputDir, 'index.ts');

    test('Should import RouteRecordRaw from vue-router', () => {
        expect(() => checkFileContains(mainIndexPath, "import { type RouteRecordRaw } from 'vue-router'"))
            .not.toThrow();
    });

    test('Should import Entidade1 routes', () => {
        expect(() => checkFileContains(mainIndexPath, "import { routes as entidade1Route } from './Entidade1'"))
            .not.toThrow();
    });

    test('Should import Entidade2 routes', () => {
        expect(() => checkFileContains(mainIndexPath, "import { routes as entidade2Route } from './Entidade2'"))
            .not.toThrow();
    });

    test('Should export aggregated routes array', () => {
        expect(() => checkFileContains(mainIndexPath, 'export const routes: RouteRecordRaw[] = ['))
            .not.toThrow();
    });
});

describe('API Files - CRUD Operations', () => {
    const entidade1ApiPath = path.join(outputDir, 'Entidade1', 'api', 'entidade1.ts');

    test('Should generate listar function', () => {
        expect(() => checkFileContains(entidade1ApiPath, 'listarEntidade1'))
            .not.toThrow();
    });

    test('Should generate criar function', () => {
        expect(() => checkFileContains(entidade1ApiPath, 'criarEntidade1'))
            .not.toThrow();
    });

    test('Should generate obter function', () => {
        expect(() => checkFileContains(entidade1ApiPath, 'obterEntidade1'))
            .not.toThrow();
    });

    test('Should generate atualizar function', () => {
        expect(() => checkFileContains(entidade1ApiPath, 'atualizarEntidade1'))
            .not.toThrow();
    });

    test('Should generate excluir function', () => {
        expect(() => checkFileContains(entidade1ApiPath, 'excluirEntidade1'))
            .not.toThrow();
    });
});

describe('Controller Files - Error Handling', () => {
    const entidade1ControllerPath = path.join(outputDir, 'Entidade1', 'controllers', 'entidade1.ts');

    test('Should import AxiosError', () => {
        expect(() => checkFileContains(entidade1ControllerPath, 'AxiosError'))
            .not.toThrow();
    });

    test('Should have try/catch blocks', () => {
        expect(() => checkFileContains(entidade1ControllerPath, 'try {'))
            .not.toThrow();
        expect(() => checkFileContains(entidade1ControllerPath, 'catch (error)'))
            .not.toThrow();
    });

    test('Should import from API layer', () => {
        expect(() => checkFileContains(entidade1ControllerPath, "from '../api/entidade1'"))
            .not.toThrow();
    });
});

describe('Route Files - Vue Router', () => {
    const entidade1RoutePath = path.join(outputDir, 'Entidade1', 'routes', 'index.ts');

    test('Should import RouteRecordRaw', () => {
        expect(() => checkFileContains(entidade1RoutePath, 'RouteRecordRaw'))
            .not.toThrow();
    });

    test('Should define home route', () => {
        expect(() => checkFileContains(entidade1RoutePath, 'entidade1-home'))
            .not.toThrow();
    });

    test('Should define criar route', () => {
        expect(() => checkFileContains(entidade1RoutePath, 'entidade1-criar'))
            .not.toThrow();
    });

    test('Should import Listar and Criar components', () => {
        expect(() => checkFileContains(entidade1RoutePath, 'Listar'))
            .not.toThrow();
        expect(() => checkFileContains(entidade1RoutePath, 'Criar'))
            .not.toThrow();
    });
});

describe('Type Definition Files', () => {
    const entidade1TypePath = path.join(outputDir, 'Entidade1', 'types', 'Entidade1.d.ts');

    test('Should define entity interface', () => {
        expect(() => checkFileContains(entidade1TypePath, 'export interface Entidade1'))
            .not.toThrow();
    });

    test('Should define form interface', () => {
        expect(() => checkFileContains(entidade1TypePath, 'export interface Entidade1Form'))
            .not.toThrow();
    });
});

describe('Vue Component Files', () => {
    const listarPath = path.join(outputDir, 'Entidade1', 'views', 'Listar.vue');
    const criarPath = path.join(outputDir, 'Entidade1', 'views', 'Criar.vue');

    test('Listar.vue should have template section', () => {
        expect(() => checkFileContains(listarPath, '<template>'))
            .not.toThrow();
    });

    test('Listar.vue should have script setup', () => {
        expect(() => checkFileContains(listarPath, '<script setup lang="ts">'))
            .not.toThrow();
    });

    test('Listar.vue should have style section', () => {
        expect(() => checkFileContains(listarPath, '<style scoped>'))
            .not.toThrow();
    });

    test('Criar.vue should have form fields', () => {
        expect(() => checkFileContains(criarPath, '<template>'))
            .not.toThrow();
    });

    test('Criar.vue should handle edit mode', () => {
        expect(() => checkFileContains(criarPath, 'isEditMode'))
            .not.toThrow();
    });
});
