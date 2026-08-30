# Aton (Amozir)

## Papel deste arquivo

`PROJECT.md` é o **contexto permanente**: propósito, público, método em alto nível, fronteiras, invariantes e hierarquia de fontes. Ele não carrega estado operacional — tarefa corrente, contagem de teste, commit, hash, branch ou pendência moram em `CHECKPOINT.md`, e somente lá.

Em caso de conflito: `CHECKPOINT.md` prevalece para operação corrente; este arquivo prevalece para contexto permanente.

## Ordem de leitura

Antes de analisar, editar ou executar trabalho neste projeto:

1. leia `PROJECT.md` integralmente;
2. leia `CHECKPOINT.md` integralmente;
3. consulte `ADR/INDICE.md` e as decisões vigentes relevantes ao recorte;
4. leia a especificação e o plano relacionados à tarefa atual;
5. leia `equipe/README.md` e a formação da rodada em `equipe/formacoes/`.

## Propósito

O Aton é a aplicação web do **Amozir** (antes Coringa; renomeado em 2026-08-30), um gerente de projetos assistido por IA para profissionais criativos autônomos e microestúdios de eventos. Ele impõe o cálculo retroativo dos três entregáveis de cada evento — Save the Date em `festa - 6 meses`, Convite Oficial em `festa - 3 meses`, e a festa —, e apresenta o conjunto em radar de foco, pipeline kanban de cinco etapas, calendário e um drawer de agente. A base técnica é Vite + React 19 + Tailwind 4, publicada no GitHub Pages a partir de `docs/`.

## Público

Criativos autônomos e microestúdios que entregam de 2 a 4 projetos por mês mas administram de 6 a 12 em etapas sobrepostas, sem gerente de projetos dedicado. O repositório em si tem dois públicos operando lado a lado: quem trabalha por Gemini CLI e quem trabalha por Claude Code / Codex sob o Maestri.

## Fontes canônicas

- Estado operacional e retomada: `CHECKPOINT.md`.
- Decisões vigentes: `ADR/INDICE.md`.
- Rota de modelo e effort por etapa: `equipe/docs/roteamento-multimodelo.md`.
- Operação da equipe: `equipe/README.md`.
- Autoridade de cada papel e ciclo de trabalho: a skill `role-architect`.

## Fronteiras

O que este projeto **não** é, e o que ele não autoriza:

- Não é um produto em produção com dados reais: é MVP de hackathon, alimentado por `src/data/mockData.js`.
- Não tem backend, autenticação, banco nem persistência entre sessões — não presuma nenhum dos quatro.
- Não autoriza reescrever a arquitetura do app, trocar stack, adicionar dependência pesada ou mudar o modelo de negócio sem pedido explícito do usuário.
- Não autoriza migrar o repositório para uma ferramenta de agente só: `GEMINI.md`, `CLAUDE.md` e `AGENTS.md` convivem, e remover qualquer um deles quebra o trabalho de outra pessoa.
- Não autoriza `git push` como rotina — push é ato pedido, e este repositório é compartilhado.

## Regras para qualquer agente

- Não declare revisão humana, entrevista, reteste, ensaio ou piloto como realizados sem evidência registrada (`ADR/0003`).
- Mantenha separadas evidência técnica automatizada e aprovação humana; revisão adversarial de agente nunca é aprovação humana (`ADR/0003`).
- Quem escreveu uma peça não a verifica; toda afirmação de ausência exige controle positivo (`ADR/0002`).
- Ao finalizar implementação, vale o rito de dois revisores adversariais com contexto limpo (`ADR/0001`).
- Não implemente além do limite definido em `CHECKPOINT.md` sem pedido explícito.
- Preserve mudanças existentes e a trajetória documentada.
- Respeite os guardrails abaixo.

## Guardrails do projeto

- Não altere as regras de prazo do produto — Save the Date em `festa - 6 meses`, Convite Oficial em `festa - 3 meses` — sem pedido explícito do usuário: elas são a regra de negócio do Amozir, não detalhe de implementação.
- Não edite `docs/` à mão: aquele diretório é o site publicado no GitHub Pages, gerado por build, e edição manual ali é sobrescrita no próximo deploy.
- Não troque `src/data/mockData.js` por dado real de cliente, e não registre nome, telefone, e-mail ou endereço de contratante em nenhum arquivo versionado.
- Não altere `base: '/aton/'` em `vite.config.js` nem remova `.nojekyll`: os dois sustentam a publicação no GitHub Pages.
- Não declare build, lint ou teste como verdes sem a saída real do comando registrada.
