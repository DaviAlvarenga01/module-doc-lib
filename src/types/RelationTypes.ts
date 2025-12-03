/**
 * RelationTypes.ts
 * 
 * Título: Tipos de Relacionamentos entre Entidades
 * 
 * Descrição:
 * Define as interfaces para os diferentes tipos de relacionamentos entre entidades:
 * OneToOne (1:1), OneToMany (1:N), ManyToOne (N:1) e ManyToMany (N:M). Cada tipo
 * de relação possui características específicas de cardinalidade e navegação.
 * 
 * Processos:
 * 1. Define estrutura base comum a todos os relacionamentos
 * 2. Especifica OneToOne para relacionamentos únicos bidirecionais
 * 3. Implementa OneToMany para relacionamentos de composição/agregação
 * 4. Define ManyToOne para relacionamentos de associação
 * 5. Estabelece ManyToMany para relacionamentos de múltipla correspondência
 * 
 * 
 * @module types/RelationTypes
 * @author module-doc-lib
 * @version 1.0.0
 */

import { AstNode, Reference, Metadata } from './CoreTypes.js';
import { Entity, LocalEntity } from './EntityTypes.js';

/**
 * Relation
 * 
 * Título: Tipo União de Relacionamentos
 * 
 * Descrição:
 * Tipo união que engloba todos os tipos possíveis de relacionamento entre
 * entidades. Permite manipulação polimórfica de relações.
 * 
 * Processos:
 * - Agrupa OneToOne, OneToMany, ManyToOne, ManyToMany
 * - Facilita processamento genérico de relações
 * - Suporta padrão Strategy para tratamento diferenciado
 * 
 */
export type Relation = OneToOne | OneToMany | ManyToOne | ManyToMany;

/**
 * BaseRelation
 * 
 * Título: Interface Base para Relacionamentos
 * 
 * Descrição:
 * Define propriedades comuns a todos os tipos de relacionamento, incluindo
 * nome do relacionamento, entidade alvo e configurações de navegação.
 * 
 * Processos:
 * - Armazena nome do relacionamento (papel na relação)
 * - Mantém referência à entidade relacionada
 * - Vincula ao container (entidade dona)
 * 
 * @extends AstNode
 */
export interface BaseRelation extends AstNode {
    /**
     * Referência à entidade que possui este relacionamento
     */
    readonly $container: LocalEntity;
    
    /**
     * Nome do relacionamento (representa o papel na relação)
     * Exemplo: "pedidos", "cliente", "endereco"
     */
    name: string;
    
    /**
     * Referência à entidade relacionada
     */
    entity: Reference<Entity>;
    
    /**
     * Metadados adicionais do relacionamento
     */
    metadata?: Metadata;
}

/**
 * OneToOne
 * 
 * Título: Relacionamento Um-para-Um (1:1)
 * 
 * Descrição:
 * Representa um relacionamento onde uma instância da entidade origem se relaciona
 * com no máximo uma instância da entidade destino, e vice-versa. Exemplo: Pessoa
 * tem um CPF único.
 * 
 * Processos:
 * 1. Valida cardinalidade 1:1 entre entidades
 * 2. Pode ser unidirecional ou bidirecional
 * 3. Geralmente implementado com chave estrangeira única
 * 4. Suporta navegação nos dois sentidos (se bidirecional)
 * 
 * Características:
 * - Cardinalidade: 1..1 ou 0..1
 * - Exclusividade: Cada instância se relaciona com no máximo uma outra
 * - Integridade: Manter consistência em ambos os lados
 * 
 * 
 * @extends BaseRelation
 * 
 * @example
 * ```typescript
 * // Pessoa tem um Endereço
 * {
 *   $type: 'OneToOne',
 *   name: 'endereco',
 *   entity: { $refText: 'Endereco' },
 *   opposite: 'pessoa'
 * }
 * ```
 */
export interface OneToOne extends BaseRelation {
    /**
     * Identificador de tipo fixo
     */
    readonly $type: 'OneToOne';
    
    /**
     * Nome do relacionamento oposto (para navegação bidirecional)
     * Se definido, indica que a relação é bidirecional
     */
    opposite?: string;
    
    /**
     * Indica se a entidade relacionada é obrigatória (não pode ser null)
     */
    required?: boolean;
}

/**
 * OneToMany
 * 
 * Título: Relacionamento Um-para-Muitos (1:N)
 * 
 * Descrição:
 * Representa um relacionamento onde uma instância da entidade origem pode se
 * relacionar com múltiplas instâncias da entidade destino. Exemplo: Cliente
 * tem múltiplos Pedidos.
 * 
 * Processos:
 * 1. Valida cardinalidade 1:N entre entidades
 * 2. Lado "muitos" armazena coleção de referências
 * 3. Lado "um" é referenciado no lado "muitos" (ManyToOne correspondente)
 * 4. Geralmente implementado com chave estrangeira no lado "muitos"
 * 
 * Características:
 * - Cardinalidade: 1..* ou 0..*
 * - Coleção: Lado "um" contém lista do lado "muitos"
 * - Cascata: Operações podem propagar para elementos filhos
 * 
 * 
 * @extends BaseRelation
 * 
 * @example
 * ```typescript
 * // Cliente tem muitos Pedidos
 * {
 *   $type: 'OneToMany',
 *   name: 'pedidos',
 *   entity: { $refText: 'Pedido' },
 *   opposite: 'cliente'
 * }
 * ```
 */
export interface OneToMany extends BaseRelation {
    /**
     * Identificador de tipo fixo
     */
    readonly $type: 'OneToMany';
    
    /**
     * Nome do relacionamento oposto no lado "muitos" (geralmente um ManyToOne)
     */
    opposite?: string;
    
