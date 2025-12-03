/**
 * ModuleModel.ts
 * 
 * Título: Modelo de Módulo (Namespace)
 * 
 * Descrição:
 * Classe que encapsula o tipo Module e fornece métodos para gerenciamento
 * de elementos contidos no módulo (entidades, enumerações, submódulos).
 * Módulos funcionam como namespaces organizacionais, agrupando elementos
 * relacionados logicamente. Suporta hierarquia de módulos aninhados.
 * 
 * Processos:
 * 1. Encapsula tipo Module da camada Types
 * 2. Fornece métodos para adicionar/remover elementos
 * 3. Gerencia submódulos (hierarquia aninhada)
 * 4. Valida unicidade de nomes dentro do módulo
 * 5. Calcula estatísticas do módulo
 * 6. Gera nome qualificado hierárquico
 * 7. Busca elementos por nome/tipo
 * 8. Serializa/desserializa para JSON
 * 
 * Conformidade:
 * - ISO/IEC 25010: Modularidade, Reusabilidade
 * - ISO/IEC 12207: Processo de design arquitetural
 * - ISO 9001: Rastreabilidade de componentes
 * 
 * @module models/ModuleModel
 * @author module-doc-lib
 * @version 1.0.0
 * 
 * @example
 * ```typescript
 * // Criar módulo
 * const vendas = new ModuleModel({
 *   name: 'Vendas',
 *   description: 'Módulo de vendas'
 * });
 * 
 * // Adicionar entidade ao módulo
 * const clienteEntity = vendas.addEntity({
 *   name: 'Cliente',
 *   description: 'Cliente do sistema'
 * });
 * 
 * // Adicionar submódulo ao módulo
 * const relatoriosModule = vendas.addSubModule({
 *   name: 'Relatorios',
 *   description: 'Relatórios de vendas'
 * });
 * ```
 */

import type {
    Module,
    LocalEntity,
    EnumX,
    AbstractElement,
    Metadata,
    AstNode
} from '../types/index.js';
import {
    isModule,
    isLocalEntity,
    isEnumX
} from '../utils/TypeGuards.js';
import {
    getQualifiedName
} from '../utils/AstUtils.js';

/**
 * Título: Opções de Criação do Módulo
 * 
 * Descrição:
 * Interface para configuração inicial do módulo.
 */
export interface ModuleModelOptions {
    /** Nome do módulo (usado em namespace) */
    name: string;
    /** Descrição do propósito do módulo */
    description?: string;
    /** Tags para categorização */
    tags?: string[];
    /** Autor do módulo */
    author?: string;
    /** Container pai (Model ou Module) */
    container?: AstNode;
}

/**
 * Título: Estatísticas do Módulo
 * 
 * Descrição:
 * Métricas quantitativas sobre o conteúdo do módulo.
 */
export interface ModuleStatistics {
    /** Total de entidades diretas (não conta submódulos) */
    directEntityCount: number;
    /** Total de entidades incluindo submódulos (recursivo) */
    totalEntityCount: number;
    /** Total de enumerações diretas */
    directEnumCount: number;
    /** Total de enumerações incluindo submódulos */
    totalEnumCount: number;
    /** Total de submódulos diretos */
    subModuleCount: number;
    /** Total de submódulos incluindo aninhados (recursivo) */
    totalSubModuleCount: number;
    /** Profundidade máxima de aninhamento */
    maxDepth: number;
}

/**
 * Título: Classe Modelo de Módulo
 * 
 * Descrição:
 * Representa um módulo (namespace) que agrupa entidades, enumerações e
 * submódulos relacionados. Fornece API orientada a objetos para manipulação
 * de elementos, seguindo princípio KISS.
 * 
 * Processos:
 * 1. Construtor inicializa estrutura Module vazia
 * 2. Métodos add* criam e adicionam elementos
 * 3. Métodos remove* removem elementos com validação
 * 4. Métodos get* recuperam elementos por critérios
 * 5. Métodos find* buscam recursivamente (incluindo submódulos)
 * 6. Método validate verifica integridade
 * 7. Método getStatistics calcula métricas
 * 
 * @class ModuleModel
 */
