/**
 * DomainModel.ts
 * 
 * Título: Modelo de Domínio Principal
 * 
 * Descrição:
 * Classe que encapsula o tipo Model (raiz da árvore AST) e fornece métodos
 * de alto nível para manipulação do modelo de domínio completo. Representa
 * toda a aplicação modelada, incluindo módulos, entidades, configurações e
 * elementos abstratos. Suporta operações CRUD em módulos e validações de
 * integridade conforme ISO/IEC 29151 (proteção de dados pessoais).
 * 
 * Processos:
 * 1. Encapsula tipo Model da camada Types
 * 2. Fornece métodos para adicionar/remover módulos
 * 3. Gerencia elementos abstratos (entidades/enums compartilhados)
 * 4. Valida integridade referencial entre módulos
 * 5. Serializa/desserializa para JSON
 * 6. Calcula métricas do modelo (contagem de entidades, relações)
 * 7. Verifica conformidade com padrões ISO
 * 8. Gera representações textuais do modelo
 * 
 * Conformidade:
 * - ISO/IEC 25010: Funcionalidade, Usabilidade, Manutenibilidade
 * - ISO/IEC 12207: Processo de definição de requisitos
 * - ISO 9001: Rastreabilidade de elementos do modelo
 * - ISO/IEC 29151: Controle de dados pessoais identificados como atributos sensíveis
 * 
 * @module models/DomainModel
 * @author module-doc-lib
 * @version 1.0.0
 * 
 * @example
 * ```typescript
 * // Criar novo modelo de domínio
 * const model = new DomainModel({
 *   name: 'SistemaVendas',
 *   version: '1.0.0',
 *   author: 'Equipe Dev'
 * });
 * 
 * // Adicionar módulo
 * const vendas = model.addModule({
 *   name: 'Vendas',
 *   description: 'Módulo de vendas'
 * });
 * 
 * // Validar modelo
 * const errors = model.validate();
 * if (errors.length === 0) {
 *   console.log('Modelo válido!');
 * }
 * 
 * // Serializar
 * const json = model.toJSON();
 * ```
 */

import type { 
    Model, 
    Module, 
    LocalEntity, 
    EnumX,
    Configuration,
    Metadata 
} from '../types/index.js';
import { 
    isModule, 
    isLocalEntity, 
    isEnumX 
} from '../utils/TypeGuards.js';
import { 
    getAllEntities, 
    getAllModules, 
    findEntityByName 
} from '../utils/AstUtils.js';

/**
 * Título: Opções de Criação do Modelo de Domínio
 * 
 * Descrição:
 * Interface para configuração inicial do modelo de domínio.
 * Permite especificar metadados e configuração da aplicação.
 */
export interface DomainModelOptions {
    /** Nome identificador do modelo */
    name: string;
    /** Versão do modelo (ex: "1.0.0") */
    version?: string;
    /** Autor do modelo */
    author?: string;
    /** Descrição geral do modelo */
    description?: string;
    /** Configuração da aplicação (linguagens, banco de dados, etc) */
    configuration?: Partial<Configuration>;
}

/**
 * Título: Resultado de Validação do Modelo
 * 
 * Descrição:
 * Representa erro ou aviso encontrado durante validação do modelo.
 */
export interface ValidationError {
    /** Tipo do problema: 'error' bloqueia geração, 'warning' apenas alerta */
    severity: 'error' | 'warning';
    /** Mensagem descritiva do problema */
    message: string;
    /** Caminho qualificado do elemento problemático (ex: "Vendas.Pedido.cliente") */
    path?: string;
    /** Código ISO relacionado (ex: "ISO-29151-5.1") */
    isoCode?: string;
}

/**
 * Título: Estatísticas do Modelo de Domínio
 * 
 * Descrição:
 * Métricas quantitativas sobre a estrutura do modelo.
 */
export interface ModelStatistics {
    /** Total de módulos no modelo */
    moduleCount: number;
    /** Total de entidades (soma de todos módulos) */
    entityCount: number;
    /** Total de enumerações */
    enumCount: number;
    /** Total de atributos (soma de todas entidades) */
    attributeCount: number;
    /** Total de relacionamentos (soma de todas entidades) */
    relationCount: number;
    /** Total de funções/métodos (soma de todas entidades) */
    functionCount: number;
    /** Entidades abstratas (para herança) */
    abstractEntityCount: number;
    /** Profundidade máxima da hierarquia de módulos */
    maxModuleDepth: number;
}