    /**
     * Indica se operações devem propagar em cascata (delete, update)
     */
    cascade?: boolean;
    
    /**
     * Indica se a coleção deve ser carregada eagerly (true) ou lazily (false)
     */
    eager?: boolean;
}

/**
 * ManyToOne
 * 
 * Título: Relacionamento Muitos-para-Um (N:1)
 * 
 * Descrição:
 * Representa um relacionamento onde múltiplas instâncias da entidade origem
 * podem se relacionar com uma única instância da entidade destino. É o inverso
 * de OneToMany. Exemplo: Vários Pedidos pertencem a um Cliente.
 * 
 * Processos:
 * 1. Valida cardinalidade N:1 entre entidades
 * 2. Armazena referência única à entidade "um"
 * 3. Corresponde ao lado "muitos" de um OneToMany
 * 4. Implementado com chave estrangeira na tabela origem
 * 
 * Características:
 * - Cardinalidade: *..1 ou *..0
 * - Referência: Lado "muitos" mantém referência ao lado "um"
 * - Ownership: Geralmente o lado "muitos" é o owner da relação
 * 
 * Conformidade ISO/IEC 25010:
 * - Funcionalidade: Modelagem de pertencimento e associação
 * - Eficiência: Implementação otimizada com chave estrangeira
 * 
 * @extends BaseRelation
 * 
 * @example
 * ```typescript
 * // Pedido pertence a um Cliente
 * {
 *   $type: 'ManyToOne',
 *   name: 'cliente',
 *   entity: { $refText: 'Cliente' },
 *   opposite: 'pedidos',
 *   required: true
 * }
 * ```
 */
export interface ManyToOne extends BaseRelation {
    /**
     * Identificador de tipo fixo
     */
    readonly $type: 'ManyToOne';
    
    /**
     * Nome do relacionamento oposto no lado "um" (geralmente um OneToMany)
     */
    opposite?: string;
    
    /**
     * Indica se a entidade relacionada é obrigatória (não pode ser null)
     */
    required?: boolean;
    
    /**
     * Indica se a referência deve ser carregada eagerly (true) ou lazily (false)
     */
    eager?: boolean;
}

/**
 * ManyToMany
 * 
 * Título: Relacionamento Muitos-para-Muitos (N:M)
 * 
 * Descrição:
 * Representa um relacionamento onde múltiplas instâncias da entidade origem
 * podem se relacionar com múltiplas instâncias da entidade destino. Exemplo:
 * Estudantes matriculados em múltiplos Cursos, Cursos tendo múltiplos Estudantes.
 * 
 * Processos:
 * 1. Valida cardinalidade N:M entre entidades
 * 2. Ambos os lados mantêm coleções
 * 3. Requer tabela intermediária (join table) na implementação
 * 4. Pode ter atributos adicionais na tabela intermediária
 * 
 * Características:
 * - Cardinalidade: *..* 
 * - Simetria: Relação bidirecional por natureza
 * - Join Table: Requer tabela associativa para implementação
 * - Atributos: Join table pode ter atributos próprios
 * 
 * Conformidade ISO/IEC 25010:
 * - Funcionalidade: Modelagem de relacionamentos complexos
 * - Flexibilidade: Suporte a atributos na relação
 * 
 * @extends BaseRelation
 * 
 * @example
 * ```typescript
 * // Estudante se matricula em muitos Cursos
 * {
 *   $type: 'ManyToMany',
 *   name: 'cursos',
 *   entity: { $refText: 'Curso' },
 *   opposite: 'estudantes',
 *   joinTable: 'matricula'
 * }
 * ```
 */
export interface ManyToMany extends BaseRelation {
    /**
     * Identificador de tipo fixo
     */
    readonly $type: 'ManyToMany';
    
    /**
     * Nome do relacionamento oposto no outro lado
     */
    opposite?: string;
    
    /**
     * Nome da tabela intermediária (join table)
     */
    joinTable?: string;
    
    /**
     * Indica se operações devem propagar em cascata
     */
    cascade?: boolean;
    
    /**
     * Indica se a coleção deve ser carregada eagerly (true) ou lazily (false)
     */
    eager?: boolean;
}

/**
 * RelationType
 * 
 * Título: Enumeração de Tipos de Relacionamento
 * 
 * Descrição:
 * Enumera os tipos possíveis de relacionamento para facilitar discriminação
 * e processamento baseado em tipo.
 * 
 * Processos:
 * - Identifica tipo de relação por string literal
 * - Facilita implementação de type guards
 * - Suporta switch/case baseado em tipo
 * 
 * Conformidade ISO/IEC 25010:
 * - Usabilidade: Identificação clara de tipos
 */
export enum RelationType {
    ONE_TO_ONE = 'OneToOne',
    ONE_TO_MANY = 'OneToMany',
    MANY_TO_ONE = 'ManyToOne',
    MANY_TO_MANY = 'ManyToMany'
}

/**
 * RelationCardinality
 * 
 * Título: Informações de Cardinalidade
 * 
 * Descrição:
 * Representa os limites de cardinalidade de um relacionamento (mínimo e máximo
 * de instâncias permitidas).
 * 
 * Processos:
 * - Define limite inferior (min)
 * - Define limite superior (max, '*' para ilimitado)
 * - Valida cardinalidade do relacionamento
 * 
 * Conformidade ISO/IEC 25010:
 * - Confiabilidade: Validação de limites de relacionamento
 */
export interface RelationCardinality {
    /**
     * Número mínimo de instâncias relacionadas (0 = opcional)
     */
    min: number;
    
    /**
     * Número máximo de instâncias relacionadas ('*' = ilimitado)
     */
    max: number | '*';
}
