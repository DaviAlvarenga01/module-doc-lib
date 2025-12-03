/**
 * EntityTypes.ts
 * 
 * Título: Tipos de Entidades e Elementos do Domínio
 * 
 * Descrição:
 * Define as interfaces e tipos para entidades de domínio, atributos, enumerações
 * e funções. Estas estruturas representam os elementos fundamentais de um modelo
 * de dados orientado a objetos.
 * 
 * Processos:
 * 1. Define estrutura de entidades (LocalEntity) com herança
 * 2. Especifica atributos com tipos e restrições
 * 3. Implementa enumerações (EnumX) com valores literais
 * 4. Modela funções de entidade com parâmetros e retorno
 * 5. Estabelece módulos como containers de entidades
 * 
 * Conformidade:
 * - ISO/IEC 25010: Funcionalidade e Usabilidade
 * - ISO/IEC 29151: Proteção de dados pessoais
 * 
 * @module types/EntityTypes
 * @author module-doc-lib
 * @version 1.0.0
 */

import { 
    AstNode, 
    TypeIdentifier, 
    Reference, 
    DATATYPE, 
    QualifiedName,
    Metadata 
} from './CoreTypes.js';
import type { Relation } from './RelationTypes.js';

/**
 * Entity
 * 
 * Título: Interface Base para Entidades
 * 
 * Descrição:
 * Tipo união que representa qualquer tipo de entidade no modelo, seja uma
 * entidade local (LocalEntity) ou uma entidade externa referenciada.
 * 
 * Processos:
 * - Permite polimorfismo entre tipos de entidade
 * - Facilita manipulação genérica de entidades
 * - Suporta padrão de design Strategy para processamento
 * 
 * Conformidade ISO/IEC 25010:
 * - Flexibilidade: Suporte a diferentes tipos de entidade
 */
export type Entity = LocalEntity;

/**
 * AbstractElement
 * 
 * Título: Elemento Abstrato do Modelo
 * 
 * Descrição:
 * Tipo união que representa qualquer elemento que pode estar contido em um
 * modelo ou módulo (entidades, enumerações, módulos aninhados).
 * 
 * Processos:
 * - Suporta composição hierárquica de elementos
 * - Permite iteração homogênea sobre elementos heterogêneos
 * - Base para padrão Composite
 * 
 * Conformidade ISO/IEC 25010:
 * - Manutenibilidade: Estrutura extensível para novos tipos
 */
export type AbstractElement = Module | LocalEntity | EnumX;

/**
 * LocalEntity
 * 
 * Título: Entidade Local do Domínio
 * 
 * Descrição:
 * Representa uma entidade de domínio definida localmente no modelo, com
 * atributos, relações e comportamentos (funções). Suporta herança única
 * através de superType.
 * 
 * Processos:
 * 1. Armazena coleção de atributos (propriedades da entidade)
 * 2. Mantém lista de relações com outras entidades
 * 3. Define funções/métodos da entidade
 * 4. Suporta marcação como abstrata (is_abstract)
 * 5. Permite herança através de referência a superType
 * 
 * Conformidade ISO/IEC 25010:
 * - Funcionalidade: Modelagem completa de domínio OO
 * - Manutenibilidade: Estrutura clara e documentada
 * 
 * Conformidade ISO/IEC 29151:
 * - Proteção de dados: Identificação de dados sensíveis via atributos
 * 
 * @extends AstNode
 */
export interface LocalEntity extends AstNode {
    /**
     * Identificador de tipo fixo para discriminação
     */
    readonly $type: 'LocalEntity';
    
    /**
     * Referência ao módulo que contém esta entidade
     */
    readonly $container: Module;
    
    /**
     * Nome da entidade (identificador único no módulo)
     */
    name: string;
    
    /**
     * Lista de atributos (propriedades) da entidade
     */
    attributes: Array<Attribute>;
    
    /**
     * Lista de relações com outras entidades
     */
    relations: Array<Relation>;
    
    /**
     * Lista de funções/métodos da entidade
     */
    functions: Array<FunctionEntity>;
    
    /**
     * Indica se a entidade é abstrata (não pode ser instanciada diretamente)
     */
    is_abstract: boolean;
    
    /**
     * Referência à entidade pai (herança)
     */
    superType?: Reference<Entity>;
    
