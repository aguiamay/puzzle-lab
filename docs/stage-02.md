# Etapa 2 — Arraste, snap e interação

## Entrega e escopo
Pointer Events para mouse, toque e caneta; arraste da bandeja e reposicionamento; snap com prévia; rotação candidata por R e botão; cancelamento; feedback de sucesso/erro; bandeja compacta em telas menores. Clique, toque simples, teclado, remoção, undo/redo e vitória preservados.

Não foram alterados geometria, cinco instâncias, tabuleiro, encaixes, solução ou regras oficiais/desconhecidas. Nenhum backend, multiplayer, catálogo jogável, solucionador, espelhamento ou dependência nova. Etapa 3 não iniciada. Documentos das etapas anteriores, referências e AGENTS.md preservados.

## Arquitetura
- Motor puro: nova ação `DROP_PIECE { id, position, orientation }`, determinística e serializável. Revalida ao confirmar e grava posição/orientação juntas em um único snapshot. `validateMove` desconsidera exclusivamente a ocupação da instância movida, reutilizando `validatePlacement`. Geometria, limites, sobreposições e encaixes continuam com o mesmo validador.
- `useDragInteraction` encapsula sessão de ponteiro em ref, apresentação em estado React e atualizações por requestAnimationFrame. Sessão contém ponto pressionado, contato local, origem visual, orientação candidata e captura; nada disso entra no estado definitivo.
- `coordinates.ts` faz conversões DOM/SVG na camada de interação. `snap.ts` é uma função pura em coordenadas lógicas. Nenhum evento ou dimensão visual foi introduzido no motor.
- `DragPreview` mostra a peça flutuante e os controles temporários. `GhostPiece` mostra a posição lógica candidata no SVG do tabuleiro. As outras peças não se deslocam para permitir encaixe.
- A prévia é recalculada no máximo uma vez por frame durante o movimento; a soltura usa a coordenada final do evento, sem depender de um frame pendente. Não há cache global ou biblioteca de animação.

## Coordenadas, contato e escala
Usa `getScreenCTM().inverse()` para converter clientX/clientY para o espaço local do SVG. No tabuleiro, esse espaço já representa as unidades lógicas do motor; na bandeja, representa as unidades locais normalizadas da peça. A origem candidata é `ponteiroLógico - contatoLocal`.

O contato é preservado em coordenadas contínuas. Durante rotação horária da caixa de altura H, `(u,v)` passa a `(H-v,u)`. A geometria é derivada das funções puras existentes. Ao girar uma peça colocada fora do arraste, continua valendo a política antiga: mesma âncora, validação e recusa atômica se inválida.

A cópia flutuante conserva a escala do SVG de origem durante todo o gesto, evitando salto de tamanho ao sair da bandeja. A Ghost Piece usa a escala do tabuleiro e mostra o encaixe exato. A peça flutuante pode, portanto, ser menor que a prévia do tabuleiro; essa diferença é intencional. Ambas preservam a orientação candidata. No teste touch, o contato antes/depois da rotação permaneceu a menos de 1px do ponto esperado.

Não foi adicionado deslocamento artificial acima do dedo: o contato permanece fiel, e a prévia maior mais o painel textual permitem conferir o encaixe. Essa escolha deve ser reavaliada com dedos e caneta físicos, sem alterar as coordenadas definitivas.

## Política de snap
A origem candidata contínua é arredondada à casa mais próxima. Uma âncora anterior é mantida enquanto a diferença por eixo for no máximo 0,62 célula; ao ultrapassar esse limiar, troca para a origem arredondada. Essa histerese evita alternância repetida na divisão entre casas. A distância acompanha a escala do SVG, sem offsets fixos de tela.

O ponteiro precisa estar dentro do retângulo lógico do tabuleiro para haver uma prévia. Fora dele não existe âncora confirmável. Não se busca silenciosamente outra casa válida: a candidata próxima é validada inteira. Colisão, limite e encaixe incompatível geram prévia vermelha tracejada com × e motivo textual. Válida usa cor do tipo com transparência, contorno contínuo e ✓. Soltar uma inválida ou fora restaura a origem, sem mudar posição ou orientação confirmadas.

## Fluxo, cancelamento e histórico
Pressionar o desenho captura o ponteiro, seleciona a instância e prepara a sessão. O arraste só começa após 6px de deslocamento na tela; esse limiar distingue clique de gesto, não é uma coordenada do motor. Um toque simples continua selecionando. A bandeja preserva a peça original esmaecida durante o arraste; uma peça colocada mantém sua ocupação e origem visuais até confirmar.

Cancelamentos tratados: pointercancel, lostpointercapture, Escape, mudança de tamanho/orientação, perda de foco da janela, outra ação explícita e reinício. Soltar fora também não confirma. Captura é liberada e frames pendentes são cancelados. Não é necessário remover uma peça antes de arrastá-la.

