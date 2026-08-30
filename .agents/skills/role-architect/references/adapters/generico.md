# Adaptador genérico

Este fluxo manual independe de plataforma e só começa depois da aprovação humana do blueprint e da etapa.

1. Registre requisito, fontes, escopo, fora do escopo, riscos, aceite e comandos permitidos.
2. Designe um escritor único para a superfície; ninguém mais edita enquanto ele estiver ativo.
3. O escritor implementa apenas o escopo aprovado e registra ferramenta, modelo/effort quando houver e qualquer fallback.
4. Execute as validações previstas e preserve suas saídas reproduzíveis.
5. Prepare dois pacotes isolados, um por revisor, contendo somente requisito original e `git diff` relevante.
6. Receba os pareceres sem compartilhar contexto entre revisores. O coordenador da triagem tria os achados e só então autoriza correções.
7. Entregue o handoff e dispense os papéis sem nova etapa aprovada.

`xhigh` e `max` requerem aprovação humana explícita. Não recrute, não configure credenciais e não crie estruturas de colaboração antes da aprovação humana necessária.
