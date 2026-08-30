# 0003 — Nada é declarado feito sem evidência registrada; evidência automatizada não substitui aprovação humana

- **Status:** ACEITO
- **Data:** 2026-08-30
- **Decidido por:** usuário (dono do projeto), via Rei no Maestri
- **Fonte:** kit de equipe; `PROJECT.md` §Regras para qualquer agente

## Contexto

Duas confusões distintas produzem o mesmo estrago — registro que afirma mais do que o projeto tem —, e por isso ficam na mesma decisão.

A primeira é de **alegação**: revisão humana, entrevista, ensaio, reteste, piloto e validação externa são fáceis de alegar e difíceis de auditar. Basta uma frase no passado, e ela sobrevive a todas as leituras seguintes como se fosse fato apurado.

A segunda é de **classe de evidência**: uma suíte verde, um linter limpo ou uma revisão adversarial de agente são fáceis de ler como aprovação. Testes provam estrutura e ausência de regressão; não provam que a coisa certa foi construída, nem que uma pessoa responsável concordou com ela.

## Decisão

1. **Nada é declarado feito sem evidência real registrada.** Revisão humana, entrevista, ensaio, reteste, piloto e validação externa só entram no registro como realizados quando a evidência correspondente existir e for localizável.
2. **Evidência técnica automatizada e aprovação humana ficam separadas no registro.** Verificação por comando, suíte de testes e revisão adversarial de agente são evidência técnica — nunca aprovação humana, e nunca autorização para declarar como realizada qualquer das etapas do item 1.

## Alternativas descartadas

- **Confiar no relato de quem executou** — descartada: o relato é exatamente o que a regra precisa poder conferir.
- **Tratar suíte verde como prontidão** — descartada: cobertura mede o que foi escrito para ser medido.

## Consequências

- Vale para agentes e para pessoas, sem distinção.
- Vale para relatório de quem implementa, parecer de revisor, brief de quem coordena e para o `CHECKPOINT.md`.
- Etapa sem evidência permanece registrada como **pendente**, não como concluída, e a distinção aparece no texto — não fica implícita.

## Revisibilidade

Não prevista.
