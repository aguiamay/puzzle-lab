# Etapa 1.1 — Estabilização, UX e preparação geométrica

## Escopo
Correções localizadas sobre a etapa 1. Não foram alterados dependências, tipos/quantidade de peças, grade 4 × 3, encaixes, solução conhecida ou critérios de vitória. Não há implementação de arraste, backend, multiplayer ou etapa 2. `AGENTS.md`, prompt e referência foram lidos; documentação e todos os componentes/módulos geométricos foram inspecionados. Este relatório substitui o comportamento de clique e o roteiro de sobreposição descritos na etapa 1; o documento anterior permanece como registro histórico.

## Problemas confirmados e correções
- `GameBoard` tratava casa ocupada como tentativa de colocação quando uma peça disponível estava selecionada. Agora toda casa ocupada despacha SELECT_PIECE; toda casa vazia despacha PLACE_PIECE. Remoção continua sendo exclusivamente uma ação explícita. A validação de sobreposição continua ativa quando uma peça ancorada em casa vazia alcança outra peça.
- Cores estavam mapeadas por IDs (`A-1`, `A-2` etc.). Agora `presentation.ts` associa cores a códigos de tipo, com cor de fallback. A-1 e A-2 compartilham cor, mas mantêm IDs visíveis e seleção independente. Nenhum dado visual foi inserido no motor.
- Cada casa candidata recalculava transformação, ocupação e busca de encaixes. `validAnchors` usa o mesmo validador de `validatePlacement`, preparando geometria/ocupação/índice de encaixes uma vez por consulta em lote. `GameBoard` memoiza ocupação por snapshot e âncoras por snapshot/peça. Não há cache global nem estado derivado persistido. A memoização evita recalcular em mudanças apenas de feedback; não se alega ganho mensurado de FPS.
- Textos de orientação/disponibilidade tinham 11px; passaram a 13px. Coordenadas SVG mediram apenas 11px de altura no celular antes da alteração; foram ampliadas em unidades do viewBox, assim como IDs no tabuleiro. Prévia de peças passou de 64 para 80px de altura para facilitar a leitura dos encaixes; proporção preservada pelo viewBox. SVG do tabuleiro explicita `height: auto`.
- Seleção e orientação ficavam na bandeja, abaixo do tabuleiro no celular. Resumo derivado da peça selecionada agora fica junto aos controles, incluindo a ação seguinte. Destaques de foco/hover mantêm espessura visível. Transição continua respeitando movimento reduzido.
- Não foram encontrados overflow horizontal, distorção de células ou controles sobrepostos nas resoluções exigidas; nenhuma correção artificial de geometria ou reestruturação de layout foi aplicada.
- Ao iniciar a inspeção, `next dev` anexou automaticamente seu bloco ao AGENTS.md. O bloco foi removido, restaurando o conteúdo original (4995 bytes), e `next.config.ts` define `agentRules: false` para impedir novas alterações automáticas. Não há nova diretriz permanente proposta.

## Decisões preservadas e preparação para arraste
Motor TypeScript puro, determinístico, sem imports de React, DOM, SVG ou eventos. Estado serializável. A interface resolve cores e eventos; o motor mantém regras discretas.

A rotação e normalização existentes foram verificadas e preservadas. `docs/geometry-assumptions.md` agora explicita origem local, índices de células, caixa normalizada, âncora, transformação e relação com o ponto de interação. Distingue rotação de índice discreto da de ponto contínuo e descreve como preservar o ponto agarrado no futuro. Não foram introduzidos offsets em pixels, handlers de arraste ou abstrações genéricas.

Histórico sem mudança: colocação, remoção e rotação válidas produzem snapshots; seleção e erros não produzem jogadas, nem apagam redo. Undo/redo restauram snapshots completos. Nova jogada após undo invalida o futuro. Reset limpa tudo e não é desfeito. Sem limite fixo, como na etapa 1: a demonstração pequena não justificou mudar a semântica; sessões com muitas rotações podem aumentar o uso de memória. Reavaliar esse limite ao expandir o jogo.

