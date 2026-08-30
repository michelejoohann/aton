# Roteamento multimodelo da equipe

**Estado:** `ACEITO — aprovado em 2026-08-30`
**Fonte da política de faixas:** `.agents/skills/role-architect/references/politica-de-roteamento.md`
**Aprovação humana:** **registrada em 2026-08-30 pelo usuário, via Rei no Maestri; a rota vale a partir desta data.**

Este documento decide, por etapa, **qual fornecedor, qual modelo e qual effort**. Ele não decide papéis, autoridade nem handoffs — isso vem do contrato operacional da skill `role-architect`. Contrato responde "quem faz o quê". Este arquivo responde "com qual motor".

## As peças

Os terminais seguem a metáfora do xadrez. O nome não é decoração: cada peça carrega a autoridade do papel.

| Peça | Papel | Autoridade | Por que esta peça |
|---|---|---|---|
| ♔ Rei | Maestro | coordena e triagem; não implementa | tudo gira em torno dele e ele mesmo anda pouco |
| ♕ Dama | Planejador | somente leitura | maior alcance do tabuleiro, lê tudo antes do primeiro lance |
| ♖ Torre | Construtor | escrita, só na superfície da formação | força direta em linha fechada — escritor único |
| ♗ Bispo | Revisor de conformidade | somente leitura | diagonal: alcança o que a torre estruturalmente não vê |
| ♘ Cavalo | Revisor técnico | somente leitura | única peça que salta — motor diferente do construtor: fornecedor distinto quando há dois, modelo distinto quando há um só |
| ♙ Peão-Rei | Testador | somente leitura | avança uma casa por vez e verifica o terreno |
| ♙ Peão-Dama | Redator | escrita documental autorizada | registra a partida |

O Rei é este terminal e não é recrutado pelo script.

A autoridade da coluna não é só texto de papel. Peça de leitura sobe com a permissão fechada no próprio comando: `--permission-mode plan` no Claude, `-s read-only` no Codex. Torre e Peão-Dama sobem com escrita porque precisam dela — Torre no código, Peão-Dama na documentação autorizada. Um prompt que diz "não edite" é instrução que o agente pode contornar; a permissão no comando, não.

## Por que dois fornecedores

Um revisor que roda o mesmo modelo do construtor herda os pontos cegos do construtor: concorda com o raciocínio porque é o mesmo raciocínio.

> **Havendo dois fornecedores, o Cavalo e a Torre rodam fornecedores distintos.**
> **Havendo apenas Claude, rodam `--model` distintos.**

A regra é uma só — o revisor técnico não compartilha o motor do construtor —, e o que muda é o que há para não compartilhar. Onde os dois fornecedores estão instalados, o corte é por fornecedor, que é o corte mais forte disponível. Onde só o Claude está, fornecedor igual é o ponto de partida e não uma escolha, e o corte passa a ser por modelo. `validar_formacao` em `scripts/equipe.sh` aplica a forma que o perfil ativo determina, e recusa a formação nos dois casos.

O Bispo pode rodar o mesmo fornecedor porque a pergunta dele é outra — ele procura ausência e violação de fronteira, não erro de inferência. Os dois juntos cobrem os dois modos de falha.

O resto do roteamento é custo: julgamento de linguagem em português vai para Claude; execução mecânica e verificação vão para o modelo mais barato que dá conta.

## Faixas

| Faixa | Claude Code | Codex | Effort inicial |
|---|---|---|---|
| profunda | `fable`, fallback `opus` | `gpt-5.6-sol` | medium |
| padrão | `opus` (complexidade alta) ou `sonnet` (código usual) | `gpt-5.6-terra` | medium |
| rotineira | `sonnet` | `gpt-5.6-luna` | low |

`xhigh` e `max` exigem aprovação humana explícita. `validar_formacao` em `scripts/equipe.sh` recusa qualquer formação que os declare — o teto é portão, não recomendação.

### Divergência declarada em relação à política

A política fixa `medium` como effort **inicial** das faixas profunda e padrão. Construção e revisão nesta equipe sobem em `high`, acima desse inicial. A divergência é deliberada e sai das duas perguntas da seção seguinte, não de um gatilho de escalonamento: elas se respondem antes de rodar qualquer coisa, e as duas respostas caras aparecem nessas três etapas. Fica registrada aqui porque a política pede que a escolha seja registrada, e porque quem ler os dois documentos vai notar a diferença.

