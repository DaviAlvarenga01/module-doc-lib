/**
 * Views Layer - Centralized Exports
 * 
 * Este módulo agrega e exporta todas as views da aplicação,
 * seguindo o padrão MVC (Model-View-Controller).
 * 
 * Views são responsáveis pela apresentação e serialização dos dados,
 * transformando modelos em formatos específicos para consumo externo.
 * 
 * Arquitetura:
 * - JSONView: Serialização JSON com múltiplas estratégias
 * - MarkdownView: Documentação em Markdown
 * 
 * Padrões de Uso:
 * - Serialização para persistência
 * - Geração de documentação
 * - Exportação de dados
 * - APIs e integrações
 * 
 * @module views
 */

// ===== JSON View =====
export {
    JSONView,
    SerializationStrategy,
    type JSONSerializationOptions
} from './JSONView.js';

// ===== Markdown View =====
export {
    MarkdownView,
    DocumentationStyle,
    type MarkdownOptions
} from './MarkdownView.js';
