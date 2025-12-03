/**
 * EntityModel.ts
 * 
 * Título: Modelo de Entidade de Domínio
 * 
 * Descrição:
 * Classe que encapsula o tipo LocalEntity e fornece métodos de alto nível
 * para manipulação de entidades de domínio. Entidades representam classes
 * de negócio com atributos, relacionamentos e métodos. Suporta herança
 * através de superType e validação de integridade conforme ISO.
 * 
 * Processos:
 * 1. Encapsula tipo LocalEntity da camada Types
 * 2. Fornece métodos para adicionar/remover atributos
 * 3. Gerencia relacionamentos entre entidades
 * 4. Gerencia métodos (functions) da entidade
 * 5. Valida herança e abstração
 * 6. Verifica atributos sensíveis (ISO/IEC 29151)
 * 7. Calcula métricas da entidade
 * 8. Gera representações textuais
 * 
 * 
 * @module models/EntityModel
 * @author module-doc-lib
 * @version 1.0.0
 * 
 * @example
 * ```typescript
 * // Criar entidade
 * const cliente = new EntityModel({
 *   name: 'Cliente',
 *   description: 'Cliente do sistema'
 * });
 * 
 * // Adicionar atributos
 * cliente.addAttribute({
 *   name: 'nome',
 *   type: DATATYPE.string,
 *   blank: false,
 *   max: 100
 * });
 * 
 * // Adicionar relacionamento
 * cliente.addRelation({
 *   name: 'pedidos',
 *   entity: { $refText: 'Pedido' },
 *   type: 'OneToMany'
 * });
 * ```
 */

import type {
    LocalEntity,
    Attribute,
    Relation,
    FunctionEntity,
    Parameter,
    DATATYPE,
    Reference,
    EnumX,
    Metadata,
    AstNode,
    OneToOne,
    OneToMany,
    ManyToOne,
    ManyToMany
} from '../types/index.js';
import {
    isOneToOne,
    isOneToMany,
    isManyToOne,
    isManyToMany
} from '../utils/TypeGuards.js';
import {
    getQualifiedName
} from '../utils/AstUtils.js';

/**
 * Título: Opções de Criação da Entidade
 * 
 * Descrição:
 * Interface para configuração inicial da entidade.
 */
export interface EntityModelOptions {
    /** Nome da entidade (será nome da classe) */
    name: string;
    /** Descrição do propósito da entidade */
    description?: string;
    /** Se entidade é abstrata (para herança) */
    is_abstract?: boolean;
    /** Superclasse (herança) */
    superType?: Reference<LocalEntity>;
    /** Tags para categorização */
    tags?: string[];
    /** Autor da entidade */
    author?: string;
    /** Container pai (Module) */
    container?: AstNode;
}

/**
 * Título: Opções para Adicionar Atributo
 * 
 * Descrição:
 * Configuração de um novo atributo da entidade.
 */
export interface AddAttributeOptions {
    /** Nome do atributo (será nome da propriedade) */
    name: string;
    /** Tipo do atributo (DATATYPE ou Reference<EnumX>) */
    type: DATATYPE | Reference<EnumX>;
    /** Se valor deve ser único (gera índice único no DB) */
    unique?: boolean;
    /** Se pode ser nulo/vazio */
    blank?: boolean;
    /** Tamanho máximo (strings) ou valor máximo (números) */
    max?: number;
    /** Tamanho mínimo (strings) ou valor mínimo (números) */
    min?: number;
    /** Descrição do atributo */
    description?: string;
}

/**
 * Título: Opções para Adicionar Relacionamento
 * 
 * Descrição:
 * Configuração de um novo relacionamento da entidade.
 */
export interface AddRelationOptions {
    /** Nome do relacionamento (será nome da propriedade) */
    name: string;
    /** Entidade alvo do relacionamento */
    entity: Reference<LocalEntity>;
    /** Tipo de cardinalidade */
    type: 'OneToOne' | 'OneToMany' | 'ManyToOne' | 'ManyToMany';
    /** Nome do relacionamento oposto (bidirecional) */
    opposite?: string;
    /** Se relacionamento é obrigatório */
    required?: boolean;
    /** Se deve carregar entidade relacionada automaticamente (eager loading) */
    eager?: boolean;
    /** Se deve propagar operações (cascade) */
    cascade?: boolean;
    /** Nome da tabela join (apenas ManyToMany) */
    joinTable?: string;
}

/**
 * Título: Opções para Adicionar Método
 * 
 * Descrição:
 * Configuração de um novo método da entidade.
 */
