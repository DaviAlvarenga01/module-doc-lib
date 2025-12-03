/**
 * AstUtils.ts
 * 
 * Título: Utilitários para Navegação na AST
 * 
 * Descrição:
 * Fornece funções para navegação e manipulação da árvore sintática abstrata
 * (AST - Abstract Syntax Tree). Permite travessia hierárquica, obtenção de
 * nomes qualificados, busca de elementos e outras operações essenciais para
 * processamento do modelo de domínio.
 * 
 * Processos:
 * 1. Navegação ascendente (filho → pai → raiz)
 * 2. Navegação descendente (pai → filhos)
 * 3. Busca de elementos por nome/tipo
 * 4. Construção de nomes qualificados hierárquicos
 * 5. Resolução de referências
 * 
 * Conformidade:
 * - ISO/IEC 25010: Manutenibilidade através de API clara
 * - KISS Methodology: Funções focadas e diretas
 * 
 * @module utils/AstUtils
 * @author module-doc-lib
 * @version 1.0.0
 */

import type {
    AstNode,
    Model,
    Module,
    LocalEntity,
    Entity,
    QualifiedName,
    Reference,
    AbstractElement
} from '../types/index.js';
import { isModel, isModule, isLocalEntity } from './TypeGuards.js';

/**
 * getQualifiedName
 * 
 * Título: Obter Nome Qualificado de Entidade
 * 
 * Descrição:
 * Constrói o nome qualificado (fully qualified name) de uma entidade navegando
 * pela hierarquia até a raiz. O nome qualificado inclui todos os módulos pais
 * separados por ponto, formando um caminho único para a entidade.
 * 
 * Processos:
 * 1. Inicia com o nome da própria entidade
 * 2. Navega para o container pai ($container)
 * 3. Se pai é Module, prepend o nome do módulo
 * 4. Repete até encontrar Model (raiz)
 * 5. Retorna nome qualificado completo
 * 
 * Estrutura resultante:
 * - Entidade em módulo simples: "ModuleName.EntityName"
 * - Entidade em submódulo: "ParentModule.ChildModule.EntityName"
 * - Entidade em raiz: "EntityName"
 * 
 * Casos de uso:
 * - Geração de imports: import { Cliente } from 'vendas.Cliente'
 * - Nomes de pacotes Java: com.empresa.vendas.Cliente
 * - Namespaces C#: Empresa.Vendas.Cliente
 * - Referências únicas em documentação
 * 
 * Conformidade ISO/IEC 25010:
 * - Identificabilidade: Nome único para cada entidade
 * - Rastreabilidade: Caminho completo desde a raiz
 * 
 * Conformidade ISO/IEC 12207:
 * - Nomenclatura: Identificação hierárquica de componentes
 * 
 * @param entity - Entidade para obter nome qualificado
 * @returns Nome qualificado no formato "Module.SubModule.Entity"
 * 
 * @example
 * ```typescript
 * // Entidade Cliente no módulo vendas
 * const cliente: LocalEntity = {
 *   $type: 'LocalEntity',
 *   name: 'Cliente',
 *   $container: vendasModule
 * };
 * 
 * getQualifiedName(cliente)  // "vendas.Cliente"
 * 
 * // Entidade em submódulo
 * const pedido: LocalEntity = {
 *   $type: 'LocalEntity',
 *   name: 'Pedido',
 *   $container: { name: 'pedidos', $container: vendasModule }
 * };
 * 
 * getQualifiedName(pedido)  // "vendas.pedidos.Pedido"
 * ```
 */
export function getQualifiedName(entity: Entity): QualifiedName {
    let qualifiedName = (entity as any).name;
    let parent: any = (entity as any).$container;
    
    // Navega até a raiz acumulando nomes
    while (parent && !isModel(parent)) {
        qualifiedName = `${parent.name}.${qualifiedName}`;
        parent = parent.$container;
    }
    
    return qualifiedName;
}

/**
 * getContainer
 * 
 * Título: Obter Container Pai
 * 
 * Descrição:
 * Retorna o container pai de um nó da AST. O container é o elemento que
 * contém o nó atual na hierarquia.
 * 
 * Processos:
 * 1. Acessa propriedade $container do nó
 * 2. Retorna o container ou undefined se não houver
 * 
 * Casos de uso:
 * - Navegação ascendente na AST
 * - Busca de contexto do elemento
 * - Verificação de hierarquia
 * 
 * @param node - Nó da AST
 * @returns Container pai ou undefined se for raiz
 * 
 * @example
 * ```typescript
 * const attribute: Attribute = { name: 'nome', $container: entity };
 * const entity = getContainer(attribute);  // LocalEntity
 * const module = getContainer(entity);     // Module
 * ```
 */
export function getContainer(node: AstNode): AstNode | undefined {
    return node.$container;
}

