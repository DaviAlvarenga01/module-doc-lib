/**
 * RelationUtils.ts
 * 
 * Título: Utilitários para Processamento de Relacionamentos
 * 
 * Descrição:
 * Fornece funções para processar e analisar relacionamentos entre entidades,
 * incluindo inversão de cardinalidades, identificação de ownership e construção
 * de mapas bidirecionais de relações. Essencial para geração correta de código
 * que representa relacionamentos em bancos de dados e ORMs.
 * 
 * Processos:
 * 1. Processamento de relacionamentos bidirecionais
 * 2. Inversão de cardinalidades (OneToMany ↔ ManyToOne)
 * 3. Identificação de owner vs non-owner
 * 4. Construção de mapa de relações para cada entidade
 * 5. Resolução de referências entre entidades
 * 
 * Conformidade:
 * - ISO/IEC 25010: Confiabilidade através de integridade referencial
 * - KISS Methodology: Lógica clara de inversão de relações
 * 
 * @module utils/RelationUtils
 * @author module-doc-lib
 * @version 1.0.0
 */

import type {
    LocalEntity,
    Relation,
    Reference,
    Entity
} from '../types/index.js';
import { isLocalEntity, isOneToMany } from './TypeGuards.js';

/**
 * RelationTypeString
 * 
 * Título: String Literal de Tipo de Relacionamento
 * 
 * Descrição:
 * Tipo união das string literals que representam os tipos de relacionamento.
 * Usado para type-safety em operações de inversão de cardinalidade.
 * Renomeado de RelationType para evitar conflito com enum RelationType da camada Types.
 * 
 * @type
 */
export type RelationTypeString = 'OneToMany' | 'OneToOne' | 'ManyToOne' | 'ManyToMany';

/**
 * RelationInfo
 * 
 * Título: Informações Processadas de Relacionamento
 * 
 * Descrição:
 * Contém informações sobre um relacionamento após processamento, incluindo
 * entidade alvo, cardinalidade e ownership (quem é dono da relação).
 * 
 * Estrutura:
 * - tgt: Entidade alvo do relacionamento
 * - card: Cardinalidade do relacionamento
 * - owner: Se true, esta entidade é dona da relação (mantém FK ou join table)
 * 
 * Casos de uso:
 * - Geração de chaves estrangeiras
 * - Criação de tabelas de junção (ManyToMany)
 * - Determinação de cascata de operações
 * 
 * @interface
 */
export interface RelationInfo {
    /**
     * Entidade alvo do relacionamento
     */
    tgt: LocalEntity;
    
    /**
     * Cardinalidade do relacionamento
     */
    card: RelationTypeString;
    
    /**
     * Se true, esta entidade é dona da relação
     * Owner tipicamente mantém a chave estrangeira ou join table
     */
    owner: boolean;
}

/**
 * revertCard
 * 
 * Título: Inverter Cardinalidade de Relacionamento
 * 
 * Descrição:
 * Inverte a cardinalidade de um relacionamento para obter a perspectiva
 * do outro lado da relação. Por exemplo, se A tem OneToMany para B,
 * então B tem ManyToOne para A.
 * 
 * Processos:
 * 1. Recebe cardinalidade original
 * 2. Aplica regra de inversão:
 *    - OneToOne → OneToOne (simétrico)
 *    - OneToMany ↔ ManyToOne (inversos)
 *    - ManyToMany → ManyToMany (simétrico)
 * 3. Retorna cardinalidade invertida
 * 
 * Regras de inversão:
 * - 1:1 permanece 1:1 (bidirecional simétrico)
 * - 1:N inverte para N:1 (e vice-versa)
 * - N:M permanece N:M (bidirecional simétrico)
 * 
 * Casos de uso:
 * - Construir visão bidirecional de relacionamentos
 * - Gerar código para ambos os lados da relação
 * - Validar consistência de relacionamentos opostos
 * 
 * Conformidade ISO/IEC 25010:
 * - Corretude: Inversão matematicamente correta
 * - Integridade: Mantém semântica do relacionamento
 * 
 * @param card - Cardinalidade a ser invertida
 * @returns Cardinalidade invertida
 * 
 * @example
 * ```typescript
 * revertCard('OneToMany')   // 'ManyToOne'
 * revertCard('ManyToOne')   // 'OneToMany'
 * revertCard('OneToOne')    // 'OneToOne'
 * revertCard('ManyToMany')  // 'ManyToMany'
 * ```
 */
function revertCard(card: RelationTypeString): RelationTypeString {
    switch (card) {
        case 'OneToOne':
            return 'OneToOne';
        case 'OneToMany':
            return 'ManyToOne';
        case 'ManyToOne':
            return 'OneToMany';
        case 'ManyToMany':
            return 'ManyToMany';
    }
}

