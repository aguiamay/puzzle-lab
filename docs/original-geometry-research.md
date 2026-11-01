# Pesquisa da geometria original — etapa 3A

## Resultado e alcance
Reconstrução **parcial**, não concluída como reprodução fiel do jogo físico. Há 14 letras A–N no catálogo; **zero tipos A–N com correspondência geométrica comprovada**. Na imagem 001 foram conferidas 12 regiões, agrupadas em dez geometrias locais distintas, incluindo as marcas. Esses identificadores R01–R10 não são letras do catálogo. Nenhum desafio real foi certificado.

VERIFIED significa observação conferida na fonte indicada, não certificação de todo o jogo. INFERRED significa hipótese coerente que ainda exige evidência externa. UNKNOWN significa dados insuficientes. As definições jogáveis de pesquisa permanecem `inferred` e o cenário `unverified`.

## Fontes efetivamente acessadas
Inspeção em 31/10/2026:

- `references/JogoCilada.html`, arquivo local integral, e [página de soluções](https://www.dudz.com.br/Cilada/), acessível na web.
- PNGs [001](https://www.dudz.com.br/Cilada/AABCDDEFGIKN.png), [002](https://www.dudz.com.br/Cilada/ABCDDEFFGJKM.png) e [008](https://www.dudz.com.br/Cilada/ABBCCCDDHKLN.png), baixados com HTTP bem-sucedido e realmente abertos para inspeção visual. Todos 281 × 161 pixels. A escolha cobre códigos variados: 001 não tem H/J/L/M, 002 acrescenta J/M e 008 acrescenta H/L; juntos citam A–N. Isso não identifica visualmente cada letra.
- [Página do fabricante](https://www.estrela.com.br/produto/cilada-150454): descreve escolher um desafio e encaixar peças; lista um tabuleiro e 24 peças. Essa contagem física não é a quantidade de tipos e não identifica a edição das imagens de soluções.
- Tentativa de `https://estrela.vteximg.com.br/arquivos/Manual-Estrela-Cilada.pdf`: ferramenta web informou URL inacessível. O caminho foi uma tentativa de localização; nenhum conteúdo de manual foi obtido e não se atribuem regras a ele.

Os PNGs ficaram temporariamente em `/tmp/puzzle-3a` para pesquisa. Não integram a aplicação nem são copiados para seus recursos visuais. O desenho do produto continua SVG próprio, sem identidade comercial de terceiros.

## Catálogo, sem importação jogável
Extração reproduzível por `npm run audit:geometry -- --catalog`: número como string com zeros, código, categoria, URL e observação. São 509 registros sequenciais, 508 códigos distintos. Categorias: originais 001–050 (50); duas peças grandes 051–213 (163); quatro 214–501 (288); seis 502–509 (8). 021 e 025 permanecem separados, código `AABBCCCDEFFIJ`; 025 traz `(=21)`.

VERIFIED: conteúdo textual acima. INFERRED: ocorrências repetidas representam instâncias do mesmo tipo; a imagem 001 tem 12 regiões para 12 letras e repetições de geometrias, mas não há legenda que permita comprovar a associação. UNKNOWN: inventário físico por letra e correspondência de edição. Validar esses registros não prova solução.

## Inspeção das três imagens
Todas apresentam limites externos retangulares de x=0 a 280 e y=0 a 160. Centros de marcas em x=20+40c e y=20+40l. Isso sustenta **sete colunas e quatro linhas na representação publicada** (VERIFIED). A dimensão métrica do tabuleiro físico é UNKNOWN; 40 pixels não são uma medida física.

As marcas visuais são círculo, quadrado e cruz de braços iguais; todas verdes nas três imagens. As linhas pretas separam regiões, não necessariamente cada unidade da grade. A cor não identifica tipos. A cruz é transcrita como símbolo visual: sua correspondência com a forma material do encaixe é UNKNOWN. Não se converte cruz em triângulo ou outra forma sem referência.

Matriz observada igual nas três imagens (O círculo, Q quadrado, + cruz), com x à direita e y para baixo:

```text
O O + + + O Q
O Q Q Q + Q +
Q O + O O Q O
Q O + Q + + O
```

A grade regular modela adequadamente a **discretização desses desenhos**. Usá-la como ocupação física e exigir igualdade entre marcas é INFERRED. Não se conhece folga, relevo, face inferior ou eventual restrição adicional. As marcas são restrições explícitas por célula no modelo técnico; não são cores CSS. Não há evidência, nessas imagens, de marcas fora dos centros ou orientação assimétrica dessas três marcas.

- **001**: 12 regiões: oito dominós e quatro regiões de três unidades em L. Duas geometrias aparecem duas vezes: círculo/cruz e cruz/cruz. Demais geometrias e coordenadas constam abaixo.
- **002**: 12 regiões: oito dominós e quatro L. Diferentes contornos e pares verticais, como círculos em (0,0)/(0,1) e (1,2)/(1,3); cruzes horizontais em (2,0)/(3,0) e (4,3)/(5,3). Mesma matriz, sem letras.
- **008**: 12 regiões: oito dominós e quatro L. Exemplos: L em (0,0)/(1,0)/(1,1); L em (3,2)/(2,3)/(3,3); cruz/cruz em (3,0)/(4,0). Mesma matriz, sem letras.

Conferência auxiliar leu pixels das fronteiras e calculou componentes conexos, encontrando 12 nas três imagens. Os contornos foram também inspecionados visualmente; o reconhecimento automático não é a única evidência. Não foram classificadas automaticamente as letras nem reconstruídas as outras 506 imagens.

## Regiões da imagem 001
Coordenadas globais zero-based, com marcas obtidas da matriz acima. VERIFIED **como transcrição visual**; INFERRED como tipos manipuláveis do jogo. Tipos locais iguais usam instâncias independentes. Orientação zero é a desenhada aqui, não uma orientação oficial.

| Instância local | Coordenadas globais | Área | Âncora |
|---|---|---:|---|
| R01-1 | (0,0), (0,1), (1,1) | 3 | (0,0) |
| R02-1 | (1,0), (2,0) | 2 | (1,0) |
| R03-1 | (3,0), (4,0) | 2 | (3,0) |
| R04-1 | (5,0), (4,1), (5,1) | 3 | (4,0) |
| R05-1 | (6,0), (6,1) | 2 | (6,0) |
| R06-1 | (2,1), (3,1) | 2 | (2,1) |
| R07-1 | (0,2), (1,2), (0,3) | 3 | (0,2) |
| R08-1 | (2,2), (3,2), (3,3) | 3 | (2,2) |
| R09-1 | (4,2), (5,2) | 2 | (4,2) |
| R10-1 | (6,2), (6,3) | 2 | (6,2) |
| R02-2 | (1,3), (2,3) | 2 | (1,3) |
| R03-2 | (4,3), (5,3) | 2 | (4,3) |

A auditoria reaplica essa disposição pelo reducer, exige 28/28, verifica multiplicidades, limites, sobreposição e marcas. O sucesso prova apenas consistência do modelo transcrito. A soma de áreas isolada não basta. Os dados não são apresentados como solução oficial do desafio 001.

## Confiança, regras e lacunas
| Elemento | Nível | Evidência / limite |
|---|---|---|
| 509 números, códigos e categorias | VERIFIED | HTML local e página consultada |
| Grade desenhada 7 × 4 e matriz | VERIFIED | Conferência das três imagens |
| Contornos e dez geometrias de 001 | VERIFIED na imagem | Sem identificação alfabética |
| Modelo de células unitárias com marcas iguais | INFERRED | Coerente com desenhos; falta conferir regras e objeto físico |
| Rotações de 90° permitidas para todos os tipos | INFERRED | Hipótese explícita do laboratório; desenhos não comprovam permissões completas |
| Proibição física de espelhar/virar | UNKNOWN | Espelhamento desabilitado por cautela, não afirmado como regra original |
| Conectividade obrigatória universal | UNKNOWN | Observada nas regiões analisadas; exigida somente na auditoria dessas amostras |
| Correspondência A–N, faces e encaixes físicos | UNKNOWN | Faltam legenda e fotografias identificadas |
| Solução real e regras completas do 001 | UNKNOWN | Não habilitado como desafio original |

Necessário antes de certificar: legenda A–N com fotos ortogonais de cada tipo identificado e suas duas faces; tabuleiro vazio com orientação de referência e encaixes visíveis; manual da mesma edição com regras de giro/virada; disposição identificada de pelo menos um desafio (preferencialmente 001) para conferir independentemente. Confirmar também inventário e significado das letras repetidas. Com esses materiais, revisar hipóteses, atribuir tipos e reexecutar auditoria. Não avançar ao solucionador sem pedido e sem definir o conjunto de regras que ele resolverá.
