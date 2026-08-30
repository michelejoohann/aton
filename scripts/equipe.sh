#!/usr/bin/env bash
# Sobe a equipe deste projeto pela rota de equipe/docs/roteamento-multimodelo.md.
#
# Modelo, effort e permissão entram no comando do terminal, nunca no prompt do
# papel: o que está no comando é auditável e o agente não consegue contornar.
# Papel entra por preset versionado em equipe/papeis/, não redigitado na interface.
#
#   bash scripts/equipe.sh formacoes                    lista as formações
#   bash scripts/equipe.sh mostrar <formacao>           imprime a rota, não executa nada
#   bash scripts/equipe.sh sincronizar [<Papel>]
#   bash scripts/equipe.sh sincronizar <Papel> --confirmo
#                                                       grava equipe/papeis/ no Maestri; sem
#                                                       papel, todos. Aborta se algum preset
#                                                       ativo divergir ou não puder ser
#                                                       consultado; --confirmo sobrescreve o
#                                                       divergente e só existe com o papel
#   bash scripts/equipe.sh verificar                    compara arquivo versionado e preset ativo;
#                                                       papel que não puder ser consultado vira
#                                                       linha de falha, o laço segue até o fim e o
#                                                       resumo declara a apuração incompleta
#   bash scripts/equipe.sh subir <formacao> <Peça>|--todos [--confirmo]
#   bash scripts/equipe.sh correcao <formacao>          troca a Torre para effort de correção
#   bash scripts/equipe.sh dispensar <Peça>|--todos
#
# `mostrar`, `subir` e `correcao` traduzem a formação pelo perfil de motor deste
# clone antes de validar. `equipe/perfil.local` escolhe o perfil, e a ausência do
# arquivo significa `claude-codex` — identidade, os comandos como a formação os
# escreve. `sincronizar`, `verificar` e `dispensar` não dependem de perfil.
# A tabela de tradução vive em `equipe/perfis/`; o procedimento, no README.
#
# Um papel por vez, por desenho: terminal parado é sessão queimando à toa, e o
# contrato operacional pede dispensa ao receber a entrega. Quem sobe cada peça
# na hora certa é o Rei, não este script.
#
# Subir um terminal não autoriza construir. Ele fica parado até receber
# `maestri ask` do Rei.

set -euo pipefail

CLI="${MAESTRI_CLI:-maestri}"
RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PAPEIS_DIR="$RAIZ/equipe/papeis"
FORMACOES_DIR="$RAIZ/equipe/formacoes"
PERFIS_DIR="$RAIZ/equipe/perfis"

# Seleção do motor deste clone. O arquivo é local e não versionado: qual
# fornecedor está instalado na máquina é fato da máquina, não do projeto.
PERFIL_LOCAL="$RAIZ/equipe/perfil.local"

# Identidade: sem tradução, os comandos são os da formação. Não tem arquivo em
# `equipe/perfis/` porque um arquivo de identidade repetiria todas as formações.
PERFIL_PADRAO="claude-codex"

# papel exibido no Maestri | arquivo em equipe/papeis
# O Rei entra aqui para ser sincronizado e verificado como os outros, mas não
# aparece em formação nenhuma: é o terminal de coordenação, não se recruta.
PAPEIS=(
  "Rei|rei"
  "Planejador|planejador"
  "Construtor|construtor"
  "Revisor de Conformidade|revisor-conformidade"
  "Revisor Técnico|revisor-tecnico"
  "Testador|testador"
  "Redator|redator"
)

# Todas as peças recrutáveis. O Rei não entra: é o terminal de coordenação.
PECAS=(Dama Torre Bispo Cavalo "Peão-Rei" "Peão-Dama")

# Papéis que existem como preset mas não podem ser atribuídos a uma peça.
PAPEIS_NAO_RECRUTAVEIS=("Rei")

erro() { echo "$*" >&2; exit 1; }

glifo() {
  case "$1" in
    Rei) printf '♔' ;;
    Dama) printf '♕' ;;
    Torre) printf '♖' ;;
    Bispo) printf '♗' ;;
    Cavalo) printf '♘' ;;
    "Peão-Rei"|"Peão-Dama") printf '♙' ;;
    *) printf ' ' ;;
  esac
}

# Alinha por caractere, não por byte: os nomes têm acento e glifo de peça, e o
# awk do macOS conta bytes. Descontar os bytes de continuação UTF-8 (0x80-0xBF)
# devolve a largura visível.
tabela() {
  LC_ALL=C awk -F'\t' '
    function visivel(s,   t) { t = s; gsub(/[\200-\277]/, "", t); return length(t) }
    { for (i = 1; i <= NF; i++) { celula[NR, i] = $i
        if (visivel($i) > largura[i]) largura[i] = visivel($i) }
      colunas = NF > colunas ? NF : colunas; linhas = NR }
    END { for (l = 1; l <= linhas; l++) { saida = ""
            for (c = 1; c <= colunas; c++) { texto = celula[l, c]; saida = saida texto
              if (c < colunas) { espacos = largura[c] - visivel(texto) + 2
                while (espacos-- > 0) saida = saida " " } }
            sub(/ +$/, "", saida); print saida } }'
}