    /**
     * Metadados adicionais da entidade
     */
    metadata?: Metadata;
}

/**
 * Attribute
 * 
 * Título: Atributo de Entidade
 * 
 * Descrição:
 * Representa uma propriedade de uma entidade, com tipo de dado e restrições
 * de validação (unicidade, obrigatoriedade, limites).
 * 
 * Processos:
 * 1. Define nome e tipo do atributo (DATATYPE ou referência a EnumX)
 * 2. Especifica restrições de unicidade (unique)
 * 3. Define se é campo obrigatório (blank)
 * 4. Estabelece limites de valor (max, min)
 * 5. Permite valor padrão (default_value)
 * 
 * Conformidade ISO/IEC 25010:
 * - Confiabilidade: Validações garantem integridade dos dados
 * 
 * Conformidade ISO/IEC 29151:
 * - Minimização de dados: Restrições controlam coleta de informações
 * 
 * @extends AstNode
 */
export interface Attribute extends AstNode {
    /**
     * Identificador de tipo fixo
     */
    readonly $type: 'Attribute';
    
    /**
     * Referência à entidade que contém este atributo
     */
    readonly $container: LocalEntity;
    
    /**
     * Nome do atributo
     */
    name: string;
    
    /**
     * Tipo de dado do atributo
     */
    type: AttributeType;
    
    /**
     * Indica se o atributo deve ter valor único (constraint de unicidade)
     */
    unique: boolean;
    
    /**
     * Indica se o atributo pode ser vazio/nulo (false = obrigatório)
     */
    blank: boolean;
    
    /**
     * Valor máximo permitido (para tipos numéricos ou comprimento de string)
     */
    max?: number;
    
    /**
     * Valor mínimo permitido (para tipos numéricos ou comprimento de string)
     */
    min?: number;
    
    /**
     * Valor padrão do atributo
     */
    default_value?: any;
    
    /**
     * Metadados adicionais do atributo
     */
    metadata?: Metadata;
}

/**
 * AttributeType
 * 
 * Título: Tipo de Atributo
 * 
 * Descrição:
 * Tipo união que representa os tipos possíveis para um atributo: pode ser
 * um tipo primitivo (DATATYPE) ou uma referência a uma enumeração (EnumX).
 * 
 * Processos:
 * - Suporta tipos primitivos através de DATATYPE
 * - Suporta tipos enumerados através de Reference<EnumX>
 * - Permite verificação de tipo em runtime
 * 
 * Conformidade ISO/IEC 25010:
 * - Funcionalidade: Sistema de tipos robusto e flexível
 */
export type AttributeType = DATATYPE | Reference<EnumX>;

/**
 * EnumX
 * 
 * Título: Enumeração
 * 
 * Descrição:
 * Representa um tipo enumerado com conjunto fixo de valores literais.
 * Usado para atributos que aceitam apenas valores predefinidos.
 * 
 * Processos:
 * 1. Define nome da enumeração
 * 2. Mantém lista de valores literais válidos
 * 3. Cada valor é um AttributeEnum com nome
 * 4. Garante domínio fechado de valores
 * 
 * Conformidade ISO/IEC 25010:
 * - Confiabilidade: Valores restritos previnem erros
 * - Usabilidade: Valores pré-definidos facilitam uso
 * 
 * @extends AstNode
 */
export interface EnumX extends AstNode {
    /**
     * Identificador de tipo fixo
     */
    readonly $type: 'EnumX';
    
    /**
     * Referência ao módulo que contém esta enumeração
     */
    readonly $container: Module;
    
    /**
     * Nome da enumeração
     */
    name: string;
    
    /**
     * Lista de valores literais da enumeração
     */
    literals: Array<AttributeEnum>;
    
    /**
     * Metadados adicionais da enumeração
     */
    metadata?: Metadata;
}

/**
 * AttributeEnum
 * 
 * Título: Valor Literal de Enumeração
 * 
 * Descrição:
 * Representa um valor individual dentro de uma enumeração. Cada literal
 * possui um nome único dentro da sua enumeração.
 * 
 * Processos:
 * - Armazena nome do literal
 * - Vincula-se à enumeração pai
 * - Permite valor numérico opcional associado
 * 
 * Conformidade ISO/IEC 25010:
 * - Funcionalidade: Modelagem precisa de domínios discretos
 * 
 * @extends AstNode
 */
