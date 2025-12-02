# Guia de Testes - Module Doc Lib

## 📋 Visão Geral

Este documento descreve a estratégia de testes da biblioteca module-doc-lib, explicando a organização, execução e propósito de cada suite de testes.

---

## 🎯 Objetivo dos Testes

Os testes validam que a biblioteca:
1. **Recebe** corretamente abstrações SEON (ProjectAbstraction)
2. **Processa** entidades e seus atributos
3. **Gera** estrutura completa de módulos Vue.js
4. **Produz** código funcional com CRUD, rotas, tipos e componentes

---

## 📁 Estrutura de Testes

```
tests/
├── helpers/
│   ├── mocks.ts          # Criação de projetos de teste
│   ├── checkers.ts       # Validadores de arquivos
│   └── cleanup.ts        # Limpeza de artefatos
│
├── models.test.ts        # Testes da camada Model
├── utils.test.ts         # Testes de utilitários
└── generation.test.ts    # Testes end-to-end
```

---

## 🧪 Suites de Testes

### 1. **models.test.ts** (12 testes)

**Propósito:** Valida a camada Model (ModuleGenerator)

**Casos de teste:**

#### Constructor
- ✅ Cria instância com ProjectAbstraction válido
- ✅ Lança erro se ProjectAbstraction for null
- ✅ Lança erro se ProjectAbstraction for undefined

#### Extração de Entidades
- ✅ Retorna todas as entidades do projeto
- ✅ Retorna array vazio para projeto sem entidades

#### Informações do Projeto
- ✅ Retorna nome do projeto corretamente
- ✅ Verifica se projeto tem entidades
- ✅ Conta número de entidades

**Por quê?** Garante que a biblioteca lê corretamente os dados do SEON.

---

### 2. **utils.test.ts** (18 testes)

**Propósito:** Valida funções auxiliares

**Casos de teste:**

#### Template Strings (`expandToString`)
- ✅ Processa template literals simples
- ✅ Interpola valores corretamente
- ✅ Lida com strings multilinhas
- ✅ Usa EOL específico da plataforma

#### Sistema de Arquivos
- ✅ `createPath`: cria diretórios (incluindo aninhados)
- ✅ `writeFile`: escreve arquivos criando diretórios se necessário
- ✅ `pathExists`: verifica existência de arquivos/pastas
- ✅ `capitalizeString`: capitaliza primeira letra

**Por quê?** Garante que operações de I/O funcionam corretamente.

---

### 3. **generation.test.ts** (51 testes)

**Propósito:** Valida geração completa end-to-end

**Casos de teste:**

#### Estrutura de Diretórios (13 testes)
Valida criação de todos os diretórios:
```
generated-modules/
├── Entidade1/
│   ├── api/
│   ├── controllers/
│   ├── routes/
│   ├── types/
│   └── views/
└── Entidade2/
    └── (mesma estrutura)
```

#### Criação de Arquivos (15 testes)
Valida existência de todos os arquivos:
- `index.ts` (main)
- `{entidade}/index.ts`
- `{entidade}/api/{entidade}.ts`
- `{entidade}/controllers/{entidade}.ts`
- `{entidade}/routes/index.ts`
- `{entidade}/types/{Entidade}.d.ts`
- `{entidade}/views/Listar.vue`
- `{entidade}/views/Criar.vue`

#### Main Index (4 testes)
- ✅ Importa RouteRecordRaw do vue-router
- ✅ Importa routes de todas as entidades
- ✅ Exporta array de rotas agregado

#### API Files (5 testes)
Valida geração de operações CRUD:
- ✅ `listar{Entidade}()` - GET all
- ✅ `criar{Entidade}()` - POST
- ✅ `obter{Entidade}()` - GET by ID
- ✅ `atualizar{Entidade}()` - PUT
- ✅ `excluir{Entidade}()` - DELETE

#### Controller Files (3 testes)
- ✅ Importa AxiosError
- ✅ Contém blocos try/catch
- ✅ Importa funções da camada API

#### Route Files (4 testes)
- ✅ Importa RouteRecordRaw
- ✅ Define rota home
- ✅ Define rota criar
- ✅ Importa componentes Listar e Criar

#### Type Definition Files (2 testes)
- ✅ Define interface da entidade
- ✅ Define interface Form

#### Vue Component Files (5 testes)
- ✅ Contém section `<template>`
- ✅ Contém `<script setup lang="ts">`
- ✅ Contém `<style scoped>`
- ✅ Componente de formulário
- ✅ Modo de edição

**Por quê?** Garante que a geração completa funciona do início ao fim.

---

## 🚀 Executando os Testes

### Todos os testes
```bash
npm test
```

