/**
 * Test Helpers: Model Builders
 * 
 * Factory functions to create test models, entities, attributes, etc.
 * Makes tests more readable and maintainable.
 */

import {
  Domain,
  Module,
  Entity,
  Attribute,
  Relation,
  EnumX,
  EnumValue,
  Function,
  Parameter,
  Configuration,
  DATATYPE,
  RELATION_TYPE,
  MULTIPLICITY
} from '../../src/types';
import { DomainModel } from '../../src/models/DomainModel';
import { ModuleModel } from '../../src/models/ModuleModel';
import { EntityModel } from '../../src/models/EntityModel';

/**
 * Creates a minimal valid Domain
 */
export function buildDomain(overrides?: Partial<Domain>): Domain {
  return {
    name: 'TestDomain',
    version: '1.0.0',
    modules: [],
    configuration: buildConfiguration(),
    ...overrides
  };
}

/**
 * Creates a minimal valid Module
 */
export function buildModule(overrides?: Partial<Module>): Module {
  return {
    name: 'TestModule',
    entities: [],
    enums: [],
    subModules: [],
    ...overrides
  };
}

/**
 * Creates a minimal valid Entity
 */
export function buildEntity(overrides?: Partial<Entity>): Entity {
  return {
    name: 'TestEntity',
    attributes: [],
    relations: [],
    functions: [],
    ...overrides
  };
}

/**
 * Creates a minimal valid Attribute
 */
export function buildAttribute(overrides?: Partial<Attribute>): Attribute {
  return {
    name: 'testAttribute',
    type: DATATYPE.STRING,
    required: false,
    ...overrides
  };
}

/**
 * Creates a minimal valid Relation
 */
export function buildRelation(overrides?: Partial<Relation>): Relation {
  return {
    name: 'testRelation',
    type: RELATION_TYPE.ASSOCIATION,
    entity: { $ref: '#/modules/TestModule/entities/RelatedEntity' },
    multiplicity: MULTIPLICITY.ONE_TO_MANY,
    ...overrides
  };
}

/**
 * Creates a minimal valid EnumX
 */
export function buildEnum(overrides?: Partial<EnumX>): EnumX {
  return {
    name: 'TestEnum',
    values: [
      { name: 'VALUE_1', value: 'VALUE_1' },
      { name: 'VALUE_2', value: 'VALUE_2' }
    ],
    ...overrides
  };
}

/**
 * Creates a minimal valid EnumValue
 */
export function buildEnumValue(overrides?: Partial<EnumValue>): EnumValue {
  return {
    name: 'TEST_VALUE',
    value: 'TEST_VALUE',
    ...overrides
  };
}

/**
 * Creates a minimal valid Function
 */
export function buildFunction(overrides?: Partial<Function>): Function {
  return {
    name: 'testFunction',
    parameters: [],
    ...overrides
  };
}

/**
 * Creates a minimal valid Parameter
 */
export function buildParameter(overrides?: Partial<Parameter>): Parameter {
  return {
    name: 'testParam',
    type: DATATYPE.STRING,
    ...overrides
  };
}

/**
 * Creates a minimal valid Configuration
 */
export function buildConfiguration(overrides?: Partial<Configuration>): Configuration {
  return {
    generateGetters: true,
    generateSetters: true,
    generateConstructors: true,
    generateToString: true,
    generateEquals: true,
    generateHashCode: true,
    ...overrides
  };
}

/**
 * Creates a complete E-commerce domain for testing
 */
export function buildEcommerceDomain(): Domain {
  const productEntity: Entity = buildEntity({
    name: 'Product',
    attributes: [
      buildAttribute({ name: 'id', type: DATATYPE.INT, required: true }),
      buildAttribute({ name: 'name', type: DATATYPE.STRING, required: true }),
      buildAttribute({ name: 'price', type: DATATYPE.DECIMAL, required: true }),
      buildAttribute({ name: 'stock', type: DATATYPE.INT, required: true })
    ]
  });

  const customerEntity: Entity = buildEntity({
    name: 'Customer',
    attributes: [
      buildAttribute({ name: 'id', type: DATATYPE.INT, required: true }),
      buildAttribute({ name: 'name', type: DATATYPE.STRING, required: true }),
      buildAttribute({ name: 'email', type: DATATYPE.STRING, required: true })
    ]
  });

  const orderEntity: Entity = buildEntity({
    name: 'Order',
    attributes: [
      buildAttribute({ name: 'id', type: DATATYPE.INT, required: true }),
      buildAttribute({ name: 'date', type: DATATYPE.DATE, required: true }),
      buildAttribute({ name: 'total', type: DATATYPE.DECIMAL, required: true })
    ],
    relations: [
      buildRelation({
        name: 'customer',
        entity: { $ref: '#/modules/Sales/entities/Customer' },
        multiplicity: MULTIPLICITY.MANY_TO_ONE,
        type: RELATION_TYPE.ASSOCIATION
      }),
      buildRelation({
        name: 'products',
        entity: { $ref: '#/modules/Catalog/entities/Product' },
        multiplicity: MULTIPLICITY.MANY_TO_MANY,
        type: RELATION_TYPE.ASSOCIATION
      })
    ]
  });

  return buildDomain({
    name: 'Ecommerce',
    modules: [
      buildModule({
        name: 'Catalog',
        entities: [productEntity]
      }),
      buildModule({
        name: 'Sales',
        entities: [customerEntity, orderEntity]
      })
    ]
  });
}

/**
 * Creates a DomainModel from a Domain (OOP wrapper)
 */
export function buildDomainModel(domain?: Domain): DomainModel {
  return new DomainModel(domain || buildDomain());
}

/**
 * Creates a ModuleModel from a Module (OOP wrapper)
 */
export function buildModuleModel(module?: Module): ModuleModel {
  return new ModuleModel(module || buildModule());
}

/**
 * Creates an EntityModel from an Entity (OOP wrapper)
 */
export function buildEntityModel(entity?: Entity): EntityModel {
  return new EntityModel(entity || buildEntity());
}

/**
 * Creates a domain with inheritance hierarchy for testing
 */
export function buildInheritanceDomain(): Domain {
  const personEntity: Entity = buildEntity({
    name: 'Person',
    attributes: [
      buildAttribute({ name: 'id', type: DATATYPE.INT, required: true }),
      buildAttribute({ name: 'name', type: DATATYPE.STRING, required: true })
    ]
  });

  const employeeEntity: Entity = buildEntity({
    name: 'Employee',
    superType: { $ref: '#/modules/HR/entities/Person' },
    attributes: [
      buildAttribute({ name: 'salary', type: DATATYPE.DECIMAL, required: true }),
      buildAttribute({ name: 'position', type: DATATYPE.STRING, required: true })
    ]
  });

  const customerEntity: Entity = buildEntity({
    name: 'Customer',
    superType: { $ref: '#/modules/HR/entities/Person' },
    attributes: [
      buildAttribute({ name: 'loyaltyPoints', type: DATATYPE.INT, required: false })
    ]
  });

  return buildDomain({
    name: 'InheritanceTest',
    modules: [
      buildModule({
        name: 'HR',
        entities: [personEntity, employeeEntity, customerEntity]
      })
    ]
  });
}