arquivo_do_papel() {
  local papel="$1" linha nome slug caminho
  for linha in "${PAPEIS[@]}"; do
    nome="${linha%%|*}"
    slug="${linha##*|}"
    if [ "$nome" = "$papel" ]; then
      caminho="$PAPEIS_DIR/$slug.md"
      [ -f "$caminho" ] || erro "papel '$papel' aponta para $caminho, que não existe"
      printf '%s\n' "$caminho"
      return 0
    fi
  done
  return 1
}

caminho_formacao() {
  local arquivo="$FORMACOES_DIR/$1.txt"
  [ -f "$arquivo" ] || erro "formação '$1' não existe; veja 'formacoes'"
  printf '%s\n' "$arquivo"
}

campo_formacao() {
  sed -n "s/^# $2: //p" "$1" | head -1
}

# Ecoa as linhas úteis da formação, sem comentários nem linhas vazias.
# O caminho já foi validado por quem chama: nada de process substitution
# engolindo falha e produzindo diagnóstico falso.
linhas_formacao() {
  grep -v '^[[:space:]]*#' "$1" | grep -v '^[[:space:]]*$' || true
}

# Cabeçalho da tabela de perfil, reconhecido e descartado. Linha que se pareça
# com ele sem ser ele cai nas checagens de origem e destino e vira erro.
CABECALHO_PERFIL='Comando Codex|Modelo da Torre|Comando Claude'

# Qual perfil vale neste clone. Lido uma vez por invocação: reler no meio de um
# `--todos` deixaria a formação subir metade num motor e metade noutro.
#
# O alfabeto seguro não é preciosismo — o nome entra em "$PERFIS_DIR/<nome>.txt",
# e é ele que faz `../` não virar caminho. Arquivo com linha extra, linha vazia
# ou espaço lateral é erro: perfil é escolha de uma palavra, e adivinhar qual das
# linhas vale seria adivinhar a rota.
resolver_perfil_ativo() {
  local bruto conteudo
  [ -f "$PERFIL_LOCAL" ] || { printf '%s\n' "$PERFIL_PADRAO"; return 0; }
  # Sentinela antes de fechar a substituição de comando: o Bash descarta TODAS
  # as quebras finais, e sem ela um arquivo com 'nome' seguido de duas quebras —
  # portanto com uma segunda linha, vazia — chegava aqui indistinguível de
  # 'nome', passava pela checagem de multilinha e ativava o perfil. Com a
  # sentinela, o conteúdo chega inteiro e só UMA quebra final é removida: sobra
  # exatamente 'nome' ou 'nome' mais a quebra extra, que cai no erro.
  bruto="$(cat "$PERFIL_LOCAL"; printf 'x')"
  bruto="${bruto%x}"
  conteudo="${bruto%$'\n'}"
  case "$conteudo" in
    '')
      erro "$PERFIL_LOCAL está vazio; apague o arquivo para usar '$PERFIL_PADRAO', ou escreva nele o nome de um perfil" ;;
    *$'\n'*)
      erro "$PERFIL_LOCAL tem mais de uma linha, ainda que a linha extra seja vazia; ele carrega só o nome do perfil" ;;
  esac
  # LC_ALL=C no alfabeto, e não um `case` com [a-z0-9]: fora da locale C a
  # colação interliga maiúsculas dentro da faixa a-z, e 'Claude-Only' passava
  # pelas duas checagens. Num filesystem que não distingue caixa — o do macOS,
  # por padrão — o teste de existência do arquivo também passava, e o nome
  # inválido virava perfil ativo.
  printf '%s' "$conteudo" | LC_ALL=C grep -qE '^[a-z0-9][a-z0-9-]*$' \
    || erro "nome de perfil inválido em $PERFIL_LOCAL: '$conteudo'; use apenas [a-z0-9-], começando por letra minúscula ou dígito, sem espaço, ponto ou barra"
  if [ "$conteudo" != "$PERFIL_PADRAO" ] && [ ! -f "$PERFIS_DIR/$conteudo.txt" ]; then
    erro "perfil '$conteudo', selecionado em $PERFIL_LOCAL, não existe: falta $PERFIS_DIR/$conteudo.txt"
  fi
  printf '%s\n' "$conteudo"
}

# Ecoa as linhas de tradução já validadas. Reusa o filtro de comentários e vazios
# de `linhas_formacao`: os dois arquivos têm o mesmo formato pipe-delimitado.
#
# Correspondência exata, sempre: origem e destino são strings comparadas byte a
# byte, nunca executadas nem passadas por `eval`. O script não sabe o que `-s`,
# `-a` ou `-c` significam, e é essa ignorância que faz comando novo falhar
# fechado em vez de receber tradução parcial.
linhas_perfil() {
  local caminho="$1" nome="$2" linha campos origem condicao destino
  local chave chaves="" total=0
  while IFS= read -r linha; do
    [ -n "$linha" ] || continue
    [ "$linha" != "$CABECALHO_PERFIL" ] || continue
    campos="$(printf '%s' "$linha" | awk -F'|' '{print NF}')"
    [ "$campos" = 3 ] \
      || erro "perfil $nome: linha com $campos campos, esperado 3 ($CABECALHO_PERFIL): $linha"
    IFS='|' read -r origem condicao destino <<<"$linha"
    case "$origem" in
      codex|codex\ *) ;;
      *) erro "perfil $nome: a origem não é comando Codex: $linha" ;;
    esac
    case "$destino" in
      claude|claude\ *) ;;
      *) erro "perfil $nome: o destino não é comando Claude: $linha" ;;
    esac
    case "$condicao" in
      '*') ;;
      ''|*[[:space:]]*)
        erro "perfil $nome: condição inválida '$condicao'; use * ou um token de modelo sem espaços: $linha" ;;
    esac
    # Chave é origem + condição. Duas linhas com a mesma chave fariam a rota
    # depender da ordem do arquivo, e a última a ser lida venceria em silêncio.
    chave="$origem|$condicao"
    case $'\n'"$chaves" in
      *$'\n'"$chave"$'\n'*)
        erro "perfil $nome: duas linhas para a mesma origem com condição '$condicao': $origem" ;;
    esac
    chaves="$chaves$chave"$'\n'
    total=$((total + 1))
    printf '%s\n' "$linha"
  done < <(linhas_formacao "$caminho")
  [ "$total" -gt 0 ] || erro "perfil $nome: nenhuma linha de tradução em $caminho"
}

