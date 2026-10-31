# CODEX — ETAPA 2: Drag-and-Drop Premium, Snap Magnético e UX de Interação

## Contexto do projeto

Estamos desenvolvendo o **Puzzle Lab**, um quebra-cabeça geométrico inspirado na mecânica do jogo Cilada, mas com identidade visual própria.

O projeto utiliza:

- Next.js com App Router
- React
- TypeScript
- SVG para representar tabuleiro e peças
- Motor geométrico independente da interface
- CSS Modules

As Etapas 1, 1.1 e 1.1.1 foram concluídas e validadas.

Atualmente, a demonstração possui cinco peças e um tabuleiro de 12 posições. O motor já implementa posicionamento, rotação, validação geométrica, remoção, desfazer/refazer e reconhecimento de vitória.

**Sua tarefa é implementar exclusivamente a Etapa 2: melhorar profundamente a experiência de interação com as peças, preservando todas as regras e funcionalidades existentes.**

Não recrie o projeto nem altere a geometria da demonstração.

---

# 1. Preparação obrigatória

Antes de alterar qualquer arquivo:

1. Leia integralmente `AGENTS.md`.
2. Inspecione o código atual.
3. Leia a documentação das etapas anteriores.
4. Identifique como o motor recebe e valida ações.
5. Analise a conversão entre coordenadas SVG e coordenadas lógicas.
6. Identifique como seleção, rotação e histórico são gerenciados.

Preserve a arquitetura existente sempre que possível.

Não implemente uma biblioteca genérica de interação se o projeto puder ser atendido com uma solução pequena e bem encapsulada.

# 2. Drag-and-drop das peças

Implementar movimentação direta com mouse, caneta e toque.

Utilize preferencialmente Pointer Events, permitindo um fluxo unificado para diferentes dispositivos.

## 2.1 Arrastar da bandeja

Comportamento esperado:

1. O jogador pressiona uma peça da bandeja.
2. A peça entra em modo de arraste após um limiar pequeno de movimento.
3. A peça acompanha o ponteiro ou dedo.
4. A peça original permanece visualmente identificável na bandeja.
5. Ao aproximar-se do tabuleiro, aparece uma prévia de encaixe.
6. Ao soltar em uma posição válida, a peça é posicionada.
7. Ao soltar em uma posição inválida, a peça retorna à origem.
8. Ao cancelar o arraste, nenhuma alteração geométrica é aplicada.

Preserve também a interação por clique existente.

Um toque simples não pode ser interpretado indevidamente como início obrigatório de um arraste.

## 2.2 Reposicionar peças já encaixadas

Permitir arrastar uma peça posicionada para outra posição.

Durante o movimento:

- Manter a identidade da instância.
- Mostrar sua posição de origem de maneira discreta.
- Validar a nova posição ignorando exclusivamente a ocupação da própria instância.
- Não permitir sobreposição com outras peças.
- Não alterar permanentemente o estado até a confirmação do posicionamento.

Se o jogador soltar em posição inválida, restaurar a posição anterior.

Não remover a peça definitivamente durante o movimento.

## 2.3 Cancelamento

O arraste precisa lidar com:

- Pointer cancel.
- Perda de captura do ponteiro.
- Soltar fora do tabuleiro.
- Pressionar Escape durante o arraste.
- Reiniciar enquanto há uma interação ativa.
- Redimensionamento ou mudança de orientação da tela.

O sistema nunca deve deixar uma peça presa em um estado intermediário.

# 3. Coordenadas e âncora de arraste

Este é um requisito crítico.

O tabuleiro é renderizado em SVG e pode variar de tamanho conforme a resolução.

O motor utiliza coordenadas lógicas.

**Não utilizar pixels de tela como coordenadas definitivas de posicionamento.**

## 3.1 Conversão

Implementar ou reutilizar funções para:

- Converter posição do ponteiro para o sistema de coordenadas do SVG.
- Converter coordenadas SVG para coordenadas lógicas.
- Encontrar a origem candidata da peça no tabuleiro.
- Preservar o deslocamento entre o ponto pressionado e a âncora da peça.

Considere transformações SVG, escala e redimensionamento.

