# CODEX — ETAPA 1: Fundação e motor geométrico do Puzzle Lab

## Contexto

Vamos desenvolver um jogo web premium de quebra-cabeças geométricos, inspirado na mecânica clássica do jogo Cilada, mas com nome, identidade visual e experiência próprios.

O desenvolvimento será incremental, em etapas independentes. Esta solicitação contempla **exclusivamente a Etapa 1**.

O produto final terá modos solo, multiplayer competitivo e multiplayer cooperativo, funcionando em desktop, tablet e celular.

**Nesta etapa, a prioridade é garantir um motor geométrico correto, extensível e verificável, integrado a uma primeira interface realmente utilizável.**

Não implemente funcionalidades de etapas futuras.

## 1. Tecnologias

- Next.js com App Router
- React
- TypeScript com strict mode
- CSS Modules e CSS custom properties
- SVG para renderização do tabuleiro e das peças
- Motor do jogo escrito em TypeScript puro
- Sem backend, banco de dados ou autenticação nesta etapa
- Evitar dependências externas desnecessárias

Use versões estáveis e compatíveis entre si. Não fixe versões antigas sem justificativa.

Se o diretório já contiver um projeto, inspecione-o antes de modificar qualquer configuração. Se estiver vazio, inicialize o projeto.

## 2. Referência de mecânica

O jogo de referência possui peças geométricas que precisam ser posicionadas sobre um tabuleiro, respeitando os formatos de encaixe e preenchendo integralmente a área válida.

As peças são identificadas por letras. Uma combinação como `AABCDDEFGIKN` descreve um multiconjunto de peças: duas ocorrências de A, duas de D e uma de cada outra letra indicada.

Existe um arquivo de referência chamado `JogoCilada.html`, contendo 509 desafios numerados.

Se o arquivo estiver disponível no workspace:

1. Inspecione sua estrutura real.
2. Identifique as categorias e os códigos.
3. Preserve a ordem e a numeração.
4. Observe que os desafios 021 e 025 têm o mesmo código.
5. Não confunda sequências de letras com soluções geométricas.
6. Não dependa dos PNGs para renderizar a interface.

**Restrição crítica:** o HTML não contém, por si só, as coordenadas, orientações ou a geometria completa das peças.

Não invente essas informações e não apresente um tabuleiro arbitrário como se fosse uma reprodução fiel.

Antes de codificar o modelo geométrico, registre quais características estão confirmadas, quais são inferências e quais permanecem desconhecidas.

Se faltarem referências suficientes, implemente uma geometria provisória explicitamente identificada como experimental, usando um pequeno conjunto de peças e um tabuleiro de demonstração. Deixe a arquitetura preparada para substituir essa geometria depois, sem reescrever o motor.

A prioridade é a correção da mecânica, não reproduzir visualmente uma solução que ainda não foi validada.

## 3. Estrutura sugerida

Organize o projeto aproximadamente assim:

```text
src/
  app/
    page.tsx
    layout.tsx
    globals.css

  components/
    game/
      GameBoard.tsx
      GamePiece.tsx
      PieceTray.tsx
      GameToolbar.tsx
      GameStatus.tsx

  game/
    engine/
      geometry.ts
      transformations.ts
      placement.ts
      validation.ts
      types.ts

    data/
      pieces.ts
      challenges.ts
      demo.ts

    state/
      useGame.ts

  styles/
    tokens.css

docs/
  geometry-assumptions.md
  stage-01.md
```

A estrutura pode ser ajustada se houver uma justificativa técnica concreta.

Não crie abstrações genéricas sem necessidade.

## 4. Modelo geométrico

Implemente um modelo independente da interface.

### 4.1 Peças

Cada peça deve possuir:

- ID único da instância;
- código do tipo de peça;
- geometria local;
- orientação atual;
- posição atual, quando colocada;
- estado de seleção e posicionamento;
- representação adequada para renderização em SVG.

É essencial distinguir o **tipo da peça** de sua **instância**.

Exemplo: um desafio com `AA` contém duas instâncias distintas do tipo A, e ambas precisam ser posicionadas.

### 4.2 Tabuleiro

O tabuleiro deve possuir:

- dimensões parametrizáveis;
- unidades discretas de posicionamento;
- identificação das posições ocupadas;
- representação dos encaixes ou restrições geométricas;
- transformação de coordenadas lógicas para SVG.

