# Adaptador Maestri

Use este adaptador somente depois de haver um blueprint aprovado por humano. O método também funciona sem Maestri.

## Antes de materializar

- Confirme que o blueprint aprovado autoriza esta superfície e os terminais necessários.
- Crie ou conecte somente terminais já aprovados no blueprint; não altere papéis, modelos, contas ou credenciais por iniciativa própria.
- Publique uma nota de brief apenas para os papéis que precisam dela para executar a etapa aprovada.
- Designe um único Construtor como escritor da superfície. Os demais papéis permanecem somente leitura.

## Execução e validação

- Use andares apenas quando o paralelismo ou o risco já tiver sido aprovado no blueprint; não crie um andar para contornar a ausência de aprovação.
- Use o Prompt Composer para organizar referências de uma etapa aprovada.
- Use o portal somente para validação web prevista no aceite.
- Crie rotinas somente depois de valor comprovado e com aprovação humana registrada.
- Para cada revisor, entregue um pacote isolado com requisito original e `git diff` relevante. Não compartilhe conversa, contexto de outro revisor, dados internos ou solução esperada.
- O Maestro recebe os achados, faz a triagem e decide se há correção aprovada. Ao final, registra a dispensa dos papéis que não terão nova etapa aprovada.

## Higiene de repositório

Não versione IDs de terminais, `role.json`, credenciais, configurações locais ou estado transitório do Maestri. Se esses itens surgirem em um diff, retire-os antes do handoff e registre a ocorrência.
