/**
 * Model Tests
 * 
 * Test suite for the ModuleGenerator Model class.
 * Validates entity extraction, project abstraction handling, and business logic.
 * 
 * @module tests/models
 */

import { describe, test, expect } from 'vitest';
import { ModuleGenerator } from '../src/models/ModuleGenerator.js';
import { createTestProject, createEmptyProject } from './helpers/mocks.js';

describe('ModuleGenerator Model', () => {
    describe('Constructor', () => {
        test('Should create instance with valid ProjectAbstraction', () => {
            const project = createTestProject();
            const generator = new ModuleGenerator(project);
            
            expect(generator).toBeInstanceOf(ModuleGenerator);
        });

        test('Should throw error when ProjectAbstraction is null', () => {
            expect(() => new ModuleGenerator(null as any))
                .toThrow('ProjectAbstraction is required');
        });

        test('Should throw error when ProjectAbstraction is undefined', () => {
            expect(() => new ModuleGenerator(undefined as any))
                .toThrow('ProjectAbstraction is required');
        });
    });

    describe('getEntities', () => {
        test('Should return all entities from project', () => {
            const project = createTestProject();
            const generator = new ModuleGenerator(project);
            const entities = generator.getEntities();
            
            expect(entities).toHaveLength(2);
            expect(entities[0].getName()).toBe('Entidade1');
            expect(entities[1].getName()).toBe('Entidade2');
        });

        test('Should return empty array when project has no entities', () => {
            const emptyProject = createEmptyProject();
            const generator = new ModuleGenerator(emptyProject);
            const entities = generator.getEntities();
            
            expect(entities).toHaveLength(0);
            expect(entities).toEqual([]);
        });
    });

    describe('getProjectName', () => {
        test('Should return project name from abstraction', () => {
            const project = createTestProject();
            const generator = new ModuleGenerator(project);
            
            expect(generator.getProjectName()).toBe('Test');
        });

        test('Should return correct name for empty project', () => {
            const emptyProject = createEmptyProject();
            const generator = new ModuleGenerator(emptyProject);
            
            expect(generator.getProjectName()).toBe('EmptyProject');
        });
    });

    describe('hasEntities', () => {
        test('Should return true when project has entities', () => {
            const project = createTestProject();
            const generator = new ModuleGenerator(project);
            
            expect(generator.hasEntities()).toBe(true);
        });

        test('Should return false when project has no entities', () => {
            const emptyProject = createEmptyProject();
            const generator = new ModuleGenerator(emptyProject);
            
            expect(generator.hasEntities()).toBe(false);
        });
    });

    describe('getEntityCount', () => {
        test('Should return correct count of entities', () => {
            const project = createTestProject();
            const generator = new ModuleGenerator(project);
            
            expect(generator.getEntityCount()).toBe(2);
        });

        test('Should return 0 for empty project', () => {
            const emptyProject = createEmptyProject();
            const generator = new ModuleGenerator(emptyProject);
            
            expect(generator.getEntityCount()).toBe(0);
        });
    });

    describe('getProjectAbstraction', () => {
        test('Should return the same project abstraction instance', () => {
            const project = createTestProject();
            const generator = new ModuleGenerator(project);
            
            const abstraction = generator.getProjectAbstraction();
            expect(abstraction).toBe(project);
        });
    });
});
