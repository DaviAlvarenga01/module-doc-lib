import { describe, it, expect } from 'vitest';
import {
  isModel,
  isModule,
  isConfiguration,
  isUseCasesModel,
  isUseCase,
  isEnumX,
  isManyToMany,
  isManyToOne,
  isOneToMany,
  isOneToOne,
  isParameter,
  isElement,
  isEnumEntityAtribute,
  isEvent,
  isModuleImport,
} from '../../src/models/model';
import { isActor } from '../../src/models/actor';
import { isAttribute, isAttributeEnum } from '../../src/models/atribute';
import { isFunctionEntity, isImportedEntity, isLocalEntity } from '../../src/models/entity';

describe('Type Guards - Model Types', () => {
  it('should identify Model type correctly', () => {
    const validModel = { $type: 'Model', abstractElements: [] };
    const invalidModel = { $type: 'NotModel' };
    
    expect(isModel(validModel)).toBe(true);
    expect(isModel(invalidModel)).toBe(false);
    expect(isModel(null)).toBeFalsy();
    expect(isModel(undefined)).toBeFalsy();
  });

  it('should identify Module type correctly', () => {
    const validModule = { $type: 'Module', name: 'test.module', elements: [] };
    const invalidModule = { $type: 'NotModule' };
    
    expect(isModule(validModule)).toBe(true);
    expect(isModule(invalidModule)).toBe(false);
  });

  it('should identify Configuration type correctly', () => {
    const validConfig = { $type: 'Configuration', $container: {} as any };
    const invalidConfig = { $type: 'NotConfiguration' };
    
    expect(isConfiguration(validConfig)).toBe(true);
    expect(isConfiguration(invalidConfig)).toBe(false);
  });
});

describe('Type Guards - Use Case Types', () => {
  it('should identify UseCasesModel type correctly', () => {
    const validUseCasesModel = { $type: 'UseCasesModel', id: 'test.usecase', elements: [] };
    const invalidUseCasesModel = { $type: 'NotUseCasesModel' };
    
    expect(isUseCasesModel(validUseCasesModel)).toBe(true);
    expect(isUseCasesModel(invalidUseCasesModel)).toBe(false);
  });

  it('should identify UseCase type correctly', () => {
    const validUseCase = { 
      $type: 'UseCase', 
      id: 'test.usecase',
      name_fragment: 'test',
      actors: [],
      events: []
    };
    
    expect(isUseCase(validUseCase)).toBe(true);
    expect(isUseCase({ $type: 'NotUseCase' })).toBe(false);
  });

  it('should identify Actor type correctly', () => {
    const validActor = { $type: 'Actor', id: 'test.actor' };
    
    expect(isActor(validActor)).toBe(true);
    expect(isActor({ $type: 'NotActor' })).toBe(false);
    expect(isActor({})).toBe(false);
  });

  it('should identify Event type correctly', () => {
    const validEvent = { 
      $type: 'Event',
      id: 'evt1',
      depends: []
    };
    
    expect(isEvent(validEvent)).toBe(true);
    expect(isEvent({ $type: 'NotEvent' })).toBe(false);
  });
});

describe('Type Guards - Entity Types', () => {
  it('should identify LocalEntity type correctly', () => {
    const validEntity = {
      $type: 'LocalEntity',
      name: 'User',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };
    
    expect(isLocalEntity(validEntity)).toBe(true);
    expect(isLocalEntity({ $type: 'NotLocalEntity' })).toBe(false);
  });

  it('should identify ImportedEntity type correctly', () => {
    const validEntity = { $type: 'ImportedEntity', name: 'ImportedUser' };
    
    expect(isImportedEntity(validEntity)).toBe(true);
    expect(isImportedEntity({ $type: 'NotImportedEntity' })).toBe(false);
  });

  it('should identify FunctionEntity type correctly', () => {
    const validFunction = {
      $type: 'FunctionEntity',
      name: 'calculateTotal',
      paramters: [],
      response: 'decimal' as const
    };
    
    expect(isFunctionEntity(validFunction)).toBe(true);
    expect(isFunctionEntity({ $type: 'NotFunctionEntity' })).toBe(false);
  });
});

