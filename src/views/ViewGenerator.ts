/**
 * ViewGenerator.ts
 * 
 * Gera arquivos de componentes Vue 3 (.vue) para cada módulo de entidade.
 * Cria view de listagem (Listar.vue) e view de criação/edição (Criar.vue).
 * Representa a camada View (gerador) na arquitetura MVC.
 * 
 * Processos:
 * - Recebe ProjectAbstraction, ClassAbstraction e pasta de saída
 * - Gera Listar.vue: tabela com dados, ações CRUD, seleção em lote
 * - Gera Criar.vue: formulário dinâmico, detecção de modo de edição
 * - Configura Composition API (script setup)
 * - Aplica estilos scoped
 */

import path from 'path';
import { ClassAbstraction, ProjectAbstraction } from '../types/index.js';
import { writeFile, expandToString } from '../utils/index.js';

/**
 * Generates Vue component views for an entity
 * 
 * Creates two Vue 3 SFC (Single File Components):
 * - Listar.vue: List/table view with CRUD actions
 * - Criar.vue: Create/Edit form view
 * 
 * @param {ProjectAbstraction} projectAbstraction - Project metadata
 * @param {ClassAbstraction} entity - Entity to generate views for
 * @param {string} targetFolder - Destination folder
 */
export function generate(
    projectAbstraction: ProjectAbstraction,
    entity: ClassAbstraction,
    targetFolder: string
): void {
    const listarContent = generateListarContent(entity);
    const criarContent = generateCriarContent(entity);
    
    writeFile(path.join(targetFolder, 'Listar.vue'), listarContent);
    writeFile(path.join(targetFolder, 'Criar.vue'), criarContent);
}

/**
 * Generates the Listar.vue (list view) component
 * 
 * Features:
 * - Data table with all entity attributes
 * - Edit and delete actions per row
 * - Batch delete selection
 * - Reactive data loading
 * 
 * @param {ClassAbstraction} entity - Entity class
 * @returns {string} Generated Vue component
 * @private
 */
function generateListarContent(entity: ClassAbstraction): string {
    const entityName = entity.getName();
    const entityLower = entityName.toLowerCase();
    const attributes = entity.getAttributes();
    
    // Generate table headers
    const headers = attributes
        .map((attr: { getName: () => any; }) => `      { title: '${attr.getName()}', key: '${attr.getName()}' },`)
        .join('\n');
    
    // Generate table columns for template
    const columns = attributes
        .map((attr: any) => `          <td>{{ item.${attr.getName()} }}</td>`)
        .join('\n');
    
    return expandToString`
<template>
  <div class="${entityLower}-listar">
    <h1>Lista de ${entityName}</h1>
    
    <div class="actions">
      <button @click="criar">Novo ${entityName}</button>
      <button 
        v-if="selectedItems.length > 0" 
        @click="excluirSelecionados"
        class="danger"
      >
        Excluir Selecionados ({{ selectedItems.length }})
      </button>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                @change="toggleAll"
                :checked="allSelected"
              />
            </th>
${attributes.map((attr: any) => `            <th>${attr.getName()}</th>`).join('\n')}
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>
              <input 
                type="checkbox" 
                :value="item.id"
                v-model="selectedItems"
              />
            </td>
${columns}
            <td class="actions-cell">
              <button @click="editar(item.id)" class="edit">Editar</button>
              <button @click="excluir(item.id)" class="delete">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  listar, 
  excluir, 
  excluirLote 
} from '../controller'
import type { ${entityName} } from '../types/${entityName}'

const router = useRouter()
const items = ref<${entityName}[]>([])
const selectedItems = ref<number[]>([])

const allSelected = computed(() => {
  return items.value.length > 0 && 
         selectedItems.value.length === items.value.length
})

async function carregarDados() {
  items.value = await listar()
}

function criar() {
  router.push({ name: '${entityLower}-criar' })
}

function editar(id: number) {
  router.push({ name: '${entityLower}-criar', params: { id } })
}

async function excluir(id: number) {
  if (confirm('Deseja realmente excluir este registro?')) {
    await excluir(id)
    await carregarDados()
  }
}

async function excluirSelecionados() {
  if (confirm(\`Deseja realmente excluir \${selectedItems.value.length} registros?\`)) {
    await excluirLote(selectedItems.value)
    selectedItems.value = []
    await carregarDados()
  }
}

function toggleAll(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    selectedItems.value = items.value.map(item => item.id)
  } else {
    selectedItems.value = []
  }
}

onMounted(() => {
  carregarDados()
})
</script>

<style scoped>
.${entityLower}-listar {
  padding: 20px;
}

.actions {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button.danger {
  background-color: #dc3545;
  color: white;
}

button.edit {
  background-color: #007bff;
  color: white;
}

button.delete {
  background-color: #dc3545;
  color: white;
}
</style>
`;
}

