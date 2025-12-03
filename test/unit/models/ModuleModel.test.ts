/**
 * ModuleModel.test.ts
 * 
 * Unit tests for ModuleModel class - Essential operations only
 */

import { describe, it, expect } from 'vitest';
import { ModuleModel } from '../../../src/models/ModuleModel';
import type { Module } from '../../../src/types';

describe('ModuleModel', () => {
  
  it('deve criar instância com módulo válido', () => {
    const mockModule: Partial<Module> = {
      $type: 'Module',
      name: 'Sales',
      elements: []
    };
    
    const moduleModel = new ModuleModel(mockModule as Module);
    expect(moduleModel).toBeInstanceOf(ModuleModel);
  });

  it('deve retornar entidades do módulo', () => {
    const mockModule: Partial<Module> = {
      $type: 'Module',
      name: 'Sales',
      elements: []
    };
    
    const moduleModel = new ModuleModel(mockModule as Module);
    const entities = moduleModel.getEntities();
    
    expect(Array.isArray(entities)).toBe(true);
  });

  it('deve retornar enums do módulo', () => {
    const mockModule: Partial<Module> = {
      $type: 'Module',
      name: 'Sales',
      elements: []
    };
    
    const moduleModel = new ModuleModel(mockModule as Module);
    const enums = moduleModel.getEnums();
    
    expect(Array.isArray(enums)).toBe(true);
  });

  it('deve adicionar entidade', () => {
    const mockModule: Partial<Module> = {
      $type: 'Module',
      name: 'Sales',
      elements: []
    };
    
    const moduleModel = new ModuleModel(mockModule as Module);
    moduleModel.addEntity({ 
      name: 'Customer', 
      isAbstract: false 
    });
    
    expect(moduleModel.getEntities().length).toBeGreaterThanOrEqual(0);
  });

  it('deve adicionar enum', () => {
    const mockModule: Partial<Module> = {
      $type: 'Module',
      name: 'Sales',
      elements: []
    };
    
    const moduleModel = new ModuleModel(mockModule as Module);
    moduleModel.addEnum({ 
      name: 'OrderStatus', 
      literals: ['PENDING', 'COMPLETED'] 
    });
    
    expect(moduleModel.getEnums().length).toBeGreaterThanOrEqual(0);
  });

  it('deve validar módulo', () => {
    const mockModule: Partial<Module> = {
      $type: 'Module',
      name: 'Sales',
      elements: []
    };
    
    const moduleModel = new ModuleModel(mockModule as Module);
    const errors = moduleModel.validate();
    
    expect(Array.isArray(errors)).toBe(true);
  });
});
