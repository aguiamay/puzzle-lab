# Etapa 1 — Fundação e motor geométrico

## Escopo e arquitetura
Aplicação local Next.js App Router, React e TypeScript estrito, sem backend de aplicação. Componentes em `src/components/game`, tokens e CSS Modules; toda a geometria é SVG. Motor puro em `src/game/engine`: tipos, normalização, translação, rotação horária, encaixes, ocupação, vitória e reducer determinístico. Dados em `src/game/data`; hook React em `src/game/state` apenas conecta o reducer à interface.

Tipos e instâncias são separados; A-1 e A-2 compartilham geometria, mas possuem orientação e posição próprias. Seleção fica fora dos snapshots lógicos; não consome undo nem apaga redo. Rotação, colocação e remoção válidas entram no histórico; erros preservam estado e histórico. Nova ação lógica após undo descarta redo. Rotação de peça posicionada é atômica, validada na mesma âncora, desconsiderando apenas a própria ocupação. Reset limpa seleção, orientação, posições e histórico; não é desfeito. Não há persistência após recarregar.

As casas indicadas com ponto e contorno verde são âncoras válidas para a caixa delimitadora inteira da peça selecionada. Com peça disponível selecionada, clicar em casa ocupada tenta colocar e apresenta sobreposição; para selecionar a peça já colocada nesse caso, use sua bandeja. Sem seleção ou com peça colocada selecionada, clicar em casa ocupada seleciona seu ocupante. Teclado: Tab navega, Enter/Espaço ativa casas e botões. Erros são anunciados por região viva.

Somente DEMO-01 aparece na interface. Catálogo original preservado na referência, sem importação nesta etapa. `geometryStatus: verified` refere-se apenas às regras próprias da demonstração. Veja `geometry-assumptions.md` para evidências e limites.

## Dependências e execução
Node >=20.9 (ambiente: 22.22.2). Instalar com `npm ci`; iniciar com `npm run dev`; abrir http://localhost:3000. Produção: `npm run build` e `npm start`. Framework Next e React são necessários para a stack solicitada; TypeScript, tipos e ESLint são ferramentas de validação. Nenhuma dependência de geometria, ícones, imagens ou estado. Versões estáveis consultadas no registro npm; lockfile registra a resolução exata. Versões finais: Next 16.4.3, React 19.3.1, TypeScript 6.0.3, ESLint 9.39.5. TypeScript 7 foi recusado pelo typescript-eslint; foi mantido o 6 por compatibilidade. ESLint 10 passou no lint, mas seus plugins transitivos de importação, React e acessibilidade declaram suporte apenas até 9; por isso foi mantido ESLint 9.39.5. O npm marca essa versão como fora de suporte: limitação conhecida da cadeia de ferramentas, a revisar quando o preset suportar os plugins atualizados. Não foram forçados peers via overrides.

Documentação de instalação consultada: https://nextjs.org/docs/app/getting-started/installation (Node mínimo, instalação manual e lint separado do build).

## Roteiro manual reproduzível
Coordenadas da interface são **linha e coluna começando em 1**. A posição indica o canto superior esquerdo da caixa delimitadora, que pode conter um espaço vazio dependendo da rotação.

1. Abra a página. Confirme DEMO-01, versão experimental, grade 4 × 3, cinco instâncias e progresso 0/12. Sem seleção, rotação e remoção ficam desabilitadas.
2. Selecione A-1. Observe destaque e âncoras verdes. Clique linha 1, coluna 3: recusar por encaixe incompatível mesmo havendo espaço para duas células; progresso continua zero.
3. Ainda com A-1 a 0°, clique linha 3, coluna 4: recusar por limite ou encaixe (o motor retorna o primeiro problema). Para verificar exclusivamente limites, rotacione A-1 para 90° e clique linha 3, coluna 1: ultrapassa a borda inferior.
4. Reinicie. A-1 a 0° em linha 1, coluna 1 deve ocupar duas casas; progresso 2/12.
5. Selecione A-2 e clique linha 1, coluna 2: recusar sobreposição. Selecione A-1 pela bandeja e clique em casa vazia: recusar reutilização da mesma instância.
6. A-2 a 0° em linha 2, coluna 1. Selecione A-1 e tente rotacionar: recusar sobreposição com A-2, sem mudar sua orientação nem histórico.
7. Remova A-1, desfaça e refaça: casas/progresso devem acompanhar exatamente. Desfaça novamente; selecione outra peça e confirme que Refazer continua disponível. Faça uma rotação válida: a nova ação limpa Refazer.
8. Reinicie e execute a solução completa: **A-1 0° em L1 C1; A-2 0° em L2 C1; B-1 180° (duas rotações) em L1 C3; C-1 0° em L3 C1; D-1 90° (uma rotação) em L2 C4**. Resultado: 12/12, cinco peças e mensagem de conclusão.
9. Desfaça a última colocação: conclusão desaparece, 10/12. Refaça: retorna a 12/12 e concluído. Selecione e remova uma peça: volta a incompleto. Reinicie: todas disponíveis a 0°, sem seleção/histórico.
10. Verifique desktop (1280px), tablet (768px), celular (390px e 320px): sem rolagem horizontal ou sobreposição; células e controles confortáveis. Repita seleção/rotação/colocação por toque em dispositivo real.
11. Use somente Tab, Enter e Espaço para selecionar A-1 e colocá-la. Confira foco visível, nomes de casas e feedback textual com leitor de tela. Zoom de 200% não deve ocultar controles.

