# 0001 — Dois revisores adversariais com contexto limpo

- **Status:** ACEITO
- **Data:** 2026-08-30
- **Decidido por:** usuário (dono do projeto), via Rei no Maestri
- **Fonte:** kit de equipe; rito enunciado em `CLAUDE.md` §Rito de Revisão Adversarial

## Contexto

Um revisor só, ou um revisor que já viu o raciocínio de quem escreveu, encontra o que aquele raciocínio deixa visível — e nada mais. O erro que importa é o que o autor não enxergou, e ele sobrevive à revisão feita a partir do mesmo contexto.

## Decisão

Ao finalizar qualquer implementação, o rito de revisão é:

1. dois revisores adversariais independentes, cada um com contexto limpo;
2. cada revisor recebe apenas o requisito original e o `git diff` relevante — nunca o parecer do outro revisor;
3. os revisores são instruídos a assumir que há erros e buscar bugs funcionais ou falhas de requisito, ignorando preferências de estilo;
4. os achados passam por triagem antes de qualquer correção ser aplicada.

Esta ADR **não decide** modelo nem effort dos revisores; isso é regido por `equipe/docs/roteamento-multimodelo.md`.

## Alternativas consideradas

- **Um único revisor independente** — descartada: cobre um modo de falha por rodada. Os dois revisores do rito procuram coisas diferentes: um procura o que **falta** frente ao requisito, o outro procura o que **quebra** na cadeia de inferência.
- **Registrar o rito apenas nas instruções de agente (`CLAUDE.md`, `AGENTS.md`), sem ADR** — descartada: instruções de agente dizem *como* operar; o *porquê* pertence ao registro decisório, e é o porquê que resiste à próxima pessoa que quiser encurtar o rito.

## Consequências

- Pareceres de revisores nunca circulam entre revisores da mesma rodada antes da triagem.
- Revisão adversarial de agentes é evidência técnica automatizada; não substitui aprovação humana nem autoriza declarar revisão humana como realizada (`ADR/0003`).
- Qualificada por [0002](0002-separacao-executor-verificador.md): quem escreveu não revisa e quem revisa não escreve; toda afirmação de ausência exige controle positivo. Esta ADR segue decidindo quantos revisores e o que recebem; a `0002` decide quem não pode ser revisor.

## Revisibilidade

Reabrir se o custo de duas leituras adversariais por rodada passar a inviabilizar o ritmo do projeto, ou se o registro das rodadas mostrar que os dois revisores convergem sempre nos mesmos achados — sinal de que a independência entre eles deixou de existir na prática.
