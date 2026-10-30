# CODEX — ETAPA 1.1: Estabilização, UX e preparação do motor geométrico

## Contexto

Estamos desenvolvendo o **Puzzle Lab**, um jogo web inspirado na mecânica do Cilada, com identidade visual própria.

A Etapa 1 já foi implementada utilizando Next.js, React, TypeScript e SVG.

O projeto possui um motor geométrico funcional, uma demonstração com cinco peças e um tabuleiro de 12 células.

A mecânica básica de seleção, rotação, posicionamento, validação, remoção, desfazer/refazer e reconhecimento de vitória já funciona.

Entretanto, foram identificados problemas de CSS, algumas limitações de interação e pontos arquiteturais que precisam ser estabilizados antes da Etapa 2.

**Sua tarefa é corrigir e melhorar a implementação existente, preservando integralmente as funcionalidades que já funcionam.**

Não recrie o projeto.

## 1. Instruções obrigatórias

Antes de começar:

1. Leia o `AGENTS.md` na raiz do projeto.
2. Inspecione a implementação atual.
3. Leia a documentação da Etapa 1.
4. Identifique os componentes e funções que serão afetados.
5. Preserve as decisões arquiteturais já estabelecidas.

Não assuma que os problemas descritos abaixo continuam presentes: confirme cada um deles no código antes de modificar.

Evite refatorações extensas e alterações sem justificativa.

Não implemente funcionalidades reservadas para a Etapa 2.

## 2. Corrigir problemas de CSS e layout

Revise a interface existente, procurando:

- Elementos desalinhados.
- Componentes que ultrapassam seus contêineres.
- Larguras ou alturas fixas inadequadas.
- Espaçamentos inconsistentes.
- Problemas de dimensionamento do SVG.
- Sobreposição de controles.
- Textos pequenos ou difíceis de ler.
- Problemas de responsividade.
- Áreas clicáveis muito pequenas.
- Problemas visuais causados por estilos globais.

Corrija os problemas encontrados, mantendo a direção visual já adotada.

### Responsividade

Verifique o funcionamento em:

- Desktop: 1440 × 900.
- Tablet: 768 × 1024.
- Celular: 390 × 844.

O tabuleiro deve utilizar o espaço disponível sem distorcer as peças.

O layout deve permanecer utilizável em todas essas resoluções.

Evite barras de rolagem horizontais involuntárias.

Não altere a geometria lógica para resolver problemas de layout.

## 3. Melhorar a seleção de peças

Atualmente existe uma possível inconsistência na interação entre peças disponíveis e peças já posicionadas.

Revise o fluxo de seleção.

Comportamento esperado:

1. Clicar em uma peça disponível deve selecioná-la.
2. Clicar em outra peça disponível deve alterar a seleção.
3. Clicar diretamente em uma peça posicionada no tabuleiro deve selecioná-la.
4. Uma peça posicionada deve poder ser removida por uma ação explícita.
5. A seleção deve permanecer visualmente evidente.
6. Clicar em uma posição vazia deve tentar posicionar a peça selecionada.
7. Jogadas inválidas devem apresentar mensagens compreensíveis.
8. Uma tentativa inválida não deve alterar o estado geométrico válido.

### Atenção

O sistema deve distinguir claramente:

- Seleção de peça.
- Tentativa de posicionamento.
- Remoção de peça.

Não confunda um clique sobre uma peça posicionada com uma tentativa de colocar outra peça sobre ela.

Preserve a semântica das ações existente sempre que possível.

## 4. Preparar a arquitetura para drag-and-drop

**Não implemente drag-and-drop nesta etapa.**

O objetivo é preparar a geometria para que possamos implementá-lo corretamente na Etapa 2.

### 4.1 Coordenadas

Confirme que o motor utiliza coordenadas lógicas independentes de pixels.

O dimensionamento do tabuleiro não pode alterar o resultado das validações.

### 4.2 Rotação

Revise o algoritmo de rotação e normalização das peças.

A rotação atualmente utiliza uma geometria normalizada, o que é adequado para operações discretas, mas precisamos evitar saltos visuais durante o futuro drag-and-drop.

Implemente ou documente claramente:

- Origem local da peça.
- Coordenadas normalizadas.
- Âncora lógica de posicionamento.
- Transformação da geometria.
- Relação entre a âncora e o ponto de interação do usuário.

Se necessário, crie funções puras para converter coordenadas entre os espaços relevantes.

Não introduza offsets arbitrários ou correções baseadas em pixels.

Não altere a lógica de encaixe válida apenas para melhorar a aparência da rotação.

### 4.3 Separação de responsabilidades

O motor não deve depender de:

- React.
- DOM.
- SVG.
- Eventos de mouse.
- Eventos de toque.
- Dimensões visuais.

A interface pode converter coordenadas de interação para coordenadas lógicas e enviá-las ao motor.

Evite implementar antecipadamente um framework genérico de drag-and-drop.

## 5. Separar cores da identidade das peças

Revise a forma como as cores são atribuídas.

Não vincule estilos visuais a IDs específicos de instâncias, como `A-1` ou `B-1`.

O modelo deve distinguir:

- Tipo de peça.
- Instância individual.
- Dados geométricos.
- Apresentação visual.

Peças do mesmo tipo podem compartilhar a mesma identidade visual, mesmo quando existem várias instâncias.

Atribua cores por tipo ou por metadados de apresentação.

A lógica de validação não deve depender de cores.

Evite inserir propriedades exclusivamente visuais no motor de geometria quando elas puderem permanecer na camada de apresentação.

## 6. Revisar renderização e performance

Inspecione `GameBoard.tsx` e componentes relacionados.

Verifique se existem cálculos geométricos repetidos desnecessariamente durante a renderização.