export class ModuleModel {
    /**
     * Estrutura interna do módulo (tipo Module da camada Types)
     * @private
     */
    private module: Module;

    /**
     * Título: Construtor do Modelo de Módulo
     * 
     * Descrição:
     * Inicializa novo módulo com metadados fornecidos.
     * 
     * Processos:
     * 1. Cria estrutura Module vazia
     * 2. Define $container (pai na hierarquia)
     * 3. Inicializa array de elementos vazio
     * 4. Cria metadados com informações fornecidas
     * 
     * @param options - Opções de criação do módulo
     * 
     * @example
     * ```typescript
     * const catalogoModule = new ModuleModel({
     *   name: 'Catalogo',
     *   description: 'Gerenciamento de produtos',
     *   tags: ['produto', 'categoria'],
     *   author: 'Time Backend'
     * });
     * ```
     */
    constructor(options: ModuleModelOptions) {
        const now = new Date();

        // Cria metadados
        const metadata: Metadata = {
            description: options.description || '',
            tags: options.tags || [],
            requirements: [],
            author: options.author || 'Unknown',
            createdAt: now,
            modifiedAt: now
        };

        // Inicializa Module
        this.module = {
            $type: 'Module',
            $container: options.container,
            name: options.name,
            elements: [],
            metadata
        };
    }

    /**
     * Título: Adicionar Entidade ao Módulo
     * 
     * Descrição:
     * Cria nova entidade e adiciona ao módulo. Entidade representará uma
     * classe de domínio no código gerado.
     * 
     * Processos:
     * 1. Valida nome da entidade (não vazio, não duplicado)
     * 2. Cria estrutura LocalEntity
     * 3. Define $container como este módulo
     * 4. Adiciona aos elementos do módulo
     * 5. Atualiza timestamp de modificação
     * 6. Retorna entidade criada
     * 
     * @param options - Nome e metadados da entidade
     * @returns Entidade criada
     * @throws Error se nome for inválido ou duplicado
     * 
     * @example
     * ```typescript
     * const produto = module.addEntity({
     *   name: 'Produto',
     *   description: 'Produto do catálogo',
     *   is_abstract: false
     * });
     * ```
     */
    public addEntity(options: {
        name: string;
        description?: string;
        is_abstract?: boolean;
    }): LocalEntity {
        // Valida nome
        if (!options.name || options.name.trim() === '') {
            throw new Error('Nome da entidade não pode ser vazio');
        }

        // Verifica duplicação
        const existing = this.module.elements.find(
            e => isLocalEntity(e) && e.name === options.name
        );
        if (existing) {
            throw new Error(
                `Entidade '${options.name}' já existe no módulo '${this.module.name}'`
            );
        }

        const now = new Date();

        // Cria entidade
        const entity: LocalEntity = {
            $type: 'LocalEntity',
            $container: this.module,
            name: options.name,
            attributes: [],
            relations: [],
            functions: [],
            is_abstract: options.is_abstract || false,
            metadata: {
                description: options.description || '',
                tags: [],
                requirements: [],
                author: this.module.metadata?.author || 'Unknown',
                createdAt: now,
                modifiedAt: now
            }
        };

        // Adiciona ao módulo
        this.module.elements.push(entity);
        if (this.module.metadata) {
            this.module.metadata.modifiedAt = now;
        }

        return entity;
    }

