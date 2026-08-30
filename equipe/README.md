# Equipe

Configuração versionada dos terminais de trabalho deste projeto. Nada aqui é executável: o script que lê estes arquivos é `scripts/equipe.sh`, e a justificativa de cada rota está em `equipe/docs/roteamento-multimodelo.md`.

## Por que existe

Antes disto, montar o time era manual: abrir terminal, escolher modelo, escolher effort, colar prompt de papel, repetir a cada mudança de frente. Prompt colado à mão não é revisável e não sobrevive à próxima sessão; modelo escolhido no menu não deixa rastro.

Aqui o papel é arquivo e o modelo é comando. Os dois entram no diff.

O preset ativo no Maestri, porém, vive fora do repositório e não é versionado — alguém pode editar um papel pela interface e `git status` continuar limpo. Por isso existe `verificar`: ele compara cada arquivo de `papeis/` com o preset em vigor e falha se divergirem. Papel que não puder ser consultado não interrompe a apuração: vira uma linha `FALHA AO CONSULTAR`, o laço segue até o último papel e o resumo declara a apuração incompleta. Papel cujo arquivo em `papeis/` não existe vira `ARQUIVO AUSENTE` — é falta de arquivo versionado, não divergência entre os dois lados; papel que existe no arquivo mas não no Maestri vira `ausente no Maestri`, com o `sincronizar` que o cria. As quatro condições — divergência, falha de consulta, arquivo ausente e ausente no Maestri — são independentes, e o resumo final nomeia numa linha só cada uma que tiver ocorrido. Rode antes de subir uma formação em que você confia no prompt.

## Estrutura

```
equipe/papeis/<papel>.md      prompt integral de cada papel
equipe/formacoes/<frente>.txt qual peça, qual papel, qual comando
equipe/perfis/<perfil>.txt    tradução de comando por motor disponível
equipe/perfil.local           qual perfil vale neste clone (não versionado)
```

Formação é pipe-delimitado, uma peça por linha, comentários com `#`:

```
Peça|Papel|Comando
Torre|Construtor|claude --model opus --effort high
```

O cabeçalho comentado declara a **superfície de escrita** da formação. Essa linha não é decorativa: é a fronteira que a Torre não atravessa, e o `mostrar` do script a imprime antes da rota.

## Uso

```bash
bash scripts/equipe.sh formacoes                 # o que existe
bash scripts/equipe.sh mostrar construcao        # a rota, sem executar
bash scripts/equipe.sh sincronizar               # grava todos os papéis nos presets do Maestri
bash scripts/equipe.sh sincronizar "Rei"         # grava só um papel
bash scripts/equipe.sh sincronizar "Rei" --confirmo   # grava por cima de preset ativo divergente (exige o papel)
bash scripts/equipe.sh verificar                 # arquivo versionado x preset ativo
bash scripts/equipe.sh subir construcao Torre    # sobe uma peça
bash scripts/equipe.sh subir construcao --todos  # sobe a formação inteira
bash scripts/equipe.sh subir <formacao> --todos --confirmo   # formação com portão
bash scripts/equipe.sh correcao construcao       # Torre volta em effort de correção
bash scripts/equipe.sh dispensar --todos         # limpa o canvas
```

