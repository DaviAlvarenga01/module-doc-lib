/**
 * DomainModel.test.ts
 * 
 * Unit tests for DomainModel class - Essential operations only
 */

import { describe, it, expect } from 'vitest';
import { DomainModel } from '../../../src/models/DomainModel';

describe('DomainModel', () => {
  
  it('deve criar modelo com opções básicas', () => {
    const model = new DomainModel({ 
      name: 'TestDomain',
      version: '1.0.0'
    });
    
    expect(model).toBeInstanceOf(DomainModel);
    expect(model.getAllModules()).toEqual([]);
  });

  it('deve adicionar módulo corretamente', () => {
    const model = new DomainModel({ name: 'TestDomain' });
    
    model.addModule({ name: 'Sales', description: 'Sales module' });
    
    expect(model.getAllModules()).toHaveLength(1);
    expect(model.getAllModules()[0].name).toBe('Sales');
  });

  it('deve buscar módulo por nome', () => {
    const model = new DomainModel({ name: 'TestDomain' });
    model.addModule({ name: 'Sales' });
    
    const found = model.getModule('Sales');
    expect(found).toBeDefined();
    expect(found?.name).toBe('Sales');
  });

  it('deve remover módulo', () => {
    const model = new DomainModel({ name: 'TestDomain' });
    model.addModule({ name: 'Sales' });
    
    const removed = model.removeModule('Sales');
    expect(removed).toBe(true);
    expect(model.getAllModules()).toHaveLength(0);
  });

  it('deve retornar todas as entidades do modelo', () => {
    const model = new DomainModel({ name: 'TestDomain' });
    const entities = model.getAllEntities();
    
    expect(Array.isArray(entities)).toBe(true);
  });

  it('deve validar modelo', () => {
    const model = new DomainModel({ name: 'TestDomain', version: '1.0.0' });
    const errors = model.validate();
    
    expect(Array.isArray(errors)).toBe(true);
  });

  it('deve serializar para JSON', () => {
    const model = new DomainModel({ name: 'TestDomain' });
    const json = model.toJSON();
    
    expect(json).toBeDefined();
    expect(typeof json).toBe('object');
  });
});
