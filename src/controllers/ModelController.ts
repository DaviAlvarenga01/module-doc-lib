/**
 * Model Controller
 * 
 * Controlador responsável por operações de alto nível sobre modelos completos.
 * Fornece interface para criação, manipulação e análise de modelos de domínio,
 * coordenando operações entre múltiplos módulos e entidades.
 * 
 * Responsabilidades:
 * - Criação e inicialização de modelos
 * - Importação/exportação de modelos
 * - Análise de dependências entre módulos
 * - Validação estrutural completa
 * - Geração de estatísticas globais
 * - Transformações em massa
 * 
 * Padrões Utilizados:
 * - Controller Pattern (MVC)
 * - Facade Pattern (simplifica operações complexas)
 * - Strategy Pattern (diferentes estratégias de validação)
 * 
 * @module controllers/ModelController
 * @see {@link DomainModel} - Model wrapper que este controller manipula
 * @see {@link ValidationController} - Controller de validação usado internamente
 */

import {
    Model,
    Module,
    LocalEntity,
    Configuration,
    Metadata,
    DATATYPE
} from '../types/index.js';
import { DomainModel, ModuleModel, EntityModel, ValidationError } from '../models/index.js';
import { isModule, isLocalEntity } from '../utils/TypeGuards.js';
import { Graph } from '../utils/GraphUtils.js';

/**
 * Opções para criação de novo modelo
 */
export interface CreateModelOptions {
    /** Nome do projeto/sistema */
    name: string;
    /** Versão do modelo (ex: "1.0.0") */
    version: string;
    /** Descrição do projeto */
    description?: string;
    /** Autor do modelo */
    author?: string;
    /** Tags para categorização */
    tags?: string[];
}

/**
 * Resultado de análise de dependências entre módulos
 */
export interface DependencyAnalysis {
    /** Módulo analisado */
    module: Module;
    /** Módulos dos quais este módulo depende */
    dependencies: Module[];
    /** Módulos que dependem deste módulo */
    dependents: Module[];
    /** Indica se há dependências circulares */
    hasCircularDependencies: boolean;
}

/**
 * Estatísticas globais do modelo
 */
export interface GlobalModelStatistics {
    /** Total de módulos (incluindo submódulos) */
    totalModules: number;
    /** Total de entidades em todo o modelo */
    totalEntities: number;
    /** Total de enumerações */
    totalEnums: number;
    /** Total de atributos em todas as entidades */
    totalAttributes: number;
    /** Total de relacionamentos */
    totalRelations: number;
    /** Total de funções/métodos */
    totalFunctions: number;
    /** Profundidade máxima da hierarquia de módulos */
    maxModuleDepth: number;
    /** Entidade com mais atributos */
    largestEntity?: { name: string; attributeCount: number };
    /** Módulo com mais entidades */
    largestModule?: { name: string; entityCount: number };
}

/**
 * Model Controller
 * 
 * Controlador principal para operações sobre modelos de domínio.
 * Coordena a criação, manipulação e análise de estruturas de modelo complexas.
 */
export class ModelController {
    /**
     * Cria novo modelo de domínio com configuração inicial
     * 
     * @param options - Opções de configuração do modelo
     * @returns Modelo de domínio criado e inicializado
     * 
     * @example
     * ```typescript
     * const model = ModelController.createModel({
     *   name: 'Sistema de Vendas',
     *   version: '1.0.0',
     *   description: 'Sistema de gestão de vendas online',
     *   author: 'Equipe Dev',
     *   tags: ['vendas', 'e-commerce']
     * });
     * ```
     */
    public static createModel(options: CreateModelOptions): DomainModel {
        return new DomainModel({
            name: options.name,
            version: options.version,
            description: options.description,
            author: options.author
        });
    }

    /**
     * Importa modelo a partir de objeto Model
     * 
     * Útil para reconstruir modelo a partir de JSON ou outras fontes.
     * 
     * @param model - Objeto Model a ser encapsulado
     * @returns DomainModel wrapping o Model fornecido
     * 
     * @example
     * ```typescript
     * const jsonModel = JSON.parse(jsonString);
     * const model = ModelController.importModel(jsonModel);
     * ```
     */
    public static importModel(model: Model): DomainModel {
        return new DomainModel({ model });
    }