`sincronizar [<Papel>]` e `sincronizar <Papel> --confirmo` são idempotentes: cria o papel se não existir, sobrescreve se existir. Sem papel, percorre todos; com papel, grava só ele — o nome é o que `verificar` imprime, entre aspas. A gravação tem um sentido só — arquivo → Maestri —, e o que ela sobrescreve é o preset ativo, que vive fora do repositório e não é versionado: o que se perde ali não volta por `git`. Por isso o comando apura o alvo antes de gravar o primeiro papel — uma consulta por papel, e ela responde de uma vez se o papel existe e o que o preset ativo diz. Ele apura o alvo inteiro, salvo papel que não responda: aí aborta no primeiro que falhar, sem apurar os demais, e por isso divergência de papel ainda não apurado não chega a ser nomeada. Havendo preset ativo que divirja do arquivo, ou papel que não possa ser consultado, o comando aborta nomeando o caso e não grava nada, nem os papéis que estavam em dia: as duas condições são apuradas antes da primeira gravação. Duas coisas ficam sem garantia. A janela entre a apuração e a gravação — se alguém editar um preset pela interface nesse intervalo, a gravação passa por cima; é limitação conhecida, não promessa. E a falha da própria gravação: se um `role write` ou `role create` falhar no meio do alvo, o comando para ali, e o que já foi gravado continua gravado — o "não grava nada" vale para o que a apuração encontra, não para o que a gravação encontra. `--confirmo` é o que diz que o lado a preservar é o arquivo, e ele **só existe com o papel**: `sincronizar "<Papel>" --confirmo`. Não há forma `--confirmo` sem papel. Sobrescrever preset ativo divergente é sempre um papel por vez — `--confirmo` sem papel é erro, sem consulta e sem gravação. Falha de consulta não é coberta por `--confirmo`: ela aborta de qualquer modo, porque preservar um lado exige conhecer os dois. Papel ausente no Maestri não exige `--confirmo`: criar não apaga nada — mas isso vale para o alvo de um papel só; no alvo cheio, se outro papel divergir, o comando aborta inteiro e o ausente também não é criado.

Antes de recrutar qualquer peça, `subir` valida a formação inteira — campos, peça conhecida, papel com arquivo, teto de effort, revisão técnica cruzada — e confere que o papel existe como preset. Erro de configuração falha com o canvas ainda limpo.

`mostrar` também valida a formação inteira antes de imprimir. Formação que não subiria deixa de ser impressa como se subisse — o comando de conferir a rota responde pela rota que existe.

A revisão técnica cruzada tem duas formas, e qual delas vale depende de quantos fornecedores estão na mesa. Havendo dois, Cavalo e Torre precisam de **fornecedor** diferente. Havendo só Claude — é o caso do perfil `claude-only` —, fornecedor igual é o ponto de partida, e o que ainda dá para cruzar é o **`--model`**: a checagem passa a recusar Torre e Cavalo com o mesmo modelo. Formação que legitimamente não tem as duas peças não é obrigada a tê-las; a checagem é sobre o par, não sobre a composição.

## Perfis de motor

As formações são a fonte canônica e não mudam por máquina. O que muda por máquina é qual motor está instalado — e é isso que o perfil resolve, numa camada de tradução versionada.

```
(sem equipe/perfil.local)     claude-codex  → identidade: os comandos como a formação os escreve
equipe/perfil.local = claude-only  → traduz cada comando Codex por equipe/perfis/claude-only.txt
```

`perfil.local` carrega **uma linha**, só o nome do perfil, e está no `.gitignore`: qual fornecedor a máquina tem é fato da máquina, não decisão do projeto. Arquivo vazio, com linha extra, com espaço lateral ou com nome fora de `[a-z0-9-]` é erro — perfil é escolha de uma palavra, e adivinhar qual das linhas vale seria adivinhar a rota.

`mostrar <formação>` imprime o perfil ativo na primeira linha e a rota efetiva na tabela: o comando que o terminal receberia, não a linha crua da formação.

A tradução é por **correspondência exata**. O comando de origem casa byte a byte com uma linha do perfil ou não casa; o script não interpreta `-m`, `-c`, `-s` nem `-a`, e nada é executado nem passado por `eval` — origem e destino são strings. A consequência é deliberada: formação que ganhar um comando Codex novo falha fechado, nomeando o comando, até que a linha correspondente entre no perfil. Tradução parcial de uma flag que ninguém conferiu seria pior que o erro.

A única linha que depende de contexto é a do Cavalo, e ela está na tabela, não escondida no script: com Torre em `opus` o Cavalo vai para `fable`, e com Torre em `fable` o Cavalo vai para `opus`. Para o Cavalo, só vale linha cuja condição é o modelo efetivo da Torre — a condição é comparada por igualdade exata, então linha com `*` nunca casa para ele; `*` vale para as demais peças.

Formação que carregue comando Codex sem linha correspondente no perfil **não é coberta** por ele, e não há workaround a oferecer: em `claude-only` ela falha nomeando o comando; no perfil padrão segue como está — o perfil não a altera. Cobri-la é acrescentar a linha ao perfil, com a mesma correspondência exata, e isso é decisão de rodada própria. O caso mais comum é formação com caminho absoluto de máquina no comando: `grep -l '/Users/' equipe/formacoes/*.txt` mostra quais são.

