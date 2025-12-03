/**
 * StringUtils.ts
 * 
 * Título: Utilitários para Manipulação de Strings
 * 
 * Descrição:
 * Fornece funções auxiliares para transformação e manipulação de strings,
 * incluindo capitalização, formatação e normalização de texto. Estas funções
 * são amplamente utilizadas na geração de código para formatação de nomes
 * de classes, variáveis, métodos e outros identificadores.
 * 
 * Processos:
 * 1. Capitalização de strings para nomes de tipos
 * 2. Conversão entre diferentes convenções de nomenclatura
 * 3. Normalização de identificadores
 * 4. Remoção de caracteres especiais
 * 
 * 
 * @module utils/StringUtils
 * @author module-doc-lib
 * @version 1.0.0
 */

/**
 * capitalizeString
 * 
 * Título: Capitalização de String
 * 
 * Descrição:
 * Converte o primeiro caractere de uma string para maiúscula, mantendo
 * os demais caracteres inalterados. Utilizada para formatação de nomes
 * de classes, tipos e identificadores que seguem PascalCase.
 * 
 * Processos:
 * 1. Extrai o primeiro caractere da string
 * 2. Converte o primeiro caractere para maiúscula
 * 3. Concatena com o restante da string original
 * 4. Retorna a string resultante
 * 
 * Casos de uso:
 * - Geração de nomes de classes: "usuario" → "Usuario"
 * - Formatação de tipos: "pedido" → "Pedido"
 * - Normalização de identificadores em PascalCase
 * 
 * 
 * @param str - String a ser capitalizada
 * @returns String com primeiro caractere em maiúscula
 * 
 * @example
 * ```typescript
 * capitalizeString('usuario')     // 'Usuario'
 * capitalizeString('pedido')      // 'Pedido'
 * capitalizeString('itemPedido')  // 'ItemPedido'
 * capitalizeString('a')           // 'A'
 * capitalizeString('')            // ''
 * ```
 */
