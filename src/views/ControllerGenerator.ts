/**
 * ControllerGenerator.ts
 * 
 * Gera arquivos de controller que gerenciam lógica de negócio e tratamento de erros.
 * Controllers envolvem chamadas à API com feedback de interface e gerenciamento de erros.
 * Representa a camada View (gerador) na arquitetura MVC.
 * 
 * Processos:
 * - Recebe ProjectAbstraction, ClassAbstraction e pasta de saída
 * - Gera funções que envolvem chamadas à API
 * - Implementa tratamento de erros com Axios
 * - Exibe feedback de UI usando useUiStore
 * - Gerencia estados de sucesso/erro
 */

import path from 'path';
import { ClassAbstraction, ProjectAbstraction } from '../types/index.js';
import { writeFile, expandToString } from '../utils/index.js';

/**
 * Generates controller file for an entity
 * 
 * Creates a TypeScript file with controller functions that:
 * - Wrap API calls
 * - Handle errors with Axios
 * - Display UI feedback
 * - Manage success/error states
 * 
 * @param {ProjectAbstraction} projectAbstraction - Project metadata
 * @param {ClassAbstraction} entity - Entity to generate controller for
 * @param {string} targetFolder - Destination folder
 */
export function generate(
    projectAbstraction: ProjectAbstraction,
    entity: ClassAbstraction,
    targetFolder: string
): void {
    const entityName = entity.getName();
    const fileName = `${entityName.toLowerCase()}.ts`;
    const content = generateControllerContent(entity);
    
    writeFile(path.join(targetFolder, fileName), content);
}

/**
 * Generates the controller file content
 * 
 * @param {ClassAbstraction} entity - Entity class
 * @returns {string} Generated controller code
 * @private
 */
function generateControllerContent(entity: ClassAbstraction): string {
    const entityName = entity.getName();
    
    return expandToString`
/**
 * arquivo controller trata da parte de erros e interface de usuario
 */

import {
  criar${entityName} as _criar${entityName},
  listar${entityName} as _listar${entityName},
  obter${entityName} as _obter${entityName},
  atualizar${entityName} as _atualizar${entityName},
  excluir${entityName} as _excluir${entityName},
} from '../api/${entityName.toLowerCase()}'
import type { ${entityName}, ${entityName}CreateReq } from '../types/${entityName.toLowerCase()}'
import { useUiStore } from '@/stores/ui'
import { AxiosError } from 'axios'

export const listar${entityName} = async () => {
  try {
    const { data } = await _listar${entityName}()
    return data.value
  } catch (error) {
    throw error
  }
}

/**
 * @description listar${entityName}: List with error handling
 * @returns {Promise<${entityName}[]>} List of entities
 */

export const criar${entityName} = async (${entityName.toLowerCase()}: ${entityName}CreateReq) => {
  const ui = useUiStore()

  try {
    const { data } = await _criar${entityName}(${entityName.toLowerCase()})

    ui.exibirAlerta({
      text: data.message,
      color: 'success'
    })

    return true

  } catch (error) {
    if (
      error instanceof AxiosError &&
      error.response?.status === 400 &&
      error.response.data.errors
    ) {
      ui.exibirAlertas(
        error.response.data.errors
          .map((err: { mensagem: string }) => ({ text: err.mensagem, color: 'error' }))
      )

      return false

    } else {
      throw error
    }
  }
}

/**
 * @description criar${entityName}: Create with success notification
 * @returns {Promise<boolean>} Success status
 */

export const obter${entityName} = async (id: string) => {
  try {
    const data = await _obter${entityName}(id)
    return data
  } catch (error) {
    throw error
  }
}

/**
 * @description obter${entityName}: Get with error handling
 * @returns {Promise<${entityName}>} Retrieved entity
 */

export const atualizar${entityName} = async (${entityName.toLowerCase()}: ${entityName}) => {
  try {
    const { data } = await _atualizar${entityName}(${entityName.toLowerCase()})
    return true
  } catch (error) {
    throw error
  }
}

/**
 * @description atualizar${entityName}: Update with feedback
 * @returns {Promise<boolean>} Success status
 */

export const excluir${entityName} = async (id: string) => {
  try {
    const { data } = await _excluir${entityName}(id)
    return true
  } catch (error) {
    throw error
  }
}

/**
 * @description excluir${entityName}: Delete with confirmation
 * @returns {Promise<boolean>} Success status
 */

export const excluir${entityName}s = async (ids: string[]) => {
  try {
    for (const id of ids) {
      const sucesso = await excluir${entityName}(id)
    }
    return true
  } catch (error) {
    throw error
  }
}  

/**
 * @description excluir${entityName}s: Delete multiple entities
 * @returns {Promise<boolean>} Success status
 */
`;
}