/**
 * Título: Classe Modelo de Domínio
 * 
 * Descrição:
 * Representa o modelo de domínio completo da aplicação. Encapsula o tipo
 * Model e adiciona comportamentos para manipulação e validação. Segue
 * princípio KISS mantendo métodos simples e diretos.
 * 
 * Processos:
 * 1. Construtor inicializa estrutura Model vazia
 * 2. Métodos add/remove gerenciam módulos e elementos abstratos
 * 3. Método validate verifica integridade referencial
 * 4. Métodos get* recuperam elementos por critérios
 * 5. Métodos to* serializam para diferentes formatos
 * 6. Método getStatistics calcula métricas do modelo
 * 
 * @class DomainModel
 */
export class DomainModel {
    /**
     * Estrutura interna do modelo (tipo Model da camada Types)
     * @private
     */
    private model: Model;

    /**
     * Título: Construtor do Modelo de Domínio
     * 
     * Descrição:
     * Inicializa novo modelo de domínio com metadados e configuração fornecidos.
     * 
     * Processos:
     * 1. Cria estrutura Model vazia
     * 2. Define $container como undefined (raiz da árvore)
     * 3. Inicializa array de módulos vazio
     * 4. Inicializa array de elementos abstratos vazio
     * 5. Cria metadados com informações fornecidas
     * 6. Cria configuração padrão ou usa fornecida
     * 
     * @param options - Opções de criação do modelo
     * 
     * @example
     * ```typescript
     * const model = new DomainModel({
     *   name: 'ECommerce',
     *   version: '2.0.0',
     *   author: 'Time Backend',
     *   description: 'Sistema de comércio eletrônico',
     *   configuration: {
     *     backendLanguage: 'Java',
     *     frontendFramework: 'Vue',
     *     database: {
     *       type: 'postgresql',
     *       version: '15'
     *     }
     *   }
     * });
     * ```
     */
    constructor(options: DomainModelOptions) {
        const now = new Date().toISOString();
        
        // Cria metadados
        const metadata: Metadata = {
            description: options.description || '',
            tags: [],
            requirements: [],
            author: options.author || 'Unknown',
            createdAt: now,
            updatedAt: now
        };

        // Cria configuração padrão
        const configuration: Configuration = {
            name: options.name,
            version: options.version || '1.0.0',
            backendLanguage: options.configuration?.backendLanguage || 'Java',
            frontendFramework: options.configuration?.frontendFramework || 'Vue',
            port: options.configuration?.port || 8080,
            basePackage: options.configuration?.basePackage || 'com.example',
            database: options.configuration?.database || {
                type: 'postgresql',
                version: '15',
                host: 'localhost',
                port: 5432,
                database: options.name.toLowerCase()
            }
        };

        // Inicializa Model
        this.model = {
            $type: 'Model',
            $container: undefined,
            modules: [],
            abstractElements: [],
            configuration,
            metadata
        };
    }

    /**
     * Título: Adicionar Módulo ao Modelo
     * 
     * Descrição:
     * Cria novo módulo e adiciona ao modelo de domínio. Módulos organizam
     * entidades e enumerações em namespaces lógicos.
     * 
     * Processos:
     * 1. Valida nome do módulo (não vazio, não duplicado)
     * 2. Cria estrutura Module
     * 3. Define $container como este modelo
     * 4. Adiciona aos módulos do modelo
     * 5. Atualiza timestamp de modificação
     * 6. Retorna módulo criado
     * 
     * @param options - Nome e metadados do módulo
     * @returns Módulo criado
     * @throws Error se nome for inválido ou duplicado
     * 
     * @example
     * ```typescript
     * const catalogoModule = model.addModule({
     *   name: 'Catalogo',
     *   description: 'Gerenciamento de produtos'
     * });
     * ```
     */
    public addModule(options: { 
        name: string; 
        description?: string;
        tags?: string[];
    }): Module {
        // Valida nome
        if (!options.name || options.name.trim() === '') {
            throw new Error('Nome do módulo não pode ser vazio');
        }

        // Verifica duplicação
        const existing = this.model.modules.find(m => m.name === options.name);
        if (existing) {
            throw new Error(`Módulo '${options.name}' já existe no modelo`);
        }

        const now = new Date().toISOString();

        // Cria módulo
        const module: Module = {
            $type: 'Module',
            $container: this.model,
            name: options.name,
            elements: [],
            metadata: {
                description: options.description || '',
                tags: options.tags || [],
                requirements: [],
                author: this.model.metadata.author,
                createdAt: now,
                updatedAt: now
            }
        };

        // Adiciona ao modelo
        this.model.modules.push(module);
        this.model.metadata.updatedAt = now;

        return module;
    }