# Deixa a tabela do perfil em PERFIL_LINHAS. No perfil padrão a tabela é vazia
# por construção: identidade não traduz nada.
PERFIL_LINHAS=""
carregar_perfil() {
  local perfil="$1" caminho
  PERFIL_LINHAS=""
  [ "$perfil" != "$PERFIL_PADRAO" ] || return 0
  caminho="$PERFIS_DIR/$perfil.txt"
  [ -f "$caminho" ] || erro "perfil '$perfil' não existe; falta $caminho"
  PERFIL_LINHAS="$(linhas_perfil "$caminho" "$perfil")"
}

# O valor de `--model` de um comando Claude. Tokeniza só para achar a flag: não
# resolve alias nem inventa o modelo default, porque comparar Torre e Cavalo por
# um default presumido compararia uma suposição, não a rota.
modelo_claude() {
  local comando="$1" contexto="$2" i achados=0 valor=""
  local -a tokens
  read -r -a tokens <<<"$comando"
  for ((i = 0; i < ${#tokens[@]}; i++)); do
    [ "${tokens[$i]}" = "--model" ] || continue
    achados=$((achados + 1))
    valor="${tokens[$((i + 1))]:-}"
  done
  [ "$achados" != 0 ] || erro "$contexto: comando Claude sem '--model': $comando"
  [ "$achados" = 1 ] || erro "$contexto: comando com $achados ocorrências de '--model': $comando"
  [ -n "$valor" ] || erro "$contexto: '--model' sem valor: $comando"
  printf '%s\n' "$valor"
}

# Traduz um comando da formação para o motor do perfil. A formação não muda: ela
# é a fonte canônica, e a tradução é camada.
#
# O Cavalo é a única peça cuja linha depende de contexto — ele se cruza com a
# Torre, e num perfil de fornecedor único o que resta cruzar é o modelo. Essa
# dependência fica na tabela versionada, não num `case` aqui dentro.
traduzir_comando() {
  local perfil="$1" formacao="$2" peca="$3" comando="$4" modelo_torre="$5"
  local origem condicao destino alvo achados=0 traduzido=""
  if [ "$perfil" = "$PERFIL_PADRAO" ]; then
    printf '%s\n' "$comando"
    return 0
  fi
  case "$comando" in
    claude|claude\ *) printf '%s\n' "$comando"; return 0 ;;
    codex|codex\ *) ;;
    *) erro "$formacao: '$peca' roda um fornecedor que o perfil '$perfil' não traduz: $comando" ;;
  esac
  if [ "$peca" = Cavalo ]; then
    [ -n "$modelo_torre" ] \
      || erro "$formacao: o perfil '$perfil' escolhe o Cavalo pelo modelo da Torre, e esta formação não tem Torre com '--model' apurável"
    alvo="$modelo_torre"
  else
    alvo='*'
  fi
  while IFS='|' read -r origem condicao destino; do
    [ -n "$origem" ] || continue
    [ "$origem" = "$comando" ] || continue
    [ "$condicao" = "$alvo" ] || continue
    achados=$((achados + 1))
    traduzido="$destino"
  done <<<"$PERFIL_LINHAS"
  if [ "$achados" = 0 ]; then
    echo "$formacao: '$peca' usa um comando Codex sem equivalência no perfil '$perfil'." >&2
    echo "  comando: $comando" >&2
    if [ "$peca" = Cavalo ]; then
      echo "  condição procurada: $alvo — o modelo efetivo da Torre; para o Cavalo, linha com condição '*' não casa" >&2
    else
      echo "  condição procurada: $alvo" >&2
    fi
    erro "acrescente a linha em $PERFIS_DIR/$perfil.txt, ou rode esta formação no perfil '$PERFIL_PADRAO'. A formação não se edita para isso."
  fi
  [ "$achados" = 1 ] \
    || erro "$formacao: '$peca' casa com $achados linhas do perfil '$perfil' para a condição '$alvo': $comando"
  printf '%s\n' "$traduzido"
}

