/**
 * TemplateUtils.ts
 * 
 * Título: Utilitários para Processamento de Templates
 * 
 * Descrição:
 * Fornece funções para manipulação de template strings, incluindo remoção
 * automática de indentação, normalização de quebras de linha e formatação
 * de código gerado. Essencial para geradores de código que produzem saída
 * bem formatada e legível.
 * 
 * Processos:
 * 1. Template tag para expansão de template literals
 * 2. Remoção automática de indentação comum
 * 3. Normalização de quebras de linha (EOL)
 * 4. Interpolação segura de expressões
 * 5. Formatação de blocos de código multi-linha
 * 
 * Conformidade:
 * - ISO/IEC 25010: Manutenibilidade através de código bem formatado
 * - KISS Methodology: API simples com template literals
 * 
 * @module utils/TemplateUtils
 * @author module-doc-lib
 * @version 1.0.0
 */

import * as os from 'os';

/**
 * expandToString
 * 
 * Título: Template Tag para Expansão e Alinhamento
 * 
 * Descrição:
 * Template literal tag que expande expressões interpoladas e remove
 * automaticamente a indentação comum de todas as linhas, produzindo
 * código limpo e bem alinhado. Utiliza o separador de linha da plataforma
 * (EOL) para máxima compatibilidade.
 * 
 * Processos:
 * 1. Interpola todas as expressões ${...} na string
 * 2. Divide string em linhas
 * 3. Remove linhas vazias no início e fim
 * 4. Calcula a menor indentação comum
 * 5. Remove essa indentação de todas as linhas
 * 6. Junta linhas usando EOL da plataforma (os.EOL)
 * 7. Retorna string formatada
 * 
 * Comportamento:
 * - Preserva indentação relativa entre linhas
 * - Remove espaços/tabs no início comuns a todas as linhas
 * - Suporta indentação mista (espaços e tabs)
 * - Usa \n no Unix/Linux/macOS, \r\n no Windows
 * 
 * Casos de uso:
 * - Geração de código-fonte formatado
 * - Templates de arquivos (classes, interfaces, configs)
 * - Documentação gerada
 * - Scripts e comandos multi-linha
 * 
 * Vantagens:
 * - Código template pode ser indentado naturalmente no fonte
 * - Resultado final tem indentação correta
 * - Multiplataforma (respeita EOL do SO)
 * - Type-safe com TypeScript
 * 
 * 
 * @param strings - Array de strings literais do template
 * @param values - Array de valores interpolados
 * @returns String expandida e alinhada
 * 
 * @example
 * ```typescript
 * const className = 'Usuario';
 * const attributes = ['nome', 'email'];
 * 
 * const code = expandToString`
 *     public class ${className} {
 *         ${attributes.map(attr => `private String ${attr};`).join('\n')}
 *         
 *         public ${className}() {
 *         }
 *     }
 * `;
 * 
 * // Resultado (sem indentação extra):
 * // public class Usuario {
 * //     private String nome;
 * //     private String email;
 * //     
 * //     public Usuario() {
 * //     }
 * // }
 * ```
 * 
 * @example
 * ```typescript
 * // Template para função TypeScript
 * function generateFunction(name: string, params: string[], returnType: string) {
 *     return expandToString`
 *         function ${name}(${params.join(', ')}): ${returnType} {
 *             // TODO: Implementar
 *             return null;
 *         }
 *     `;
 * }
 * 
 * const func = generateFunction('calcular', ['a: number', 'b: number'], 'number');
 * // function calcular(a: number, b: number): number {
 * //     // TODO: Implementar
 * //     return null;
 * // }
 * ```
 */
export function expandToString(
    strings: TemplateStringsArray,
    ...values: any[]
): string {
    // 1. Interpola as expressões
    let raw = strings.raw.reduce((acc, str, i) => {
        return acc + str + (i < values.length ? values[i] : '');
    }, '');

    // 2. Divide em linhas
    const lines = raw.split(/\r?\n/);

    // 3. Remove linhas vazias no início e fim
    const trimmedLines = lines.slice(
        lines.findIndex(line => line.trim() !== ''),
        lines.length - [...lines].reverse().findIndex(line => line.trim() !== '')
    );

    // 4. Descobre a menor indentação em espaços/tabs nas linhas não vazias
    const indentLengths = trimmedLines
        .filter(line => line.trim() !== '')
        .map(line => RegExp(/^\s*/).exec(line)?.[0].length ?? 0);

    const minIndent = indentLengths.length > 0 ? Math.min(...indentLengths) : 0;

    // 5. Remove a indentação comum e junta usando EOL da plataforma
    const aligned = trimmedLines
        .map(line => line.slice(minIndent))
        .join(os.EOL);

    return aligned;
}

