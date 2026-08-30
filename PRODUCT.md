# Product

## Register

product

## Users

Profissionais criativos autônomos e microestúdios de eventos e papelaria. Entregam de 2 a 4 projetos por mês, mas administram de 6 a 12 simultaneamente em etapas sobrepostas — briefing, criação, aprovação do cliente, revisão, entrega final — sem gerente de projetos dedicado.

O contexto de uso é a mesa de trabalho: sessões curtas e frequentes, entre uma tarefa de produção e outra, geralmente em desktop, às vezes no celular entre reuniões e visitas a fornecedor. A pessoa chega ao Amozir com uma pergunta operacional urgente ("o que trava hoje?", "esse convite ainda cabe no prazo?"), não com vontade de explorar.

O trabalho a ser feito é este: **saber, sem reconstruir o cronograma de cabeça, qual entregável está em risco agora e qual é o próximo passo.** Cada evento contratado carrega três entregáveis obrigatórios cujos prazos são calculados de trás para frente a partir da data da festa — Save the Date em `festa − 6 meses`, Convite Oficial em `festa − 3 meses`, e a festa. Com 9 eventos ativos, são 27 prazos interdependentes que ninguém segura na memória.

## Product Purpose

O Amozir impõe o cálculo retroativo dos prazos e articula as dependências entre projetos sobrepostos. Ele não é uma lista de tarefas: é o eixo que liga data da festa, entregáveis, etapa do pipeline, carga de produção e colisões de agenda, e que devolve isso como uma leitura única.

O nome vem daí. *Rizoma*: as conexões que sustentam o sistema ficam sob a superfície. *Zir* (persa: sob, abaixo; próximo do hebraico *tzir*: eixo, pivô, articulação). O agente é o eixo que articula projetos, tarefas, prazos e dependências — e o jogo verbal "Amo Zir" fica de brinde.

Tagline: **Do prazo final ao próximo passo.**
Descritor: **Agente inteligente de gestão multiprojeto.**

Sucesso é a pessoa abrir o app, gastar menos de trinta segundos e sair sabendo o que fazer — sem abrir planilha, sem conferir contrato, sem recontar meses no calendário.

**Fronteira atual:** MVP de hackathon. Sem backend, autenticação, banco ou persistência entre sessões; os dados vêm de `src/data/mockData.js`. As três regras de prazo (6m / 3m / festa) são regra de negócio, não detalhe de implementação, e não mudam sem pedido explícito.

## Brand Personality

Três palavras: **articulador, perspicaz, cúmplice.**

- **Articulador** — a voz liga coisas: mostra que o convite do 15 anos e o batizado caem na mesma semana, e diz por quê. Nunca lista sem relacionar.
- **Perspicaz** — antecipa. Fala do prazo que vai estourar, não do que já estourou. Precisão em datas e números é parte do tom.
- **Cúmplice** — está do lado de quem faz. Não julga o atraso, não moraliza sobre organização, não usa exclamação motivacional. Diz o que aconteceu e qual é o próximo passo.

Português do Brasil, segunda pessoa direta, frases curtas. Números e datas sempre explícitos e tabulares. Um alerta é sempre ícone **e** texto, nunca só cor.

Emocionalmente o alvo é **alívio controlado**: a sensação de que alguém já conferiu. Não urgência, não festividade, não gamificação.

## Anti-references

- **SaaS dark genérico (clone de Linear / Vercel).** Fundo quase preto, roxo-azulado, glow, cartões de vidro. É o reflexo de categoria; nada nele serve a quem trabalha com papelaria sob luz de mesa.
- **Notion / Monday coloridos.** Etiqueta colorida para tudo, cada projeto com sua cor. Aqui a cor é escassa por decisão: um acento só, reservado a ação, seleção e estado.
- **Wedding planner com script dourado.** Serifa caligráfica, dourado, floreio, tom celebratório. O público *produz* casamento; não quer que a ferramenta de trabalho se pareça com o convite.
- **ERP corporativo cinza.** Densidade sem hierarquia, tabela infinita, nenhuma leitura do que importa agora.
- **A faixa creme editorial** (`#FAF6EF` e vizinhança, tipografia display quente, faixa lateral colorida nos cartões). Foi a direção da rodada 1 e é hoje o segundo reflexo de IA: o desvio óbvio do SaaS escuro. Superfície neutra de croma ~0, não "quente por padrão".

## Design Principles

1. **O eixo antes da lista.** Toda tela responde primeiro "o que exige atenção agora" e só depois mostra o inventário. Radar antes do pipeline, sempre.
2. **A regra é visível, não implícita.** `6m`, `3m` e `festa` aparecem escritos junto do dado que produzem. O usuário precisa conseguir auditar o cálculo do agente, não confiar nele às cegas.
3. **Cor é escassa e semântica.** Um acento solar para ação primária, seleção e estado. Urgente / atenção / concluído sempre com ícone e texto junto. Nada de cor decorativa.
4. **Densidade com hierarquia.** O público administra 9 projetos e 27 prazos: a tela pode ser densa. O que não pode é ser plana — peso, superfície e espaçamento têm de separar o urgente do inventário.
5. **A ferramenta desaparece na tarefa.** Vocabulário de componente idêntico em todas as telas, affordances padrão, nenhuma invenção de controle. Movimento só quando comunica mudança de estado.

## Accessibility & Inclusion

- **WCAG 2.2 AA.** Texto ≥ 4.5:1 contra seu fundo (placeholder incluído); elementos não-textuais que carregam informação — contorno de campo, anel de foco — ≥ 3:1.
- **Teclado completo.** Toda ação alcançável por Tab, incluindo cartões do kanban (gatilho no título) e compromissos do calendário (`<button>`, não `<div>` clicável). Anel de foco visível global, 2px no acento, com deslocamento.
- **Alvos de toque ≥ 44 × 44 px** em todo controle.
- **Nunca só cor.** Todo estado semântico traz ícone e rótulo textual — atende daltonismo e leitura em tela de baixa qualidade.
- **`prefers-reduced-motion: reduce` respeitado**: animação e transição caem para tempo desprezível, e nenhum conteúdo depende de transição para aparecer.
- **Sem emoji como ícone.** Ícones vêm de uma família única (lucide-react), sempre com `aria-hidden` quando acompanhados de texto.
- Interface em pt-BR; datas em formato brasileiro; números tabulares para permitir comparação em coluna.