## Arquivos modificados/criados
- `src/components/game/GameBoard.tsx`: seleção direta, cores por tipo e consultas memoizadas.
- `src/components/game/GamePiece.tsx`: cor pelo tipo e prévia ampliada.
- `src/components/game/PieceTray.tsx`: passa código do tipo à apresentação.
- `src/components/game/GameToolbar.tsx`: seleção/orientação e orientação de uso perto das ações.
- `src/components/game/Game.tsx`: instruções e identificação da etapa 1.1.
- `src/components/game/Game.module.css`: legibilidade, foco e dimensão SVG.
- `src/components/game/presentation.ts` (novo): cores por tipo e fallback.
- `src/game/engine/placement.ts`: validação compartilhada e consulta em lote de âncoras; regras preservadas.
- `next.config.ts` (novo): desativa edição automática das instruções pelo Next.
- `docs/geometry-assumptions.md`: esclarecimento de coordenadas.
- `docs/stage-01-1.md` (novo): este relatório.
- `README.md`: link para o relatório atual.

## Execução
Com dependências já instaladas: `npm run dev`, abrir http://localhost:3000. Em checkout novo: `npm ci` primeiro. Produção: `npm run build` e `npm start`. Nenhuma dependência foi instalada ou atualizada nesta etapa. Playwright e bibliotecas temporárias já existentes da etapa anterior foram reutilizados para QA; não integram o projeto.

## Verificações
- `npm run typecheck`, `npm run lint`, `npm run build`: aprovados. Build gera `/` como rota estática.
- Verificação pontual via Node, sem suíte unitária adicionada: 32 ações com comparação de determinismo e imutabilidade; 20 combinações instância/orientação para comparar âncoras em lote e validação individual; quatro rotações restauram geometria original. Encaixe incompatível, limite, sobreposição, duplicação, rotação recusada, remoção, histórico, bifurcação, reset e solução conhecida aprovados. Vitória rejeitada com peça ausente, não colocada ou sobreposta.
- Chromium/Playwright contra `npm start -- --hostname 127.0.0.1 --port 3001`: HTTP 200 em 1440×900, 768×1024 e 390×844. Fluxo completo em cada resolução, com clique no desktop e toque emulado no tablet/celular. Seleção de outra peça disponível; seleção direta de colocada enquanto outra disponível estava selecionada; sobreposição iniciada em casa vazia; incompatibilidade; limites; rotação recusada; remoção; undo/redo; bifurcação; vitória; reset. Todos aprovados.
- Zero erros JavaScript e zero overflow horizontal. Células quadradas, com lados de 103,2 / 109,5 / 68,3px nas três resoluções. Mesma cor de A-1/A-2 conferida no SVG. Movimento reduzido: duração de transição 0s. Enter/Espaço selecionam e posicionam; Enter também seleciona peça colocada após selecionar outra disponível.
- Capturas de desktop e celular inspecionadas visualmente; tablet também capturado. Nenhuma regressão conhecida nos cenários executados.
- Não verificados: Safari, Firefox, leitor de tela real ou dispositivos físicos. Toque emulado não equivale a teste físico. Rolagem vertical para alcançar a bandeja no celular continua esperada.

## Roteiro manual (linha/coluna a partir de 1)
1. Inicie a página nas três resoluções exigidas. Confira DEMO-01, cinco peças, encaixes legíveis, ausência de rolagem horizontal e resumo junto aos controles.
2. Selecione A-1, depois A-2: destaque deve acompanhar a seleção; ambas têm mesma cor e IDs distintos. Rotacione A-1: orientação deve mudar na bandeja e no resumo.
3. Reinicie. A-1 a 0° em L1 C3 deve ser recusada por incompatibilidade. Rotacione para 90° e tente L3 C1: recusar por limite. Progresso continua 0/12.
4. Com A-1 a 90°, coloque em L1 C2. Selecione A-2 a 0° e tente L1 C1 (vazia): segunda célula alcança A-1; recusar sobreposição, mantendo 2/12.
5. Ainda com A-2 selecionada, clique A-1 diretamente em L1 C2: selecionar A-1, sem erro de colocação. Clique Remover peça: 0/12. Desfaça e refaça: 2/12 e 0/12.
6. Desfaça a remoção e selecione B-1: Refazer continua disponível. Rotacione B-1: nova jogada deve desabilitar Refazer. Seleção e erros não entram no histórico.
7. Reinicie. Coloque A-1 a 0° em L1 C1 e A-2 a 0° em L2 C1. Selecione A-1 e rotacione: recusar por sobreposição, preservando orientação e posições.
8. Complete a solução: B-1 a 180° em L1 C3; C-1 a 0° em L3 C1; D-1 a 90° em L2 C4. Confira vitória em 12/12. Desfazer a última colocação deve voltar a 10/12; Refazer deve restaurar a vitória.
9. Remova uma peça e confirme fim do estado de vitória. Reinicie e confirme todas disponíveis a 0°, sem seleção, undo ou redo.
10. Repita seleção, colocação e seleção direta pelo teclado (Tab, Enter e Espaço). Ative movimento reduzido; confirme que não há transição de contorno. Teste toque em aparelho real quando disponível.

