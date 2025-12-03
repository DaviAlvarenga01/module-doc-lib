/**
 * CoreTypes.ts
 * 
 * Título: Tipos Fundamentais do Sistema de Modelagem
 * 
 * Descrição:
 * Este arquivo define os tipos básicos e estruturas fundamentais que servem como
 * fundação para todo o sistema de modelagem de domínio. Inclui definições para
 * tipos de dados primitivos, referências entre entidades, containers hierárquicos
 * e metadados estruturais.
 * 
 * Processos:
 * 1. Define enumeração DATATYPE com todos os tipos primitivos suportados
 * 2. Implementa sistema de referências tipadas (Reference<T>) para relacionamentos
 * 3. Estabelece estrutura de containers hierárquicos (Container<T>)
 * 4. Fornece tipos auxiliares para qualificação de nomes e identificação
 * 
 * Conformidade:
 * - ISO/IEC 25010: Qualidade de Software (Funcionalidade e Manutenibilidade)
 * - ISO/IEC 12207: Processo de Desenvolvimento de Software
 * 
 * @module types/CoreTypes
 * @author module-doc-lib
 * @version 1.0.0
 */

/**
 * DATATYPE
 * 
 * Título: Enumeração de Tipos de Dados Primitivos
 * 
 * Descrição:
 * Define todos os tipos de dados primitivos suportados pelo sistema de modelagem.
 * Inclui tipos numéricos, textuais, booleanos, temporais e especiais.
 * 
 * Processos:
 * - Tipos numéricos: int, long, float, double, decimal
 * - Tipos textuais: string, char
 * - Tipos booleanos: boolean
 * - Tipos temporais: date, datetime, time
 * - Tipos especiais: blob (dados binários)
 * 
 */
export enum DATATYPE {
    /**
     * Número inteiro de 32 bits (-2,147,483,648 a 2,147,483,647)
     */
    int = 'int',
    
    /**
     * Número inteiro de 64 bits (-9,223,372,036,854,775,808 a 9,223,372,036,854,775,807)
     */
    long = 'long',
    
    /**
     * Número de ponto flutuante de 32 bits (precisão simples)
     */
    float = 'float',
    
    /**
     * Número de ponto flutuante de 64 bits (precisão dupla)
     */
    double = 'double',
    
    /**
     * Número decimal de alta precisão para valores monetários
     */
    decimal = 'decimal',
    
    /**
     * Cadeia de caracteres de comprimento variável
     */
    string = 'string',
    
    /**
     * Caractere único
     */
    char = 'char',
    
    /**
     * Valor lógico verdadeiro ou falso
     */
    boolean = 'boolean',
    
    /**
     * Data no formato YYYY-MM-DD
     */
    date = 'date',
    
    /**
     * Data e hora com precisão de milissegundos
     */
    datetime = 'datetime',
    
    /**
     * Hora do dia no formato HH:MM:SS
     */
    time = 'time',
    
    /**
     * Dados binários grandes (Binary Large Object)
     */
    blob = 'blob'
}

/**
 * Reference<T>
 * 
 * Título: Referência Tipada Genérica
 * 
 * Descrição:
 * Representa uma referência tipada para outro elemento do modelo, permitindo
 * navegação entre entidades relacionadas. Suporta tanto referências resolvidas
 * (com objeto concreto) quanto não resolvidas (apenas identificador).
 * 
 * Processos:
 * 1. Armazena identificador textual ($refText) da entidade referenciada
 * 2. Mantém referência ao objeto concreto ($ref) quando resolvida
 * 3. Permite verificação de resolução através da presença de $ref
 * 
 * Conformidade ISO/IEC 29151:
 * - Proteção de dados: Referências indiretas para prevenir acoplamento excessivo
 * 
 * @template T - Tipo da entidade sendo referenciada
 */
export interface Reference<T = any> {
    /**
     * Referência ao objeto concreto (presente quando resolvida)
     */
    readonly $ref?: T;
    
    /**
     * Identificador textual da entidade referenciada (sempre presente)
     */
    readonly $refText: string;
    
    /**
     * Mensagem de erro caso a referência não possa ser resolvida
     */
    readonly $error?: string;
}

