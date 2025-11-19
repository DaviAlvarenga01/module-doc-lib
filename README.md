# 🚀 Workflow de Publicação Automática (Changesets)

Este projeto utiliza **Changesets** para gerenciar versionamento
semântico, geração de changelogs e publicação no NPM de forma
automatizada.

## 🔄 Resumo do Fluxo

Não alteramos mais a versão no `package.json` manualmente. O fluxo segue
este ciclo:

1.  **Desenvolvimento:** Alteração do código.
2.  **Changeset:** Criação de uma "intenção de mudança" localmente.
3.  **Pull Request Automático:** O bot cria um PR acumulando as
    mudanças.
4.  **Publicação:** O merge desse PR dispara a publicação no NPM.

------------------------------------------------------------------------

## 🛠️ Guia para Desenvolvedores

### 1. Codificação

Trabalhe no código normalmente (correções de bugs, novas features, etc).

### 2. Gerar um Changeset

**Antes de commitar**, se a sua alteração impacta a biblioteca e requer
uma nova versão, rode no terminal:

``` bash
npx changeset
```

Um menu interativo aparecerá. Use as setas e a barra de espaço para
selecionar:

-   **Patch:** Correções de bugs (ex: 1.0.0 -\> 1.0.1).
-   **Minor:** Novas funcionalidades compatíveis (ex: 1.0.0 -\> 1.1.0).
-   **Major:** Mudanças que quebram compatibilidade (ex: 1.0.0 -\>
    2.0.0).

Escreva um resumo da mudança quando solicitado. Isso gerará um arquivo
temporário na pasta `.changeset`.

### 3. Commit e Push

Inclua o arquivo gerado pelo changeset no seu commit:

``` bash
git add .
git commit -m "feat: minha nova funcionalidade"
git push origin main
```

------------------------------------------------------------------------

## 🤖 O Processo de Release (GitHub Actions)

### 1. O Pull Request "Version Packages"

Quando o GitHub detecta novos arquivos de changeset na branch `main`:

-   O bot **NÃO publica a versão imediatamente**.
-   Ele abre (ou atualiza) automaticamente um Pull Request chamado
    **"Version Packages"**.

Este PR contém:

-   A atualização da versão no `package.json`.
-   As atualizações no `CHANGELOG.md`.
-   A remoção dos arquivos temporários `.changeset`.

### 2. Publicando a Versão

Vários desenvolvedores podem enviar changesets. O PR "Version Packages"
irá acumular todas as mudanças.

Para efetivar o lançamento:

1.  Acesse o PR **"Version Packages"**.
2.  Faça o **Merge** dele na `main`.

O GitHub Actions rodará na `main`, publicará o pacote no NPM e criará as
tags no Git automaticamente.
