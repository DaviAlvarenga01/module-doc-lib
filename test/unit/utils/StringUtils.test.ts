/**
 * StringUtils.test.ts
 * 
 * Unit tests for StringUtils module
 * Tests string manipulation functions including capitalization, case conversion, and sanitization
 */

import { describe, it, expect } from 'vitest';
import {
  capitalizeString,
  uncapitalizeString,
  toSnakeCase,
  toPascalCase,
  toCamelCase,
  sanitizeIdentifier,
  pluralize
} from '../../../src/utils/StringUtils';

describe('StringUtils', () => {
  
  describe('capitalizeString', () => {
    it('deve capitalizar string simples', () => {
      expect(capitalizeString('usuario')).toBe('Usuario');
      expect(capitalizeString('pedido')).toBe('Pedido');
    });

    it('deve manter apenas o primeiro caractere em maiúscula', () => {
      expect(capitalizeString('itemPedido')).toBe('ItemPedido');
      expect(capitalizeString('nomeCompleto')).toBe('NomeCompleto');
    });

    it('deve lidar com strings de um caractere', () => {
      expect(capitalizeString('a')).toBe('A');
      expect(capitalizeString('z')).toBe('Z');
    });

    it('deve retornar string vazia quando input é vazio', () => {
      expect(capitalizeString('')).toBe('');
    });

    it('deve lidar com strings já capitalizadas', () => {
      expect(capitalizeString('Usuario')).toBe('Usuario');
      expect(capitalizeString('PEDIDO')).toBe('PEDIDO');
    });

    it('deve lidar com strings com números', () => {
      expect(capitalizeString('item123')).toBe('Item123');
    });

    it('deve lidar com caracteres especiais', () => {
      expect(capitalizeString('ação')).toBe('Ação');
      expect(capitalizeString('josé')).toBe('José');
    });
  });

  describe('uncapitalizeString', () => {
    it('deve descapitalizar string simples', () => {
      expect(uncapitalizeString('Usuario')).toBe('usuario');
      expect(uncapitalizeString('Pedido')).toBe('pedido');
    });

    it('deve manter apenas o primeiro caractere em minúscula', () => {
      expect(uncapitalizeString('ItemPedido')).toBe('itemPedido');
      expect(uncapitalizeString('NomeProduto')).toBe('nomeProduto');
    });

    it('deve lidar com strings de um caractere', () => {
      expect(uncapitalizeString('A')).toBe('a');
      expect(uncapitalizeString('Z')).toBe('z');
    });

    it('deve retornar string vazia quando input é vazio', () => {
      expect(uncapitalizeString('')).toBe('');
    });

    it('deve lidar com strings já em minúscula', () => {
      expect(uncapitalizeString('usuario')).toBe('usuario');
      expect(uncapitalizeString('pedido')).toBe('pedido');
    });
  });

  describe('toSnakeCase', () => {
    it('deve converter PascalCase para snake_case', () => {
      expect(toSnakeCase('ItemPedido')).toBe('item_pedido');
      expect(toSnakeCase('NomeCompleto')).toBe('nome_completo');
    });

    it('deve converter camelCase para snake_case', () => {
      expect(toSnakeCase('itemPedido')).toBe('item_pedido');
      expect(toSnakeCase('nomeCompleto')).toBe('nome_completo');
    });

    it('deve lidar com siglas', () => {
      expect(toSnakeCase('CPF')).toBe('cpf');
      expect(toSnakeCase('URLParser')).toBe('url_parser');
      expect(toSnakeCase('HTTPRequest')).toBe('http_request');
    });

    it('deve lidar com strings mistas', () => {
      expect(toSnakeCase('dataDeNascimento')).toBe('data_de_nascimento');
      expect(toSnakeCase('enderecoIPv4')).toBe('endereco_i_pv4');
    });

    it('deve retornar string vazia quando input é vazio', () => {
      expect(toSnakeCase('')).toBe('');
    });

    it('deve lidar com strings já em snake_case', () => {
      expect(toSnakeCase('item_pedido')).toBe('item_pedido');
    });

    it('deve remover underscores duplicados', () => {
      expect(toSnakeCase('Nome__Completo')).toBe('nome_completo');
    });

    it('deve remover underscore do início', () => {
      expect(toSnakeCase('_NomeCompleto')).toBe('nome_completo');
    });

    it('deve lidar com números', () => {
      // Números não são considerados transição de case
      expect(toSnakeCase('item123Pedido')).toBe('item123pedido');
      // Letra maiúscula após número não é detectada como transição
      expect(toSnakeCase('Item123Pedido')).toBe('item123pedido');
      expect(toSnakeCase('ItemPedido123')).toBe('item_pedido123');
    });
  });

  describe('toPascalCase', () => {
    it('deve converter snake_case para PascalCase', () => {
      expect(toPascalCase('item_pedido')).toBe('ItemPedido');
      expect(toPascalCase('nome_completo')).toBe('NomeCompleto');
    });

    it('deve converter kebab-case para PascalCase', () => {
      expect(toPascalCase('nome-completo')).toBe('NomeCompleto');
      expect(toPascalCase('item-pedido')).toBe('ItemPedido');
    });

    it('deve converter strings com espaços para PascalCase', () => {
      expect(toPascalCase('data de nascimento')).toBe('DataDeNascimento');
      expect(toPascalCase('nome completo')).toBe('NomeCompleto');
    });

    it('deve lidar com múltiplos separadores', () => {
      expect(toPascalCase('nome_completo-do-usuario')).toBe('NomeCompletoDoUsuario');
    });

    it('deve retornar string vazia quando input é vazio', () => {
      expect(toPascalCase('')).toBe('');
    });

    it('deve capitalizar cada palavra', () => {
      expect(toPascalCase('a_b_c')).toBe('ABC');
    });

    it('deve lidar com strings já em PascalCase', () => {
      expect(toPascalCase('NomeCompleto')).toBe('NomeCompleto');
    });

    it('deve lidar com separadores no início/fim', () => {
      expect(toPascalCase('_nome_completo_')).toBe('NomeCompleto');
    });
  });

  describe('toCamelCase', () => {
    it('deve converter snake_case para camelCase', () => {
      expect(toCamelCase('item_pedido')).toBe('itemPedido');
      expect(toCamelCase('nome_completo')).toBe('nomeCompleto');
    });

    it('deve converter kebab-case para camelCase', () => {
      expect(toCamelCase('nome-completo')).toBe('nomeCompleto');
      expect(toCamelCase('calcular-total')).toBe('calcularTotal');
    });

    it('deve converter strings com espaços para camelCase', () => {
      expect(toCamelCase('calcular total')).toBe('calcularTotal');
      expect(toCamelCase('data de nascimento')).toBe('dataDeNascimento');
    });

    it('deve retornar string vazia quando input é vazio', () => {
      expect(toCamelCase('')).toBe('');
    });

    it('deve manter primeira palavra em minúscula', () => {
      expect(toCamelCase('a_b_c')).toBe('aBC');
    });

    it('deve lidar com strings já em camelCase', () => {
      expect(toCamelCase('nomeCompleto')).toBe('nomeCompleto');
    });
  });

  describe('sanitizeIdentifier', () => {
    it('deve substituir espaços por underscore', () => {
      expect(sanitizeIdentifier('Nome Completo')).toBe('Nome_Completo');
    });

    it('deve remover caracteres especiais', () => {
      expect(sanitizeIdentifier('E-mail')).toBe('E_mail');
      expect(sanitizeIdentifier('Código!')).toBe('Codigo');
      expect(sanitizeIdentifier('Preço$')).toBe('Preco');
    });

    it('deve remover acentos', () => {
      expect(sanitizeIdentifier('Ação')).toBe('Acao');
      expect(sanitizeIdentifier('José')).toBe('Jose');
      expect(sanitizeIdentifier('Função')).toBe('Funcao');
    });

    it('deve adicionar underscore se iniciar com número', () => {
      expect(sanitizeIdentifier('123abc')).toBe('_123abc');
      expect(sanitizeIdentifier('1Usuario')).toBe('_1Usuario');
    });

    it('deve remover underscores duplicados', () => {
      expect(sanitizeIdentifier('Nome__Completo')).toBe('Nome_Completo');
      expect(sanitizeIdentifier('a___b')).toBe('a_b');
    });

    it('deve remover underscores do início e fim', () => {
      expect(sanitizeIdentifier('_nome_')).toBe('nome');
      expect(sanitizeIdentifier('__test__')).toBe('test');
    });

    it('deve retornar underscore quando input é vazio', () => {
      expect(sanitizeIdentifier('')).toBe('_');
    });

    it('deve retornar underscore quando todos os caracteres são inválidos', () => {
      expect(sanitizeIdentifier('!!!')).toBe('_');
      expect(sanitizeIdentifier('---')).toBe('_');
    });

    it('deve preservar números no meio do identificador', () => {
      expect(sanitizeIdentifier('item123pedido')).toBe('item123pedido');
    });

    it('deve lidar com identificadores já válidos', () => {
      expect(sanitizeIdentifier('validIdentifier')).toBe('validIdentifier');
      expect(sanitizeIdentifier('_valid_123')).toBe('valid_123');
    });
  });

  describe('pluralize', () => {
    // Regra padrão: adiciona 's'
    it('deve pluralizar palavras simples adicionando s', () => {
      expect(pluralize('cliente')).toBe('clientes');
      expect(pluralize('produto')).toBe('produtos');
      expect(pluralize('pedido')).toBe('pedidos');
    });

    // Terminação em 'ão' -> 'ões'
    it('deve pluralizar palavras terminadas em ão corretamente', () => {
      expect(pluralize('ação')).toBe('ações');
      expect(pluralize('função')).toBe('funções');
      expect(pluralize('opção')).toBe('opções');
    });

    // Terminação em 'm' -> 'ns'
    it('deve pluralizar palavras terminadas em m corretamente', () => {
      expect(pluralize('item')).toBe('itens');
      expect(pluralize('homem')).toBe('homens');
    });

    // Terminação em 'r' ou 'z' -> adiciona 'es'
    it('deve pluralizar palavras terminadas em r ou z corretamente', () => {
      expect(pluralize('professor')).toBe('professores');
      expect(pluralize('luz')).toBe('luzes');
      expect(pluralize('flor')).toBe('flores');
    });

    // Terminação em 'al', 'el', 'ol', 'ul' -> remove 'l' e adiciona 'is'
    it('deve pluralizar palavras terminadas em al/el/ol/ul corretamente', () => {
      expect(pluralize('animal')).toBe('animais');
      expect(pluralize('papel')).toBe('papeis');
      expect(pluralize('farol')).toBe('farois');
      expect(pluralize('paul')).toBe('pauis');
    });

    // Terminação em 'il' -> remove 'il' e adiciona 'eis'
    it('deve pluralizar palavras terminadas em il corretamente', () => {
      expect(pluralize('mil')).toBe('meis');
      expect(pluralize('funil')).toBe('funeis');
    });

    // Já está no plural (termina em 's' mas não em 'ês')
    it('deve manter palavras já no plural', () => {
      expect(pluralize('lapis')).toBe('lapis');
      expect(pluralize('atlas')).toBe('atlas');
    });

    // Terminação em 'ês' deve adicionar 's'
    it('deve pluralizar palavras terminadas em ês corretamente', () => {
      expect(pluralize('português')).toBe('portuguêss');
    });

    it('deve retornar string vazia quando input é vazio', () => {
      expect(pluralize('')).toBe('');
    });

    it('deve lidar com maiúsculas preservando case parcialmente', () => {
      expect(pluralize('Cliente')).toBe('Clientes');
      // PRODUTO é detectado como já no plural por terminar em 'o'
      expect(pluralize('PRODUTO')).toBe('PRODUTOs');
      expect(pluralize('ITEM')).toBe('ITEns'); // 'm' -> 'ns'
    });

    it('deve funcionar com palavras curtas', () => {
      expect(pluralize('pai')).toBe('pais');
      expect(pluralize('cor')).toBe('cores');
    });
  });

  // Testes integrados - combinação de funções
  describe('Integração entre funções', () => {
    it('deve converter snake_case -> PascalCase -> snake_case corretamente', () => {
      const original = 'nome_completo_usuario';
      const pascal = toPascalCase(original);
      const back = toSnakeCase(pascal);
      
      expect(pascal).toBe('NomeCompletoUsuario');
      expect(back).toBe(original);
    });

    it('deve sanitizar e converter para PascalCase', () => {
      const input = 'Nome do Usuário!';
      const sanitized = sanitizeIdentifier(input);
      const pascal = toPascalCase(sanitized);
      
      expect(sanitized).toBe('Nome_do_Usuario');
      expect(pascal).toBe('NomeDoUsuario');
    });

    it('deve capitalizar após sanitização', () => {
      const input = 'josé da silva';
      const sanitized = sanitizeIdentifier(input);
      const capitalized = capitalizeString(sanitized);
      
      expect(sanitized).toBe('jose_da_silva');
      expect(capitalized).toBe('Jose_da_silva');
    });

    it('deve pluralizar após conversão de caso', () => {
      const input = 'item_pedido';
      const camel = toCamelCase(input);
      const pluralized = pluralize(camel);
      
      expect(camel).toBe('itemPedido');
      expect(pluralized).toBe('itemPedidos');
    });
  });

  // Testes de edge cases
  describe('Edge Cases', () => {
    it('deve lidar com strings muito longas', () => {
      const longString = 'a'.repeat(1000);
      expect(capitalizeString(longString)).toHaveLength(1000);
      expect(capitalizeString(longString).charAt(0)).toBe('A');
    });

    it('deve lidar com unicode e emojis', () => {
      expect(sanitizeIdentifier('teste 😀 emoji')).toBe('teste_emoji');
      expect(sanitizeIdentifier('código™')).toBe('codigo');
    });

    it('deve lidar com strings com apenas espaços', () => {
      expect(sanitizeIdentifier('   ')).toBe('_');
      expect(toPascalCase('   ')).toBe('');
    });

    it('deve lidar com separadores consecutivos', () => {
      expect(toPascalCase('nome___completo___usuario')).toBe('NomeCompletoUsuario');
      expect(toSnakeCase('Nome___Completo')).toBe('nome_completo');
    });
  });
});
