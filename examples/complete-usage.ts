/**
 * Exemplo de Uso Completo da Biblioteca module-doc-lib
 * 
 * Este arquivo demonstra como usar todas as camadas da biblioteca
 * (Types, Utils, Models, Controllers, Views) para criar, manipular,
 * validar e documentar modelos de domínio.
 * 
 * @module examples/complete-usage
 */

import {
    // Types
    DATATYPE,
    Model,
    Module,
    LocalEntity,
    
    // Utils
    capitalizeString,
    isModule,
    isLocalEntity,
    
    // Models
    DomainModel,
    ModuleModel,
    EntityModel,
    
    // Controllers
    ModelController,
    ValidationController,
    ValidationSeverity,
    TransformController,
    NamingConvention,
    
    // Views
    JSONView,
    SerializationStrategy,
    MarkdownView,
    DocumentationStyle
} from '../src/index.js';

/**
 * Exemplo 1: Criar Modelo do Zero
 */
function exemplo1_criarModelo(): DomainModel {
    console.log('=== Exemplo 1: Criar Modelo do Zero ===\n');
    
    // Criar modelo usando ModelController
    const model = ModelController.createModel({
        name: 'Sistema de E-Commerce',
        version: '1.0.0',
        description: 'Sistema completo de comércio eletrônico',
        author: 'Equipe Dev',
        tags: ['e-commerce', 'vendas', 'estoque']
    });
    
    console.log('✓ Modelo criado:', model.getModel().configuration?.name);
    return model;
}

/**
 * Exemplo 2: Adicionar Módulos e Entidades
 */
function exemplo2_adicionarEstruturas(model: DomainModel): void {
    console.log('\n=== Exemplo 2: Adicionar Estruturas ===\n');
    
    // Adicionar módulo de Vendas
    const vendas = model.addModule({
        name: 'Vendas',
        description: 'Módulo responsável por vendas e pedidos',
        tags: ['vendas', 'pedidos']
    });
    
    console.log('✓ Módulo criado:', vendas.getModule().name);
    
    // Adicionar entidade Produto
    const produto = vendas.addEntity({
        name: 'Produto',
        description: 'Produto disponível para venda',
        is_abstract: false
    });
    
    console.log('✓ Entidade criada:', produto.name);
    
    // Adicionar atributos ao Produto
    produto.attributes.push({
        $type: 'Attribute',
        $container: produto,
        name: 'nome',
        type: DATATYPE.STRING,
        unique: false,
        blank: false,
        metadata: {
            description: 'Nome do produto',
            author: 'Dev',
            createdAt: new Date(),
            modifiedAt: new Date()
        }
    });
    
    produto.attributes.push({
        $type: 'Attribute',
        $container: produto,
        name: 'preco',
        type: DATATYPE.MONEY,
        unique: false,
        blank: false,
        min: 0,
        metadata: {
            description: 'Preço do produto',
            author: 'Dev',
            createdAt: new Date(),
            modifiedAt: new Date()
        }
    });
    
    produto.attributes.push({
        $type: 'Attribute',
        $container: produto,
        name: 'estoque',
        type: DATATYPE.INTEGER,
        unique: false,
        blank: false,
        min: 0,
        metadata: {
            description: 'Quantidade em estoque',
            author: 'Dev',
            createdAt: new Date(),
            modifiedAt: new Date()
        }
    });
    
    console.log('✓ Atributos adicionados:', produto.attributes.length);
    
    // Adicionar entidade Pedido
    const pedido = vendas.addEntity({
        name: 'Pedido',
        description: 'Pedido de compra de cliente',
        is_abstract: false
    });
    
    console.log('✓ Entidade criada:', pedido.name);
    
    // Adicionar relacionamento Pedido -> Produto (ManyToMany)
    pedido.relations.push({
        $type: 'ManyToMany',
        $container: pedido,
        target: {
            ref: produto,
            $refText: 'Produto'
        },
        bidirectional: true,
        reverseName: 'pedidos',
        metadata: {
            description: 'Produtos incluídos no pedido',
            author: 'Dev',
            createdAt: new Date(),
            modifiedAt: new Date()
        }
    });
    
    console.log('✓ Relacionamento criado: Pedido <-> Produto');
}

