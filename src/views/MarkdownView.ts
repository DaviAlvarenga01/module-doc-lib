/**
 * Markdown View
 * 
 * View responsável por gerar documentação em formato Markdown.
 * Transforma modelos de domínio em documentação legível e bem formatada,
 * útil para wikis, README files, e documentação de projeto.
 * 
 * Responsabilidades:
 * - Geração de documentação Markdown
 * - Formatação de tabelas
 * - Índices e navegação
 * - Diagramas textuais
 * - Documentação de APIs
 * 
 * Estilos de Documentação:
 * - Reference: Documentação de referência completa
 * - Guide: Guia orientado a exemplos
 * - API: Documentação estilo API
 * - Summary: Resumo executivo
 * 
 * @module views/MarkdownView
 * @see {@link Model} - Estrutura documentada
 * @see {@link DomainModel} - Model wrapper
 */

import {
    Model,
    Module,
    LocalEntity,
    Attribute,
    EnumX,
    DATATYPE
} from '../types/index.js';
import { DomainModel } from '../models/index.js';
import { isModule, isLocalEntity, isEnumX } from '../utils/TypeGuards.js';
import { getQualifiedName } from '../utils/AstUtils.js';

/**
 * Estilo de documentação
 */
export enum DocumentationStyle {
    /** Referência completa e detalhada */
    REFERENCE = 'reference',
    /** Guia com exemplos */
    GUIDE = 'guide',
    /** Documentação de API */
    API = 'api',
    /** Resumo executivo */
    SUMMARY = 'summary'
}

/**
 * Opções de geração de Markdown
 */
export interface MarkdownOptions {
    /** Estilo de documentação */
    style?: DocumentationStyle;
    /** Incluir índice (table of contents) */
    includeTOC?: boolean;
    /** Incluir metadados */
    includeMetadata?: boolean;
    /** Incluir diagrama de relacionamentos */
    includeDiagram?: boolean;
    /** Incluir exemplos de código */
    includeExamples?: boolean;
    /** Nível de heading inicial (1-6) */
    startingHeadingLevel?: number;
    /** Linguagem para exemplos de código */
    exampleLanguage?: string;
}

/**
 * Markdown View
 * 
 * Gera documentação em formato Markdown a partir de modelos de domínio.
 */
export class MarkdownView {
    /**
     * Gera documentação Markdown completa do modelo
     * 
     * @param domainModel - Modelo a ser documentado
     * @param options - Opções de geração
     * @returns String Markdown formatada
     * 
     * @example
     * ```typescript
     * const markdown = MarkdownView.generate(model, {
     *   style: DocumentationStyle.REFERENCE,
     *   includeTOC: true,
     *   includeExamples: true
     * });
     * 
     * fs.writeFileSync('MODEL.md', markdown);
     * ```
     */
    public static generate(
        domainModel: DomainModel,
        options: MarkdownOptions = {}
    ): string {
        const defaults: MarkdownOptions = {
            style: DocumentationStyle.REFERENCE,
            includeTOC: true,
            includeMetadata: true,
            includeDiagram: false,
            includeExamples: false,
            startingHeadingLevel: 1,
            exampleLanguage: 'typescript'
        };

        const opts = { ...defaults, ...options };
        const model = domainModel.getModel();
        const sections: string[] = [];

        // Título principal
        sections.push(this.generateTitle(model, opts));

        // Índice
        if (opts.includeTOC) {
            sections.push(this.generateTOC(model, opts));
        }

        // Visão geral
        sections.push(this.generateOverview(model, opts));

        // Estatísticas
        if (opts.style === DocumentationStyle.REFERENCE || opts.style === DocumentationStyle.SUMMARY) {
            sections.push(this.generateStatistics(domainModel, opts));
        }

        // Módulos
        sections.push(this.generateModules(model, opts));

        // Rodapé
        sections.push(this.generateFooter(model, opts));

        return sections.filter(s => s.length > 0).join('\n\n');
    }

