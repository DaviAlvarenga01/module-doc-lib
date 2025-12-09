import { describe, it, expect } from 'vitest';
import type {
  UseCase,
  UseCasesModel,
  Event,
  Model
} from '../../src/models/model';
import type { Actor } from '../../src/models/actor';

describe('UseCasesModel', () => {
  it('should create a valid UseCasesModel', () => {
    const model: Model = {
      $type: 'Model',
      abstractElements: []
    };

    const useCasesModel: UseCasesModel = {
      $type: 'UseCasesModel',
      $container: model,
      id: 'user.management',
      elements: []
    };

    expect(useCasesModel.$type).toBe('UseCasesModel');
    expect(useCasesModel.id).toBe('user.management');
    expect(useCasesModel.elements).toEqual([]);
  });

  it('should support optional comment', () => {
    const useCasesModel: UseCasesModel = {
      $type: 'UseCasesModel',
      $container: {} as Model,
      id: 'authentication',
      comment: 'Authentication use cases',
      elements: []
    };

    expect(useCasesModel.comment).toBe('Authentication use cases');
  });

  it('should contain use case elements', () => {
    const useCase: UseCase = {
      $type: 'UseCase',
      $container: {} as any,
      id: 'login',
      name_fragment: 'Login',
      actors: [],
      events: []
    };

    const useCasesModel: UseCasesModel = {
      $type: 'UseCasesModel',
      $container: {} as Model,
      id: 'auth',
      elements: [useCase]
    };

    expect(useCasesModel.elements).toHaveLength(1);
    expect(useCasesModel.elements[0].$type).toBe('UseCase');
  });
});

describe('UseCase', () => {
  it('should create a valid UseCase', () => {
    const actor: Actor = {
      $type: 'Actor',
      $container: {} as any,
      id: 'user'
    };

    const useCase: UseCase = {
      $type: 'UseCase',
      $container: {} as UseCasesModel,
      id: 'create.user',
      name_fragment: 'Create User',
      actors: [{ ref: actor }],
      events: []
    };

    expect(useCase.$type).toBe('UseCase');
    expect(useCase.id).toBe('create.user');
    expect(useCase.name_fragment).toBe('Create User');
    expect(useCase.actors).toHaveLength(1);
  });

  it('should support optional description', () => {
    const useCase: UseCase = {
      $type: 'UseCase',
      $container: {} as UseCasesModel,
      id: 'login',
      name_fragment: 'Login',
      description: 'User authentication process',
      actors: [],
      events: []
    };

    expect(useCase.description).toBe('User authentication process');
  });

  it('should support optional comment', () => {
    const useCase: UseCase = {
      $type: 'UseCase',
      $container: {} as UseCasesModel,
      id: 'register',
      name_fragment: 'Register',
      comment: 'New user registration',
      actors: [],
      events: []
    };

    expect(useCase.comment).toBe('New user registration');
  });

  it('should support inheritance with superType', () => {
    const baseUseCase: UseCase = {
      $type: 'UseCase',
      $container: {} as UseCasesModel,
      id: 'base.auth',
      name_fragment: 'Base Auth',
      actors: [],
      events: []
    };

    const derivedUseCase: UseCase = {
      $type: 'UseCase',
      $container: {} as UseCasesModel,
      id: 'oauth.login',
      name_fragment: 'OAuth Login',
      superType: { ref: baseUseCase },
      actors: [],
      events: []
    };

    expect(derivedUseCase.superType).toBeDefined();
    expect((derivedUseCase.superType as any).ref.id).toBe('base.auth');
  });

  it('should contain multiple actors', () => {
    const actor1: Actor = {
      $type: 'Actor',
      $container: {} as any,
      id: 'admin'
    };

    const actor2: Actor = {
      $type: 'Actor',
      $container: {} as any,
      id: 'user'
    };

    const useCase: UseCase = {
      $type: 'UseCase',
      $container: {} as UseCasesModel,
      id: 'manage.permissions',
      name_fragment: 'Manage Permissions',
      actors: [{ ref: actor1 }, { ref: actor2 }],
      events: []
    };

    expect(useCase.actors).toHaveLength(2);
  });
});

describe('Actor', () => {
  it('should create a valid Actor', () => {
    const actor: Actor = {
      $type: 'Actor',
      $container: {} as UseCasesModel,
      id: 'customer'
    };

    expect(actor.$type).toBe('Actor');
    expect(actor.id).toBe('customer');
  });

  it('should support optional comment', () => {
    const actor: Actor = {
      $type: 'Actor',
      $container: {} as UseCasesModel,
      id: 'admin',
      comment: 'System administrator'
    };

    expect(actor.comment).toBe('System administrator');
  });

  it('should support optional fullName', () => {
    const actor: Actor = {
      $type: 'Actor',
      $container: {} as UseCasesModel,
      id: 'user',
      fullName: 'system.user'
    };

    expect(actor.fullName).toBe('system.user');
  });

  it('should support inheritance with superType', () => {
    const baseActor: Actor = {
      $type: 'Actor',
      $container: {} as UseCasesModel,
      id: 'user'
    };

    const adminActor: Actor = {
      $type: 'Actor',
      $container: {} as UseCasesModel,
      id: 'admin',
      superType: { ref: baseActor }
    };

    expect(adminActor.superType).toBeDefined();
    expect((adminActor.superType as any).ref.id).toBe('user');
  });
});

