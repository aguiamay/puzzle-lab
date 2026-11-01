# Premissas geométricas — etapa 1

## Fontes e fatos confirmados
Inspeção de `references/JogoCilada.html`: 509 entradas sequenciais, de 001 a 509. Categorias: Jogos originais (001–050, 50); Jogos adicionais com duas peças grandes (051–213, 163); com quatro peças grandes (214–501, 288); com seis peças grandes (502–509, 8). Os identificadores 021 e 025 têm o código AABBCCCDEFFIJ; ambos devem ser preservados. O HTML contém códigos e URLs de PNGs, não coordenadas estruturadas. Nenhuma imagem foi usada como geometria ou recurso visual.

## Inferências
Os códigos representam multiplicidades de tipos, conforme o prompt. Não comprovam disposição ou solucionabilidade. Os nomes de categoria não permitem deduzir dimensões.

## Desconhecido / não verificado
Dimensões e encaixes reais do tabuleiro, geometria completa de cada letra, rotações legais, permissão de espelhamento e soluções oficiais. São necessárias referências dimensionadas das duas faces das peças, tabuleiro e regras verificáveis.

## Decisões provisórias, anteriores à implementação
Demonstração DEMO-01 independente: grade 4 × 3 de quadrados unitários. Tipo A: dominó horizontal com duas células circulares; duas instâncias A-1 e A-2. Tipo B: triominó em L, células quadradas (1,0), (0,1), (1,1). Tipo C: triominó reto de células circulares. Tipo D: dominó de células quadradas. Coordenadas começam em zero; y cresce para baixo. Rotações horárias em quartos de volta, normalizadas no canto superior esquerdo da caixa delimitadora. Sem espelhamento habilitado.

Cada casa exige círculo ou quadrado. Linha 1: círculo, círculo, quadrado, quadrado; linha 2: círculo, círculo, quadrado, quadrado; linha 3: círculo, círculo, círculo, quadrado. O marcador de encaixe acompanha a célula ao rotacionar. Essas restrições são regras explícitas desta demonstração, não do produto de referência.

Solução conhecida (posição da caixa delimitadora, coordenadas zero-based): A-1 em (0,0), A-2 em (0,1), ambas 0°; B em (2,0), 180°; C em (0,2), 0°; D em (3,1), 90°. Área total: 12 células, sem sobreposição. Exemplo visualmente cabível porém incompatível: A-1 em (2,0), 0° (círculos sobre casas quadradas).

## Limitações
Somente geometrias discretas de células quadradas com marcadores simétricos são representáveis nesta etapa. Formatos reais podem exigir outro modelo de célula/encaixe; dados estão separados do motor, mas não se promete representar qualquer geometria contínua sem adaptação. Catálogo não importado; referência original preservada intacta. Apenas a demonstração é jogável. Sua validação não valida o jogo de referência.

## Esclarecimento de coordenadas — etapa 1.1
Nenhuma geometria, regra, quantidade ou solução mudou. Cada `(x,y)` local identifica o canto superior esquerdo de uma célula unitária. O espaço local original é o definido pelo tipo; `normalize` subtrai os mínimos x/y, de modo que a caixa delimitadora começa em (0,0), mesmo que esse canto não contenha uma célula (caso de B a 0°).

`rotate90` transforma índices de células por `(x,y) → (-y,x)` e normaliza. Com y crescendo para baixo, isso é horário. `transform` aplica orientação e eventual reflexão ao tipo sem mutá-lo. `position` é a âncora lógica: o canto superior esquerdo da caixa normalizada no tabuleiro. Uma célula ocupa `position + localCell`. Rotacionar uma peça colocada preserva essa âncora; se inválido, preserva integralmente a jogada anterior.

Na interação atual, clicar numa casa vazia envia seu índice inteiro como âncora. Clicar em casa ocupada só seleciona; não envia PLACE_PIECE. Nenhuma coordenada em pixels chega ao motor.

Contrato para a futura etapa de arraste (documentado, não implementado): a interface deve converter o ponteiro para espaço lógico do tabuleiro pela transformação inversa de sua apresentação. Conservar o ponto agarrado em coordenadas locais normalizadas; calcular a âncora contínua como `ponteiroLógico - pontoAgarradoLocal`, aplicando uma política explícita de snap apenas ao posicionar. Ao girar durante o arraste, transformar também o ponto agarrado para conservar a mesma região sob o ponteiro. Não reutilizar cegamente a rotação dos índices para pontos contínuos: em uma caixa normalizada de altura H, um ponto contínuo `(u,v)` gira para `(H-v,u)`, enquanto o índice de célula gira para `(H-1-y,x)`. Exemplo: centro (0.5,0.5) em dominó 2×1 vira (0.5,0.5) a 90°; centro (1.5,0.5) vira (0.5,1.5). Isso evita saltos sem offsets em pixels. A conversão de eventos e o snap pertencem à interface; as validações permanecem discretas e puras.

## Pesquisa parcial — etapa 3A
A situação anterior de ausência de imagens foi superada: 001, 002 e 008 foram acessadas e conferidas. Confirmados **nos desenhos publicados**: grade 7 × 4, 28 marcas centrais círculo/quadrado/cruz e contornos de regiões. Inferidos: ocupação por quadrados unitários e compatibilidade por igualdade das marcas; provisório: laboratório com quartos de volta e sem espelhamento. Desconhecidos: correspondência A–N, faces, regras completas e equivalência com a edição física. Nenhum tipo A–N nem desafio real recebeu certificação. Ver `original-geometry-research.md` para matriz, regiões, fontes e confiança.

DEMO-01 permanece inalterada como configuração, em `/` e `/lab/demo`. `/lab/research` usa dados próprios, IDs R01–R10 e `geometryStatus: unverified`, sem assistência final. O novo símbolo `cross` é simétrico por quartos de volta; acompanha sua célula nas transformações. O contrato atual ainda não representa encaixes orientados, fora dos centros ou geometria contínua. Não generalizar a validade do modelo antes de verificar essas lacunas.