Evite depender de valores fixos como `offsetLeft`, `offsetTop` ou tamanhos absolutos de células.

## 3.2 Evitar saltos

Quando o usuário começar a arrastar uma peça:

- A peça não deve saltar para uma posição inesperada.
- O ponto de contato precisa permanecer estável durante o arraste.
- O movimento visual deve ser consistente com a posição do ponteiro.
- O cálculo de encaixe deve utilizar a âncora lógica correta.

Ao rotacionar durante o arraste, preservar uma referência visual estável sempre que possível.

Se a geometria normalizada alterar a origem lógica, compensar o deslocamento corretamente.

# 4. Snap magnético

Implementar um sistema de encaixe assistido.

O jogador não deve precisar alinhar manualmente a peça com precisão de pixels.

## Comportamento esperado

Ao aproximar uma peça do tabuleiro:

1. Identificar a origem lógica candidata.
2. Calcular a posição de encaixe correspondente.
3. Validar a posição com o motor geométrico.
4. Mostrar a prévia.
5. Permitir a confirmação somente quando as regras forem satisfeitas.

O snap deve considerar a geometria completa da peça, não apenas sua primeira célula.

## Regras

- Não permitir encaixes geometricamente inválidos.
- Não deslocar automaticamente peças já posicionadas.
- Não alterar as regras de vitória.
- Não aceitar posições inválidas apenas porque visualmente parecem próximas.
- Evitar oscilação visual entre células próximas.

Utilizar uma distância de atração adequada à escala do tabuleiro.

Se o ponteiro estiver muito distante, não exibir uma prévia de encaixe como se a peça estivesse dentro do tabuleiro.

# 5. Prévia de posicionamento (Ghost Piece)

Durante o arraste, renderizar uma representação temporária da peça sobre o tabuleiro.

Estados visuais necessários:

### Posição válida

- Cor original com transparência.
- Contorno discreto indicando encaixe permitido.
- Alinhamento exato com as posições lógicas.

### Posição inválida

- Cor de advertência.
- Contorno ou preenchimento indicando incompatibilidade.
- Não modificar a posição real das outras peças.

### Fora do tabuleiro

- Não mostrar um encaixe válido.
- Manter a peça acompanhando o ponteiro até o cancelamento ou soltura.

A prévia deve ser derivada do estado de interação, não adicionada ao estado definitivo do jogo.

Não persistir a Ghost Piece no histórico.

## Performance

Evitar executar alterações de estado geométrico definitivo em cada movimento do ponteiro.

Se necessário, utilizar refs, requestAnimationFrame ou uma estratégia de atualização eficiente.

Não adicionar bibliotecas pesadas de animação apenas para mover uma peça.

# 6. Rotação durante a interação

A rotação deve continuar funcionando pelos botões existentes.

Acrescentar:

- Tecla `R` para rotacionar a peça selecionada ou arrastada.
- Controle visual de rotação acessível durante o arraste, especialmente para dispositivos touch.
- Prévia atualizada imediatamente após a rotação.

## Comportamento

Se a peça estiver na bandeja, rotacionar sua orientação sem alterar sua posição lógica.

Se estiver posicionada no tabuleiro, utilizar a política de rotação já estabelecida pelo motor, respeitando a validação geométrica.

Durante o arraste, a rotação deve alterar apenas a orientação candidata, até a confirmação do posicionamento.

Evitar:

- Saltos inesperados.
- Perda da seleção.
- Deslocamentos arbitrários.
- Incompatibilidade entre a prévia e a posição final.

Não permitir espelhamento nesta etapa.

# 7. Interação touch

O jogo será utilizado em desktop, tablet e celular por crianças e adultos.

A experiência touch é prioritária, não uma adaptação secundária.

## Requisitos

- Áreas de interação confortáveis para dedos.
- Drag-and-drop com Pointer Events.
- Evitar seleção acidental de textos.
- Evitar que o navegador arraste imagens ou elementos nativos.
- Impedir rolagem da página enquanto um arraste ativo controla o tabuleiro.
- Preservar a rolagem normal quando o jogador não estiver interagindo com as peças.
- Permitir rotacionar sem depender de teclado.
- Evitar que o dedo esconda completamente a peça.

