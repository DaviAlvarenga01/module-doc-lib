/**
 * PathUtils.ts
 * 
 * Título: Utilitários para Manipulação de Caminhos
 * 
 * Descrição:
 * Fornece funções auxiliares para manipulação de caminhos de arquivos e
 * diretórios, incluindo criação automática de estruturas de pastas e
 * normalização de caminhos. Essencial para geradores de código que criam
 * hierarquias de arquivos.
 * 
 * Processos:
 * 1. Criação recursiva de diretórios
 * 2. Normalização de separadores de caminho
 * 3. Junção e validação de caminhos
 * 4. Verificação de existência
 * 
 * Conformidade:
 * - ISO/IEC 25010: Portabilidade (multiplataforma)
 * - KISS Methodology: Interface simples sobre Node.js fs/path
 * 
 * @module utils/PathUtils
 * @author module-doc-lib
 * @version 1.0.0
 */

import path from 'path';
import fs from 'fs';

/**
 * createPath
 * 
 * Título: Criação de Caminho com Diretórios
 * 
 * Descrição:
 * Cria um caminho de diretório garantindo que todos os diretórios
 * intermediários existam. Se algum diretório não existir, ele será
 * criado automaticamente de forma recursiva. Equivalente a `mkdir -p`
 * no Unix ou `mkdir /p` no Windows.
 * 
 * Processos:
 * 1. Recebe segmentos de caminho variádicos
 * 2. Junta os segmentos usando path.join (normalização automática)
 * 3. Verifica se o caminho existe usando fs.existsSync
 * 4. Se não existir, cria recursivamente com fs.mkdirSync
 * 5. Retorna o caminho normalizado
 * 
 * Características:
 * - Criação recursiva: Cria todos os diretórios pais necessários
 * - Idempotente: Pode ser chamado múltiplas vezes sem erro
 * - Multiplataforma: Usa separadores corretos para cada SO
 * - Seguro: Não sobrescreve diretórios existentes
 * 
 * Casos de uso:
 * - Geração de código: Criar estrutura de pastas do projeto
 * - Output de geradores: Garantir que diretório de destino existe
 * - Organização de artefatos: Criar hierarquia de módulos
 * 
 * Conformidade ISO/IEC 25010:
 * - Portabilidade: Funciona em Windows, Linux, macOS
 * - Confiabilidade: Garante que diretórios existam antes de escrever
 * 
 * Conformidade ISO/IEC 12207:
 * - Infraestrutura: Preparação do ambiente de desenvolvimento
 * 
 * @param args - Segmentos de caminho a serem unidos e criados
 * @returns Caminho normalizado e criado
 * 
 * @example
 * ```typescript
 * // Cria diretório simples
 * createPath('/projeto', 'src')  // '/projeto/src'
 * 
 * // Cria hierarquia completa
 * createPath('/projeto', 'src', 'models', 'entities')
 * // '/projeto/src/models/entities' (todos criados)
 * 
 * // Uso em geradores
 * const outputDir = createPath(process.cwd(), 'generated', 'backend', 'java')
 * // Garante que toda estrutura existe
 * 
 * // Caminho relativo
 * createPath('.', 'output', 'docs')  // './output/docs'
 * ```
 * 
 * @throws {Error} Se houver problemas de permissão ao criar diretórios
 */
export function createPath(...args: string[]): string {
    // Normaliza e junta os segmentos de caminho
    const targetPath = path.join(...args);
    
    // Verifica se o caminho já existe
    if (!fs.existsSync(targetPath)) {
        // Cria o diretório recursivamente
        fs.mkdirSync(targetPath, { recursive: true });
    }
    
    return targetPath;
}