Seleção, movimentos, prévia e rotações durante o gesto não geram jogadas. Drop válido cria uma única entrada; drop idêntico à posição/orientação original não cria entrada. Drop inválido/cancelado preserva histórico futuro. Nova jogada válida após undo descarta redo. Reset limpa partida e interação; não é desfeito. Histórico continua sem limite fixo, como nas etapas anteriores; sessões muito longas consomem memória proporcional ao número de jogadas.

O clique sintético posterior ao arraste é suprimido para não produzir uma segunda ação. O próximo clique real ou ação de teclado continua funcional.

## Touch, controles e acessibilidade
- Desenhos das peças disponíveis e casas ocupadas têm `touch-action: none`; outras regiões mantêm rolagem. Rótulos dos cartões permitem rolar a bandeja horizontalmente. Não há arraste HTML nativo de imagens.
- Durante arraste ativo, scroll/seleção textual da página são bloqueados; estilos anteriores são restaurados no fim. `scrollbar-gutter: stable` evita deslocar o layout quando a barra desaparece.
- Até 800px de largura, bandeja fixa compacta no rodapé, com rolagem horizontal e espaço reservado no conteúdo. O jogador pode acessar peças e tabuleiro na mesma tela. Durante o arraste, controles ficam no topo para não cobrir as casas inferiores.
- R gira a seleção ou candidata. Escape cancela gesto. Atalhos ignoram campos editáveis, modificadores, repetição e foco fora do jogo sem sessão ativa.
- Botões temporários “Girar arraste” e “Cancelar arraste” respondem diretamente ao pointerdown touch, pois um segundo toque durante captura pode não produzir clique. É possível manter o dedo de arraste e tocar o botão com outro dedo; não existe gesto especial obrigatório de dois dedos. Alternativa de um dedo: selecionar, girar pelo botão normal e então arrastar, ou jogar somente por toque/clique.
- Foco de SVG continua pela borda local, com `.cell:focus { outline: none; outline-offset: 0; }`, preservando a correção do círculo gigante. HTML mantém foco normal. Prévia ignora eventos do ponteiro e é decorativa para leitores de tela; painel textual anuncia estado e orientação.
- Sombra na cópia flutuante, retorno à origem em 180ms, confirmação em 160ms e conclusão em 350ms. Tudo apenas visual; movimento reduzido desativa transições/animações. Estados não dependem apenas de cores.

## Arquivos criados/modificados
Novos:
- `src/game/interaction/coordinates.ts`, `snap.ts`.
- `src/game/state/useDragInteraction.ts`.
- `src/components/game/DragPreview.tsx`.
- `docs/stage-02.md` e quatro capturas em `docs/evidence/stage-02/`.

Modificados:
- `src/game/engine/types.ts`, `placement.ts`, `reducer.ts`: ação e validação atômica.
- `src/components/game/Game.tsx`, `GameBoard.tsx`, `PieceTray.tsx`, `GameToolbar.tsx`, `GameStatus.tsx`: integração, controles e feedback.
- `src/components/game/Game.module.css`, `src/app/globals.css`: apresentação, toque, foco preservado, bandeja e animações.
- `README.md`: relatório atual.

## Execução e verificações
`npm run dev` e http://localhost:3000. Em instalação nova: `npm ci` antes. Produção: `npm run build`, `npm start`. Nenhuma versão de dependência mudou.

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado. A referência do SVG foi passada separadamente da interação para evitar a inferência de acesso a ref durante renderização pelo lint; nenhum erro foi silenciado.
- `npm run build`: aprovado; página pré-renderizada.
- Node pontual, sem suíte permanente: determinismo/imutabilidade, colisão, movimento atômico, no-op, undo/redo de posição+orientação, bifurcação, solução em exatamente cinco drops, vitória, histerese e exclusão de ponteiro fora do tabuleiro aprovados.
- Chromium 156 em Linux, desenvolvimento e produção: mouse nas três resoluções **1440×900, 768×1024 e 390×844**. Solução inteira por arraste, rotação durante gesto, reposicionamento, sobreposição recusada, undo/redo, Escape; sem overflow horizontal ou erros JavaScript.
- Desenvolvimento e produção: eventos touch via protocolo CDP (emulados, não físicos) a 390×844. Toque simples, captura, arraste sem scroll, botão de rotação com segundo ponteiro, ghost válido, confirmação da orientação, pointercancel e desbloqueio da página aprovados.
- Produção: solução completa das cinco peças via eventos touch; rotações pelo botão; ponto de contato conferido numericamente (<1px); progresso preservado durante ghost; movimento reduzido; gesto normal de scroll após soltar. Aprovados.
- Desenvolvimento e produção: saída do tabuleiro, liberação da captura, resize, reset durante gesto, Escape e caneta emulada aprovados. Solução completa por Enter/Espaço/R, sem arraste, aprovada; foco SVG sem contorno gigante.
- Inspeção visual: [desktop](evidence/stage-02/desktop.png), [tablet](evidence/stage-02/tablet.png), [celular](evidence/stage-02/celular.png), [prévia touch com rotação](evidence/stage-02/previa-touch.png).
- Durante QA, uma captura de página inteira em contexto móvel disparou resize e cancelou o gesto corretamente; capturas de gesto ativo passaram a usar apenas a viewport. Também foi corrigida a identificação do dedo liberado no teste multitoque. Nenhum desses ajustes relaxou as regras do jogo.
- Playwright foi reutilizado do cache. Bibliotecas do Chromium foram extraídas em `/tmp`, sem instalação no sistema ou no projeto. Scripts pontuais ficaram em `/tmp`. Servidores de teste encerrados ao concluir.