    /**
     * Título: Adicionar Enumeração ao Módulo
     * 
     * Descrição:
     * Cria nova enumeração e adiciona ao módulo.
     * 
     * Processos:
     * 1. Valida nome da enumeração
     * 2. Verifica duplicação
     * 3. Cria estrutura EnumX
     * 4. Define $container
     * 5. Adiciona aos elementos
     * 6. Atualiza timestamp
     * 
     * @param options - Nome e metadados da enumeração
     * @returns Enumeração criada
     * @throws Error se nome for inválido ou duplicado
     * 
     * @example
     * ```typescript
     * const status = module.addEnum({
     *   name: 'StatusPedido',
     *   description: 'Status possíveis de um pedido'
     * });
     * ```
     */
    public addEnum(options: {
        name: string;
        description?: string;
    }): EnumX {
        // Valida nome
        if (!options.name || options.name.trim() === '') {
            throw new Error('Nome da enumeração não pode ser vazio');
        }

        // Verifica duplicação
        const existing = this.module.elements.find(
            e => isEnumX(e) && e.name === options.name
        );
        if (existing) {
            throw new Error(
                `Enumeração '${options.name}' já existe no módulo '${this.module.name}'`
            );
        }

        const now = new Date();

        // Cria enumeração
        const enumX: EnumX = {
            $type: 'EnumX',
            $container: this.module,
            name: options.name,
            literals: [],
            metadata: {
                description: options.description || '',
                tags: [],
                requirements: [],
                author: this.module.metadata?.author || 'Unknown',
                createdAt: now,
                modifiedAt: now
            }
        };

        // Adiciona ao módulo
        this.module.elements.push(enumX);
        if (this.module.metadata) {
            this.module.metadata.modifiedAt = now;
        }

        return enumX;
    }

    /**
     * Título: Adicionar Submódulo
     * 
     * Descrição:
     * Cria novo submódulo aninhado dentro deste módulo. Permite hierarquia
     * de namespaces (ex: Vendas.Relatorios.Mensais).
     * 
     * Processos:
     * 1. Valida nome do submódulo
     * 2. Verifica duplicação
     * 3. Cria estrutura Module
     * 4. Define $container como este módulo
     * 5. Adiciona aos elementos
     * 6. Atualiza timestamp
     * 7. Retorna submódulo criado
     * 
     * @param options - Nome e metadados do submódulo
     * @returns Submódulo criado
     * @throws Error se nome for inválido ou duplicado
     * 
     * @example
     * ```typescript
     * const relatorios = vendas.addSubModule({
     *   name: 'Relatorios',
     *   description: 'Relatórios de vendas'
     * });
     * 
     * // Submódulo dentro de submódulo
     * const mensais = relatorios.addSubModule({
     *   name: 'Mensais'
     * });
     * ```
     */
    public addSubModule(options: {
        name: string;
        description?: string;
        tags?: string[];
    }): Module {
        // Valida nome
        if (!options.name || options.name.trim() === '') {
            throw new Error('Nome do submódulo não pode ser vazio');
        }

        // Verifica duplicação
        const existing = this.module.elements.find(
            e => isModule(e) && e.name === options.name
        );
        if (existing) {
            throw new Error(
                `Submódulo '${options.name}' já existe no módulo '${this.module.name}'`
            );
        }

        const now = new Date();

        // Cria submódulo
        const subModule: Module = {
            $type: 'Module',
            $container: this.module,
            name: options.name,
            elements: [],
            metadata: {
                description: options.description || '',
                tags: options.tags || [],
                requirements: [],
                author: this.module.metadata?.author || 'Unknown',
                createdAt: now,
                modifiedAt: now
            }
        };

        // Adiciona ao módulo
        this.module.elements.push(subModule);
        if (this.module.metadata) {
            this.module.metadata.modifiedAt = now;
        }

        return subModule;
    }

    /**
     * Título: Remover Elemento do Módulo
     * 
     * Descrição:
     * Remove elemento (entidade, enum ou submódulo) pelo nome.
     * 
     * Processos:
     * 1. Localiza elemento pelo nome
     * 2. Verifica se existe
     * 3. Remove do array de elementos
     * 4. Atualiza timestamp
     * 5. Retorna sucesso
     * 
     * @param elementName - Nome do elemento a remover
     * @returns true se removido com sucesso
     * @throws Error se elemento não existir
     * 
     * @example
     * ```typescript
     * module.removeElement('ProdutoObsoleto');
     * ```
     */
    public removeElement(elementName: string): boolean {
        const index = this.module.elements.findIndex(e => {
            if (isLocalEntity(e) || isEnumX(e) || isModule(e)) {
                return e.name === elementName;
            }
            return false;
        });

        if (index === -1) {
            throw new Error(
                `Elemento '${elementName}' não encontrado no módulo '${this.module.name}'`
            );
        }

        this.module.elements.splice(index, 1);
        if (this.module.metadata) {
            this.module.metadata.modifiedAt = new Date();
        }

        return true;
    }