/**
 * ensureDirectory
 * 
 * Título: Garantir Existência de Diretório
 * 
 * Descrição:
 * Verifica se um diretório existe e o cria se necessário. Similar a
 * createPath, mas aceita um caminho completo já formado ao invés de
 * segmentos variádicos.
 * 
 * Processos:
 * 1. Recebe caminho completo como string
 * 2. Normaliza o caminho
 * 3. Verifica existência
 * 4. Cria recursivamente se não existir
 * 5. Retorna booleano indicando se foi criado
 * 
 * Casos de uso:
 * - Validação antes de escrita de arquivo
 * - Preparação de ambiente
 * - Migração de estruturas de diretórios
 * 
 * @param dirPath - Caminho completo do diretório
 * @returns true se o diretório foi criado, false se já existia
 * 
 * @example
 * ```typescript
 * ensureDirectory('/projeto/src/models')  // true (criado)
 * ensureDirectory('/projeto/src/models')  // false (já existe)
 * ```
 */
export function ensureDirectory(dirPath: string): boolean {
    const normalizedPath = path.normalize(dirPath);
    
    if (fs.existsSync(normalizedPath)) {
        return false; // Já existia
    }
    
    fs.mkdirSync(normalizedPath, { recursive: true });
    return true; // Foi criado
}

/**
 * normalizePath
 * 
 * Título: Normalização de Caminho
 * 
 * Descrição:
 * Normaliza um caminho removendo redundâncias (./, ../) e convertendo
 * separadores para o padrão da plataforma. Útil para comparação de
 * caminhos e exibição consistente.
 * 
 * Processos:
 * 1. Remove segmentos redundantes (., ..)
 * 2. Converte separadores para o padrão do SO
 * 3. Remove barras duplicadas
 * 4. Retorna caminho limpo
 * 
 * Casos de uso:
 * - Comparação de caminhos
 * - Exibição de caminhos para usuário
 * - Resolução de caminhos relativos
 * 
 * Conformidade ISO/IEC 25010:
 * - Portabilidade: Normalização multiplataforma
 * 
 * @param targetPath - Caminho a ser normalizado
 * @returns Caminho normalizado
 * 
 * @example
 * ```typescript
 * normalizePath('src/./models/../entities')  // 'src/entities'
 * normalizePath('src//models///file.ts')     // 'src/models/file.ts'
 * ```
 */
export function normalizePath(targetPath: string): string {
    return path.normalize(targetPath);
}

/**
 * joinPaths
 * 
 * Título: Junção de Caminhos
 * 
 * Descrição:
 * Junta múltiplos segmentos de caminho usando o separador correto
 * para o sistema operacional. Wrapper sobre path.join com validação.
 * 
 * Processos:
 * 1. Recebe segmentos de caminho
 * 2. Remove segmentos vazios ou undefined
 * 3. Junta usando path.join
 * 4. Retorna caminho normalizado
 * 
 * Casos de uso:
 * - Construção de caminhos de arquivos
 * - Geração de paths de importação
 * - Navegação em estruturas de diretórios
 * 
 * @param segments - Segmentos de caminho a serem unidos
 * @returns Caminho unido e normalizado
 * 
 * @example
 * ```typescript
 * joinPaths('src', 'models', 'User.ts')     // 'src/models/User.ts'
 * joinPaths('/projeto', 'src', 'index.ts')  // '/projeto/src/index.ts'
 * ```
 */
export function joinPaths(...segments: string[]): string {
    // Remove segmentos vazios ou undefined
    const validSegments = segments.filter(seg => seg && seg.length > 0);
    
    if (validSegments.length === 0) {
        return '.';
    }
    
    return path.join(...validSegments);
}

/**
 * getRelativePath
 * 
 * Título: Obter Caminho Relativo
 * 
 * Descrição:
 * Calcula o caminho relativo de um arquivo em relação a outro,
 * útil para geração de imports e referências entre arquivos.
 * 
 * Processos:
 * 1. Normaliza ambos os caminhos
 * 2. Calcula caminho relativo usando path.relative
 * 3. Ajusta para importações (adiciona ./ se necessário)
 * 4. Retorna caminho relativo
 * 
 * Casos de uso:
 * - Geração de imports entre módulos
 * - Cálculo de caminhos de referência
 * - Links relativos em documentação
 * 
 * @param from - Caminho de origem
 * @param to - Caminho de destino
 * @returns Caminho relativo de 'from' para 'to'
 * 
 * @example
 * ```typescript
 * getRelativePath(
 *   '/projeto/src/models/User.ts',
 *   '/projeto/src/utils/helpers.ts'
 * )  // '../utils/helpers.ts'
 * 
 * getRelativePath(
 *   '/projeto/src/index.ts',
 *   '/projeto/src/models/User.ts'
 * )  // './models/User.ts'
 * ```
 */