export interface AttributeEnum extends AstNode {
    /**
     * Identificador de tipo fixo
     */
    readonly $type: 'AttributeEnum';
    
    /**
     * Referência à enumeração que contém este literal
     */
    readonly $container: EnumX;
    
    /**
     * Nome do literal (ex: "ATIVO", "INATIVO")
     */
    name: string;
    
    /**
     * Valor numérico opcional associado ao literal
     */
    value?: number;
}

/**
 * FunctionEntity
 * 
 * Título: Função de Entidade
 * 
 * Descrição:
 * Representa um método ou comportamento de uma entidade, com parâmetros
 * de entrada e tipo de retorno.
 * 
 * Processos:
 * 1. Define nome da função
 * 2. Especifica lista de parâmetros com tipos
 * 3. Define tipo de retorno (response)
 * 4. Permite documentação de comportamento
 * 
 * Conformidade ISO/IEC 25010:
 * - Funcionalidade: Modelagem de comportamento além de dados
 * - Manutenibilidade: Assinatura clara de operações
 * 
 * @extends AstNode
 */
export interface FunctionEntity extends AstNode {
    /**
     * Identificador de tipo fixo
     */
    readonly $type: 'FunctionEntity';
    
    /**
     * Referência à entidade que contém esta função
     */
    readonly $container: LocalEntity;
    
    /**
     * Nome da função
     */
    name: string;
    
    /**
     * Lista de parâmetros da função
     */
    parameters: Array<Parameter>;
    
    /**
     * Tipo de retorno da função (DATATYPE ou referência a entidade/enum)
     */
    response?: AttributeType | Reference<Entity>;
    
    /**
     * Metadados adicionais da função
     */
    metadata?: Metadata;
}

/**
 * Parameter
 * 
 * Título: Parâmetro de Função
 * 
 * Descrição:
 * Representa um parâmetro de entrada de uma função, com nome e tipo.
 * 
 * Processos:
 * - Define nome do parâmetro
 * - Especifica tipo do parâmetro
 * - Vincula-se à função pai
 * 
 * Conformidade ISO/IEC 25010:
 * - Funcionalidade: Interface clara de operações
 * 
 * @extends AstNode
 */
export interface Parameter extends AstNode {
    /**
     * Identificador de tipo fixo
     */
    readonly $type: 'Parameter';
    
    /**
     * Referência à função que contém este parâmetro
     */
    readonly $container: FunctionEntity;
    
    /**
     * Nome do parâmetro
     */
    name: string;
    
    /**
     * Tipo do parâmetro (DATATYPE, EnumX ou Entity)
     */
    type: AttributeType | Reference<Entity>;
}

/**
 * Module
 * 
 * Título: Módulo de Organização
 * 
 * Descrição:
 * Representa um namespace ou pacote que agrupa entidades, enumerações e
 * submódulos relacionados. Suporta hierarquia através de módulos aninhados.
 * 
 * Processos:
 * 1. Agrupa elementos relacionados (entidades, enums, submódulos)
 * 2. Define namespace qualificado (QualifiedName)
 * 3. Permite aninhamento de módulos (submódulos)
 * 4. Container pode ser Model ou Module pai
 * 
 * Conformidade ISO/IEC 25010:
 * - Manutenibilidade: Organização modular de elementos
 * - Reusabilidade: Módulos podem ser importados/reutilizados
 * 
 * Conformidade ISO/IEC 12207:
 * - Arquitetura: Decomposição modular do sistema
 * 
 * @extends AstNode
 */
export interface Module extends AstNode {
    /**
     * Identificador de tipo fixo
     */
    readonly $type: 'Module';
    
    /**
     * Referência ao container pai (Model ou Module)
     */
    readonly $container: any; // Model ou Module
    
    /**
     * Nome qualificado do módulo (ex: "domain.model.user")
     */
    name: QualifiedName;
    
    /**
     * Lista de elementos contidos no módulo
     */
    elements: Array<AbstractElement | LocalEntity>;
    
    /**
     * Metadados adicionais do módulo
     */
    metadata?: Metadata;
}

// Re-exportação de Relation de RelationTypes (para evitar import circular)
export type { Relation } from './RelationTypes.js';
