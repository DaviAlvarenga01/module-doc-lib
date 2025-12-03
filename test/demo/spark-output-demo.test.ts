/**
 * spark-output-demo.test.ts
 * 
 * DEMONSTRAÇÃO: Output completo que o Spark receberá
 * 
 * Este teste cria um sistema realista de E-commerce e gera o JSON
 * estruturado que será usado pelo gerador de código Spark.
 */

import { describe, it } from 'vitest';
import { ModelController } from '../../src/controllers/ModelController';
import { TransformController, NamingConvention } from '../../src/controllers/TransformController';
import { addEntityToModule } from '../helpers/ast-builders';
import { DATATYPE } from '../../src/types';
import * as fs from 'fs';
import * as path from 'path';

describe('DEMO: Spark Output Generation', () => {
  
  it('deve gerar output completo do sistema E-commerce para o Spark', () => {
    console.log('\n' + '='.repeat(80));
    console.log('DEMONSTRAÇÃO: Geração de Sistema E-commerce para Spark');
    console.log('='.repeat(80) + '\n');

    // ========================================================================
    // 1. CRIAR MODELO DE DOMÍNIO
    // ========================================================================
    console.log('📋 Etapa 1: Criando modelo de domínio...\n');
    
    const ecommerce = ModelController.createModel({
      name: 'EcommerceSystem',
      version: '1.0.0',
      description: 'Sistema completo de E-commerce com gestão de produtos, pedidos e clientes',
      author: 'Equipe de Desenvolvimento'
    });

    // ========================================================================
    // 2. MÓDULO CATALOG - Gestão de Produtos
    // ========================================================================
    console.log('📦 Módulo: Catalog (Catálogo de Produtos)');
    
    const catalog = ecommerce.addModule({
      name: 'Catalog',
      description: 'Módulo de gerenciamento de catálogo de produtos'
    });

    // Entidade: Product
    addEntityToModule(catalog, 'Product', {
      description: 'Produto disponível para venda',
      attributes: [
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'id',
          type: DATATYPE.int,
          unique: true,
          blank: false,
          metadata: {
            description: 'Identificador único do produto',
            tags: ['primary-key'],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'name',
          type: DATATYPE.string,
          unique: false,
          blank: false,
          metadata: {
            description: 'Nome do produto',
            tags: [],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'description',
          type: DATATYPE.string,
          unique: false,
          blank: true,
          metadata: {
            description: 'Descrição detalhada do produto',
            tags: [],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'price',
          type: DATATYPE.decimal,
          unique: false,
          blank: false,
          metadata: {
            description: 'Preço unitário do produto',
            tags: ['currency'],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }

        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'stock',
          type: DATATYPE.int,
          unique: false,
          blank: false,
          metadata: {
            description: 'Quantidade em estoque',
            tags: [],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'active',
          type: DATATYPE.boolean,
          unique: false,
          blank: false,
          default_value: true,
          metadata: {
            description: 'Indica se o produto está ativo',
            tags: [],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        }
      ]
    });

    // Entidade: Category
    addEntityToModule(catalog, 'Category', {
      description: 'Categoria de produtos',
      attributes: [
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'id',
          type: DATATYPE.int,
          unique: true,
          blank: false,
          metadata: {
            description: 'Identificador único da categoria',
            tags: ['primary-key'],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'name',
          type: DATATYPE.string,
          unique: false,
          blank: false,
          metadata: {
            description: 'Nome da categoria',
            tags: [],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        }
      ]
    });

    console.log('  ✓ Product: 6 atributos (id, name, description, price, stock, active)');
    console.log('  ✓ Category: 2 atributos (id, name)\n');

    // ========================================================================
    // 3. MÓDULO SALES - Gestão de Vendas
    // ========================================================================
    console.log('💰 Módulo: Sales (Vendas e Pedidos)');
    
    const sales = ecommerce.addModule({
      name: 'Sales',
      description: 'Módulo de gerenciamento de vendas e pedidos'
    });

    // Entidade: Order
    addEntityToModule(sales, 'Order', {
      description: 'Pedido realizado por um cliente',
      attributes: [
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'id',
          type: DATATYPE.int,
          unique: true,
          blank: false,
          metadata: {
            description: 'Identificador único do pedido',
            tags: ['primary-key'],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'orderNumber',
          type: DATATYPE.string,
          unique: true,
          blank: false,
          metadata: {
            description: 'Número do pedido',
            tags: ['business-key'],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'orderDate',
          type: DATATYPE.date,
          unique: false,
          blank: false,
          metadata: {
            description: 'Data do pedido',
            tags: [],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'totalAmount',
          type: DATATYPE.decimal,
          unique: false,
          blank: false,
          metadata: {
            description: 'Valor total do pedido',
            tags: ['currency', 'calculated'],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'status',
          type: DATATYPE.string,
          unique: false,
          blank: false,
          metadata: {
            description: 'Status do pedido (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)',
            tags: ['enum-candidate'],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        }
      ]
    });

    // Entidade: OrderItem
    addEntityToModule(sales, 'OrderItem', {
      description: 'Item de um pedido',
      attributes: [
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'id',
          type: DATATYPE.int,
          unique: true,
          blank: false,
          metadata: {
            description: 'Identificador único do item',
            tags: ['primary-key'],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'quantity',
          type: DATATYPE.int,
          unique: false,
          blank: false,
          metadata: {
            description: 'Quantidade do produto',
            tags: [],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'unitPrice',
          type: DATATYPE.decimal,
          unique: false,
          blank: false,
          metadata: {
            description: 'Preço unitário no momento da compra',
            tags: ['currency'],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'subtotal',
          type: DATATYPE.decimal,
          unique: false,
          blank: false,
          metadata: {
            description: 'Subtotal do item (quantity * unitPrice)',
            tags: ['currency', 'calculated'],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        }
      ]
    });

    console.log('  ✓ Order: 5 atributos (id, orderNumber, orderDate, totalAmount, status)');
    console.log('  ✓ OrderItem: 4 atributos (id, quantity, unitPrice, subtotal)\n');

    // ========================================================================
    // 4. MÓDULO CUSTOMERS - Gestão de Clientes
    // ========================================================================
    console.log('👥 Módulo: Customers (Clientes)');
    
    const customers = ecommerce.addModule({
      name: 'Customers',
      description: 'Módulo de gerenciamento de clientes'
    });

    // Entidade: Customer
    addEntityToModule(customers, 'Customer', {
      description: 'Cliente do sistema',
      attributes: [
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'id',
          type: DATATYPE.int,
          unique: true,
          blank: false,
          metadata: {
            description: 'Identificador único do cliente',
            tags: ['primary-key'],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'name',
          type: DATATYPE.string,
          unique: false,
          blank: false,
          metadata: {
            description: 'Nome completo do cliente',
            tags: [],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'email',
          type: DATATYPE.string,
          unique: true,
          blank: false,
          metadata: {
            description: 'Email do cliente',
            tags: ['unique', 'contact'],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'phone',
          type: DATATYPE.string,
          unique: false,
          blank: true,
          metadata: {
            description: 'Telefone do cliente',
            tags: ['contact'],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'registrationDate',
          type: DATATYPE.date,
          unique: false,
          blank: false,
          metadata: {
            description: 'Data de registro no sistema',
            tags: ['timestamp'],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'active',
          type: DATATYPE.boolean,
          unique: false,
          blank: false,
          default_value: true,
          metadata: {
            description: 'Indica se o cliente está ativo',
            tags: [],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        }
      ]
    });

    // Entidade: Address
    addEntityToModule(customers, 'Address', {
      description: 'Endereço de entrega do cliente',
      attributes: [
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'id',
          type: DATATYPE.int,
          unique: true,
          blank: false,
          metadata: {
            description: 'Identificador único do endereço',
            tags: ['primary-key'],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'street',
          type: DATATYPE.string,
          unique: false,
          blank: false,
          metadata: {
            description: 'Rua',
            tags: [],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'city',
          type: DATATYPE.string,
          unique: false,
          blank: false,
          metadata: {
            description: 'Cidade',
            tags: [],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'state',
          type: DATATYPE.string,
          unique: false,
          blank: false,
          metadata: {
            description: 'Estado',
            tags: [],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        },
        {
          $type: 'Attribute',
          $container: null as any,
          name: 'zipCode',
          type: DATATYPE.string,
          unique: false,
          blank: false,
          metadata: {
            description: 'CEP',
            tags: [],
            requirements: [],
            author: 'System',
            createdAt: new Date(),
            modifiedAt: new Date()
          }
        }
      ]
    });

    console.log('  ✓ Customer: 6 atributos (id, name, email, phone, registrationDate, active)');
    console.log('  ✓ Address: 5 atributos (id, street, city, state, zipCode)\n');

    // ========================================================================
    // 5. APLICAR TRANSFORMAÇÕES
    // ========================================================================
    console.log('🔧 Etapa 2: Aplicando transformações...\n');
    
    // Normalizar nomes para PascalCase
    console.log('  → Normalizando nomes de módulos para PascalCase');
    TransformController.normalizeModuleNames(ecommerce, NamingConvention.PASCAL_CASE);
    
    console.log('  → Normalizando nomes de entidades para PascalCase');
    TransformController.normalizeEntityNames(ecommerce, NamingConvention.PASCAL_CASE);
    
    // Adicionar timestamps automáticos
    console.log('  → Adicionando timestamps (createdAt, updatedAt)');
    TransformController.addTimestamps(ecommerce, true, true);

    console.log('  ✓ Transformações concluídas\n');

    // ========================================================================
    // 6. OBTER ESTATÍSTICAS
    // ========================================================================
    console.log('📊 Etapa 3: Estatísticas do modelo...\n');
    
    const stats = ModelController.getStatistics(ecommerce);
    
    console.log(`  • Total de Módulos: ${stats.totalModules}`);
    console.log(`  • Total de Entidades: ${stats.totalEntities}`);
    console.log(`  • Total de Atributos: ${stats.totalAttributes}`);
    console.log(`  • Total de Relações: ${stats.totalRelations}`);
    console.log(`  • Total de Enums: ${stats.totalEnums}\n`);

    // ========================================================================
    // 7. EXPORTAR JSON PARA O SPARK
    // ========================================================================
    console.log('💾 Etapa 4: Exportando para JSON...\n');
    
    const outputJSON = ModelController.exportToJSON(ecommerce);
    
    // Criar diretório de output se não existir
    const outputDir = path.join(__dirname, '..', '..', 'demo-output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Salvar JSON formatado
    const outputPath = path.join(outputDir, 'ecommerce-system.json');
    fs.writeFileSync(outputPath, JSON.stringify(outputJSON, null, 2), 'utf-8');

    console.log(`  ✓ JSON exportado com sucesso!`);
    console.log(`  📁 Arquivo: ${outputPath}`);
    console.log(`  📦 Tamanho: ${(JSON.stringify(outputJSON).length / 1024).toFixed(2)} KB\n`);

    // ========================================================================
    // 8. PREVIEW DO JSON
    // ========================================================================
    console.log('👁️  Etapa 5: Preview do JSON (primeiras linhas)...\n');
    console.log('─'.repeat(80));
    
    // Mostrar estrutura simplificada
    const preview = {
      name: outputJSON.name,
      version: outputJSON.version,
      description: outputJSON.description,
      modules: outputJSON.abstractElements
        .filter((el: any) => el.$type === 'Module')
        .map((mod: any) => ({
          name: mod.name,
          description: mod.metadata?.description,
          entities: mod.elements
            .filter((el: any) => el.$type === 'LocalEntity')
            .map((ent: any) => ({
              name: ent.name,
              attributeCount: ent.attributes.length,
              attributes: ent.attributes.map((attr: any) => ({
                name: attr.name,
                type: attr.type,
                unique: attr.unique,
                blank: attr.blank
              }))
            }))
        }))
    };

    console.log(JSON.stringify(preview, null, 2));
    console.log('─'.repeat(80) + '\n');

    // ========================================================================
    // 9. RESUMO FINAL
    // ========================================================================
    console.log('✅ DEMONSTRAÇÃO CONCLUÍDA!\n');
    console.log('📋 Resumo:');
    console.log('  • Sistema E-commerce completo modelado');
    console.log('  • 3 módulos: Catalog, Sales, Customers');
    console.log('  • 7 entidades com atributos detalhados');
    console.log('  • Transformações aplicadas (normalização + timestamps)');
    console.log('  • JSON exportado e pronto para consumo pelo Spark\n');
    console.log('🚀 O arquivo JSON pode ser usado pelo gerador de código Spark');
    console.log('   para criar automaticamente:');
    console.log('   - Models (entidades de domínio)');
    console.log('   - Controllers (APIs REST)');
    console.log('   - Repositories (acesso a dados)');
    console.log('   - DTOs (Data Transfer Objects)');
    console.log('   - Database migrations\n');
    console.log('='.repeat(80) + '\n');
  });
});
