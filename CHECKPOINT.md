# Checkpoint de Continuidade — Aton (Amozir)

**Papel deste arquivo:** única residência do estado operacional mutável — snapshot Git, medição técnica, estado das frentes, pendências e retomada. `PROJECT.md` guarda o contexto permanente e aponta para cá sem repetir o que está aqui.

**Estado geral:** `EQUIPE ATIVA — REDESIGN AMOZIR EM WORKING TREE, NÃO COMMITADO`

**Última atualização:** 2026-08-30

## Snapshot Git

Última apuração: 2026-08-30. **Reapure por comando na retomada — este bloco envelhece a cada commit, inclusive o que grava esta atualização.**

```bash
git log --oneline -1
git rev-list --count HEAD
git status --short --branch
git branch -vv
```

- Branch: `main`
- `HEAD` em: `c99f37c` — `ci: add .nojekyll to disable Jekyll processing on GitHub Pages`
- Commits no histórico: 7
- Sincronia com o remoto: `## main...origin/main`, sem divergência declarada de ahead/behind
- Branches locais: só `main`, rastreando `origin/main`
- Working tree: 14 arquivos modificados/removidos em `src/`, `public/` e `index.html` (`.gitignore` e `README.md` também modificados, desde antes desta rodada); não rastreados: `.agents/`, `.claude/`, `ADR/`, `AGENTS.md`, `CHECKPOINT.md`, `CLAUDE.md`, `DESIGN.md`, `GEMINI.md`, `PRODUCT.md`, `PROJECT.md`, `equipe/`, `scripts/`

## Medição técnica mais recente

Registre aqui o comando, a data e o resultado **observado** — nunca o esperado. Medição não reexecutada continua valendo apenas enquanto o diff sobre a superfície medida for vazio, e a vigência se declara com o comando que a sustenta e o controle positivo correspondente (`ADR/0002`).

Tudo nesta seção é **evidência técnica automatizada**. Não é aprovação humana e não autoriza declarar revisão humana, ensaio, reteste ou piloto como realizados (`ADR/0003`).

- Comando: `npm run build`
  - Data: 2026-08-30 — vigência: working tree pós-correção C13
  - Resultado: exit 0; vite 8.2.2; 1828 módulos transformados
- Comando: `npm run lint`
  - Data: 2026-08-30 — vigência: working tree pós-correção C13
  - Resultado: exit 0 com 9 warnings pré-existentes em `src/` (`no-unused-vars` ×5; pureza React, `Date.now` ×4)
- Comando: `detect.mjs` da skill `impeccable`
  - Data: 2026-08-30
  - Resultado: 0 hits
  - Controle positivo (`ADR/0002`): o mesmo detector, antes da rodada 2, acusou 7 hits (5 de side-tab em `CoringaAgentDrawer.jsx:153`, `FocusRadar.jsx:57`, `FocusRadar.jsx:91`, `FocusRadar.jsx:125`, `PitchModal.jsx:41`; mais `overused-font` e `single-font` em `index.html`), e acusa `gradient-text` e `ai-color-palette` em fixture com `backdrop-blur`, `bg-clip-text` + gradiente e `border-l-2`
- Verificações de interface medidas na rodada, com o resultado observado: contraste de texto ≥ 4.5:1 em 36 pares e controles ≥ 3:1; sem overflow em 360/768/1280; alvos de toque ≥ 44px; foco visível; nenhuma serifa em badge, botão ou label (sonda em runtime)
  - Autoria dos 36 pares de contraste: calculados pela Torre e recalculados de forma independente pelo Bispo (14 células conferidas ao centésimo)
  - Controle positivo do "sem overflow em 360/768/1280" (`ADR/0002`): uma `div` de 2000px injetada na largura 1280 elevou o `scrollWidth` a 2000 e foi acusada pela mesma sonda; removida a `div`, o `scrollWidth` voltou a 1270
  - Controle positivo do "nenhuma serifa em badge, botão ou label" (`ADR/0002`): a mesma sonda de `fontFamily` acusou Newsreader no `h2` "Tese do ICP" (`detectedAsSerif=true`)

**Aceite comportamental — NÃO VERIFICADO.** Mover etapa, drawer, os 4 modais e criar projeto com retro-datas de 6m/3m não foram exercitados: o Peão-Rei (Codex) não dispõe de navegador. Pendente de teste humano com `npm run dev` em `http://localhost:5173/aton/`.