    /**
     * Título: Obter Nome Qualificado do Módulo
     * 
     * Descrição:
     * Retorna nome hierárquico completo do módulo (ex: "Vendas.Relatorios.Mensais").
     * 
     * Processos:
     * 1. Navega pela hierarquia de containers
     * 2. Coleta nomes de todos os módulos ancestrais
     * 3. Concatena com ponto (.)
     * 4. Retorna string qualificada
     * 
     * @returns Nome qualificado hierárquico
     * 
     * @example
     * ```typescript
     * const vendas = new ModuleModel({ name: 'Vendas' });
     * const relatorios = vendas.addSubModule({ name: 'Relatorios' });
     * 
     * console.log(getQualifiedName(relatorios));
     * // Saída: "Vendas.Relatorios"
     * ```
     */
    public getQualifiedName(): string {
        const parts: string[] = [];
        let current: Module | undefined = this.module;
        
        while (current) {
            parts.unshift(current.name);
            current = current.$container as Module | undefined;
        }
        
        return parts.join('.');
    }

    /**
     * Título: Obter Entidades Diretas
     * 
     * Descrição:
     * Retorna apenas entidades contidas diretamente neste módulo
     * (não inclui entidades de submódulos).
     * 
     * @returns Array de entidades diretas
     * 
     * @example
     * ```typescript
     * const entidades = module.getEntities();
     * console.log(`Módulo possui ${entidades.length} entidades`);
     * ```
     */
    public getEntities(): LocalEntity[] {
        return this.module.elements.filter(isLocalEntity);
    }

    /**
     * Título: Obter Enumerações Diretas
     * 
     * Descrição:
     * Retorna apenas enumerações contidas diretamente neste módulo.
     * 
     * @returns Array de enumerações diretas
     * 
     * @example
     * ```typescript
     * const enums = module.getEnums();
     * ```
     */
    public getEnums(): EnumX[] {
        return this.module.elements.filter(isEnumX);
    }

    /**
     * Título: Obter Submódulos Diretos
     * 
     * Descrição:
     * Retorna apenas submódulos contidos diretamente neste módulo.
     * 
     * @returns Array de submódulos diretos
     * 
     * @example
     * ```typescript
     * const submodulos = module.getSubModules();
     * ```
     */
    public getSubModules(): Module[] {
        return this.module.elements.filter(isModule);
    }

    /**
     * Título: Buscar Entidade por Nome
     * 
     * Descrição:
     * Busca entidade pelo nome apenas neste módulo (não recursivo).
     * 
     * @param name - Nome da entidade
     * @returns Entidade encontrada ou undefined
     * 
     * @example
     * ```typescript
     * const cliente = module.findEntity('Cliente');
     * ```
     */
    public findEntity(name: string): LocalEntity | undefined {
        return this.getEntities().find(e => e.name === name);
    }

    /**
     * Título: Buscar Enumeração por Nome
     * 
     * Descrição:
     * Busca enumeração pelo nome apenas neste módulo.
     * 
     * @param name - Nome da enumeração
     * @returns Enumeração encontrada ou undefined
     * 
     * @example
     * ```typescript
     * const status = module.findEnum('StatusPedido');
     * ```
     */
    public findEnum(name: string): EnumX | undefined {
        return this.getEnums().find(e => e.name === name);
    }