/**
 * Exemplo 3: Validar Modelo
 */
function exemplo3_validarModelo(model: DomainModel): void {
    console.log('\n=== Exemplo 3: Validar Modelo ===\n');
    
    // Validar usando ValidationController
    const results = ValidationController.validateModel(model.getModel());
    
    console.log(`Total de validações: ${results.length}`);
    
    const errors = ValidationController.filterBySeverity(results, ValidationSeverity.ERROR);
    const warnings = ValidationController.filterBySeverity(results, ValidationSeverity.WARNING);
    const infos = ValidationController.filterBySeverity(results, ValidationSeverity.INFO);
    
    console.log(`  Erros: ${errors.length}`);
    console.log(`  Avisos: ${warnings.length}`);
    console.log(`  Informações: ${infos.length}`);
    
    if (errors.length > 0) {
        console.log('\n⚠ Erros encontrados:');
        errors.forEach(err => {
            console.log(`  - ${err.path}: ${err.message}`);
        });
    } else {
        console.log('\n✓ Modelo válido!');
    }
}

/**
 * Exemplo 4: Gerar Estatísticas
 */
function exemplo4_gerarEstatisticas(model: DomainModel): void {
    console.log('\n=== Exemplo 4: Estatísticas do Modelo ===\n');
    
    const stats = ModelController.getStatistics(model);
    
    console.log(`Módulos: ${stats.totalModules}`);
    console.log(`Entidades: ${stats.totalEntities}`);
    console.log(`Enumerações: ${stats.totalEnums}`);
    console.log(`Atributos: ${stats.totalAttributes}`);
    console.log(`Relacionamentos: ${stats.totalRelations}`);
    console.log(`Funções: ${stats.totalFunctions}`);
    
    if (stats.largestEntity) {
        console.log(`\nMaior Entidade: ${stats.largestEntity.name} (${stats.largestEntity.attributeCount} atributos)`);
    }
    
    if (stats.largestModule) {
        console.log(`Maior Módulo: ${stats.largestModule.name} (${stats.largestModule.entityCount} entidades)`);
    }
}

/**
 * Exemplo 5: Transformações
 */
function exemplo5_transformacoes(model: DomainModel): void {
    console.log('\n=== Exemplo 5: Transformações ===\n');
    
    // Normalizar nomes de atributos para camelCase
    const result1 = TransformController.normalizeAttributeNames(
        model,
        NamingConvention.CAMEL_CASE
    );
    console.log(`✓ ${result1.message}`);
    
    // Adicionar timestamps a todas as entidades
    const result2 = TransformController.addTimestamps(model, true, true);
    console.log(`✓ ${result2.message}`);
    
    if (result2.details && result2.details.length > 0) {
        console.log('  Entidades afetadas:');
        result2.details.forEach(detail => console.log(`    - ${detail}`));
    }
}

/**
 * Exemplo 6: Exportar para JSON
 */