## Frentes

Uma seção por frente. Frente sem próximo passo e sem bloqueio é frente encerrada — diga isso em vez de deixar em branco.

### Estrutura de equipe

- **Estado:** kit instalado e placeholders preenchidos; as três ADRs do rito estão `ACEITO` desde 2026-08-30, adotadas pelo usuário (dono do projeto) via Rei no Maestri, e a rota de `equipe/docs/roteamento-multimodelo.md` foi aprovada na mesma data pelo mesmo caminho.
- **Onde vive:** `equipe/`, `scripts/equipe.sh`, `ADR/`, `equipe/docs/roteamento-multimodelo.md`, `CLAUDE.md`, `GEMINI.md`, `AGENTS.md`, `.agents/skills/`, `.claude/skills/`.
- **Próximo passo:** item 6 das pendências — corrigir as limitações observadas nas formações `equipe` e `construcao`, via skill `role-architect` e aprovação humana.
- **O que bloqueia:** a correção das formações mexe em papéis e rota, e isso exige aprovação humana explícita, não decisão do agente.

### Aplicação Amozir

- **Estado:** redesign visual completo em working tree, **não commitado** — 14 arquivos em `src/`, `public/` e `index.html`, mais `PRODUCT.md` e `DESIGN.md` novos na raiz, criados para a skill `impeccable`. Duas rodadas em 2026-08-30: a rodada 1 (papel creme, Fraunces + Public Sans) foi revisada; a rodada 2 (identidade Amozir: fundo `#fcf9f8` em OKLCH C 0.0035, Onest com Newsreader só em títulos, acento único `#b03a0b`, tokens `@theme` do Tailwind 4, escala z semântica, marca eixo/rizoma no header e no favicon) foi revisada.
- **Renomeação do produto:** "Coringa" → **AMOZIR** (na interface, "Amozir"), decidida pelo usuário em 2026-08-30. Tagline: "Do prazo final ao próximo passo." Descritor: "Agente inteligente de gestão multiprojeto." Conceito: rizoma — conexões sob a superfície; "zir" (persa: sob/abaixo; proximidade fonética com o hebraico *tzir*: eixo, pivô, articulação); jogo verbal "Amo Zir". A pesquisa de marca que a adoção definitiva pressupõe **não foi realizada** (item 5 das pendências).
- **Nome antigo que permanece no código por decisão de diff mínimo:** o componente `CoringaAgentDrawer.jsx`, a prop `onOpenCoringaAgent` e 2 comentários em `src/data/mockData.js`. Não é resíduo esquecido: é escolha registrada.
- **Ciclo percorrido:** Dama (plano) → Torre (implementação) → Peão-Rei + Bispo + Cavalo (verificação e revisão) → correções C1–C8 na rodada 1 e C9–C13 na rodada 2, cada correção re-revisada por Bispo e Cavalo com contexto limpo. A última revisão de cada rodada não trouxe achado material. Isso é revisão adversarial de agentes, portanto evidência técnica; não é aprovação humana (`ADR/0003`).
- **Achado colateral corrigido:** `index.html` apontava para bundle compilado (`/aton/assets/index-DFP_BXSq.js`) e o build estava quebrado antes desta rodada; agora aponta para `/src/main.jsx`.
- **Onde vive:** `src/`, `public/`, `index.html`; build publicado em `docs/` (afirmação de `PROJECT.md`, não conferida — ver pendência 4).
- **Próximo passo:** teste manual do comportamento (pendência 1) e decisão do usuário sobre o commit (pendência 2).
- **O que bloqueia:** o aceite comportamental depende de pessoa com navegador; o commit é ato do usuário.

## Pendências

Uma linha por pendência, com dono declarado.