## Roteiro manual de homologação
Coordenadas abaixo são linha/coluna a partir de 1. Arraste pelo desenho, não pelo rótulo do cartão.

1. Nas três resoluções, toque/clique A-1 sem mover: deve selecionar, sem entrar em arraste. Confira orientação e foco.
2. Arraste A-1 a 0° para L1 C1. Observe origem esmaecida, cópia acompanhando o ponteiro, prévia com ✓ e confirmação em 2/12.
3. Arraste A-2 a 0° para L2 C1: 4/12. Agora arraste A-2 sobre A-1: prévia × tracejada, erro de sobreposição, retorno à L2 C1 e progresso preservado.
4. Arraste A-2 de L2 C1 para L3 C2. Desfaça e refaça: uma ação deve restaurar cada posição. Selecione A-1 diretamente no tabuleiro.
5. Arraste uma peça e solte fora do tabuleiro: origem preservada. Repita cancelando por Escape e botão Cancelar arraste. Redimensione a janela durante o gesto: não deve sobrar peça flutuante nem scroll bloqueado.
6. Reinicie durante arraste: todas as peças disponíveis a 0°, sem seleção ou histórico. Simule pointercancel/perda de captura nas ferramentas do navegador quando possível.
7. Reinicie. Selecione A-1, use R ou botão para girar a 90°, arraste e teste L3 C1: limite recusado. A-1 a 0° em L1 C3: encaixe incompatível recusado.
8. Reinicie. Comece a arrastar A-1 a 0°, pressione R durante o gesto e coloque verticalmente em L1 C1. Undo deve devolver A-1 à bandeja a 0°; redo deve restaurar posição e 90° juntos.
9. Em toque, mantenha o dedo na peça e use o botão Girar arraste com outro dedo. Confirme orientação e prévia. Solte; verifique que a página volta a rolar por uma região fora das peças. Sem segundo dedo, gire antes de arrastar pelo botão normal.
10. Solução por arraste após reiniciar: **A-1 0° em L1 C1; A-2 0° em L2 C1; B-1 180° em L1 C3; C-1 0° em L3 C1; D-1 90° em L2 C4**. Gire B/D durante o gesto e observe a estabilidade do contato. Vitória em 12/12.
11. Desfaça a última peça: volta a 10/12. Refaça: vitória. Remova uma peça: vitória desaparece. Reinicie: 0/12 e histórico vazio.
12. Repita a solução somente por seleção, botão R/rotacionar e clique em casas. Repita com Tab, Enter/Espaço e R. Selecionar uma peça posicionada não deve tentar sobrepor outra.
13. Ative movimento reduzido e repita encaixe, recusa e vitória. Confirme ✓/×, texto e foco sem depender de cor ou movimento.
14. Verifique `npm run dev` e `npm start` após build. No Windows/Chrome e dispositivos reais, confira especialmente cancelamento, scroll, captura, rotação pelo botão e dimensões da bandeja.

## Limitações e próximos passos
Testes de toque e caneta foram emulados; **não foram executados testes físicos**, Windows/Chrome do usuário, Safari, Firefox ou leitor de tela real. Resize/orientação cancela em vez de adaptar uma sessão ativa. Não há auto-scroll durante arraste: fora do tabuleiro cancela; role a página antes de começar se necessário. A bandeja fixa compacta cobre parte da viewport, com espaço reservado para alcançar todos os controles por scroll. Tela muito baixa pode exigir ajustar a rolagem antes de arrastar. O retorno conserva a geometria original visível; não usa simulação física. Histórico e progresso continuam apenas em memória.

Para a etapa 3, somente após homologação: validar fontes e geometria real antes de importar desafios jogáveis ou desenvolver solucionador. Preservar IDs/multiplicidades e a distinção entre catálogo validado e desafio comprovadamente solucionável. Não houve trabalho antecipado nessa etapa.