## Como o effort de cada etapa é decidido

Duas perguntas objetivas, respondidas antes de qualquer terminal subir:

1. **Quantas restrições a etapa segura ao mesmo tempo?** Uma restrição isolada é barata. Texto público que precisa persuadir, não afirmar resultado que não existe, não vazar vocabulário interno, respeitar os termos vetados do projeto e ainda soar humano segura cinco de uma vez.
2. **A falha é silenciosa?** Se um portão automático pega o erro, o modelo pode errar barato. Se o erro só aparece na revisão — ou em produção, no usuário final — não há segunda rede.

Duas respostas caras, effort alto. Uma cara, medium. Nenhuma, low.

| Etapa | Peça | Fornecedor | Modelo | Effort | Restrições simultâneas | Falha é silenciosa? |
|---|---|---|---|---|---|---|
| Planejamento | Dama | Codex | `gpt-5.6-sol` | medium | recorte, aceite, risco, superfície | não: o plano ainda passa pelo Rei |
| Construção (código e estado) | Torre | Claude | `opus` | high | muitas: fronteiras de `ADR`, invariantes de estado, invariantes do domínio declaradas nos guardrails do projeto | sim: quebra só aparece em revisão |
| Construção (texto público) | Torre | Claude | `fable` | high | muitas, e todas de linguagem | sim: nenhum portão pega texto fraco |
| Verificação | Peão-Rei | Codex | `gpt-5.6-luna` | low | uma: rodar o comando certo | não: o exit code decide |
| Revisão de conformidade | Bispo | Claude | `opus` | high | procura o que **falta** | é a própria rede |
| Revisão técnica | Cavalo | Codex | `gpt-5.6-terra` | high | idem, em cadeia de inferência | idem |
| Correção de achado triado | Torre | Claude | `opus` | medium | o problema já vem nomeado pelo Rei | não: o achado é o critério de pronto |
| Registro | Peão-Dama | Codex | `gpt-5.6-luna` | low | transcreve decisão já tomada | não: o diff é a fonte |

Os dois revisores em `high` não é generosidade. Revisor procura ausência — alegação que o texto sugere sem escrever, evidência citada que não existe, invariante que ninguém declarou. Ausência é exatamente o que effort baixo não vê: ele confere o que está na tela. E se o revisor não vê, não há etapa seguinte que veja.

O inverso vale igual: Peão-Rei e Peão-Dama em `low` porque errar ali é barato e visível na hora.

O Rei fica em Claude, no modelo que o humano escolher na sessão. Coordenação não é etapa roteável: ela reage ao que chega.

## Escalonamento

O effort só sobe por gatilho registrado. Nesta equipe os gatilhos são três:

1. **Bispo e Cavalo discordam materialmente** sobre o mesmo trecho. Uma rodada de desempate em `gpt-5.6-sol` + medium, pacote isolado, sem os dois pareceres anteriores.
2. **Falha que persiste depois do diagnóstico.** Torre sobe para `fable` + high por uma passada.
3. **Decisão arquitetural nova** que não estava no plano. Volta para o Rei antes de subir qualquer coisa.

Ambiguidade metodológica **não** é gatilho: vira pergunta ao humano, porque toca chave, pesos e fronteiras éticas.

## Como a rota é aplicada

Não por instrução dentro do prompt do papel — o agente pode ignorar e ninguém audita depois. A rota entra no comando que sobe o terminal:

```bash
maestri recruit "Torre" \
  --role "Construtor" \
  --command 'claude --model opus --effort high' \
  --dir /Users/nftrans/Documents/GitHub/aton
```

```bash
maestri recruit "Cavalo" \
  --role "Revisor Técnico" \
  --command 'codex -m gpt-5.6-terra -c model_reasoning_effort="high"'
```

Na prática ninguém digita isso. `scripts/equipe.sh` lê a formação e monta o comando:

```bash
bash scripts/equipe.sh mostrar construcao      # confere a rota, não executa
bash scripts/equipe.sh subir construcao Torre  # sobe só a Torre
bash scripts/equipe.sh correcao construcao     # troca a Torre para o effort de correção
bash scripts/equipe.sh dispensar --todos    # limpa o canvas
```

