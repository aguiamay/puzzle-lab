# CODEX — ETAPA 3A: Reconstrução da geometria real do jogo

## Contexto

Estamos desenvolvendo o Puzzle Lab, um jogo web de encaixe geométrico inspirado na mecânica do Cilada, com identidade visual própria.

Tecnologias atuais:

- Next.js App Router
- React
- TypeScript
- SVG programático
- CSS Modules
- Motor geométrico TypeScript independente do React

Etapas concluídas e homologadas:

- Etapa 1: motor geométrico experimental.
- Etapa 1.1: estabilização.
- Etapa 1.1.1: correções visuais.
- Etapa 2: drag-and-drop, snap e prévia.
- Etapa 2.1: refinamento de rotação, alinhamento e experiência mobile.

A interface já possui interações por mouse, touch, rotação durante o arraste, bandeja responsiva, posicionamento, remoção, validação, desfazer/refazer e reconhecimento de vitória.

O objetivo agora é substituir gradualmente a geometria experimental por uma geometria fiel ao jogo de referência, sem perder as funcionalidades existentes.

**Esta solicitação contempla exclusivamente a Etapa 3A.**

Não implemente a Etapa 3B, 3C ou 3D.

---

## 1. Preparação e inspeção

Antes de modificar arquivos:

1. Leia `AGENTS.md`.
2. Leia a documentação das etapas anteriores.
3. Inspecione o motor geométrico.
4. Identifique como as peças e o tabuleiro são representados.
5. Identifique as dependências entre geometria, validação e renderização.
6. Verifique os arquivos em `references/`, se existirem.
7. Inspecione o HTML original das 509 combinações, se disponível.

Fonte de referência:

https://www.dudz.com.br/Cilada/

O arquivo original `JogoCilada.html` contém 509 desafios, identificados por números e sequências de letras.

As imagens PNG estão referenciadas pelo código do desafio.

Exemplo:

`AABCDDEFGIKN.png`

URL correspondente:

https://www.dudz.com.br/Cilada/AABCDDEFGIKN.png

Não assuma que a imagem está acessível sem verificar.

Se houver restrições de rede ou referências ausentes, documente o problema e prossiga somente com as evidências disponíveis.

Não modifique o sistema experimental antes de compreender como substituí-lo.

## 2. Objetivo central

Reconstruir matematicamente:

- A geometria do tabuleiro original.
- A geometria dos diferentes tipos de peças.
- A distribuição das marcas ou encaixes.
- As regras de ocupação.
- As orientações permitidas.
- As restrições reais de posicionamento.

Não basta produzir peças visualmente parecidas.

O objetivo é representar corretamente as condições que tornam uma jogada válida ou inválida.

Se não houver informações suficientes para comprovar a geometria de uma peça, deixe-a como não verificada.

## 3. Engenharia reversa das referências

### 3.1 Inspeção do HTML

Analise o HTML e extraia, para fins de pesquisa:

- Numeração dos desafios.
- Sequência de letras.
- Categorias.
- Referências das imagens.
- Observações e duplicidades.

Não transforme imediatamente os 509 desafios em fases jogáveis.

### 3.2 Inspeção das imagens

Selecione inicialmente um pequeno conjunto de imagens que, em conjunto, apresentem variedade de peças e orientações.

Use as imagens como referência visual, não como fonte de dados automaticamente confiável.

Para cada imagem analisada:

1. Identifique as dimensões aparentes do tabuleiro.
2. Localize a grade ou unidades geométricas de referência.
3. Identifique os limites das peças.
4. Identifique as marcas de encaixe.
5. Identifique cores, formatos e possíveis padrões.
6. Relacione regiões com os códigos das peças, somente quando houver evidência.
7. Registre ambiguidades.

Não presuma que peças da mesma cor têm obrigatoriamente a mesma geometria.

Não presuma que todas as marcas visuais são meramente decorativas.

Não use reconhecimento automático de imagens como única evidência para declarar uma forma validada.

### 3.3 Observações importantes

O catálogo utiliza letras entre A e N, mas a quantidade de tipos não deve ser confundida com a quantidade total de peças físicas.

As ocorrências repetidas de uma letra representam instâncias distintas do mesmo tipo, conforme a interpretação adotada para o catálogo.

Verifique essa interpretação com evidências adicionais antes de considerá-la definitivamente comprovada.

O desafio 025 possui o mesmo código do desafio 021. Preserve ambos os identificadores.

## 4. Relatório de evidências

Antes de consolidar o modelo, criar:

`docs/original-geometry-research.md`

