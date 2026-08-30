# Adaptador Codex

Use este adaptador depois de aprovação humana do blueprint e da etapa. O Construtor continua sendo o único escritor da superfície atribuída.

## Sessão

- Registre no handoff o modelo e o effort usados por sessão ou perfil.
- Registre faixa, justificativa objetiva e eventual escalonamento. Não aumente effort sem gatilho documentado; `xhigh` e `max` dependem de nova aprovação humana explícita.
- Se o modelo ou effort definido no brief não estiver disponível, registre o fallback antes de executar e mantenha o escopo aprovado.

## Fluxo manual

1. Confirme o brief aprovado, fontes, escopo, riscos e aceite.
2. O escritor único implementa somente a superfície atribuída.
3. Execute os comandos permitidos e entregue as evidências.
4. Monte dois pacotes isolados de revisão contendo somente requisito original e `git diff` relevante.
5. O Maestro tria os achados e autoriza qualquer correção subsequente.

Não dependa de Maestri, configuração local, credenciais ou identidade de sessão para o método funcionar.