/**
 * Generates the Criar.vue (create/edit form) component
 * 
 * Features:
 * - Dynamic form based on entity attributes
 * - Edit mode detection via route params
 * - Form validation
 * - Save and cancel actions
 * 
 * @param {ClassAbstraction} entity - Entity class
 * @returns {string} Generated Vue component
 * @private
 */
function generateCriarContent(entity: ClassAbstraction): string {
    const entityName = entity.getName();
    const entityLower = entityName.toLowerCase();
    const attributes = entity.getAttributes();
    
    // Generate form fields
    const formFields = attributes
        .map((attr: any) => {
            const attrName = attr.getName();
            const attrType = attr.getType();
            
            // Skip ID field (auto-generated)
            if (attrName.toLowerCase() === 'id') {
                return '';
            }
            
            let inputType = 'text';
            if (attrType === 'Integer' || attrType === 'Long' || attrType === 'Double' || attrType === 'Float') {
                inputType = 'number';
            } else if (attrType === 'Boolean') {
                return `
      <div class="form-group">
        <label for="${attrName}">${attrName}:</label>
        <input 
          type="checkbox"
          id="${attrName}"
          v-model="form.${attrName}"
        />
      </div>`;
            } else if (attrType === 'Date') {
                inputType = 'date';
            }
            
            return `
      <div class="form-group">
        <label for="${attrName}">${attrName}:</label>
        <input 
          type="${inputType}"
          id="${attrName}"
          v-model="form.${attrName}"
          required
        />
      </div>`;
        })
        .filter((field: string) => field !== '')
        .join('\n');
    
    // Generate initial form state
    const initialFormState = attributes
        .map((attr: any) => {
            const attrName = attr.getName();
            const attrType = attr.getType();
            
            if (attrType === 'Boolean') {
                return `  ${attrName}: false,`;
            } else if (attrType === 'Integer' || attrType === 'Long' || attrType === 'Double' || attrType === 'Float') {
                return `  ${attrName}: 0,`;
            } else {
                return `  ${attrName}: '',`;
            }
        })
        .join('\n');
    
    return expandToString`
<template>
  <div class="${entityLower}-criar">
    <h1>{{ isEditMode ? 'Editar' : 'Criar' }} ${entityName}</h1>
    
    <form @submit.prevent="salvar">
${formFields}
      
      <div class="form-actions">
        <button type="submit" class="primary">Salvar</button>
        <button type="button" @click="cancelar" class="secondary">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  obter, 
  criar, 
  atualizar 
} from '../controller'
import type { ${entityName}Form } from '../types/${entityName}'

const router = useRouter()
const route = useRoute()

const form = ref<${entityName}Form>({
${initialFormState}
})

const isEditMode = computed(() => !!route.params.id)

async function carregarDados() {
  if (isEditMode.value) {
    const id = Number(route.params.id)
    const data = await obter(id)
    if (data) {
      form.value = { ...data }
    }
  }
}

async function salvar() {
  if (isEditMode.value) {
    const id = Number(route.params.id)
    await atualizar(id, form.value)
  } else {
    await criar(form.value)
  }
  
  router.push({ name: '${entityLower}-home' })
}

function cancelar() {
  router.push({ name: '${entityLower}-home' })
}

onMounted(() => {
  carregarDados()
})
</script>

<style scoped>
.${entityLower}-criar {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 500;
}

input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input[type="checkbox"] {
  width: auto;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button.primary {
  background-color: #007bff;
  color: white;
}

button.secondary {
  background-color: #6c757d;
  color: white;
}
</style>
`;
}