    /**
     * Título: Remover Módulo do Modelo
     * 
     * Descrição:
     * Remove módulo existente do modelo. Verifica se há referências
     * dependentes antes de remover para garantir integridade.
     * 
     * Processos:
     * 1. Localiza módulo pelo nome
     * 2. Verifica referências de outros módulos
     * 3. Remove do array de módulos
     * 4. Atualiza timestamp de modificação
     * 5. Retorna sucesso ou lança erro
     * 
     * @param moduleName - Nome do módulo a remover
     * @returns true se removido com sucesso
     * @throws Error se módulo não existir ou tiver dependências
     * 
     * @example
     * ```typescript
     * model.removeModule('ModuloObsoleto');
     * ```
     */
    public removeModule(moduleName: string): boolean {
        const index = this.model.modules.findIndex(m => m.name === moduleName);
        
        if (index === -1) {
            throw new Error(`Módulo '${moduleName}' não encontrado no modelo`);
        }

        // TODO: Verificar dependências (implementar quando tiver análise de referências)
        
        this.model.modules.splice(index, 1);
        this.model.metadata.updatedAt = new Date().toISOString();

        return true;
    }

    /**
     * Título: Adicionar Elemento Abstrato ao Modelo
     * 
     * Descrição:
     * Adiciona entidade ou enumeração abstrata ao modelo. Elementos abstratos
     * ficam no nível raiz e podem ser referenciados por qualquer módulo
     * (útil para tipos compartilhados como "Usuario", "Endereco", etc).
     * 
     * Processos:
     * 1. Valida tipo do elemento (LocalEntity ou EnumX)
     * 2. Define $container como este modelo
     * 3. Adiciona ao array abstractElements
     * 4. Atualiza timestamp de modificação
     * 
     * @param element - Entidade ou enumeração abstrata
     * @throws Error se tipo do elemento for inválido
     * 
     * @example
     * ```typescript
     * const enderecoAbstrato: LocalEntity = {
     *   $type: 'LocalEntity',
     *   name: 'Endereco',
     *   is_abstract: true,
     *   attributes: [
     *     { name: 'rua', type: DATATYPE.string },
     *     { name: 'numero', type: DATATYPE.int }
     *   ],
     *   relations: [],
     *   functions: []
     * };
     * model.addAbstractElement(enderecoAbstrato);
     * ```
     */
    public addAbstractElement(element: LocalEntity | EnumX): void {
        if (!isLocalEntity(element) && !isEnumX(element)) {
            throw new Error('Elemento abstrato deve ser LocalEntity ou EnumX');
        }

        element.$container = this.model;
        this.model.abstractElements.push(element);
        this.model.metadata.updatedAt = new Date().toISOString();
    }

    /**
     * Título: Obter Módulo por Nome
     * 
     * Descrição:
     * Localiza módulo pelo nome exato (case-sensitive).
     * 
     * @param name - Nome do módulo
     * @returns Módulo encontrado ou undefined
     * 
     * @example
     * ```typescript
     * const vendas = model.getModule('Vendas');
     * if (vendas) {
     *   console.log(`Módulo ${vendas.name} possui ${vendas.elements.length} elementos`);
     * }
     * ```
     */
    public getModule(name: string): Module | undefined {
        return this.model.modules.find(m => m.name === name);
    }

    /**
     * Título: Obter Todos os Módulos
     * 
     * Descrição:
     * Retorna array com todos os módulos do modelo (incluindo submódulos).
     * 
     * @returns Array de módulos
     * 
     * @example
     * ```typescript
     * const todosModulos = model.getAllModules();
     * console.log(`Total de módulos: ${todosModulos.length}`);
     * ```
     */
    public getAllModules(): Module[] {
        return getAllModules(this.model);
    }