/**
 * expandToStringWithNL
 * 
 * Título: Expansão com Normalização de Linhas
 * 
 * Descrição:
 * Variante de expandToString que também remove quebras de linha duplicadas,
 * útil quando expressões interpoladas podem adicionar linhas vazias extras.
 * 
 * Processos:
 * 1. Chama expandToString para alinhamento básico
 * 2. Substitui sequências de 2+ quebras de linha por 1 quebra
 * 3. Retorna string normalizada
 * 
 * Casos de uso:
 * - Templates com múltiplas interpolações
 * - Geração de código onde expressões podem estar vazias
 * - Limpeza de espaçamento excessivo
 * 
 * @param strings - Array de strings literais
 * @param values - Array de valores interpolados
 * @returns String expandida e com linhas normalizadas
 * 
 * @example
 * ```typescript
 * const imports = [];  // Pode estar vazio
 * 
 * const code = expandToStringWithNL`
 *     ${imports.join('\n')}
 *     
 *     export class MyClass {
 *     }
 * `;
 * 
 * // Se imports vazio, não haverá linhas vazias extras no início
 * ```
 */
export function expandToStringWithNL(
    strings: TemplateStringsArray,
    ...values: any[]
): string {
    return expandToString(strings, ...values).replace(/\n{2,}/g, '\n');
}

/**
 * toString
 * 
 * Título: Conversão Segura para String
 * 
 * Descrição:
 * Converte qualquer valor para string de forma segura, tratando
 * valores undefined, null e objetos com método toString().
 * 
 * Processos:
 * 1. Se já é string, retorna direto
 * 2. Se tem método toString(), chama
 * 3. Caso contrário, usa String()
 * 
 * Casos de uso:
 * - Interpolação segura em templates
 * - Conversão de valores desconhecidos
 * - Formatação de output
 * 
 * @param val - Valor a ser convertido
 * @returns Representação em string
 * 
 * @example
 * ```typescript
 * toString('text')        // 'text'
 * toString(42)            // '42'
 * toString(null)          // 'null'
 * toString(undefined)     // 'undefined'
 * toString({ name: 'x' }) // '[object Object]'
 * ```
 */
export function toString(val: any): string {
    if (typeof val === 'string') return val;
    if (val && typeof val.toString === 'function') return val.toString();
    return String(val);
}

/**
 * indent
 * 
 * Título: Adicionar Indentação
 * 
 * Descrição:
 * Adiciona um nível específico de indentação a cada linha de uma string.
 * 
 * Processos:
 * 1. Divide string em linhas
 * 2. Adiciona indentação especificada em cada linha não vazia
 * 3. Junta linhas novamente
 * 
 * Casos de uso:
 * - Indentação de blocos de código
 * - Formatação de código aninhado
 * - Geração de estruturas hierárquicas
 * 
 * @param text - Texto a ser indentado
 * @param level - Número de espaços de indentação (padrão: 4)
 * @returns Texto indentado
 * 
 * @example
 * ```typescript
 * const method = 'public void test() {\n    doSomething();\n}';
 * const indented = indent(method, 4);
 * //     public void test() {
 * //         doSomething();
 * //     }
 * ```
 */
export function indent(text: string, level: number = 4): string {
    const spaces = ' '.repeat(level);
    return text
        .split('\n')
        .map(line => line.trim() !== '' ? spaces + line : line)
        .join('\n');
}

/**
 * unindent
 * 
 * Título: Remover Indentação
 * 
 * Descrição:
 * Remove um nível específico de indentação de cada linha.
 * 
 * Processos:
 * 1. Divide string em linhas
 * 2. Remove número especificado de espaços do início de cada linha
 * 3. Junta linhas novamente
 * 
 * @param text - Texto a ser desindentado
 * @param level - Número de espaços a remover (padrão: 4)
 * @returns Texto desindentado
 * 
 * @example
 * ```typescript
 * const indented = '    line1\n    line2';
 * const plain = unindent(indented, 4);
 * // 'line1\nline2'
 * ```
 */
