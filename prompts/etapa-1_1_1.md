# CODEX — ETAPA 1.1.1: Diagnóstico e correção do defeito visual

Estamos trabalhando no Puzzle Lab, projeto Next.js + React + TypeScript + SVG.

A Etapa 1.1 foi implementada, mas existe um defeito visual que impede sua homologação.

## Defeito observado

Ao selecionar uma peça, aparece um círculo preto gigantesco, com uma região branca ao redor, sobrepondo o tabuleiro.

Esse elemento não deveria aparecer.

O problema ocorre em desenvolvimento, acessando `localhost:3000`.

## Sua tarefa

Identificar a causa real do defeito e corrigi-la com a menor alteração possível.

### 1. Investigar antes de modificar

Inspecione:

- `GameBoard.tsx`
- `GamePiece.tsx`
- `PieceTray.tsx`
- `Game.module.css`
- `globals.css`
- `layout.tsx`
- `next.config.ts`, caso exista
- Elementos adicionados pelo Next.js em desenvolvimento

Verifique especificamente:

1. Se algum SVG está sendo renderizado com dimensões inesperadas.
2. Se elementos `circle`, `g` ou `svg` recebem estilos incorretos.
3. Se há conflitos de CSS global.
4. Se o defeito está relacionado ao foco ou à seleção de elementos SVG.
5. Se o Next.js Dev Indicator ou outro elemento do ambiente de desenvolvimento está envolvido.

Não aplique correções CSS arbitrárias antes de descobrir a origem.

### 2. Reproduzir e diagnosticar

Se houver navegador automatizado disponível:

- Inicie a aplicação com `npm run dev`.
- Abra a página.
- Capture o estado inicial.
- Selecione A-1.
- Capture a interface após a seleção.
- Inspecione o DOM e os estilos computados do elemento responsável pelo círculo.
- Registre qual elemento está sendo desenhado, quem o criou e qual regra determina suas dimensões.

Se o problema não aparecer automaticamente, investigue possíveis diferenças entre navegador, resolução e ambiente de desenvolvimento.

Não declare a causa como confirmada sem evidência.

### 3. Verificar o Next.js

A documentação da Etapa 1.1 menciona um arquivo `next.config.ts` contendo uma configuração para impedir alterações automáticas no `AGENTS.md`.

Entretanto, esse arquivo não estava presente no ZIP utilizado na revisão.

Confirme se existe no workspace atual.

Se estiver ausente, verifique a configuração efetivamente suportada pela versão instalada do Next.js e corrija a documentação ou a configuração conforme necessário.

Como teste diagnóstico, avalie executar a aplicação em modo de produção e comparar o comportamento com o modo de desenvolvimento.

Se for identificado que o defeito vem exclusivamente do indicador de desenvolvimento, é aceitável desabilitar `devIndicators` na configuração do Next.js, desde que o problema desapareça e nenhuma outra funcionalidade seja afetada.

### 4. Corrigir sem regressões

Preserve integralmente:

- Geometria das peças.
- Rotação.
- Posicionamento.
- Colisões.
- Seleção.
- Remoção.
- Desfazer e refazer.
- Condições de vitória.

Não reescreva componentes desnecessariamente.

Não introduza bibliotecas novas.

### 5. Verificar o resultado

Teste:

1. Selecionar A-1 e A-2.
2. Selecionar B-1, C-1 e D-1.
3. Rotacionar cada peça.
4. Posicionar e remover peças.
5. Selecionar uma peça já posicionada.
6. Completar o desafio.
7. Reiniciar.
8. Repetir as ações nas resoluções 1440 × 900, 768 × 1024 e 390 × 844.

Verifique tanto `npm run dev` quanto a execução da build de produção, quando possível.

Execute typecheck, lint e build.

### 6. Entrega

Apresente:

- Causa raiz confirmada ou hipótese ainda não comprovada.
- Evidências do diagnóstico.
- Arquivos modificados.
- Correção aplicada.
- Resultados dos testes.
- Problemas que permaneceram.

Atualize `docs/stage-01-1.md` com uma seção sobre a correção.

Não implemente drag-and-drop, multiplayer ou funcionalidades da Etapa 2.

**Pare após eliminar e validar o defeito.**
