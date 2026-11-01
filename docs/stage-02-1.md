# Etapa 2.1 — Rotação, precisão visual e bandeja mobile

## Diagnóstico e correções
O motor e a confirmação estavam corretos. Reproduzido o último encaixe D-1 a 90° em 390×844: escala da bandeja 21,30px/unidade contra 68,67px/unidade no tabuleiro. Ao agarrar o ponto local (0.5,1.5), as origens da cópia flutuante e da prévia diferiam em aproximadamente 71,05px no eixo y. A Ghost Piece indicava `(3,1)` e a soltura resultava em 12/12. Portanto, o deslocamento confirmado era visual, por duas representações em escalas diferentes, sem offset touch ou erro nas regras.

Agora, fora do tabuleiro, a escala interpola da origem para a escala do tabuleiro ao longo de uma célula de aproximação. A origem visual continua `ponteiroTela - contatoLocal × escala`. Dentro, quando existe snap, apenas a Ghost Piece representa a candidata, com ID, ✓/× e exatamente os mesmos limites de células do tabuleiro. Elimina-se a cópia flutuante menor sobreposta. O teste compara as coordenadas DOM das células da prévia e da peça final, com diferença inferior a 0,1px.

Rotação preserva a fórmula existente para ponto contínuo: `(u,v) → (H-v,u)`, onde H é a altura normalizada antes de girar. A origem candidata continua `ponteiroLógico - contatoLocal`, usando a inversa de `getScreenCTM`. Não foram introduzidos offsets geométricos em pixels. Geometria, validação, reducer e histórico do motor não foram modificados.

## Controles
- R e botão existente preservados.
- Botão direito durante arraste de mouse gira 90° mantendo esquerdo pressionado; menu de contexto é impedido apenas durante a sessão ativa.
- O Chromium pode liberar captura após o chord de botões. A captura é recuperada especificamente na transição do botão direito, se o esquerdo ainda estiver pressionado. Outras perdas continuam cancelando.
- Durante arraste touch, um segundo toque de até 300ms e deslocamento de até 10px gira uma vez ao levantar. Movimentos/pressões longas não giram. O ID do ponteiro principal nunca muda e o segundo ponteiro nunca confirma a jogada. Cliques derivados desse segundo toque são suprimidos.
- Botões explícitos de giro/cancelamento continuam disponíveis e são excluídos do reconhecimento do gesto genérico para evitar giro duplo. Fora de sessão ativa, não há interceptação de segundo toque nem bloqueio permanente de zoom.

## Assistência final
Checkbox “Ajudar no último encaixe próximo”, inicialmente ligado, desativável fora do gesto. Distância configurável em `LAST_PLACEMENT_RADIUS`, atualmente 0,9 célula, comparada por eixo. Snap normal mantém histerese de 0,62 célula.

A assistência só atua em demonstração com geometria verificada, exatamente uma instância não colocada, na orientação candidata atual, e exatamente uma âncora válida retornada pelo validador existente. Ponteiro precisa estar dentro do tabuleiro e origem candidata dentro do raio. Não busca orientações, não resolve desafios futuros e não confirma sem soltura. Mais de uma posição, ausência de posição, opção desligada ou distância excessiva não recebem assistência. Mensagem identifica quando o encaixe está assistido.

## Bandeja responsiva
Desktop mantém grade lateral e arraste pelo desenho. Até 800px, faixa recolhida com botões compactos das peças disponíveis, controle “Ver todas as peças” e controle explícito de arraste da seleção. “Girar peça” permite pré-rotação com um dedo.

Expandida, apresenta todas as instâncias em grade, orientação e estado, rolagem vertical e botão Recolher. Selecionar recolhe a grade e permite tocar numa casa, sem arrastar. Desenhos da grade mobile não iniciam arraste: usam `pan-y pinch-zoom`, priorizando navegação. O arraste inequívoco começa no controle “Arrastar ID” da faixa recolhida ou na própria peça colocada no tabuleiro. Não exige long-press.

Expandir está desabilitado durante o gesto, evitando mudanças de origem. Safe area e espaço inferior reservado permitem alcançar os controles da página. A grade pode cobrir temporariamente o tabuleiro enquanto aberta; recolher ou selecionar restaura sua visualização. Não há scroll horizontal obrigatório.

