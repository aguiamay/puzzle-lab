# CODEX — ETAPA 2.1: Refinamento de Drag-and-Drop, Rotação e UX Mobile

## Objetivo

Estamos desenvolvendo o Puzzle Lab, utilizando Next.js, React, TypeScript e SVG.

A Etapa 2 implementou drag-and-drop, snap magnético e prévias de encaixe, mas os testes manuais identificaram três problemas de usabilidade.

Esta etapa deve corrigir esses problemas sem alterar a geometria das peças, as regras do jogo ou o funcionamento do motor.

Antes de começar, leia `AGENTS.md`, a documentação anterior e inspecione a implementação atual.

Não avance para a Etapa 3.

## 1. Rotação durante o arraste

Implementar controles diferentes para desktop e dispositivos touch.

### Desktop

Durante um arraste ativo:

- Tecla R: rotacionar 90°.
- Botão direito do mouse: rotacionar 90°.
- Manter o botão esquerdo pressionado durante a rotação.
- Não abrir o menu de contexto durante esse gesto.
- Não finalizar ou cancelar o arraste ao rotacionar.

Fora do arraste, preservar os controles de rotação existentes.

A orientação candidata deve ser atualizada imediatamente na peça flutuante e na prévia de encaixe.

### Celular e tablet

Implementar:

- Um dedo para arrastar.
- Toque breve com um segundo dedo para rotacionar 90° durante um arraste ativo.
- Alternativamente, permitir selecionar a peça, usar o botão de rotação e arrastar posteriormente.

O gesto de segundo dedo deve funcionar apenas quando houver um arraste touch ativo.

Não interpretar movimentos de dois dedos como rotação contínua.

Não bloquear permanentemente pinch-to-zoom ou gestos de acessibilidade do navegador.

Evitar que o segundo dedo finalize o arraste, substitua o ponteiro principal ou posicione a peça acidentalmente.

### Requisito crítico

Durante qualquer rotação:

- Preservar a referência de contato com a peça.
- Recalcular corretamente a geometria candidata.
- Manter a peça visualmente estável.
- Recalcular snap e Ghost Piece.
- Não alterar o estado definitivo antes de confirmar a jogada.

Se a compensação da âncora exigir mudanças, documente a transformação matemática utilizada.

## 2. Corrigir deslocamento da peça no encaixe

Foi observado que, especialmente quando resta a última peça, a peça arrastada aparece deslocada da posição correta e dificulta o encaixe.

### Diagnóstico obrigatório

Antes de corrigir, inspecione:

- Conversão de Pointer Events para coordenadas SVG.
- Escala e transformações do SVG.
- Origem lógica da peça.
- Âncora do arraste.
- Offset visual utilizado no mobile.
- Cálculo da posição candidata.
- Renderização da Ghost Piece.
- Cálculo das posições válidas.
- Normalização após rotação.

Determine se o deslocamento é visual, lógico ou uma combinação dos dois.

### Comportamento esperado

- O snap deve utilizar coordenadas lógicas consistentes.
- A Ghost Piece deve coincidir exatamente com a posição que será ocupada.
- Ao soltar, a peça deve permanecer no mesmo local indicado pela prévia.
- O offset visual para touch não pode deslocar a posição de encaixe.
- O posicionamento deve continuar correto após uma ou várias rotações.
- A precisão não pode depender do tamanho da tela.

Não corrija o problema adicionando offsets fixos em pixels sem compreender a causa.

### Assistência ao último encaixe

Quando restar apenas uma peça:

1. Identifique posições geometricamente válidas utilizando o motor existente.
2. Caso haja uma única posição válida suficientemente próxima da posição candidata, permita uma tolerância de snap um pouco maior.
3. Apresente a Ghost Piece exatamente nessa posição.
4. Confirme o encaixe somente ao soltar.
5. Nunca encaixe automaticamente uma peça distante do tabuleiro.
6. Não revele soluções ou posições ocultas de desafios futuros.

A assistência deve ser discreta, configurável e desativável, para não transformar a interação em um solucionador automático.

Se a geometria experimental não permitir identificar com segurança a unicidade do encaixe, mantenha a assistência desabilitada e documente a limitação.

## 3. Reformular a bandeja mobile

A bandeja atual utiliza scroll horizontal fixo na parte inferior.

