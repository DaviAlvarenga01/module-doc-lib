/**
 * GraphUtils.ts
 * 
 * Título: Utilitários para Processamento de Grafos
 * 
 * Descrição:
 * Fornece algoritmos de teoria dos grafos para processamento de dependências
 * entre elementos do modelo. Inclui ordenação topológica (algoritmo de Kahn),
 * detecção de ciclos (DFS) e análise de dependências. Essencial para determinar
 * ordem de geração de código e validar integridade de relacionamentos.
 * 
 * Processos:
 * 1. Construção de grafo de dependências a partir de relações
 * 2. Ordenação topológica para determinar ordem de processamento
 * 3. Detecção de ciclos em dependências bidirecionais
 * 4. Análise de dependências diretas e transitivas
 * 
 * Conformidade:
 * - ISO/IEC 25010: Confiabilidade através de validação de dependências
 * - Algoritmos clássicos: Kahn (1962) e DFS para ciclos
 * 
 * @module utils/GraphUtils
 * @author module-doc-lib
 * @version 1.0.0
 */

/**
 * Dependency
 * 
 * Título: Interface de Dependência
 * 
 * Descrição:
 * Representa uma dependência direcionada entre dois elementos,
 * onde 'from' depende de 'to'.
 * 
 * @interface
 */
export interface Dependency {
    /**
     * Identificador do elemento origem (dependente)
     */
    from: string;
    
    /**
     * Identificador do elemento destino (dependência)
     */
    to: string;
}

/**
 * Node
 * 
 * Título: Interface de Nó de Grafo
 * 
 * Descrição:
 * Representa um nó no grafo de dependências com metadados associados.
 * 
 * @interface
 */
export interface Node {
    /**
     * Identificador único do nó
     */
    node: string;
    
    /**
     * Descrição textual do nó
     */
    description: string;
    
    /**
     * Lista opcional de atores/responsáveis
     */
    actors?: string[];
}

/**
 * Graph
 * 
 * Título: Classe de Grafo Direcionado
 * 
 * Descrição:
 * Implementa um grafo direcionado com lista de adjacências para representar
 * dependências entre elementos. Fornece algoritmos de ordenação topológica
 * e detecção de ciclos.
 * 
 * Processos:
 * 1. Adição de vértices com metadados
 * 2. Adição de arestas direcionadas (dependências)
 * 3. Ordenação topológica usando algoritmo de Kahn
 * 4. Detecção de ciclos usando DFS
 * 5. Geração de visualizações (Mermaid, Markdown)
 * 
 * Estrutura interna:
 * - adjacencyList: Map<vértice, {descrição, dependências, atores}>
 * - dependências: Array de vértices para os quais este vértice aponta
 * 
 * @class
 */
export class Graph {
    /**
     * Lista de adjacências do grafo
     * Mapeia cada vértice para seus metadados e dependências
     */
    private adjacencyList: Map<string, { 
        description: string; 
        dependencies: string[]; 
        actors: string[]; 
    }>;

    /**
     * Construtor do grafo
     * 
     * Título: Inicialização de Grafo Vazio
     * 
     * Descrição:
     * Cria um grafo vazio com lista de adjacências inicializada.
     * 
     * @constructor
     */
    constructor() {
        this.adjacencyList = new Map();
    }

