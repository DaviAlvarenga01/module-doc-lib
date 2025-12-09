import { describe, it, expect } from 'vitest';
import type { Attribute, AttributeEnum } from '../../src/models/atribute';
import type { EnumX, LocalEntity } from '../../src/models/model';

describe('Attribute Model', () => {
  it('should create a valid Attribute with all properties', () => {
    const attribute: Attribute = {
      $type: 'Attribute',
      $container: {} as LocalEntity,
      name: 'email',
      type: 'email',
      blank: false,
      unique: true
    };

    expect(attribute.$type).toBe('Attribute');
    expect(attribute.name).toBe('email');
    expect(attribute.type).toBe('email');
    expect(attribute.blank).toBe(false);
    expect(attribute.unique).toBe(true);
  });

  it('should support all DATATYPE values', () => {
    const dataTypes = [
      'boolean', 'cnpj', 'cpf', 'currency', 'date', 'datetime',
      'decimal', 'email', 'file', 'integer', 'mobilePhoneNumber',
      'phoneNumber', 'string', 'uuid', 'void', 'zipcode'
    ] as const;

    dataTypes.forEach(type => {
      const attribute: Attribute = {
        $type: 'Attribute',
        $container: {} as LocalEntity,
        name: `test_${type}`,
        type: type,
        blank: false,
        unique: false
      };

      expect(attribute.type).toBe(type);
    });
  });

  it('should support optional comment property', () => {
    const attribute: Attribute = {
      $type: 'Attribute',
      $container: {} as LocalEntity,
      name: 'age',
      type: 'integer',
      comment: 'User age in years',
      blank: true,
      unique: false
    };

    expect(attribute.comment).toBe('User age in years');
  });

  it('should support optional fullName property', () => {
    const attribute: Attribute = {
      $type: 'Attribute',
      $container: {} as LocalEntity,
      name: 'email',
      fullName: 'user.email',
      type: 'email',
      blank: false,
      unique: true
    };

    expect(attribute.fullName).toBe('user.email');
  });

  it('should support min and max constraints', () => {
    const attribute: Attribute = {
      $type: 'Attribute',
      $container: {} as LocalEntity,
      name: 'quantity',
      type: 'integer',
      min: 1,
      max: 100,
      blank: false,
      unique: false
    };

    expect(attribute.min).toBe(1);
    expect(attribute.max).toBe(100);
  });

  it('should allow blank and non-unique attributes', () => {
    const attribute: Attribute = {
      $type: 'Attribute',
      $container: {} as LocalEntity,
      name: 'description',
      type: 'string',
      blank: true,
      unique: false
    };

    expect(attribute.blank).toBe(true);
    expect(attribute.unique).toBe(false);
  });

  it('should handle Brazilian-specific data types', () => {
    const cpfAttr: Attribute = {
      $type: 'Attribute',
      $container: {} as LocalEntity,
      name: 'cpf',
      type: 'cpf',
      blank: false,
      unique: true
    };

    const cnpjAttr: Attribute = {
      $type: 'Attribute',
      $container: {} as LocalEntity,
      name: 'cnpj',
      type: 'cnpj',
      blank: false,
      unique: true
    };

    const zipcodeAttr: Attribute = {
      $type: 'Attribute',
      $container: {} as LocalEntity,
      name: 'cep',
      type: 'zipcode',
      blank: false,
      unique: false
    };

    expect(cpfAttr.type).toBe('cpf');
    expect(cnpjAttr.type).toBe('cnpj');
    expect(zipcodeAttr.type).toBe('zipcode');
  });
});

describe('AttributeEnum Model', () => {
  it('should create a valid AttributeEnum', () => {
    const attrEnum: AttributeEnum = {
      $type: 'AttributeEnum',
      $container: {} as EnumX,
      name: 'ACTIVE'
    };

    expect(attrEnum.$type).toBe('AttributeEnum');
    expect(attrEnum.name).toBe('ACTIVE');
  });

  it('should support optional comment', () => {
    const attrEnum: AttributeEnum = {
      $type: 'AttributeEnum',
      $container: {} as EnumX,
      name: 'PENDING',
      comment: 'Pending status'
    };

    expect(attrEnum.comment).toBe('Pending status');
  });

  it('should support optional fullName', () => {
    const attrEnum: AttributeEnum = {
      $type: 'AttributeEnum',
      $container: {} as EnumX,
      name: 'INACTIVE',
      fullName: 'Status.INACTIVE'
    };

    expect(attrEnum.fullName).toBe('Status.INACTIVE');
  });

  it('should maintain container reference to EnumX', () => {
    const enumX: EnumX = {
      $type: 'EnumX',
      name: 'Status',
      attributes: [],
      $container: {} as any
    };

    const attrEnum: AttributeEnum = {
      $type: 'AttributeEnum',
      $container: enumX,
      name: 'ACTIVE'
    };

    expect(attrEnum.$container).toBe(enumX);
    expect(attrEnum.$container.$type).toBe('EnumX');
  });
});