## Verificações executadas
- Inspeção Python do HTML: 509 entradas, ordem 001–509, quatro categorias e códigos iguais de 021/025 confirmados.
- `npm run typecheck`: aprovado (TypeScript estrito).
- `npm run lint`: aprovado, sem erros ou avisos de lint.
- `npm run build`: aprovado; rota `/` pré-renderizada estaticamente. O build inicial não foi executado após o erro de lint com TS7; foi executado novamente com a configuração compatível.
- Verificação pontual via Node, sem criar suíte unitária: 31 ações; determinismo comparando repetição sobre estado serializado; imutabilidade de entrada; quatro rotações restaurando a geometria; encaixes, limites, duplicação, sobreposição, remoção, histórico, bifurcação após undo, reset e solução documentada aprovados.
- `npm start -- --hostname 127.0.0.1`: iniciou; `curl -fsS http://127.0.0.1:3000` retornou HTTP 200 com SVG e controles no HTML. Servidor temporário encerrado após os testes.
- Playwright temporário via `npm exec --yes --package=@playwright/test`, sem dependência adicionada ao projeto: Chromium, 1280/768/390/320px. Fluxo completo até vitória; encaixe incompatível; sobreposição; rotação recusada; desfazer/refazer; remoção; reset. Todos aprovados. Clique em desktop e toque emulado nas demais larguras; zero erros JavaScript e zero overflow horizontal. Casas mediram pelo menos 53,5px no cenário de 320px.
- Teclado no Chromium: Enter selecionou A-1, Espaço colocou a peça, progresso 2/12. Capturas desktop e celular inspecionadas visualmente.
- Chromium inicialmente não iniciou por ausência de bibliotecas do sistema. Bibliotecas foram baixadas e extraídas em `/tmp/puzzle-browser-libs`, usadas via `LD_LIBRARY_PATH`, sem instalação de pacotes no sistema. Reexecução aprovada. Nenhum desses artefatos temporários integra a aplicação.
- Não executados: dispositivos físicos, Safari, Firefox e leitor de tela real. O roteiro manual permanece necessário para aceite do usuário.

## Arquivos criados
- Configuração: `.gitignore`, `package.json`, `package-lock.json`, `tsconfig.json`, `next-env.d.ts`, `eslint.config.mjs`, `README.md`.
- App: `src/app/layout.tsx`, `page.tsx`, `globals.css`; tokens em `src/styles/tokens.css`.
- Interface: `src/components/game/Game.tsx`, `GameBoard.tsx`, `GamePiece.tsx`, `PieceTray.tsx`, `GameToolbar.tsx`, `GameStatus.tsx`, `Game.module.css`.
- Motor: `src/game/engine/types.ts`, `geometry.ts`, `transformations.ts`, `placement.ts`, `validation.ts`, `reducer.ts`.
- Dados e integração: `src/game/data/pieces.ts`, `demo.ts`, `src/game/state/useGame.ts`.
- Documentação: `docs/geometry-assumptions.md`, `docs/stage-01.md`.
- `AGENTS.md`, `prompts/etapa-1.md` e `references/JogoCilada.html` foram preservados.

## Limitações e pendências
Geometria real, espelhamento e regras oficiais não foram verificados. Somente quadrados unitários e encaixes simétricos círculo/quadrado; modelo não afirma representar geometrias contínuas. Histórico em memória sem limite fixo nesta demonstração pequena. Sem persistência, drag-and-drop, solucionador, catálogo jogável, progressão, backend ou multiplayer. Base semântica presente; avaliação completa com leitores de tela e dispositivos reais depende de teste manual.

## Próximos passos, apenas após aprovação
Aguardar teste e aprovação explícita do usuário. A etapa 2 poderá evoluir UX/interações conforme seu próprio prompt; nada dela foi implementado nesta entrega.
