/**
 * TypeGuards.test.ts
 * 
 * Unit tests for TypeGuards module
 * Tests type checking functions for AST elements
 */

import { describe, it, expect } from 'vitest';
import {
  isModel,
  isModule,
  isLocalEntity,
  isAttribute,
  isEnumX,
  isAttributeEnum,
  isFunctionEntity,
  isParameter,
  isOneToOne,
  isOneToMany,
  isManyToOne,
  isManyToMany,
  isRelation,
  isEntity,
  isAbstractElement,
  isConfiguration,
  hasContainer
} from '../../../src/utils/TypeGuards';

describe('TypeGuards', () => {
  
  describe('isModel', () => {
    it('deve retornar true para objeto Model válido', () => {
      const model = { $type: 'Model', abstractElements: [], configuration: {} };
      expect(isModel(model)).toBe(true);
    });

    it('deve retornar false para objeto com $type diferente', () => {
      const notModel = { $type: 'Module', name: 'Test' };
      expect(isModel(notModel)).toBe(false);
    });

    it('deve retornar false para null', () => {
      expect(isModel(null)).toBe(false);
    });

    it('deve retornar false para undefined', () => {
      expect(isModel(undefined)).toBe(false);
    });

    it('deve retornar false para tipos primitivos', () => {
      expect(isModel('Model')).toBe(false);
      expect(isModel(123)).toBe(false);
      expect(isModel(true)).toBe(false);
    });

    it('deve retornar false para objeto sem $type', () => {
      const obj = { name: 'Test', abstractElements: [] };
      expect(isModel(obj)).toBe(false);
    });
  });

  describe('isModule', () => {
    it('deve retornar true para objeto Module válido', () => {
      const module = { $type: 'Module', name: { name: 'TestModule' }, elements: [] };
      expect(isModule(module)).toBe(true);
    });

    it('deve retornar false para objeto com $type diferente', () => {
      const notModule = { $type: 'LocalEntity', name: 'Test' };
      expect(isModule(notModule)).toBe(false);
    });

    it('deve retornar false para null/undefined', () => {
      expect(isModule(null)).toBe(false);
      expect(isModule(undefined)).toBe(false);
    });
  });

  describe('isLocalEntity', () => {
    it('deve retornar true para objeto LocalEntity válido', () => {
      const entity = { 
        $type: 'LocalEntity', 
        name: 'TestEntity',
        attributes: [],
        relations: [],
        functions: []
      };
      expect(isLocalEntity(entity)).toBe(true);
    });

    it('deve retornar false para objeto com $type diferente', () => {
      const notEntity = { $type: 'Module', name: 'Test' };
      expect(isLocalEntity(notEntity)).toBe(false);
    });

    it('deve retornar false para null/undefined', () => {
      expect(isLocalEntity(null)).toBe(false);
      expect(isLocalEntity(undefined)).toBe(false);
    });
  });

  describe('isAttribute', () => {
    it('deve retornar true para objeto Attribute válido', () => {
      const attr = { 
        $type: 'Attribute',
        name: 'testAttr',
        type: 'string',
        unique: false,
        blank: true
      };
      expect(isAttribute(attr)).toBe(true);
    });

    it('deve retornar false para objeto com $type diferente', () => {
      const notAttr = { $type: 'LocalEntity', name: 'Test' };
      expect(isAttribute(notAttr)).toBe(false);
    });
  });

  describe('isEnumX', () => {
    it('deve retornar true para objeto EnumX válido', () => {
      const enumX = { 
        $type: 'EnumX',
        name: 'TestEnum',
        literals: []
      };
      expect(isEnumX(enumX)).toBe(true);
    });

    it('deve retornar false para objeto com $type diferente', () => {
      const notEnum = { $type: 'Attribute', name: 'Test' };
      expect(isEnumX(notEnum)).toBe(false);
    });
  });

  describe('isAttributeEnum', () => {
    it('deve retornar true para objeto AttributeEnum válido', () => {
      const attrEnum = { 
        $type: 'AttributeEnum',
        name: 'VALUE1',
        value: 1
      };
      expect(isAttributeEnum(attrEnum)).toBe(true);
    });

    it('deve retornar false para objeto com $type diferente', () => {
      const notAttrEnum = { $type: 'EnumX', name: 'Test' };
      expect(isAttributeEnum(notAttrEnum)).toBe(false);
    });
  });

  describe('isFunctionEntity', () => {
    it('deve retornar true para objeto FunctionEntity válido', () => {
      const func = { 
        $type: 'FunctionEntity',
        name: 'testFunc',
        parameters: [],
        response: 'void'
      };
      expect(isFunctionEntity(func)).toBe(true);
    });

    it('deve retornar false para objeto com $type diferente', () => {
      const notFunc = { $type: 'Attribute', name: 'Test' };
      expect(isFunctionEntity(notFunc)).toBe(false);
    });
  });

  describe('isParameter', () => {
    it('deve retornar true para objeto Parameter válido', () => {
      const param = { 
        $type: 'Parameter',
        name: 'testParam',
        type: 'string'
      };
      expect(isParameter(param)).toBe(true);
    });

    it('deve retornar false para objeto com $type diferente', () => {
      const notParam = { $type: 'FunctionEntity', name: 'Test' };
      expect(isParameter(notParam)).toBe(false);
    });
  });

  describe('isOneToOne', () => {
    it('deve retornar true para objeto OneToOne válido', () => {
      const rel = { 
        $type: 'OneToOne',
        name: 'testRel',
        entity: { $ref: {} },
        opposite: 'reverse'
      };
      expect(isOneToOne(rel)).toBe(true);
    });

    it('deve retornar false para objeto com $type diferente', () => {
      const notRel = { $type: 'OneToMany', name: 'Test' };
      expect(isOneToOne(notRel)).toBe(false);
    });
  });

  describe('isOneToMany', () => {
    it('deve retornar true para objeto OneToMany válido', () => {
      const rel = { 
        $type: 'OneToMany',
        name: 'testRel',
        entity: { $ref: {} },
        cascade: true
      };
      expect(isOneToMany(rel)).toBe(true);
    });

    it('deve retornar false para objeto com $type diferente', () => {
      const notRel = { $type: 'OneToOne', name: 'Test' };
      expect(isOneToMany(notRel)).toBe(false);
    });
  });

  describe('isManyToOne', () => {
    it('deve retornar true para objeto ManyToOne válido', () => {
      const rel = { 
        $type: 'ManyToOne',
        name: 'testRel',
        entity: { $ref: {} },
        required: true
      };
      expect(isManyToOne(rel)).toBe(true);
    });

    it('deve retornar false para objeto com $type diferente', () => {
      const notRel = { $type: 'OneToMany', name: 'Test' };
      expect(isManyToOne(notRel)).toBe(false);
    });
  });

  describe('isManyToMany', () => {
    it('deve retornar true para objeto ManyToMany válido', () => {
      const rel = { 
        $type: 'ManyToMany',
        name: 'testRel',
        entity: { $ref: {} },
        joinTable: 'test_join'
      };
      expect(isManyToMany(rel)).toBe(true);
    });

    it('deve retornar false para objeto com $type diferente', () => {
      const notRel = { $type: 'ManyToOne', name: 'Test' };
      expect(isManyToMany(notRel)).toBe(false);
    });
  });

  describe('isRelation', () => {
    it('deve retornar true para OneToOne', () => {
      const rel = { $type: 'OneToOne', name: 'test', entity: { $ref: {} } };
      expect(isRelation(rel)).toBe(true);
    });

    it('deve retornar true para OneToMany', () => {
      const rel = { $type: 'OneToMany', name: 'test', entity: { $ref: {} } };
      expect(isRelation(rel)).toBe(true);
    });

    it('deve retornar true para ManyToOne', () => {
      const rel = { $type: 'ManyToOne', name: 'test', entity: { $ref: {} } };
      expect(isRelation(rel)).toBe(true);
    });

    it('deve retornar true para ManyToMany', () => {
      const rel = { $type: 'ManyToMany', name: 'test', entity: { $ref: {} } };
      expect(isRelation(rel)).toBe(true);
    });

    it('deve retornar false para não-relação', () => {
      const notRel = { $type: 'Attribute', name: 'test' };
      expect(isRelation(notRel)).toBe(false);
    });

    it('deve retornar false para null/undefined', () => {
      expect(isRelation(null)).toBe(false);
      expect(isRelation(undefined)).toBe(false);
    });
  });

  describe('isEntity', () => {
    it('deve retornar true para LocalEntity', () => {
      const entity = { 
        $type: 'LocalEntity',
        name: 'Test',
        attributes: [],
        relations: [],
        functions: []
      };
      expect(isEntity(entity)).toBe(true);
    });

    it('deve retornar false para não-entidade', () => {
      const notEntity = { $type: 'Module', name: 'Test' };
      expect(isEntity(notEntity)).toBe(false);
    });
  });

  describe('isAbstractElement', () => {
    it('deve retornar true para Module', () => {
      const module = { $type: 'Module', name: { name: 'Test' }, elements: [] };
      expect(isAbstractElement(module)).toBe(true);
    });

    it('deve retornar true para LocalEntity', () => {
      const entity = { 
        $type: 'LocalEntity',
        name: 'Test',
        attributes: [],
        relations: [],
        functions: []
      };
      expect(isAbstractElement(entity)).toBe(true);
    });

    it('deve retornar true para EnumX', () => {
      const enumX = { $type: 'EnumX', name: 'Test', literals: [] };
      expect(isAbstractElement(enumX)).toBe(true);
    });

    it('deve retornar false para outros tipos', () => {
      const notAbstract = { $type: 'Attribute', name: 'Test' };
      expect(isAbstractElement(notAbstract)).toBe(false);
    });

    it('deve retornar false para null/undefined', () => {
      expect(isAbstractElement(null)).toBe(false);
      expect(isAbstractElement(undefined)).toBe(false);
    });
  });

  describe('isConfiguration', () => {
    it('deve retornar true para Configuration com name', () => {
      const config = { name: 'TestConfig' };
      expect(isConfiguration(config)).toBe(true);
    });

    it('deve retornar true para Configuration com backendLanguage', () => {
      const config = { backendLanguage: 'java' };
      expect(isConfiguration(config)).toBe(true);
    });

    it('deve retornar true para Configuration com frontendFramework', () => {
      const config = { frontendFramework: 'react' };
      expect(isConfiguration(config)).toBe(true);
    });

    it('deve retornar true para Configuration com database', () => {
      const config = { database: 'postgresql' };
      expect(isConfiguration(config)).toBe(true);
    });

    it('deve retornar true para Configuration completa', () => {
      const config = {
        name: 'TestConfig',
        backendLanguage: 'java',
        frontendFramework: 'react',
        database: 'postgresql'
      };
      expect(isConfiguration(config)).toBe(true);
    });

    it('deve retornar false para objeto vazio', () => {
      expect(isConfiguration({})).toBe(false);
    });

    it('deve retornar false para null/undefined', () => {
      expect(isConfiguration(null)).toBe(false);
      expect(isConfiguration(undefined)).toBe(false);
    });

    it('deve retornar false para tipos primitivos', () => {
      expect(isConfiguration('config')).toBe(false);
      expect(isConfiguration(123)).toBe(false);
    });
  });

  describe('hasContainer', () => {
    it('deve retornar true para objeto com $container definido', () => {
      const obj = { 
        $type: 'Attribute',
        name: 'test',
        $container: { $type: 'LocalEntity' }
      };
      expect(hasContainer(obj)).toBe(true);
    });

    it('deve retornar false para objeto com $container undefined', () => {
      const obj = { 
        $type: 'Model',
        $container: undefined
      };
      expect(hasContainer(obj)).toBe(false);
    });

    it('deve retornar false para objeto sem $container', () => {
      const obj = { 
        $type: 'Model',
        name: 'Test'
      };
      expect(hasContainer(obj)).toBe(false);
    });

    it('deve retornar false para null/undefined', () => {
      expect(hasContainer(null)).toBe(false);
      expect(hasContainer(undefined)).toBe(false);
    });

    it('deve retornar false para tipos primitivos', () => {
      expect(hasContainer('test')).toBe(false);
      expect(hasContainer(123)).toBe(false);
    });
  });

  // Testes integrados
  describe('Integração - Hierarquia de tipos', () => {
    it('deve distinguir corretamente entre tipos de relação', () => {
      const oneToOne = { $type: 'OneToOne', name: 'test', entity: { $ref: {} } };
      const oneToMany = { $type: 'OneToMany', name: 'test', entity: { $ref: {} } };
      const manyToOne = { $type: 'ManyToOne', name: 'test', entity: { $ref: {} } };
      const manyToMany = { $type: 'ManyToMany', name: 'test', entity: { $ref: {} } };

      expect(isOneToOne(oneToOne)).toBe(true);
      expect(isOneToMany(oneToOne)).toBe(false);
      expect(isManyToOne(oneToOne)).toBe(false);
      expect(isManyToMany(oneToOne)).toBe(false);

      expect(isOneToMany(oneToMany)).toBe(true);
      expect(isOneToOne(oneToMany)).toBe(false);

      expect(isManyToOne(manyToOne)).toBe(true);
      expect(isOneToMany(manyToOne)).toBe(false);

      expect(isManyToMany(manyToMany)).toBe(true);
      expect(isOneToOne(manyToMany)).toBe(false);
    });

    it('deve identificar qualquer tipo de relação com isRelation', () => {
      const oneToOne = { $type: 'OneToOne', name: 'test', entity: { $ref: {} } };
      const oneToMany = { $type: 'OneToMany', name: 'test', entity: { $ref: {} } };
      const manyToOne = { $type: 'ManyToOne', name: 'test', entity: { $ref: {} } };
      const manyToMany = { $type: 'ManyToMany', name: 'test', entity: { $ref: {} } };

      expect(isRelation(oneToOne)).toBe(true);
      expect(isRelation(oneToMany)).toBe(true);
      expect(isRelation(manyToOne)).toBe(true);
      expect(isRelation(manyToMany)).toBe(true);
    });

    it('deve identificar qualquer elemento abstrato com isAbstractElement', () => {
      const module = { $type: 'Module', name: { name: 'Test' }, elements: [] };
      const entity = { $type: 'LocalEntity', name: 'Test', attributes: [], relations: [], functions: [] };
      const enumX = { $type: 'EnumX', name: 'Test', literals: [] };
      const attribute = { $type: 'Attribute', name: 'Test' };

      expect(isAbstractElement(module)).toBe(true);
      expect(isAbstractElement(entity)).toBe(true);
      expect(isAbstractElement(enumX)).toBe(true);
      expect(isAbstractElement(attribute)).toBe(false);
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('deve lidar com objetos com propriedades extras', () => {
      const model = {
        $type: 'Model',
        abstractElements: [],
        configuration: {},
        extraProp: 'should not affect'
      };
      expect(isModel(model)).toBe(true);
    });

    it('deve lidar com objetos aninhados complexos', () => {
      const entity = {
        $type: 'LocalEntity',
        name: 'Test',
        attributes: [],
        relations: [],
        functions: [],
        nested: {
          deep: {
            property: 'value'
          }
        }
      };
      expect(isLocalEntity(entity)).toBe(true);
    });

    it('deve retornar false para arrays', () => {
      expect(isModel([])).toBe(false);
      expect(isModule([{ $type: 'Module' }])).toBe(false);
    });

    it('deve lidar com objetos prototype-less', () => {
      const obj = Object.create(null);
      obj.$type = 'Model';
      expect(isModel(obj)).toBe(true);
    });
  });

  // Testes de performance (conceituais - não medem tempo real)
  describe('Performance (comportamento)', () => {
    it('deve processar arrays grandes de objetos rapidamente', () => {
      const objects = Array.from({ length: 1000 }, (_, i) => ({
        $type: i % 2 === 0 ? 'Model' : 'Module',
        name: `Test${i}`
      }));

      const models = objects.filter(isModel);
      const modules = objects.filter(isModule);

      expect(models).toHaveLength(500);
      expect(modules).toHaveLength(500);
    });
  });
});