Avalie implementar um deslocamento visual moderado para interações touch, permitindo visualizar a peça acima do dedo.

Esse deslocamento deve ser limitado à apresentação e não pode corromper a correspondência geométrica entre a prévia e a posição confirmada.

Não aplique o deslocamento para mouse se isso prejudicar a precisão.

## Importante

Não use exclusivamente o gesto de dois dedos para rotacionar.

Deve existir um botão de rotação facilmente acessível.

# 8. Interações acessíveis

Preservar a alternativa sem arraste.

O jogador deve continuar conseguindo:

1. Selecionar uma peça.
2. Rotacioná-la.
3. Selecionar uma posição no tabuleiro.
4. Posicioná-la.
5. Removê-la.

Para teclado:

- Navegar por peças e controles.
- Selecionar com Enter ou Espaço.
- Rotacionar com R quando apropriado.
- Cancelar com Escape.
- Receber feedback textual dos resultados.

Não tornar drag-and-drop obrigatório.

Evitar atalhos que interfiram com campos de texto ou elementos interativos que tenham comportamento próprio.

Aplicar estados de foco visíveis.

# 9. Feedback visual e animações

O jogo deve transmitir sensação de qualidade, sem animações excessivas.

Implementar:

### Seleção

- Destaque sutil.
- Contorno visível.
- Indicação clara da peça ativa.

### Início do arraste

- Elevação visual discreta.
- Sombra suave.
- Pequena alteração de escala, se não prejudicar a leitura.

### Movimento

- Acompanhamento fluido.
- Sem atrasos perceptíveis.
- Sem tremores ou mudanças bruscas de posição.

### Encaixe correto

- Transição curta.
- Alinhamento preciso.
- Feedback visual discreto de confirmação.

### Encaixe inválido

- Retorno suave à origem.
- Indicação visual e textual breve.

### Vitória

- Animação curta de conclusão.
- Mensagem clara de sucesso.
- Preservação da visualização do tabuleiro concluído.

## Acessibilidade

Respeitar `prefers-reduced-motion`.

Os estados válidos e inválidos não devem ser diferenciados exclusivamente por cores.

Evitar animações que modifiquem a posição lógica do motor.

# 10. Melhorias na bandeja de peças

A bandeja atual funciona, mas precisa ficar mais confortável para interação direta.

Melhorar:

- Área de toque de cada peça.
- Destaque da seleção.
- Indicação de orientação.
- Indicação de peça já posicionada.
- Diferenciação entre peças disponíveis e posicionadas.
- Feedback ao começar um arraste.

Manter IDs individuais, como A-1 e A-2.

Não misturar estado visual de uma instância com outra instância do mesmo tipo.

Não redesenhar completamente a página.

O objetivo é melhorar a usabilidade preservando a identidade visual atual.

# 11. Estado e histórico

Separar claramente:

**Estado definitivo**

- Peças posicionadas.
- Orientações confirmadas.
- Ocupação do tabuleiro.
- Resultado das validações.
- Progresso do desafio.

**Estado transitório**

- Peça sendo arrastada.
- Posição do ponteiro.
- Prévia de encaixe.
- Orientação candidata.
- Feedback temporário.

Movimentos intermediários do ponteiro não podem gerar entradas de histórico.

Uma operação de reposicionamento confirmada deve representar uma única jogada reversível.

Se houver uma sequência de rotações durante o arraste, não adicionar cada movimento temporário ao histórico.

Após uma jogada confirmada, desfazer e refazer precisam restaurar corretamente posição e orientação.

# 12. Não alterar a mecânica do jogo

Preservar:

- As cinco peças atuais.
- O tabuleiro demonstrativo.
- As restrições geométricas.
- O reconhecimento de vitória.
- As regras de colisão.
- A distinção entre tipos e instâncias.

Não implementar peças reais do Cilada sem validação.

Não importar automaticamente as 509 combinações como desafios jogáveis.

Esses trabalhos pertencem à Etapa 3.

# 13. Arquitetura sugerida

Adapte à estrutura real do projeto.

Se necessário, criar componentes ou módulos como:

