# AGENTS.md — Puzzle Lab

## Missão
Construir um jogo web de quebra-cabeça geométrico inspirado na mecânica de Cilada, com identidade visual independente, excelente UX e, em etapas futuras, multiplayer competitivo e cooperativo.

## Instruções permanentes
- Responda e documente em português brasileiro.
- Desenvolva **somente a etapa solicitada**. Não antecipe funcionalidades de etapas futuras.
- Ao terminar uma etapa, pare e entregue relatório e roteiro de testes manuais. Aguarde aprovação explícita do usuário antes de avançar.
- Preserve decisões e funcionalidades já aprovadas. Antes de refatorar comportamento aprovado, explique impacto e justifique.
- Priorize correção geométrica, previsibilidade, usabilidade e acessibilidade antes de efeitos cosméticos.
- Nunca apresente suposições, demonstrações experimentais ou soluções geradas arbitrariamente como regras/soluções oficiais do Cilada.
- Não copie nomes comerciais, imagens, logotipos ou a identidade visual do jogo de referência.
- Não acrescente dependências sem justificativa concreta. Evite sobreengenharia.

## Stack e arquitetura
- Next.js App Router, React, TypeScript estrito.
- SVG e CSS para tabuleiro e peças; não dependa de PNGs para renderizar geometria.
- CSS Modules e tokens CSS, salvo decisão técnica documentada.
- Separe o motor geométrico em TypeScript puro, sem dependência do React, DOM, SVG ou APIs de navegador.
- Modele de forma distinta **tipo de peça** e **instância de peça** (letras repetidas geram instâncias independentes).
- Use operações determinísticas sobre estado serializável, preparando a reutilização do motor em um futuro servidor autoritativo.
- Mantenha coordenadas lógicas separadas de coordenadas de apresentação e tamanhos em pixels.
- Não implemente backend, autenticação ou multiplayer antes da etapa correspondente.

## Fidelidade ao jogo e fontes
- O arquivo `JogoCilada.html`, quando disponível, contém 509 entradas numeradas, com categorias e códigos de peças; não contém, por si só, a geometria completa ou a disposição das soluções.
- Os desafios 021 e 025 compartilham o mesmo código; preserve os dois identificadores e a numeração original.
- Não deduza dimensões do tabuleiro, conjunto completo de peças, geometria, rotações ou regras a partir de nomes ou códigos sem evidências.
- Documente em `docs/geometry-assumptions.md` o que está **confirmado**, **inferido**, **provisório** ou **desconhecido**, indicando as fontes disponíveis.
- Use desafios demonstrativos explicitamente rotulados até validar a geometria real.
- Validar uma entrada do catálogo não é o mesmo que provar sua solucionabilidade.
- Não trate o resultado de um algoritmo como solução oficial sem validação contra as regras e geometria verificadas.

## UX e visual
- Priorize clareza das ações, feedback imediato, alvos de toque confortáveis, contraste e responsividade.
- Suporte desktop, tablet e celular; mouse e toque desde a primeira etapa funcional.
- Mantenha estado selecionado, jogadas inválidas, progresso e conclusão fáceis de compreender.
- Não crie controles que aparentem funcionar mas sejam decorativos ou inertes.
- Prefira visual 2D premium com cores funcionais, espaçamento consistente e animações discretas.
- Preserve base de acessibilidade semântica; em etapas posteriores evolua interação por teclado e tecnologias assistivas.

## Qualidade e validação
- TypeScript `strict`; evite `any` injustificado.
- Execute os comandos de lint/typecheck/build aplicáveis, relatando os resultados sem inventar execução bem-sucedida.
- Nesta fase, priorize testes manuais reproduzíveis; não crie suíte de testes unitários sem solicitação.
- Verifique casos de encaixe válido/inválido, sobreposição, limites, rotação, remoção, undo/redo e vitória sempre que aplicável.
- Não mascare bugs de lógica com ajustes de apresentação.
- Registre pendências e riscos de forma explícita; não declare recursos completos se forem apenas protótipos.

## Documentação e conclusão de cada etapa
- Mantenha `docs/stage-XX.md` com escopo, implementação, comandos para rodar, verificações efetuadas, testes manuais, limitações e pendências.
- Registre alterações relevantes nas premissas geométricas e decisões arquiteturais.
- Ao concluir uma tarefa, reporte: arquivos modificados, resumo técnico, comandos executados, roteiro de testes manuais, riscos/limitações e o que ficou intencionalmente fora de escopo.
- **Pare ao concluir a etapa. Não prossiga automaticamente.**

## Próximas etapas planejadas (não implementar sem pedido)
1. Fundação e motor geométrico.
2. UX premium e interações.
3. Catálogo de 509 desafios, validação geométrica e solucionador.
4. Progressão solo.
5. Multiplayer local competitivo/cooperativo.
6. Multiplayer online em tempo real com validação autoritativa.
7. Polimento, acessibilidade, desempenho e distribuição.
