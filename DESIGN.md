# Design

Sistema visual do **Amozir** — aplicação web de gestão multiprojeto para criativos de eventos. Este documento descreve o sistema **como está no código** após a rodada de redesenho de 30/08/2026. A fonte da verdade é `src/index.css`; aqui o sistema é explicado, não duplicado por preferência.

Registro: **product** (o design serve a tarefa). Estratégia de cor: **restrained** — neutros tingidos e um acento só.

---

## Visual Theme

Tema claro, superfície neutra. A cena que define a escolha: alguém trabalhando de dia, numa mesa de estúdio com papel, provas de impressão e amostras de cor por perto, alternando entre o app e o material físico. Um tema escuro brigaria com o papel na mesa; uma superfície quente contaminaria a leitura das provas. Logo: **neutro real, croma ≈ 0**.

O conceito é **rizoma**: um eixo que articula, e conexões que ficam sob a superfície. Ele aparece de forma literal em dois lugares e em nenhum outro — a marca e um motivo discreto no cabeçalho do drawer do agente. Não é padrão de página, não é textura de fundo.

Três camadas de superfície, e só três:

| Camada | Token | Onde |
|---|---|---|
| Chão da página | `bg` | `<body>`, área de conteúdo |
| Cartão / modal / campo | `surface` | cartões, modais, inputs, chips |
| Barra / painel / drawer | `surface-2` | header fixo, rodapé, cabeçalho e abas do drawer, preenchimentos discretos |

---

## Color Palette

Todas as cores nascem em OKLCH e são gravadas em hex nos tokens. Os neutros usam o matiz do acento (**38**) com croma ≤ 0.0045 — tingidos na direção da marca, nunca "quentes por padrão".

### Superfícies e tinta

| Token | Hex | OKLCH | Papel |
|---|---|---|---|
| `--color-bg` | `#fcf9f8` | `0.9841 0.0035 39.5` | chão da página |
| `--color-surface` | `#ffffff` | `1.0000 0 —` | cartão, modal, campo |
| `--color-surface-2` | `#f6f3f2` | `0.9662 0.0035 39.5` | barra, painel, drawer |
| `--color-ink` | `#211c1a` | `0.2315 0.0087 43.1` | texto principal |
| `--color-ink-muted` | `#5e5654` | `0.4602 0.0110 34.3` | texto secundário |
| `--color-ink-subtle` | `#6f6663` | `0.5177 0.0124 39.4` | texto terciário, placeholder, ícone acessório |
| `--color-line` | `#e3dedd` | `0.9042 0.0056 31.1` | divisória fina |
| `--color-line-strong` | `#ccc6c4` | `0.8308 0.0073 39.5` | divisória de seção |
| `--color-line-control` | `#908683` | `0.6280 0.0129 37.4` | contorno de campo e de botão contornado (≥ 3:1) |
| `--color-overlay` | `rgb(33 28 26 / 0.55)` | — | fundo de modal e drawer |

### Acento

Um só, solar. Usado em **ação primária, seleção, estado e foco** — nunca em decoração.

| Token | Hex | OKLCH |
|---|---|---|
| `--color-accent` | `#b03a0b` | `0.5146 0.1617 38.2` |
| `--color-accent-hover` | `#902e07` | `0.4442 0.1394 38.3` |
| `--color-accent-soft` | `#ffebe5` | `0.9544 0.0233 37.4` |
| `--color-on-accent` | `#ffffff` | — |
| `--color-focus` | `#b03a0b` | — |

### Semânticos

Cada família tem cor sólida, superfície, contorno e tom de texto. **Nunca aparecem sozinhos**: sempre acompanhados de ícone e rótulo textual.

| Família | sólido | surface | border | on- |
|---|---|---|---|---|
| urgent | `#a81e15` | `#ffecea` | `#f0c5bf` | `#96120d` |
| warning | `#7a5a05` | `#fcf3d9` | `#e5d3a6` | `#6d5000` |
| success | `#1e6b3a` | `#e7f7ea` | `#bfddc6` | `#1a5f32` |

### Contraste verificado

Texto ≥ 4.5:1; não-texto ≥ 3:1.