## Pendências e recomendações para a etapa 2
A geometria oficial continua desconhecida; DEMO-01 segue experimental. Persistência, catálogo jogável, solver, backend e multiplayer permanecem fora do escopo. Limitação conhecida do ESLint 9 e compatibilidade de plugins permanecem documentadas na etapa 1; versões não foram alteradas.

Somente após aprovação: implementar arraste a partir do contrato documentado, com conversão de coordenadas, preservação do ponto agarrado ao girar, política explícita de snap e cancelamento; testar em toque real e navegadores adicionais. Reavaliar acesso à bandeja no celular e limite de histórico conforme o escopo da etapa 2. Parar na etapa 1.1.

## Etapa 1.1.1 — Correção do círculo de foco gigante

### Diagnóstico confirmado

Ambiente relatado pelo usuário: Windows, Chrome 156.0.8078.80 (64 bits). Reprodução local: Linux, Chromium 156.0.8078.4 via Playwright já disponível, Next 16.4.3. Foram inspecionados GameBoard, GamePiece, PieceTray, CSS Module, globals.css, layout, next.config e o Shadow DOM de `nextjs-portal`.

Selecionar A-1 apenas na bandeja não reproduziu o problema. Após selecionar A-1 e clicar em L1 C1, o navegador focou o `<g role="button" tabindex="0">` da casa. Surgiu o círculo preto gigante com halo branco. **Não é um novo elemento circle criado pelo React nem geometria da peça: é a pintura do contorno de foco nativo do navegador no grupo SVG.**

Evidências obtidas pelo DOM, estilos computados e Chrome DevTools Protocol (`CSS.getMatchedStylesForNode`):

- Elemento ativo: `g`, `:focus = true`, `:focus-visible = false` após clique.
- Regra de origem `user-agent`: `:focus { outline-color: -webkit-focus-ring-color; outline-style: auto; outline-width: 5px; }`.
- Estilo computado: `outline: rgb(16, 16, 16) auto 5px`, `outline-offset: 0px`.
- O SVG usa viewBox `-0.38 -0.38 4.5 3.5`; no desktop sua matriz de apresentação tinha escala aproximada de 108,888 em ambos os eixos. O contorno é interpretado no espaço do SVG e ampliado, desenhando a região preta/branca muito além da casa.
- Os círculos reais mantiveram `r=0.105`, aproximadamente 22,87px de diâmetro no tabuleiro desktop. Antes de colocar, indicadores de âncora tinham `r=0.055`, aproximadamente 11,98px. Não havia círculo geométrico com raio gigante.
- Por Tab, `:focus-visible` ativava a regra de `globals.css`: `outline: 3px solid #155fba; outline-offset: 4px`. Esses valores também eram ampliados, produzindo um segundo defeito: contorno azul gigante.
- Remover temporariamente apenas o outline do grupo via estilo injetado na página eliminou o artefato mantendo o mesmo foco e a mesma geometria. O teste foi repetido em desenvolvimento e produção antes da alteração do arquivo.

### Next.js e configuração

`next.config.ts` **está presente neste workspace**, com `agentRules: false`. A opção foi confirmada em `node_modules/next/dist/server/config-shared.d.ts` e `config-schema.js` da versão instalada. Também foi confirmado suporte a `devIndicators: false`, mas **não foi necessário utilizá-lo**.

O indicador do Next apareceu com SVG de 40×40px dentro do Shadow DOM de `nextjs-portal`. A produção, sem esse portal, reproduziu o mesmo círculo de foco. Logo, o defeito não vem exclusivamente do ambiente de desenvolvimento ou do indicador. Ele permanece habilitado. O ZIP mencionado não foi disponibilizado nesta etapa; não é possível afirmar por que a configuração faltou naquela cópia. Ao distribuir o projeto, incluir o `next.config.ts` existente.

### Correção mínima

Única alteração funcional: em `src/components/game/Game.module.css`, acrescentado comentário explicativo e:

```css
.cell:focus { outline: none; outline-offset: 0; }
```

A regra local prevalece sobre o outline nativo e o global apenas nas casas do tabuleiro. A indicação acessível de foco continua pela regra já existente `.cell:focus-visible .cellSurface`, com borda azul e espessura de 0.06 unidades SVG. Os botões HTML mantêm seu outline global. Não foram alterados componentes React, lógica, geometria, cores, histórico, dependências, configuração Next ou AGENTS.md nesta etapa.

