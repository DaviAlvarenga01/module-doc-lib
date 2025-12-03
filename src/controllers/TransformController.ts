/**
 * Transform Controller
 * 
 * Controlador responsável por transformações em modelos de domínio.
 * Permite modificar estruturas existentes, aplicar padrões de refatoração,
 * e realizar transformações em massa.
 * 
 * Responsabilidades:
 * - Refatoração de nomes
 * - Movimentação de elementos entre módulos
 * - Aplicação de padrões de design
 * - Normalização de estruturas
 * - Transformações em lote
 * - Mesclagem de modelos
 * 
 * Tipos de Transformação:
 * - Structural: Alterar estrutura do modelo
 * - Normalization: Padronizar nomenclatura e organização
 * - Refactoring: Melhorar design sem alterar comportamento
 * - Migration: Converter entre versões ou padrões
 * 
 * @module controllers/TransformController
 * @see {@link Model} - Estrutura transformada
 * @see {@link DomainModel} - Wrapper para manipulação
 */

import {
    Model,
    Module,
    LocalEntity,
    Attribute,
    EnumX,
    Reference,
    DATATYPE
} from '../types/index.js';
import { DomainModel, ModuleModel, EntityModel } from '../models/index.js';
import { isModule, isLocalEntity, isEnumX } from '../utils/TypeGuards.js';
import { toPascalCase, toCamelCase, toSnakeCase } from '../utils/StringUtils.js';

/**
 * Convenção de nomenclatura
 */
export enum NamingConvention {
    /** PascalCase (ex: UserProfile) */
    PASCAL_CASE = 'PascalCase',
    /** camelCase (ex: userProfile) */
    CAMEL_CASE = 'camelCase',
    /** snake_case (ex: user_profile) */
    SNAKE_CASE = 'snake_case',
    /** UPPER_CASE (ex: USER_PROFILE) */
    UPPER_CASE = 'UPPER_CASE'
}

/**
 * Resultado de uma transformação
 */
export interface TransformResult {
    /** Sucesso da operação */
    success: boolean;
    /** Mensagem descritiva */
    message: string;
    /** Número de elementos afetados */
    affectedCount: number;
    /** Detalhes adicionais */
    details?: string[];
}

/**
 * Opções para mesclagem de modelos
 */
export interface MergeOptions {
    /** Como resolver conflitos de nomes */
    conflictResolution: 'rename' | 'skip' | 'overwrite';
    /** Prefixo para elementos renomeados (conflictResolution='rename') */
    renamePrefix?: string;
    /** Mesclar metadados */
    mergeMetadata?: boolean;
}

/**
 * Transform Controller
 * 
 * Controlador que implementa transformações e refatorações
 * sobre modelos de domínio.
 */
export class TransformController {
    /**
     * Normaliza nomes de módulos seguindo convenção
     * 
     * Aplica convenção de nomenclatura a todos os módulos do modelo.
     * Útil para padronizar modelos de diferentes fontes.
     * 
     * @param domainModel - Modelo a ser normalizado
     * @param convention - Convenção a ser aplicada
     * @returns Resultado da transformação
     * 
     * @example
     * ```typescript
     * const result = TransformController.normalizeModuleNames(
     *   model,
     *   NamingConvention.PASCAL_CASE
     * );
     * console.log(`Normalizados ${result.affectedCount} módulos`);
     * ```
     */
    public static normalizeModuleNames(
        domainModel: DomainModel,
        convention: NamingConvention
    ): TransformResult {
        const model = domainModel.getModel();
        let count = 0;
        const details: string[] = [];

        const processModule = (module: Module) => {
            const oldName = module.name;
            const newName = this.applyNamingConvention(oldName, convention);
            
            if (oldName !== newName) {
                module.name = newName;
                count++;
                details.push(`${oldName} → ${newName}`);
            }

            // Processa submódulos
            for (const element of module.elements) {
                if (isModule(element)) {
                    processModule(element);
                }
            }
        };

        for (const element of model.abstractElements) {
            if (isModule(element)) {
                processModule(element);
            }
        }

        return {
            success: true,
            message: `Normalizados ${count} módulos para ${convention}`,
            affectedCount: count,
            details: details.length > 0 ? details : undefined
        };
    }