    /**
     * Título: Buscar Submódulo por Nome
     * 
     * Descrição:
     * Busca submódulo pelo nome apenas neste módulo.
     * 
     * @param name - Nome do submódulo
     * @returns Submódulo encontrado ou undefined
     * 
     * @example
     * ```typescript
     * const relatorios = module.findSubModule('Relatorios');
     * ```
     */
    public findSubModule(name: string): Module | undefined {
        return this.getSubModules().find(m => m.name === name);
    }

    /**
     * Título: Obter Todas as Entidades (Recursivo)
     * 
     * Descrição:
     * Retorna todas as entidades deste módulo e de todos os submódulos
     * recursivamente.
     * 
     * Processos:
     * 1. Coleta entidades diretas
     * 2. Para cada submódulo, coleta entidades recursivamente
     * 3. Concatena todos os arrays
     * 4. Retorna array completo
     * 
     * @returns Array com todas as entidades (incluindo submódulos)
     * 
     * @example
     * ```typescript
     * const todasEntidades = module.getAllEntities();
     * console.log(`Total de entidades (incluindo submódulos): ${todasEntidades.length}`);
     * ```
     */
    public getAllEntities(): LocalEntity[] {
        const directEntities = this.getEntities();
        const subModuleEntities = this.getSubModules().flatMap(subModule => {
            const subModuleModel = new ModuleModel({
                name: subModule.name,
                container: subModule.$container
            });
            subModuleModel.module = subModule;
            return subModuleModel.getAllEntities();
        });
        return [...directEntities, ...subModuleEntities];
    }

    /**
     * Título: Obter Todas as Enumerações (Recursivo)
     * 
     * Descrição:
     * Retorna todas as enumerações deste módulo e submódulos recursivamente.
     * 
     * @returns Array com todas as enumerações
     * 
     * @example
     * ```typescript
     * const todosEnums = module.getAllEnums();
     * ```
     */
    public getAllEnums(): EnumX[] {
        const directEnums = this.getEnums();
        const subModuleEnums = this.getSubModules().flatMap(subModule => {
            const subModuleModel = new ModuleModel({
                name: subModule.name,
                container: subModule.$container
            });
            subModuleModel.module = subModule;
            return subModuleModel.getAllEnums();
        });
        return [...directEnums, ...subModuleEnums];
    }

    /**
     * Título: Obter Todos os Submódulos (Recursivo)
     * 
     * Descrição:
     * Retorna todos os submódulos deste módulo e aninhados recursivamente.
     * 
     * @returns Array com todos os submódulos
     * 
     * @example
     * ```typescript
     * const todosSubmodulos = module.getAllSubModules();
     * ```
     */
    public getAllSubModules(): Module[] {
        const directSubModules = this.getSubModules();
        const nestedSubModules = directSubModules.flatMap(subModule => {
            const subModuleModel = new ModuleModel({
                name: subModule.name,
                container: subModule.$container
            });
            subModuleModel.module = subModule;
            return subModuleModel.getAllSubModules();
        });
        return [...directSubModules, ...nestedSubModules];
    }

    /**
     * Título: Calcular Estatísticas do Módulo
     * 
     * Descrição:
     * Calcula métricas sobre o conteúdo do módulo.
     * 
     * Processos:
     * 1. Conta elementos diretos
     * 2. Conta elementos recursivamente (incluindo submódulos)
     * 3. Calcula profundidade máxima de aninhamento
     * 4. Retorna objeto com estatísticas
     * 
     * @returns Objeto ModuleStatistics com métricas
     * 
     * @example
     * ```typescript
     * const stats = module.getStatistics();
     * console.log(`Entidades diretas: ${stats.directEntityCount}`);
     * console.log(`Entidades totais: ${stats.totalEntityCount}`);
     * console.log(`Profundidade: ${stats.maxDepth}`);
     * ```
     */
    public getStatistics(): ModuleStatistics {
        const directEntities = this.getEntities();
        const directEnums = this.getEnums();
        const directSubModules = this.getSubModules();

        const allEntities = this.getAllEntities();
        const allEnums = this.getAllEnums();
        const allSubModules = this.getAllSubModules();

        // Calcula profundidade máxima
        let maxDepth = 0;
        const calculateDepth = (modules: Module[], currentDepth: number): number => {
            if (modules.length === 0) return currentDepth;
            
            let max = currentDepth;
            modules.forEach(subModule => {
                const subModuleModel = new ModuleModel({
                    name: subModule.name,
                    container: subModule.$container
                });
                subModuleModel.module = subModule;
                const depth = calculateDepth(subModuleModel.getSubModules(), currentDepth + 1);
                max = Math.max(max, depth);
            });
            return max;
        };

        maxDepth = calculateDepth(directSubModules, 1);

        return {
            directEntityCount: directEntities.length,
            totalEntityCount: allEntities.length,
            directEnumCount: directEnums.length,
            totalEnumCount: allEnums.length,
            subModuleCount: directSubModules.length,
            totalSubModuleCount: allSubModules.length,
            maxDepth
        };
    }