```text
components/game/
  DraggablePiece.tsx
  DragPreview.tsx
  RotationControl.tsx

game/interaction/
  pointerCoordinates.ts
  dragSession.ts
  snap.ts

game/state/
  useDragInteraction.ts
```

Não é obrigatório criar todos esses arquivos.

Prefira uma organização enxuta.

O motor geométrico deve permanecer independente da interface.

Não introduzir dependências de React nos módulos de validação.

# 14. Restrições técnicas

- Não adicionar backend.
- Não adicionar multiplayer.
- Não adicionar autenticação.
- Não adicionar banco de dados.
- Não adicionar biblioteca de drag-and-drop sem justificativa técnica.
- Não introduzir canvas se SVG atender aos requisitos.
- Não adicionar testes unitários extensos.
- Não reescrever o motor.
- Não mudar regras geométricas para facilitar a interação.
- Não atualizar dependências sem necessidade.
- Não modificar `AGENTS.md` automaticamente.

Se descobrir um defeito no motor, corrija-o isoladamente e documente a razão.

# 15. Verificação e qualidade

Executar:

- TypeScript.
- Lint.
- Build de produção.

Testar manualmente, quando houver navegador disponível, nas resoluções:

- 1440 × 900.
- 768 × 1024.
- 390 × 844.

Verificar interação com mouse e Pointer Events.

Quando não houver dispositivo touch real disponível, não declarar testes físicos de toque como executados.

Documentar o que foi testado e o que ainda precisa ser validado manualmente.

# 16. Roteiro mínimo de testes

O resultado deve permitir executar:

1. Arrastar A-1 da bandeja para o tabuleiro.
2. Soltar A-1 em posição válida.
3. Arrastar A-2 para outra posição válida.
4. Tentar sobrepor A-2 a A-1.
5. Confirmar que a jogada inválida não altera o tabuleiro.
6. Arrastar uma peça posicionada para outra posição.
7. Arrastar uma peça para fora do tabuleiro e soltá-la.
8. Rotacionar uma peça antes de encaixar.
9. Rotacionar uma peça durante o arraste.
10. Cancelar o arraste com Escape.
11. Desfazer e refazer uma movimentação.
12. Completar o desafio usando drag-and-drop.
13. Reiniciar o jogo.
14. Completar o desafio utilizando apenas seleção e clique.
15. Utilizar as interações no celular sem rolagem ou seleção de texto indesejada.

# 17. Documentação

Criar `docs/stage-02.md` contendo:

- Funcionalidades implementadas.
- Arquitetura da interação.
- Estratégia de conversão de coordenadas.
- Política de âncora e rotação.
- Comportamento do snap.
- Separação entre estado transitório e definitivo.
- Resultados das verificações.
- Limitações conhecidas.
- Roteiro de testes manuais.

Não alterar a documentação das etapas anteriores, exceto quando necessário para corrigir informações comprovadamente incorretas.

# 18. Critérios de aceite

A Etapa 2 só estará concluída quando:

- Drag-and-drop funcionar com mouse.
- A implementação oferecer suporte real a Pointer Events para touch.
- Peças puderem sair da bandeja e entrar no tabuleiro.
- Peças posicionadas puderem ser reposicionadas.
- Snap e Ghost Piece funcionarem.
- Encaixes inválidos forem recusados.
- O posicionamento não apresentar saltos inesperados.
- A rotação funcionar antes e durante o arraste.
- O histórico permanecer consistente.
- A interação por clique continuar funcionando.
- O jogo permanecer responsivo.
- A condição de vitória continuar correta.
- TypeScript, lint e build passarem.
- A documentação estiver atualizada.

# 19. Entrega final

Ao concluir, informe:

1. Resumo das funcionalidades.
2. Arquivos criados e modificados.
3. Principais decisões técnicas.
4. Resultado das verificações executadas.
5. Roteiro de testes manuais.
6. Problemas conhecidos.
7. Limitações ainda não resolvidas.
8. Recomendações para a Etapa 3.

**Não avance automaticamente para a Etapa 3.**

Aguarde minha homologação manual.

Priorize precisão geométrica, fluidez da interação e clareza visual. A experiência deve parecer um produto premium, não apenas uma demonstração técnica de drag-and-drop.