Se houver:

- Extraia cálculos puros para funções reutilizáveis.
- Utilize memoização somente quando houver benefício justificável.
- Evite criar estados derivados redundantes.
- Não duplique informações que já possam ser obtidas do estado do jogo.

O tabuleiro atual é pequeno. Portanto, não implemente otimizações prematuras ou caches complexos.

A prioridade é manter o código simples, correto e preparado para futuras interações em tempo real.

## 7. Melhorar feedback de interação

Mantenha a interface atual, mas melhore a clareza das ações.

### Seleção

Uma peça selecionada deve ter destaque visual evidente.

### Rotação

A orientação atual deve ser facilmente compreendida.

### Posicionamento válido

A peça deve aparecer exatamente na posição lógica definida pelo motor.

### Posicionamento inválido

Apresente um feedback discreto explicando o motivo.

Exemplos:

- Posição fora do tabuleiro.
- Espaço já ocupado.
- Encaixe incompatível.

Evite mensagens genéricas como "Erro".

### Vitória

Preserve o reconhecimento da conclusão do desafio.

Uma partida não pode ser declarada concluída enquanto existirem peças obrigatórias não posicionadas ou restrições geométricas não satisfeitas.

Respeite a preferência por movimento reduzido quando aplicar transições CSS.

## 8. Verificar desfazer e refazer

Revise o gerenciamento de histórico.

Confirme o comportamento nas operações:

- Posicionar.
- Remover.
- Rotacionar.
- Desfazer.
- Refazer.
- Reiniciar.

Defina explicitamente quais ações fazem parte do histórico de jogadas.

A simples seleção visual de uma peça não precisa representar uma jogada.

Garanta que:

1. Desfazer não produza estados impossíveis.
2. Refazer restaure a operação correta.
3. Uma nova jogada após desfazer invalide o histórico futuro.
4. Reiniciar não preserve estados inconsistentes.
5. O histórico tenha um limite razoável, se necessário.

Não modifique a semântica do histórico sem documentar a decisão.

## 9. Preservar a demonstração

A demonstração da Etapa 1 deve continuar funcionando.

Não modifique arbitrariamente:

- Quantidade de peças.
- Geometria das peças.
- Dimensões do tabuleiro.
- Restrições dos encaixes.
- Condições de vitória.

Se alguma alteração for realmente necessária para corrigir um bug, explique a causa e documente a mudança.

**Não tente transformar a demonstração em uma reprodução oficial do Cilada.**

A geometria real será validada posteriormente.

## 10. Manter a arquitetura preparada para multiplayer

O estado lógico do jogo deve continuar determinístico e serializável.

As operações geométricas devem permanecer como funções puras sempre que possível.

Evite introduzir dependências do navegador dentro do motor.

Não implemente:

- WebSocket.
- Socket.IO.
- Salas.
- Autenticação.
- Banco de dados.
- Sincronização online.

Essas funcionalidades pertencem a etapas futuras.

## 11. Restrições de implementação

- Não reinstale ou recrie o projeto desnecessariamente.
- Não altere versões de dependências sem necessidade comprovada.
- Não adicione bibliotecas apenas para resolver problemas simples.
- Não reescreva componentes que já funcionam.
- Não implemente drag-and-drop completo.
- Não implemente novos modos de jogo.
- Não altere as regras para facilitar o desenvolvimento.
- Não crie testes unitários extensos.
- Não faça mudanças cosméticas sem benefício funcional ou de usabilidade.
- Não avance para a Etapa 2.

Priorize correções localizadas, com baixo risco de regressão.

## 12. Verificações obrigatórias

Execute os comandos aplicáveis ao projeto para:

1. Verificar tipos TypeScript.
2. Executar lint.
3. Gerar build de produção.

Quando houver ambiente de navegador disponível, verifique também o comportamento visual nas três resoluções especificadas.

Caso não seja possível executar algum teste, informe a limitação. Não declare um teste como aprovado sem executá-lo.

## 13. Documentação

Crie:

`docs/stage-01-1.md`

Documente:

- Problemas confirmados.
- Correções realizadas.
- Arquivos modificados.
- Decisões arquiteturais.
- Limitações conhecidas.
- Resultados das verificações.
- Roteiro de testes manuais.

Atualize `docs/geometry-assumptions.md` somente quando houver uma mudança ou esclarecimento relevante.

Não modifique `AGENTS.md` automaticamente. Se identificar a necessidade de uma nova diretriz permanente, apresente a sugestão ao final da entrega.

## 14. Critérios de aceite

A Etapa 1.1 estará concluída quando:

- Os problemas de CSS identificados estiverem corrigidos.
- A interface permanecer responsiva.
- A seleção de peças estiver consistente.
- Peças posicionadas puderem ser selecionadas diretamente.
- Rotação e normalização continuarem corretas.
- A arquitetura estiver preparada para drag-and-drop.
- As cores não dependerem de IDs individuais.
- As validações geométricas continuarem corretas.
- O histórico de desfazer/refazer funcionar.
- O desafio de demonstração continuar solucionável.
- Não existirem novas regressões conhecidas.
- TypeScript, lint e build passarem.
- A documentação da etapa estiver completa.

## 15. Entrega final

Ao concluir, apresente:

1. Resumo dos problemas confirmados.
2. Lista das correções implementadas.
3. Arquivos modificados.
4. Resultado das verificações.
5. Instruções para executar o projeto.
6. Roteiro numerado de testes manuais.
7. Problemas pendentes e limitações.
8. Recomendações objetivas para a Etapa 2.

**Pare após a Etapa 1.1.**

Não inicie novas funcionalidades sem aprovação.

O objetivo é deixar a fundação estável e previsível antes de acrescentar interações mais sofisticadas.
