/**
 * Validation Controller
 * 
 * Controlador especializado em validação de modelos de domínio.
 * Implementa regras de negócio e validações estruturais para garantir
 * a integridade e consistência dos modelos.
 * 
 * Responsabilidades:
 * - Validação de estrutura de modelos
 * - Validação de nomenclatura
 * - Validação de relacionamentos
 * - Validação de tipos de dados
 * - Validação de referências
 * - Detecção de duplicações
 * - Validação de herança
 * 
 * Tipos de Validação:
 * - Structural: Estrutura do modelo está correta
 * - Semantic: Significado e relacionamentos fazem sentido
 * - Reference: Referências apontam para elementos válidos
 * - Naming: Nomes seguem convenções e são únicos
 * 
 * @module controllers/ValidationController
 * @see {@link Model} - Estrutura de modelo validada
 */

import {
    Model,
    Module,
    LocalEntity,
    Attribute,
    EnumX,
    Relation,
    DATATYPE
} from '../types/index.js';
import {
    isModule,
    isLocalEntity,
    isEnumX,
    isAttribute,
    isRelation,
    isFunctionEntity
} from '../utils/TypeGuards.js';

/**
 * Severidade da validação
 */
export enum ValidationSeverity {
    /** Erro crítico - modelo inválido */
    ERROR = 'error',
    /** Aviso - não é erro mas pode causar problemas */
    WARNING = 'warning',
    /** Informação - sugestão de melhoria */
    INFO = 'info'
}

/**
 * Resultado de uma validação
 */
export interface ValidationResult {
    /** Severidade da validação */
    severity: ValidationSeverity;
    /** Mensagem descritiva */
    message: string;
    /** Caminho até o elemento com problema (ex: "Vendas.Produto.nome") */
    path?: string;
    /** Tipo do elemento com problema */
    elementType?: string;
    /** Nome do elemento com problema */
    elementName?: string;
}

/**
 * Contexto de validação (usado internamente)
 */
interface ValidationContext {
    /** Modelo sendo validado */
    model: Model;
    /** Acumulador de resultados */
    results: ValidationResult[];
    /** Caminho atual na hierarquia */
    currentPath: string[];
    /** Conjunto de nomes já vistos (para verificar duplicação) */
    seenNames: Set<string>;
}

/**
 * Validation Controller
 * 
 * Controlador que implementa todas as regras de validação para
 * garantir que modelos estejam bem formados e consistentes.
 */
export class ValidationController {
    /**
     * Valida modelo completo
     * 
     * Executa todas as validações disponíveis e retorna lista
     * consolidada de problemas encontrados.
     * 
     * @param model - Modelo a ser validado
     * @returns Array de resultados de validação
     * 
     * @example
     * ```typescript
     * const results = ValidationController.validateModel(model);
     * 
     * const errors = results.filter(r => r.severity === ValidationSeverity.ERROR);
     * if (errors.length > 0) {
     *   console.error('Modelo inválido!');
     *   errors.forEach(err => console.error(`  ${err.path}: ${err.message}`));
     * }
     * ```
     */
    public static validateModel(model: Model): ValidationResult[] {
        const context: ValidationContext = {
            model,
            results: [],
            currentPath: [],
            seenNames: new Set()
        };

        // Valida configuração
        this.validateConfiguration(context);

        // Valida elementos abstratos
        for (const element of model.abstractElements) {
            if (isModule(element)) {
                this.validateModule(element, context);
            }
        }

        return context.results;
    }

    /**
     * Valida configuração do modelo
     */
    private static validateConfiguration(context: ValidationContext): void {
        const config = context.model.configuration;

        if (!config) {
            context.results.push({
                severity: ValidationSeverity.ERROR,
                message: 'Modelo não possui configuração',
                elementType: 'Model'
            });
            return;
        }

        if (!config.name || config.name.trim() === '') {
            context.results.push({
                severity: ValidationSeverity.ERROR,
                message: 'Nome do modelo não pode ser vazio',
                elementType: 'Configuration'
            });
        }

        if (!config.version || config.version.trim() === '') {
            context.results.push({
                severity: ValidationSeverity.WARNING,
                message: 'Versão do modelo não especificada',
                elementType: 'Configuration'
            });
        }

        // Valida formato da versão (semantic versioning)
        if (config.version && !/^\d+\.\d+\.\d+/.test(config.version)) {
            context.results.push({
                severity: ValidationSeverity.WARNING,
                message: `Versão '${config.version}' não segue padrão semântico (x.y.z)`,
                elementType: 'Configuration'
            });
        }
    }

