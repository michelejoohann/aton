# 🃏 Coringa | Agente Gerente de Projetos IA (Hackathon MVP)

> **Gerente de Projetos Inteligente para Criativos Autônomos e Microestúdios de Eventos**

![Coringa PM Agent](https://img.shields.io/badge/Coringa-Agente_IA-8B5CF6?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Active-22C55E?style=for-the-badge&logo=github&logoColor=white)

---

## 🎯 Definição Central do ICP

> **Profissionais criativos autônomos e microestúdios de eventos que entregam de 2 a 4 projetos por mês, mas administram simultaneamente de 6 a 12 projetos em etapas sobrepostas, sem possuir um gerente de projetos dedicado.**

O problema não é falta de demanda, mas a **perda da visão do conjunto e a gestão de prioridades no susto** conforme os projetos atravessam diferentes meses.

---

## ⚡ Regras de Negócio Implementadas

### 📌 Regra Padronizada dos 3 Entregáveis Por Evento:
Para cada projeto (Casamentos, 15 Anos, Formaturas, Eventos Corporativos, Bodas, Batizados), o Coringa impõe o cálculo retroativo das datas:

1. 📌 **Save the Date**: Prazo limite automático até **6 meses antes da festa** (`Festa - 6 meses`).
2. 💌 **Convite Oficial**: Prazo limite automático até **3 meses antes da festa** (`Festa - 3 meses`).
3. 🎉 **Festa / Evento**: Data final do evento.

---

## 🔥 Funcionalidades Chave

- **🎯 Radar de Foco & Monitor de Regras**: Exibe em tempo real o que precisa da atenção imediata para que a criativa nunca trabalhe no caos.
- **📊 Pipeline Multiestágio (Kanban)**: Visão unificada das 5 etapas cruciais (*Briefing*, *Em Criação*, *Aguardando Cliente*, *Ajustes/Refinamento*, *Pronto/Entregue*).
- **📅 Visão de Calendário Interativa**: Grade mensal com marcadores visuais diferenciados para Save the Date, Convites e Festas.
- **🤖 Agente Coringa (Drawer IA)**:
  - Verificador de prazos limites (6m / 3m).
  - Reorganizador de conflitos de produção.
  - Calculadora de retro-prazos para novas demandas ("Cabe +1 Evento?").
  - Player de Daily Briefing narrado.
- **💡 Tese de Vendas ICP (R$ 47,00/mês)**: Modal explicativo com a defesa econômica do produto.

---

## 🌐 Publicação no GitHub Pages

O projeto possui publicação automática no GitHub Pages via GitHub Actions:

👉 **Link Público Oficial:** [https://michelejoohann.github.io/aton/](https://michelejoohann.github.io/aton/)

---

## 🚀 Como Rodar Localmente

```bash
# 1. Clonar o repositório
git clone https://github.com/michelejoohann/aton.git

# 2. Entrar na pasta do projeto
cd aton

# 3. Instalar as dependências
npm install

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse em `http://localhost:5173/`.

---

### 💳 Modelo de Negócio
- Mensalidade: **R$ 47,00/mês** (Aproximadamente R$ 1,57/dia).
- Valor percebido: Se economizar 1 hora de organização por mês, o produto já se paga.

---

## 🧩 Estrutura de equipe (agentes)

O repositório carrega, além do app, uma estrutura versionada de trabalho com agentes. Ela é **aditiva e neutra de ferramenta**: nada nela muda o build, as dependências ou a publicação, e o app roda igual para quem a ignorar.

| Caminho | O que é |
|---|---|
| `PROJECT.md` | contexto permanente: propósito, público, fronteiras, guardrails |
| `CHECKPOINT.md` | estado operacional: frentes, o que está autorizado, o que está bloqueado |
| `ADR/` | decisões que sustentam o rito de revisão (as três do kit chegam como `PROPOSTO`) |
| `equipe/papeis/` | os sete prompts de papel, integrais (Rei, Dama, Torre, Bispo, Cavalo, Peão-Rei, Peão-Dama) |
| `equipe/formacoes/` | quem sobe em cada frente, com qual modelo e qual effort |
| `equipe/docs/roteamento-multimodelo.md` | por que cada etapa roda em motor diferente da anterior |
| `scripts/equipe.sh` | monta o time no canvas do Maestri (opcional) |
| `CLAUDE.md`, `GEMINI.md`, `AGENTS.md` | entradas finas, uma por ferramenta, apontando para os mesmos arquivos |

Trabalhando por **Gemini CLI**: leia `GEMINI.md` e siga. O Maestri e o `scripts/equipe.sh` são opcionais — sem eles, `equipe/papeis/*.md` continua valendo como prompt de papel.

Trabalhando por **Claude Code** ou **Codex**: leia `CLAUDE.md` ou `AGENTS.md`.