Este documento deve conter:

- Fontes utilizadas.
- Referências efetivamente acessadas.
- Imagens analisadas.
- Dimensões identificadas.
- Geometrias confirmadas.
- Inferências ainda não confirmadas.
- Peças não identificadas.
- Regras confirmadas.
- Regras desconhecidas.
- Nível de confiança por elemento.
- Próximas evidências necessárias.

Classificar cada conclusão em:

- VERIFIED: sustentada por referência e conferência.
- INFERRED: consistente com evidências, mas ainda não comprovada.
- UNKNOWN: dados insuficientes.

Não converter inferências em fatos confirmados.

## 5. Modelo matemático

Criar um modelo de geometria independente da interface, capaz de representar as peças efetivamente identificadas.

O modelo deve comportar:

- Tipo de peça.
- ID da instância.
- Coordenadas locais.
- Dimensões e ocupação.
- Marcas ou restrições de encaixe.
- Orientação.
- Origem lógica.
- Transformações.

Sugestão conceitual:

```ts
type GeometryConfidence =
  | "verified"
  | "inferred"
  | "unknown";

interface GeometricCell {
  x: number;
  y: number;
  connector?: string;
}

interface PieceDefinition {
  type: string;
  cells: GeometricCell[];
  geometryConfidence: GeometryConfidence;
  sourceReferences: string[];
}
```

Este exemplo é apenas ilustrativo.

Adapte o contrato à geometria realmente identificada.

Não utilize uma grade de células quadradas se ela não representar adequadamente as regras reais.

Caso o jogo utilize marcas de encaixe independentes da ocupação, modele-as explicitamente.

Não codifique regras de colisão ou compatibilidade em cores CSS.

## 6. Transformações e rotações

O modelo deve suportar as orientações permitidas pelas regras comprovadas.

Reutilize o mecanismo de rotação atual sempre que ele for aplicável.

Verifique:

- Integridade da geometria após rotação.
- Normalização de coordenadas.
- Transformação das marcas de encaixe.
- Compatibilidade com âncora de arraste.
- Compatibilidade com o snap existente.
- Deduplicação de orientações geometricamente equivalentes.

Não habilite espelhamento sem confirmação de que ele faz parte da mecânica.

Uma peça rotacionada precisa manter suas restrições geométricas.

## 7. Modelo do tabuleiro

Crie uma definição separada da geometria das peças.

Ela deve representar:

- Limites.
- Posições válidas.
- Unidades de ocupação.
- Restrições de encaixe.
- Coordenadas lógicas.

Caso as referências comprovem uma grade regular, implemente-a de forma parametrizável.

Não deduza dimensões exclusivamente pelo protótipo experimental.

Não altere o tamanho do tabuleiro apenas para acomodar uma peça que foi modelada incorretamente.

## 8. Validação geométrica

Adaptar, se necessário, as funções existentes para verificar:

- Limites do tabuleiro.
- Sobreposição.
- Compatibilidade entre marcas de encaixe.
- Transformações válidas.
- Ocupação correta.
- Instâncias de peças.
- Conclusão integral do desafio.

O motor deve rejeitar peças que não satisfazem as regras.

Evite condicionais específicas para uma imagem, posição ou desafio.

A mesma função de validação deve funcionar para diferentes configurações.

Não reescreva o motor inteiro se for possível estender os contratos atuais.

## 9. Integração com a interface

A nova geometria deve utilizar os componentes SVG e os mecanismos de interação existentes.

Preservar:

- Drag-and-drop.
- Rotação.
- Snap.
- Ghost Piece.
- Touch.
- Bandeja.
- Seleção.
- Remoção.
- Desfazer/refazer.
- Vitória.

Não implementar novamente essas funcionalidades.

Se necessário, adapte a camada que converte a geometria em elementos SVG.

As peças devem continuar sendo geradas programaticamente, sem depender dos PNGs durante a execução do jogo.

Preserve a identidade visual independente do Puzzle Lab.

## 10. Demonstração experimental preservada

Não remova a demonstração existente.

Ela deve permanecer disponível como um modo de desenvolvimento, por exemplo:

`/lab/demo`

A demonstração original servirá como referência para verificar regressões.

O novo conjunto de peças deve utilizar uma configuração independente.

Evite misturar dados experimentais com dados reais não verificados.

## 11. Primeiro desafio real

Se houver evidências suficientes para definir a geometria de todas as peças exigidas por um desafio e sua solução, implemente um único desafio real para validação.