    /**
     * Normaliza nomes de entidades seguindo convenção
     * 
     * @param domainModel - Modelo a ser normalizado
     * @param convention - Convenção a ser aplicada
     * @returns Resultado da transformação
     * 
     * @example
     * ```typescript
     * TransformController.normalizeEntityNames(model, NamingConvention.PASCAL_CASE);
     * ```
     */
    public static normalizeEntityNames(
        domainModel: DomainModel,
        convention: NamingConvention
    ): TransformResult {
        const model = domainModel.getModel();
        let count = 0;
        const details: string[] = [];

        const processModule = (module: Module) => {
            for (const element of module.elements) {
                if (isLocalEntity(element)) {
                    const oldName = element.name;
                    const newName = this.applyNamingConvention(oldName, convention);
                    
                    if (oldName !== newName) {
                        element.name = newName;
                        count++;
                        details.push(`${oldName} → ${newName}`);
                    }
                } else if (isModule(element)) {
                    processModule(element);
                }
            }
        };

        for (const element of model.abstractElements) {
            if (isModule(element)) {
                processModule(element);
            }
        }

        return {
            success: true,
            message: `Normalizadas ${count} entidades para ${convention}`,
            affectedCount: count,
            details: details.length > 0 ? details : undefined
        };
    }

    /**
     * Normaliza nomes de atributos seguindo convenção
     * 
     * @param domainModel - Modelo a ser normalizado
     * @param convention - Convenção a ser aplicada
     * @returns Resultado da transformação
     * 
     * @example
     * ```typescript
     * TransformController.normalizeAttributeNames(model, NamingConvention.CAMEL_CASE);
     * ```
     */
    public static normalizeAttributeNames(
        domainModel: DomainModel,
        convention: NamingConvention
    ): TransformResult {
        const model = domainModel.getModel();
        let count = 0;
        const details: string[] = [];

        const processModule = (module: Module) => {
            for (const element of module.elements) {
                if (isLocalEntity(element)) {
                    for (const attr of element.attributes) {
                        const oldName = attr.name;
                        const newName = this.applyNamingConvention(oldName, convention);
                        
                        if (oldName !== newName) {
                            attr.name = newName;
                            count++;
                            details.push(`${element.name}.${oldName} → ${newName}`);
                        }
                    }
                } else if (isModule(element)) {
                    processModule(element);
                }
            }
        };

        for (const element of model.abstractElements) {
            if (isModule(element)) {
                processModule(element);
            }
        }

        return {
            success: true,
            message: `Normalizados ${count} atributos para ${convention}`,
            affectedCount: count,
            details: details.length > 0 ? details : undefined
        };
    }

    /**
     * Aplica convenção de nomenclatura a uma string
     */
    private static applyNamingConvention(name: string, convention: NamingConvention): string {
        switch (convention) {
            case NamingConvention.PASCAL_CASE:
                return toPascalCase(name);
            case NamingConvention.CAMEL_CASE:
                return toCamelCase(name);
            case NamingConvention.SNAKE_CASE:
                return toSnakeCase(name);
            case NamingConvention.UPPER_CASE:
                return toSnakeCase(name).toUpperCase();
            default:
                return name;
        }
    }

    /**
     * Move entidade de um módulo para outro
     * 
     * @param entity - Entidade a ser movida
     * @param sourceModule - Módulo de origem
     * @param targetModule - Módulo de destino
     * @returns Resultado da transformação
     * 
     * @example
     * ```typescript
     * const vendas = model.getModule('Vendas');
     * const relatorios = model.getModule('Relatorios');
     * const produto = vendas.getEntity('Produto');
     * 
     * TransformController.moveEntity(produto, vendas, relatorios);
     * ```
     */
    public static moveEntity(
        entity: LocalEntity,
        sourceModule: Module,
        targetModule: Module
    ): TransformResult {
        // Verifica se entidade existe no módulo fonte
        const sourceIndex = sourceModule.elements.findIndex(
            e => isLocalEntity(e) && e === entity
        );

        if (sourceIndex === -1) {
            return {
                success: false,
                message: `Entidade '${entity.name}' não encontrada no módulo '${sourceModule.name}'`,
                affectedCount: 0
            };
        }

        // Verifica se já existe no destino
        const existsInTarget = targetModule.elements.some(
            e => isLocalEntity(e) && e.name === entity.name
        );

        if (existsInTarget) {
            return {
                success: false,
                message: `Entidade '${entity.name}' já existe no módulo '${targetModule.name}'`,
                affectedCount: 0
            };
        }

        // Move entidade
        sourceModule.elements.splice(sourceIndex, 1);
        (entity as any).$container = targetModule;
        targetModule.elements.push(entity);

        // Atualiza timestamps
        if (sourceModule.metadata) {
            sourceModule.metadata.modifiedAt = new Date();
        }
        if (targetModule.metadata) {
            targetModule.metadata.modifiedAt = new Date();
        }

        return {
            success: true,
            message: `Entidade '${entity.name}' movida de '${sourceModule.name}' para '${targetModule.name}'`,
            affectedCount: 1
        };
    }