Não fixe dimensões com base em suposições não verificadas.

### 4.3 Transformações

Implementar operações puras para:

- translação;
- rotação de 90°, quando compatível com o modelo;
- normalização de coordenadas;
- obtenção da geometria transformada;
- detecção de posições ocupadas.

Não permitir que transformações alterem a geometria original armazenada.

Deixe o suporte a espelhamento preparado no modelo, mas não habilite a ação para o jogador até confirmar que ela é permitida pelas regras.

### 4.4 Validação

O motor deve detectar:

- posicionamento fora dos limites;
- sobreposição entre peças;
- incompatibilidade entre formatos de encaixe;
- tentativas de colocar a mesma instância duas vezes;
- desafio incompleto;
- desafio concluído corretamente.

O estado de vitória deve depender exclusivamente de regras geométricas, não de animações ou condições artificiais da interface.

Se alguma regra do jogo original ainda não estiver confirmada, documente-a como pendente, sem simular fidelidade.

## 5. Interface inicial funcional

Criar uma tela de jogo com:

**Cabeçalho**

- Nome provisório Puzzle Lab;
- indicação de que se trata da versão experimental;
- acesso à identificação do desafio em execução.

**Área central**

- Tabuleiro SVG responsivo;
- linhas e encaixes claramente distinguíveis;
- peças renderizadas vetorialmente;
- posicionamento visual correto;
- indicação de seleção.

**Bandeja de peças**

- Peças disponíveis;
- identificação visual individual;
- destaque da peça selecionada;
- indicação de peças já posicionadas.

**Barra de ferramentas**

- Rotacionar peça selecionada;
- remover peça do tabuleiro;
- desfazer;
- refazer;
- reiniciar desafio.

Todos os controles exibidos precisam funcionar.

Não adicionar botões meramente decorativos.

## 6. Interação — primeira versão

Nesta etapa, implemente primeiro um fluxo de seleção e posicionamento robusto:

1. O jogador seleciona uma peça.
2. A peça recebe destaque visual.
3. O jogador pode rotacioná-la.
4. O jogador seleciona uma posição do tabuleiro.
5. O motor valida o encaixe.
6. Se válido, a peça é posicionada.
7. Se inválido, a jogada é recusada e o motivo aparece de forma compreensível.
8. O jogador pode selecionar uma peça posicionada para removê-la.
9. Desfazer e refazer restauram estados válidos.
10. O jogo reconhece a conclusão corretamente.

Não é obrigatório implementar drag-and-drop completo agora. Ele será prioridade na Etapa 2.

A interação deve funcionar por clique e toque, sem exigir precisão excessiva no celular.

Teclado e leitor de tela devem ter uma base semântica adequada, com controles identificáveis e indicação textual de erros.

## 7. Direção visual

Criar um design 2D premium, com:

- fundo claro e neutro;
- tabuleiro de aparência elegante;
- peças com cores distintas e boa diferenciação;
- sombras sutis;
- cantos suavemente arredondados;
- tipografia legível;
- espaçamento consistente;
- transições discretas;
- contraste apropriado;
- feedback imediato de jogadas válidas e inválidas.

Usar SVG e CSS em vez de PNGs.

Não copiar layouts, marcas, ilustrações ou identidade visual do produto comercial.

A interface precisa comunicar claramente três coisas:

1. Qual peça está selecionada.
2. Onde ela pode ser colocada.
3. O que acontece depois de cada ação.

Evitar painéis excessivos, elementos pequenos e uma interface visualmente carregada.

## 8. Responsividade

Suportar três cenários:

**Desktop:** tabuleiro com destaque central e bandeja acessível lateralmente ou abaixo.

**Tablet:** tabuleiro grande, peças acessíveis e controles adequados para toque.

**Celular:** layout vertical, tabuleiro proporcionalmente redimensionado e comandos sem sobreposição.

O SVG deve utilizar `viewBox`, evitando coordenadas de apresentação dependentes de pixels fixos.

Manter as coordenadas do motor independentes da escala visual.

Garantir que o jogo possa ser usado com mouse e toque.

## 9. Preparação arquitetural para multiplayer

Não implementar multiplayer nesta etapa.

Entretanto, organizar as ações do motor como operações determinísticas, por exemplo:

- SELECT_PIECE
- ROTATE_PIECE
- PLACE_PIECE
- REMOVE_PIECE
- UNDO
- REDO
- RESET

