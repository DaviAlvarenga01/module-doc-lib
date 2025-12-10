# module-doc-lib

> Biblioteca TypeScript de modelos de domínio para geração de código

[![NPM Version](https://img.shields.io/npm/v/module-doc-lib)](https://www.npmjs.com/package/module-doc-lib)
[![License](https://img.shields.io/npm/l/module-doc-lib)](./LICENSE)

## 📖 Sobre

`module-doc-lib` é uma biblioteca TypeScript que fornece modelos tipados para representação de estruturas de domínio em projetos de geração de código a principio pensada para ser usada pelos (leds-tools-Spark-lib e leds-tools-Andes). Ela oferece interfaces e tipos para modelar entidades, atributos, relacionamentos, casos de uso e configurações de projetos.

## 🚀 Instalação

```bash
npm install module-doc-lib
```

## 📚 Uso Básico

```typescript
import { 
  Model, 
  LocalEntity, 
  Attribute, 
  isLocalEntity,
  isAttribute 
} from 'module-doc-lib';

// Criar um modelo
const model: Model = {
  $type: 'Model',
  name: 'MeuProjeto',
  configurations: [],
  modules: [],
  entities: []
};

// Usar type guards
if (isLocalEntity(entity)) {
  console.log('É uma entidade local');
}
```

## 🏗️ Estrutura de Modelos

### Core Models

- **`Model`** - Modelo raiz do projeto
- **`Module`** - Módulo contendo entidades e enums
- **`Configuration`** - Configurações do projeto (linguagem, database, features)

### Entity Models

- **`LocalEntity`** - Entidade definida no módulo atual
- **`ImportedEntity`** - Referência a entidade de outro módulo
- **`FunctionEntity`** - Método/função de uma entidade

### Attribute Models

- **`Attribute`** - Atributo de entidade com tipo primitivo
- **`AttributeEnum`** - Atributo enum
- **`EnumX`** - Definição de enumeração
- **`EnumEntityAtribute`** - Atributo que referencia um enum

### Relationship Models

- **`OneToOne`** - Relacionamento 1:1
- **`OneToMany`** - Relacionamento 1:N
- **`ManyToOne`** - Relacionamento N:1
- **`ManyToMany`** - Relacionamento N:N

### Use Case Models

- **`UseCase`** - Caso de uso
- **`UseCasesModel`** - Modelo de casos de uso
- **`Actor`** - Ator do sistema
- **`Event`** - Evento do sistema

## 🔧 Type Guards

A biblioteca fornece type guards para verificação de tipos em runtime:

```typescript
import { isLocalEntity, isAttribute, isActor } from 'module-doc-lib';

if (isLocalEntity(entity)) {
  // TypeScript sabe que entity é LocalEntity
  console.log(entity.attributes);
}

if (isAttribute(attr)) {
  // TypeScript sabe que attr é Attribute
  console.log(attr.type);
}
```

## 🎯 Data Types Suportados

```typescript
type DATATYPE = 
  | 'boolean' 
  | 'string' 
  | 'integer' 
  | 'decimal' 
  | 'date' 
  | 'datetime'
  | 'email' 
  | 'cpf' 
  | 'cnpj' 
  | 'uuid' 
  | 'currency'
  | 'phoneNumber' 
  | 'mobilePhoneNumber' 
  | 'zipcode'
  | 'file' 
  | 'void';
```

## 💻 Linguagens Suportadas

```typescript
type LANGUAGETYPE = 
  | 'java'
  | 'python'
  | 'csharp-minimal-api'
  | 'csharp-clean-architecture';
```

## 🔍 Exemplo Completo

```typescript
import { Model, LocalEntity, Attribute } from 'module-doc-lib';

const userEntity: LocalEntity = {
  $type: 'LocalEntity',
  $container: module, // referência ao módulo pai
  name: 'User',
  comment: 'Entidade de usuário do sistema',
  is_abstract: false,
  attributes: [
    {
      $type: 'Attribute',
      $container: userEntity,
      name: 'name',
      type: 'string',
      comment: 'Nome do usuário'
    },
    {
      $type: 'Attribute',
      $container: userEntity,
      name: 'email',
      type: 'email',
      comment: 'Email do usuário'
    }
  ],
  enumentityatributes: [],
  functions: [],
  relations: []
};
```

## 📦 Exports

```typescript
// Versão da biblioteca
export const version: string;

// Todos os tipos e interfaces
export * from './models/model.js';

// Entidades
export type { FunctionEntity, ImportedEntity } from './models/entity.js';
export { isFunctionEntity, isImportedEntity, isLocalEntity } from './models/entity.js';

// Atributos
export type { Attribute, AttributeEnum } from './models/atribute.js';
export { isAttribute, isAttributeEnum } from './models/atribute.js';

// Atores
export { isActor } from './models/actor.js';
```

## 🧪 Testes

A biblioteca possui cobertura completa de testes:

```bash
npm test          # Roda todos os testes
npm run test:watch # Modo watch
```

**116 testes** cobrindo:
- Type guards (24 testes)
- Modelos de entidade (12 testes)
- Modelos de atributo (19 testes)
- Modelos de relacionamento (14 testes)
- Modelos de caso de uso (20 testes)
- Modelos core (20 testes)
- Utilitário de referência (7 testes)

## 🔄 Desenvolvimento

### Build

```bash
npm run build     # Build de produção
npm run dev       # Build em modo watch
```

### Commits

```bash
npm run commit    # Commit usando Commitizen
```

---

## 🚀 Workflow de Publicação (Changesets)

Este projeto utiliza **Changesets** para gerenciar versionamento semântico e publicação automatizada.

### Guia Rápido

1. **Desenvolvimento:** Faça suas alterações no código
2. **Changeset:** Crie um changeset
   ```bash
   npx changeset
   ```
   - Selecione o tipo: **patch** (bug fix), **minor** (nova feature) ou **major** (breaking change)
   - Escreva uma descrição clara da mudança
3. **Commit:** Commit das alterações + changeset gerado
   ```bash
   git add .
   git commit -m "feat: minha nova funcionalidade"
   git push origin main
   ```
4. **Pull Request "Version Packages":** O bot criará/atualizará automaticamente
5. **Merge:** Faça merge do PR para publicar no NPM

## 📄 Licença

Este projeto está licenciado sob a licença especificada no arquivo [LICENSE](./LICENSE).

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças usando Commitizen (`npm run commit`)
4. Crie um changeset (`npx changeset`)
5. Push para a branch (`git push origin feature/MinhaFeature`)
6. Abra um Pull Request

## 📞 Suporte

Para questões e suporte:
- Entre em contato com a equipe LEDS

---

**module-doc-lib** v1.17.0 - Desenvolvido pelo time LEDS