export interface AddFunctionOptions {
    /** Nome do método */
    name: string;
    /** Parâmetros do método */
    parameters?: Parameter[];
    /** Tipo de retorno */
    response?: DATATYPE | Reference<EnumX> | Reference<LocalEntity>;
    /** Descrição do método */
    description?: string;
}

/**
 * Título: Estatísticas da Entidade
 * 
 * Descrição:
 * Métricas sobre a estrutura da entidade.
 */
export interface EntityStatistics {
    /** Total de atributos */
    attributeCount: number;
    /** Total de relacionamentos */
    relationCount: number;
    /** Total de métodos */
    functionCount: number;
    /** Total de atributos únicos */
    uniqueAttributeCount: number;
    /** Total de atributos obrigatórios (blank=false) */
    requiredAttributeCount: number;
    /** Total de atributos sensíveis (CPF, email, senha, etc) */
    sensitiveAttributeCount: number;
    /** Se possui herança (superType definido) */
    hasInheritance: boolean;
    /** Se é abstrata */
    isAbstract: boolean;
}

/**
 * Título: Classe Modelo de Entidade
 * 
 * Descrição:
 * Representa uma entidade de domínio (classe de negócio) com atributos,
 * relacionamentos e métodos. Fornece API para manipulação segura com
 * validações e conformidade ISO.
 * 
 * @class EntityModel
 */
export class EntityModel {
    /**
     * Estrutura interna da entidade (tipo LocalEntity da camada Types)
     * @private
     */
    private entity: LocalEntity;

    /**
     * Título: Construtor do Modelo de Entidade
     * 
     * Descrição:
     * Inicializa nova entidade com metadados fornecidos.
     * 
     * @param options - Opções de criação da entidade
     * 
     * @example
     * ```typescript
     * const produto = new EntityModel({
     *   name: 'Produto',
     *   description: 'Produto do catálogo',
     *   is_abstract: false
     * });
     * ```
     */
    constructor(options: EntityModelOptions) {
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

        // Inicializa LocalEntity
        this.entity = {
            $type: 'LocalEntity',
            $container: options.container as any,
            name: options.name,
            attributes: [],
            relations: [],
            functions: [],
            is_abstract: options.is_abstract || false,
            superType: options.superType,
            metadata
        };
    }

    /**
     * Título: Adicionar Atributo à Entidade
     * 
     * Descrição:
     * Cria novo atributo e adiciona à entidade. Atributos representarão
     * propriedades/campos no código gerado.
     * 
     * Processos:
     * 1. Valida nome do atributo (não vazio, não duplicado)
     * 2. Cria estrutura Attribute
     * 3. Define $container como esta entidade
     * 4. Adiciona ao array de atributos
     * 5. Atualiza timestamp de modificação
     * 6. Retorna atributo criado
     * 
     * @param options - Configuração do atributo
     * @returns Atributo criado
     * @throws Error se nome for inválido ou duplicado
     * 
     * @example
     * ```typescript
     * const nomeAttr = entity.addAttribute({
     *   name: 'nome',
     *   type: DATATYPE.string,
     *   blank: false,
     *   max: 100,
     *   description: 'Nome completo do cliente'
     * });
     * ```
     */
    public addAttribute(options: AddAttributeOptions): Attribute {
        // Valida nome
        if (!options.name || options.name.trim() === '') {
            throw new Error('Nome do atributo não pode ser vazio');
        }

        // Verifica duplicação
        const existing = this.entity.attributes.find(a => a.name === options.name);
        if (existing) {
            throw new Error(
                `Atributo '${options.name}' já existe na entidade '${this.entity.name}'`
            );
        }

        // Cria atributo
        const attribute: Attribute = {
            $type: 'Attribute',
            $container: this.entity,
            name: options.name,
            type: options.type,
            unique: options.unique || false,
            blank: options.blank !== undefined ? options.blank : true,
            max: options.max,
            min: options.min,
            metadata: {
                description: options.description || '',
                tags: [],
                requirements: [],
                author: this.entity.metadata?.author || 'Unknown',
                createdAt: new Date(),
                modifiedAt: new Date()
            }
        };

        // Adiciona à entidade
        this.entity.attributes.push(attribute);
        if (this.entity.metadata) {
            this.entity.metadata.modifiedAt = new Date();
        }

        return attribute;
    }