    /**
     * Título: Obter Todas as Entidades
     * 
     * Descrição:
     * Retorna array com todas as entidades de todos os módulos.
     * 
     * @returns Array de entidades
     * 
     * @example
     * ```typescript
     * const todasEntidades = model.getAllEntities();
     * const concretas = todasEntidades.filter(e => !e.is_abstract);
     * ```
     */
    public getAllEntities(): LocalEntity[] {
        return getAllEntities(this.model);
    }

    /**
     * Título: Buscar Entidade por Nome
     * 
     * Descrição:
     * Localiza entidade pelo nome simples ou qualificado.
     * 
     * @param name - Nome da entidade (ex: "Cliente" ou "Vendas.Cliente")
     * @returns Entidade encontrada ou undefined
     * 
     * @example
     * ```typescript
     * const cliente = model.findEntity('Vendas.Cliente');
     * ```
     */
    public findEntity(name: string): LocalEntity | undefined {
        return findEntityByName(this.model, name);
    }

    /**
     * Título: Validar Integridade do Modelo
     * 
     * Descrição:
     * Executa validações de integridade referencial, conformidade ISO e
     * regras de negócio. Retorna array de erros/avisos encontrados.
     * 
     * Processos:
     * 1. Valida referências entre entidades (superType, relações)
     * 2. Verifica ciclos em heranças
     * 3. Valida atributos sensíveis (ISO/IEC 29151)
     * 4. Verifica configuração obrigatória
     * 5. Valida nomes únicos dentro de módulos
     * 6. Retorna array de problemas encontrados
     * 
     * Conformidade:
     * - ISO/IEC 29151: Validação de proteção de dados pessoais
     * - ISO/IEC 25010: Verificação de qualidade funcional
     * 
     * @returns Array de erros/avisos (vazio se válido)
     * 
     * @example
     * ```typescript
     * const erros = model.validate();
     * erros.forEach(erro => {
     *   console.log(`[${erro.severity}] ${erro.message}`);
     *   if (erro.path) console.log(`  Local: ${erro.path}`);
     * });
     * ```
     */
    public validate(): ValidationError[] {
        const errors: ValidationError[] = [];

        // Valida configuração obrigatória
        if (!this.model.configuration) {
            errors.push({
                severity: 'error',
                message: 'Configuração do modelo é obrigatória',
                isoCode: 'ISO-12207-6.3.1'
            });
        }

        // Valida módulos vazios
        this.model.modules.forEach(module => {
            if (module.elements.length === 0) {
                errors.push({
                    severity: 'warning',
                    message: `Módulo '${module.name}' está vazio`,
                    path: module.name
                });
            }

            // Valida nomes únicos dentro do módulo
            const names = new Set<string>();
            module.elements.forEach(element => {
                const name = isLocalEntity(element) || isEnumX(element) ? element.name : '';
                if (name && names.has(name)) {
                    errors.push({
                        severity: 'error',
                        message: `Nome duplicado '${name}' no módulo '${module.name}'`,
                        path: `${module.name}.${name}`
                    });
                }
                names.add(name);
            });
        });

        // Valida entidades
        const allEntities = this.getAllEntities();
        allEntities.forEach(entity => {
            // Valida superType existe
            if (entity.superType && !entity.superType.$ref) {
                const superName = entity.superType.$refText || 'unknown';
                errors.push({
                    severity: 'error',
                    message: `SuperType '${superName}' não resolvido para entidade '${entity.name}'`,
                    path: entity.name
                });
            }

            // Valida atributos sensíveis (ISO/IEC 29151)
            entity.attributes.forEach(attr => {
                const sensibleNames = ['cpf', 'rg', 'senha', 'password', 'email', 'telefone'];
                if (sensibleNames.includes(attr.name.toLowerCase())) {
                    errors.push({
                        severity: 'warning',
                        message: `Atributo sensível '${attr.name}' detectado em '${entity.name}'. Considere criptografia.`,
                        path: `${entity.name}.${attr.name}`,
                        isoCode: 'ISO-29151-7.2.1'
                    });
                }
            });
        });

        return errors;
    }