### Modo watch (desenvolvimento)
```bash
npm run test:watch
```

### Com cobertura
```bash
npm run test:coverage
```

### Com interface visual
```bash
npm run test:ui
```

---

## 📊 Métricas de Qualidade

### Cobertura Atual
```
Test Files: 3 passed (3)
Tests: 81 passed (81)
Success Rate: 100%
```

### Distribuição de Testes
| Suite | Testes | Foco |
|-------|--------|------|
| models.test.ts | 12 | Lógica de negócio |
| utils.test.ts | 18 | Funções auxiliares |
| generation.test.ts | 51 | Integração E2E |
| **TOTAL** | **81** | **Cobertura completa** |

---

## 🧩 Entidades de Teste

Os testes utilizam duas entidades de exemplo:

### Entidade1
```typescript
{
  nome: string
  numero: integer
}
```

### Entidade2
```typescript
{
  nome: string
  verificacao: boolean
}
```

**Por quê estas entidades?**
- Cobrem tipos de dados comuns (string, integer, boolean)
- Simples o suficiente para testes rápidos
- Complexas o suficiente para validar lógica

---

## 🛠️ Helpers de Teste

### mocks.ts
```typescript
// Cria projeto de teste com 2 entidades
createTestProject(): ProjectAbstraction

// Cria projeto vazio para edge cases
createEmptyProject(): ProjectAbstraction
```

### checkers.ts
```typescript
// Verifica se caminho é diretório
checkIsDir(dirPath: string): void

// Verifica se caminho é arquivo
checkIsFile(filePath: string): void

// Verifica se arquivo contém string
checkFileContains(filePath: string, searchString: string): void
```

### cleanup.ts
```typescript
// Remove pasta recursivamente
deleteFolderRecursive(folderPath: string): void
```

---

## 📝 Padrões de Teste

### Estrutura de Teste
```typescript
describe('Feature Name', () => {
    test('Should do something specific', () => {
        // Arrange
        const input = setupTestData();
        
        // Act
        const result = functionUnderTest(input);
        
        // Assert
        expect(result).toBe(expected);
    });
});
```

### Testes Parametrizados
```typescript
test.each(expectedValues)('Should validate: %s', (value) => {
    expect(() => validateFunction(value)).not.toThrow();
});
```

### Setup e Cleanup
```typescript
beforeAll(() => {
    // Setup executado uma vez antes de todos os testes
    generate(testProject, outputDir);
});

afterAll(() => {
    // Cleanup executado uma vez após todos os testes
    deleteFolderRecursive(outputDir);
});
```

---

## ⚡ Dicas de Performance

### Geração Única
O teste de geração usa `beforeAll` para gerar arquivos **uma única vez** e depois valida:
- ✅ Evita geração repetida (mais rápido)
- ✅ Testa o fluxo real de uso
- ✅ Economiza recursos

### Limpeza Eficiente
`afterAll` remove arquivos **apenas no final**:
- ✅ Permite inspeção manual em caso de falha
- ✅ Evita operações de I/O desnecessárias

---

## 🐛 Troubleshooting

### Testes Falhando

**Problema:** Diretório não criado
```
Error: Directory does not exist: ...
```
**Solução:** Verifique se `generate()` está sendo chamado no `beforeAll`

**Problema:** Arquivo não contém string esperada
```
Error: File does not contain: "..."
```
**Solução:** Inspecione o arquivo gerado manualmente (comente `afterAll`)

**Problema:** ProjectAbstraction inválido
```
Error: ProjectAbstraction is required
```
**Solução:** Verifique se o mock está criando instância real do SEON

### Debug de Arquivos Gerados

Comente o `afterAll` temporariamente:
```typescript
// afterAll(() => {
//     deleteFolderRecursive(outputDir);
// });
```

Os arquivos gerados ficarão em `tests/generated-modules/`.

---

## 📚 Referências

- **Framework de Testes:** Vitest
- **Abstrações SEON:** seon-lib-implementation
- **Arquivos de Teste:** `tests/*.test.ts`
- **Helpers:** `tests/helpers/*.ts`

---

## ✅ Checklist de Validação Rápida

Para validar se a biblioteca está funcionando:

```bash
# 1. Executar todos os testes
npm test
# Esperado: 81/81 passed ✅

# 2. Verificar cobertura
npm run test:coverage
# Esperado: > 80% em todas métricas ✅

# 3. Build sem erros
npm run build
# Esperado: dist/ gerado sem erros ✅
```

---

**Última atualização:** Dezembro 2025  
**Versão da Biblioteca:** 1.17.0  
**Cobertura de Testes:** 81 testes / 100% sucesso
