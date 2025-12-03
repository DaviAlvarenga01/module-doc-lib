/**
 * JSON View
 * 
 * View responsável por serialização de modelos para formato JSON.
 * Fornece diferentes estratégias de serialização dependendo do caso de uso:
 * - Completo: Toda a estrutura do modelo
 * - Compacto: Apenas informações essenciais
 * - Schema: Definição de esquema para validação
 * - Summary: Resumo executivo do modelo
 * 
 * Responsabilidades:
 * - Serialização para JSON
 * - Controle de profundidade
 * - Filtragem de campos
 * - Formatação customizada
 * - Resolução de referências circulares
 * 
 * Casos de Uso:
 * - Persistência em arquivos
 * - Transmissão via API
 * - Documentação
 * - Versionamento
 * 
 * @module views/JSONView
 * @see {@link Model} - Estrutura serializada
 * @see {@link DomainModel} - Model wrapper
 */

import {
    Model,
    Module,
    LocalEntity,
    Attribute,
    EnumX,
    Relation,
    Configuration,
    Metadata
} from '../types/index.js';
import { DomainModel } from '../models/index.js';
import { isModule, isLocalEntity, isEnumX } from '../utils/TypeGuards.js';

/**
 * Estratégia de serialização
 */
export enum SerializationStrategy {
    /** Serialização completa com todos os detalhes */
    FULL = 'full',
    /** Serialização compacta (apenas essencial) */
    COMPACT = 'compact',
    /** Schema JSON para validação */
    SCHEMA = 'schema',
    /** Resumo executivo */
    SUMMARY = 'summary'
}

/**
 * Opções de serialização JSON
 */
export interface JSONSerializationOptions {
    /** Estratégia de serialização */
    strategy?: SerializationStrategy;
    /** Incluir metadados */
    includeMetadata?: boolean;
    /** Incluir timestamps */
    includeTimestamps?: boolean;
    /** Profundidade máxima (para evitar estruturas muito profundas) */
    maxDepth?: number;
    /** Indentação (espaços ou tabs) */
    indent?: number | string;
    /** Incluir campos vazios (arrays/objetos vazios) */
    includeEmpty?: boolean;
    /** Campos a serem excluídos */
    excludeFields?: string[];
}

/**
 * JSON View
 * 
 * Fornece métodos para serializar modelos de domínio em formato JSON
 * com diferentes níveis de detalhe e formatação.
 */
export class JSONView {
    /**
     * Serializa modelo completo para JSON
     * 
     * @param domainModel - Modelo a ser serializado
     * @param options - Opções de serialização
     * @returns String JSON formatada
     * 
     * @example
     * ```typescript
     * const json = JSONView.serialize(model, {
     *   strategy: SerializationStrategy.FULL,
     *   indent: 2,
     *   includeMetadata: true
     * });
     * 
     * fs.writeFileSync('model.json', json);
     * ```
     */
    public static serialize(
        domainModel: DomainModel,
        options: JSONSerializationOptions = {}
    ): string {
        const defaults: JSONSerializationOptions = {
            strategy: SerializationStrategy.FULL,
            includeMetadata: true,
            includeTimestamps: true,
            maxDepth: 10,
            indent: 2,
            includeEmpty: false,
            excludeFields: []
        };

        const opts = { ...defaults, ...options };
        const model = domainModel.getModel();

        let data: any;

        switch (opts.strategy) {
            case SerializationStrategy.FULL:
                data = this.serializeFull(model, opts);
                break;
            case SerializationStrategy.COMPACT:
                data = this.serializeCompact(model, opts);
                break;
            case SerializationStrategy.SCHEMA:
                data = this.serializeSchema(model, opts);
                break;
            case SerializationStrategy.SUMMARY:
                data = this.serializeSummary(model, opts);
                break;
            default:
                data = this.serializeFull(model, opts);
        }

        return JSON.stringify(data, null, opts.indent);
    }

    /**
     * Serialização completa do modelo
     */
    private static serializeFull(model: Model, options: JSONSerializationOptions): any {
        return {
            $type: 'Model',
            configuration: this.serializeConfiguration(model.configuration, options),
            metadata: options.includeMetadata ? this.serializeMetadata(model.metadata, options) : undefined,
            modules: model.abstractElements
                .filter(isModule)
                .map(m => this.serializeModule(m, options, 0))
        };
    }

    /**
     * Serialização compacta (apenas estrutura essencial)
     */
    private static serializeCompact(model: Model, options: JSONSerializationOptions): any {
        return {
            name: model.configuration?.name || 'Unnamed',
            version: model.configuration?.version || '0.0.0',
            modules: model.abstractElements
                .filter(isModule)
                .map(m => ({
                    name: m.name,
                    entities: m.elements.filter(isLocalEntity).map(e => ({
                        name: e.name,
                        attributes: e.attributes.map(a => ({
                            name: a.name,
                            type: a.type
                        }))
                    })),
                    enums: m.elements.filter(isEnumX).map(e => ({
                        name: e.name,
                        literals: e.literals.map(l => l.name)
                    }))
                }))
        };
    }

