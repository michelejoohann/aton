# 0002 — Quem executa não verifica; toda negativa exige controle positivo

- **Status:** ACEITO
- **Data:** 2026-08-30
- **Decidido por:** usuário (dono do projeto), via Rei no Maestri
- **Fonte:** kit de equipe; qualifica a `ADR/0001`; prática enunciada em `equipe/README.md` §Regras e no rito de `CLAUDE.md`

## Contexto

A `ADR/0001` decide **quantos** revisores adversariais existem e **o que** recebem. Ela não decide **quem não pode** ser revisor, nem o que torna uma verificação confiável.

Dois defeitos de método motivam esta decisão, e nenhuma regra da `0001` os alcança.

O primeiro é a **verificação a partir do contexto de quem escreveu**. Quem escreveu carrega a suposição que produziu o erro; verificar de dentro dela reproduz a suposição em vez de testá-la. Isso vale para a pessoa, para o papel e para o **terminal**: contexto herdado é contexto herdado.

O segundo é a **varredura que devolve menos do que existe, sem aviso**. Zero não tem cara de erro: resultado negativo por ausência e resultado negativo por padrão errado saem idênticos na tela. Os casos típicos são conhecidos e reincidentes — arquivo com bytes NUL que o `grep` trata como binário e pula sem avisar; frase longa procurada em texto cuja prosa quebra em largura fixa, de modo que a expressão fica partida entre linhas e nunca casa; padrão escrito no formato que o autor imaginou, não no que o arquivo usa. Em todos, a busca conclui falsamente que a coisa não existe, e a conclusão entra no registro como fato.

O que esses casos têm em comum: não são desatenção. Do lado de dentro, a checagem barata e a real são a mesma experiência — quem roda uma busca e recebe zero não sente atalho nenhum. São ferramenta devolvendo resultado plausível e errado.

## Decisão

Cinco regras, cada uma verificável por leitura do registro da rodada.

1. **Separação executor↔verificador.** Quem escreveu uma peça não a verifica, e quem a verifica não a escreve. Vale para a peça e vale para o terminal. Esta regra **qualifica** a `ADR/0001`, não a supersede: a `0001` decide quantos revisores e o que recebem; esta decide quem não pode ser revisor. **O que a regra não proíbe — e exige:** parar diante de contradição entre o que se recebeu (brief, especificação, parecer) e o repositório — antes de escrever, ou a qualquer momento em que a contradição apareça — e reportá-la a quem mandou. Isso não é verificar o próprio trabalho: é conferir artefato de **outra** peça, e é obrigação de quem executa — desde que o comparando também não seja obra própria. Contradição entre o recebido e o que quem executa **não escreveu** é parada e é obrigação; contradição entre o recebido e o **próprio texto novo** é revisão do próprio trabalho, e a verificação vai para outra peça — o dever de reportar permanece de quem executa. Regra de separação que calasse quem executa instituiria o silêncio que esta decisão quer impedir. Verificação: o registro da rodada nomeia quem escreveu e quem revisou, e os conjuntos não se cruzam.

2. **Controle positivo para toda negativa.** Varredura cujo resultado fundamenta uma afirmação de ausência — "zero ocorrências", "não existe", "não foi tocado", "nenhum arquivo fora da superfície" — só vale se o **mesmo padrão, na mesma ferramenta,** tiver sido provado contra um caso que se sabe existir. Sem o controle, a afirmação de ausência é declarada como **não verificada**, não como falsa. Verificação: o registro da rodada mostra, ao lado de cada negativa, o caso conhecido contra o qual o padrão acertou.

3. **Reprodução acima de busca, onde houver original.** Busca pergunta "está aí?"; reprodução pergunta "sai igual?". Onde existir fonte contra a qual comparar — original externo, versão anterior em `git`, artefato gerado por script —, reconstruir e comparar (`diff`, `sha256`, regeneração) prevalece sobre procurar. Verificação: a fidelidade declarada vem acompanhada do comando de comparação e do resultado, não de uma lista de buscas.