    /**
     * Gera título e cabeçalho
     */
    private static generateTitle(model: Model, options: MarkdownOptions): string {
        const h = '#'.repeat(options.startingHeadingLevel || 1);
        const config = model.configuration;
        const sections: string[] = [];

        sections.push(`${h} ${config?.name || 'Domain Model'}`);

        if (config?.version) {
            sections.push(`**Versão:** ${config.version}`);
        }

        if (options.includeMetadata && model.metadata) {
            const meta = model.metadata;
            const metaInfo: string[] = [];

            if (meta.author) metaInfo.push(`**Autor:** ${meta.author}`);
            if (meta.createdAt) metaInfo.push(`**Criado em:** ${meta.createdAt.toLocaleDateString()}`);
            if (meta.modifiedAt) metaInfo.push(`**Modificado em:** ${meta.modifiedAt.toLocaleDateString()}`);

            if (metaInfo.length > 0) {
                sections.push('');
                sections.push(...metaInfo);
            }

            if (meta.tags && meta.tags.length > 0) {
                sections.push('');
                sections.push(`**Tags:** ${meta.tags.map(t => `\`${t}\``).join(', ')}`);
            }
        }

        return sections.join('\n');
    }

    /**
     * Gera índice (Table of Contents)
     */
    private static generateTOC(model: Model, options: MarkdownOptions): string {
        const h = '#'.repeat((options.startingHeadingLevel || 1) + 1);
        const sections: string[] = [];

        sections.push(`${h} Índice`);
        sections.push('');

        sections.push('- [Visão Geral](#visão-geral)');
        sections.push('- [Estatísticas](#estatísticas)');
        sections.push('- [Módulos](#módulos)');

        const modules = model.abstractElements.filter(isModule);
        modules.forEach(module => {
            const anchor = module.name.toLowerCase().replace(/\s+/g, '-');
            sections.push(`  - [${module.name}](#${anchor})`);
        });

        return sections.join('\n');
    }

    /**
     * Gera visão geral
     */
    private static generateOverview(model: Model, options: MarkdownOptions): string {
        const h = '#'.repeat((options.startingHeadingLevel || 1) + 1);
        const sections: string[] = [];

        sections.push(`${h} Visão Geral`);
        sections.push('');

        const modules = model.abstractElements.filter(isModule);
        const totalEntities = modules.reduce((sum, m) => 
            sum + m.elements.filter(isLocalEntity).length, 0
        );
        const totalEnums = modules.reduce((sum, m) => 
            sum + m.elements.filter(isEnumX).length, 0
        );

        sections.push(`Este modelo contém **${modules.length} módulos**, `);
        sections.push(`**${totalEntities} entidades** e **${totalEnums} enumerações**.`);

        return sections.join('\n');
    }

    /**
     * Gera estatísticas
     */
    private static generateStatistics(domainModel: DomainModel, options: MarkdownOptions): string {
        const h = '#'.repeat((options.startingHeadingLevel || 1) + 1);
        const sections: string[] = [];

        sections.push(`${h} Estatísticas`);
        sections.push('');

        const stats = domainModel.getStatistics();

        sections.push('| Métrica | Valor |');
        sections.push('|---------|-------|');
        sections.push(`| Módulos | ${stats.moduleCount} |`);
        sections.push(`| Entidades | ${stats.entityCount} |`);
        sections.push(`| Enumerações | ${stats.enumCount} |`);
        sections.push(`| Atributos | ${stats.attributeCount} |`);
        sections.push(`| Relacionamentos | ${stats.relationCount} |`);
        sections.push(`| Funções | ${stats.functionCount} |`);

        return sections.join('\n');
    }

    /**
     * Gera documentação dos módulos
     */
    private static generateModules(model: Model, options: MarkdownOptions): string {
        const h = '#'.repeat((options.startingHeadingLevel || 1) + 1);
        const sections: string[] = [];

        sections.push(`${h} Módulos`);
        sections.push('');

        const modules = model.abstractElements.filter(isModule);
        
        modules.forEach(module => {
            sections.push(this.generateModuleDoc(module, options, (options.startingHeadingLevel || 1) + 2));
        });

        return sections.join('\n');
    }

    /**
     * Gera documentação de um módulo
     */
    private static generateModuleDoc(
        module: Module,
        options: MarkdownOptions,
        headingLevel: number
    ): string {
        const h = '#'.repeat(headingLevel);
        const sections: string[] = [];

        sections.push(`${h} ${module.name}`);
        sections.push('');

        if (options.includeMetadata && module.metadata?.description) {
            sections.push(module.metadata.description);
            sections.push('');
        }

        // Entidades
        const entities = module.elements.filter(isLocalEntity);
        if (entities.length > 0) {
            sections.push(`${'#'.repeat(headingLevel + 1)} Entidades`);
            sections.push('');
            
            entities.forEach(entity => {
                sections.push(this.generateEntityDoc(entity, options, headingLevel + 2));
            });
        }

        // Enumerações
        const enums = module.elements.filter(isEnumX);
        if (enums.length > 0) {
            sections.push(`${'#'.repeat(headingLevel + 1)} Enumerações`);
            sections.push('');
            
            enums.forEach(enumX => {
                sections.push(this.generateEnumDoc(enumX, options, headingLevel + 2));
            });
        }

        // Submódulos
        const submodules = module.elements.filter(isModule);
        if (submodules.length > 0) {
            sections.push('');
            submodules.forEach(submodule => {
                sections.push(this.generateModuleDoc(submodule, options, headingLevel + 1));
            });
        }

        return sections.join('\n');
    }