### Evidências visuais preservadas

Capturas reais, sem edição; PNGs servem apenas como documentação, nunca como renderização do jogo.

- [Estado inicial em desenvolvimento](evidence/stage-01-1-1/inicial-dev.png).
- [A-1 selecionada pela bandeja, sem defeito](evidence/stage-01-1-1/selecao-bandeja-dev.png).
- [Defeito após clique na casa — desenvolvimento](evidence/stage-01-1-1/defeito-dev.png) e [produção](evidence/stage-01-1-1/defeito-producao.png).
- [Após correção — desenvolvimento](evidence/stage-01-1-1/corrigido-dev.png), [produção](evidence/stage-01-1-1/corrigido-producao.png) e [celular em produção](evidence/stage-01-1-1/corrigido-celular.png).
- Foco por teclado: [antes](evidence/stage-01-1-1/foco-teclado-antes.png) e [depois](evidence/stage-01-1-1/foco-teclado-depois.png).

### Verificações executadas

- `npm run dev -- --hostname 127.0.0.1`: diagnóstico e validação em http://localhost:3000.
- `npm start -- --hostname 127.0.0.1 --port 3001`: comparação de produção antes e depois em http://localhost:3001.
- `npm run typecheck`, `npm run lint`, `npm run build`: aprovados após a alteração CSS.
- Seis cenários de navegador: desenvolvimento e produção, cada um em 1440×900, 768×1024 e 390×844. HTTP 200; clique no desktop e toque emulado nas demais resoluções. Em todos: selecionar A-1/A-2/B-1/C-1/D-1; quatro rotações de cada peça; colocar, remover e selecionar peça já colocada; incompatibilidade de encaixe; limite; sobreposição; rotação recusada; undo/redo; solução completa em 12/12 e reinício em 0/12. Todos aprovados, sem erros JavaScript ou overflow horizontal.
- Foco após colocação: `outline-style: none`, offset 0; por Tab, foco continua no grupo SVG e a borda da célula fica `rgb(21,95,186)`. Capturas pós-clique e pós-Tab inspecionadas; sem círculo gigante e sem contorno azul ampliado.
- Portal Next presente nas três verificações de desenvolvimento e ausente nas três de produção, sem artefato após a correção. Servidores temporários encerrados ao concluir.

O teste anterior da etapa 1.1 verificava ações e resultado lógico, mas não validava o contorno pintado imediatamente após focar a casa. A afirmação anterior de ausência de regressões conhecidas deve ser lida com essa limitação; esta etapa acrescentou inspeção visual e de estilo nesse estado específico.

### Arquivos alterados e limitações

Alterados: `src/components/game/Game.module.css` e este `docs/stage-01-1.md`. Adicionadas nove capturas em `docs/evidence/stage-01-1-1/`. Nenhuma biblioteca adicionada. Motor e premissas geométricas intactos.

Defeito eliminado e validado no Chromium Linux disponível. Não executado diretamente no Chrome 156.0.8078.80 do Windows informado pelo usuário, nem em Firefox, Safari ou dispositivo físico. Esses ambientes precisam de homologação manual; não há outra falha observada nos cenários executados. Drag-and-drop, multiplayer e etapa 2 permanecem fora do escopo.

### Roteiro manual de homologação

1. Execute `npm run dev`, abra http://localhost:3000 e recarregue a página. Selecione A-1: destaque normal na bandeja, sem círculo sobre o tabuleiro.
2. Clique L1 C1 para colocá-la e depois em uma casa ocupada para selecioná-la. Confirme ausência do círculo preto/halo branco.
3. Pressione Tab para navegar entre casas. Confirme borda azul localizada, sem contorno gigante. Nos botões da bandeja e barra, confirme foco visível normal.
4. Selecione A-1, A-2, B-1, C-1 e D-1; rotacione cada uma. Teste remover, desfazer/refazer, erros e solução conhecida conforme o roteiro da etapa 1.1 acima. Reinicie.
5. Repita em 1440×900, 768×1024 e 390×844. Para produção, encerre dev, execute `npm run build` e `npm start` e repita os passos. O indicador do Next só aparece em desenvolvimento; o jogo deve permanecer sem o artefato nos dois modos.

Etapa 1.1.1 encerrada. Aguardar homologação e aprovação antes de qualquer próxima etapa.
