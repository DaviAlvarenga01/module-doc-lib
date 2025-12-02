/**
 * template-string.ts
 * 
 * Utilitários para criar template strings multi-linha com alinhamento
 * automático de indentação. Essencial para geração de código bem formatado.
 * 
 * Processos:
 * - Remove linhas vazias no início e fim
 * - Calcula indentação mínima de linhas não vazias
 * - Remove indentação comum de todas as linhas
 * - Usa EOL específico da plataforma para compatibilidade
 */

import { EOL } from 'os';

/**
 * Template literal tag for automatic string alignment
 * 
 * Automatically removes common indentation from multi-line strings and uses
 * the platform's line separator (EOL).
 * 
 * This function is essential for generating well-formatted code with proper
 * indentation, regardless of how the template literal is indented in the source.
 * 
 * @param {TemplateStringsArray} strings - Template string parts
 * @param {...any[]} values - Interpolated values
 * @returns {string} Aligned string with platform-specific line endings
 * 
 * @example
 * ```typescript
 * const code = expandToString`
 *     function hello() {
 *         console.log('Hello World');
 *     }
 * `
 * // Result: No leading indentation, properly formatted
 * ```
 * 
 * @remarks
 * - Removes empty lines at start and end
 * - Calculates minimum indentation from non-empty lines
 * - Removes that common indentation from all lines
 * - Uses os.EOL for cross-platform compatibility
 */
export function expandToString(
    strings: TemplateStringsArray,
    ...values: any[]
): string {
    // Interpolate expressions into the string
    let raw = strings.raw.reduce((acc, str, i) => {
        return acc + str + (i < values.length ? values[i] : '');
    }, '');

    // Split into lines
    const lines = raw.split(/\r?\n/);

    // Remove empty lines at the beginning and end
    const trimmedLines = lines.slice(
        lines.findIndex(line => line.trim() !== ''),
        lines.length - [...lines].reverse().findIndex(line => line.trim() !== '')
    );

    // Find the minimum indentation length (spaces/tabs) in non-empty lines
    const indentLengths = trimmedLines
        .filter(line => line.trim() !== '')
        .map(line => RegExp(/^\s*/).exec(line)?.[0].length ?? 0);

    const minIndent = indentLengths.length > 0 ? Math.min(...indentLengths) : 0;

    // Remove common indentation and join using platform EOL
    const aligned = trimmedLines
        .map(line => line.slice(minIndent))
        .join(EOL);

    return aligned;
}
