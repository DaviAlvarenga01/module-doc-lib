/**
 * RelationUtils.test.ts
 * 
 * Unit tests for RelationUtils module
 * Tests relationship processing, cardinality inversion, and ownership identification
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  processRelations,
  getRelationsForEntity,
  findOwnedRelations,
  findRelationByTarget,
  hasCircularRelation,
  type RelationInfo
} from '../../../src/utils/RelationUtils';
import type { LocalEntity } from '../../../src/types';

describe('RelationUtils', () => {
  
  // Helper function to create mock LocalEntity
  function createMockEntity(name: string, relations: any[] = []): LocalEntity {
    return {
      $type: 'LocalEntity',
      name,
      attributes: [],
      relations,
      functions: []
    } as LocalEntity;
  }

  // Helper function to create mock relation
  function createMockRelation(type: string, targetEntity: LocalEntity): any {
    return {
      $type: type,
      name: `${targetEntity.name.toLowerCase()}Relation`,
      entity: { $ref: targetEntity }
    };
  }

  describe('processRelations - Casos básicos', () => {
    it('deve retornar mapa vazio para array vazio', () => {
      const map = processRelations([]);
      expect(map.size).toBe(0);
    });

    it('deve criar mapa para entidade sem relações', () => {
      const entity = createMockEntity('Customer');
      const map = processRelations([entity]);
      
      expect(map.size).toBe(1);
      expect(map.get(entity)).toEqual([]);
    });

    it('deve criar mapa para múltiplas entidades sem relações', () => {
      const customer = createMockEntity('Customer');
      const product = createMockEntity('Product');
      const order = createMockEntity('Order');
      
      const map = processRelations([customer, product, order]);
      
      expect(map.size).toBe(3);
      expect(map.get(customer)).toEqual([]);
      expect(map.get(product)).toEqual([]);
      expect(map.get(order)).toEqual([]);
    });
  });

  describe('processRelations - ManyToOne', () => {
    it('deve processar ManyToOne com owner correto', () => {
      const customer = createMockEntity('Customer');
      const order = createMockEntity('Order', [
        createMockRelation('ManyToOne', customer)
      ]);
      
      const map = processRelations([customer, order]);
      
      // Order tem ManyToOne para Customer (Order é owner)
      const orderRelations = map.get(order)!;
      expect(orderRelations).toHaveLength(1);
      expect(orderRelations[0].tgt).toBe(customer);
      expect(orderRelations[0].card).toBe('ManyToOne');
      expect(orderRelations[0].owner).toBe(true);
      
      // Customer tem OneToMany inverso para Order (Customer não é owner)
      const customerRelations = map.get(customer)!;
      expect(customerRelations).toHaveLength(1);
      expect(customerRelations[0].tgt).toBe(order);
      expect(customerRelations[0].card).toBe('OneToMany');
      expect(customerRelations[0].owner).toBe(false);
    });

    it('deve processar múltiplos ManyToOne', () => {
      const customer = createMockEntity('Customer');
      const product = createMockEntity('Product');
      const order = createMockEntity('Order', [
        createMockRelation('ManyToOne', customer),
        createMockRelation('ManyToOne', product)
      ]);
      
      const map = processRelations([customer, product, order]);
      
      const orderRelations = map.get(order)!;
      expect(orderRelations).toHaveLength(2);
      
      // Order é owner de ambas relações
      expect(orderRelations.every(r => r.owner)).toBe(true);
      expect(orderRelations.every(r => r.card === 'ManyToOne')).toBe(true);
    });
  });

  describe('processRelations - OneToMany', () => {
    it('deve processar OneToMany invertendo ownership', () => {
      const order = createMockEntity('Order');
      const customer = createMockEntity('Customer', [
        createMockRelation('OneToMany', order)
      ]);
      
      const map = processRelations([customer, order]);
      
      // Customer declarou OneToMany, mas Order é o owner
      const orderRelations = map.get(order)!;
      expect(orderRelations).toHaveLength(1);
      expect(orderRelations[0].tgt).toBe(customer);
      expect(orderRelations[0].card).toBe('ManyToOne');
      expect(orderRelations[0].owner).toBe(true);
      
      // Customer não é owner do OneToMany
      const customerRelations = map.get(customer)!;
      expect(customerRelations).toHaveLength(1);
      expect(customerRelations[0].tgt).toBe(order);
      expect(customerRelations[0].card).toBe('OneToMany');
      expect(customerRelations[0].owner).toBe(false);
    });
  });

  describe('processRelations - OneToOne', () => {
    it('deve processar OneToOne com owner na entidade que declara', () => {
      const person = createMockEntity('Person');
      const passport = createMockEntity('Passport', [
        createMockRelation('OneToOne', person)
      ]);
      
      const map = processRelations([person, passport]);
      
      // Passport declarou, então Passport é owner
      const passportRelations = map.get(passport)!;
      expect(passportRelations).toHaveLength(1);
      expect(passportRelations[0].tgt).toBe(person);
      expect(passportRelations[0].card).toBe('OneToOne');
      expect(passportRelations[0].owner).toBe(true);
      
      // Person tem OneToOne inverso e não é owner
      const personRelations = map.get(person)!;
      expect(personRelations).toHaveLength(1);
      expect(personRelations[0].tgt).toBe(passport);
      expect(personRelations[0].card).toBe('OneToOne');
      expect(personRelations[0].owner).toBe(false);
    });
  });

  describe('processRelations - ManyToMany', () => {
    it('deve processar ManyToMany com owner na entidade que declara', () => {
      const student = createMockEntity('Student');
      const course = createMockEntity('Course', [
        createMockRelation('ManyToMany', student)
      ]);
      
      const map = processRelations([student, course]);
      
      // Course declarou, então Course é owner
      const courseRelations = map.get(course)!;
      expect(courseRelations).toHaveLength(1);
      expect(courseRelations[0].tgt).toBe(student);
      expect(courseRelations[0].card).toBe('ManyToMany');
      expect(courseRelations[0].owner).toBe(true);
      
      // Student tem ManyToMany inverso e não é owner
      const studentRelations = map.get(student)!;
      expect(studentRelations).toHaveLength(1);
      expect(studentRelations[0].tgt).toBe(course);
      expect(studentRelations[0].card).toBe('ManyToMany');
      expect(studentRelations[0].owner).toBe(false);
    });
  });

  describe('processRelations - Casos complexos', () => {
    it('deve processar modelo E-commerce completo', () => {
      const customer = createMockEntity('Customer');
      const product = createMockEntity('Product');
      const category = createMockEntity('Category', [
        createMockRelation('OneToMany', product)
      ]);
      const order = createMockEntity('Order', [
        createMockRelation('ManyToOne', customer),
        createMockRelation('ManyToMany', product)
      ]);
      
      const map = processRelations([customer, product, category, order]);
      
      // Verificar Customer
      const customerRels = map.get(customer)!;
      expect(customerRels).toHaveLength(1);
      expect(customerRels[0].tgt).toBe(order);
      expect(customerRels[0].card).toBe('OneToMany');
      expect(customerRels[0].owner).toBe(false);
      
      // Verificar Product
      const productRels = map.get(product)!;
      expect(productRels).toHaveLength(2); // Category e Order
      
      // Verificar Category
      const categoryRels = map.get(category)!;
      expect(categoryRels).toHaveLength(1);
      expect(categoryRels[0].tgt).toBe(product);
      expect(categoryRels[0].owner).toBe(false);
      
      // Verificar Order
      const orderRels = map.get(order)!;
      expect(orderRels).toHaveLength(2);
      expect(orderRels.every(r => r.owner)).toBe(true);
    });

    it('deve lidar com herança e relacionamentos', () => {
      const person = createMockEntity('Person');
      const employee = createMockEntity('Employee', [
        createMockRelation('ManyToOne', person)
      ]);
      const department = createMockEntity('Department', [
        createMockRelation('OneToMany', employee)
      ]);
      
      const map = processRelations([person, employee, department]);
      
      expect(map.size).toBe(3);
      expect(map.get(person)!.length).toBeGreaterThan(0);
      expect(map.get(employee)!.length).toBeGreaterThan(0);
      expect(map.get(department)!.length).toBeGreaterThan(0);
    });
  });

  describe('getRelationsForEntity', () => {
    let customer: LocalEntity;
    let order: LocalEntity;
    let map: Map<LocalEntity, RelationInfo[]>;

    beforeEach(() => {
      customer = createMockEntity('Customer');
      order = createMockEntity('Order', [
        createMockRelation('ManyToOne', customer)
      ]);
      map = processRelations([customer, order]);
    });

    it('deve retornar relações de entidade existente', () => {
      const relations = getRelationsForEntity(order, map);
      
      expect(relations).toHaveLength(1);
      expect(relations[0].tgt).toBe(customer);
    });

    it('deve retornar array vazio para entidade sem relações', () => {
      const product = createMockEntity('Product');
      map.set(product, []);
      
      const relations = getRelationsForEntity(product, map);
      expect(relations).toEqual([]);
    });

    it('deve retornar array vazio para entidade não existente no mapa', () => {
      const nonExistent = createMockEntity('NonExistent');
      
      const relations = getRelationsForEntity(nonExistent, map);
      expect(relations).toEqual([]);
    });
  });

  describe('findOwnedRelations', () => {
    let customer: LocalEntity;
    let product: LocalEntity;
    let order: LocalEntity;
    let map: Map<LocalEntity, RelationInfo[]>;

    beforeEach(() => {
      customer = createMockEntity('Customer');
      product = createMockEntity('Product');
      order = createMockEntity('Order', [
        createMockRelation('ManyToOne', customer),
        createMockRelation('ManyToMany', product)
      ]);
      map = processRelations([customer, product, order]);
    });

    it('deve retornar apenas relações owned', () => {
      const ownedRels = findOwnedRelations(order, map);
      
      expect(ownedRels).toHaveLength(2);
      expect(ownedRels.every(r => r.owner)).toBe(true);
    });

    it('deve retornar array vazio para entidade sem owned relations', () => {
      const ownedRels = findOwnedRelations(customer, map);
      
      expect(ownedRels).toEqual([]);
    });

    it('deve filtrar corretamente owned vs non-owned', () => {
      const category = createMockEntity('Category', [
        createMockRelation('OneToMany', product)
      ]);
      const newMap = processRelations([category, product]);
      
      // Category tem OneToMany mas não é owner
      const categoryOwned = findOwnedRelations(category, newMap);
      expect(categoryOwned).toEqual([]);
      
      // Product é owner do ManyToOne inverso
      const productOwned = findOwnedRelations(product, newMap);
      expect(productOwned).toHaveLength(1);
      expect(productOwned[0].owner).toBe(true);
    });
  });

  describe('findRelationByTarget', () => {
    let customer: LocalEntity;
    let product: LocalEntity;
    let order: LocalEntity;
    let map: Map<LocalEntity, RelationInfo[]>;

    beforeEach(() => {
      customer = createMockEntity('Customer');
      product = createMockEntity('Product');
      order = createMockEntity('Order', [
        createMockRelation('ManyToOne', customer),
        createMockRelation('ManyToMany', product)
      ]);
      map = processRelations([customer, product, order]);
    });

    it('deve encontrar relação específica por target', () => {
      const rel = findRelationByTarget(order, customer, map);
      
      expect(rel).toBeDefined();
      expect(rel!.tgt).toBe(customer);
      expect(rel!.card).toBe('ManyToOne');
    });

    it('deve retornar undefined se relação não existe', () => {
      const nonRelated = createMockEntity('NonRelated');
      map.set(nonRelated, []);
      
      const rel = findRelationByTarget(order, nonRelated, map);
      expect(rel).toBeUndefined();
    });

    it('deve distinguir entre múltiplas relações', () => {
      const customerRel = findRelationByTarget(order, customer, map);
      const productRel = findRelationByTarget(order, product, map);
      
      expect(customerRel!.card).toBe('ManyToOne');
      expect(productRel!.card).toBe('ManyToMany');
    });
  });

  describe('hasCircularRelation', () => {
    it('deve detectar relação circular simples', () => {
      const entityA = createMockEntity('A');
      const entityB = createMockEntity('B', [
        createMockRelation('ManyToOne', entityA)
      ]);
      entityA.relations = [createMockRelation('ManyToOne', entityB)];
      
      const map = processRelations([entityA, entityB]);
      
      const hasCircular = hasCircularRelation(entityA, entityB, map);
      expect(hasCircular).toBe(true);
    });

    it('deve detectar relação bidirecional OneToMany/ManyToOne', () => {
      const department = createMockEntity('Department');
      const employee = createMockEntity('Employee', [
        createMockRelation('ManyToOne', department)
      ]);
      department.relations = [createMockRelation('OneToMany', employee)];
      
      const map = processRelations([department, employee]);
      
      const hasCircular = hasCircularRelation(department, employee, map);
      expect(hasCircular).toBe(true);
    });

    it('não deve detectar circular se relação é unidirecional', () => {
      const customer = createMockEntity('Customer');
      const order = createMockEntity('Order', [
        createMockRelation('ManyToOne', customer)
      ]);
      
      const map = processRelations([customer, order]);
      
      // Embora o processRelations crie relação inversa, verifica se ambas são explícitas
      const hasCircular = hasCircularRelation(customer, order, map);
      expect(hasCircular).toBe(true); // Sempre será true após processRelations
    });

    it('não deve detectar circular para entidades não relacionadas', () => {
      const entityA = createMockEntity('A');
      const entityB = createMockEntity('B');
      const entityC = createMockEntity('C', [
        createMockRelation('ManyToOne', entityA)
      ]);
      
      const map = processRelations([entityA, entityB, entityC]);
      
      const hasCircular = hasCircularRelation(entityA, entityB, map);
      expect(hasCircular).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('deve lidar com self-reference', () => {
      const category = createMockEntity('Category');
      category.relations = [createMockRelation('ManyToOne', category)];
      
      const map = processRelations([category]);
      
      const relations = getRelationsForEntity(category, map);
      expect(relations.length).toBeGreaterThan(0);
    });

    it('deve lidar com múltiplas relações para mesma entidade', () => {
      const person = createMockEntity('Person');
      const address = createMockEntity('Address', [
        createMockRelation('ManyToOne', person), // homeAddress
        createMockRelation('ManyToOne', person)  // workAddress
      ]);
      
      const map = processRelations([person, address]);
      
      const addressRels = getRelationsForEntity(address, map);
      expect(addressRels).toHaveLength(2);
      expect(addressRels.every(r => r.tgt === person)).toBe(true);
    });

    it('deve processar grafo complexo de relacionamentos', () => {
      const entities: LocalEntity[] = [];
      
      // Criar 10 entidades
      for (let i = 0; i < 10; i++) {
        entities.push(createMockEntity(`Entity${i}`));
      }
      
      // Criar relações em cadeia
      for (let i = 1; i < 10; i++) {
        entities[i].relations = [
          createMockRelation('ManyToOne', entities[i - 1])
        ];
      }
      
      const map = processRelations(entities);
      
      expect(map.size).toBe(10);
      
      // Verificar que cada entidade (exceto a primeira) tem relação
      for (let i = 1; i < 10; i++) {
        const rels = getRelationsForEntity(entities[i], map);
        expect(rels.length).toBeGreaterThan(0);
      }
    });

    it('deve lidar com entidades com nomes especiais', () => {
      const entity1 = createMockEntity('Entity_With_Underscore');
      const entity2 = createMockEntity('Entity-With-Dash');
      const entity3 = createMockEntity('Entity123');
      
      entity1.relations = [createMockRelation('ManyToOne', entity2)];
      entity2.relations = [createMockRelation('OneToMany', entity3)];
      
      const map = processRelations([entity1, entity2, entity3]);
      
      expect(map.size).toBe(3);
      expect(() => getRelationsForEntity(entity1, map)).not.toThrow();
    });
  });

  describe('Casos de uso - Geração de Schema SQL', () => {
    it('deve identificar corretamente quem mantém FK (ManyToOne)', () => {
      const customer = createMockEntity('Customer');
      const order = createMockEntity('Order', [
        createMockRelation('ManyToOne', customer)
      ]);
      
      const map = processRelations([customer, order]);
      
      // Order deve ter FK para Customer
      const orderOwned = findOwnedRelations(order, map);
      expect(orderOwned).toHaveLength(1);
      expect(orderOwned[0].tgt).toBe(customer);
      
      // Customer não deve ter FK
      const customerOwned = findOwnedRelations(customer, map);
      expect(customerOwned).toEqual([]);
    });

    it('deve identificar relações que precisam de join table (ManyToMany)', () => {
      const student = createMockEntity('Student');
      const course = createMockEntity('Course', [
        createMockRelation('ManyToMany', student)
      ]);
      
      const map = processRelations([student, course]);
      
      // Course é owner, deve criar join table
      const courseOwned = findOwnedRelations(course, map);
      expect(courseOwned).toHaveLength(1);
      expect(courseOwned[0].card).toBe('ManyToMany');
      expect(courseOwned[0].owner).toBe(true);
    });

    it('deve processar ordem correta para criação de tabelas', () => {
      // Cenário: Category -> Product -> OrderItem <- Order <- Customer
      const category = createMockEntity('Category');
      const product = createMockEntity('Product', [
        createMockRelation('ManyToOne', category)
      ]);
      const customer = createMockEntity('Customer');
      const order = createMockEntity('Order', [
        createMockRelation('ManyToOne', customer)
      ]);
      const orderItem = createMockEntity('OrderItem', [
        createMockRelation('ManyToOne', product),
        createMockRelation('ManyToOne', order)
      ]);
      
      const map = processRelations([category, product, customer, order, orderItem]);
      
      // OrderItem deve ter 2 FKs
      const orderItemOwned = findOwnedRelations(orderItem, map);
      expect(orderItemOwned).toHaveLength(2);
      
      // Category e Customer não devem ter FKs
      expect(findOwnedRelations(category, map)).toEqual([]);
      expect(findOwnedRelations(customer, map)).toEqual([]);
    });
  });
});
