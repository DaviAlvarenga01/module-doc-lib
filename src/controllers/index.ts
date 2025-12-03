/**
 * Controllers Layer - Centralized Exports
 * 
 * Este módulo agrega e exporta todos os controllers da aplicação,
 * seguindo o padrão MVC (Model-View-Controller).
 * 
 * Controllers implementam a lógica de negócio de alto nível,
 * coordenando operações entre Models e Views, e fornecendo
 * interfaces simplificadas para operações complexas.
 * 
 * Arquitetura:
 * - ModelController: Operações sobre modelos completos
 * - ValidationController: Validação e verificação de integridade
 * - TransformController: Transformações e refatorações
 * 
 * @module controllers
 */

// ===== Model Controller =====
export {
    ModelController,
    type CreateModelOptions,
    type DependencyAnalysis,
    type GlobalModelStatistics
} from './ModelController.js';

// ===== Validation Controller =====
export {
    ValidationController,
    ValidationSeverity,
    type ValidationResult
} from './ValidationController.js';

// ===== Transform Controller =====
export {
    TransformController,
    NamingConvention,
    type TransformResult,
    type MergeOptions
} from './TransformController.js';
