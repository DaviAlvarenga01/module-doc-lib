/**
 * complete-ecommerce-workflow.e2e.test.ts
 * 
 * E2E Test: Criação completa de sistema E-commerce
 */

import { describe, it, expect } from 'vitest';
import { ModelController } from '../../src/controllers/ModelController';
import { ValidationController } from '../../src/controllers/ValidationController';
import { TransformController, NamingConvention } from '../../src/controllers/TransformController';
import { addEntityToModule } from '../helpers/ast-builders';
import type { DATATYPE } from '../../src/types';

describe('E2E: Complete E-commerce System', () => {
  
  it('deve criar sistema completo de e-commerce do zero', () => {
    // 1. Criar modelo
    const ecommerce = ModelController.createModel({
      name: 'E-Commerce System',
      version: '1.0.0',
      description: 'Complete e-commerce solution',
      author: 'Dev Team'
    });
    
    // 2. Adicionar módulo Catálogo com entidade Product
    const catalog = ecommerce.addModule({
      name: 'Catalog',
      description: 'Product catalog module'
    });
    
    addEntityToModule(catalog, 'Product', {
      description: 'Product in catalog',
      attributes: [
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'name',
          type: 'string' as DATATYPE,
          unique: false,
          blank: false,
          metadata: {
            description: 'Product name',
            tags: [],
            requirements: [],
            author: 'Test',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'price',
          type: 'decimal' as DATATYPE,
          unique: false,
          blank: false,
          metadata: {
            description: 'Product price',
            tags: [],
            requirements: [],
            author: 'Test',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        }
      ]
    });
    
    // 3. Adicionar módulo Vendas com entidade Order
    const sales = ecommerce.addModule({
      name: 'Sales',
      description: 'Sales management module'
    });
    
    addEntityToModule(sales, 'Order', {
      description: 'Customer order',
      attributes: [
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'orderNumber',
          type: 'string' as DATATYPE,
          unique: false,
          blank: false,
          metadata: {
            description: 'Order identification',
            tags: [],
            requirements: [],
            author: 'Test',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        }
      ]
    });
    
    // 4. Adicionar módulo Clientes com entidade Customer
    const customers = ecommerce.addModule({
      name: 'Customers',
      description: 'Customer management'
    });
    
    addEntityToModule(customers, 'Customer', {
      description: 'System customer',
      attributes: [
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'email',
          type: 'string' as DATATYPE,
          unique: false,
          blank: false,
          metadata: {
            description: 'Customer email',
            tags: [],
            requirements: [],
            author: 'Test',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        }
      ]
    });
    
    // 5. Validar
    const validationResults = ValidationController.validateModel(ecommerce.getModel());
    console.log('Validation results:', JSON.stringify(validationResults, null, 2));
    const isValid = ValidationController.isValid(ecommerce.getModel());
    
    expect(isValid).toBe(true);
    expect(Array.isArray(validationResults)).toBe(true);
    
    // 6. Adicionar timestamps
    const timestampResult = TransformController.addTimestamps(ecommerce, true, true);
    expect(timestampResult.success).toBe(true);
    
    // 7. Validar novamente
    const isValidAfterTimestamps = ValidationController.isValid(ecommerce.getModel());
    expect(isValidAfterTimestamps).toBe(true);
    
    // 8. Obter estatísticas
    const stats = ModelController.getStatistics(ecommerce);
    expect(stats.totalModules).toBeGreaterThanOrEqual(3);
    expect(stats.totalEntities).toBeGreaterThanOrEqual(3);
    
    // 9. Exportar JSON
    const json = ModelController.exportToJSON(ecommerce);
    expect(json).toBeDefined();
    expect(typeof json).toBe('object');
  });
});