    /**
     * Valida módulo e seus elementos
     */
    private static validateModule(module: Module, context: ValidationContext): void {
        context.currentPath.push(module.name);
        const fullPath = context.currentPath.join('.');

        // Valida nome do módulo
        this.validateName(module.name, 'Module', fullPath, context);

        // Verifica duplicação de nome em nível global
        if (context.seenNames.has(fullPath)) {
            context.results.push({
                severity: ValidationSeverity.ERROR,
                message: `Nome de módulo duplicado: '${fullPath}'`,
                path: fullPath,
                elementType: 'Module',
                elementName: module.name
            });
        }
        context.seenNames.add(fullPath);

        // Valida elementos do módulo
        const elementNames = new Set<string>();
        
        for (const element of module.elements) {
            // Verifica duplicação dentro do módulo
            if (elementNames.has(element.name)) {
                context.results.push({
                    severity: ValidationSeverity.ERROR,
                    message: `Nome duplicado no módulo '${module.name}': '${element.name}'`,
                    path: fullPath,
                    elementType: element.$type,
                    elementName: element.name
                });
            }
            elementNames.add(element.name);

            // Valida elemento específico
            if (isLocalEntity(element)) {
                this.validateEntity(element, context);
            } else if (isEnumX(element)) {
                this.validateEnum(element, context);
            } else if (isModule(element)) {
                this.validateModule(element, context);
            }
        }

        context.currentPath.pop();
    }

    /**
     * Valida entidade
     */
    private static validateEntity(entity: LocalEntity, context: ValidationContext): void {
        context.currentPath.push(entity.name);
        const fullPath = context.currentPath.join('.');

        // Valida nome
        this.validateName(entity.name, 'Entity', fullPath, context);

        // Valida atributos
        const attrNames = new Set<string>();
        for (const attr of entity.attributes) {
            if (attrNames.has(attr.name)) {
                context.results.push({
                    severity: ValidationSeverity.ERROR,
                    message: `Atributo duplicado na entidade '${entity.name}': '${attr.name}'`,
                    path: fullPath,
                    elementType: 'Attribute',
                    elementName: attr.name
                });
            }
            attrNames.add(attr.name);
            this.validateAttribute(attr, fullPath, context);
        }

        // Valida relacionamentos
        for (const relation of entity.relations) {
            this.validateRelation(relation, entity, fullPath, context);
        }

        // Valida funções
        const funcNames = new Set<string>();
        for (const func of entity.functions) {
            if (funcNames.has(func.name)) {
                context.results.push({
                    severity: ValidationSeverity.WARNING,
                    message: `Função duplicada na entidade '${entity.name}': '${func.name}'`,
                    path: fullPath,
                    elementType: 'FunctionEntity',
                    elementName: func.name
                });
            }
            funcNames.add(func.name);
            this.validateName(func.name, 'Function', `${fullPath}.${func.name}`, context);
        }

        // Valida herança
        if (entity.superType) {
            this.validateInheritance(entity, fullPath, context);
        }

        context.currentPath.pop();
    }

    /**
     * Valida atributo
     */
    private static validateAttribute(
        attr: Attribute,
        entityPath: string,
        context: ValidationContext
    ): void {
        const attrPath = `${entityPath}.${attr.name}`;

        // Valida nome
        this.validateName(attr.name, 'Attribute', attrPath, context);

        // Valida tipo (apenas para tipos primitivos)
        if (typeof attr.type === 'string' && !Object.values(DATATYPE).includes(attr.type as DATATYPE)) {
            context.results.push({
                severity: ValidationSeverity.ERROR,
                message: `Tipo inválido para atributo '${attr.name}': '${attr.type}'`,
                path: attrPath,
                elementType: 'Attribute',
                elementName: attr.name
            });
        }

        // Valida restrições numéricas
        if (attr.min !== undefined && attr.max !== undefined) {
            if (attr.min > attr.max) {
                context.results.push({
                    severity: ValidationSeverity.ERROR,
                    message: `Atributo '${attr.name}': min (${attr.min}) maior que max (${attr.max})`,
                    path: attrPath,
                    elementType: 'Attribute',
                    elementName: attr.name
                });
            }
        }

        // Aviso sobre atributos obrigatórios sem valor padrão
        if (!attr.blank && attr.unique) {
            context.results.push({
                severity: ValidationSeverity.INFO,
                message: `Atributo '${attr.name}' é obrigatório e único - considere adicionar lógica de geração`,
                path: attrPath,
                elementType: 'Attribute',
                elementName: attr.name
            });
        }
    }