    /**
     * Renomeia entidade e atualiza todas as referências
     * 
     * @param entity - Entidade a ser renomeada
     * @param newName - Novo nome
     * @param domainModel - Modelo completo (para atualizar referências)
     * @returns Resultado da transformação
     * 
     * @example
     * ```typescript
     * const user = model.getModule('Auth').getEntity('User');
     * TransformController.renameEntity(user, 'Usuario', model);
     * ```
     */
    public static renameEntity(
        entity: LocalEntity,
        newName: string,
        domainModel: DomainModel
    ): TransformResult {
        const oldName = entity.name;
        
        if (oldName === newName) {
            return {
                success: true,
                message: 'Nome não alterado',
                affectedCount: 0
            };
        }

        // Atualiza nome
        entity.name = newName;

        // Atualiza timestamp
        if (entity.metadata) {
            entity.metadata.modifiedAt = new Date();
        }

        // TODO: Atualizar todas as referências para esta entidade
        // Isso requer percorrer todos os relacionamentos no modelo

        return {
            success: true,
            message: `Entidade renomeada de '${oldName}' para '${newName}'`,
            affectedCount: 1,
            details: ['Atenção: Referências podem precisar ser atualizadas manualmente']
        };
    }

    /**
     * Adiciona atributo de timestamp (createdAt/updatedAt) a todas as entidades
     * 
     * Padrão comum em modelos de domínio para auditoria.
     * 
     * @param domainModel - Modelo a ser transformado
     * @param includeCreatedAt - Incluir createdAt
     * @param includeUpdatedAt - Incluir updatedAt
     * @returns Resultado da transformação
     * 
     * @example
     * ```typescript
     * TransformController.addTimestamps(model, true, true);
     * ```
     */
    public static addTimestamps(
        domainModel: DomainModel,
        includeCreatedAt: boolean = true,
        includeUpdatedAt: boolean = true
    ): TransformResult {
        const model = domainModel.getModel();
        let count = 0;
        const details: string[] = [];

        const processModule = (module: Module) => {
            for (const element of module.elements) {
                if (isLocalEntity(element)) {
                    let added = false;

                    // Adiciona createdAt
                    if (includeCreatedAt && !element.attributes.some(a => a.name === 'createdAt')) {
                        const attr: Attribute = {
                            $type: 'Attribute',
                            $container: element,
                            name: 'createdAt',
                            type: DATATYPE.datetime,
                            unique: false,
                            blank: false,
                            metadata: {
                                description: 'Data de criação',
                                author: 'System',
                                createdAt: new Date(),
                                modifiedAt: new Date()
                            }
                        };
                        element.attributes.push(attr);
                        added = true;
                    }

                    // Adiciona updatedAt
                    if (includeUpdatedAt && !element.attributes.some(a => a.name === 'updatedAt')) {
                        const attr: Attribute = {
                            $type: 'Attribute',
                            $container: element,
                            name: 'updatedAt',
                            type: DATATYPE.datetime,
                            unique: false,
                            blank: false,
                            metadata: {
                                description: 'Data de última atualização',
                                author: 'System',
                                createdAt: new Date(),
                                modifiedAt: new Date()
                            }
                        };
                        element.attributes.push(attr);
                        added = true;
                    }

                    if (added) {
                        count++;
                        details.push(element.name);
                        if (element.metadata) {
                            element.metadata.modifiedAt = new Date();
                        }
                    }
                } else if (isModule(element)) {
                    processModule(element);
                }
            }
        };

        for (const element of model.abstractElements) {
            if (isModule(element)) {
                processModule(element);
            }
        }

        return {
            success: true,
            message: `Timestamps adicionados a ${count} entidades`,
            affectedCount: count,
            details: details.length > 0 ? details : undefined
        };
    }

