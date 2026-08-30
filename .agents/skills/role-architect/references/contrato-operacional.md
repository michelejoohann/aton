# Contrato operacional

## Papéis e autoridade

| Papel | Pode editar? | Entrada | Saída | Encerramento |
|---|---:|---|---|---|
| Maestro | não, por padrão | brief, estado e handoffs | blueprint, delegações e triagem | decisão registrada |
| Planejador | não | requisito e fontes canônicas | plano e aceite | plano aprovado |
| Construtor | somente o escopo atribuído | plano aprovado | diff e evidências | handoff entregue |
| Testador | não | diff e comandos definidos | resultados reproduzíveis | resultado entregue |
| Revisor A/B | não | requisito original e diff | achados funcionais | parecer entregue |
| Redator | somente documentação autorizada | decisão e mudanças aprovadas | documentação sincronizada | registro entregue |

O Construtor não edita fora do escopo atribuído. Testador e Revisores não corrigem arquivos. Planejador, Testador e Redator são opcionais quando não agregam valor à tarefa. Após qualquer implementação, os dois revisores independentes são obrigatórios.

## Ciclo de trabalho

`brief aprovado → equipe mínima → planejamento → escritor único → validação → dois revisores isolados → triagem → correção → revisão do diff corrigido → handoff → dispensa`

A dispensa ocorre após o handoff do papel, quando sua saída foi recebida e não há nova etapa aprovada para ele. O Maestro registra a decisão de encerrar ou continuar o ciclo.