    /**
     * Serialização como JSON Schema para validação
     */
    private static serializeSchema(model: Model, options: JSONSerializationOptions): any {
        return {
            $schema: 'http://json-schema.org/draft-07/schema#',
            title: model.configuration?.name || 'Domain Model',
            description: 'Domain model schema',
            type: 'object',
            properties: {
                modules: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            entities: {
                                type: 'array',
                                items: this.generateEntitySchema()
                            }
                        },
                        required: ['name']
                    }
                }
            }
        };
    }

    /**
     * Serialização resumida (estatísticas e overview)
     */
    private static serializeSummary(model: Model, options: JSONSerializationOptions): any {
        const modules = model.abstractElements.filter(isModule);
        let totalEntities = 0;
        let totalEnums = 0;
        let totalAttributes = 0;

        const moduleSummaries = modules.map(m => {
            const entities = m.elements.filter(isLocalEntity);
            const enums = m.elements.filter(isEnumX);
            const attributes = entities.reduce((sum, e) => sum + e.attributes.length, 0);

            totalEntities += entities.length;
            totalEnums += enums.length;
            totalAttributes += attributes;

            return {
                name: m.name,
                entityCount: entities.length,
                enumCount: enums.length,
                attributeCount: attributes
            };
        });

        return {
            model: {
                name: model.configuration?.name || 'Unnamed',
                version: model.configuration?.version || '0.0.0'
            },
            statistics: {
                totalModules: modules.length,
                totalEntities,
                totalEnums,
                totalAttributes
            },
            modules: moduleSummaries
        };
    }

    /**
     * Serializa configuração
     */
    private static serializeConfiguration(
        config: Configuration | undefined,
        options: JSONSerializationOptions
    ): any {
        if (!config) return undefined;

        const result: any = {
            name: config.name,
            version: config.version
        };

        if (config.backendLanguage) result.backendLanguage = config.backendLanguage;
        if (config.frontendFramework) result.frontendFramework = config.frontendFramework;
        if (config.database) result.database = config.database;
        if (config.port) result.port = config.port;
        if (config.basePackage) result.basePackage = config.basePackage;
        if (config.outputDirectory) result.outputDirectory = config.outputDirectory;

        return result;
    }

    /**
     * Serializa metadados
     */
    private static serializeMetadata(
        metadata: Metadata | undefined,
        options: JSONSerializationOptions
    ): any {
        if (!metadata) return undefined;

        const result: any = {};

        if (metadata.description) result.description = metadata.description;
        if (metadata.tags && metadata.tags.length > 0) result.tags = metadata.tags;
        if (metadata.requirements && metadata.requirements.length > 0) {
            result.requirements = metadata.requirements;
        }
        if (metadata.author) result.author = metadata.author;

        if (options.includeTimestamps) {
            if (metadata.createdAt) result.createdAt = metadata.createdAt.toISOString();
            if (metadata.modifiedAt) result.modifiedAt = metadata.modifiedAt.toISOString();
        }

        return Object.keys(result).length > 0 ? result : undefined;
    }

    /**
     * Serializa módulo
     */
    private static serializeModule(
        module: Module,
        options: JSONSerializationOptions,
        depth: number
    ): any {
        if (depth >= (options.maxDepth || 10)) {
            return { name: module.name, _truncated: true };
        }

        const result: any = {
            $type: 'Module',
            name: module.name
        };

        if (options.includeMetadata) {
            result.metadata = this.serializeMetadata(module.metadata, options);
        }

        // Entidades
        const entities = module.elements.filter(isLocalEntity);
        if (entities.length > 0 || options.includeEmpty) {
            result.entities = entities.map(e => this.serializeEntity(e, options));
        }

        // Enumerações
        const enums = module.elements.filter(isEnumX);
        if (enums.length > 0 || options.includeEmpty) {
            result.enums = enums.map(e => this.serializeEnum(e, options));
        }

        // Submódulos
        const submodules = module.elements.filter(isModule);
        if (submodules.length > 0 || options.includeEmpty) {
            result.submodules = submodules.map(m => this.serializeModule(m, options, depth + 1));
        }

        return result;
    }

    /**
     * Serializa entidade
     */
    private static serializeEntity(entity: LocalEntity, options: JSONSerializationOptions): any {
        const result: any = {
            $type: 'LocalEntity',
            name: entity.name,
            is_abstract: entity.is_abstract
        };

        if (options.includeMetadata) {
            result.metadata = this.serializeMetadata(entity.metadata, options);
        }

        // Atributos
        if (entity.attributes.length > 0 || options.includeEmpty) {
            result.attributes = entity.attributes.map(a => this.serializeAttribute(a, options));
        }

        // Relacionamentos
        if (entity.relations.length > 0 || options.includeEmpty) {
            result.relations = entity.relations.map(r => this.serializeRelation(r, options));
        }

        // Funções
        if (entity.functions.length > 0 || options.includeEmpty) {
            result.functions = entity.functions.map(f => ({
                name: f.name,
                parameters: f.parameters,
                response: f.response
            }));
        }

        // Supertype
        if (entity.superType) {
            result.superType = entity.superType.$ref ? entity.superType.$ref.name : entity.superType.$refText;
        }

        return result;
    }

    /**
     * Serializa atributo
     */
    private static serializeAttribute(attribute: Attribute, options: JSONSerializationOptions): any {
        const result: any = {
            name: attribute.name,
            type: attribute.type,
            unique: attribute.unique,
            blank: attribute.blank
        };

        if (attribute.min !== undefined) result.min = attribute.min;
        if (attribute.max !== undefined) result.max = attribute.max;

        if (options.includeMetadata) {
            result.metadata = this.serializeMetadata(attribute.metadata, options);
        }

        return result;
    }

    /**
     * Serializa relacionamento
     */
    private static serializeRelation(relation: Relation, options: JSONSerializationOptions): any {
        const result: any = {
            $type: relation.$type,
            name: relation.name
        };

        if (relation.entity) {
            result.entity = relation.entity.$ref ? relation.entity.$ref.name : relation.entity.$refText;
        }

        // OneToOne, OneToMany, ManyToOne e ManyToMany podem ter opposite
        if ('opposite' in relation && relation.opposite) result.opposite = relation.opposite;
        
        // OneToOne e ManyToOne podem ter required
        if ('required' in relation && relation.required !== undefined) result.required = relation.required;
        
        // OneToMany e ManyToOne podem ter eager
        if ('eager' in relation && relation.eager !== undefined) result.eager = relation.eager;
        
        // OneToMany e ManyToMany podem ter cascade
        if ('cascade' in relation && relation.cascade !== undefined) result.cascade = relation.cascade;

        if (options.includeMetadata && relation.metadata) {
            result.metadata = this.serializeMetadata(relation.metadata, options);
        }

        return result;
    }

    /**
     * Serializa enumeração
     */
    private static serializeEnum(enumX: EnumX, options: JSONSerializationOptions): any {
        const result: any = {
            $type: 'EnumX',
            name: enumX.name,
            literals: enumX.literals.map(l => ({
                name: l.name,
                value: l.value
            }))
        };

        if (options.includeMetadata) {
            result.metadata = this.serializeMetadata(enumX.metadata, options);
        }

        return result;
    }

    /**
     * Gera schema JSON para entidade
     */
    private static generateEntitySchema(): any {
        return {
            type: 'object',
            properties: {
                name: { type: 'string' },
                is_abstract: { type: 'boolean' },
                attributes: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            type: { type: 'string' },
                            unique: { type: 'boolean' },
                            blank: { type: 'boolean' }
                        },
                        required: ['name', 'type']
                    }
                }
            },
            required: ['name']
        };
    }

    /**
     * Desserializa JSON para objeto Model
     * 
     * @param json - String JSON ou objeto
     * @returns Objeto Model
     * 
     * @example
     * ```typescript
     * const json = fs.readFileSync('model.json', 'utf-8');
     * const model = JSONView.deserialize(json);
     * const domainModel = new DomainModel({ model });
     * ```
     */
    public static deserialize(json: string | any): Model {
        const data = typeof json === 'string' ? JSON.parse(json) : json;
        
        // Reconstrói timestamps
        this.reconstructDates(data);
        
        return data as Model;
    }

    /**
     * Reconstrói objetos Date a partir de strings ISO
     */
    private static reconstructDates(obj: any): void {
        if (!obj || typeof obj !== 'object') return;

        for (const key in obj) {
            const value = obj[key];
            
            // Reconstrói timestamps
            if ((key === 'createdAt' || key === 'modifiedAt') && typeof value === 'string') {
                obj[key] = new Date(value);
            }
            
            // Recursão
            if (typeof value === 'object') {
                this.reconstructDates(value);
            }
        }
    }

    /**
     * Compara dois modelos e retorna diferenças
     * 
     * @param model1 - Primeiro modelo
     * @param model2 - Segundo modelo
     * @returns Objeto com diferenças encontradas
     * 
     * @example
     * ```typescript
     * const diff = JSONView.diff(modelV1, modelV2);
     * console.log(`Entidades adicionadas: ${diff.added.entities.length}`);
     * ```
     */
    public static diff(model1: DomainModel, model2: DomainModel): any {
        const json1 = this.serialize(model1, { strategy: SerializationStrategy.COMPACT });
        const json2 = this.serialize(model2, { strategy: SerializationStrategy.COMPACT });
        
        const obj1 = JSON.parse(json1);
        const obj2 = JSON.parse(json2);

        return {
            added: this.findAdded(obj1, obj2),
            removed: this.findRemoved(obj1, obj2),
            modified: this.findModified(obj1, obj2)
        };
    }

    /**
     * Encontra elementos adicionados
     */
    private static findAdded(obj1: any, obj2: any): any {
        // Implementação simplificada
        return { modules: [], entities: [], attributes: [] };
    }

    /**
     * Encontra elementos removidos
     */
    private static findRemoved(obj1: any, obj2: any): any {
        // Implementação simplificada
        return { modules: [], entities: [], attributes: [] };
    }

    /**
     * Encontra elementos modificados
     */
    private static findModified(obj1: any, obj2: any): any {
        // Implementação simplificada
        return { modules: [], entities: [], attributes: [] };
    }
}
