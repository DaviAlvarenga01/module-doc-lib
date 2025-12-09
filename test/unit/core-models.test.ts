import { describe, it, expect } from 'vitest';
import type {
  Model,
  Module,
  Configuration,
  ModuleImport,
  Parameter,
  Element
} from '../../src/models/model';
import type { LocalEntity, ImportedEntity } from '../../src/models/entity';

describe('Model', () => {
  it('should create a valid Model', () => {
    const model: Model = {
      $type: 'Model',
      abstractElements: []
    };

    expect(model.$type).toBe('Model');
    expect(model.abstractElements).toEqual([]);
  });

  it('should support optional configuration', () => {
    const config: Configuration = {
      $type: 'Configuration',
      $container: {} as Model,
      name: 'MyApp',
      language: 'java'
    };

    const model: Model = {
      $type: 'Model',
      abstractElements: [],
      configuration: config
    };

    expect(model.configuration).toBeDefined();
    expect(model.configuration?.name).toBe('MyApp');
  });

  it('should contain abstract elements', () => {
    const module: Module = {
      $type: 'Module',
      $container: {} as Model,
      name: 'user.module',
      elements: []
    };

    const model: Model = {
      $type: 'Model',
      abstractElements: [module]
    };

    expect(model.abstractElements).toHaveLength(1);
    expect(model.abstractElements[0].$type).toBe('Module');
  });
});

describe('Module', () => {
  it('should create a valid Module', () => {
    const module: Module = {
      $type: 'Module',
      $container: {} as Model,
      name: 'user.module',
      elements: []
    };

    expect(module.$type).toBe('Module');
    expect(module.name).toBe('user.module');
    expect(module.elements).toEqual([]);
  });

  it('should support optional comment', () => {
    const module: Module = {
      $type: 'Module',
      $container: {} as Model,
      name: 'auth.module',
      comment: 'Authentication module',
      elements: []
    };

    expect(module.comment).toBe('Authentication module');
  });

  it('should contain entities', () => {
    const entity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'User',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    const module: Module = {
      $type: 'Module',
      $container: {} as Model,
      name: 'user.module',
      elements: [entity]
    };

    expect(module.elements).toHaveLength(1);
    expect(module.elements[0].$type).toBe('LocalEntity');
  });

  it('should support nested modules', () => {
    const childModule: Module = {
      $type: 'Module',
      $container: {} as any,
      name: 'user.auth',
      elements: []
    };

    const parentModule: Module = {
      $type: 'Module',
      $container: {} as Model,
      name: 'user',
      elements: [childModule]
    };

    expect(parentModule.elements).toHaveLength(1);
    expect((parentModule.elements[0] as Module).name).toBe('user.auth');
  });
});

describe('Configuration', () => {
  it('should create a minimal Configuration', () => {
    const config: Configuration = {
      $type: 'Configuration',
      $container: {} as Model
    };

    expect(config.$type).toBe('Configuration');
  });

  it('should support all language types', () => {
    const languages: Array<'csharp-clean-architecture' | 'csharp-minimal-api' | 'java' | 'python'> = [
      'csharp-clean-architecture',
      'csharp-minimal-api',
      'java',
      'python'
    ];

    languages.forEach(lang => {
      const config: Configuration = {
        $type: 'Configuration',
        $container: {} as Model,
        language: lang
      };

      expect(config.language).toBe(lang);
    });
  });

  it('should support project details', () => {
    const config: Configuration = {
      $type: 'Configuration',
      $container: {} as Model,
      name: 'MyApplication',
      description: 'A sample application',
      database_name: 'myapp_db'
    };

    expect(config.name).toBe('MyApplication');
    expect(config.description).toBe('A sample application');
    expect(config.database_name).toBe('myapp_db');
  });

  it('should support entity reference', () => {
    const entity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'User',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    const config: Configuration = {
      $type: 'Configuration',
      $container: {} as Model,
      entity: { ref: entity }
    };

    expect(config.entity).toBeDefined();
    expect((config.entity as any).ref.name).toBe('User');
  });

  it('should support authentication feature', () => {
    const config: Configuration = {
      $type: 'Configuration',
      $container: {} as Model,
      feature: 'authentication'
    };

    expect(config.feature).toBe('authentication');
  });
});