# Deixa em FORMACAO_PREPARADA a formação inteira já traduzida, Peça|Papel|Comando
# por linha. Preparar tudo antes de validar, imprimir ou recrutar é o que impede
# descobrir a falta de equivalência depois do primeiro terminal no canvas.
FORMACAO_PREPARADA=""
preparar_formacao() {
  local arquivo="$1" nome="$2" perfil="$3"
  local linha campos peca papel comando efetivo
  local comando_torre="" modelo_torre=""
  FORMACAO_PREPARADA=""

  # Primeira passagem: o modelo efetivo da Torre, que é o que decide a linha do
  # Cavalo. Apurado antes de traduzir qualquer coisa, porque depender de a Torre
  # vir antes do Cavalo no arquivo acoplaria a rota à ordenação das linhas.
  while IFS='|' read -r peca papel comando; do
    [ "$peca" = Torre ] || continue
    [ -n "$comando" ] || continue
    comando_torre="$comando"
  done < <(linhas_formacao "$arquivo")

  if [ "$perfil" != "$PERFIL_PADRAO" ] && [ -n "$comando_torre" ]; then
    efetivo="$(traduzir_comando "$perfil" "$nome" Torre "$comando_torre" "")"
    modelo_torre="$(modelo_claude "$efetivo" "$nome: Torre")"
  fi

  while IFS= read -r linha; do
    [ -n "$linha" ] || continue
    campos="$(printf '%s' "$linha" | awk -F'|' '{print NF}')"
    IFS='|' read -r peca papel comando <<<"$linha"
    # Linha malformada passa intacta para a validação, que já tem o diagnóstico
    # exato de campos e de campo vazio. Traduzir o que não se sabe ler produziria
    # erro pior, sobre fornecedor, escondendo o defeito real.
    if [ "$campos" != 3 ] || [ -z "$peca" ] || [ -z "$papel" ] || [ -z "$comando" ]; then
      FORMACAO_PREPARADA="$FORMACAO_PREPARADA$linha"$'\n'
      continue
    fi
    efetivo="$(traduzir_comando "$perfil" "$nome" "$peca" "$comando" "$modelo_torre")"
    FORMACAO_PREPARADA="$FORMACAO_PREPARADA$peca|$papel|$efetivo"$'\n'
  done < <(linhas_formacao "$arquivo")
}

# Falha antes de qualquer recrutamento. Formação malformada não pode ser
# descoberta no meio de um --todos, com metade das peças já no canvas.
#
# Valida o conjunto preparado, nunca o arquivo cru: é o comando efetivo que sobe
# o terminal, e validar o comando de origem aprovaria uma rota que ninguém vai
# rodar. Quem chama já rodou `preparar_formacao`.
validar_formacao() {
  local nome="$1" perfil="$2" linha peca papel comando campos
  local comando_torre="" comando_cavalo="" modelo_torre modelo_cavalo
  local total=0

  while IFS= read -r linha; do
    [ -n "$linha" ] || continue
    total=$((total + 1))
    campos="$(printf '%s' "$linha" | awk -F'|' '{print NF}')"
    [ "$campos" = 3 ] || erro "$nome: linha com $campos campos, esperado 3 (Peça|Papel|Comando): $linha"
    IFS='|' read -r peca papel comando <<<"$linha"
    [ -n "$peca" ] || erro "$nome: peça vazia em: $linha"
    [ -n "$papel" ] || erro "$nome: papel vazio em: $linha"
    [ -n "$comando" ] || erro "$nome: comando vazio em: $linha"

    case " ${PECAS[*]} " in
      *" $peca "*) ;;
      *) erro "$nome: '$peca' não é peça conhecida" ;;
    esac

    arquivo_do_papel "$papel" >/dev/null \
      || erro "$nome: papel '$papel' não está em PAPEIS; acrescente o arquivo e a entrada"

    # Sincronizável não é o mesmo que recrutável: o Rei é preset para poder ser
    # versionado e verificado, mas atribuí-lo a uma peça poria a coordenação
    # dentro da formação, com autoridade de escrita que ela não tem.
    case " ${PAPEIS_NAO_RECRUTAVEIS[*]} " in
      *" $papel "*) erro "$nome: '$papel' não é papel recrutável; é o terminal de coordenação" ;;
    esac

    # Teto de effort: xhigh e max exigem aprovação humana explícita e não
    # entram em formação (política de roteamento da skill role-architect).
    case "$comando" in
      *xhigh*|*\"max\"*|*effort\ max*|*effort=max*)
        erro "$nome: '$peca' pede effort acima do teto; xhigh e max exigem aprovação humana explícita" ;;
    esac

    [ "$peca" = Torre ] && comando_torre="$comando"
    [ "$peca" = Cavalo ] && comando_cavalo="$comando"
  done <<<"$FORMACAO_PREPARADA"

  [ "$total" -gt 0 ] || erro "$nome: nenhuma peça declarada"

  # O Cavalo não compartilha o motor da Torre: revisor que roda o motor do
  # construtor herda o ponto cego do construtor.
  #
  # A regra é a mesma; o que muda é o que dá para cruzar. Com dois fornecedores
  # na mesa, cruza-se fornecedor. Num perfil de fornecedor único, fornecedor
  # igual é o dado de partida, e o que resta cruzar é o modelo — mitigação que
  # reduz a correlação sem transformar dois modelos Claude em dois fornecedores,
  # e que está declarada como divergência em equipe/docs/roteamento-multimodelo.md.
  #
  # Formação que legitimamente não tem as duas peças não é obrigada a tê-las: a
  # checagem é sobre o par, não sobre a composição.
  if [ "$perfil" = "$PERFIL_PADRAO" ]; then
    if [ -n "$comando_torre" ] && [ -n "$comando_cavalo" ]; then
      if [ "${comando_torre%% *}" = "${comando_cavalo%% *}" ]; then
        erro "$nome: Cavalo e Torre rodam o mesmo fornecedor (${comando_torre%% *}); a revisão técnica perde independência"
      fi
    fi
    return 0
  fi

  # Tradução que deixasse passar um comando de outro fornecedor entregaria ao
  # Maestri um comando que a máquina alvo não tem. Falha aqui, com o canvas limpo.
  while IFS='|' read -r peca papel comando; do
    [ -n "$peca" ] || continue
    case "$comando" in
      claude|claude\ *) ;;
      *) erro "$nome: o perfil '$perfil' exige comando Claude em toda peça, e '$peca' ficou com: $comando" ;;
    esac
  done <<<"$FORMACAO_PREPARADA"

  if [ -n "$comando_torre" ] && [ -n "$comando_cavalo" ]; then
    modelo_torre="$(modelo_claude "$comando_torre" "$nome: Torre")"
    modelo_cavalo="$(modelo_claude "$comando_cavalo" "$nome: Cavalo")"
    [ "$modelo_torre" != "$modelo_cavalo" ] \
      || erro "$nome: Cavalo e Torre rodam o mesmo --model ($modelo_torre) no perfil '$perfil'; a revisão técnica perde independência"
  fi
}