/**
 * findRootModel
 * 
 * Título: Encontrar Modelo Raiz
 * 
 * Descrição:
 * Navega pela hierarquia até encontrar o nó raiz (Model) da AST.
 * Útil quando se tem uma referência a um elemento profundo e precisa
 * acessar o modelo completo.
 * 
 * Processos:
 * 1. Verifica se o nó atual é Model
 * 2. Se não, navega para o container pai
 * 3. Repete até encontrar Model
 * 4. Retorna Model ou undefined se não encontrar
 * 
 * Casos de uso:
 * - Acesso a configurações globais a partir de qualquer elemento
 * - Busca em todo o modelo a partir de elemento local
 * - Validação de hierarquia completa
 * 
 * Conformidade ISO/IEC 25010:
 * - Navegabilidade: Acesso fácil ao contexto global
 * 
 * @param node - Qualquer nó da AST
 * @returns Model raiz ou undefined
 * 
 * @example
 * ```typescript
 * const attribute: Attribute = { name: 'nome', $container: entity };
 * const model = findRootModel(attribute);
 * 
 * if (model) {
 *   console.log(model.configuration?.backendLanguage);
 * }
 * ```
 */
export function findRootModel(node: AstNode): Model | undefined {
    let current: AstNode | undefined = node;
    
    while (current) {
        if (isModel(current)) {
            return current;
        }
        current = current.$container;
    }
    
    return undefined;
}

/**
 * findContainerOfType
 * 
 * Título: Encontrar Container de Tipo Específico
 * 
 * Descrição:
 * Navega pela hierarquia ascendente até encontrar um container do tipo
 * especificado. Útil para encontrar o módulo ou modelo que contém um elemento.
 * 
 * Processos:
 * 1. Inicia no nó atual
 * 2. Verifica se $type corresponde ao tipo procurado
 * 3. Se não, navega para o container pai
 * 4. Repete até encontrar ou chegar na raiz
 * 5. Retorna elemento encontrado ou undefined
 * 
 * Casos de uso:
 * - Encontrar módulo de um atributo: findContainerOfType(attr, 'Module')
 * - Encontrar entidade de um parâmetro
 * - Validação de contexto
 * 
 * @param node - Nó inicial
 * @param type - Tipo do container procurado (ex: 'Module', 'LocalEntity')
 * @returns Container do tipo especificado ou undefined
 * 
 * @example
 * ```typescript
 * const param: Parameter = { name: 'id', type: 'int', $container: func };
 * const entity = findContainerOfType(param, 'LocalEntity');
 * const module = findContainerOfType(param, 'Module');
 * ```
 */
export function findContainerOfType<T extends AstNode>(
    node: AstNode,
    type: string
): T | undefined {
    let current: AstNode | undefined = node;
    
    while (current) {
        if (current.$type === type) {
            return current as T;
        }
        current = current.$container;
    }
    
    return undefined;
}

/**
 * getAllEntities
 * 
 * Título: Obter Todas as Entidades do Modelo
 * 
 * Descrição:
 * Coleta todas as entidades locais presentes em um modelo, incluindo
 * entidades em módulos e submódulos aninhados.
 * 
 * Processos:
 * 1. Itera sobre elementos abstratos do modelo
 * 2. Se elemento é LocalEntity, adiciona à lista
 * 3. Se elemento é Module, processa recursivamente
 * 4. Retorna lista completa de entidades
 * 
 * Casos de uso:
 * - Processamento de todas as entidades para geração de código
 * - Validação global do modelo
 * - Estatísticas e análise do modelo
 * - Geração de índices e documentação
 * 
 * Conformidade ISO/IEC 25010:
 * - Completude: Acesso a todos os elementos do modelo
 * 
 * @param model - Modelo raiz
 * @returns Array com todas as entidades locais
 * 
 * @example
 * ```typescript
 * const allEntities = getAllEntities(model);
 * console.log(`Total de entidades: ${allEntities.length}`);
 * 
 * for (const entity of allEntities) {
 *   console.log(`- ${getQualifiedName(entity)}`);
 * }
 * ```
 */
export function getAllEntities(model: Model): LocalEntity[] {
    const entities: LocalEntity[] = [];
    
    function collectFromElements(elements: AbstractElement[]): void {
        for (const element of elements) {
            if (isLocalEntity(element)) {
                entities.push(element);
            } else if (isModule(element)) {
                collectFromElements(element.elements);
            }
        }
    }
    
    collectFromElements(model.abstractElements);
    return entities;
}