/**
 * getRef
 * 
 * Título: Resolver Referência de Tipo
 * 
 * Descrição:
 * Extrai o elemento concreto de uma referência ou referência indireta.
 * Suporta Reference<T> e objetos que contêm type: Reference<T>.
 * 
 * Processos:
 * 1. Verifica se objeto tem propriedade 'type'
 * 2. Se sim, assume ser referência indireta, usa type.$ref
 * 3. Se não, assume ser referência direta, usa $ref
 * 4. Retorna elemento referenciado ou undefined
 * 
 * Casos de uso:
 * - Resolver entity de um Relation
 * - Resolver type de um Attribute
 * - Navegar entre elementos relacionados
 * 
 * @param obj - Objeto com referência
 * @returns Elemento referenciado ou undefined
 * 
 * @example
 * ```typescript
 * const relation: ManyToOne = {
 *   name: 'cliente',
 *   entity: { $refText: 'Cliente', $ref: clienteEntity }
 * };
 * 
 * const cliente = getRef(relation);  // clienteEntity
 * ```
 */
function getRef(obj: any): any {
    // Se tem propriedade 'type', assume ser { type: Reference<T> }
    if (obj && typeof obj === 'object' && 'type' in obj) {
        return obj.type.$ref;
    }
    // Caso contrário, assume ser Reference<T> diretamente
    return obj.$ref;
}

/**
 * processRelations
 * 
 * Título: Processar Relacionamentos Bidirecionais
 * 
 * Descrição:
 * Processa todos os relacionamentos de um conjunto de entidades, construindo
 * um mapa bidirecional que inclui tanto as relações explícitas quanto suas
 * inversas implícitas. Para cada relacionamento definido, cria automaticamente
 * o relacionamento inverso na entidade alvo.
 * 
 * Processos:
 * 1. Inicializa mapa com array vazio para cada entidade
 * 2. Para cada entidade, itera sobre suas relações
 * 3. Resolve referência da entidade alvo
 * 4. Se alvo é LocalEntity:
 *    a. Se relação é OneToMany, inverte ownership
 *       - Adiciona ManyToOne na entidade alvo (como owner)
 *       - Adiciona OneToMany na entidade origem (como non-owner)
 *    b. Caso contrário (OneToOne, ManyToOne, ManyToMany):
 *       - Adiciona relação na entidade origem (como owner)
 *       - Adiciona relação invertida na entidade alvo (como non-owner)
 * 5. Retorna mapa completo com todas as relações bidirecionais
 * 
 * Lógica de Ownership:
 * - Owner: Entidade que mantém a chave estrangeira ou join table
 * - OneToMany: Lado "many" é owner (tem FK para lado "one")
 * - ManyToOne: Lado "many" é owner (tem FK)
 * - OneToOne: Depende de implementação, geralmente quem declara
 * - ManyToMany: Ambos podem ser owners, join table intermediária
 * 
 * Casos de uso:
 * - Geração de DDL (CREATE TABLE com FKs)
 * - Configuração de ORMs (JPA, Entity Framework, SQLAlchemy)
 * - Geração de migrations
 * - Validação de integridade referencial
 * - Geração de código de navegação entre entidades
 * 
 * Conformidade ISO/IEC 25010:
 * - Integridade: Garante relações bidirecionais consistentes
 * - Completude: Inclui todas as perspectivas da relação
 * - Manutenibilidade: Mapa explícito facilita geração
 * 
 * @param localEntities - Array de entidades a processar
 * @returns Mapa de entidade para array de RelationInfo
 * 
 * @example
 * ```typescript
 * // Entidades:
 * // Cliente { pedidos: OneToMany Pedido }
 * // Pedido { cliente: ManyToOne Cliente }
 * 
 * const relations = processRelations([clienteEntity, pedidoEntity]);
 * 
 * // relations.get(clienteEntity) retorna:
 * // [{ tgt: pedidoEntity, card: 'OneToMany', owner: false }]
 * // (Cliente não é owner do OneToMany, Pedido mantém FK)
 * 
 * // relations.get(pedidoEntity) retorna:
 * // [{ tgt: clienteEntity, card: 'ManyToOne', owner: true }]
 * // (Pedido é owner do ManyToOne, mantém FK cliente_id)
 * ```
 */
export function processRelations(
    localEntities: LocalEntity[]
): Map<LocalEntity, RelationInfo[]> {
    // Inicializa o mapa com listas vazias
    const map: Map<LocalEntity, RelationInfo[]> = new Map();

    for (const cls of localEntities) {
        map.set(cls, []);
    }
    
    /**
     * add_relation
     * 
     * Título: Adicionar Relação Bidirecional
     * 
     * Descrição:
     * Função auxiliar interna que adiciona uma relação e sua inversa
     * ao mapa, marcando corretamente owner e non-owner.
     * 
     * @param owner - Entidade owner da relação
     * @param nonOwner - Entidade non-owner da relação
     * @param cardName - Cardinalidade da relação (perspectiva do owner)
     */
    const add_relation = (
        owner: LocalEntity,
        nonOwner: LocalEntity,
        cardName: RelationTypeString
    ) => {
        // Adiciona relação no owner (com owner: true)
        map.get(owner)?.push({
            tgt: nonOwner,
            card: cardName,
            owner: true
        });
        
        // Adiciona relação inversa no non-owner (com owner: false)
        map.get(nonOwner)?.push({
            tgt: owner,
            card: revertCard(cardName),
            owner: false
        });
    };

    // Processa cada entidade e suas relações
    for (const entity of localEntities) {
        for (const relationship of entity.relations) {
            // Resolve referência da entidade alvo
            const relationType = getRef(relationship);
            
            if (isLocalEntity(relationType)) {
                // Caso especial: OneToMany inverte ownership
                if (isOneToMany(relationship)) {
                    // OneToMany: lado "many" (alvo) é owner
                    add_relation(relationType, entity, 'ManyToOne');
                } else {
                    // Outros casos: entidade que declara é owner
                    add_relation(entity, relationType, relationship.$type as RelationTypeString);
                }
            }
        }
    }

    return map;
}