    /**
     * addVertex
     * 
     * Título: Adicionar Vértice ao Grafo
     * 
     * Descrição:
     * Adiciona um novo vértice ao grafo com descrição e atores associados.
     * Se o vértice já existir, não faz nada.
     * 
     * Processos:
     * 1. Verifica se vértice já existe
     * 2. Se não existe, cria entrada na lista de adjacências
     * 3. Inicializa descrição, array de dependências vazio e atores
     * 
     * Casos de uso:
     * - Adicionar entidades ao grafo
     * - Adicionar casos de uso ao grafo
     * - Preparar grafo para análise de dependências
     * 
     * @param vertex - Identificador do vértice
     * @param description - Descrição textual do vértice
     * @param actors - Lista de atores relacionados
     * 
     * @example
     * ```typescript
     * const graph = new Graph();
     * graph.addVertex('Cliente', 'Entidade de cliente', ['Usuario']);
     * graph.addVertex('Pedido', 'Entidade de pedido', ['Usuario']);
     * ```
     */
    public addVertex(vertex: string, description: string, actors: string[]): void {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, { 
                description, 
                dependencies: [], 
                actors 
            });
        }
    }

    /**
     * addEdge
     * 
     * Título: Adicionar Aresta Direcionada
     * 
     * Descrição:
     * Adiciona uma aresta direcionada de source para target, representando
     * que source depende de target.
     * 
     * Processos:
     * 1. Verifica se ambos os vértices existem
     * 2. Se não existirem, lança erro
     * 3. Adiciona target à lista de dependências de source
     * 
     * Casos de uso:
     * - Registrar dependência entre entidades (relacionamento)
     * - Registrar dependência entre casos de uso
     * - Construir grafo de dependências
     * 
     * 
     * @param source - Vértice origem (dependente)
     * @param target - Vértice destino (dependência)
     * @throws {Error} Se algum vértice não existir
     * 
     * @example
     * ```typescript
     * graph.addEdge('Pedido', 'Cliente');  // Pedido depende de Cliente
     * graph.addEdge('ItemPedido', 'Pedido');
     * ```
     */
    public addEdge(source: string, target: string): void {
        if (!this.adjacencyList.has(source)) {
            throw new Error(`Vertex ${source} does not exist in the graph.`);
        }
        if (!this.adjacencyList.has(target)) {
            throw new Error(`Vertex ${target} does not exist in the graph.`);
        }
        this.adjacencyList.get(source)?.dependencies.push(target);
    }

    /**
     * topologicalSort
     * 
     * Título: Ordenação Topológica (Algoritmo de Kahn)
     * 
     * Descrição:
     * Realiza ordenação topológica do grafo usando o algoritmo de Kahn (1962).
     * Retorna uma ordenação linear dos vértices tal que para cada aresta (u, v),
     * u aparece antes de v na ordenação. Retorna null se houver ciclos.
     * 
     * Processos:
     * 1. Calcula grau de entrada (in-degree) de cada vértice
     * 2. Enfileira vértices com grau de entrada 0
     * 3. Para cada vértice desenfileirado:
     *    a. Adiciona à ordenação topológica
     *    b. Remove aresta para cada dependência
     *    c. Se dependência ficar com grau 0, enfileira
     * 4. Se ordenação tem todos os vértices, retorna
     * 5. Se não, há ciclo, retorna null
     * 
     * Complexidade:
     * - Tempo: O(V + E) onde V = vértices, E = arestas
     * - Espaço: O(V) para armazenar graus e fila
     * 
     * Casos de uso:
     * - Determinar ordem de geração de entidades
     * - Ordem de criação de tabelas (FKs)
     * - Ordem de processamento de módulos
     * - Resolver dependências de importação
     * 
     * 
     * @returns Array com vértices ordenados topologicamente, ou null se houver ciclo
     * 
     * @example
     * ```typescript
     * const sorted = graph.topologicalSort();
     * // ['Cliente', 'Pedido', 'ItemPedido']
     * // Cliente processado primeiro (sem dependências)
     * // Depois Pedido (depende de Cliente)
     * // Por fim ItemPedido (depende de Pedido)
     * ```
     */
    public topologicalSort(): string[] | null {
        const inDegree = new Map<string, number>();
        const zeroInDegreeQueue: string[] = [];
        const topologicalOrder: string[] = [];
    
        // Inicializa graus de entrada com 0
        for (const [vertex] of this.adjacencyList.entries()) {
            inDegree.set(vertex, 0);
        }
    
        // Calcula graus de entrada contando arestas que chegam
        for (const [vertex, { dependencies }] of this.adjacencyList.entries()) {
            for (const dependency of dependencies) {
                inDegree.set(dependency, (inDegree.get(dependency) || 0) + 1);
                vertex; // Silencia warning de variável não usada
            }
        }
    
        // Enfileira vértices com grau 0 (sem dependências)
        for (const [vertex, degree] of inDegree.entries()) {
            if (degree === 0) {
                zeroInDegreeQueue.push(vertex);
            }
        }
    
        // Processa vértices em ordem topológica
        while (zeroInDegreeQueue.length > 0) {
            const vertex = zeroInDegreeQueue.shift()!;
            topologicalOrder.push(vertex);
    
            const { dependencies } = this.adjacencyList.get(vertex)!;
            for (const dependency of dependencies) {
                // Remove aresta decrementando grau de entrada
                inDegree.set(dependency, (inDegree.get(dependency) || 0) - 1);
                
                // Se grau ficou 0, enfileira
                if (inDegree.get(dependency) === 0) {
                    zeroInDegreeQueue.push(dependency);
                }
            }
        }
    
        // Verifica se processou todos os vértices
        if (topologicalOrder.length !== this.adjacencyList.size) {
            return null; // Há ciclo
        }
    
        return topologicalOrder.reverse();
    }

    /**
     * containsCycle
     * 
     * Título: Detecção de Ciclos (DFS)
     * 
     * Descrição:
     * Detecta se o grafo contém algum ciclo usando busca em profundidade (DFS).
     * Se encontrar ciclo, retorna o caminho do ciclo em formato Mermaid.
     * 
     * Processos:
     * 1. Mantém conjunto de visitados e pilha de recursão
     * 2. Para cada vértice não visitado, executa DFS
     * 3. Durante DFS, marca vértice como na pilha
     * 4. Se encontrar vértice já na pilha, detectou ciclo
     * 5. Reconstrói caminho do ciclo usando mapa de pais
     * 6. Retorna diagrama Mermaid do ciclo
     * 
     * Complexidade:
     * - Tempo: O(V + E)
     * - Espaço: O(V) para conjuntos e pilha
     * 
     * Casos de uso:
     * - Validar modelo antes de gerar código
     * - Detectar dependências circulares entre entidades
     * - Prevenir loops infinitos em processamento
     * - Reportar erro com visualização do problema
     * 
     * Conformidade ISO/IEC 25010:
     * - Confiabilidade: Previne estados inválidos
     * - Usabilidade: Visualização clara do erro
     * 
     * @returns String com diagrama Mermaid do ciclo, ou null se não houver
     * 
     * @example
     * ```typescript
     * const cycle = graph.containsCycle();
     * if (cycle) {
     *   console.log('Ciclo detectado:');
     *   console.log(cycle);
     *   // graph TD
     *   //   A --> B
     *   //   B --> C
     *   //   C --> A
     * }
     * ```
     */
    public containsCycle(): string | null {
        const visited = new Set<string>();
        const stack = new Set<string>();
        const parent = new Map<string, string | null>();
    
        const dfs = (vertex: string): string | null => {
            if (!visited.has(vertex)) {
                visited.add(vertex);
                stack.add(vertex);
    
                const { dependencies } = this.adjacencyList.get(vertex)!;
                for (const dependency of dependencies) {
                    if (!visited.has(dependency)) {
                        parent.set(dependency, vertex);
                        const cyclePath = dfs(dependency);
                        if (cyclePath) return cyclePath;
                    } else if (stack.has(dependency)) {
                        // Ciclo detectado! Reconstrói caminho
                        const cyclePath: string[] = [];
                        let current = vertex;
                        while (current !== dependency) {
                            cyclePath.push(current);
                            current = parent.get(current) || "";
                        }
                        cyclePath.push(dependency);
                        cyclePath.push(vertex);
                        cyclePath.reverse();
                        return this.generateMermaidCycleDiagram(cyclePath);
                    }
                }
            }
            stack.delete(vertex);
            return null;
        };
    
        for (const vertex of this.adjacencyList.keys()) {
            if (!visited.has(vertex)) {
                const cyclePath = dfs(vertex);
                if (cyclePath) {
                    return `Cycle detected:\n${cyclePath}`;
                }
            }
        }
    
        return null;
    }

    /**
     * generateMermaidCycleDiagram
     * 
     * Título: Gerar Diagrama Mermaid de Ciclo
     * 
     * Descrição:
     * Gera um diagrama em sintaxe Mermaid representando um ciclo detectado.
     * 
     * @param cyclePath - Array com os vértices do ciclo em ordem
     * @returns String com diagrama Mermaid
     * @private
     */
    private generateMermaidCycleDiagram(cyclePath: string[]): string {
        let diagram = 'graph TD\n';
        for (let i = 0; i < cyclePath.length - 1; i++) {
            diagram += `  ${cyclePath[i]} --> ${cyclePath[i + 1]}\n`;
        }
        diagram += `  ${cyclePath[cyclePath.length - 1]} --> ${cyclePath[0]}\n`;
        return diagram;
    }

    /**
     * generateMermaidDiagram
     * 
     * Título: Gerar Diagrama Mermaid do Grafo
     * 
     * Descrição:
     * Gera um diagrama completo do grafo em sintaxe Mermaid, ordenado
     * topologicamente se possível.
     * 
     * @returns String com diagrama Mermaid ou mensagem de erro se houver ciclo
     */
    public generateMermaidDiagram(): string {
        const sortedNodes = this.topologicalSort();
        if (!sortedNodes) {
            return 'Cycle detected. Topological sort not possible.';
        }
    
        let diagram = 'graph TD\n';
        for (const node of sortedNodes) {
            const { dependencies } = this.adjacencyList.get(node)!;
            for (const dependency of dependencies) {
                diagram += `  ${dependency} --> ${node}\n`;
            }
        }
    
        return diagram;
    }

    /**
     * generateMarkdownTable
     * 
     * Título: Gerar Tabela Markdown de Dependências
     * 
     * Descrição:
     * Gera uma tabela em Markdown com informações sobre cada vértice,
     * suas dependências e elementos que dependem dele.
     * 
     * @returns String com tabela Markdown
     */
    public generateMarkdownTable(): string {
        const sortedNodes = this.topologicalSort();
        if (!sortedNodes) {
            return 'Cycle detected. Topological sort not possible.';
        }
    
        const headers = "| Item | Descrição | Dependências | Habilitados | Atores |\n| --- | --- | --- | --- | --- |\n";
        let rows = "";
    
        for (const node of sortedNodes) {
            const { description, dependencies, actors } = this.adjacencyList.get(node)!;
            const enables: string[] = [];
            
            // Encontra elementos que dependem deste
            for (const [vertex, { dependencies: vertexDeps }] of this.adjacencyList.entries()) {
                if (vertexDeps.includes(node)) {
                    enables.push(vertex);
                }
            }
            
            rows += `| ${node} | ${description} | ${dependencies.join(", ")} | ${enables.join(", ")} | ${actors.join(", ")} |\n`;
        }
    
        return headers + rows;
    }
}

