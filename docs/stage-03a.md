# Etapa 3A — Reconstrução geométrica parcial

## Estado da entrega
Progresso verificável entregue; **reconstrução fiel ainda não concluída**. Fontes acessíveis permitiram transcrever grade, marcas e contornos. Faltam evidências para associar as dez geometrias observadas às letras A–N e certificar as regras físicas. Não foi liberado desafio original. Não avançamos para 3B, 3C ou 3D.

Lidos AGENTS.md, prompt, relatórios anteriores e referência HTML; motor, renderização e interações inspecionados antes da implementação. Fonte local e três PNGs da página dudz foram conferidos visualmente. Também consultada a página do fabricante; tentativa de manual sem sucesso. [Relatório de pesquisa](original-geometry-research.md) detalha fontes, classificação VERIFIED/INFERRED/UNKNOWN, matriz, contornos e materiais faltantes.

## Implementação
- `/` preserva DEMO-01; `/lab/demo` oferece a mesma configuração aprovada, com cinco instâncias e grade 4 × 3.
- `/lab/research` contém PESQUISA-001, rotulada não validada: 7 × 4, 28 unidades, dez tipos locais R01–R10, 12 instâncias. R02 e R03 repetidos são instâncias independentes. Nenhum mapeamento arbitrário para A–N.
- Dados de pesquisa separados em `board.ts`, `pieces.ts`, `puzzle.ts`; fontes, confiança e `originalCode: null` explícitos. A disposição observada é uma lista de ações geométricas, sem PNG em runtime. Não há botão de solução automática.
- `Game` recebe uma configuração; componentes, hooks de arraste, snap, contato, rotação e histórico são reutilizados. Dimensão/título derivados da configuração. Links permitem acessar os dois laboratórios. Assistência final não é habilitada na pesquisa não verificada.
- Extensão aditiva do contrato: marca simétrica `cross`, representada por SVG e nome acessível “cruz”. Validador compara marcas por igualdade, como antes. Mensagem de incompatibilidade inclui a cruz. Cores não decidem encaixes; tipos novos usam a cor neutra de fallback já existente.
- Coordenadas inteiras e marcas centrais são adequadas à transcrição disponível, não uma garantia sobre qualquer geometria física. Quartos de volta são hipótese explícita do laboratório; espelhamento continua desabilitado. Transformações/normalização, validação, reducer e estados permanecem independentes de React.
- `uniqueOrientations` deduplica ocupação **e marcas**, mantendo orientações distintas se as marcas trocarem de posição. R02 tem quatro orientações; R03, duas. Não muda a UX de girar em passos de 90°.
- Auditoria pura verifica áreas, coordenadas duplicadas/inteiras, limites, tipos, multiplicidades, IDs, transformações, conectividade opcional, quatro rotações e disposição completa pelo mesmo validador. O roteiro reproduz a transcrição por DROP_PIECE; sucesso é do modelo, não certificação original.
- Extração dos 509 registros somente para pesquisa, com categoria, número, código, imagem e observação. 021/025 separados. Nenhum catálogo é importado no jogo.

## Arquivos criados e modificados
Criados:
- `src/game/data/research/board.ts`, `pieces.ts`, `puzzle.ts`.
- `src/game/engine/audit.ts`.
- `src/app/lab/demo/page.tsx`, `src/app/lab/research/page.tsx`.
- `scripts/audit-geometry.mjs`.
- `docs/original-geometry-research.md`, `docs/stage-03a.md`.
- `docs/evidence/stage-03a/research-desktop.png`, `research-mobile.png` (capturas do produto próprio).

Modificados:
- `src/game/engine/types.ts`, `transformations.ts`, `placement.ts`.
- `src/components/game/Game.tsx`, `GamePiece.tsx`, `GameBoard.tsx`.
- `package.json`, `README.md`, `docs/geometry-assumptions.md`.

Nenhuma dependência adicionada. `AGENTS.md` continua com 4995 bytes; referência HTML, configuração Next, dados demo e código de interação preservados. Não houve refatoração das regras aprovadas da demonstração.