Em desenvolvimento, o indicador Next interceptava cliques no primeiro botão/controle da faixa. A tentativa de reposicioná-lo não eliminou a interceptação nos testes. Foi desativado com `devIndicators: false`, sem alterar o layout do produto para compensá-lo. `agentRules: false` preservado; AGENTS.md intacto.

## Arquivos
Modificados: `src/game/state/useDragInteraction.ts`, `src/game/interaction/snap.ts`, `src/components/game/DragPreview.tsx`, `PieceTray.tsx`, `Game.tsx`, `Game.module.css`, `next.config.ts`, `README.md`. Criados: este relatório e capturas em `docs/evidence/stage-02-1/`. Nenhuma dependência, regra ou geometria adicionada/alterada; etapas anteriores preservadas.

## Verificação
- `npm run typecheck`, `npm run lint` e `npm run build`: aprovados na configuração final.
- Chromium Linux em desenvolvimento: aprovados os testes de mouse em 1440×900, 768×1024 e 390×844; rotação R e botão direito, múltiplas rotações, comparação da prévia com posição final, solução, colisão recusada, reposicionamento e undo/redo.
- Aprovados os testes de toque via CDP emulado em 768×1024 e 390×844: expandir/recolher, cinco peças, scroll sobre desenhos sem iniciar arraste, pré-rotação pelo botão, segundo toque gira uma vez, segundo dedo em movimento não gira, principal confirma.
- Verificação pontual Node da assistência: única posição próxima, desativação, recusa distante e fora do tabuleiro. Não foi criada suíte unitária.
- Evidências: [deslocamento anterior](evidence/stage-02-1/deslocamento-antes.png), [grade mobile](evidence/stage-02-1/grade-mobile.png), [prévia mobile](evidence/stage-02-1/previa-mobile.png).
- Não houve testes físicos de multitouch, Windows/Chrome, Safari, Firefox ou leitor de tela. Não atribuir a emulação equivalência a esses ambientes.

## Execução e homologação
`npm run dev`, abrir http://localhost:3000. Instalação nova: `npm ci`. Produção: `npm run build` e `npm start`.

1. Desktop: arraste A-1 mantendo esquerdo pressionado, pressione R, depois botão direito. Verifique giro sem menu ou fim do gesto. Solte em encaixe válido.
2. Repita com B-1/D-1 após múltiplos giros. A Ghost Piece deve coincidir com a posição confirmada, sem cópia menor deslocada.
3. Tablet/celular: abra Ver todas, confira cinco peças, role verticalmente começando sobre um desenho; não deve iniciar arraste. Recolha e abra novamente.
4. Selecione uma peça na grade; ela deve recolher. Use Girar peça e toque numa casa para jogar sem arraste.
5. Arraste pelo controle da peça selecionada. Dê um segundo toque breve numa área livre: gira uma vez. Mova o segundo dedo: não gira continuamente. Levante-o: o principal continua arrastando.
6. Complete A-1 0° em L1 C1, A-2 0° em L2 C1, B-1 180° em L1 C3, C-1 0° em L3 C1 e D-1 90° em L2 C4. Confira 12/12; desfazer/refazer e reiniciar.
7. Antes de D-1, compare assistência ligada/desligada aproximando sua origem a menos de 0,9 célula da posição única. Distante ou fora do tabuleiro nunca confirma. A soltura confirma apenas a prévia válida.
8. Reposicione uma peça, tente sobreposição, remova e teste undo/redo. Teste Escape e reinício durante arraste, além de teclado e foco SVG sem círculo gigante.
9. Repita nas três resoluções exigidas e no Chrome/Windows e dispositivos físicos disponíveis.

## Limitações e escopo
Grade expandida é uma área temporária de seleção, não uma superfície de arraste. Sem auto-scroll durante gesto; telas muito baixas podem exigir rolar antes de iniciar. Assistência só considera a orientação atual da demonstração, sem solver. Sem novos desafios, catálogo, multiplayer ou etapa 3. Aguardar homologação manual.