export function capitalizeString(str: string): string {
    if (!str || str.length === 0) {
        return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * uncapitalizeString
 * 
 * Título: Descapitalização de String
 * 
 * Descrição:
 * Converte o primeiro caractere de uma string para minúscula, mantendo
 * os demais caracteres inalterados. Utilizada para formatação de nomes
 * de variáveis, atributos e métodos que seguem camelCase.
 * 
 * Processos:
 * 1. Extrai o primeiro caractere da string
 * 2. Converte o primeiro caractere para minúscula
 * 3. Concatena com o restante da string original
 * 4. Retorna a string resultante
 * 
 * Casos de uso:
 * - Geração de nomes de variáveis: "Usuario" → "usuario"
 * - Formatação de atributos: "NomeProduto" → "nomeProduto"
 * - Normalização de identificadores em camelCase
 * 
 * 
 * @param str - String a ser descapitalizada
 * @returns String com primeiro caractere em minúscula
 * 
 * @example
 * ```typescript
 * uncapitalizeString('Usuario')     // 'usuario'
 * uncapitalizeString('Pedido')      // 'pedido'
 * uncapitalizeString('ItemPedido')  // 'itemPedido'
 * ```
 */
export function uncapitalizeString(str: string): string {
    if (!str || str.length === 0) {
        return str;
    }
    return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * toSnakeCase
 * 
 * Título: Conversão para Snake Case
 * 
 * Descrição:
 * Converte uma string em PascalCase ou camelCase para snake_case,
 * formato comum em bancos de dados e algumas linguagens como Python.
 * 
 * Processos:
 * 1. Identifica transições de minúscula para maiúscula
 * 2. Insere underscore antes de cada maiúscula
 * 3. Converte toda a string para minúsculas
 * 4. Remove underscores duplicados ou no início
 * 
 * Casos de uso:
 * - Geração de nomes de tabelas: "ItemPedido" → "item_pedido"
 * - Nomes de colunas: "nomeCompleto" → "nome_completo"
 * - Mapeamento para Python/Ruby
 * 
 * Conformidade ISO/IEC 25010:
 * - Portabilidade: Compatibilidade com múltiplas convenções
 * 
 * @param str - String em PascalCase ou camelCase
 * @returns String em snake_case
 * 
 * @example
 * ```typescript
 * toSnakeCase('ItemPedido')      // 'item_pedido'
 * toSnakeCase('nomeCompleto')    // 'nome_completo'
 * toSnakeCase('CPF')             // 'cpf'
 * toSnakeCase('dataDeNascimento') // 'data_de_nascimento'
 * ```
 */
export function toSnakeCase(str: string): string {
    if (!str || str.length === 0) {
        return str;
    }
    
    return str
        // Insere underscore antes de maiúsculas precedidas por minúsculas
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        // Insere underscore antes de maiúsculas seguidas de minúsculas (para siglas)
        .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
        // Converte tudo para minúsculas
        .toLowerCase()
        // Remove underscores duplicados
        .replace(/_+/g, '_')
        // Remove underscore do início
        .replace(/^_/, '');
}

/**
 * toPascalCase
 * 
 * Título: Conversão para Pascal Case
 * 
 * Descrição:
 * Converte uma string em snake_case, kebab-case ou espaços para PascalCase,
 * capitalizando a primeira letra de cada palavra.
 * 
 * Processos:
 * 1. Divide a string por separadores (_, -, espaço)
 * 2. Capitaliza cada palavra resultante
 * 3. Remove separadores
 * 4. Concatena todas as palavras
 * 
 * Casos de uso:
 * - Geração de nomes de classes: "item_pedido" → "ItemPedido"
 * - Conversão de inputs do usuário: "nome completo" → "NomeCompleto"
 * - Normalização de identificadores
 * 
 * Conformidade ISO/IEC 25010:
 * - Portabilidade: Conversão entre convenções
 * 
 * @param str - String com separadores (_, -, espaço)
 * @returns String em PascalCase
 * 
 * @example
 * ```typescript
 * toPascalCase('item_pedido')        // 'ItemPedido'
 * toPascalCase('nome-completo')      // 'NomeCompleto'
 * toPascalCase('data de nascimento') // 'DataDeNascimento'
 * ```
 */
export function toPascalCase(str: string): string {
    if (!str || str.length === 0) {
        return str;
    }
    
    return str
        // Divide por _, -, ou espaço
        .split(/[_\-\s]+/)
        // Capitaliza cada palavra
        .map(word => capitalizeString(word))
        // Junta tudo
        .join('');
}

/**
 * toCamelCase
 * 
 * Título: Conversão para Camel Case
 * 
 * Descrição:
 * Converte uma string para camelCase, capitalizando a primeira letra de
 * cada palavra exceto a primeira.
 * 
 * Processos:
 * 1. Converte primeiro para PascalCase
 * 2. Descapitaliza o primeiro caractere
 * 3. Retorna a string resultante
 * 
 * Casos de uso:
 * - Geração de nomes de variáveis: "item_pedido" → "itemPedido"
 * - Nomes de métodos: "calcular_total" → "calcularTotal"
 * - Atributos JavaScript/TypeScript
 * 
 * Conformidade ISO/IEC 25010:
 * - Portabilidade: Padrão JavaScript/TypeScript
 * 
 * @param str - String com separadores
 * @returns String em camelCase
 * 
 * @example
 * ```typescript
 * toCamelCase('item_pedido')         // 'itemPedido'
 * toCamelCase('nome-completo')       // 'nomeCompleto'
 * toCamelCase('calcular total')      // 'calcularTotal'
 * ```
 */
export function toCamelCase(str: string): string {
    const pascalCase = toPascalCase(str);
    return uncapitalizeString(pascalCase);
}

/**
 * sanitizeIdentifier
 * 
 * Título: Sanitização de Identificador
 * 
 * Descrição:
 * Remove ou substitui caracteres inválidos de um identificador, garantindo
 * que o resultado seja um identificador válido em linguagens de programação.
 * 
 * Processos:
 * 1. Remove acentos e caracteres especiais
 * 2. Substitui espaços e caracteres inválidos por underscore
 * 3. Remove underscores duplicados
 * 4. Garante que não inicie com número
 * 5. Retorna identificador válido
 * 
 * Casos de uso:
 * - Normalização de nomes fornecidos pelo usuário
 * - Geração de identificadores a partir de texto livre
 * - Validação de nomes de variáveis/classes
 * 
 * Conformidade ISO/IEC 25010:
 * - Confiabilidade: Previne erros de compilação
 * - Robustez: Trata inputs inválidos
 * 
 * @param str - String a ser sanitizada
 * @returns Identificador válido
 * 
 * @example
 * ```typescript
 * sanitizeIdentifier('Nome Completo')   // 'Nome_Completo'
 * sanitizeIdentifier('E-mail')          // 'E_mail'
 * sanitizeIdentifier('Código!')         // 'Codigo'
 * sanitizeIdentifier('123abc')          // '_123abc'
 * ```
 */
export function sanitizeIdentifier(str: string): string {
    if (!str || str.length === 0) {
        return '_';
    }
    
    let result = str
        // Remove acentos
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        // Substitui caracteres inválidos por underscore
        .replace(/[^a-zA-Z0-9_]/g, '_')
        // Remove underscores duplicados
        .replace(/_+/g, '_')
        // Remove underscores do início e fim
        .replace(/^_+|_+$/g, '');
    
    // Se inicia com número, adiciona underscore
    if (/^[0-9]/.test(result)) {
        result = '_' + result;
    }
    
    // Se ficou vazio, retorna underscore
    return result || '_';
}

/**
 * pluralize
 * 
 * Título: Pluralização de Substantivo
 * 
 * Descrição:
 * Converte um substantivo singular para sua forma plural em português,
 * aplicando regras básicas de pluralização.
 * 
 * Processos:
 * 1. Identifica terminação da palavra
 * 2. Aplica regra de pluralização apropriada
 * 3. Retorna forma plural
 * 
 * Casos de uso:
 * - Geração de nomes de coleções: "cliente" → "clientes"
 * - Nomes de tabelas: "pedido" → "pedidos"
 * - Relacionamentos OneToMany
 * 
 * Limitações:
 * - Implementa apenas regras básicas
 * - Pode não funcionar para palavras irregulares
 * 
 * @param str - Substantivo no singular
 * @returns Substantivo no plural
 * 
 * @example
 * ```typescript
 * pluralize('cliente')   // 'clientes'
 * pluralize('pedido')    // 'pedidos'
 * pluralize('animal')    // 'animais'
 * pluralize('pais')      // 'paises'
 * ```
 */
export function pluralize(str: string): string {
    if (!str || str.length === 0) {
        return str;
    }
    
    const lower = str.toLowerCase();
    
    // Regras básicas de pluralização em português
    if (lower.endsWith('ão')) {
        return str.slice(0, -2) + 'ões';
    } else if (lower.endsWith('m')) {
        return str.slice(0, -1) + 'ns';
    } else if (lower.endsWith('r') || lower.endsWith('z')) {
        return str + 'es';
    } else if (lower.endsWith('al') || lower.endsWith('el') || 
               lower.endsWith('ol') || lower.endsWith('ul')) {
        return str.slice(0, -1) + 'is';
    } else if (lower.endsWith('il')) {
        return str.slice(0, -2) + 'eis';
    } else if (lower.endsWith('s') && !lower.endsWith('ês')) {
        // Já está no plural
        return str;
    } else {
        // Regra padrão: adiciona 's'
        return str + 's';
    }
}