    /**
     * Título: Adicionar Relacionamento à Entidade
     * 
     * Descrição:
     * Cria novo relacionamento e adiciona à entidade. Relacionamentos
     * representarão associações entre entidades (foreign keys, joins).
     * 
     * Processos:
     * 1. Valida nome do relacionamento
     * 2. Verifica duplicação
     * 3. Cria estrutura Relation apropriada (OneToOne, OneToMany, etc)
     * 4. Define $container como esta entidade
     * 5. Adiciona ao array de relações
     * 6. Atualiza timestamp
     * 7. Retorna relação criada
     * 
     * @param options - Configuração do relacionamento
     * @returns Relacionamento criado
     * @throws Error se nome for inválido ou duplicado
     * 
     * @example
     * ```typescript
     * // Relacionamento 1:N (Cliente tem muitos Pedidos)
     * const pedidosRel = cliente.addRelation({
     *   name: 'pedidos',
     *   entity: { $refText: 'Pedido' },
     *   type: 'OneToMany',
     *   opposite: 'cliente',
     *   cascade: true
     * });
     * ```
     */
    public addRelation(options: AddRelationOptions): Relation {
        // Valida nome
        if (!options.name || options.name.trim() === '') {
            throw new Error('Nome do relacionamento não pode ser vazio');
        }

        // Verifica duplicação
        const existing = this.entity.relations.find(r => r.name === options.name);
        if (existing) {
            throw new Error(
                `Relacionamento '${options.name}' já existe na entidade '${this.entity.name}'`
            );
        }

        const now = new Date();
        const metadata: Metadata = {
            description: '',
            tags: [],
            requirements: [],
            author: this.entity.metadata?.author || 'Unknown',
            createdAt: now,
            modifiedAt: now
        };

        // Cria relacionamento baseado no tipo
        let relation: Relation;

        switch (options.type) {
            case 'OneToOne':
                const oneToOne: OneToOne = {
                    $type: 'OneToOne',
                    $container: this.entity,
                    name: options.name,
                    entity: options.entity,
                    opposite: options.opposite,
                    required: options.required,
                    metadata
                };
                relation = oneToOne;
                break;

            case 'OneToMany':
                const oneToMany: OneToMany = {
                    $type: 'OneToMany',
                    $container: this.entity,
                    name: options.name,
                    entity: options.entity,
                    opposite: options.opposite,
                    cascade: options.cascade,
                    eager: options.eager,
                    metadata
                };
                relation = oneToMany;
                break;

            case 'ManyToOne':
                const manyToOne: ManyToOne = {
                    $type: 'ManyToOne',
                    $container: this.entity,
                    name: options.name,
                    entity: options.entity,
                    opposite: options.opposite,
                    required: options.required,
                    eager: options.eager,
                    metadata
                };
                relation = manyToOne;
                break;

            case 'ManyToMany':
                const manyToMany: ManyToMany = {
                    $type: 'ManyToMany',
                    $container: this.entity,
                    name: options.name,
                    entity: options.entity,
                    opposite: options.opposite,
                    joinTable: options.joinTable,
                    cascade: options.cascade,
                    eager: options.eager,
                    metadata
                };
                relation = manyToMany;
                break;

            default:
                throw new Error(`Tipo de relacionamento inválido: ${options.type}`);
        }

        // Adiciona à entidade
        this.entity.relations.push(relation);
        if (this.entity.metadata) {
            this.entity.metadata.modifiedAt = new Date();
        }

        return relation;
    }

    /**
     * Título: Adicionar Método à Entidade
     * 
     * Descrição:
     * Cria novo método (function) e adiciona à entidade.
     * 
     * Processos:
     * 1. Valida nome do método
     * 2. Verifica duplicação
     * 3. Cria estrutura FunctionEntity
     * 4. Define $container
     * 5. Adiciona ao array de funções
     * 6. Atualiza timestamp
     * 7. Retorna método criado
     * 
     * @param options - Configuração do método
     * @returns Método criado
     * @throws Error se nome for inválido ou duplicado
     * 
     * @example
     * ```typescript
     * const calcularTotal = pedido.addFunction({
     *   name: 'calcularTotal',
     *   parameters: [],
     *   response: DATATYPE.decimal,
     *   description: 'Calcula o valor total do pedido'
     * });
     * ```
     */
    public addFunction(options: AddFunctionOptions): FunctionEntity {
        // Valida nome
        if (!options.name || options.name.trim() === '') {
            throw new Error('Nome do método não pode ser vazio');
        }

        // Verifica duplicação
        const existing = this.entity.functions.find(f => f.name === options.name);
        if (existing) {
            throw new Error(
                `Método '${options.name}' já existe na entidade '${this.entity.name}'`
            );
        }

        const now = new Date();

        // Cria método
        const functionEntity: FunctionEntity = {
            $type: 'FunctionEntity',
            $container: this.entity,
            name: options.name,
            parameters: options.parameters || [],
            response: options.response,
            metadata: {
                description: options.description || '',
                tags: [],
                requirements: [],
                author: this.entity.metadata?.author || 'Unknown',
                createdAt: now,
                modifiedAt: now
            }
        };

        // Adiciona à entidade
        this.entity.functions.push(functionEntity);
        if (this.entity.metadata) {
            this.entity.metadata.modifiedAt = now;
        }

        return functionEntity;
    }