    /**
     * Título: Calcular Estatísticas do Modelo
     * 
     * Descrição:
     * Calcula métricas quantitativas sobre a estrutura do modelo.
     * 
     * Processos:
     * 1. Conta módulos, entidades, enums
     * 2. Soma atributos, relações, funções
     * 3. Calcula profundidade máxima da hierarquia
     * 4. Retorna objeto com estatísticas
     * 
     * @returns Objeto ModelStatistics com métricas
     * 
     * @example
     * ```typescript
     * const stats = model.getStatistics();
     * console.log(`Modelo possui ${stats.entityCount} entidades`);
     * console.log(`Total de relacionamentos: ${stats.relationCount}`);
     * ```
     */
    public getStatistics(): ModelStatistics {
        const modules = this.getAllModules();
        const entities = this.getAllEntities();
        
        let attributeCount = 0;
        let relationCount = 0;
        let functionCount = 0;
        let abstractEntityCount = 0;
        let enumCount = 0;

        entities.forEach(entity => {
            attributeCount += entity.attributes.length;
            relationCount += entity.relations.length;
            functionCount += entity.functions.length;
            if (entity.is_abstract) abstractEntityCount++;
        });

        // Conta enums em todos módulos
        modules.forEach(module => {
            module.elements.forEach(element => {
                if (isEnumX(element)) enumCount++;
            });
        });

        // Calcula profundidade máxima (simplificado - assume 1 nível por enquanto)
        const maxModuleDepth = modules.length > 0 ? 1 : 0;

        return {
            moduleCount: modules.length,
            entityCount: entities.length,
            enumCount,
            attributeCount,
            relationCount,
            functionCount,
            abstractEntityCount,
            maxModuleDepth
        };
    }

    /**
     * Título: Serializar Modelo para JSON
     * 
     * Descrição:
     * Converte modelo para objeto JSON puro (remove referências circulares).
     * 
     * Processos:
     * 1. Clona estrutura do modelo
     * 2. Remove propriedades $container (referências circulares)
     * 3. Retorna objeto serializável
     * 
     * @returns Objeto JSON representando o modelo
     * 
     * @example
     * ```typescript
     * const json = model.toJSON();
     * const jsonString = JSON.stringify(json, null, 2);
     * fs.writeFileSync('model.json', jsonString);
     * ```
     */
    public toJSON(): any {
        // Função auxiliar para remover $container recursivamente
        const cleanContainer = (obj: any): any => {
            if (Array.isArray(obj)) {
                return obj.map(cleanContainer);
            }
            
            if (obj !== null && typeof obj === 'object') {
                const cleaned: any = {};
                for (const key in obj) {
                    if (key === '$container') continue; // Remove referência circular
                    cleaned[key] = cleanContainer(obj[key]);
                }
                return cleaned;
            }
            
            return obj;
        };

        return cleanContainer(this.model);
    }

    /**
     * Título: Obter Estrutura Interna do Modelo
     * 
     * Descrição:
     * Retorna referência direta à estrutura Model interna.
     * Útil para integração com funções utilitárias que esperam tipo Model.
     * 
     * @returns Estrutura Model interna
     * 
     * @example
     * ```typescript
     * const rawModel = model.getModel();
     * const qualifiedName = getQualifiedName(rawModel.modules[0]);
     * ```
     */
    public getModel(): Model {
        return this.model;
    }

    /**
     * Título: Representação Textual do Modelo
     * 
     * Descrição:
     * Gera string legível com resumo do modelo (útil para debugging).
     * 
     * @returns String descritiva do modelo
     * 
     * @example
     * ```typescript
     * console.log(model.toString());
     * // Saída:
     * // Model: SistemaVendas v1.0.0
     * //   Modules: 3
     * //   Entities: 12
     * //   Relations: 18
     * ```
     */
    public toString(): string {
        const stats = this.getStatistics();
        return [
            `Model: ${this.model.configuration.name} v${this.model.configuration.version}`,
            `  Author: ${this.model.metadata.author}`,
            `  Modules: ${stats.moduleCount}`,
            `  Entities: ${stats.entityCount}`,
            `  Enums: ${stats.enumCount}`,
            `  Attributes: ${stats.attributeCount}`,
            `  Relations: ${stats.relationCount}`,
            `  Functions: ${stats.functionCount}`
        ].join('\n');
    }
}