/**
 * topologicalSort
 * 
 * Título: Função Auxiliar de Ordenação Topológica
 * 
 * Descrição:
 * Função de conveniência que cria um grafo, popula com nós e dependências,
 * e retorna a ordenação topológica.
 * 
 * @param nodes - Array de nós
 * @param dependencies - Array de dependências
 * @returns Array ordenado topologicamente ou null se houver ciclo
 */
export function topologicalSort(
    nodes: Node[],
    dependencies: Dependency[]
): string[] | null {
    const graph = new Graph();
    
    // Adiciona vértices
    for (const node of nodes) {
        graph.addVertex(node.node, node.description, node.actors || []);
    }
    
    // Adiciona arestas
    for (const dep of dependencies) {
        graph.addEdge(dep.from, dep.to);
    }
    
    return graph.topologicalSort();
}

/**
 * detectCycle
 * 
 * Título: Função Auxiliar de Detecção de Ciclos
 * 
 * Descrição:
 * Função de conveniência para detectar ciclos em um grafo de dependências.
 * 
 * @param nodes - Array de nós
 * @param dependencies - Array de dependências
 * @returns String com ciclo detectado ou null
 */
export function detectCycle(
    nodes: Node[],
    dependencies: Dependency[]
): string | null {
    const graph = new Graph();
    
    for (const node of nodes) {
        graph.addVertex(node.node, node.description, node.actors || []);
    }
    
    for (const dep of dependencies) {
        graph.addEdge(dep.from, dep.to);
    }
    
    return graph.containsCycle();
}