describe('ModuleImport', () => {
  it('should create a valid ModuleImport', () => {
    const moduleImport: ModuleImport = {
      $type: 'ModuleImport',
      $container: {} as Model,
      name: 'external',
      library: 'external-lib',
      package_path: 'com.external',
      entities: []
    };

    expect(moduleImport.$type).toBe('ModuleImport');
    expect(moduleImport.name).toBe('external');
    expect(moduleImport.library).toBe('external-lib');
    expect(moduleImport.package_path).toBe('com.external');
  });

  it('should contain imported entities', () => {
    const importedEntity: ImportedEntity = {
      $type: 'ImportedEntity',
      $container: {} as any,
      name: 'ExternalUser'
    };

    const moduleImport: ModuleImport = {
      $type: 'ModuleImport',
      $container: {} as Model,
      name: 'auth',
      library: 'auth-lib',
      package_path: 'com.auth',
      entities: [importedEntity]
    };

    expect(moduleImport.entities).toHaveLength(1);
    expect(moduleImport.entities[0].name).toBe('ExternalUser');
  });
});

describe('Parameter and Element', () => {
  it('should create a valid Parameter with Element array', () => {
    const element1: Element = {
      $type: 'Element',
      $container: {} as any,
      name: 'id',
      type: 'uuid'
    };

    const element2: Element = {
      $type: 'Element',
      $container: {} as any,
      name: 'name',
      type: 'string'
    };

    const parameter: Parameter = {
      $type: 'Parameter',
      $container: {} as any,
      element: [element1, element2]
    };

    expect(parameter.$type).toBe('Parameter');
    expect(Array.isArray(parameter.element)).toBe(true);
    expect((parameter.element as Element[]).length).toBe(2);
  });

  it('should create a Parameter with single Element', () => {
    const element: Element = {
      $type: 'Element',
      $container: {} as any,
      name: 'id',
      type: 'integer'
    };

    const parameter: Parameter = {
      $type: 'Parameter',
      $container: {} as any,
      element: element
    };

    expect(parameter.$type).toBe('Parameter');
    expect((parameter.element as Element).$type).toBe('Element');
  });

  it('should support Element with comment', () => {
    const element: Element = {
      $type: 'Element',
      $container: {} as any,
      name: 'email',
      type: 'email',
      comment: 'User email address'
    };

    expect(element.comment).toBe('User email address');
  });

  it('should support Parameter with comment', () => {
    const parameter: Parameter = {
      $type: 'Parameter',
      $container: {} as any,
      comment: 'Request parameters',
      element: []
    };

    expect(parameter.comment).toBe('Request parameters');
  });
});

describe('Complex Model Scenarios', () => {
  it('should create a complete model with configuration and modules', () => {
    const entity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'User',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    const module: Module = {
      $type: 'Module',
      $container: {} as Model,
      name: 'user.module',
      elements: [entity]
    };

    const config: Configuration = {
      $type: 'Configuration',
      $container: {} as Model,
      name: 'MyApp',
      language: 'java',
      database_name: 'myapp_db'
    };

    const model: Model = {
      $type: 'Model',
      abstractElements: [module],
      configuration: config
    };

    expect(model.abstractElements).toHaveLength(1);
    expect(model.configuration).toBeDefined();
    expect(model.configuration?.name).toBe('MyApp');
    expect((model.abstractElements[0] as Module).elements).toHaveLength(1);
  });

  it('should support model with imports and local modules', () => {
    const importedEntity: ImportedEntity = {
      $type: 'ImportedEntity',
      $container: {} as any,
      name: 'ExternalAuth'
    };

    const moduleImport: ModuleImport = {
      $type: 'ModuleImport',
      $container: {} as Model,
      name: 'auth',
      library: 'auth-lib',
      package_path: 'com.auth',
      entities: [importedEntity]
    };

    const localModule: Module = {
      $type: 'Module',
      $container: {} as Model,
      name: 'user',
      elements: []
    };

    const model: Model = {
      $type: 'Model',
      abstractElements: [moduleImport, localModule]
    };

    expect(model.abstractElements).toHaveLength(2);
    expect(model.abstractElements[0].$type).toBe('ModuleImport');
    expect(model.abstractElements[1].$type).toBe('Module');
  });
});