| | bg | surface | surface-2 | accent-soft | urgent-s. | warning-s. | success-s. |
|---|---|---|---|---|---|---|---|
| `ink` | 16.09 | 16.86 | 15.27 | 14.66 | 14.80 | 15.22 | 15.16 |
| `ink-muted` | 6.83 | 7.15 | 6.48 | 6.22 | 6.28 | 6.46 | 6.44 |
| `ink-subtle` | 5.34 | 5.59 | 5.06 | 4.86 | 4.91 | 5.05 | 5.03 |
| `accent` | 5.80 | 6.08 | 5.50 | 5.29 | 5.34 | 5.49 | 5.47 |
| `on-urgent` | 8.39 | 8.79 | 7.96 | 7.65 | 7.72 | 7.94 | 7.91 |
| `on-warning` | 7.16 | 7.51 | 6.80 | 6.53 | 6.59 | 6.78 | 6.75 |
| `on-success` | 7.35 | 7.70 | 6.98 | 6.70 | 6.76 | 6.95 | 6.93 |

Não-texto: `line-control` 3.55 / 3.38 / 3.21 (surface / bg / surface-2); anel de foco `accent` 5.80 sobre `bg`. Branco sobre sólidos: accent 6.08, accent-hover 8.14, urgent 7.34, warning 6.38, success 6.52.

---

## Typography

Duas famílias, com papéis separados por regra, não por gosto.

- **`--font-body` — Onest** (400 / 500 / 600 / 700). Carrega **toda a UI**: corpo, rótulo, botão, dado, tabela, badge, aba.
- **`--font-display` — Newsreader** (500 / 600). Serifa, e **só** em título de página, título de seção e título de modal — os `h1`, `h2` e o título do drawer. Nunca em rótulo, botão, dado, tabela, badge ou aba.

Escala **rem fixa** (não fluida: o público usa DPI constante, e título elástico dentro de painel piora a leitura). Razão entre degraus 1.14–1.19.

| Token | rem | px | Razão | Uso |
|---|---|---|---|---|
| `--text-caption` | 0.75 | 12 | — | legenda, badge, metadado |
| `--text-label` | 0.875 | 14 | 1.167 | rótulo, botão, dado — o degrau de trabalho |
| `--text-body` | 1 | 16 | 1.143 | base do documento, prosa |
| `--text-section-title` | 1.1875 | 19 | 1.188 | título de seção e de modal |
| `--text-page-title` | 1.375 | 22 | 1.158 | título de página, marca |
| `--text-display` | 1.625 | 26 | 1.182 | reservado |

`text-wrap: balance` em `h1`–`h3`. Números sempre `tabular-nums`. Títulos herdam a sans por padrão no `@layer base`; a serifa entra por classe explícita.

---

## Layout

- Contêiner `max-w-7xl` centrado, `--spacing-page-x` de 1.25rem (2rem a partir de `lg`).
- Espaçamento nomeado: `--spacing-section` 2.5rem entre seções, `--spacing-panel` 1.25rem dentro de painel, `--spacing-grid` 0.75rem entre células de grade, `--spacing-control` 0.625rem.
- Raios contidos: `xs` 2px (badge, chip), `sm` 4px (botão, campo, cartão de coluna), `md` 8px (cartão de destaque, modal), `full` (pílula).
- Sombras neutras, nunca coloridas: `subtle` (cartão em repouso), `raised` (cartão sob ponteiro, botão flutuante), `modal`.
- Responsividade **estrutural**, não tipográfica: o kanban vai de 1 → 3 → 5 colunas (`md`, `lg`); o calendário troca a grade de 7 colunas por uma agenda vertical abaixo de `sm`; a barra de cabeçalho empilha abaixo de `md`.
- Verificado sem transbordo horizontal em **360 / 768 / 1280**, no pipeline, no calendário, nos quatro modais e no drawer.

### Escala de empilhamento

Nomeada, declarada em `:root`, exposta por utilitários. Nenhum `z` arbitrário no código.

```
--z-dropdown: 10  <  --z-sticky: 20  <  --z-backdrop: 30  <  --z-modal: 40  <  --z-toast: 50
```