formacoes() {
  local arquivo nome
  { printf 'FORMAÇÃO\tSUPERFÍCIE\tAPROVAÇÃO\n'
    for arquivo in "$FORMACOES_DIR"/*.txt; do
      nome="$(basename "$arquivo" .txt)"
      printf '%s\t%s\t%s\n' "$nome" \
        "$(campo_formacao "$arquivo" 'Superfície do escritor')" \
        "$(campo_formacao "$arquivo" 'Requer-aprovacao')"
    done
  } | tabela
}

# Imprime a rota efetiva — a que os terminais receberiam —, não a linha crua da
# formação. Por isso valida antes de imprimir: rota que não sobe não deve ser
# impressa como se subisse, e `mostrar` é justamente o comando de conferir.
mostrar() {
  local formacao="${1:-}" arquivo perfil peca papel comando
  [ -n "$formacao" ] || { formacoes; return 0; }
  arquivo="$(caminho_formacao "$formacao")"
  perfil="$(resolver_perfil_ativo)"
  carregar_perfil "$perfil"
  preparar_formacao "$arquivo" "$formacao" "$perfil"
  validar_formacao "$formacao" "$perfil"
  echo "Perfil ativo: $perfil"
  echo
  sed -n 's/^# //p' "$arquivo" | grep -v '^Peça|' | sed 's/^/  /'
  echo
  { printf '\tPEÇA\tPAPEL\tCOMANDO\n'
    while IFS='|' read -r peca papel comando; do
      [ -n "$peca" ] || continue
      printf '%s\t%s\t%s\t%s\n' "$(glifo "$peca")" "$peca" "$papel" "$comando"
    done <<<"$FORMACAO_PREPARADA"
  } | tabela
}

# Uma leitura só por papel, e é ela que responde as duas perguntas de uma vez:
# se o papel existe e qual é o texto do preset ativo. Perguntar em duas
# consultas separadas dava respostas de instantes diferentes — a falha da
# segunda virava "preset divergente", e uma terceira consulta bem-sucedida
# ainda autorizava a gravação por cima.
#
# Distingue "papel não existe" de "não foi possível consultar": confundir os
# dois faz o sincronizar criar por cima de falha de conexão.
#
# Deixa em PAPEL_ESTADO 0 (existe), 1 (não existe) ou 2 (não foi possível
# consultar), e em PAPEL_TEXTO o preset ativo, no estado 0, ou a mensagem do
# CLI, no estado 2. O status do `role show` é capturado direto, antes de
# qualquer filtro: em `$("$CLI" role show ... | tail)` o status é o do `tail`,
# sempre 0, e falha de consulta passava por conteúdo. Não decide nada: abortar
# e seguir são as duas reações corretas, em lugares diferentes, e quem chama é
# que sabe qual é a sua.
#
# `role show` prefixa com "Role: <nome>" e uma linha em branco.
PAPEL_ESTADO=0
PAPEL_TEXTO=""
ler_papel() {
  local papel="$1" saida estado=0 erros arquivo_erros
  arquivo_erros="$(mktemp)"
  saida="$("$CLI" role show "$papel" 2>"$arquivo_erros" </dev/null)" || estado=$?
  erros="$(cat "$arquivo_erros")"
  rm -f "$arquivo_erros"
  if [ "$estado" = 0 ]; then
    PAPEL_ESTADO=0
    PAPEL_TEXTO="$(printf '%s\n' "$saida" | tail -n +3)"
    return 0
  fi
  # Só no caminho de falha os dois canais se juntam: a mensagem do CLI pode
  # sair por qualquer um dos dois, mas misturá-los no caminho de sucesso poria
  # aviso de stderr dentro do texto comparado e fabricaria divergência.
  saida="$saida${saida:+$'\n'}$erros"
  case "$saida" in
    *"not found"*|*"No role"*|*"não encontrado"*|*"Unknown role"*)
      PAPEL_ESTADO=1
      PAPEL_TEXTO="" ;;
    *)
      PAPEL_ESTADO=2
      PAPEL_TEXTO="$saida" ;;
  esac
  return 0
}

# Para quem não pode seguir com resposta ambígua — gravar ou recrutar por cima
# de falha de consulta é pior que parar.
papel_existe() {
  local papel="$1"
  ler_papel "$papel"
  case "$PAPEL_ESTADO" in
    0) return 0 ;;
    1) return 1 ;;
    *) erro "falha ao consultar o papel '$papel': $PAPEL_TEXTO" ;;
  esac
}

# Grava no sentido arquivo → Maestri. O papel é opcional: sem ele o alvo é o
# conjunto todo, com ele o alvo é só aquele papel.
#
# A trava vem antes de qualquer gravação e apura o alvo inteiro. Preset ativo
# divergente é texto que não está no repositório: sobrescrevê-lo é perda que
# `git` não desfaz, e deixou de ser efeito colateral de um comando de rotina
# para exigir --confirmo. Papel ausente não entra na trava: criar não apaga
# nada — mas o alvo cheio ainda aborta inteiro se outro papel divergir, e aí o
# ausente também não é criado. Nomes de papel não contêm quebra de linha, então
# lista, divergentes e existentes cabem em string — array vazio com `set -u` é
# erro neste bash.
sincronizar() {
  local alvo="" confirmo="" arg tem_alvo=0
  local linha papel arquivo prompt lista="" divergentes="" nomes="" existentes=""
  local uso="as formas são: sincronizar [<Papel>] | sincronizar <Papel> --confirmo"

  # As duas ordens são equivalentes: `--confirmo` pode vir antes ou depois do
  # papel. Ler a flag por posição descartava o papel em `sincronizar --confirmo
  # <Papel>`, e um pedido de um papel só virava gravação confirmada dos sete.
  #
  # Argumento presente e vazio é erro, não "todos": `sincronizar "$PAPEL"
  # --confirmo` com a variável não preenchida pede um papel e ampliaria o alvo
  # para o conjunto inteiro sem dizer. Ausente continua sendo o conjunto todo,
  # e é por isso que a distinção se faz pela contagem de argumentos, não por
  # "${1:-}".
  for arg in "$@"; do
    case "$arg" in
      --confirmo)
        [ -z "$confirmo" ] || erro "'--confirmo' repetido; $uso"
        confirmo="--confirmo" ;;
      # Flag errada não vira nome de papel: `--confirm` caía no ramo do papel e
      # o comando respondia listando os sete papéis, sem dizer que o problema
      # era a flag.
      --*)
        erro "opção desconhecida '$arg'; a única flag é --confirmo, na forma: sincronizar \"<Papel>\" --confirmo" ;;
      *)
        [ "$tem_alvo" = 0 ] || erro "dois papéis em um comando só ('$alvo' e '$arg'); $uso"
        [ -n "$arg" ] || erro "papel vazio; para gravar todos os papéis, omita o argumento. $uso"
        alvo="$arg"
        tem_alvo=1 ;;
    esac
  done

  # Sobrescrever preset ativo divergente é sempre um papel por vez, por decisão
  # do usuário: `--confirmo` sem papel autorizaria de uma vez a perda dos sete
  # presets, e o alvo cheio é justamente onde ninguém comparou os sete lados
  # antes de decidir. Erro antes de qualquer consulta ou gravação.
  if [ -n "$confirmo" ] && [ "$tem_alvo" = 0 ]; then
    echo "'--confirmo' autoriza sobrescrever preset ativo divergente, e isso é um papel por vez." >&2
    erro "diga o papel: sincronizar \"<Papel>\" --confirmo. $uso"
  fi

  for linha in "${PAPEIS[@]}"; do
    papel="${linha%%|*}"
    nomes="$nomes; $papel"
    if [ -z "$alvo" ] || [ "$papel" = "$alvo" ]; then
      lista="$lista$papel"$'\n'
    fi
  done
  [ -n "$lista" ] \
    || erro "papel '$alvo' não está em PAPEIS. Use o nome como 'verificar' o imprime, entre aspas: ${nomes#; }"

  # Uma consulta por papel, e é esta. O que ela apurar sobre existência é o que
  # o laço de gravação usa: reconsultar lá abriria uma segunda resposta para a
  # mesma pergunta, num instante em que a primeira gravação já teria acontecido.
  #
  # Falha de consulta aborta aqui, com --confirmo ou sem ele: --confirmo diz
  # qual lado preservar quando os dois lados são conhecidos, e não sabe nada
  # sobre um lado que não pôde ser lido.
  while IFS= read -r papel; do
    [ -n "$papel" ] || continue
    arquivo="$(arquivo_do_papel "$papel")"
    ler_papel "$papel"
    if [ "$PAPEL_ESTADO" = 2 ]; then
      echo "falha ao consultar o papel '$papel': $PAPEL_TEXTO" >&2
      echo "nada foi gravado, nem os papéis em dia: sem apurar o preset ativo não há como saber o que a gravação sobrescreveria." >&2
      echo "repita o comando depois de restabelecer a conexão com o Maestri." >&2
      erro "'--confirmo' não contorna falha de consulta: ele diz qual lado preservar, e aqui um dos lados não foi lido."
    fi
    [ "$PAPEL_ESTADO" = 0 ] || continue
    existentes="$existentes$papel"$'\n'
    if [ "$PAPEL_TEXTO" != "$(cat "$arquivo")" ]; then
      divergentes="$divergentes$papel"$'\n'
    fi
  done <<<"$lista"

  if [ -n "$divergentes" ] && [ "$confirmo" != "--confirmo" ]; then
    while IFS= read -r papel; do
      [ -n "$papel" ] || continue
      echo "DIVERGENTE: $papel — o preset ativo não é $(arquivo_do_papel "$papel")" >&2
    done <<<"$divergentes"
    echo "a gravação tem um sentido só, arquivo → Maestri, e o preset ativo não é versionado: o que ela sobrescrever não volta por 'git'." >&2
    echo "compare os dois lados antes de decidir: maestri role show \"<Papel>\" | tail -n +3" >&2
    erro "nada foi gravado, nem os papéis em dia. Repita com --confirmo se o lado a preservar for o arquivo."
  fi

  # `</dev/null` em cada chamada ao CLI: o laço prende o stdin ao here-string, e
  # comando que leia stdin drena a lista dos papéis seguintes e sai com 0 —
  # gravava um papel e declarava sucesso pelos sete.
  while IFS= read -r papel; do
    [ -n "$papel" ] || continue
    arquivo="$(arquivo_do_papel "$papel")"
    prompt="$(cat "$arquivo")"
    case $'\n'"$existentes" in
      *$'\n'"$papel"$'\n'*)
        "$CLI" role write "$papel" "$prompt" >/dev/null </dev/null
        echo "atualizado: $papel" ;;
      *)
        "$CLI" role create "$papel" "$prompt" --scope current >/dev/null </dev/null
        echo "criado: $papel" ;;
    esac
  done <<<"$lista"
}

# Fecha o laço que o README promete: o papel em vigor é o que está no arquivo.
# Editar o prompt pela interface não aparece em `git status`, então sem esta
# checagem a divergência é invisível.
verificar() {
  local linha papel arquivo motivos=""
  local divergiu=0 incompleto=0 arquivo_ausente=0 ausente_no_maestri=0
  for linha in "${PAPEIS[@]}"; do
    papel="${linha%%|*}"
    # O caminho vem de `arquivo_do_papel`, a mesma resolução que o resto do
    # script usa. Montá-lo por slug aqui fazia arquivo versionado ausente cair
    # no `cat` e virar "DIVERGENTE" com a mensagem do `cat` colada na frente,
    # como se o preset ativo é que estivesse errado.
    if ! arquivo="$(arquivo_do_papel "$papel" 2>&1)"; then
      echo "ARQUIVO AUSENTE: $papel — $arquivo"
      arquivo_ausente=1
      continue
    fi
    ler_papel "$papel"
    if [ "$PAPEL_ESTADO" = 1 ]; then
      echo "ausente no Maestri: $papel — rode 'sincronizar \"$papel\"'"
      ausente_no_maestri=1
      continue
    fi
    # Falha de consulta não interrompe o laço. Lista truncada tem a mesma
    # aparência de lista completa: os papéis que ficariam de fora não seriam
    # apurados e ninguém veria a falta. Aqui a falha vira linha e a apuração
    # segue até o fim.
    if [ "$PAPEL_ESTADO" = 2 ]; then
      echo "FALHA AO CONSULTAR: $papel — $PAPEL_TEXTO"
      incompleto=1
      continue
    fi
    if [ "$PAPEL_TEXTO" = "$(cat "$arquivo")" ]; then
      echo "em dia: $papel"
    else
      echo "DIVERGENTE: $papel — o preset ativo não é $arquivo"
      divergiu=1
    fi
  done
  # As quatro condições são independentes e o resumo nomeia cada uma que tiver
  # ocorrido, numa linha só. Resumo de uma condição só escondia as outras atrás
  # dela: divergência apurada sumia sob "apuração incompleta", e arquivo
  # versionado ausente saía como divergência entre arquivo e preset, que é
  # outra coisa.
  [ "$divergiu" = 0 ] \
    || motivos="$motivos; há divergência entre equipe/papeis/ e os presets ativos"
  [ "$incompleto" = 0 ] \
    || motivos="$motivos; apuração incompleta: houve papel que não pôde ser consultado, e o estado dele não foi apurado"
  [ "$arquivo_ausente" = 0 ] \
    || motivos="$motivos; há papel cujo arquivo versionado em equipe/papeis/ não existe"
  [ "$ausente_no_maestri" = 0 ] \
    || motivos="$motivos; há papel ausente no Maestri: rode 'sincronizar \"<Papel>\"'"
  [ -z "$motivos" ] || erro "${motivos#; }"
}

recrutar() {
  local peca="$1" papel="$2" comando="$3"
  papel_existe "$papel" \
    || erro "o papel '$papel' não existe no Maestri; rode 'sincronizar \"$papel\"' antes de subir"
  echo "recrutando $(glifo "$peca") $peca ($papel)"
  # `</dev/null` porque quem chama está dentro de um laço que lê a formação pelo
  # stdin: comando que leia stdin engoliria as peças seguintes.
  "$CLI" recruit "$peca" --role "$papel" --command "$comando" --dir "$RAIZ" </dev/null
}

subir() {
  local formacao="${1:-}" alvo="${2:-}" confirmo="${3:-}"
  local arquivo perfil requer peca papel comando achou=0
  [ -n "$formacao" ] || erro "diga a formação; veja 'formacoes'"
  [ -n "$alvo" ] || erro "diga qual peça subir, ou --todos"
  arquivo="$(caminho_formacao "$formacao")"
  # A formação inteira é traduzida e validada aqui, de uma vez. Traduzir dentro
  # do laço de recrutamento descobriria comando sem equivalência depois do
  # primeiro terminal já no canvas — que é o defeito que a validação existe para
  # evitar, só que com o perfil em vez do arquivo.
  perfil="$(resolver_perfil_ativo)"
  carregar_perfil "$perfil"
  preparar_formacao "$arquivo" "$formacao" "$perfil"
  validar_formacao "$formacao" "$perfil"

  # A fronteira escrita no cabeçalho da formação vira portão, não comentário.
  requer="$(campo_formacao "$arquivo" 'Requer-aprovacao')"
  if [ -n "$requer" ] && [ "$confirmo" != "--confirmo" ]; then
    echo "formação '$formacao' exige aprovação explícita antes de subir." >&2
    echo "motivo: $requer" >&2
    erro "repita o comando com --confirmo se o usuário autorizou."
  fi

  # Confere que a peça pedida existe na formação antes de recrutar qualquer uma:
  # --todos não pode falhar no meio e deixar o canvas pela metade.
  if [ "$alvo" != "--todos" ]; then
    while IFS='|' read -r peca papel comando; do
      [ "$alvo" = "$peca" ] && achou=1
    done <<<"$FORMACAO_PREPARADA"
    [ "$achou" = 1 ] || erro "'$alvo' não está na formação $formacao"
  fi

  while IFS='|' read -r peca papel comando; do
    [ -n "$peca" ] || continue
    if [ "$alvo" = "--todos" ] || [ "$alvo" = "$peca" ]; then
      recrutar "$peca" "$papel" "$comando"
    fi
  done <<<"$FORMACAO_PREPARADA"
}

# Construir e corrigir não são a mesma etapa. Na correção o problema já vem
# nomeado e triado pelo Rei, e o próprio achado é o critério de pronto — então
# a Torre volta com o effort rebaixado. O modelo é o da formação: derrubar a
# Torre de `fable` numa formação de linguagem trocaria a etapa, não o effort.
correcao() {
  local formacao="${1:-}" arquivo perfil peca papel comando novo
  [ -n "$formacao" ] || erro "diga a formação"
  arquivo="$(caminho_formacao "$formacao")"
  perfil="$(resolver_perfil_ativo)"
  carregar_perfil "$perfil"
  preparar_formacao "$arquivo" "$formacao" "$perfil"
  validar_formacao "$formacao" "$perfil"
  # O effort baixa sobre o comando já traduzido: é ele que sobe o terminal.
  # As duas substituições continuam as duas, uma por fornecedor — a Torre de uma
  # formação pode ser Claude no perfil padrão e o perfil não a toca.
  while IFS='|' read -r peca papel comando; do
    if [ "$peca" = Torre ]; then
      novo="${comando/--effort high/--effort medium}"
      novo="${novo/model_reasoning_effort=\"high\"/model_reasoning_effort=\"medium\"}"
      [ "$novo" != "$comando" ] || erro "a Torre de $formacao já não está em effort alto: $comando"
      echo "trocando Torre para effort de correção"
      echo "  antes: $comando"
      echo "  agora: $novo"
      "$CLI" recruit "Torre" --role "$papel" --command "$novo" --dir "$RAIZ" --replace "Torre" </dev/null
      return 0
    fi
  done <<<"$FORMACAO_PREPARADA"
  erro "formação $formacao não tem Torre"
}

dispensar() {
  local alvo="${1:-}" peca saida estado
  [ -n "$alvo" ] || erro "diga qual peça dispensar, ou --todos"
  if [ "$alvo" != "--todos" ]; then
    "$CLI" dismiss "$alvo"
    return 0
  fi
  # Só o erro inequívoco de peça ausente é ignorado. Falha de conexão ou de
  # autorização precisa aparecer: senão "canvas limpo" e "não consegui limpar"
  # ficam indistinguíveis, e a peça continua ativa.
  for peca in "${PECAS[@]}"; do
    estado=0
    saida="$("$CLI" dismiss "$peca" 2>&1)" || estado=$?
    if [ "$estado" = 0 ]; then
      echo "dispensada: $peca"
      continue
    fi
    case "$saida" in
      *"not found"*|*"No agent"*|*"não encontrado"*|*"Unknown"*)
        echo "$peca já não estava no canvas" ;;
      *) erro "falha ao dispensar $peca: $saida" ;;
    esac
  done
}

case "${1:-formacoes}" in
  formacoes) formacoes ;;
  mostrar) mostrar "${2:-}" ;;
  # Repassa os argumentos como vieram: "${2:-}" "${3:-}" fabricava dois
  # argumentos sempre, e apagava a diferença entre papel ausente e papel vazio.
  sincronizar) sincronizar "${@:2}" ;;
  verificar) verificar ;;
  subir) subir "${2:-}" "${3:-}" "${4:-}" ;;
  correcao) correcao "${2:-}" ;;
  dispensar) dispensar "${2:-}" ;;
  *) erro "uso: $0 formacoes | mostrar <formacao> | sincronizar [<Papel>] | sincronizar <Papel> --confirmo | verificar | subir <formacao> <Peça>|--todos [--confirmo] | correcao <formacao> | dispensar <Peça>|--todos" ;;
esac
