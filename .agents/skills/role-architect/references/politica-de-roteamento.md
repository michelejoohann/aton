# Política de roteamento

Escolha a faixa pela complexidade objetiva da etapa, não pelo prestígio do papel. Registre a escolha no brief ou handoff.

| Faixa | Quando usar | Codex | Claude Code | Effort inicial |
|---|---|---|---|---|
| profunda | arquitetura, ambiguidade relevante ou risco alto | Sol | Fable; fallback Opus | medium |
| padrão | implementação delimitada, integração ou investigação moderada | Terra | Opus para alta complexidade ou Sonnet para código usual | medium |
| rotineira | testes conhecidos, documentação ou transformação mecânica | Luna | Sonnet | low |

## Registro por etapa

```text
Etapa: <nome>
Faixa: profunda | padrão | rotineira
Modelo/effort: <modelo> + <effort>
Justificativa: <motivo objetivo>
Escalonamento: não necessário | <gatilho>
```

## Escalonamento

O effort só pode subir por um destes gatilhos: ambiguidade irreversível; falha persistente pós-diagnóstico; risco de dados ou regras; discordância material de revisores; ou decisão arquitetural real. `xhigh` e `max` exigem aprovação humana explícita. Registrar o gatilho não autoriza uma nova implementação fora do escopo aprovado.
