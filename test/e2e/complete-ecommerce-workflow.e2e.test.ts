/**
 * complete-ecommerce-workflow.e2e.test.ts
 * 
 * E2E Test: Criação completa de sistema E-commerce
 */

import { describe, it, expect } from 'vitest';
import { ModelController } from '../../src/controllers/ModelController';
import { ValidationController } from '../../src/controllers/ValidationController';
import { TransformController, NamingConvention } from '../../src/controllers/TransformController';
import { ModuleModel } from '../../src/models/ModuleModel';
import { EntityModel } from '../../src/models/EntityModel';

describe('E2E: Complete E-commerce System', () => {
  
  it('deve criar sistema completo de e-commerce do zero', () => {
    // 1. Criar modelo
    const ecommerce = ModelController.createModel({
      name: 'E-Commerce System',
      version: '1.0.0',
      description: 'Complete e-commerce solution',
      author: 'Dev Team'
    });
    
    // 2. Adicionar módulo Catálogo
    const catalog = ecommerce.addModule({
      name: 'Catalog',
      description: 'Product catalog module'
    });
    
    const catalogModel = new ModuleModel(catalog);
    const product = catalogModel.addEntity({
      name: 'Product',
      description: 'Product in catalog'
    });
    
    const productModel = new EntityModel(product);
    productModel.addAttribute({
      name: 'name',
      type: 'STRING' as any,
      description: 'Product name'
    });
    
    productModel.addAttribute({
      name: 'price',
      type: 'MONEY' as any,
      description: 'Product price'
    });
    
    // 3. Adicionar módulo Vendas
    const sales = ecommerce.addModule({
      name: 'Sales',
      description: 'Sales management module'
    });
    
    const salesModel = new ModuleModel(sales);
    const order = salesModel.addEntity({
      name: 'Order',
      description: 'Customer order'
    });
    
    const orderModel = new EntityModel(order);
    orderModel.addAttribute({
      name: 'orderNumber',
      type: 'STRING' as any,
      description: 'Order identification'
    });
    
    // 4. Adicionar módulo Clientes
    const customers = ecommerce.addModule({
      name: 'Customers',
      description: 'Customer management'
    });
    
    const customersModel = new ModuleModel(customers);
    const customer = customersModel.addEntity({
      name: 'Customer',
      description: 'System customer'
    });
    
    const customerModel = new EntityModel(customer);
    customerModel.addAttribute({
      name: 'email',
      type: 'STRING' as any,
      description: 'Customer email'
    });
    
    // 5. Validar
    const validationResults = ValidationController.validateModel(ecommerce.getModel());
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