describe('Event', () => {
  it('should create a valid Event', () => {
    const event: Event = {
      $type: 'Event',
      $container: {} as UseCase,
      id: 'evt1',
      depends: []
    };

    expect(event.$type).toBe('Event');
    expect(event.id).toBe('evt1');
    expect(event.depends).toEqual([]);
  });

  it('should support optional action', () => {
    const event: Event = {
      $type: 'Event',
      $container: {} as UseCase,
      id: 'evt2',
      action: 'validate credentials',
      depends: []
    };

    expect(event.action).toBe('validate credentials');
  });

  it('should support optional description', () => {
    const event: Event = {
      $type: 'Event',
      $container: {} as UseCase,
      id: 'evt3',
      description: 'User enters credentials',
      depends: []
    };

    expect(event.description).toBe('User enters credentials');
  });

  it('should support optional name_fragment', () => {
    const event: Event = {
      $type: 'Event',
      $container: {} as UseCase,
      id: 'evt4',
      name_fragment: 'Submit Form',
      depends: []
    };

    expect(event.name_fragment).toBe('Submit Form');
  });

  it('should support event dependencies', () => {
    const event1: Event = {
      $type: 'Event',
      $container: {} as UseCase,
      id: 'evt1',
      action: 'Enter credentials',
      depends: []
    };

    const event2: Event = {
      $type: 'Event',
      $container: {} as UseCase,
      id: 'evt2',
      action: 'Validate credentials',
      depends: [{ ref: event1 }]
    };

    const event3: Event = {
      $type: 'Event',
      $container: {} as UseCase,
      id: 'evt3',
      action: 'Grant access',
      depends: [{ ref: event2 }]
    };

    expect(event2.depends).toHaveLength(1);
    expect(event3.depends).toHaveLength(1);
    expect((event2.depends[0] as any).ref.id).toBe('evt1');
  });

  it('should support multiple dependencies', () => {
    const event1: Event = {
      $type: 'Event',
      $container: {} as UseCase,
      id: 'evt1',
      depends: []
    };

    const event2: Event = {
      $type: 'Event',
      $container: {} as UseCase,
      id: 'evt2',
      depends: []
    };

    const event3: Event = {
      $type: 'Event',
      $container: {} as UseCase,
      id: 'evt3',
      depends: [{ ref: event1 }, { ref: event2 }]
    };

    expect(event3.depends).toHaveLength(2);
  });
});

describe('UseCase with Events Flow', () => {
  it('should create a complete use case with event flow', () => {
    const actor: Actor = {
      $type: 'Actor',
      $container: {} as UseCasesModel,
      id: 'user'
    };

    const event1: Event = {
      $type: 'Event',
      $container: {} as UseCase,
      id: 'evt1',
      action: 'Open login page',
      depends: []
    };

    const event2: Event = {
      $type: 'Event',
      $container: {} as UseCase,
      id: 'evt2',
      action: 'Enter credentials',
      depends: [{ ref: event1 }]
    };

    const event3: Event = {
      $type: 'Event',
      $container: {} as UseCase,
      id: 'evt3',
      action: 'Submit form',
      depends: [{ ref: event2 }]
    };

    const useCase: UseCase = {
      $type: 'UseCase',
      $container: {} as UseCasesModel,
      id: 'user.login',
      name_fragment: 'User Login',
      description: 'User authentication workflow',
      actors: [{ ref: actor }],
      events: [event1, event2, event3]
    };

    expect(useCase.events).toHaveLength(3);
    expect(useCase.events[0].action).toBe('Open login page');
    expect(useCase.events[1].depends).toHaveLength(1);
    expect(useCase.events[2].depends).toHaveLength(1);
  });
});

describe('Complex UseCasesModel Scenarios', () => {
  it('should create a complete use cases model with multiple use cases', () => {
    const adminActor: Actor = {
      $type: 'Actor',
      $container: {} as UseCasesModel,
      id: 'admin'
    };

    const userActor: Actor = {
      $type: 'Actor',
      $container: {} as UseCasesModel,
      id: 'user'
    };

    const loginUseCase: UseCase = {
      $type: 'UseCase',
      $container: {} as UseCasesModel,
      id: 'login',
      name_fragment: 'Login',
      actors: [{ ref: userActor }],
      events: []
    };

    const manageUsersUseCase: UseCase = {
      $type: 'UseCase',
      $container: {} as UseCasesModel,
      id: 'manage.users',
      name_fragment: 'Manage Users',
      actors: [{ ref: adminActor }],
      events: []
    };

    const useCasesModel: UseCasesModel = {
      $type: 'UseCasesModel',
      $container: {} as Model,
      id: 'user.management',
      comment: 'User management system',
      elements: [loginUseCase, manageUsersUseCase]
    };

    expect(useCasesModel.elements).toHaveLength(2);
    expect(useCasesModel.elements[0].id).toBe('login');
    expect(useCasesModel.elements[1].id).toBe('manage.users');
  });
});