`sincronizar`, `verificar` e `dispensar` não consultam perfil: eles tratam de papel e de canvas, não de rota.

## Máquina nova

Este é o procedimento **esperado** para pôr a equipe de pé num clone novo. Enquanto ninguém o tiver exercido neste projeto, nada aqui declara que ele funcionou aqui — a primeira execução real é que vai dizer, e o que ela encontrar volta para este arquivo.

1. Clonar o repositório e entrar na raiz do clone.
2. Instalar e abrir o Maestri em Maestro Mode **nessa raiz**.
3. Garantir o motor do perfil escolhido: para `claude-only`, Claude Code autenticado e com acesso a `opus`, `fable` e `sonnet`; para o padrão, também o Codex autenticado, com os modelos que as formações escrevem.
4. Escolher o perfil **antes** de `mostrar` ou `subir`: sem `equipe/perfil.local` vale `claude-codex`; para o outro, `printf 'claude-only\n' > equipe/perfil.local`.
5. `bash scripts/equipe.sh sincronizar` — grava os papéis versionados nos presets do Maestri.
6. `maestri list` — pega o **nome exato** do terminal Maestro deste canvas.
7. `maestri role assign "<nome exato do terminal Maestro>" "Rei"` — é a sintaxe que o `maestri role --help` imprime. No canvas de hoje o nome é `Claude Maestro`, mas nada garante que outro clone use esse nome: leia o nome do passo 6, não o copie daqui. Que o terminal Maestro seja alvo válido de `role assign` **não foi verificado**: o `--help` chama o primeiro argumento de `Recruit`, e ninguém exercitou o comando contra o terminal Maestro; se o CLI recusar, atribua o papel pela interface do Maestri.
8. `bash scripts/equipe.sh verificar`, depois `mostrar <formação>` e então `subir`.

## Duas máquinas

Cada pessoa trabalha em **branch própria**. `main` só recebe merge depois do rito de dois revisores da `ADR/0001`.

A regra "uma formação por vez" vale **por branch e por máquina**, não entre clones. Não há trava global, coordenação remota nem estado compartilhado em `.maestri/` — e não deve haver: coordenação distribuída é arquitetura nova, e o que o problema pede é disciplina de branch.

## Regras

- **Uma formação por vez.** Duas Torres ativas em superfícies diferentes quebram o escritor único do contrato operacional.
- **Etapa com peça de papel aprovado vai para a peça.** Havendo terminal conectado com o papel da etapa, é ele que executa. O Rei não centraliza a execução em si mesmo nem troca a equipe por subagentes internos por decisão própria.
- **Cada etapa tem uma peça só.** O Planejador planeja, um único Construtor escreve a superfície, o Testador valida, os dois Revisores revisam isoladamente e o Redator sincroniza a documentação. O Rei coordena e triagia, e não assume nenhuma dessas etapas.
- **A rota vem da formação e do subcomando, não da peça.** Nem a peça nem o Rei trocam modelo ou effort por decisão própria. Quem muda é o subcomando desenhado: `correcao` baixa o effort da Torre de propósito.
- **Subir terminal não autoriza construir.** A peça fica parada até receber `maestri ask` do Rei.
- **Dispense ao receber a entrega.** Terminal parado é sessão queimando à toa.
- **Modelo, effort e permissão nunca vão para o prompt do papel.** No comando eles são auditáveis e o agente não os contorna; no prompt são sugestão. Peça de leitura sobe com `--permission-mode plan` (Claude) ou `-s read-only` (Codex).
- **Formação com `# Requer-aprovacao:` não sobe sem `--confirmo`.** É o caso de toda formação cuja fronteira dependa de pedido explícito do usuário.
- **`xhigh` e `max` não entram** em nenhuma formação sem aprovação humana explícita registrada.
- Mudança de papel, de formação ou de rota passa pela skill `role-architect` e por aprovação humana, conforme `CLAUDE.md`.

## O Rei

Não está nas formações. O Rei é o terminal de coordenação — este — e o humano escolhe o modelo dele na sessão. Coordenação reage ao que chega; não é etapa roteável.
