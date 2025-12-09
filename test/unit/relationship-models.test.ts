import { describe, it, expect } from 'vitest';
import type { 
  OneToOne, 
  OneToMany, 
  ManyToOne, 
  ManyToMany,
  LocalEntity
} from '../../src/models/model';

describe('OneToOne Relationship', () => {
  it('should create a valid OneToOne relationship', () => {
    const userEntity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'User',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    const profileEntity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'Profile',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    const relation: OneToOne = {
      $type: 'OneToOne',
      $container: userEntity,
      name: 'profile',
      type: { ref: profileEntity }
    };

    expect(relation.$type).toBe('OneToOne');
    expect(relation.name).toBe('profile');
    expect((relation.type as any).ref.name).toBe('Profile');
  });

  it('should support optional comment', () => {
    const relation: OneToOne = {
      $type: 'OneToOne',
      $container: {} as LocalEntity,
      name: 'profile',
      type: {} as any,
      comment: 'User profile information'
    };

    expect(relation.comment).toBe('User profile information');
  });

  it('should support optional fullName', () => {
    const relation: OneToOne = {
      $type: 'OneToOne',
      $container: {} as LocalEntity,
      name: 'profile',
      fullName: 'User.profile',
      type: {} as any
    };

    expect(relation.fullName).toBe('User.profile');
  });
});

describe('OneToMany Relationship', () => {
  it('should create a valid OneToMany relationship', () => {
    const userEntity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'User',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    const postEntity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'Post',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    const relation: OneToMany = {
      $type: 'OneToMany',
      $container: userEntity,
      name: 'posts',
      type: { ref: postEntity }
    };

    expect(relation.$type).toBe('OneToMany');
    expect(relation.name).toBe('posts');
    expect((relation.type as any).ref.name).toBe('Post');
  });

  it('should support optional comment', () => {
    const relation: OneToMany = {
      $type: 'OneToMany',
      $container: {} as LocalEntity,
      name: 'orders',
      type: {} as any,
      comment: 'Customer orders'
    };

    expect(relation.comment).toBe('Customer orders');
  });

  it('should maintain container reference', () => {
    const container: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'Category',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    const relation: OneToMany = {
      $type: 'OneToMany',
      $container: container,
      name: 'products',
      type: {} as any
    };

    expect(relation.$container).toBe(container);
    expect(relation.$container.name).toBe('Category');
  });
});

describe('ManyToOne Relationship', () => {
  it('should create a valid ManyToOne relationship', () => {
    const postEntity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'Post',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    const authorEntity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'User',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    const relation: ManyToOne = {
      $type: 'ManyToOne',
      $container: postEntity,
      name: 'author',
      type: { ref: authorEntity }
    };

    expect(relation.$type).toBe('ManyToOne');
    expect(relation.name).toBe('author');
    expect((relation.type as any).ref.name).toBe('User');
  });

  it('should support full relationship details', () => {
    const relation: ManyToOne = {
      $type: 'ManyToOne',
      $container: {} as LocalEntity,
      name: 'category',
      fullName: 'Product.category',
      comment: 'Product category',
      type: {} as any
    };

    expect(relation.name).toBe('category');
    expect(relation.fullName).toBe('Product.category');
    expect(relation.comment).toBe('Product category');
  });
});

describe('ManyToMany Relationship', () => {
  it('should create a valid ManyToMany relationship', () => {
    const studentEntity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'Student',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    const courseEntity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'Course',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    const relation: ManyToMany = {
      $type: 'ManyToMany',
      $container: studentEntity,
      name: 'courses',
      type: { ref: courseEntity }
    };

    expect(relation.$type).toBe('ManyToMany');
    expect(relation.name).toBe('courses');
    expect((relation.type as any).ref.name).toBe('Course');
  });

  it('should support through/by entity', () => {
    const studentEntity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'Student',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    const enrollmentEntity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'Enrollment',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    const relation: ManyToMany = {
      $type: 'ManyToMany',
      $container: studentEntity,
      name: 'courses',
      type: {} as any,
      by: { ref: enrollmentEntity }
    };

    expect(relation.by).toBeDefined();
    expect((relation.by as any).ref.name).toBe('Enrollment');
  });

  it('should support optional properties', () => {
    const relation: ManyToMany = {
      $type: 'ManyToMany',
      $container: {} as LocalEntity,
      name: 'tags',
      fullName: 'Post.tags',
      comment: 'Post tags',
      type: {} as any
    };

    expect(relation.name).toBe('tags');
    expect(relation.fullName).toBe('Post.tags');
    expect(relation.comment).toBe('Post tags');
  });
});

describe('Complex Relationship Scenarios', () => {
  it('should support multiple relationships in an entity', () => {
    const userEntity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'User',
      attributes: [],
      functions: [],
      relations: [
        {
          $type: 'OneToOne',
          $container: {} as any,
          name: 'profile',
          type: {} as any
        },
        {
          $type: 'OneToMany',
          $container: {} as any,
          name: 'posts',
          type: {} as any
        },
        {
          $type: 'ManyToMany',
          $container: {} as any,
          name: 'followers',
          type: {} as any
        }
      ],
      enumentityatributes: [],
      is_abstract: false
    };

    expect(userEntity.relations).toHaveLength(3);
    expect(userEntity.relations[0].$type).toBe('OneToOne');
    expect(userEntity.relations[1].$type).toBe('OneToMany');
    expect(userEntity.relations[2].$type).toBe('ManyToMany');
  });

  it('should handle bidirectional relationships', () => {
    const userEntity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'User',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    const postEntity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'Post',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    const userToPosts: OneToMany = {
      $type: 'OneToMany',
      $container: userEntity,
      name: 'posts',
      type: { ref: postEntity }
    };

    const postToUser: ManyToOne = {
      $type: 'ManyToOne',
      $container: postEntity,
      name: 'author',
      type: { ref: userEntity }
    };

    userEntity.relations.push(userToPosts);
    postEntity.relations.push(postToUser);

    expect(userEntity.relations[0].$type).toBe('OneToMany');
    expect(postEntity.relations[0].$type).toBe('ManyToOne');
  });

  it('should support self-referencing relationships', () => {
    const categoryEntity: LocalEntity = {
      $type: 'LocalEntity',
      $container: {} as any,
      name: 'Category',
      attributes: [],
      functions: [],
      relations: [],
      enumentityatributes: [],
      is_abstract: false
    };

    const parentRelation: ManyToOne = {
      $type: 'ManyToOne',
      $container: categoryEntity,
      name: 'parent',
      type: { ref: categoryEntity },
      comment: 'Parent category'
    };

    const childrenRelation: OneToMany = {
      $type: 'OneToMany',
      $container: categoryEntity,
      name: 'children',
      type: { ref: categoryEntity },
      comment: 'Child categories'
    };

    categoryEntity.relations.push(parentRelation, childrenRelation);

    expect(categoryEntity.relations).toHaveLength(2);
    expect((categoryEntity.relations[0].type as any).ref.name).toBe('Category');
    expect((categoryEntity.relations[1].type as any).ref.name).toBe('Category');
  });
});