1. Teste manual do aceite comportamental — mover etapa, drawer, os 4 modais e criação de projeto com retro-datas 6m/3m — em `npm run dev` / `http://localhost:5173/aton/`. **Dono:** usuário.
2. Commit do redesign, só a pedido; `.gitignore` e `README.md` estão modificados desde antes desta rodada (instalação do kit) e é preciso decidir se entram no mesmo commit. **Dono:** usuário.
3. `README.md` ainda diz "Coringa" e traz badge roxo (`8B5CF6` no path do shields.io, `README.md:5`); está fora de qualquer formação e precisa de rodada documental própria. **Dono:** próxima rodada.
4. Deploy: a raiz do repositório era o artefato publicado (commit `cfd783b`, "publish production compiled assets to root"), enquanto `PROJECT.md` afirma que o Pages publica a partir de `docs/`; conferir o source do Pages, regenerar o bundle e publicar — o push é ato do usuário. **Dono:** próxima rodada, com push pelo usuário.
5. Pesquisa de marca "Amozir" e das variantes Amosir/Amozi/Amozyr no INPI, em domínios e em lojas de aplicativos — **não realizada**. **Dono:** usuário.
6. Formações `equipe` e `construcao`: o Peão-Dama (Codex) não escreve fora de `.maestri/roles/` e o Codex não consegue `maestri ask` de volta ("Operation not permitted"); o Peão-Rei não tem navegador; o runtime do Claude ignora o `--permission-mode` declarado na formação (Torre e Bispo subiram em auto mode). Correção via skill `role-architect`, com aprovação humana. **Dono:** próxima rodada, com aprovação do usuário.
7. Skill `impeccable` instalada por symlink (`~/.codex/skills/impeccable`, v3.5.0); o update para 4.1.1 não foi aplicado. **Dono:** usuário.
8. Notas de revisão sem correção nesta rodada: grade de 5 métricas no `PitchModal`; descritor "Agente de gestão multiprojeto" no header contra "Agente inteligente de gestão multiprojeto" no pitch; input e select de busca do pipeline sem `id`/`name`; botão flutuante duplica o do header em telas largas; `STAGES[].color` e `STAGES[].dotColor` em `mockData` sem consumidor. **Dono:** próxima rodada.
9. Desvios de processo registrados nesta rodada: a Torre atuou como redatora documental porque o Peão-Dama estava bloqueado pela sandbox do Codex (exceção autorizada pelo usuário em 2026-08-30); e em duas ocasiões a Torre subiu em auto mode em vez de `acceptEdits`, por erro de operação do Rei. **Dono:** próxima rodada.
10. Guardrail "regra de negócio do Coringa" ainda com o nome antigo em `CLAUDE.md:41`, `CLAUDE.md:43` e em `equipe/papeis/` (`construtor.md:204`, `revisor-conformidade.md:140`, `revisor-tecnico.md:113`, `testador.md:85`, `redator.md:88`); `PROJECT.md` já diz Amozir. Renomear passa pela skill `role-architect` (papéis) e por rodada documental (`CLAUDE.md`). **Dono:** próxima rodada.

## Itens deliberadamente não concluídos

Coisas que **não** foram feitas por decisão, não por esquecimento. Cada uma com o motivo.

- Nenhum commit, nenhum push, nenhuma mudança em `package.json` ou `vite.config.js`: o repositório é compartilhado e commit e push são atos pedidos pelo usuário. O redesign de `src/`, `public/` e `index.html` foi pedido e está na working tree, sem commit.
- Nenhum `equipe/perfil.local` criado: perfil é fato de cada máquina, e a ausência do arquivo já significa `claude-codex`.
- Identificadores de código com o nome antigo (`CoringaAgentDrawer.jsx`, `onOpenCoringaAgent`, 2 comentários em `src/data/mockData.js`) mantidos: renomeá-los aumentaria o diff sem efeito sobre o aceite da rodada.

## Próximo passo autorizado e o que está bloqueado

- **Autorizado:** teste manual do aceite comportamental (pendência 1) e decisão do usuário sobre o commit do redesign, incluindo se `.gitignore` e `README.md` entram (pendência 2).
- **Bloqueados:** qualquer alteração no produto sem brief; `git push`.
- **Push:** ato pedido pelo usuário, nunca rotina.

## Como retomar

1. Ler `PROJECT.md` e este arquivo integralmente.
2. Reapurar o snapshot por comando — este bloco é fotografia datada.
3. Rodar a linha de base técnica do projeto e registrar a saída real.
4. Implementação nova só mediante pedido explícito do usuário.

## Fronteiras e doutrina

Fronteiras, regras permanentes e hierarquia de fontes moram em `PROJECT.md` e nas ADRs (`ADR/INDICE.md`). Este arquivo não as reexplica.
