# Adaptador Claude Code

Use este adaptador depois de aprovação humana do blueprint e da etapa. O Construtor é o único escritor da superfície atribuída.

## Sessão

Inicie cada sessão com o modelo e o effort indicados no brief:

```bash
claude --model <fable|opus|sonnet> --effort <low|medium|high|xhigh|max>
```

Registre modelo, effort, faixa, justificativa e escalonamento no handoff. Para a faixa profunda, registre o fallback `Fable → Opus` quando Fable não estiver disponível. Não grave configuração local para fixar modelo ou effort. `xhigh` e `max` exigem aprovação humana explícita.

## Fluxo

- Confirme o brief e a aprovação humana antes de executar ou recrutar.
- Mantenha um escritor único na superfície atribuída.
- Rode somente as validações permitidas no brief.
- Envie a cada revisor um pacote isolado com requisito original e `git diff` relevante; o Maestro faz a triagem antes de qualquer correção.

O método não depende de Maestri, de credenciais, de configuração persistente ou de estado local.