    /**
     * Título: Remover Atributo
     * 
     * Descrição:
     * Remove atributo existente da entidade pelo nome.
     * 
     * @param attributeName - Nome do atributo a remover
     * @returns true se removido com sucesso
     * @throws Error se atributo não existir
     * 
     * @example
     * ```typescript
     * entity.removeAttribute('campoObsoleto');
     * ```
     */
    public removeAttribute(attributeName: string): boolean {
        const index = this.entity.attributes.findIndex(a => a.name === attributeName);

        if (index === -1) {
            throw new Error(
                `Atributo '${attributeName}' não encontrado na entidade '${this.entity.name}'`
            );
        }

        this.entity.attributes.splice(index, 1);
        if (this.entity.metadata) {
            this.entity.metadata.modifiedAt = new Date();
        }

        return true;
    }

    /**
     * Título: Remover Relacionamento
     * 
     * Descrição:
     * Remove relacionamento existente da entidade pelo nome.
     * 
     * @param relationName - Nome do relacionamento a remover
     * @returns true se removido com sucesso
     * @throws Error se relacionamento não existir
     * 
     * @example
     * ```typescript
     * entity.removeRelation('relacionamentoObsoleto');
     * ```
     */
    public removeRelation(relationName: string): boolean {
        const index = this.entity.relations.findIndex(r => r.name === relationName);

        if (index === -1) {
            throw new Error(
                `Relacionamento '${relationName}' não encontrado na entidade '${this.entity.name}'`
            );
        }

        this.entity.relations.splice(index, 1);
        if (this.entity.metadata) {
            this.entity.metadata.modifiedAt = new Date();
        }

        return true;
    }

    /**
     * Título: Remover Método
     * 
     * Descrição:
     * Remove método existente da entidade pelo nome.
     * 
     * @param functionName - Nome do método a remover
     * @returns true se removido com sucesso
     * @throws Error se método não existir
     * 
     * @example
     * ```typescript
     * entity.removeFunction('metodoObsoleto');
     * ```
     */
    public removeFunction(functionName: string): boolean {
        const index = this.entity.functions.findIndex(f => f.name === functionName);

        if (index === -1) {
            throw new Error(
                `Método '${functionName}' não encontrado na entidade '${this.entity.name}'`
            );
        }

        this.entity.functions.splice(index, 1);
        if (this.entity.metadata) {
            this.entity.metadata.modifiedAt = new Date();
        }

        return true;
    }

    /**
     * Título: Obter Nome Qualificado da Entidade
     * 
     * Descrição:
     * Retorna nome hierárquico completo incluindo módulos ancestrais.
     * 
     * @returns Nome qualificado (ex: "Vendas.Cliente")
     * 
     * @example
     * ```typescript
     * console.log(entity.getQualifiedName());
     * // Saída: "Vendas.Cliente"
     * ```
     */
    public getQualifiedName(): string {
        return getQualifiedName(this.entity);
    }

    /**
     * Título: Obter Atributos
     * 
     * Descrição:
     * Retorna todos os atributos da entidade.
     * 
     * @returns Array de atributos
     * 
     * @example
     * ```typescript
     * const atributos = entity.getAttributes();
     * atributos.forEach(attr => console.log(attr.name));
     * ```
     */
    public getAttributes(): Attribute[] {
        return this.entity.attributes;
    }

    /**
     * Título: Obter Relacionamentos
     * 
     * Descrição:
     * Retorna todos os relacionamentos da entidade.
     * 
     * @returns Array de relacionamentos
     * 
     * @example
     * ```typescript
     * const relacoes = entity.getRelations();
     * ```
     */
    public getRelations(): Relation[] {
        return this.entity.relations;
    }