    /**
     * Analisa dependências entre módulos do modelo
     * 
     * Identifica relacionamentos entre módulos baseado em:
     * - Referências entre entidades de módulos diferentes
     * - Herança cross-module
     * - Dependências transitivas
     * 
     * @param domainModel - Modelo a ser analisado
     * @returns Array com análise de dependências de cada módulo
     * 
     * @example
     * ```typescript
     * const analysis = ModelController.analyzeDependencies(model);
     * analysis.forEach(dep => {
     *   if (dep.hasCircularDependencies) {
     *     console.warn(`Circular dependency in ${dep.module.name}`);
     *   }
     * });
     * ```
     */
    public static analyzeDependencies(domainModel: DomainModel): DependencyAnalysis[] {
        const model = domainModel.getModel();
        const modules = model.abstractElements.filter((e): e is Module => isModule(e));
        const result: DependencyAnalysis[] = [];

        // Mapa: módulo -> entidades que ele contém
        const moduleEntities = new Map<Module, LocalEntity[]>();
        modules.forEach(mod => {
            const entities = mod.elements.filter((e): e is LocalEntity => isLocalEntity(e));
            moduleEntities.set(mod, entities);
        });

        // Para cada módulo, analisa dependências
        for (const module of modules) {
            const dependencies: Module[] = [];
            const dependents: Module[] = [];
            const entities = moduleEntities.get(module) || [];

            // Encontra dependências (módulos que este módulo usa)
            for (const entity of entities) {
                // Verifica relacionamentos
                for (const relation of entity.relations) {
                    const targetRef = relation.entity;
                    if (targetRef && targetRef.$ref) {
                        const targetEntity = targetRef.$ref;
                        const targetModule = targetEntity.$container as Module;
                        
                        if (targetModule && targetModule !== module && isModule(targetModule)) {
                            if (!dependencies.includes(targetModule)) {
                                dependencies.push(targetModule);
                            }
                        }
                    }
                }

                // Verifica herança
                if (entity.superType?.$ref) {
                    const superEntity = entity.superType.$ref;
                    const superModule = superEntity.$container as Module;
                    
                    if (superModule && superModule !== module && isModule(superModule)) {
                        if (!dependencies.includes(superModule)) {
                            dependencies.push(superModule);
                        }
                    }
                }
            }

            // Encontra dependentes (módulos que usam este módulo)
            for (const otherModule of modules) {
                if (otherModule === module) continue;
                
                const otherEntities = moduleEntities.get(otherModule) || [];
                for (const entity of otherEntities) {
                    for (const relation of entity.relations) {
                        const targetRef = relation.entity;
                        if (targetRef?.$ref?.$container === module) {
                            if (!dependents.includes(otherModule)) {
                                dependents.push(otherModule);
                            }
                        }
                    }
                }
            }

            // Detecta dependências circulares
            const hasCircular = this.hasCircularDependency(module, dependencies, moduleEntities);

            result.push({
                module,
                dependencies,
                dependents,
                hasCircularDependencies: hasCircular
            });
        }

        return result;
    }

    /**
     * Verifica se existe dependência circular a partir de um módulo
     * 
     * @param module - Módulo inicial
     * @param dependencies - Dependências diretas do módulo
     * @param moduleEntities - Mapa de módulos para entidades
     * @returns true se há dependência circular
     */
    private static hasCircularDependency(
        module: Module,
        dependencies: Module[],
        moduleEntities: Map<Module, LocalEntity[]>
    ): boolean {
        const visited = new Set<Module>();
        const stack = new Set<Module>();

        const dfs = (current: Module): boolean => {
            if (stack.has(current)) return true;
            if (visited.has(current)) return false;

            visited.add(current);
            stack.add(current);

            // Encontra dependências do módulo atual
            const entities = moduleEntities.get(current) || [];
            for (const entity of entities) {
                for (const relation of entity.relations) {
                    const targetRef = relation.entity;
                    if (targetRef?.$ref) {
                        const targetModule = targetRef.$ref.$container as Module;
                        if (targetModule && isModule(targetModule)) {
                            if (dfs(targetModule)) return true;
                        }
                    }
                }
            }

            stack.delete(current);
            return false;
        };

        return dfs(module);
    }

