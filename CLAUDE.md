# Claude Code — Entrada do Projeto

@PROJECT.md
@CHECKPOINT.md

Este repositório é trabalhado por mais de uma ferramenta. `GEMINI.md` e `AGENTS.md` são entradas finas equivalentes a esta e apontam para os mesmos arquivos — o conteúdo real é neutro de ferramenta e mora em `PROJECT.md`, `CHECKPOINT.md`, `ADR/` e `equipe/`. Mudou a doutrina, muda lá; as três entradas nunca divergem, e nenhuma delas é removida sem pedido explícito do usuário.

Antes de analisar, editar ou executar qualquer tarefa:

1. Leia `PROJECT.md` integralmente.
2. Leia `CHECKPOINT.md` integralmente.
3. Consulte `ADR/INDICE.md` e as decisões vigentes relevantes ao recorte.
4. Leia o brief da rodada, quando houver, e a formação aplicável em `equipe/formacoes/`.
5. Leia `equipe/README.md` para saber como a equipe opera e o que cada comando faz.

Estado de retomada: mora em `CHECKPOINT.md`, residência única do estado operacional — tarefas concluídas, tarefa corrente, o que está bloqueado e o que exige novo pedido explícito do usuário. Este arquivo não repete esse estado.

## Roteamento de modelos

Este arquivo não declara rota de planejamento, construção ou revisão. A política de roteamento mora em `equipe/docs/roteamento-multimodelo.md` e nas formações de `equipe/formacoes/`, que fixam peça, modelo e effort por frente; quem monta o time é `scripts/equipe.sh`.

## Rito de Revisão Adversarial

A decisão de dois revisores adversariais com contexto limpo é a `ADR/0001`. Operacionalmente, ao finalizar qualquer implementação:

1. Recrute 2 revisores com contexto limpo usando o comando de recruit do Maestri.
2. Passe apenas o `git diff` e a especificação do requisito original aos revisores.
3. Instrua os revisores: “Analise o diff a seguir. Assuma que há erros e busque bugs funcionais ou falhas nos requisitos. Ignore preferências de estilo.”
4. Triagie os pontos apontados pelos revisores antes de aplicar as correções.

A separação entre quem executa e quem verifica, e o método de verificação, são a `ADR/0002`: quem escreveu a peça não a revisa e não é revisor da rodada; toda afirmação de ausência ("zero ocorrências", "não foi tocado") só vale com controle positivo — o mesmo padrão provado antes contra um caso que se sabe existir — e, sem ele, é registrada como não verificada.

## Papéis, colaboração e roteamento

Ao criar, revisar ou alterar papéis de agentes, colaboração multiagente, handoffs, seleção de modelo, effort ou uso do Maestri neste projeto, use a skill role-architect antes de propor ou materializar a estrutura. A skill é portátil; o Maestri é opcional. Recrutamento, andares, alteração de papéis e implementação estrutural exigem aprovação humana explícita.

## Guardrails do projeto

Nunca declare revisão humana, entrevista, ensaio, reteste ou piloto como realizados sem evidência real registrada, e mantenha separadas evidência técnica automatizada e aprovação humana (`ADR/0003`).

Além disso, valem os guardrails permanentes de Aton (Coringa):

- Não altere as regras de prazo do produto — Save the Date em `festa - 6 meses`, Convite Oficial em `festa - 3 meses` — sem pedido explícito do usuário: elas são a regra de negócio do Coringa, não detalhe de implementação.
- Não edite `docs/` à mão: aquele diretório é o site publicado no GitHub Pages, gerado por build, e edição manual ali é sobrescrita no próximo deploy.
- Não troque `src/data/mockData.js` por dado real de cliente, e não registre nome, telefone, e-mail ou endereço de contratante em nenhum arquivo versionado.
- Não altere `base: '/aton/'` em `vite.config.js` nem remova `.nojekyll`: os dois sustentam a publicação no GitHub Pages.
- Não declare build, lint ou teste como verdes sem a saída real do comando registrada.
