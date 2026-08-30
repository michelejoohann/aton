# AGENTS.md — Entrada do Projeto

Entrada fina para agentes que leem `AGENTS.md` (Codex e afins). O conteúdo real é neutro de ferramenta e mora em `PROJECT.md`, `CHECKPOINT.md`, `ADR/` e `equipe/`. `CLAUDE.md` e `GEMINI.md` apontam para os mesmos arquivos.

## Ordem de leitura

1. `PROJECT.md` — contexto permanente, fronteiras, guardrails.
2. `CHECKPOINT.md` — estado operacional, o que está autorizado e o que está bloqueado.
3. `ADR/INDICE.md` e as decisões vigentes relevantes ao recorte.
4. O brief da rodada, quando houver, e a formação em `equipe/formacoes/`.
5. `equipe/README.md` — como a equipe opera e o que cada comando faz.

Em conflito: `CHECKPOINT.md` prevalece para a operação corrente, `PROJECT.md` para o contexto permanente.

## Papéis e rota

`equipe/papeis/*.md` são os prompts de papel integrais; `equipe/formacoes/*.txt` fixam peça, modelo e effort por frente; `equipe/docs/roteamento-multimodelo.md` explica por que cada etapa tem o motor que tem. Modelo, effort e permissão entram no comando do terminal, nunca no prompt.

## Rito de revisão

ADRs `0001`–`0003`: dois revisores adversariais com contexto limpo, recebendo apenas `git diff` e requisito original; quem executa não verifica; negativa exige controle positivo; evidência automatizada não substitui aprovação humana.

## Guardrails do projeto

Em `PROJECT.md`, seção `## Guardrails do projeto`. Valem para qualquer agente, em qualquer ferramenta.
