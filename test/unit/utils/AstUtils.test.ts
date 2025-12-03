/**
 * AstUtils.test.ts
 * 
 * Unit tests for AstUtils module (REDUZIDO - apenas funções principais)
 * Tests: 10 (ao invés de 25)
 */

import { describe, it, expect } from 'vitest';
import {
  getQualifiedName,
  getContainer,
  findRootModel,
  getPath
} from '../../../src/utils/AstUtils';
import type { Model, Module, LocalEntity } from '../../../src/types';

describe('AstUtils', () => {

  // Helper: Criar modelo mock básico
  function createMockModel(name: string): any {
    return {
      $type: 'Model',
      name,
      abstractElements: []
    };
  }

  // Helper: Criar módulo mock básico
  function createMockModule(name: string, parent?: any): any {
    return {
      $type: 'Module',
      name,
      elements: [],
      $container: parent
    };
  }

  // Helper: Criar entidade mock básica
  function createMockEntity(name: string, container: any): any {
    return {
      $type: 'LocalEntity',
      name,
      attributes: [],
      relations: [],
      functions: [],
      is_abstract: false,
      $container: container
    };
  }

  describe('getQualifiedName', () => {
    it('deve retornar nome qualificado', () => {
      const model = createMockModel('Sistema');
      const module = createMockModule('vendas', model);
      const entity = createMockEntity('Cliente', module);
      
      const qname = getQualifiedName(entity);
      
      expect(typeof qname).toBe('string');
      expect(qname).toContain('Cliente');
    });

    it('deve incluir hierarquia de módulos', () => {
      const model = createMockModel('Sistema');
      const parentModule = createMockModule('financeiro', model);
      const childModule = createMockModule('pagamentos', parentModule);
      const entity = createMockEntity('Boleto', childModule);
      
      const qname = getQualifiedName(entity);
      
      expect(qname).toContain('Boleto');
      // Deve conter algum separador indicando hierarquia
      expect(qname.includes('.') || qname.includes('/')).toBe(true);
    });
  });

  describe('getContainer', () => {
    it('deve retornar container de um nó', () => {
      const module = createMockModule('vendas');
      const entity = createMockEntity('Produto', module);
      
      const container = getContainer(entity);
      
      expect(container).toBe(module);
    });

    it('deve retornar undefined para nó sem container', () => {
      const model = createMockModel('Sistema');
      
      const container = getContainer(model);
      
      expect(container).toBeUndefined();
    });
  });

  describe('findRootModel', () => {
    it('deve encontrar modelo raiz navegando pela hierarquia', () => {
      const model = createMockModel('Sistema');
      const module = createMockModule('vendas', model);
      const entity = createMockEntity('Cliente', module);
      
      const root = findRootModel(entity);
      
      expect(root).toBeDefined();
      expect(root?.$type).toBe('Model');
    });

    it('deve retornar o próprio modelo se já é raiz', () => {
      const model = createMockModel('Sistema');
      
      const root = findRootModel(model);
      
      expect(root).toBe(model);
    });

    it('deve retornar undefined para nó órfão', () => {
      const orphanNode = {
        $type: 'LocalEntity',
        name: 'Orphan'
        // Sem $container
      };
      
      const root = findRootModel(orphanNode as any);
      
      expect(root).toBeUndefined();
    });
  });

  describe('getPath', () => {
    it('deve construir caminho até a raiz', () => {
      const model = createMockModel('Sistema');
      const module = createMockModule('vendas', model);
      const entity = createMockEntity('Cliente', module);
      
      const path = getPath(entity);
      
      expect(path.length).toBeGreaterThan(0);
      expect(path[0]).toBe(entity);
      expect(path[path.length - 1]).toBe(model);
    });

    it('deve retornar array com apenas o nó se não tem container', () => {
      const model = createMockModel('Sistema');
      
      const path = getPath(model);
      
      expect(path).toHaveLength(1);
      expect(path[0]).toBe(model);
    });

    it('deve incluir todos os níveis hierárquicos', () => {
      const model = createMockModel('Sistema');
      const parentModule = createMockModule('financeiro', model);
      const childModule = createMockModule('pagamentos', parentModule);
      const entity = createMockEntity('Boleto', childModule);
      
      const path = getPath(entity);
      
      // Deve incluir: entity, childModule, parentModule, model
      expect(path.length).toBeGreaterThanOrEqual(4);
      expect(path).toContain(entity);
      expect(path).toContain(childModule);
      expect(path).toContain(parentModule);
      expect(path).toContain(model);
    });
  });
});