describe('Attribute Validation Scenarios', () => {
  it('should create email attribute with proper constraints', () => {
    const emailAttr: Attribute = {
      $type: 'Attribute',
      $container: {} as LocalEntity,
      name: 'email',
      type: 'email',
      blank: false,
      unique: true,
      comment: 'User email address'
    };

    expect(emailAttr.type).toBe('email');
    expect(emailAttr.blank).toBe(false);
    expect(emailAttr.unique).toBe(true);
  });

  it('should create currency attribute with min/max', () => {
    const priceAttr: Attribute = {
      $type: 'Attribute',
      $container: {} as LocalEntity,
      name: 'price',
      type: 'currency',
      min: 0,
      max: 999999.99,
      blank: false,
      unique: false
    };

    expect(priceAttr.type).toBe('currency');
    expect(priceAttr.min).toBe(0);
    expect(priceAttr.max).toBe(999999.99);
  });

  it('should create phone number attributes', () => {
    const mobileAttr: Attribute = {
      $type: 'Attribute',
      $container: {} as LocalEntity,
      name: 'mobile',
      type: 'mobilePhoneNumber',
      blank: true,
      unique: false
    };

    const phoneAttr: Attribute = {
      $type: 'Attribute',
      $container: {} as LocalEntity,
      name: 'phone',
      type: 'phoneNumber',
      blank: true,
      unique: false
    };

    expect(mobileAttr.type).toBe('mobilePhoneNumber');
    expect(phoneAttr.type).toBe('phoneNumber');
  });

  it('should create date and datetime attributes', () => {
    const dateAttr: Attribute = {
      $type: 'Attribute',
      $container: {} as LocalEntity,
      name: 'birthDate',
      type: 'date',
      blank: false,
      unique: false
    };

    const datetimeAttr: Attribute = {
      $type: 'Attribute',
      $container: {} as LocalEntity,
      name: 'createdAt',
      type: 'datetime',
      blank: false,
      unique: false
    };

    expect(dateAttr.type).toBe('date');
    expect(datetimeAttr.type).toBe('datetime');
  });

  it('should create file attribute', () => {
    const fileAttr: Attribute = {
      $type: 'Attribute',
      $container: {} as LocalEntity,
      name: 'avatar',
      type: 'file',
      blank: true,
      unique: false,
      comment: 'User profile picture'
    };

    expect(fileAttr.type).toBe('file');
    expect(fileAttr.blank).toBe(true);
  });

  it('should create UUID attribute', () => {
    const uuidAttr: Attribute = {
      $type: 'Attribute',
      $container: {} as LocalEntity,
      name: 'id',
      type: 'uuid',
      blank: false,
      unique: true,
      comment: 'Primary key'
    };

    expect(uuidAttr.type).toBe('uuid');
    expect(uuidAttr.unique).toBe(true);
  });
});

describe('EnumX Model with Attributes', () => {
  it('should create EnumX with multiple attributes', () => {
    const statusEnum: EnumX = {
      $type: 'EnumX',
      name: 'Status',
      attributes: [
        { $type: 'AttributeEnum', $container: {} as EnumX, name: 'ACTIVE' },
        { $type: 'AttributeEnum', $container: {} as EnumX, name: 'INACTIVE' },
        { $type: 'AttributeEnum', $container: {} as EnumX, name: 'PENDING' }
      ],
      $container: {} as any
    };

    expect(statusEnum.attributes).toHaveLength(3);
    expect(statusEnum.attributes[0].name).toBe('ACTIVE');
    expect(statusEnum.attributes[1].name).toBe('INACTIVE');
    expect(statusEnum.attributes[2].name).toBe('PENDING');
  });

  it('should create EnumX with comment', () => {
    const roleEnum: EnumX = {
      $type: 'EnumX',
      name: 'UserRole',
      comment: 'Available user roles in the system',
      attributes: [
        { $type: 'AttributeEnum', $container: {} as EnumX, name: 'ADMIN' },
        { $type: 'AttributeEnum', $container: {} as EnumX, name: 'USER' }
      ],
      $container: {} as any
    };

    expect(roleEnum.comment).toBe('Available user roles in the system');
  });
});
