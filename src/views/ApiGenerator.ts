/**
 * ApiGenerator.ts
 * 
 * Gera arquivos de integração com API para cada entidade.
 * Cria funções baseadas em Axios para operações CRUD.
 * Representa a camada View (gerador) na arquitetura MVC.
 * 
 * Processos:
 * - Recebe ProjectAbstraction, ClassAbstraction e pasta de saída
 * - Gera arquivo TypeScript com funções CRUD (listar, criar, obter, atualizar, excluir)
 * - Configura baseURL para integração com admin API
 * - Define interfaces de requisição/resposta tipadas
 */

import path from 'path';
import { ClassAbstraction, ProjectAbstraction } from '../types/index.js';
import { writeFile, expandToString } from '../utils/index.js';

/**
 * Generates API integration file for an entity
 * 
 * Creates a TypeScript file containing all CRUD operations
 * for interacting with the backend API.
 * 
 * Generated functions:
 * - listar{Entity}: GET /
 * - criar{Entity}: POST /
 * - obter{Entity}: GET /{id}
 * - atualizar{Entity}: PUT /{id}
 * - excluir{Entity}: DELETE /{id}
 * 
 * @param {ProjectAbstraction} projectAbstraction - Project metadata
 * @param {ClassAbstraction} entity - Entity to generate API for
 * @param {string} targetFolder - Destination folder
 */
export function generate(
    projectAbstraction: ProjectAbstraction,
    entity: ClassAbstraction,
    targetFolder: string
): void {
    const entityName = entity.getName();
    const fileName = `${entityName.toLowerCase()}.ts`;
    const content = generateApiContent(entity);
    
    writeFile(path.join(targetFolder, fileName), content);
}

/**
 * Generates the API file content
 * 
 * @param {ClassAbstraction} entity - Entity class
 * @returns {string} Generated API code
 * @private
 */
function generateApiContent(entity: ClassAbstraction): string {
    const entityName = entity.getName();
    
    return expandToString`
/**
 * @description arquivo de api trata da parte de requisicao e suas configuracoes
 * @description Features:
 * @description - Full CRUD operation coverage
 * @description - Type-safe API responses
 * @description - Base URL configuration
 * @description - Admin API integration
 */

import adminApi, { adminApiConfig } from '@/api/admin'
import type {
  ${entityName},
  ${entityName}CreateReq,
  ${entityName}ListRes,
  ${entityName}CreateRes,
  ${entityName}GetRes,
  ${entityName}UpdateRes,
  ${entityName}DeleteRes,
} from '../types/${entityName.toLowerCase()}.d.ts'

const ${entityName.toLowerCase()}ReqConf = {
  baseURL: adminApiConfig.baseURL + '${entityName.toLowerCase()}',
}

export const listar${entityName} = async () => {
  return await adminApi.get<${entityName}ListRes>('/', ${entityName.toLowerCase()}ReqConf)
}

export const criar${entityName} = async (${entityName.toLowerCase()}: ${entityName}CreateReq) => {
  return await adminApi.post<${entityName}CreateRes>('/', ${entityName.toLowerCase()}, ${entityName.toLowerCase()}ReqConf)
}

export const obter${entityName} = async (id: string) => {
  const { data } = await adminApi.get<${entityName}GetRes>('/' + id, ${entityName.toLowerCase()}ReqConf)
  return data.value[0]
}

export const atualizar${entityName} = async (${entityName.toLowerCase()}: ${entityName}) => {
  return await adminApi.put<${entityName}UpdateRes>('/' + ${entityName.toLowerCase()}.Id, ${entityName.toLowerCase()}, ${entityName.toLowerCase()}ReqConf)
}

export const excluir${entityName} = async (id: string) => {
  return await adminApi.delete<${entityName}DeleteRes>('/' + id, ${entityName.toLowerCase()}ReqConf)
}    
`;
}