export function unindent(text: string, level: number = 4): string {
    return text
        .split('\n')
        .map(line => {
            // Remove até 'level' espaços do início
            let count = 0;
            let i = 0;
            while (i < line.length && line[i] === ' ' && count < level) {
                i++;
                count++;
            }
            return line.slice(i);
        })
        .join('\n');
}

/**
 * joinLines
 * 
 * Título: Juntar Linhas com Separador
 * 
 * Descrição:
 * Junta um array de strings adicionando quebra de linha entre elas.
 * Filtra linhas vazias ou undefined se especificado.
 * 
 * Processos:
 * 1. Opcionalmente filtra linhas vazias
 * 2. Junta com EOL da plataforma
 * 3. Retorna string resultante
 * 
 * @param lines - Array de linhas
 * @param filterEmpty - Se true, remove linhas vazias (padrão: false)
 * @returns String com linhas unidas
 * 
 * @example
 * ```typescript
 * joinLines(['line1', '', 'line2'], false)
 * // 'line1\n\nline2'
 * 
 * joinLines(['line1', '', 'line2'], true)
 * // 'line1\nline2'
 * ```
 */
export function joinLines(lines: (string | undefined)[], filterEmpty: boolean = false): string {
    let validLines = lines.filter(line => line !== undefined) as string[];
    
    if (filterEmpty) {
        validLines = validLines.filter(line => line.trim() !== '');
    }
    
    return validLines.join(os.EOL);
}

/**
 * trimEmptyLines
 * 
 * Título: Remover Linhas Vazias do Início e Fim
 * 
 * Descrição:
 * Remove linhas vazias ou apenas com whitespace do início e fim de uma string,
 * mantendo linhas vazias no meio.
 * 
 * Processos:
 * 1. Divide em linhas
 * 2. Remove linhas vazias do início
 * 3. Remove linhas vazias do fim
 * 4. Junta linhas novamente
 * 
 * @param text - Texto a ser processado
 * @returns Texto sem linhas vazias nas pontas
 * 
 * @example
 * ```typescript
 * const text = '\n\n  code line  \n\n';
 * trimEmptyLines(text)  // '  code line  '
 * ```
 */
export function trimEmptyLines(text: string): string {
    const lines = text.split('\n');
    
    // Remove do início
    while (lines.length > 0 && lines[0].trim() === '') {
        lines.shift();
    }
    
    // Remove do fim
    while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
        lines.pop();
    }
    
    return lines.join('\n');
}

/**
 * CompositeGeneratorNode
 * 
 * Título: Nó Gerador Composto
 * 
 * Descrição:
 * Classe auxiliar para construção incremental de strings, similar a StringBuilder.
 * Permite adicionar conteúdo gradualmente e converter para string ao final.
 * 
 * Processos:
 * 1. Mantém array interno de strings
 * 2. append() adiciona conteúdo
 * 3. appendNewLine() adiciona quebra de linha
 * 4. toString() junta tudo
 * 
 * Casos de uso:
 * - Geração incremental de código
 * - Construção de arquivos grandes
 * - Acumulação de output de geradores
 * 
 * Conformidade ISO/IEC 25010:
 * - Eficiência: Melhor que concatenação repetida de strings
 * 
 * @class
 * 
 * @example
 * ```typescript
 * const gen = new CompositeGeneratorNode();
 * gen.append('public class MyClass {');
 * gen.appendNewLine();
 * gen.append('    private int value;');
 * gen.appendNewLine();
 * gen.append('}');
 * 
 * const code = gen.toString();
 * ```
 */
export class CompositeGeneratorNode {
    /**
     * Array interno de conteúdo acumulado
     */
    private content: string[] = [];
    
    /**
     * Adiciona string ao conteúdo
     * 
     * @param str - String a ser adicionada
     */
    append(str: string): void {
        this.content.push(str);
    }
    
    /**
     * Adiciona quebra de linha
     */
    appendNewLine(): void {
        this.content.push(os.EOL);
    }
    
    /**
     * Converte conteúdo acumulado em string
     * 
     * @returns String com todo o conteúdo
     */
    toString(): string {
        return this.content.join('');
    }
    
    /**
     * Limpa todo o conteúdo
     */
    clear(): void {
        this.content = [];
    }
}

/**
 * Generated
 * 
 * Título: Tipo Alias para String Gerada
 * 
 * Descrição:
 * Type alias para string, usado para documentar que uma string
 * foi gerada (ao invés de ser uma string literal).
 * 
 * @type
 */
export type Generated = string;