Priorize o desafio 001 somente se ele possuir referências suficientes. Caso contrário, escolha outro e documente a justificativa.

Esse desafio deve:

1. Utilizar os tipos e instâncias corretos.
2. Apresentar o tabuleiro validado.
3. Permitir manipular as peças com a UX atual.
4. Verificar posicionamentos reais.
5. Permitir concluir uma solução comprovada.
6. Reconhecer corretamente a vitória.

A solução de referência deve ser armazenada como dados geométricos, não como PNG.

Valide a solução reproduzindo todas as posições e orientações por meio do próprio motor.

Se as informações forem insuficientes, não invente uma solução.

Nesse caso, entregue o modelo parcial, o relatório de lacunas e uma demonstração técnica claramente identificada como não validada.

## 12. Verificações de consistência

Implementar um procedimento de auditoria geométrica que permita conferir:

- Número de células por peça.
- Número total de posições ocupadas.
- Ocupação exigida pelo tabuleiro.
- Multiplicidade das instâncias.
- Coordenadas duplicadas.
- Integridade das orientações.
- Conectividade, quando exigida pelas regras.
- Compatibilidade das marcas.
- Preservação da geometria em rotações completas.

Uma rotação de quatro passos de 90° deve restaurar a geometria original para peças submetidas a esse sistema de rotação.

Não assumir que a soma das áreas basta para comprovar que um desafio é solucionável.

## 13. Preparação para solucionador

Nesta etapa, não implemente a busca completa por soluções.

Entretanto, o modelo geométrico deve ser independente do React e permitir:

- Enumerar posições candidatas.
- Avaliar um posicionamento.
- Aplicar uma jogada em um estado lógico.
- Reverter ou reconstruir estados.
- Verificar a conclusão.

Essas operações serão utilizadas pela Etapa 3B.

Não implementar um algoritmo de busca em interface React.

## 14. Qualidade e performance

- TypeScript strict.
- Funções geométricas puras sempre que possível.
- Sem dependências externas desnecessárias.
- Sem backend.
- Sem banco de dados.
- Sem multiplayer nesta etapa.
- Sem testes unitários extensos.
- Executar typecheck, lint e build.
- Não alterar `AGENTS.md` automaticamente.

Como a geometria é o fundamento do jogo, é aceitável criar pequenas verificações determinísticas ou scripts de auditoria matemática, mesmo mantendo a diretriz de evitar suítes extensas de testes.

Não otimizar prematuramente a busca, pois ela ainda não será implementada.

## 15. Entregáveis

Criar:

`docs/stage-03a.md`

`docs/original-geometry-research.md`

Organizar os dados geométricos em arquivos separados dos componentes.

Se necessário, criar um script de auditoria reutilizável.

A documentação deve diferenciar com clareza:

- O que foi comprovado.
- O que foi implementado.
- O que funciona apenas de maneira experimental.
- O que ainda não foi identificado.

## 16. Critérios de aceite

A Etapa 3A estará concluída quando:

1. As referências disponíveis tiverem sido realmente inspecionadas.
2. A geometria estiver documentada com evidências.
3. O modelo matemático suportar as características confirmadas.
4. Peças e tabuleiro forem renderizados em SVG.
5. O motor continuar independente do React.
6. As validações forem coerentes com a geometria.
7. A UX das etapas anteriores continuar funcionando.
8. A demonstração experimental permanecer acessível.
9. Pelo menos um desafio real estiver validado de ponta a ponta, se houver evidências suficientes.
10. As lacunas estiverem explicitamente documentadas.
11. TypeScript, lint e build passarem.

Se não houver evidências suficientes para o primeiro desafio real, não declare a reconstrução concluída. Entregue o progresso verificável e identifique exatamente os materiais que faltam.

## 17. Relatório final

Apresente:

1. Fontes efetivamente acessadas.
2. Quantidade de tipos de peças identificados.
3. Quantidade de tipos com geometria comprovada.
4. Geometria do tabuleiro.
5. Regras confirmadas.
6. Arquivos criados e modificados.
7. Desafios que puderam ser validados.
8. Verificações executadas.
9. Limitações e lacunas.
10. Roteiro de testes manuais.
11. Preparação necessária para a Etapa 3B.

Não avance para o solucionador nem para a importação dos 509 desafios jogáveis.

**Pare ao concluir a Etapa 3A ou ao identificar uma ausência de referências que impeça uma implementação fiel.**

Não substitua dados desconhecidos por suposições silenciosas.

A prioridade é precisão matemática e fidelidade às regras, mantendo toda a experiência de uso já desenvolvida.