O script valida a formação inteira **antes** de recrutar qualquer peça: número de campos, peça conhecida, papel com arquivo em `equipe/papeis/`, teto de effort e revisão técnica cruzada entre Torre e Cavalo — por fornecedor no perfil padrão, por `--model` num perfil de fornecedor único. Formação malformada falha com o canvas ainda limpo, nunca no meio de um `--todos`. A tradução do perfil acontece antes da validação, e sobre a formação inteira: comando sem equivalência falha ali, não depois do primeiro terminal já no canvas.

`correcao` deriva o comando da própria formação e troca apenas o effort. Formação cuja Torre roda em `fable` continua em `fable`: rebaixar o modelo trocaria a etapa, não o rigor.

### Divergência declarada: o perfil `claude-only`

**Motivo observado.** Um dos clones do repositório opera em máquina sem Codex instalado. Sem uma camada de tradução, a validação da formação inteira impediria subir até as peças Claude que aquela máquina roda perfeitamente.

**Efeito.** Os comandos Codex das formações são traduzidos por tabela versionada, em `equipe/perfis/claude-only.txt`. Nenhuma formação é editada: elas continuam sendo a fonte canônica, escritas com os dois fornecedores. A tabela não é reproduzida aqui — duplicá-la criaria duas versões da mesma decisão, e uma delas envelheceria em silêncio.

**Mitigação.** Torre e Cavalo recebem `--model` diferente, os revisores continuam subindo com contexto limpo, e a independência de método da `ADR/0002` continua valendo — controle positivo antes de qualquer afirmação de ausência. O rito de dois revisores da `ADR/0001` **permanece inteiro**: perfil troca motor, não troca rito.

**O que a mitigação não faz.** Ela reduz a correlação entre construtor e revisor; não a elimina. Dois modelos Claude continuam compartilhando fornecedor, dados de treino e família de pontos cegos, e chamar isso de "dois fornecedores" seria falso. A divergência fica registrada aqui exatamente por isso: quem ler os dois perfis precisa saber que a garantia no `claude-only` é mais fraca que a do padrão.

### Rota efetiva = formação + perfil

A formação continua canônica: é ela que declara peça, papel, superfície e a intenção de rota. O perfil é camada, e responde uma pergunta só — qual motor esta máquina tem. A rota que chega ao terminal é a composição das duas, e é ela que `mostrar` imprime.

Sem `equipe/perfil.local`, o perfil é `claude-codex`: identidade, comando por comando, sem tradução alguma. O procedimento, os erros e os limites estão em `equipe/README.md`. Formação cujo comando não tiver linha correspondente no perfil falha nomeando o comando — cobri-la é acrescentar a linha ao perfil, nunca traduzir por adivinhação.

## Formações

Cada frente de trabalho tem sua composição em `equipe/formacoes/`. A formação declara a superfície de escrita, e a superfície é a fronteira que a Torre não atravessa.

| Formação | Superfície | Observação |
|---|---|---|
| `equipe` | `equipe/`, `scripts/`, `equipe/docs/roteamento-multimodelo.md` | mexe na própria fábrica |
| `construcao` | `src/, public/, index.html` — preencher antes do primeiro uso | formação genérica do kit |

A superfície declarada é a do escritor da rodada — Torre quando há construção, Peão-Dama quando a etapa é registro. As duas nunca sobem ao mesmo tempo.

Uma formação por vez. Duas Torres ativas em superfícies diferentes quebram o escritor único do contrato operacional.

Formação com o campo `# Requer-aprovacao:` não sobe sem `--confirmo` na linha de comando. O campo existe porque fronteira escrita em comentário é decoração: sem o portão, um `subir <formacao> --todos` abriria uma frente que ninguém pediu.

## O que continua manual

Ícone e cor do terminal vivem em `.maestri/roles/<id>/role.json`, gerado pelo aplicativo. A CLI não expõe `--icon` nem `--color`, então o glifo da peça aparece no `mostrar` do script e no canvas a personalização visual é feita à mão, uma vez por terminal.

`.maestri/` não é versionado: IDs de terminal e estado local do canvas não entram no repositório.