Problema identificado: ao tentar rolar horizontalmente para visualizar outras peças, a interface inicia o drag-and-drop de uma peça.

### Nova abordagem

Substitua essa interação por uma bandeja expansível para telas pequenas.

Estado recolhido:

- Mostrar uma faixa compacta de peças disponíveis, quando couber.
- Exibir um controle evidente para expandir a bandeja.
- Preservar o máximo possível da área do tabuleiro.
- Evitar rolagem horizontal obrigatória como único meio de acessar peças.

Estado expandido:

- Mostrar as peças em uma grade responsiva.
- Permitir selecionar qualquer peça.
- Mostrar identificação e orientação.
- Distinguir peças disponíveis das já posicionadas.
- Permitir rolagem vertical da bandeja se necessário.
- Oferecer um controle explícito para recolher.

### Prioridade de interação

A interface deve permitir selecionar uma peça na bandeja e posicioná-la no tabuleiro por toque, sem precisar arrastá-la diretamente da bandeja expandida.

Preservar drag-and-drop quando o gesto for inequívoco.

Se houver conflito entre rolagem e arraste dentro de uma região, a rolagem deve funcionar normalmente.

Não iniciar arraste imediatamente com qualquer movimento destinado a navegar pela lista.

Se necessário, use um pequeno limiar de movimento ou um gesto específico, mas não implemente long-press obrigatório.

### Layout

A bandeja não pode:

- Ocultar permanentemente células do tabuleiro.
- Sobrepor os controles críticos.
- Bloquear a visualização da Ghost Piece.
- Produzir deslocamentos bruscos do layout durante um arraste.

Considere safe areas de dispositivos móveis.

A versão desktop pode manter a bandeja lateral existente.

## 4. Preservar funcionalidades

Não quebrar:

- Seleção por clique ou toque.
- Posicionamento sem arraste.
- Drag-and-drop.
- Remoção.
- Colisões.
- Rotação.
- Desfazer/refazer.
- Reinício.
- Validação de vitória.
- Feedback de jogadas inválidas.

Não modificar a geometria experimental nem importar as 509 combinações nesta etapa.

## 5. Qualidade técnica

Utilizar Pointer Events e a arquitetura de interação existente.

O motor geométrico deve continuar independente do React e do DOM.

Manter o estado transitório do arraste separado do estado definitivo da partida.

Evitar adicionar dependências externas.

Não implementar funcionalidades de multiplayer.

Não criar testes unitários extensos. Priorizar verificações existentes e testes manuais reproduzíveis.

## 6. Testes obrigatórios

Validar:

1. Arrastar com mouse.
2. Rotacionar com R durante o arraste.
3. Rotacionar com botão direito durante o arraste.
4. Arrastar com um dedo.
5. Rotacionar com segundo dedo.
6. Rotacionar previamente pelo botão touch.
7. Arrastar uma peça após uma ou mais rotações.
8. Verificar coincidência exata da Ghost Piece com o encaixe final.
9. Encaixar a última peça sem deslocamento inesperado.
10. Expandir e recolher a bandeja mobile.
11. Visualizar todas as peças na bandeja expandida.
12. Rolar a bandeja sem iniciar arraste acidental.
13. Posicionar por seleção e toque.
14. Desfazer/refazer uma peça reposicionada.
15. Completar e reiniciar a demonstração.

Testar layouts de 1440 × 900, 768 × 1024 e 390 × 844.

Quando disponível, utilizar navegador automatizado para verificar o DOM, capturar screenshots e reproduzir interações.

Não declarar gestos multitouch validados fisicamente caso não haja dispositivo compatível disponível.

Executar TypeScript, lint e build.

## 7. Documentação

Criar `docs/stage-02-1.md`.

Documentar:

- Causas encontradas para o deslocamento.
- Solução matemática para a âncora e o snap.
- Controles desktop e touch.
- Comportamento da bandeja responsiva.
- Arquivos modificados.
- Verificações realizadas.
- Limitações.
- Roteiro de homologação manual.

## 8. Entrega

Ao concluir, apresentar um resumo das alterações e os testes necessários para homologação.

Não alterar `AGENTS.md` automaticamente.

Não iniciar a Etapa 3.

**A prioridade desta etapa é eliminar fricções reais de usabilidade, garantindo precisão geométrica e interação natural no PC, tablet e celular.**