    /**
     * Gera documentação de uma entidade
     */
    private static generateEntityDoc(
        entity: LocalEntity,
        options: MarkdownOptions,
        headingLevel: number
    ): string {
        const h = '#'.repeat(headingLevel);
        const sections: string[] = [];

        let title = entity.name;
        if (entity.is_abstract) {
            title += ' *(abstrata)*';
        }
        sections.push(`${h} ${title}`);
        sections.push('');

        if (options.includeMetadata && entity.metadata?.description) {
            sections.push(entity.metadata.description);
            sections.push('');
        }

        // Herança
        if (entity.superType) {
            const superName = entity.superType.$ref ? entity.superType.$ref.name : entity.superType.$refText;
            sections.push(`**Herda de:** \`${superName}\``);
            sections.push('');
        }

        // Atributos
        if (entity.attributes.length > 0) {
            sections.push('**Atributos:**');
            sections.push('');
            sections.push('| Nome | Tipo | Único | Obrigatório | Descrição |');
            sections.push('|------|------|-------|-------------|-----------|');

            entity.attributes.forEach(attr => {
                const name = `\`${attr.name}\``;
                const type = `\`${attr.type}\``;
                const unique = attr.unique ? '✓' : '';
                const required = !attr.blank ? '✓' : '';
                const desc = attr.metadata?.description || '';

                sections.push(`| ${name} | ${type} | ${unique} | ${required} | ${desc} |`);
            });

            sections.push('');
        }

        // Relacionamentos
        if (entity.relations.length > 0) {
            sections.push('**Relacionamentos:**');
            sections.push('');

            entity.relations.forEach(relation => {
                const targetName = relation.entity?.$ref ? relation.entity.$ref.name : relation.entity?.$refText || 'Unknown';
                const type = relation.$type;
                const opposite = ('opposite' in relation && relation.opposite) ? ` (oposto: ${relation.opposite})` : '';
                
                sections.push(`- **${type}** → \`${targetName}\`${opposite}`);
            });

            sections.push('');
        }

        // Funções
        if (entity.functions.length > 0) {
            sections.push('**Métodos:**');
            sections.push('');

            entity.functions.forEach(func => {
                const params = func.parameters.map(p => `${p.name}: ${p.type}`).join(', ');
                const response = func.response || 'void';
                
                sections.push(`- \`${func.name}(${params}): ${response}\``);
                
                if (func.metadata?.description) {
                    sections.push(`  - ${func.metadata.description}`);
                }
            });

            sections.push('');
        }

        // Exemplo de código
        if (options.includeExamples && options.style !== DocumentationStyle.SUMMARY) {
            sections.push(this.generateEntityExample(entity, options));
        }

        return sections.join('\n');
    }

    /**
     * Gera exemplo de código para entidade
     */
    private static generateEntityExample(entity: LocalEntity, options: MarkdownOptions): string {
        const sections: string[] = [];
        const lang = options.exampleLanguage || 'typescript';

        sections.push('**Exemplo:**');
        sections.push('');
        sections.push('```' + lang);

        // Exemplo TypeScript
        if (lang === 'typescript') {
            sections.push(`interface ${entity.name} {`);
            entity.attributes.forEach(attr => {
                const optional = attr.blank ? '?' : '';
                sections.push(`  ${attr.name}${optional}: ${this.mapTypeToTS(attr.type)};`);
            });
            sections.push('}');
            sections.push('');
            sections.push(`const ${entity.name.toLowerCase()}: ${entity.name} = {`);
            entity.attributes.filter(a => !a.blank).forEach((attr, i, arr) => {
                const comma = i < arr.length - 1 ? ',' : '';
                sections.push(`  ${attr.name}: ${this.generateExampleValue(attr.type)}${comma}`);
            });
            sections.push('};');
        }

        sections.push('```');

        return sections.join('\n');
    }

    /**
     * Mapeia DATATYPE para tipo TypeScript
     */
    private static mapTypeToTS(datatype: any): string {
        // Se for Reference<EnumX>, retorna o nome do enum
        if (typeof datatype === 'object' && datatype.$refText) {
            return datatype.$refText;
        }
        
        // Se for string (DATATYPE)
        const mapping: Partial<Record<DATATYPE, string>> = {
            [DATATYPE.int]: 'number',
            [DATATYPE.long]: 'number',
            [DATATYPE.float]: 'number',
            [DATATYPE.double]: 'number',
            [DATATYPE.decimal]: 'number',
            [DATATYPE.string]: 'string',
            [DATATYPE.char]: 'string',
            [DATATYPE.boolean]: 'boolean',
            [DATATYPE.date]: 'Date',
            [DATATYPE.datetime]: 'Date',
            [DATATYPE.time]: 'string',
            [DATATYPE.blob]: 'Blob'
        };

        return mapping[datatype as DATATYPE] || 'any';
    }