function exemplo6_exportarJSON(model: DomainModel): void {
    console.log('\n=== Exemplo 6: Exportar para JSON ===\n');
    
    // Estratégia FULL
    const fullJson = JSONView.serialize(model, {
        strategy: SerializationStrategy.FULL,
        indent: 2,
        includeMetadata: true
    });
    console.log('✓ JSON completo gerado');
    console.log(`  Tamanho: ${fullJson.length} caracteres`);
    
    // Estratégia COMPACT
    const compactJson = JSONView.serialize(model, {
        strategy: SerializationStrategy.COMPACT,
        indent: 2
    });
    console.log('✓ JSON compacto gerado');
    console.log(`  Tamanho: ${compactJson.length} caracteres`);
    console.log(`  Redução: ${((1 - compactJson.length / fullJson.length) * 100).toFixed(1)}%`);
    
    // Estratégia SUMMARY
    const summaryJson = JSONView.serialize(model, {
        strategy: SerializationStrategy.SUMMARY,
        indent: 2
    });
    console.log('✓ JSON resumido gerado');
    console.log(`  Tamanho: ${summaryJson.length} caracteres`);
    
    // Exemplo do JSON compacto
    console.log('\nExemplo JSON Compacto:');
    console.log(compactJson.substring(0, 300) + '...');
}

/**
 * Exemplo 7: Gerar Documentação Markdown
 */
function exemplo7_gerarMarkdown(model: DomainModel): void {
    console.log('\n=== Exemplo 7: Gerar Documentação Markdown ===\n');
    
    // Documentação completa
    const markdown = MarkdownView.generate(model, {
        style: DocumentationStyle.REFERENCE,
        includeTOC: true,
        includeMetadata: true,
        includeExamples: true,
        exampleLanguage: 'typescript'
    });
    
    console.log('✓ Documentação Markdown gerada');
    console.log(`  Linhas: ${markdown.split('\n').length}`);
    console.log(`  Tamanho: ${markdown.length} caracteres`);
    
    // Mostrar primeiras linhas
    console.log('\nPrimeiras linhas do Markdown:');
    const lines = markdown.split('\n').slice(0, 15);
    lines.forEach(line => console.log('  ' + line));
    console.log('  ...');
}

/**
 * Exemplo 8: Analisar Dependências
 */
function exemplo8_analisarDependencias(model: DomainModel): void {
    console.log('\n=== Exemplo 8: Analisar Dependências ===\n');
    
    const analysis = ModelController.analyzeDependencies(model);
    
    console.log(`Total de módulos analisados: ${analysis.length}`);
    
    analysis.forEach(dep => {
        console.log(`\nMódulo: ${dep.module.name}`);
        console.log(`  Depende de: ${dep.dependencies.length} módulo(s)`);
        console.log(`  Usado por: ${dep.dependents.length} módulo(s)`);
        
        if (dep.hasCircularDependencies) {
            console.log('  ⚠ Possui dependências circulares!');
        }
    });
}

/**
 * Executa todos os exemplos
 */
function executarTodosExemplos(): void {
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║  module-doc-lib - Exemplos de Uso Completo               ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');
    
    try {
        // 1. Criar modelo
        const model = exemplo1_criarModelo();
        
        // 2. Adicionar estruturas
        exemplo2_adicionarEstruturas(model);
        
        // 3. Validar
        exemplo3_validarModelo(model);
        
        // 4. Estatísticas
        exemplo4_gerarEstatisticas(model);
        
        // 5. Transformações
        exemplo5_transformacoes(model);
        
        // 6. Exportar JSON
        exemplo6_exportarJSON(model);
        
        // 7. Gerar Markdown
        exemplo7_gerarMarkdown(model);
        
        // 8. Analisar dependências
        exemplo8_analisarDependencias(model);
        
        console.log('\n╔═══════════════════════════════════════════════════════════╗');
        console.log('║  ✓ Todos os exemplos executados com sucesso!             ║');
        console.log('╚═══════════════════════════════════════════════════════════╝\n');
        
    } catch (error) {
        console.error('\n❌ Erro ao executar exemplos:', error);
    }
}

// Executar se for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    executarTodosExemplos();
}

export {
    exemplo1_criarModelo,
    exemplo2_adicionarEstruturas,
    exemplo3_validarModelo,
    exemplo4_gerarEstatisticas,
    exemplo5_transformacoes,
    exemplo6_exportarJSON,
    exemplo7_gerarMarkdown,
    exemplo8_analisarDependencias,
    executarTodosExemplos
};