/**
 * getAllModules
 * 
 * Título: Obter Todos os Módulos do Modelo
 * 
 * Descrição:
 * Coleta todos os módulos presentes em um modelo, incluindo submódulos
 * aninhados recursivamente.
 * 
 * Processos:
 * 1. Itera sobre elementos abstratos
 * 2. Se elemento é Module, adiciona à lista
 * 3. Processa recursivamente elementos do módulo
 * 4. Retorna lista completa de módulos
 * 
 * Casos de uso:
 * - Geração de estrutura de pacotes/namespaces
 * - Criação de índice de módulos
 * - Análise de organização do modelo
 * 
 * @param model - Modelo raiz
 * @returns Array com todos os módulos
 * 
 * @example
 * ```typescript
 * const allModules = getAllModules(model);
 * for (const module of allModules) {
 *   console.log(`Module: ${module.name}`);
 * }
 * ```
 */
export function getAllModules(model: Model): Module[] {
    const modules: Module[] = [];
    
    function collectModules(elements: AbstractElement[]): void {
        for (const element of elements) {
            if (isModule(element)) {
                modules.push(element);
                collectModules(element.elements);
            }
        }
    }
    
    collectModules(model.abstractElements);
    return modules;
}

/**
 * findEntityByName
 * 
 * Título: Encontrar Entidade por Nome
 * 
 * Descrição:
 * Busca uma entidade no modelo pelo seu nome qualificado ou simples.
 * 
 * Processos:
 * 1. Obtém todas as entidades do modelo
 * 2. Para cada entidade, compara nome ou nome qualificado
 * 3. Retorna primeira entidade que corresponder
 * 4. Retorna undefined se não encontrar
 * 
 * Casos de uso:
 * - Resolução de referências por nome
 * - Busca de entidade para processamento
 * - Validação de existência
 * 
 * @param model - Modelo onde buscar
 * @param name - Nome simples ou qualificado da entidade
 * @returns Entidade encontrada ou undefined
 * 
 * @example
 * ```typescript
 * const cliente = findEntityByName(model, 'Cliente');
 * const pedido = findEntityByName(model, 'vendas.Pedido');
 * ```
 */
export function findEntityByName(
    model: Model,
    name: string
): LocalEntity | undefined {
    const entities = getAllEntities(model);
    
    return entities.find(entity => {
        return entity.name === name || getQualifiedName(entity) === name;
    });
}

/**
 * resolveReference
 * 
 * Título: Resolver Referência
 * 
 * Descrição:
 * Resolve uma referência (Reference<T>) encontrando o elemento referenciado
 * no modelo. Usa o $refText para buscar o elemento.
 * 
 * Processos:
 * 1. Verifica se referência já está resolvida ($ref existe)
 * 2. Se não, busca elemento pelo $refText
 * 3. Retorna elemento encontrado ou undefined
 * 
 * Casos de uso:
 * - Navegação de relacionamentos entre entidades
 * - Resolução de tipos de atributos (EnumX)
 * - Validação de integridade referencial
 * 
 * Conformidade ISO/IEC 25010:
 * - Integridade: Resolução de referências válidas
 * 
 * @param reference - Referência a ser resolvida
 * @param model - Modelo onde buscar
 * @returns Elemento referenciado ou undefined
 * 
 * @example
 * ```typescript
 * const relation: ManyToOne = {
 *   name: 'cliente',
 *   entity: { $refText: 'Cliente' }
 * };
 * 
 * const clienteEntity = resolveReference(relation.entity, model);
 * ```
 */
export function resolveReference<T>(
    reference: Reference<T>,
    model: Model
): T | undefined {
    // Se já está resolvida, retorna
    if (reference.$ref) {
        return reference.$ref;
    }
    
    // Tenta resolver pelo $refText
    const refText = reference.$refText;
    
    // Por padrão, assume que é uma entidade
    const entity = findEntityByName(model, refText);
    return entity as T | undefined;
}

/**
 * getPath
 * 
 * Título: Obter Caminho Hierárquico
 * 
 * Descrição:
 * Retorna um array com todos os containers desde o nó até a raiz,
 * formando um caminho completo na hierarquia.
 * 
 * Processos:
 * 1. Inicia com o nó atual
 * 2. Adiciona o nó ao caminho
 * 3. Navega para o container pai
 * 4. Repete até chegar na raiz
 * 5. Retorna array do mais específico ao mais geral
 * 
 * Casos de uso:
 * - Visualização de hierarquia
 * - Debugging de estrutura
 * - Análise de profundidade
 * 
 * @param node - Nó inicial
 * @returns Array de nós desde o elemento até a raiz
 * 
 * @example
 * ```typescript
 * const path = getPath(attribute);
 * // [Attribute, LocalEntity, Module, Model]
 * 
 * console.log(path.map(n => n.$type).join(' -> '));
 * // "Attribute -> LocalEntity -> Module -> Model"
 * ```
 */
export function getPath(node: AstNode): AstNode[] {
    const path: AstNode[] = [];
    let current: AstNode | undefined = node;
    
    while (current) {
        path.push(current);
        current = current.$container;
    }
    
    return path;
}