    /**
     * Gera valor de exemplo para tipo
     */
    private static generateExampleValue(datatype: any): string {
        // Se for Reference<EnumX>, retorna exemplo de enum
        if (typeof datatype === 'object' && datatype.$refText) {
            return `${datatype.$refText}.VALUE`;
        }
        
        const examples: Partial<Record<DATATYPE, string>> = {
            [DATATYPE.int]: '42',
            [DATATYPE.long]: '1000000',
            [DATATYPE.float]: '3.14',
            [DATATYPE.double]: '3.14159265359',
            [DATATYPE.decimal]: '99.99',
            [DATATYPE.string]: '"exemplo"',
            [DATATYPE.char]: '"A"',
            [DATATYPE.boolean]: 'true',
            [DATATYPE.date]: 'new Date()',
            [DATATYPE.datetime]: 'new Date()',
            [DATATYPE.time]: '"14:30:00"',
            [DATATYPE.blob]: 'new Blob()'
        };

        return examples[datatype as DATATYPE] || 'null';
    }

    /**
     * Gera documentação de enumeração
     */
    private static generateEnumDoc(
        enumX: EnumX,
        options: MarkdownOptions,
        headingLevel: number
    ): string {
        const h = '#'.repeat(headingLevel);
        const sections: string[] = [];

        sections.push(`${h} ${enumX.name}`);
        sections.push('');

        if (options.includeMetadata && enumX.metadata?.description) {
            sections.push(enumX.metadata.description);
            sections.push('');
        }

        sections.push('**Valores:**');
        sections.push('');

        enumX.literals.forEach(literal => {
            const value = literal.value !== undefined ? ` = ${literal.value}` : '';
            sections.push(`- \`${literal.name}\`${value}`);
        });

        sections.push('');

        return sections.join('\n');
    }

    /**
     * Gera rodapé
     */
    private static generateFooter(model: Model, options: MarkdownOptions): string {
        const sections: string[] = [];

        sections.push('---');
        sections.push('');
        sections.push('*Documentação gerada automaticamente por module-doc-lib*');

        return sections.join('\n');
    }

    /**
     * Gera documentação de módulo específico
     * 
     * @param domainModel - Modelo completo
     * @param moduleName - Nome do módulo
     * @param options - Opções de geração
     * @returns Markdown do módulo
     * 
     * @example
     * ```typescript
     * const md = MarkdownView.generateModuleDocByName(model, 'Vendas', {
     *   includeExamples: true
     * });
     * ```
     */
    public static generateModuleDocByName(
        domainModel: DomainModel,
        moduleName: string,
        options: MarkdownOptions = {}
    ): string {
        const model = domainModel.getModel();
        const module = model.abstractElements
            .filter(isModule)
            .find(m => m.name === moduleName);

        if (!module) {
            throw new Error(`Módulo '${moduleName}' não encontrado`);
        }

        const opts = {
            ...options,
            startingHeadingLevel: options.startingHeadingLevel || 1
        };

        return this.generateModuleDoc(module, opts, opts.startingHeadingLevel!);
    }

    /**
     * Gera documentação de entidade específica
     * 
     * @param domainModel - Modelo completo
     * @param entityName - Nome da entidade
     * @param options - Opções de geração
     * @returns Markdown da entidade
     * 
     * @example
     * ```typescript
     * const md = MarkdownView.generateEntityDocByName(model, 'Produto');
     * ```
     */
    public static generateEntityDocByName(
        domainModel: DomainModel,
        entityName: string,
        options: MarkdownOptions = {}
    ): string {
        const model = domainModel.getModel();
        let entity: LocalEntity | undefined;

        // Busca em todos os módulos
        for (const element of model.abstractElements) {
            if (isModule(element)) {
                entity = element.elements.find(
                    e => isLocalEntity(e) && e.name === entityName
                ) as LocalEntity | undefined;
                if (entity) break;
            }
        }

        if (!entity) {
            throw new Error(`Entidade '${entityName}' não encontrada`);
        }

        const opts = {
            ...options,
            startingHeadingLevel: options.startingHeadingLevel || 1
        };

        return this.generateEntityDoc(entity, opts, opts.startingHeadingLevel!);
    }
}
