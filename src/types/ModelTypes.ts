/**
 * ModelTypes.ts
 * 
 * Título: Tipos do Modelo de Domínio
 * 
 * Descrição:
 * Define o tipo Model, que representa a raiz da hierarquia de modelagem,
 * e o tipo Configuration, que armazena configurações globais do modelo.
 * 
 * Processos:
 * 1. Define estrutura do Model como container raiz
 * 2. Especifica Configuration para configurações de geração de código
 * 3. Estabelece hierarquia completa: Model → Module → Entity
 * 
 * Conformidade:
 * - ISO/IEC 25010: Funcionalidade e Configurabilidade
 * - ISO/IEC 12207: Arquitetura de Sistema
 * 
 * @module types/ModelTypes
 * @author module-doc-lib
 * @version 1.0.0
 */

import { AstNode, QualifiedName, Metadata } from './CoreTypes.js';
import { AbstractElement } from './EntityTypes.js';

/**
 * Model
 * 
 * Título: Modelo de Domínio Raiz
 * 
 * Descrição:
 * Representa o nó raiz da hierarquia de modelagem. Contém módulos, entidades
 * e enumerações de nível superior, além de configurações globais.
 * 
 * Processos:
 * 1. Serve como container raiz para todos os elementos
 * 2. Armazena configurações globais de geração
 * 3. Não possui container pai ($container é undefined)
 * 4. Agrupa elementos abstratos de nível superior
 * 
 * Características:
 * - Raiz da árvore: $container é undefined
 * - Container global: Contém módulos e entidades top-level
 * - Configurável: Possui objeto Configuration opcional
 * 
 * Conformidade ISO/IEC 25010:
 * - Funcionalidade: Estrutura completa do domínio
 * - Manutenibilidade: Organização hierárquica clara
 * 
 * Conformidade ISO/IEC 12207:
 * - Arquitetura: Decomposição em componentes (módulos)
 * 
 * @extends AstNode
 * 
 * @example
 * ```typescript
 * const model: Model = {
 *   $type: 'Model',
 *   abstractElements: [
 *     { $type: 'Module', name: 'domain.user', elements: [...] }
 *   ],
 *   configuration: {
 *     name: 'MyApp',
 *     version: '1.0.0'
 *   }
 * };
 * ```
 */
export interface Model extends AstNode {
    /**
     * Identificador de tipo fixo
     */
    readonly $type: 'Model';
    
    /**
     * Container é undefined (Model é a raiz)
     */
    readonly $container?: undefined;
    
    /**
     * Lista de elementos abstratos de nível superior (módulos, entidades, enums)
     */
    abstractElements: Array<AbstractElement>;
    
    /**
     * Configurações globais do modelo
     */
    configuration?: Configuration;
    
    /**
     * Metadados adicionais do modelo
     */
    metadata?: Metadata;
}

/**
 * Configuration
 * 
 * Título: Configurações do Modelo
 * 
 * Descrição:
 * Define configurações globais para geração de código e processamento do modelo,
 * incluindo informações do projeto, tecnologias alvo e preferências de geração.
 * 
 * Processos:
 * 1. Armazena nome e versão do projeto
 * 2. Define linguagens e frameworks alvo
 * 3. Especifica opções de geração de código
 * 4. Configura aspectos de deployment
 * 
 * Características:
 * - Nome do projeto (name)
 * - Versão semântica (version)
 * - Linguagem backend (backendLanguage)
 * - Framework frontend (frontendFramework)
 * - Configurações de banco de dados
 * 
 * Conformidade ISO/IEC 25010:
 * - Portabilidade: Configuração para múltiplas plataformas
 * - Adaptabilidade: Flexibilidade de configuração
 * 
 * Conformidade ISO/IEC 12207:
 * - Configuração: Gestão de parâmetros de sistema
 * 
 * @example
 * ```typescript
 * const config: Configuration = {
 *   name: 'EcommerceApp',
 *   version: '2.1.0',
 *   backendLanguage: 'java',
 *   frontendFramework: 'vue',
 *   database: {
 *     type: 'postgresql',
 *     version: '14'
 *   }
 * };
 * ```
 */
export interface Configuration {
    /**
     * Nome do projeto
     */
    name?: string;
    
    /**
     * Versão do projeto (formato semântico: major.minor.patch)
     */
    version?: string;
    
    /**
     * Linguagem de programação do backend
     * Valores suportados: 'java', 'csharp', 'python'
     */
    backendLanguage?: 'java' | 'csharp' | 'python' | string;
    
    /**
     * Framework do frontend
     * Valores suportados: 'vue', 'react', 'angular'
     */
    frontendFramework?: 'vue' | 'react' | 'angular' | string;
    
    /**
     * Configuração de banco de dados
     */
    database?: DatabaseConfiguration;
    
    /**
     * Porta padrão da aplicação
     */
    port?: number;
    
    /**
     * Namespace/package base do projeto
     */
    basePackage?: string;
    
    /**
     * Diretório de saída para código gerado
     */
    outputDirectory?: string;
    
    /**
     * Opções adicionais customizadas
     */
    options?: Record<string, any>;
}

/**
 * DatabaseConfiguration
 * 
 * Título: Configuração de Banco de Dados
 * 
 * Descrição:
 * Especifica configurações relacionadas ao banco de dados, incluindo tipo,
 * versão e opções de conexão.
 * 
 * Processos:
 * - Define tipo de SGBD (PostgreSQL, MySQL, MongoDB, etc.)
 * - Especifica versão do banco
 * - Configura opções de conexão e pool
 * 
 * Conformidade ISO/IEC 25010:
 * - Compatibilidade: Suporte a múltiplos SGBDs
 * - Portabilidade: Abstração de detalhes de banco
 */
export interface DatabaseConfiguration {
    /**
     * Tipo de banco de dados
     */
    type: 'postgresql' | 'mysql' | 'mongodb' | 'sqlserver' | 'oracle' | string;
    
    /**
     * Versão do banco de dados
     */
    version?: string;
    
    /**
     * Host do banco (para geração de configuração)
     */
    host?: string;
    
    /**
     * Porta do banco
     */
    port?: number;
    
    /**
     * Nome do database
     */
    database?: string;
    
    /**
     * Opções adicionais de configuração
     */
    options?: Record<string, any>;
}