    /**
     * Gera estatísticas completas do modelo
     * 
     * Analisa toda a estrutura e retorna métricas úteis para:
     * - Visualização de complexidade
     * - Identificação de hotspots
     * - Relatórios de documentação
     * 
     * @param domainModel - Modelo a ser analisado
     * @returns Estatísticas completas do modelo
     * 
     * @example
     * ```typescript
     * const stats = ModelController.getStatistics(model);
     * console.log(`Total de entidades: ${stats.totalEntities}`);
     * console.log(`Maior módulo: ${stats.largestModule?.name}`);
     * ```
     */
    public static getStatistics(domainModel: DomainModel): GlobalModelStatistics {
        const model = domainModel.getModel();
        const stats: GlobalModelStatistics = {
            totalModules: 0,
            totalEntities: 0,
            totalEnums: 0,
            totalAttributes: 0,
            totalRelations: 0,
            totalFunctions: 0,
            maxModuleDepth: 0
        };

        let largestEntityCount = 0;
        let largestModuleEntityCount = 0;

        // Função recursiva para processar módulos e submódulos
        const processModule = (module: Module, depth: number) => {
            stats.totalModules++;
            stats.maxModuleDepth = Math.max(stats.maxModuleDepth, depth);

            let moduleEntityCount = 0;

            for (const element of module.elements) {
                if (isLocalEntity(element)) {
                    stats.totalEntities++;
                    moduleEntityCount++;

                    const attrCount = element.attributes.length;
                    stats.totalAttributes += attrCount;
                    stats.totalRelations += element.relations.length;
                    stats.totalFunctions += element.functions.length;

                    if (attrCount > largestEntityCount) {
                        largestEntityCount = attrCount;
                        stats.largestEntity = {
                            name: element.name,
                            attributeCount: attrCount
                        };
                    }
                } else if (element.$type === 'EnumX') {
                    stats.totalEnums++;
                } else if (isModule(element)) {
                    processModule(element, depth + 1);
                }
            }

            if (moduleEntityCount > largestModuleEntityCount) {
                largestModuleEntityCount = moduleEntityCount;
                stats.largestModule = {
                    name: module.name,
                    entityCount: moduleEntityCount
                };
            }
        };

        // Processa todos os módulos raiz
        for (const element of model.abstractElements) {
            if (isModule(element)) {
                processModule(element, 1);
            }
        }

        return stats;
    }

    /**
     * Obtém ordem topológica dos módulos baseado em dependências
     * 
     * Útil para determinar ordem de processamento/geração onde
     * dependências devem ser processadas antes de dependentes.
     * 
     * @param domainModel - Modelo cujos módulos serão ordenados
     * @returns Array de módulos em ordem topológica
     * @throws Error se houver dependências circulares
     * 
     * @example
     * ```typescript
     * const order = ModelController.getTopologicalOrder(model);
     * // Gera código na ordem correta
     * order.forEach(module => generateCode(module));
     * ```
     */
    public static getTopologicalOrder(domainModel: DomainModel): Module[] {
        const dependencies = this.analyzeDependencies(domainModel);
        
        // Verifica dependências circulares
        const circular = dependencies.find(dep => dep.hasCircularDependencies);
        if (circular) {
            throw new Error(
                `Dependência circular detectada no módulo '${circular.module.name}'`
            );
        }

        // Cria grafo de dependências usando nomes de módulos
        const graph = new Graph();
        const moduleMap = new Map<string, Module>();
        
        dependencies.forEach(dep => {
            graph.addVertex(dep.module.name, dep.module.name, []);
            moduleMap.set(dep.module.name, dep.module);
            dep.dependencies.forEach(dependency => {
                graph.addEdge(dependency.name, dep.module.name);
            });
        });

        // Retorna ordem topológica convertendo nomes de volta para módulos
        const sortedNames = graph.topologicalSort();
        if (!sortedNames) {
            throw new Error('Não foi possível gerar ordem topológica');
        }
        return sortedNames.map(name => moduleMap.get(name)!).filter(m => m !== undefined);
    }

    /**
     * Valida modelo completo
     * 
     * Executa validação estrutural completa incluindo:
     * - Validação de cada módulo
     * - Validação de referências cross-module
     * - Validação de dependências
     * - Validação de nomes únicos
     * 
     * @param domainModel - Modelo a ser validado
     * @returns Array de erros encontrados (vazio se válido)
     * 
     * @example
     * ```typescript
     * const errors = ModelController.validate(model);
     * if (errors.length > 0) {
     *   errors.forEach(err => console.error(err.message));
     * }
     * ```
     */
    public static validate(domainModel: DomainModel): ValidationError[] {
        return domainModel.validate();
    }

    /**
     * Exporta modelo para formato JSON serializável
     * 
     * @param domainModel - Modelo a ser exportado
     * @returns Objeto JSON representando o modelo
     * 
     * @example
     * ```typescript
     * const json = ModelController.exportToJSON(model);
     * fs.writeFileSync('model.json', JSON.stringify(json, null, 2));
     * ```
     */
    public static exportToJSON(domainModel: DomainModel): any {
        return domainModel.toJSON();
    }

    /**
     * Clona modelo completo (deep copy)
     * 
     * @param domainModel - Modelo a ser clonado
     * @returns Nova instância do modelo com mesmos dados
     * 
     * @example
     * ```typescript
     * const original = ModelController.createModel({ ... });
     * const copy = ModelController.cloneModel(original);
     * // Modificações em copy não afetam original
     * ```
     */
    public static cloneModel(domainModel: DomainModel): DomainModel {
        const json = domainModel.toJSON();
        // Deep copy via JSON
        const clonedJson = JSON.parse(JSON.stringify(json));
        return new DomainModel({ model: clonedJson });
    }
}