## Comandos e verificações
Execução: `npm ci` em instalação nova, `npm run dev`. Produção: `npm run build`, `npm start`. Rotas `/`, `/lab/demo`, `/lab/research`.

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado, inclusive após complemento da auditoria.
- `npm run build`: aprovado; três rotas estáticas. Build de produção usado nas verificações de navegador.
- `npm run audit:geometry`: aprovado. DEMO-01 12/12, pesquisa 28/28 via reducer; áreas por tipo e multiplicidades, orientações distintas, conectividade, quatro giros, conclusão, remoção, undo/redo/reset. Recusas verificadas para limite, espelhamento, orientação inválida, marca alterada/incompatível, sobreposição, coordenadas e IDs duplicados. Todas as casas candidatas comparadas à validação individual nas quatro orientações de cada instância de pesquisa. Soma de área nunca declarada prova de solução.
- `npm run audit:geometry -- --catalog`: opção disponível para imprimir a extração completa; o comando normal já executa a mesma extração e verifica 509 entradas sequenciais, categorias e 021/025. Não cria arquivo nem fase jogável.
- Chromium Linux/Playwright temporário, produção, 1440×900, 768×1024 e 390×844: regressão da demo por mouse, R/botão direito durante arraste, prévia versus posição final (<0,1px), solução, colisão, reposicionamento, undo/redo. Aprovado.
- Pesquisa nas mesmas três resoluções: doze instâncias, solução transcrita inteira por arraste 28/28, quatro giros de R01, prévia alinhada (<0,1px), undo 26/28, redo 28/28, reset, sem erro JS ou overflow horizontal. `/lab/demo` acessível e preservada. Aprovado.
- Toque CDP emulado na demo, 768×1024 e 390×844: bandeja, scroll sobre desenho sem arraste, pré-rotação, segundo toque gira uma vez, movimento do segundo dedo não gira, confirmação pelo principal. Aprovado.
- Toque CDP emulado na pesquisa, 768×1024 e 390×844: 12 cartões, scroll, pré-rotação, segundo toque e confirmação da peça R10 rotacionada aprovados. A primeira execução usou no script o contato da peça horizontal da demo; corrigida a coordenada esperada para o giro da peça vertical R10, a repetição passou sem alteração do produto.
- Capturas desktop/celular da pesquisa inspecionadas visualmente. Scripts de navegador ficam em `/tmp`, não constituem suíte adicionada ao projeto.

## Roteiro manual
1. Abra `/lab/demo`. Confira cinco instâncias, grade 4 × 3 e assistência final. Repita o roteiro da etapa 2.1: mouse, touch, botão direito/R, cancelamento, sobreposição, remoção, histórico e vitória em 12/12.
2. Abra o link de pesquisa. Confira aviso “não validada”, grade 7 × 4, círculos/quadrados/cruzes e doze instâncias, incluindo R02-1/R02-2 e R03-1/R03-2. Não deve haver checkbox de assistência final.
3. Selecione R03-1 a 0° e tente L1 C1: cruzes não combinam com círculos; recusar. Coloque em L1 C4: aceitar. Tente R03-2 na mesma posição por arraste: sobreposição recusada. Remova, desfaça e refaça.
4. R03-1 a 0° em L1 C7 ultrapassa o limite: recusar. R02-1 tem círculo e cruz; girar 180° troca a ordem, não é geometricamente equivalente. Quatro giros restauram a prévia original.
5. Reinicie e reproduza a tabela abaixo, com todas as peças a 0°. As coordenadas indicam a âncora da caixa normalizada, não obrigatoriamente uma célula ocupada. Para R04, **arraste pelo círculo para L1 C6**, preservando a âncora L1 C5; tocar na âncora ocupada por R03 seleciona R03, conforme comportamento aprovado.

| Peça | Âncora (linha/coluna a partir de 1) |
|---|---|
| R01-1 | L1 C1 |
| R02-1 | L1 C2 |
| R03-1 | L1 C4 |
| R04-1 | L1 C5 |
| R05-1 | L1 C7 |
| R06-1 | L2 C3 |
| R07-1 | L3 C1 |
| R08-1 | L3 C3 |
| R09-1 | L3 C5 |
| R10-1 | L3 C7 |
| R02-2 | L4 C2 |
| R03-2 | L4 C5 |

6. Confira conclusão **da demonstração**, 28/28; desfazer última colocação volta a 26; refazer restaura 28. Remover encerra a vitória. Reiniciar zera o histórico.
7. Em tablet/celular, expandir deve mostrar 12 cartões; rolar sobre desenhos não inicia arraste. Selecionar recolhe; usar controle explícito de arraste. Testar segundo toque, giro antes de arrastar, Escape/cancelar e liberação do scroll.
8. Repita em Windows/Chrome informado pelo usuário e dispositivos físicos. Confira foco SVG sem halo gigante, seleção por teclado e leitura de “cruz”.

## Limitações e preparação para 3B
14 letras catalogadas, dez geometrias visuais locais transcritas, **zero tipos originais certificados e zero desafios reais validados**. Grade 7 × 4 confirmada apenas nos desenhos. Regras físicas de encaixe e giro são hipóteses, não fatos confirmados. Faltam legenda A–N, tabuleiro vazio e peças identificadas nas duas faces, manual da mesma edição e uma disposição identificada para conferência independente.

A grade de sete colunas tem alvos menores no celular (cerca de 39px em 390px); requer homologação física. IDs longos ficam menores; cor neutra não distingue tipos, que são identificados por texto. Sem auto-scroll durante arraste; role antes do gesto. Não testados Windows, Safari, Firefox, leitores de tela ou toque físico. Essas limitações não são ocultadas por uma declaração de reconstrução concluída.

Para uma futura 3B, já existem enumeração de orientações distintas, `validAnchors`, validação, reducer serializável e `isComplete`. Primeiro é necessário confirmar regras/geometria e atribuir códigos; depois repetir auditoria e reprodução por motor. Nenhuma busca, importação de 509 fases, progressão, backend, banco ou multiplayer foi implementado. Parar aqui, aguardando evidências e aprovação explícita para continuar.