4. **Independência de método, não só de pessoa.** Dois verificadores rodando a mesma ferramenta, com o mesmo padrão, falham igual. A independência que conta é a de **modo de errar**: se uma verificação usou busca por texto, a segunda usa comparação, contagem por outro delimitador ou leitura do arquivo inteiro. Verificação: quando dois verificadores conferiram o mesmo fato, o registro mostra que os métodos diferem.

5. **Quem afirma alcance não verifica o próprio alcance.** Alegação de completude — "todas", "nenhuma", "os três", "conferido um a um" — é verificada por quem não a escreveu, antes de ser registrada como fato. Quem triagia as alegações dos outros está sujeito à mesma regra. Verificação: toda contagem ou universal no registro da rodada tem conferência atribuída a outra peça, ou é substituída por descrição sem número.

### Graduação

A graduação faz parte da decisão, não só das consequências:

- O **controle positivo** (regra 2) é barato — um comando a mais — e vale **sempre** que houver negativa.
- A **reprodução** (regra 3) só se aplica onde existe original; onde não há fonte contra a qual comparar, a busca com controle positivo é o que resta.
- O número de leituras adversariais **não** muda com esta ADR. A regra de parada de `CLAUDE.md` continua governando quantas rodadas de correção cabem.

## Alternativas consideradas

- **Confiar em atenção redobrada** — descartada. Regra contra desleixo não pega o que não se sente, e o defeito descrito no Contexto não se sente.
- **Criar ferramenta ou etapa nova de verificação** — descartada. O problema se resolve com um comando a mais (o controle positivo) ou com a comparação que já existe (`diff`, `sha256`); estrutura nova seria custo pago à vista contra benefício hipotético, e viraria ela própria superfície a verificar.
- **Registrar só nas instruções de agente, sem ADR** — descartada pela mesma razão da `0001`.

## Consequências

- A `ADR/0001` permanece **vigente** na medida em que o projeto a tiver adotado, qualificada por esta ADR.
- `CLAUDE.md` — e `AGENTS.md`, se o projeto tiver um — enunciam, de forma curta, a separação executor↔verificador e o controle positivo, e apontam para cá. Os dois arquivos recebem a mesma linha: o revisor que lê um não pode ler rito diferente do que lê o outro.
- Afirmação de ausência sem controle positivo é registrada como **não verificada**. Isso vale para relatório de quem implementa, parecer de revisor, brief de quem coordena e sincronização do `CHECKPOINT.md`.
- **Onde os dados das regras 1 e 4 são escritos.** A **mensagem de commit da rodada** nomeia a peça que escreveu e as que revisaram e, quando dois verificadores conferiram o mesmo fato, diz qual método cada um usou; o **cabeçalho da formação** diz o mesmo para a rodada que a formação serve. Nenhum campo novo, nenhuma etapa nova.
- **Forma da regra 5 em rodada de duas peças.** Rodada sem revisão adversarial — coordenação mais uma peça de escrita — cumpre a regra 5 por **conferência recíproca**: quem escreve confere as contagens do brief contra o repositório antes de escrever, e quem coordena confere por comando as contagens novas antes do commit. Nenhuma contagem fica conferida por quem a escreveu e nenhum terminal é acrescentado. A conferência do rascunho da mensagem de commit cabe a peça que não escreveu as contagens que ela transporta — na rodada com revisores, a um deles, **antes da dispensa**.
- Se a regra 1 exigir mudança em `equipe/README.md`, `equipe/papeis/` ou `equipe/formacoes/`, ela é feita em rodada da formação `equipe`, com a skill `role-architect` e aprovação humana, conforme `CLAUDE.md`.
- Revisão adversarial de agentes e verificação por comando são evidência técnica automatizada; não substituem aprovação humana nem autorizam declarar revisão humana, ensaio, reteste ou piloto como realizados (`ADR/0003`).

## Revisibilidade

Reabrir se o registro das rodadas mostrar que o controle positivo passou a ser cumprido por fórmula — o mesmo caso conhecido reaproveitado sem relação com o padrão buscado —, se o custo da separação executor↔verificador inviabilizar rodadas de uma peça só, ou se surgir classe de falso negativo que nenhuma das cinco regras alcance.