    /**
     * Título: Obter Métodos
     * 
     * Descrição:
     * Retorna todos os métodos da entidade.
     * 
     * @returns Array de métodos
     * 
     * @example
     * ```typescript
     * const metodos = entity.getFunctions();
     * ```
     */
    public getFunctions(): FunctionEntity[] {
        return this.entity.functions;
    }

    /**
     * Título: Buscar Atributo por Nome
     * 
     * Descrição:
     * Busca atributo específico pelo nome.
     * 
     * @param name - Nome do atributo
     * @returns Atributo encontrado ou undefined
     * 
     * @example
     * ```typescript
     * const nomeAttr = entity.findAttribute('nome');
     * ```
     */
    public findAttribute(name: string): Attribute | undefined {
        return this.entity.attributes.find(a => a.name === name);
    }

    /**
     * Título: Buscar Relacionamento por Nome
     * 
     * Descrição:
     * Busca relacionamento específico pelo nome.
     * 
     * @param name - Nome do relacionamento
     * @returns Relacionamento encontrado ou undefined
     * 
     * @example
     * ```typescript
     * const pedidosRel = entity.findRelation('pedidos');
     * ```
     */
    public findRelation(name: string): Relation | undefined {
        return this.entity.relations.find(r => r.name === name);
    }

    /**
     * Título: Buscar Método por Nome
     * 
     * Descrição:
     * Busca método específico pelo nome.
     * 
     * @param name - Nome do método
     * @returns Método encontrado ou undefined
     * 
     * @example
     * ```typescript
     * const calcular = entity.findFunction('calcularTotal');
     * ```
     */
    public findFunction(name: string): FunctionEntity | undefined {
        return this.entity.functions.find(f => f.name === name);
    }

    /**
     * Título: Verificar se é Abstrata
     * 
     * Descrição:
     * Verifica se entidade é abstrata (para herança).
     * 
     * @returns true se abstrata
     * 
     * @example
     * ```typescript
     * if (entity.isAbstract()) {
     *   console.log('Entidade não pode ser instanciada diretamente');
     * }
     * ```
     */
    public isAbstract(): boolean {
        return this.entity.is_abstract;
    }

    /**
     * Título: Verificar se tem Herança
     * 
     * Descrição:
     * Verifica se entidade herda de outra (tem superType).
     * 
     * @returns true se possui superType
     * 
     * @example
     * ```typescript
     * if (entity.hasInheritance()) {
     *   console.log('Entidade herda de:', entity.getSuperType());
     * }
     * ```
     */
    public hasInheritance(): boolean {
        return this.entity.superType !== undefined && this.entity.superType !== null;
    }

    /**
     * Título: Obter SuperType
     * 
     * Descrição:
     * Retorna referência à superclasse (se houver).
     * 
     * @returns Referência à superclasse ou undefined
     * 
     * @example
     * ```typescript
     * const superType = entity.getSuperType();
     * ```
     */
    public getSuperType(): Reference<LocalEntity> | undefined {
        return this.entity.superType;
    }

    /**
     * Título: Definir SuperType
     * 
     * Descrição:
     * Define superclasse para herança.
     * 
     * @param superType - Referência à superclasse
     * 
     * @example
     * ```typescript
     * entity.setSuperType({ $refText: 'Pessoa' });
     * ```
     */
    public setSuperType(superType: Reference<LocalEntity> | undefined): void {
        this.entity.superType = superType;
        if (this.entity.metadata) {
            this.entity.metadata.modifiedAt = new Date();
        }
    }

    /**
     * Título: Calcular Estatísticas da Entidade
     * 
     * Descrição:
     * Calcula métricas sobre a estrutura da entidade.
     * 
     * @returns Objeto EntityStatistics com métricas
     * 
     * @example
     * ```typescript
     * const stats = entity.getStatistics();
     * console.log(`Atributos: ${stats.attributeCount}`);
     * console.log(`Relacionamentos: ${stats.relationCount}`);
     * console.log(`Atributos sensíveis: ${stats.sensitiveAttributeCount}`);
     * ```
     */
    public getStatistics(): EntityStatistics {
        const uniqueAttributeCount = this.entity.attributes.filter(a => a.unique).length;
        const requiredAttributeCount = this.entity.attributes.filter(a => a.blank === false).length;

        // Detecta atributos sensíveis (ISO/IEC 29151)
        const sensitiveNames = ['cpf', 'rg', 'senha', 'password', 'email', 'telefone', 'phone', 'ssn'];
        const sensitiveAttributeCount = this.entity.attributes.filter(a =>
            sensitiveNames.includes(a.name.toLowerCase())
        ).length;

        return {
            attributeCount: this.entity.attributes.length,
            relationCount: this.entity.relations.length,
            functionCount: this.entity.functions.length,
            uniqueAttributeCount,
            requiredAttributeCount,
            sensitiveAttributeCount,
            hasInheritance: this.hasInheritance(),
            isAbstract: this.isAbstract()
        };
    }