export function getRelativePath(from: string, to: string): string {
    const relativePath = path.relative(path.dirname(from), to);
    
    // Se o caminho não começa com . ou .., adiciona ./
    if (!relativePath.startsWith('.')) {
        return './' + relativePath;
    }
    
    return relativePath;
}

/**
 * getFileExtension
 * 
 * Título: Obter Extensão de Arquivo
 * 
 * Descrição:
 * Extrai a extensão de um arquivo a partir do seu caminho,
 * incluindo o ponto (ex: '.ts', '.java').
 * 
 * Processos:
 * 1. Usa path.extname para extrair extensão
 * 2. Retorna extensão com o ponto
 * 3. Retorna string vazia se não houver extensão
 * 
 * @param filePath - Caminho do arquivo
 * @returns Extensão do arquivo (com ponto) ou string vazia
 * 
 * @example
 * ```typescript
 * getFileExtension('User.ts')              // '.ts'
 * getFileExtension('src/models/User.java') // '.java'
 * getFileExtension('README')               // ''
 * ```
 */
export function getFileExtension(filePath: string): string {
    return path.extname(filePath);
}

/**
 * getFileName
 * 
 * Título: Obter Nome de Arquivo
 * 
 * Descrição:
 * Extrai o nome do arquivo (sem diretório) a partir do caminho completo,
 * opcionalmente removendo a extensão.
 * 
 * Processos:
 * 1. Usa path.basename para extrair nome
 * 2. Se removeExtension=true, remove a extensão
 * 3. Retorna nome do arquivo
 * 
 * @param filePath - Caminho completo do arquivo
 * @param removeExtension - Se true, remove a extensão
 * @returns Nome do arquivo
 * 
 * @example
 * ```typescript
 * getFileName('/projeto/src/User.ts', false)  // 'User.ts'
 * getFileName('/projeto/src/User.ts', true)   // 'User'
 * getFileName('models/Product.java', true)    // 'Product'
 * ```
 */
export function getFileName(filePath: string, removeExtension: boolean = false): string {
    const basename = path.basename(filePath);
    
    if (removeExtension) {
        const ext = path.extname(basename);
        return basename.slice(0, -ext.length);
    }
    
    return basename;
}

/**
 * getDirectoryName
 * 
 * Título: Obter Nome do Diretório Pai
 * 
 * Descrição:
 * Extrai o caminho do diretório que contém o arquivo ou pasta especificada.
 * 
 * Processos:
 * 1. Usa path.dirname para extrair diretório pai
 * 2. Retorna caminho do diretório
 * 
 * @param filePath - Caminho do arquivo ou pasta
 * @returns Caminho do diretório pai
 * 
 * @example
 * ```typescript
 * getDirectoryName('/projeto/src/models/User.ts')  // '/projeto/src/models'
 * getDirectoryName('src/index.ts')                 // 'src'
 * ```
 */
export function getDirectoryName(filePath: string): string {
    return path.dirname(filePath);
}

/**
 * Constantes de indentação
 * 
 * Título: Configurações de Formatação de Código
 * 
 * Descrição:
 * Define o tamanho padrão de indentação e uma string de indentação
 * base para uso em geradores de código.
 * 
 * Processos:
 * - ident_size: Número de espaços por nível de indentação (4)
 * - base_ident: String com espaços de indentação base
 * 
 * Casos de uso:
 * - Formatação de código gerado
 * - Indentação consistente em templates
 * - Alinhamento de blocos de código
 * 
 * Conformidade ISO/IEC 25010:
 * - Manutenibilidade: Código gerado legível e bem formatado
 */
export const ident_size = 4;
export const base_ident = ' '.repeat(ident_size);
