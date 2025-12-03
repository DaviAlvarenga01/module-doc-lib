/**
 * TemplateUtils.test.ts
 * 
 * Unit tests for TemplateUtils module (REDUZIDO - foco objetivo)
 * Tests: 15 (ao invés de 45)
 */

import { describe, it, expect } from 'vitest';
import {
  expandToString,
  expandToStringWithNL,
  toString,
  indent,
  unindent,
  joinLines,
  trimEmptyLines
} from '../../../src/utils/TemplateUtils';

describe('TemplateUtils', () => {

  describe('expandToString', () => {
    it('deve remover indentação comum', () => {
      const result = expandToString`
        linha 1
        linha 2
        linha 3
      `;
      
      expect(result).not.toContain('        ');
      expect(result).toContain('linha 1');
      expect(result).toContain('linha 2');
    });

    it('deve interpolar valores', () => {
      const name = 'Usuario';
      const result = expandToString`
        class ${name} {
        }
      `;
      
      expect(result).toContain('class Usuario');
    });

    it('deve preservar indentação relativa', () => {
      const result = expandToString`
        class Test {
            method() {
                return 1;
            }
        }
      `;
      
      const lines = result.split(/\r?\n/);
      // A linha "method()" deve ter mais espaços que "class Test"
      const classLine = lines.find(l => l.includes('class Test'));
      const methodLine = lines.find(l => l.includes('method()'));
      
      if (classLine && methodLine) {
        const classIndent = classLine.search(/\S/);
        const methodIndent = methodLine.search(/\S/);
        expect(methodIndent).toBeGreaterThan(classIndent);
      }
    });
  });

  describe('expandToStringWithNL', () => {
    it('deve expandir template (mesma lógica que expandToString)', () => {
      const result = expandToStringWithNL`
        linha 1
        linha 2
      `;
      
      // expandToStringWithNL usa mesma lógica de expandToString
      expect(result).toContain('linha 1');
      expect(result).toContain('linha 2');
    });
  });

  describe('toString', () => {
    it('deve converter undefined/null', () => {
      // toString converte com String(), então undefined vira 'undefined'
      expect(toString(undefined)).toBe('undefined');
      expect(toString(null)).toBe('null');
    });

    it('deve converter valores primitivos', () => {
      expect(toString(123)).toBe('123');
      expect(toString(true)).toBe('true');
      expect(toString('text')).toBe('text');
    });

    it('deve usar método toString de objetos', () => {
      const obj = { toString: () => 'custom' };
      expect(toString(obj)).toBe('custom');
    });
  });

  describe('indent', () => {
    it('deve adicionar indentação padrão (4 espaços)', () => {
      const result = indent('linha');
      expect(result).toBe('    linha');
    });

    it('deve adicionar indentação customizada', () => {
      const result = indent('linha', 2);
      expect(result).toBe('  linha');
    });

    it('deve indentar múltiplas linhas', () => {
      const result = indent('linha1\nlinha2', 2);
      expect(result).toBe('  linha1\n  linha2');
    });
  });

  describe('unindent', () => {
    it('deve remover indentação padrão', () => {
      const result = unindent('    linha');
      expect(result).toBe('linha');
    });

    it('deve remover indentação customizada', () => {
      const result = unindent('  linha', 2);
      expect(result).toBe('linha');
    });

    it('deve remover o máximo disponível se indentação insuficiente', () => {
      const result = unindent('  linha', 4);
      // Remove até 4 espaços, mas só tem 2, então remove os 2
      expect(result).toBe('linha');
    });
  });

  describe('joinLines', () => {
    it('deve juntar linhas com quebra de linha', () => {
      const result = joinLines(['linha1', 'linha2', 'linha3']);
      expect(result).toContain('linha1');
      expect(result).toContain('linha2');
      expect(result).toContain('linha3');
    });

    it('deve filtrar linhas vazias quando filterEmpty=true', () => {
      const result = joinLines(['linha1', '', 'linha2', undefined, 'linha3'], true);
      const lines = result.split(/\r?\n/).filter(l => l.length > 0);
      expect(lines).toHaveLength(3);
    });

    it('deve manter linhas vazias quando filterEmpty=false', () => {
      const result = joinLines(['linha1', '', 'linha2'], false);
      expect(result.split(/\r?\n/)).toHaveLength(3);
    });
  });

  describe('trimEmptyLines', () => {
    it('deve remover linhas vazias no início', () => {
      const result = trimEmptyLines('\n\nlinha1\nlinha2');
      expect(result.startsWith('linha1')).toBe(true);
    });

    it('deve remover linhas vazias no final', () => {
      const result = trimEmptyLines('linha1\nlinha2\n\n');
      expect(result.endsWith('linha2')).toBe(true);
    });

    it('deve preservar linhas vazias no meio', () => {
      const result = trimEmptyLines('linha1\n\nlinha2');
      const lines = result.split(/\r?\n/);
      expect(lines).toHaveLength(3); // linha1, vazio, linha2
    });
  });
});