    /**
     * Remove atributos não utilizados (sem metadata ou descrição)
     * 
     * Limpeza de atributos que parecem estar incompletos ou abandonados.
     * 
     * @param domainModel - Modelo a ser limpo
     * @param dryRun - Se true, apenas reporta sem remover
     * @returns Resultado da transformação
     * 
     * @example
     * ```typescript
     * // Primeiro verifica o que seria removido
     * const preview = TransformController.removeUnusedAttributes(model, true);
     * console.log(preview.details);
     * 
     * // Depois remove de fato
     * const result = TransformController.removeUnusedAttributes(model, false);
     * ```
     */
    public static removeUnusedAttributes(
        domainModel: DomainModel,
        dryRun: boolean = false
    ): TransformResult {
        const model = domainModel.getModel();
        let count = 0;
        const details: string[] = [];

        const processModule = (module: Module) => {
            for (const element of module.elements) {
                if (isLocalEntity(element)) {
                    const toRemove: number[] = [];

                    element.attributes.forEach((attr, index) => {
                        // Considera "não utilizado" se não tem metadata ou descrição vazia
                        if (!attr.metadata || !attr.metadata.description || attr.metadata.description.trim() === '') {
                            toRemove.push(index);
                            details.push(`${element.name}.${attr.name}`);
                        }
                    });

                    if (!dryRun) {
                        // Remove em ordem reversa para não afetar índices
                        toRemove.reverse().forEach(index => {
                            element.attributes.splice(index, 1);
                        });

                        if (toRemove.length > 0 && element.metadata) {
                            element.metadata.modifiedAt = new Date();
                        }
                    }

                    count += toRemove.length;
                } else if (isModule(element)) {
                    processModule(element);
                }
            }
        };

        for (const element of model.abstractElements) {
            if (isModule(element)) {
                processModule(element);
            }
        }

        return {
            success: true,
            message: dryRun
                ? `Seriam removidos ${count} atributos`
                : `Removidos ${count} atributos não utilizados`,
            affectedCount: count,
            details: details.length > 0 ? details : undefined
        };
    }

    /**
     * Mescla dois modelos em um único modelo
     * 
     * Combina módulos, entidades e outros elementos de dois modelos.
     * Útil para integração de sistemas ou consolidação de modelos.
     * 
     * @param model1 - Primeiro modelo (base)
     * @param model2 - Segundo modelo (a ser mesclado)
     * @param options - Opções de mesclagem
     * @returns Novo modelo mesclado
     * 
     * @example
     * ```typescript
     * const merged = TransformController.mergeModels(modelA, modelB, {
     *   conflictResolution: 'rename',
     *   renamePrefix: 'imported_'
     * });
     * ```
     */
    public static mergeModels(
        model1: DomainModel,
        model2: DomainModel,
        options: MergeOptions
    ): DomainModel {
        // Clona o primeiro modelo como base
        const m1 = model1.getModel();
        const m2 = model2.getModel();

        // Cria novo modelo mesclado
        const merged = new DomainModel({
            name: `${m1.configuration?.name || 'Model1'} + ${m2.configuration?.name || 'Model2'}`,
            version: '1.0.0',
            description: 'Modelo mesclado',
            author: 'System'
        });

        const mergedModel = merged.getModel();

        // Copia módulos do primeiro modelo
        for (const element of m1.abstractElements) {
            if (isModule(element)) {
                mergedModel.abstractElements.push(this.deepCloneModule(element));
            }
        }

        // Adiciona módulos do segundo modelo
        for (const element of m2.abstractElements) {
            if (isModule(element)) {
                const existingNames = mergedModel.abstractElements
                    .filter(isModule)
                    .map(m => m.name);

                if (existingNames.includes(element.name)) {
                    // Conflito detectado
                    if (options.conflictResolution === 'skip') {
                        continue;
                    } else if (options.conflictResolution === 'rename') {
                        const cloned = this.deepCloneModule(element);
                        cloned.name = `${options.renamePrefix || 'imported_'}${cloned.name}`;
                        mergedModel.abstractElements.push(cloned);
                    } else if (options.conflictResolution === 'overwrite') {
                        const index = mergedModel.abstractElements.findIndex(
                            e => isModule(e) && e.name === element.name
                        );
                        if (index >= 0) {
                            mergedModel.abstractElements[index] = this.deepCloneModule(element);
                        }
                    }
                } else {
                    mergedModel.abstractElements.push(this.deepCloneModule(element));
                }
            }
        }

        return merged;
    }

    /**
     * Clona profundamente um módulo (helper interno)
     */
    private static deepCloneModule(module: Module): Module {
        // Deep copy via JSON (simples mas funcional)
        const json = JSON.stringify(module);
        return JSON.parse(json);
    }
}