Em uso hoje: `z-sticky` (header fixo, gatilho flutuante) e `z-modal` (drawer e os quatro modais).

---

## Components

Vocabulário único em todas as telas. Todo interativo tem **default, hover, focus, active e disabled** — os dois últimos definidos uma vez no `@layer base` (`filter: brightness(0.94)` no pressionado; `opacity: 0.55` + `cursor: not-allowed` no desabilitado), o resto por classe.

- **Botão primário** — `bg-accent` / `hover:bg-accent-hover` / texto `on-accent`, `rounded-sm`, `min-h-11`. Ação principal de cada superfície.
- **Botão contornado** — `bg-surface`, `border-line-control` (≥ 3:1), texto `ink`. Ação secundária, fechar, navegar.
- **Botão fantasma** — sem contorno, `text-ink-muted`, `hover:bg-surface-2`. Navegação de mês, alternância de aba.
- **Aba / alternador de visão** — grupo com contorno `line-control`; item ativo em `bg-accent` + `text-on-accent`, inativo fantasma.
- **Campo** — `bg-surface`, `border-line-control`, `hover:border-ink-subtle`, `focus:border-accent`, `min-h-11`. Rótulo em `caption` semibold, caixa normal.
- **Cartão de projeto (kanban)** — `bg-surface` + `border-line`; em risco, superfície tingida `bg-urgent-surface` + `border-urgent-border` **e** faixa "Risco na regra de prazos" com ícone. Nunca faixa lateral colorida.
- **Ficha do radar** — três estados distintos, não uma grade uniforme: a ficha em risco recebe superfície `warning-surface` e ganha peso; as outras duas ficam em `surface` e carregam o estado no chip.
- **Chip de estado** — `caption` versalete com ícone, superfície e contorno da família semântica. É o portador padrão de estado.
- **Alvo de toque** — `min-h-11` / `min-w-11` (44 px) em todo controle, verificado em 360 / 768 / 1280.
- **Marca** — SVG em linha: eixo vertical, duas conexões de rizoma com nós, pivô em acento. Aparece no header e no favicon, com a mesma construção — eixo, duas conexões com nós, pivô em acento —, e com ajuste óptico no favicon: `viewBox` 48 em vez de 40, nós mais internos e eixo mais curto em proporção, para o desenho não fechar no tamanho de ícone.
- **Motivo de rizoma** — hairline em `line-strong`, sem acento, só no cabeçalho do drawer do agente. Uma aparição, decorativa e discreta.

Sem barra de rolagem customizada, sem vidro, sem gradiente, sem texto em gradiente, sem emoji como ícone, sem numeração decorativa de seção, sem eyebrow versalete acima de cada bloco, sem faixa lateral colorida.

---

## Motion

- Curva única: `--ease-quint` = `cubic-bezier(0.22, 1, 0.36, 1)`. Ease-out, sem bounce.
- Duração 150 ms (cor, contorno), 200 ms (sombra, largura de barra), 220 ms (entrada do drawer). Nada fora de 150–250 ms.
- Movimento **só comunica mudança de estado**: hover, foco, abertura de painel, avanço de barra de capacidade. Não há sequência de entrada de página, nem revelação por rolagem.
- `@keyframes` em uso: `fade-in` (150 ms, fundo de modal) e `slide-in-right` (220 ms, drawer).
- `prefers-reduced-motion: reduce` derruba animação e transição para 0.01 ms e desliga rolagem suave. Nenhum conteúdo depende de transição para ficar visível.

---

## Accessibility

Contrato verificado, não pretendido:

- Texto ≥ 4.5:1, não-texto informativo ≥ 3:1 (tabela acima).
- Anel de foco global: `outline: 2px solid var(--color-focus)` com `outline-offset: 2px`, em todo `:focus-visible`.
- Alvos ≥ 44 × 44 px.
- Teclado completo: título do cartão do kanban é `<button>`; compromissos e cartões de resumo do calendário são `<button>`. Nenhuma ação depende de `div` clicável.
- Estado nunca só por cor: ícone + texto sempre.
- `prefers-reduced-motion` respeitado.