    /**
     * Valida relacionamento
     */
    private static validateRelation(
        relation: Relation,
        entity: LocalEntity,
        entityPath: string,
        context: ValidationContext
    ): void {
        const relationPath = `${entityPath}.${relation.$type}`;

        // Valida referência ao alvo
        if (!relation.entity || !relation.entity.$ref) {
            context.results.push({
                severity: ValidationSeverity.ERROR,
                message: `Relacionamento sem alvo válido na entidade '${entity.name}'`,
                path: relationPath,
                elementType: relation.$type
            });
            return;
        }

        const target = relation.entity.$ref;

        // Verifica auto-relacionamento
        if (target === entity) {
            context.results.push({
                severity: ValidationSeverity.INFO,
                message: `Entidade '${entity.name}' possui auto-relacionamento`,
                path: relationPath,
                elementType: relation.$type
            });
        }

        // Valida relacionamento bidirecional
        // Verifica se tem opposite definido (indica bidirecionalidade)
        if ('opposite' in relation && relation.opposite) {
            // Relacionamento bidirecional está configurado corretamente
            // Poderia validar se o opposite existe na entidade alvo
        }
    }

    /**
     * Valida herança
     */
    private static validateInheritance(
        entity: LocalEntity,
        entityPath: string,
        context: ValidationContext
    ): void {
        if (!entity.superType?.$ref) return;

        const superEntity = entity.superType.$ref;;

        // Detecta herança circular (apenas um nível - para completa precisa BFS)
        if (superEntity.superType?.$ref === entity) {
            context.results.push({
                severity: ValidationSeverity.ERROR,
                message: `Herança circular detectada entre '${entity.name}' e '${superEntity.name}'`,
                path: entityPath,
                elementType: 'LocalEntity',
                elementName: entity.name
            });
        }

        // Aviso se superclasse não é abstrata
        if (!superEntity.is_abstract) {
            context.results.push({
                severity: ValidationSeverity.WARNING,
                message: `Entidade '${entity.name}' herda de '${superEntity.name}' que não é abstrata`,
                path: entityPath,
                elementType: 'LocalEntity',
                elementName: entity.name
            });
        }
    }

    /**
     * Valida enumeração
     */
    private static validateEnum(enumX: EnumX, context: ValidationContext): void {
        context.currentPath.push(enumX.name);
        const fullPath = context.currentPath.join('.');

        // Valida nome
        this.validateName(enumX.name, 'Enum', fullPath, context);

        // Valida que tem pelo menos um literal
        if (enumX.literals.length === 0) {
            context.results.push({
                severity: ValidationSeverity.WARNING,
                message: `Enumeração '${enumX.name}' não possui literais`,
                path: fullPath,
                elementType: 'EnumX',
                elementName: enumX.name
            });
        }

        // Valida literais
        const literalNames = new Set<string>();
        for (const literal of enumX.literals) {
            if (literalNames.has(literal.name)) {
                context.results.push({
                    severity: ValidationSeverity.ERROR,
                    message: `Literal duplicado na enumeração '${enumX.name}': '${literal.name}'`,
                    path: fullPath,
                    elementType: 'EnumLiteral',
                    elementName: literal.name
                });
            }
            literalNames.add(literal.name);
            this.validateName(literal.name, 'EnumLiteral', `${fullPath}.${literal.name}`, context);
        }

        context.currentPath.pop();
    }