    /**
     * Título: Validar Integridade da Entidade
     * 
     * Descrição:
     * Verifica conformidade e integridade da entidade.
     * 
     * Conformidade:
     * - ISO/IEC 29151: Alerta sobre atributos sensíveis
     * - ISO/IEC 25010: Validação de qualidade estrutural
     * 
     * @returns Array de erros/avisos (vazio se válida)
     * 
     * @example
     * ```typescript
     * const erros = entity.validate();
     * erros.forEach(erro => console.error(erro));
     * ```
     */
    public validate(): string[] {
        const errors: string[] = [];
        const qualifiedName = this.getQualifiedName();

        // Valida entidade vazia
        if (this.entity.attributes.length === 0 && 
            this.entity.relations.length === 0 &&
            !this.isAbstract()) {
            errors.push(
                `Entidade '${qualifiedName}' não possui atributos nem relacionamentos`
            );
        }

        // Valida nomes únicos de atributos
        const attrNames = new Set<string>();
        this.entity.attributes.forEach(attr => {
            if (attrNames.has(attr.name)) {
                errors.push(
                    `Nome de atributo duplicado '${attr.name}' em '${qualifiedName}'`
                );
            }
            attrNames.add(attr.name);
        });

        // Valida nomes únicos de relacionamentos
        const relNames = new Set<string>();
        this.entity.relations.forEach(rel => {
            if (relNames.has(rel.name)) {
                errors.push(
                    `Nome de relacionamento duplicado '${rel.name}' em '${qualifiedName}'`
                );
            }
            relNames.add(rel.name);
        });

        // Alerta sobre atributos sensíveis (ISO/IEC 29151)
        const stats = this.getStatistics();
        if (stats.sensitiveAttributeCount > 0) {
            errors.push(
                `[ISO-29151] Entidade '${qualifiedName}' possui ${stats.sensitiveAttributeCount} atributo(s) sensível(is). Considere criptografia.`
            );
        }

        // Valida herança
        if (this.hasInheritance()) {
            const superType = this.getSuperType();
            if (superType && !superType.$ref && !superType.$refText) {
                errors.push(
                    `SuperType de '${qualifiedName}' não está definido corretamente`
                );
            }
        }

        return errors;
    }

    /**
     * Título: Obter Estrutura Interna da Entidade
     * 
     * Descrição:
     * Retorna referência direta à estrutura LocalEntity interna.
     * 
     * @returns Estrutura LocalEntity interna
     * 
     * @example
     * ```typescript
     * const rawEntity = entityModel.getEntity();
     * ```
     */
    public getEntity(): LocalEntity {
        return this.entity;
    }

    /**
     * Título: Representação Textual da Entidade
     * 
     * Descrição:
     * Gera string legível com resumo da entidade.
     * 
     * @returns String descritiva da entidade
     * 
     * @example
     * ```typescript
     * console.log(entity.toString());
     * // Saída:
     * // Entity: Cliente
     * //   Qualified Name: Vendas.Cliente
     * //   Abstract: false
     * //   Attributes: 5
     * //   Relations: 2
     * //   Functions: 3
     * ```
     */
    public toString(): string {
        const stats = this.getStatistics();
        const superTypeStr = this.hasInheritance() 
            ? ` extends ${this.getSuperType()?.$refText || 'Unknown'}`
            : '';

        return [
            `Entity: ${this.entity.name}${superTypeStr}`,
            `  Qualified Name: ${this.getQualifiedName()}`,
            `  Abstract: ${stats.isAbstract}`,
            `  Attributes: ${stats.attributeCount} (${stats.uniqueAttributeCount} unique, ${stats.requiredAttributeCount} required)`,
            `  Relations: ${stats.relationCount}`,
            `  Functions: ${stats.functionCount}`,
            ...(stats.sensitiveAttributeCount > 0 
                ? [`  ⚠️  Sensitive Attributes: ${stats.sensitiveAttributeCount}`] 
                : [])
        ].join('\n');
    }
}
