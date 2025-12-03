/**
 * GraphUtils.test.ts
 * 
 * Unit tests for GraphUtils module
 * Tests graph algorithms including topological sort and cycle detection
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  Graph,
  topologicalSort,
  detectCycle,
  type Dependency,
  type Node
} from '../../../src/utils/GraphUtils';

describe('GraphUtils', () => {
  
  describe('Graph - Construção básica', () => {
    let graph: Graph;

    beforeEach(() => {
      graph = new Graph();
    });

    it('deve criar grafo vazio', () => {
      expect(graph).toBeDefined();
      expect(graph.topologicalSort()).toEqual([]);
    });

    it('deve adicionar vértice único', () => {
      graph.addVertex('A', 'Vértice A', []);
      const sorted = graph.topologicalSort();
      
      expect(sorted).toEqual(['A']);
    });

    it('deve adicionar múltiplos vértices', () => {
      graph.addVertex('A', 'Vértice A', []);
      graph.addVertex('B', 'Vértice B', []);
      graph.addVertex('C', 'Vértice C', []);
      
      const sorted = graph.topologicalSort();
      expect(sorted).toHaveLength(3);
      expect(sorted).toContain('A');
      expect(sorted).toContain('B');
      expect(sorted).toContain('C');
    });

    it('não deve adicionar vértice duplicado', () => {
      graph.addVertex('A', 'Vértice A', ['Actor1']);
      graph.addVertex('A', 'Vértice A (duplicado)', ['Actor2']);
      
      const sorted = graph.topologicalSort();
      expect(sorted).toEqual(['A']);
    });
  });

  describe('Graph - Adição de arestas', () => {
    let graph: Graph;

    beforeEach(() => {
      graph = new Graph();
      graph.addVertex('A', 'Vértice A', []);
      graph.addVertex('B', 'Vértice B', []);
      graph.addVertex('C', 'Vértice C', []);
    });

    it('deve adicionar aresta válida', () => {
      expect(() => graph.addEdge('A', 'B')).not.toThrow();
    });

    it('deve lançar erro se vértice origem não existir', () => {
      expect(() => graph.addEdge('D', 'A')).toThrow('Vertex D does not exist');
    });

    it('deve lançar erro se vértice destino não existir', () => {
      expect(() => graph.addEdge('A', 'D')).toThrow('Vertex D does not exist');
    });

    it('deve adicionar múltiplas arestas', () => {
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
      graph.addEdge('A', 'C');
      
      expect(() => graph.topologicalSort()).not.toThrow();
    });
  });

  describe('Graph - Ordenação Topológica (Casos Simples)', () => {
    let graph: Graph;

    beforeEach(() => {
      graph = new Graph();
    });

    it('deve ordenar grafo linear (A -> B -> C)', () => {
      graph.addVertex('A', 'A', []);
      graph.addVertex('B', 'B', []);
      graph.addVertex('C', 'C', []);
      
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
      
      const sorted = graph.topologicalSort();
      expect(sorted).toEqual(['C', 'B', 'A']);
    });

    it('deve ordenar grafo em V (A -> B <- C)', () => {
      graph.addVertex('A', 'A', []);
      graph.addVertex('B', 'B', []);
      graph.addVertex('C', 'C', []);
      
      graph.addEdge('A', 'B');
      graph.addEdge('C', 'B');
      
      const sorted = graph.topologicalSort();
      expect(sorted).toHaveLength(3);
      expect(sorted![0]).toBe('B'); // B não tem dependências
      expect(sorted).toContain('A');
      expect(sorted).toContain('C');
    });

    it('deve ordenar grafo em diamante', () => {
      // A -> B -> D
      // A -> C -> D
      graph.addVertex('A', 'A', []);
      graph.addVertex('B', 'B', []);
      graph.addVertex('C', 'C', []);
      graph.addVertex('D', 'D', []);
      
      graph.addEdge('A', 'B');
      graph.addEdge('A', 'C');
      graph.addEdge('B', 'D');
      graph.addEdge('C', 'D');
      
      const sorted = graph.topologicalSort();
      expect(sorted).toHaveLength(4);
      
      // D deve estar primeiro (sem dependências)
      expect(sorted![0]).toBe('D');
      
      // A deve estar por último (depende de B e C)
      expect(sorted![3]).toBe('A');
    });
  });

  describe('Graph - Ordenação Topológica (Casos Complexos)', () => {
    it('deve ordenar dependências de entidades (E-commerce)', () => {
      const graph = new Graph();
      
      // Entidades sem dependências
      graph.addVertex('Customer', 'Cliente', []);
      graph.addVertex('Product', 'Produto', []);
      graph.addVertex('Category', 'Categoria', []);
      
      // Entidades com dependências
      graph.addVertex('Order', 'Pedido', []);
      graph.addVertex('OrderItem', 'Item do Pedido', []);
      
      // Order depende de Customer
      graph.addEdge('Order', 'Customer');
      
      // OrderItem depende de Order e Product
      graph.addEdge('OrderItem', 'Order');
      graph.addEdge('OrderItem', 'Product');
      
      // Product depende de Category
      graph.addEdge('Product', 'Category');
      
      const sorted = graph.topologicalSort();
      expect(sorted).toHaveLength(5);
      
      // Entidades sem dependências devem vir primeiro
      const customerIdx = sorted!.indexOf('Customer');
      const categoryIdx = sorted!.indexOf('Category');
      const productIdx = sorted!.indexOf('Product');
      const orderIdx = sorted!.indexOf('Order');
      const orderItemIdx = sorted!.indexOf('OrderItem');
      
      // Category antes de Product
      expect(categoryIdx).toBeLessThan(productIdx);
      
      // Customer antes de Order
      expect(customerIdx).toBeLessThan(orderIdx);
      
      // Product e Order antes de OrderItem
      expect(productIdx).toBeLessThan(orderItemIdx);
      expect(orderIdx).toBeLessThan(orderItemIdx);
    });

    it('deve lidar com grafo com múltiplas componentes desconectadas', () => {
      const graph = new Graph();
      
      // Componente 1: A -> B
      graph.addVertex('A', 'A', []);
      graph.addVertex('B', 'B', []);
      graph.addEdge('A', 'B');
      
      // Componente 2: C -> D
      graph.addVertex('C', 'C', []);
      graph.addVertex('D', 'D', []);
      graph.addEdge('C', 'D');
      
      // Vértice isolado
      graph.addVertex('E', 'E', []);
      
      const sorted = graph.topologicalSort();
      expect(sorted).toHaveLength(5);
      expect(sorted).toContain('A');
      expect(sorted).toContain('B');
      expect(sorted).toContain('C');
      expect(sorted).toContain('D');
      expect(sorted).toContain('E');
    });
  });

  describe('Graph - Detecção de Ciclos', () => {
    let graph: Graph;

    beforeEach(() => {
      graph = new Graph();
    });

    it('não deve detectar ciclo em grafo acíclico', () => {
      graph.addVertex('A', 'A', []);
      graph.addVertex('B', 'B', []);
      graph.addVertex('C', 'C', []);
      
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
      
      const cycle = graph.containsCycle();
      expect(cycle).toBeNull();
    });

    it('deve detectar ciclo simples (A -> B -> A)', () => {
      graph.addVertex('A', 'A', []);
      graph.addVertex('B', 'B', []);
      
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'A');
      
      const cycle = graph.containsCycle();
      expect(cycle).not.toBeNull();
      expect(cycle).toContain('Cycle detected');
      expect(cycle).toContain('A');
      expect(cycle).toContain('B');
    });

    it('deve detectar ciclo de 3 nós (A -> B -> C -> A)', () => {
      graph.addVertex('A', 'A', []);
      graph.addVertex('B', 'B', []);
      graph.addVertex('C', 'C', []);
      
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'C');
      graph.addEdge('C', 'A');
      
      const cycle = graph.containsCycle();
      expect(cycle).not.toBeNull();
      expect(cycle).toContain('Cycle detected');
    });

    it('deve detectar self-loop (A -> A)', () => {
      graph.addVertex('A', 'A', []);
      graph.addEdge('A', 'A');
      
      const cycle = graph.containsCycle();
      expect(cycle).not.toBeNull();
    });

    it('deve retornar null em ordenação topológica quando há ciclo', () => {
      graph.addVertex('A', 'A', []);
      graph.addVertex('B', 'B', []);
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'A');
      
      const sorted = graph.topologicalSort();
      expect(sorted).toBeNull();
    });
  });

  describe('Graph - Geração de Diagramas', () => {
    let graph: Graph;

    beforeEach(() => {
      graph = new Graph();
    });

    it('deve gerar diagrama Mermaid para grafo acíclico', () => {
      graph.addVertex('A', 'A', []);
      graph.addVertex('B', 'B', []);
      graph.addEdge('A', 'B');
      
      const diagram = graph.generateMermaidDiagram();
      expect(diagram).toContain('graph TD');
      expect(diagram).toContain('B --> A');
    });

    it('deve retornar mensagem de erro para grafo com ciclo', () => {
      graph.addVertex('A', 'A', []);
      graph.addVertex('B', 'B', []);
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'A');
      
      const diagram = graph.generateMermaidDiagram();
      expect(diagram).toBe('Cycle detected. Topological sort not possible.');
    });

    it('deve gerar tabela Markdown para grafo acíclico', () => {
      graph.addVertex('Cliente', 'Entidade Cliente', ['Usuario']);
      graph.addVertex('Pedido', 'Entidade Pedido', ['Usuario']);
      graph.addEdge('Pedido', 'Cliente');
      
      const table = graph.generateMarkdownTable();
      expect(table).toContain('| Item | Descrição | Dependências | Habilitados | Atores |');
      expect(table).toContain('Cliente');
      expect(table).toContain('Pedido');
      expect(table).toContain('Usuario');
    });

    it('deve retornar mensagem de erro na tabela para grafo com ciclo', () => {
      graph.addVertex('A', 'A', []);
      graph.addVertex('B', 'B', []);
      graph.addEdge('A', 'B');
      graph.addEdge('B', 'A');
      
      const table = graph.generateMarkdownTable();
      expect(table).toBe('Cycle detected. Topological sort not possible.');
    });
  });

  describe('Função auxiliar: topologicalSort', () => {
    it('deve ordenar nós sem dependências', () => {
      const nodes: Node[] = [
        { node: 'A', description: 'A', actors: [] },
        { node: 'B', description: 'B', actors: [] },
        { node: 'C', description: 'C', actors: [] }
      ];
      const dependencies: Dependency[] = [];
      
      const sorted = topologicalSort(nodes, dependencies);
      expect(sorted).toHaveLength(3);
    });

    it('deve ordenar nós com dependências lineares', () => {
      const nodes: Node[] = [
        { node: 'A', description: 'A', actors: [] },
        { node: 'B', description: 'B', actors: [] },
        { node: 'C', description: 'C', actors: [] }
      ];
      const dependencies: Dependency[] = [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' }
      ];
      
      const sorted = topologicalSort(nodes, dependencies);
      expect(sorted).toEqual(['C', 'B', 'A']);
    });

    it('deve retornar null quando há ciclo', () => {
      const nodes: Node[] = [
        { node: 'A', description: 'A', actors: [] },
        { node: 'B', description: 'B', actors: [] }
      ];
      const dependencies: Dependency[] = [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'A' }
      ];
      
      const sorted = topologicalSort(nodes, dependencies);
      expect(sorted).toBeNull();
    });
  });

  describe('Função auxiliar: detectCycle', () => {
    it('não deve detectar ciclo em grafo acíclico', () => {
      const nodes: Node[] = [
        { node: 'A', description: 'A', actors: [] },
        { node: 'B', description: 'B', actors: [] }
      ];
      const dependencies: Dependency[] = [
        { from: 'A', to: 'B' }
      ];
      
      const cycle = detectCycle(nodes, dependencies);
      expect(cycle).toBeNull();
    });

    it('deve detectar ciclo simples', () => {
      const nodes: Node[] = [
        { node: 'A', description: 'A', actors: [] },
        { node: 'B', description: 'B', actors: [] }
      ];
      const dependencies: Dependency[] = [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'A' }
      ];
      
      const cycle = detectCycle(nodes, dependencies);
      expect(cycle).not.toBeNull();
      expect(cycle).toContain('Cycle detected');
    });

    it('deve detectar ciclo complexo', () => {
      const nodes: Node[] = [
        { node: 'A', description: 'A', actors: [] },
        { node: 'B', description: 'B', actors: [] },
        { node: 'C', description: 'C', actors: [] }
      ];
      const dependencies: Dependency[] = [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'A' }
      ];
      
      const cycle = detectCycle(nodes, dependencies);
      expect(cycle).not.toBeNull();
    });
  });

  // Casos de uso reais
  describe('Casos de uso - Dependências de Entidades', () => {
    it('deve ordenar entidades para geração de schema SQL', () => {
      const graph = new Graph();
      
      // Hierarquia de herança: Person -> Employee -> Manager
      graph.addVertex('Person', 'Pessoa base', []);
      graph.addVertex('Employee', 'Funcionário', []);
      graph.addVertex('Manager', 'Gerente', []);
      
      graph.addEdge('Employee', 'Person');
      graph.addEdge('Manager', 'Employee');
      
      // Relacionamento: Employee -> Department
      graph.addVertex('Department', 'Departamento', []);
      graph.addEdge('Employee', 'Department');
      
      const sorted = graph.topologicalSort();
      
      const personIdx = sorted!.indexOf('Person');
      const employeeIdx = sorted!.indexOf('Employee');
      const managerIdx = sorted!.indexOf('Manager');
      const departmentIdx = sorted!.indexOf('Department');
      
      // Person deve vir antes de Employee
      expect(personIdx).toBeLessThan(employeeIdx);
      
      // Employee deve vir antes de Manager
      expect(employeeIdx).toBeLessThan(managerIdx);
      
      // Department deve vir antes de Employee
      expect(departmentIdx).toBeLessThan(employeeIdx);
    });

    it('deve detectar herança circular inválida', () => {
      const graph = new Graph();
      
      graph.addVertex('ClassA', 'Classe A', []);
      graph.addVertex('ClassB', 'Classe B', []);
      
      // Herança circular: A extends B, B extends A
      graph.addEdge('ClassA', 'ClassB');
      graph.addEdge('ClassB', 'ClassA');
      
      const cycle = graph.containsCycle();
      expect(cycle).not.toBeNull();
      
      const sorted = graph.topologicalSort();
      expect(sorted).toBeNull();
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('deve lidar com grafo muito grande', () => {
      const graph = new Graph();
      const nodeCount = 1000;
      
      // Criar cadeia linear longa: 0 -> 1 -> 2 -> ... -> 999
      for (let i = 0; i < nodeCount; i++) {
        graph.addVertex(`Node${i}`, `Node ${i}`, []);
      }
      
      for (let i = 0; i < nodeCount - 1; i++) {
        graph.addEdge(`Node${i}`, `Node${i + 1}`);
      }
      
      const sorted = graph.topologicalSort();
      expect(sorted).toHaveLength(nodeCount);
      expect(sorted![0]).toBe(`Node${nodeCount - 1}`);
      expect(sorted![nodeCount - 1]).toBe('Node0');
    });

    it('deve lidar com nomes de vértices com caracteres especiais', () => {
      const graph = new Graph();
      
      graph.addVertex('Entity#1', 'Entidade 1', []);
      graph.addVertex('Entity$2', 'Entidade 2', []);
      graph.addVertex('Entity@3', 'Entidade 3', []);
      
      graph.addEdge('Entity#1', 'Entity$2');
      graph.addEdge('Entity$2', 'Entity@3');
      
      const sorted = graph.topologicalSort();
      expect(sorted).toHaveLength(3);
    });

    it('deve lidar com atores vazios ou nulos', () => {
      const graph = new Graph();
      
      graph.addVertex('A', 'A', []);
      graph.addVertex('B', 'B', ['Actor1', 'Actor2']);
      graph.addVertex('C', 'C', []);
      
      expect(() => graph.topologicalSort()).not.toThrow();
    });

    it('deve lidar com descrições longas', () => {
      const graph = new Graph();
      const longDescription = 'A'.repeat(1000);
      
      graph.addVertex('Node', longDescription, []);
      
      const sorted = graph.topologicalSort();
      expect(sorted).toEqual(['Node']);
    });
  });

  // Performance (comportamento conceitual)
  describe('Performance', () => {
    it('deve processar grafo com muitas arestas eficientemente', () => {
      const graph = new Graph();
      const nodeCount = 100;
      
      // Criar grafo completo (todos conectados a todos)
      for (let i = 0; i < nodeCount; i++) {
        graph.addVertex(`N${i}`, `Node ${i}`, []);
      }
      
      // Criar arestas apenas em uma direção para evitar ciclos
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          graph.addEdge(`N${i}`, `N${j}`);
        }
      }
      
      const sorted = graph.topologicalSort();
      expect(sorted).toHaveLength(nodeCount);
    });
  });
});
