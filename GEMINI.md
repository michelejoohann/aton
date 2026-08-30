# Gemini CLI — Entrada do Projeto

@./PROJECT.md
@./CHECKPOINT.md

Este arquivo é fino de propósito. O conteúdo real da equipe é neutro de ferramenta e mora em `PROJECT.md`, `CHECKPOINT.md`, `ADR/` e `equipe/`. `CLAUDE.md` e `AGENTS.md` apontam para os mesmos arquivos — as três entradas descrevem o mesmo projeto, e divergir uma delas é criar dois projetos no mesmo repositório.

Se as linhas `@./` acima não forem resolvidas pela sua versão do Gemini CLI, leia os dois arquivos manualmente antes de qualquer coisa.

## Ordem de leitura

Antes de analisar, editar ou executar qualquer tarefa:

1. Leia `PROJECT.md` integralmente — contexto permanente, propósito, público, fronteiras e guardrails.
2. Leia `CHECKPOINT.md` integralmente — estado operacional, frentes abertas, o que está autorizado e o que está bloqueado.
3. Consulte `ADR/INDICE.md` e as decisões vigentes relevantes ao recorte.
4. Leia o brief da rodada, quando houver, e a formação aplicável em `equipe/formacoes/`.
5. Leia `equipe/README.md` para saber como a equipe opera e o que cada comando faz.

Em conflito: `CHECKPOINT.md` prevalece para a operação corrente, `PROJECT.md` para o contexto permanente.

## O que é opcional aqui

`scripts/equipe.sh` monta terminais no canvas do Maestri, e o Maestri não é requisito deste repositório. Trabalhando só por Gemini CLI, `equipe/papeis/*.md` continua valendo como **prompt de papel** — leia o papel que você está exercendo e opere sob ele; o que deixa de existir é a automação que sobe um terminal por peça.

A rota de modelo e effort de `equipe/docs/roteamento-multimodelo.md` é escrita em comandos Claude e Codex. Ela declara **qual etapa precisa de motor diferente da etapa anterior**, e essa exigência sobrevive à troca de fornecedor: o revisor técnico não roda no mesmo motor que construiu a peça. Traduza para o modelo Gemini equivalente em vez de ignorar a regra.

## Rito de revisão

Ao finalizar qualquer implementação, vale o rito das ADRs `0001`–`0003`: dois revisores com contexto limpo, cada um recebendo apenas o `git diff` e o requisito original — nunca o parecer do outro; quem escreveu não verifica; toda afirmação de ausência exige controle positivo; e evidência automatizada não é aprovação humana.

## Guardrails do projeto

Os guardrails permanentes estão em `PROJECT.md`, seção `## Guardrails do projeto`, e valem igualmente para qualquer agente, em qualquer ferramenta.