/**
 * getRelationsForEntity
 * 
 * Título: Obter Relacionamentos de uma Entidade
 * 
 * Descrição:
 * Extrai do mapa processado todos os relacionamentos que envolvem
 * uma entidade específica.
 * 
 * @param entity - Entidade para buscar relacionamentos
 * @param relationsMap - Mapa de relacionamentos processados
 * @returns Array de RelationInfo para a entidade
 * 
 * @example
 * ```typescript
 * const pedidoRelations = getRelationsForEntity(pedidoEntity, relationsMap);
 * for (const rel of pedidoRelations) {
 *   console.log(`${rel.card} to ${rel.tgt.name}, owner: ${rel.owner}`);
 * }
 * ```
 */
export function getRelationsForEntity(
    entity: LocalEntity,
    relationsMap: Map<LocalEntity, RelationInfo[]>
): RelationInfo[] {
    return relationsMap.get(entity) || [];
}

/**
 * findOwnedRelations
 * 
 * Título: Encontrar Relações Owned
 * 
 * Descrição:
 * Filtra relacionamentos de uma entidade retornando apenas aqueles
 * onde a entidade é owner (mantém FK ou join table).
 * 
 * Processos:
 * 1. Obtém todos os relacionamentos da entidade
 * 2. Filtra apenas onde owner === true
 * 3. Retorna array filtrado
 * 
 * Casos de uso:
 * - Geração de chaves estrangeiras (apenas owners)
 * - Criação de índices (em FKs)
 * - Migrations (apenas o owner cria constraint)
 * 
 * @param entity - Entidade a verificar
 * @param relationsMap - Mapa de relacionamentos
 * @returns Array de relacionamentos onde entidade é owner
 * 
 * @example
 * ```typescript
 * const ownedRels = findOwnedRelations(pedidoEntity, relationsMap);
 * // Retorna apenas: [{ tgt: Cliente, card: 'ManyToOne', owner: true }]
 * // Não retorna OneToMany de itens (Pedido não é owner)
 * ```
 */
export function findOwnedRelations(
    entity: LocalEntity,
    relationsMap: Map<LocalEntity, RelationInfo[]>
): RelationInfo[] {
    const relations = getRelationsForEntity(entity, relationsMap);
    return relations.filter(rel => rel.owner);
}

/**
 * findRelationByTarget
 * 
 * Título: Encontrar Relação por Entidade Alvo
 * 
 * Descrição:
 * Busca uma relação específica de uma entidade para uma entidade alvo.
 * 
 * @param source - Entidade origem
 * @param target - Entidade alvo
 * @param relationsMap - Mapa de relacionamentos
 * @returns RelationInfo encontrada ou undefined
 * 
 * @example
 * ```typescript
 * const rel = findRelationByTarget(pedidoEntity, clienteEntity, relationsMap);
 * // { tgt: Cliente, card: 'ManyToOne', owner: true }
 * ```
 */
export function findRelationByTarget(
    source: LocalEntity,
    target: LocalEntity,
    relationsMap: Map<LocalEntity, RelationInfo[]>
): RelationInfo | undefined {
    const relations = getRelationsForEntity(source, relationsMap);
    return relations.find(rel => rel.tgt === target);
}

/**
 * hasCircularRelation
 * 
 * Título: Verificar Relação Circular
 * 
 * Descrição:
 * Verifica se duas entidades têm relacionamento circular (A → B e B → A).
 * 
 * @param entity1 - Primeira entidade
 * @param entity2 - Segunda entidade
 * @param relationsMap - Mapa de relacionamentos
 * @returns true se houver relação circular
 * 
 * @example
 * ```typescript
 * // Usuario { cargo: ManyToOne Cargo }
 * // Cargo { usuarios: OneToMany Usuario }
 * hasCircularRelation(usuario, cargo, map)  // true
 * ```
 */
export function hasCircularRelation(
    entity1: LocalEntity,
    entity2: LocalEntity,
    relationsMap: Map<LocalEntity, RelationInfo[]>
): boolean {
    const rel1to2 = findRelationByTarget(entity1, entity2, relationsMap);
    const rel2to1 = findRelationByTarget(entity2, entity1, relationsMap);
    
    return rel1to2 !== undefined && rel2to1 !== undefined;
}