    /**
     * Título: Validar Integridade do Módulo
     * 
     * Descrição:
     * Verifica se módulo está válido (sem elementos duplicados, sem módulos vazios).
     * 
     * Processos:
     * 1. Verifica nomes únicos dentro do módulo
     * 2. Verifica se módulo não está vazio
     * 3. Valida recursivamente submódulos
     * 4. Retorna array de erros encontrados
     * 
     * @returns Array de strings com erros (vazio se válido)
     * 
     * @example
     * ```typescript
     * const erros = module.validate();
     * if (erros.length > 0) {
     *   erros.forEach(erro => console.error(erro));
     * }
     * ```
     */
    public validate(): string[] {
        const errors: string[] = [];
        const qualifiedName = this.getQualifiedName();

        // Verifica se módulo está vazio
        if (this.module.elements.length === 0) {
            errors.push(`Módulo '${qualifiedName}' está vazio`);
        }

        // Verifica nomes únicos
        const names = new Set<string>();
        this.module.elements.forEach(element => {
            let name = '';
            if (isLocalEntity(element) || isEnumX(element) || isModule(element)) {
                name = element.name;
            }

            if (name && names.has(name)) {
                errors.push(
                    `Nome duplicado '${name}' no módulo '${qualifiedName}'`
                );
            }
            names.add(name);
        });

        // Valida submódulos recursivamente
        this.getSubModules().forEach(subModule => {
            const subModuleModel = new ModuleModel({
                name: subModule.name,
                container: subModule.$container
            });
            subModuleModel.module = subModule;
            const subErrors = subModuleModel.validate();
            errors.push(...subErrors);
        });

        return errors;
    }

    /**
     * Título: Obter Estrutura Interna do Módulo
     * 
     * Descrição:
     * Retorna referência direta à estrutura Module interna.
     * 
     * @returns Estrutura Module interna
     * 
     * @example
     * ```typescript
     * const rawModule = moduleModel.getModule();
     * ```
     */
    public getModule(): Module {
        return this.module;
    }

    /**
     * Título: Representação Textual do Módulo
     * 
     * Descrição:
     * Gera string legível com resumo do módulo.
     * 
     * @returns String descritiva do módulo
     * 
     * @example
     * ```typescript
     * console.log(module.toString());
     * // Saída:
     * // Module: Vendas
     * //   Qualified Name: Vendas
     * //   Entities: 5
     * //   Enums: 2
     * //   SubModules: 1
     * ```
     */
    public toString(): string {
        const stats = this.getStatistics();
        return [
            `Module: ${this.module.name}`,
            `  Qualified Name: ${this.getQualifiedName()}`,
            `  Entities: ${stats.directEntityCount} (total: ${stats.totalEntityCount})`,
            `  Enums: ${stats.directEnumCount} (total: ${stats.totalEnumCount})`,
            `  SubModules: ${stats.subModuleCount} (total: ${stats.totalSubModuleCount})`,
            `  Max Depth: ${stats.maxDepth}`
        ].join('\n');
    }
}