    /**
     * Valida nome de elemento
     * 
     * Verifica:
     * - Não vazio
     * - Caracteres válidos
     * - Convenções de nomenclatura
     */
    private static validateName(
        name: string,
        elementType: string,
        path: string,
        context: ValidationContext
    ): void {
        // Nome vazio
        if (!name || name.trim() === '') {
            context.results.push({
                severity: ValidationSeverity.ERROR,
                message: `${elementType} sem nome`,
                path,
                elementType
            });
            return;
        }

        // Caracteres inválidos
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
            context.results.push({
                severity: ValidationSeverity.WARNING,
                message: `Nome '${name}' contém caracteres inválidos ou não segue convenção`,
                path,
                elementType,
                elementName: name
            });
        }

        // Convenções de nomenclatura
        if (elementType === 'Module' || elementType === 'Entity' || elementType === 'Enum') {
            if (!/^[A-Z]/.test(name)) {
                context.results.push({
                    severity: ValidationSeverity.INFO,
                    message: `${elementType} '${name}' deveria começar com maiúscula (PascalCase)`,
                    path,
                    elementType,
                    elementName: name
                });
            }
        }

        if (elementType === 'Attribute' || elementType === 'Function') {
            if (!/^[a-z]/.test(name)) {
                context.results.push({
                    severity: ValidationSeverity.INFO,
                    message: `${elementType} '${name}' deveria começar com minúscula (camelCase)`,
                    path,
                    elementType,
                    elementName: name
                });
            }
        }

        if (elementType === 'EnumLiteral') {
            if (!/^[A-Z_]+$/.test(name)) {
                context.results.push({
                    severity: ValidationSeverity.INFO,
                    message: `Literal '${name}' deveria ser UPPER_CASE`,
                    path,
                    elementType,
                    elementName: name
                });
            }
        }
    }

    /**
     * Filtra resultados por severidade
     * 
     * @param results - Resultados completos
     * @param severity - Severidade desejada
     * @returns Resultados filtrados
     * 
     * @example
     * ```typescript
     * const results = ValidationController.validateModel(model);
     * const errors = ValidationController.filterBySeverity(results, ValidationSeverity.ERROR);
     * ```
     */
    public static filterBySeverity(
        results: ValidationResult[],
        severity: ValidationSeverity
    ): ValidationResult[] {
        return results.filter(r => r.severity === severity);
    }

    /**
     * Verifica se modelo é válido (sem erros)
     * 
     * @param model - Modelo a ser verificado
     * @returns true se modelo não tem erros
     * 
     * @example
     * ```typescript
     * if (ValidationController.isValid(model)) {
     *   // Procede com geração de código
     * }
     * ```
     */
    public static isValid(model: Model): boolean {
        const results = this.validateModel(model);
        const errors = this.filterBySeverity(results, ValidationSeverity.ERROR);
        return errors.length === 0;
    }

    /**
     * Formata resultados de validação para exibição
     * 
     * @param results - Resultados a serem formatados
     * @returns String formatada para console
     * 
     * @example
     * ```typescript
     * const results = ValidationController.validateModel(model);
     * console.log(ValidationController.formatResults(results));
     * ```
     */
    public static formatResults(results: ValidationResult[]): string {
        if (results.length === 0) {
            return '✓ Modelo válido - nenhum problema encontrado';
        }

        const lines: string[] = [];
        const errors = this.filterBySeverity(results, ValidationSeverity.ERROR);
        const warnings = this.filterBySeverity(results, ValidationSeverity.WARNING);
        const infos = this.filterBySeverity(results, ValidationSeverity.INFO);

        lines.push(`\nResultados da Validação:`);
        lines.push(`  Erros: ${errors.length}`);
        lines.push(`  Avisos: ${warnings.length}`);
        lines.push(`  Informações: ${infos.length}\n`);

        if (errors.length > 0) {
            lines.push('Erros:');
            errors.forEach(err => {
                lines.push(`  ✗ ${err.path || err.elementType}: ${err.message}`);
            });
            lines.push('');
        }

        if (warnings.length > 0) {
            lines.push('Avisos:');
            warnings.forEach(warn => {
                lines.push(`  ⚠ ${warn.path || warn.elementType}: ${warn.message}`);
            });
            lines.push('');
        }

        if (infos.length > 0) {
            lines.push('Informações:');
            infos.forEach(info => {
                lines.push(`  ℹ ${info.path || info.elementType}: ${info.message}`);
            });
        }

        return lines.join('\n');
    }
}