/**
 * Container<T>
 * 
 * Título: Container Hierárquico Genérico
 * 
 * Descrição:
 * Define um tipo união que representa o container pai de um elemento na
 * hierarquia do modelo. Permite navegação ascendente na árvore de elementos.
 * 
 * Processos:
 * - Suporta múltiplos tipos de container através de união (|)
 * - Permite verificação de tipo do container em tempo de execução
 * - Facilita travessia da árvore hierárquica
 * 
 * Conformidade ISO/IEC 25010:
 * - Manutenibilidade: Estrutura hierárquica clara e navegável
 * 
 * @template T - Tipos de container permitidos
 */
export type Container<T> = T;

/**
 * QualifiedName
 * 
 * Título: Nome Qualificado
 * 
 * Descrição:
 * Representa um nome qualificado com possível hierarquia de namespaces,
 * usando ponto (.) como separador. Exemplo: "Module.SubModule.Entity"
 * 
 * Processos:
 * - Formato: "segmento1.segmento2.segmentoN"
 * - Suporta navegação por namespace hierárquico
 * - Garante identificação única de elementos
 * 
 * Conformidade ISO/IEC 12207:
 * - Identificação única de artefatos de software
 */
export type QualifiedName = string;

/**
 * TypeIdentifier
 * 
 * Título: Identificador de Tipo
 * 
 * Descrição:
 * String literal que identifica o tipo concreto de um elemento do modelo.
 * Permite discriminação de tipos em estruturas polimórficas.
 * 
 * Processos:
 * - Valor fixo por tipo (ex: 'Model', 'Module', 'LocalEntity')
 * - Usado para type guards e verificação de tipos
 * - Essencial para serialização/deserialização
 * 
 * Conformidade ISO/IEC 25010:
 * - Confiabilidade: Identificação inequívoca de tipos em runtime
 * 
 * Exemplos: 'Model' | 'Module' | 'LocalEntity' | 'Attribute'
 */
export type TypeIdentifier = string;

/**
 * AstNode
 * 
 * Título: Nó Base da Árvore Sintática Abstrata
 * 
 * Descrição:
 * Interface base que todos os nós da AST devem implementar. Define propriedades
 * essenciais para identificação e navegação na árvore.
 * 
 * Processos:
 * 1. Propriedade $type identifica o tipo concreto do nó
 * 2. Propriedade $container referencia o nó pai na hierarquia
 * 3. Permite implementação de padrão Composite para árvore
 * 
 * Conformidade ISO/IEC 25010:
 * - Manutenibilidade: Estrutura consistente para todos os nós
 * - Reusabilidade: Interface comum compartilhada
 */
export interface AstNode {
    /**
     * Identificador do tipo concreto do nó
     */
    readonly $type: TypeIdentifier;
    
    /**
     * Referência ao container pai na hierarquia (undefined para raiz)
     */
    readonly $container?: AstNode;
}

/**
 * Metadata
 * 
 * Título: Metadados de Elemento
 * 
 * Descrição:
 * Informações adicionais sobre um elemento do modelo, incluindo documentação,
 * anotações e dados de rastreabilidade.
 * 
 * Processos:
 * - Documentação: Descrição textual do elemento
 * - Anotações: Tags e marcadores customizados
 * - Rastreabilidade: Vínculo com requisitos e especificações
 * 
 * Conformidade ISO 9001:
 * - Rastreabilidade: Vinculação entre requisitos e implementação
 * 
 * Conformidade ISO/IEC 12207:
 * - Documentação: Registro de decisões de design
 */
export interface Metadata {
    /**
     * Descrição textual do elemento
     */
    description?: string;
    
    /**
     * Tags para categorização e busca
     */
    tags?: string[];
    
    /**
     * Anotações customizadas (chave-valor)
     */
    annotations?: Record<string, any>;
    
    /**
     * Identificadores de requisitos relacionados
     */
    requirements?: string[];
    
    /**
     * Data de criação do elemento
     */
    createdAt?: Date;
    
    /**
     * Data da última modificação
     */
    modifiedAt?: Date;
    
    /**
     * Autor/responsável pelo elemento
     */
    author?: string;
}