Separar ações puramente visuais das ações que alteram o estado lógico da partida.

O estado do jogo deve ser serializável.

A execução de uma mesma ação sobre um mesmo estado deve produzir o mesmo resultado, independentemente do dispositivo.

Evitar dependência do DOM, SVG ou React dentro do motor.

Essas decisões permitirão reutilizar a lógica futuramente em um servidor autoritativo.

## 10. Dados dos desafios

Criar estruturas preparadas para receber:

```ts
interface Challenge {
  id: string;
  originalNumber?: number;
  category: string;
  pieceCodes: string[];
  source: "original" | "generated" | "demo";
  geometryStatus: "verified" | "unverified";
}
```

Adaptar se necessário.

Os desafios podem possuir códigos repetidos e devem preservar multiplicidades.

Se importar o catálogo de 509 desafios, deixar os dados em arquivo separado.

Importar o catálogo não significa declarar que os desafios estão geometricamente validados.

Nesta etapa, disponibilizar na interface apenas desafios de demonstração cuja geometria tenha sido efetivamente definida e validada.

Não gerar soluções aleatórias e apresentá-las como oficiais.

## 11. Demonstração obrigatória

Criar um cenário experimental pequeno e solucionável, com peças cuja geometria esteja completamente definida no código.

Esse cenário precisa permitir validar manualmente:

- encaixe válido;
- encaixe inválido;
- rotação;
- sobreposição;
- limites;
- remoção;
- desfazer/refazer;
- reconhecimento de vitória.

A solução correta deve ser conhecida e documentada.

Incluir ao menos um caminho de jogadas que conclua a demonstração e um exemplo de jogada que pareça possível visualmente, mas deva ser recusada pelo motor.

Não confundir o cenário experimental com um desafio oficial do Cilada.

## 12. Qualidade e restrições

- TypeScript strict, sem `any` injustificado.
- Não deixar erros de TypeScript, lint ou build.
- Não criar testes unitários extensos nesta etapa.
- Realizar verificação por build, checagem de tipos e roteiro manual reproduzível.
- Código legível, com responsabilidades claras.
- Evitar arquitetura excessivamente abstrata.
- Evitar dependências apenas para operações simples.
- Não adicionar backend, login, chat, ranking ou multiplayer.
- Não adicionar temporariamente regras falsas para facilitar a demonstração.
- Não mascarar bugs geométricos com ajustes visuais.

## 13. Documentação obrigatória

Criar `docs/geometry-assumptions.md` com:

- evidências disponíveis;
- características confirmadas;
- características ainda não verificadas;
- decisões temporárias;
- limitações;
- informações necessárias para fidelidade ao jogo original.

Criar `docs/stage-01.md` com:

- funcionalidades concluídas;
- instruções para executar;
- instruções para realizar testes manuais;
- problemas conhecidos;
- limitações da etapa;
- próximos passos sugeridos.

## 14. Critérios de aceite

A Etapa 1 só estará concluída se:

- A aplicação iniciar localmente.
- O tabuleiro aparecer corretamente.
- As peças forem geradas programaticamente.
- Nenhuma peça visual depender de PNG.
- A geometria estiver isolada da interface.
- Peças puderem ser selecionadas e rotacionadas.
- Posicionamentos inválidos forem recusados.
- Sobreposições forem detectadas.
- Desfazer/refazer funcionarem.
- O motor reconhecer corretamente uma solução.
- O cenário de demonstração puder ser concluído manualmente.
- A interface funcionar com mouse e toque.
- O layout se adaptar a desktop, tablet e celular.
- Build e TypeScript terminarem sem erros.
- As diferenças entre demonstração e jogo original estiverem documentadas.

## 15. Entrega final do Codex

Ao terminar:

1. Informe quais arquivos foram criados ou modificados.
2. Explique resumidamente a arquitetura.
3. Informe como iniciar o projeto.
4. Informe os comandos de verificação executados e seus resultados.
5. Apresente um roteiro de testes manuais numerado.
6. Declare quais regras estão confirmadas e quais ainda dependem de referências.
7. Liste eventuais limitações conhecidas.
8. Não avance automaticamente para a Etapa 2.

**Importante:** quero testar a Etapa 1 e aprová-la antes de receber a implementação da próxima fase.

Priorize uma implementação funcional, verificável e bem estruturada, não apenas uma apresentação visual convincente.