describe('Type Guards - Attribute Types', () => {
  it('should identify Attribute type correctly', () => {
    const validAttribute = {
      $type: 'Attribute',
      name: 'email',
      type: 'email' as const,
      blank: false,
      unique: true
    };
    
    expect(isAttribute(validAttribute)).toBe(true);
    expect(isAttribute({ $type: 'NotAttribute' })).toBe(false);
  });

  it('should identify AttributeEnum type correctly', () => {
    const validAttrEnum = {
      $type: 'AttributeEnum',
      name: 'ACTIVE'
    };
    
    expect(isAttributeEnum(validAttrEnum)).toBe(true);
    expect(isAttributeEnum({ $type: 'NotAttributeEnum' })).toBe(false);
  });

  it('should identify EnumX type correctly', () => {
    const validEnum = {
      $type: 'EnumX',
      name: 'Status',
      attributes: []
    };
    
    expect(isEnumX(validEnum)).toBe(true);
    expect(isEnumX({ $type: 'NotEnumX' })).toBe(false);
  });

  it('should identify EnumEntityAtribute type correctly', () => {
    const validEnumAttr = {
      $type: 'EnumEntityAtribute',
      name: 'status',
      type: { $type: 'EnumX', name: 'Status', attributes: [] }
    };
    
    expect(isEnumEntityAtribute(validEnumAttr)).toBe(true);
    expect(isEnumEntityAtribute({ $type: 'NotEnumEntityAtribute' })).toBe(false);
  });
});

describe('Type Guards - Relation Types', () => {
  it('should identify OneToOne relation correctly', () => {
    const validRelation = {
      $type: 'OneToOne',
      name: 'profile',
      type: { $type: 'LocalEntity', name: 'Profile' }
    };
    
    expect(isOneToOne(validRelation)).toBe(true);
    expect(isOneToOne({ $type: 'NotOneToOne' })).toBe(false);
  });

  it('should identify OneToMany relation correctly', () => {
    const validRelation = {
      $type: 'OneToMany',
      name: 'posts',
      type: { $type: 'LocalEntity', name: 'Post' }
    };
    
    expect(isOneToMany(validRelation)).toBe(true);
    expect(isOneToMany({ $type: 'NotOneToMany' })).toBe(false);
  });

  it('should identify ManyToOne relation correctly', () => {
    const validRelation = {
      $type: 'ManyToOne',
      name: 'author',
      type: { $type: 'LocalEntity', name: 'User' }
    };
    
    expect(isManyToOne(validRelation)).toBe(true);
    expect(isManyToOne({ $type: 'NotManyToOne' })).toBe(false);
  });

  it('should identify ManyToMany relation correctly', () => {
    const validRelation = {
      $type: 'ManyToMany',
      name: 'tags',
      type: { $type: 'LocalEntity', name: 'Tag' }
    };
    
    expect(isManyToMany(validRelation)).toBe(true);
    expect(isManyToMany({ $type: 'NotManyToMany' })).toBe(false);
  });
});

describe('Type Guards - Other Types', () => {
  it('should identify Parameter type correctly', () => {
    const validParameter = {
      $type: 'Parameter',
      element: []
    };
    
    expect(isParameter(validParameter)).toBe(true);
    expect(isParameter({ $type: 'NotParameter' })).toBe(false);
  });

  it('should identify Element type correctly', () => {
    const validElement = {
      $type: 'Element',
      name: 'id',
      type: 'uuid' as const
    };
    
    expect(isElement(validElement)).toBe(true);
    expect(isElement({ $type: 'NotElement' })).toBe(false);
  });

  it('should identify ModuleImport type correctly', () => {
    const validImport = {
      $type: 'ModuleImport',
      name: 'auth',
      library: 'auth-lib',
      package_path: 'com.example.auth',
      entities: []
    };
    
    expect(isModuleImport(validImport)).toBe(true);
    expect(isModuleImport({ $type: 'NotModuleImport' })).toBe(false);
  });
});

describe('Type Guards - Edge Cases', () => {
  it('should handle null and undefined gracefully', () => {
    expect(isModel(null)).toBeFalsy();
    expect(isModule(undefined)).toBeFalsy();
    expect(isActor(null)).toBeFalsy();
    expect(isAttribute(undefined)).toBeFalsy();
  });

  it('should handle objects without $type property', () => {
    const noType = { name: 'test' };
    
    expect(isModel(noType)).toBe(false);
    expect(isLocalEntity(noType)).toBe(false);
    expect(isAttribute(noType)).toBe(false);
  });

  it('should handle empty objects', () => {
    const empty = {};
    
    expect(isModel(empty)).toBe(false);
    expect(isUseCase(empty)).toBe(false);
    expect(isOneToOne(empty)).toBe(false);
  });
});
