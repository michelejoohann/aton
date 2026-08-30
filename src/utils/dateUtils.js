/**
 * Módulo de Utilitários de Data, Cálculos Retroativos e Agendamento Inteligente
 * @module dateUtils
 */

/**
 * Data de referência padrão do sistema para comparações em ambiente estático/demo.
 * @type {string}
 */
export const DEFAULT_SYSTEM_TODAY = '2026-09-01';

/**
 * Converte com segurança qualquer entrada em objeto Date válido.
 * @param {string|Date} input
 * @returns {Date|null}
 */
export function safeParseDate(input) {
  if (!input) return null;
  if (input instanceof Date && !isNaN(input.getTime())) return input;
  
  if (typeof input === 'string') {
    const cleanStr = input.includes('T') ? input : `${input}T00:00:00`;
    const parsed = new Date(cleanStr);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

/**
 * Formata uma string no formato ISO (AAAA-MM-DD) para o padrão brasileiro (DD/MM/AAAA).
 * @param {string} dateStr - Data no formato YYYY-MM-DD.
 * @returns {string} Data formatada ou string vazia em caso de valor inválido.
 */
export function formatDateBR(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const clean = dateStr.split('T')[0];
  const parts = clean.split('-');
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
}

/**
 * Calcula o prazo retroativo do Save the Date em semanas antes da Festa.
 * @param {string} partyDateStr - Data da Festa (YYYY-MM-DD).
 * @param {number} [weeks=6] - Quantidade de semanas de antecedência.
 * @returns {string} Data limite formatada (YYYY-MM-DD).
 */
export function calculateSaveTheDateDeadline(partyDateStr, weeks = 6) {
  const date = safeParseDate(partyDateStr);
  if (!date) return '';
  date.setDate(date.getDate() - (Number(weeks) * 7));
  return date.toISOString().split('T')[0];
}

/**
 * Calcula o prazo retroativo do Convite em semanas antes da Festa.
 * @param {string} partyDateStr - Data da Festa (YYYY-MM-DD).
 * @param {number} [weeks=3] - Quantidade de semanas de antecedência.
 * @returns {string} Data limite formatada (YYYY-MM-DD).
 */
export function calculateInvitationDeadline(partyDateStr, weeks = 3) {
  const date = safeParseDate(partyDateStr);
  if (!date) return '';
  date.setDate(date.getDate() - (Number(weeks) * 7));
  return date.toISOString().split('T')[0];
}

/**
 * Calcula o prazo retroativo da Retrospectiva em dias antes da Festa.
 * @param {string} partyDateStr - Data da Festa (YYYY-MM-DD).
 * @param {number} [daysBefore=1] - Dias de antecedência.
 * @returns {string} Data limite formatada (YYYY-MM-DD).
 */
export function calculateRetrospectiveDeadline(partyDateStr, daysBefore = 1) {
  const date = safeParseDate(partyDateStr);
  if (!date) return '';
  date.setDate(date.getDate() - Number(daysBefore));
  return date.toISOString().split('T')[0];
}

/**
 * Retorna a diferença em dias inteiros entre a data informada e a data base do sistema.
 * @param {string} targetDateStr - Data destino (YYYY-MM-DD).
 * @param {string} [referenceDateStr=DEFAULT_SYSTEM_TODAY] - Data base de comparação.
 * @returns {number} Diferença em dias.
 */
export function getDaysDiffFromToday(targetDateStr, referenceDateStr = DEFAULT_SYSTEM_TODAY) {
  const target = safeParseDate(targetDateStr);
  const reference = safeParseDate(referenceDateStr);
  
  if (!target || !reference) return 0;
  
  const diffMs = target.getTime() - reference.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Converte horário "HH:MM" em minutos desde o início do dia (ex: "08:30" -> 510).
 * @param {string} timeStr - Horário no formato "HH:MM".
 * @returns {number} Minutos totais.
 */
export function timeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const [hStr, mStr] = timeStr.split(':');
  const hours = parseInt(hStr, 10) || 0;
  const minutes = parseInt(mStr, 10) || 0;
  return (hours * 60) + minutes;
}

/**
 * Converte minutos a partir da meia-noite em formato "HH:MM" (ex: 510 -> "08:30").
 * @param {number} totalMinutes
 * @returns {string}
 */
export function minutesToTime(totalMinutes) {
  if (typeof totalMinutes !== 'number' || isNaN(totalMinutes)) return '00:00';
  const clamped = Math.max(0, Math.floor(totalMinutes));
  const h = Math.floor(clamped / 60) % 24;
  const m = clamped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Definições e especificações das mini-tarefas fracionadas por tipo de entregável.
 */
const DELIVERABLE_MINI_TASK_TEMPLATES = {
  SAVE_THE_DATE: [
    { stepName: 'Sessão 1/3: Concept & Moodboard', subTaskTitle: 'Coleta de referências, conceito visual e paleta de cores', defaultHours: 1.5 },
    { stepName: 'Sessão 2/3: Design Layout & Tipografia', subTaskTitle: 'Composição gráfica do Save the Date e vetorização', defaultHours: 2.0 },
    { stepName: 'Sessão 3/3: Fechamento & Disparo', subTaskTitle: 'Ajustes de contraste, exportação em alta e disparo digital', defaultHours: 1.5 },
  ],
  INVITATION: [
    { stepName: 'Sessão 1/4: Ilustração & Monograma', subTaskTitle: 'Vetorização do brasão do casal e arte do envelope', defaultHours: 2.5 },
    { stepName: 'Sessão 2/4: Diagramação & Faca Especial', subTaskTitle: 'Mapeamento de faca gráfica, sangria e prova de cor', defaultHours: 2.5 },
    { stepName: 'Sessão 3/4: Caligrafia & Produção Gráfica', subTaskTitle: 'Caligrafia dos nomes de convidados e envio de amostra', defaultHours: 2.5 },
    { stepName: 'Sessão 4/4: Montagem & Lacre de Cera', subTaskTitle: 'Acabamento final, aplicação de lacre e conferência de lote', defaultHours: 2.5 },
  ],
  RETROSPECTIVE: [
    { stepName: 'Sessão 1/4: Triagem de Assets & Fotos', subTaskTitle: 'Organização do acervo enviado pelo cliente e tratamento de imagens', defaultHours: 2.0 },
    { stepName: 'Sessão 2/4: Edição de Linha do Tempo & Áudio', subTaskTitle: 'Corte da trilha sonora, decupagem de vídeo e sincronismo', defaultHours: 2.0 },
    { stepName: 'Sessão 3/4: Efeitos, Títulos & Vinhetas', subTaskTitle: 'Animações de texto, transições e vinheta de encerramento', defaultHours: 2.0 },
    { stepName: 'Sessão 4/4: Renderização 4K & Teste Projeção', subTaskTitle: 'Render em alta qualidade e checklist de reprodução', defaultHours: 2.0 },
  ],
  PARTY: [
    { stepName: 'Sessão 1/3: Menus & Papelaria de Mesa', subTaskTitle: 'Diagramação de menucards e marcadores de lugar', defaultHours: 2.0 },
    { stepName: 'Sessão 2/3: Placas de Sinalização & Welcome', subTaskTitle: 'Design do painel de entrada e sinalização da cerimônia', defaultHours: 2.0 },
    { stepName: 'Sessão 3/3: Kits de Banheiro & Pista', subTaskTitle: 'Identidade dos kits de amenities e havaianas', defaultHours: 2.0 },
  ]
};

/**
 * Retorna as mini-tarefas fracionadas de um entregável.
 * @param {string} deliverableType - Tipo do entregável ('SAVE_THE_DATE' | 'INVITATION' | 'RETROSPECTIVE' | 'PARTY').
 * @param {number} totalHours - Total de horas configurado.
 * @param {string} projectName - Nome do projeto.
 * @param {string} clientName - Nome do cliente.
 * @param {string} deadlineStr - Data limite.
 * @param {boolean} isCritical - Flag de prioridade/criticidade.
 * @returns {Array<Object>} Lista de mini-tarefas.
 */
export function getDeliverableMiniTasks(deliverableType, totalHours, projectName, clientName, deadlineStr, isCritical) {
  const templates = DELIVERABLE_MINI_TASK_TEMPLATES[deliverableType] || DELIVERABLE_MINI_TASK_TEMPLATES.PARTY;
  
  return templates.map(tmpl => ({
    stepName: tmpl.stepName,
    subTaskTitle: tmpl.subTaskTitle,
    durationHours: tmpl.defaultHours,
    isCritical
  }));
}

/**
 * Gera a agenda de trabalho diária distribuindo as mini-tarefas no expediente diário (08h-12h e 13h-17h).
 * @param {Array<Object>} projects - Lista de projetos do sistema.
 * @param {Object} settings - Configurações do usuário principal.
 * @param {string} [targetDateStr=DEFAULT_SYSTEM_TODAY] - Data alvo da visualização.
 * @returns {Object} Dados da agenda formatados com horários inicial/final e intervalos.
 */
export function generateDailySchedule(projects = [], settings, targetDateStr = DEFAULT_SYSTEM_TODAY) {
  const config = {
    morningStart: settings?.morningStart || '08:00',
    morningEnd: settings?.morningEnd || '12:00',
    afternoonStart: settings?.afternoonStart || '13:00',
    afternoonEnd: settings?.afternoonEnd || '17:00',
    breakMinutes: settings?.breakMinutes !== undefined ? settings.breakMinutes : 15,
    saveTheDateHours: settings?.saveTheDateHours || 5,
    invitationHours: settings?.invitationHours || 10,
    retrospectiveHours: settings?.retrospectiveHours || 8,
    partyHours: settings?.partyHours || 20
  };

  const allMiniTasks = [];

  projects.forEach(project => {
    if (!project) return;

    const isStdCritical = Boolean(project.collisionRisk || getDaysDiffFromToday(project.saveTheDateDeadline) <= 15);
    const isInvCritical = Boolean(project.daysWaitingClient > 2 || getDaysDiffFromToday(project.invitationDeadline) <= 10);
    const isRetroCritical = Boolean(!project.assetsReceived || getDaysDiffFromToday(project.retrospectiveDeadline || project.partyDate) <= 3);

    // 1. Save the Date
    if (project.saveTheDateDeadline) {
      const stdSubTasks = getDeliverableMiniTasks(
        'SAVE_THE_DATE',
        config.saveTheDateHours,
        project.name,
        project.client,
        project.saveTheDateDeadline,
        isStdCritical
      );

      const daysToStd = getDaysDiffFromToday(project.saveTheDateDeadline);
      const stdPriority = isStdCritical || daysToStd <= 7 ? 'HIGH' : daysToStd <= 21 ? 'MEDIUM' : 'LOW';

      stdSubTasks.forEach((sub, idx) => {
        allMiniTasks.push({
          id: `${project.id}-std-sub-${idx}`,
          projectId: project.id,
          projectName: project.name,
          client: project.client,
          type: 'SAVE_THE_DATE',
          deliverableName: 'Save the Date',
          stepName: sub.stepName,
          subTaskTitle: sub.subTaskTitle,
          durationHours: sub.durationHours,
          deadline: project.saveTheDateDeadline,
          isCritical: sub.isCritical,
          priority: stdPriority,
          partyDate: project.partyDate
        });
      });
    }

    // 2. Convite Oficial
    if (project.invitationDeadline) {
      const invSubTasks = getDeliverableMiniTasks(
        'INVITATION',
        config.invitationHours,
        project.name,
        project.client,
        project.invitationDeadline,
        isInvCritical
      );

      const daysToInv = getDaysDiffFromToday(project.invitationDeadline);
      const invPriority = isInvCritical || daysToInv <= 7 ? 'HIGH' : daysToInv <= 21 ? 'MEDIUM' : 'LOW';

      invSubTasks.forEach((sub, idx) => {
        allMiniTasks.push({
          id: `${project.id}-inv-sub-${idx}`,
          projectId: project.id,
          projectName: project.name,
          client: project.client,
          type: 'INVITATION',
          deliverableName: 'Convite Oficial',
          stepName: sub.stepName,
          subTaskTitle: sub.subTaskTitle,
          durationHours: sub.durationHours,
          deadline: project.invitationDeadline,
          isCritical: sub.isCritical,
          priority: invPriority,
          partyDate: project.partyDate
        });
      });
    }

    // 3. Retrospectiva
    if (project.hasRetrospective || project.retrospectiveDeadline) {
      const retroSubTasks = getDeliverableMiniTasks(
        'RETROSPECTIVE',
        config.retrospectiveHours,
        project.name,
        project.client,
        project.retrospectiveDeadline || project.partyDate,
        isRetroCritical
      );

      const daysToRetro = getDaysDiffFromToday(project.retrospectiveDeadline || project.partyDate);
      const retroPriority = isRetroCritical || daysToRetro <= 7 ? 'HIGH' : 'MEDIUM';

      retroSubTasks.forEach((sub, idx) => {
        allMiniTasks.push({
          id: `${project.id}-retro-sub-${idx}`,
          projectId: project.id,
          projectName: project.name,
          client: project.client,
          type: 'RETROSPECTIVE',
          deliverableName: 'Retrospectiva (Vídeo/Fotos)',
          stepName: sub.stepName,
          subTaskTitle: sub.subTaskTitle,
          durationHours: sub.durationHours,
          deadline: project.retrospectiveDeadline || project.partyDate,
          isCritical: sub.isCritical,
          priority: retroPriority,
          partyDate: project.partyDate,
          assetsReceived: Boolean(project.assetsReceived)
        });
      });
    }

    // 4. Entregáveis Extras Homologados do Contrato (ex: Site RSVP, Havaianas, Painel Neon)
    if (project.deliverables && Array.isArray(project.deliverables)) {
      const extraItems = project.deliverables.filter(d => d.isExtra && !d.completed);
      extraItems.forEach((extra, idx) => {
        allMiniTasks.push({
          id: `${project.id}-extra-sub-${idx}`,
          projectId: project.id,
          projectName: project.name,
          client: project.client,
          type: 'EXTRA',
          deliverableName: extra.title,
          stepName: `Sessão Extra: ${extra.title}`,
          subTaskTitle: extra.description || extra.rule || 'Produção de entregável contratado em anexo',
          durationHours: Math.min(2.5, extra.requiredHours || 2.0),
          deadline: extra.deadline || project.saveTheDateDeadline || project.partyDate,
          isCritical: true,
          priority: 'HIGH', // Entregáveis extras entram com prioridade alta
          partyDate: project.partyDate
        });
      });
    }

    // 5. Briefing e Kickoff para novos contratos
    if (project.stage === 'briefing') {
      allMiniTasks.push({
        id: `${project.id}-briefing-sub`,
        projectId: project.id,
        projectName: project.name,
        client: project.client,
        type: 'BRIEFING',
        deliverableName: 'Briefing & Conceito Inicial',
        stepName: 'Sessão 1/1: Alinhamento de Identidade',
        subTaskTitle: 'Coleta de referências do contrato e setup dos prazos retroativos',
        durationHours: 2.0,
        deadline: project.contractDate || DEFAULT_SYSTEM_TODAY,
        isCritical: true,
        priority: 'HIGH',
        partyDate: project.partyDate
      });
    }
  });

  // Ordenação com prioridade (HIGH > MEDIUM > LOW) e proximidade de prazo
  const priorityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
  allMiniTasks.sort((a, b) => {
    // 1. Prioridade máxima absoluta para tarefas que vencem hoje (01/09/2026)
    const aIsToday = a.deadline === targetDateStr || a.deadline === DEFAULT_SYSTEM_TODAY;
    const bIsToday = b.deadline === targetDateStr || b.deadline === DEFAULT_SYSTEM_TODAY;
    if (aIsToday && !bIsToday) return -1;
    if (!aIsToday && bIsToday) return 1;

    // 2. Nível de prioridade (Alta > Média > Baixa)
    const weightDiff = (priorityWeight[b.priority] || 1) - (priorityWeight[a.priority] || 1);
    if (weightDiff !== 0) return weightDiff;

    // 3. Proximidade da data limite
    return getDaysDiffFromToday(a.deadline, targetDateStr) - getDaysDiffFromToday(b.deadline, targetDateStr);
  });

  const morningStartMin = timeToMinutes(config.morningStart);
  const morningEndMin = timeToMinutes(config.morningEnd);
  const afternoonStartMin = timeToMinutes(config.afternoonStart);
  const afternoonEndMin = timeToMinutes(config.afternoonEnd);
  const breakMin = config.breakMinutes;

  const scheduledSlots = [];
  let currentPointer = morningStartMin;

  allMiniTasks.forEach(task => {
    const sessionDurationMin = Math.round(task.durationHours * 60);

    if (currentPointer + sessionDurationMin > morningEndMin && currentPointer < afternoonStartMin) {
      currentPointer = afternoonStartMin;
    }

    if (currentPointer >= afternoonEndMin) return;

    const startStr = minutesToTime(currentPointer);
    const endMin = Math.min(currentPointer + sessionDurationMin, afternoonEndMin);
    const endStr = minutesToTime(endMin);

    scheduledSlots.push({
      ...task,
      startTime: startStr,
      endTime: endStr,
      durationMinutes: endMin - currentPointer,
      isMorningPriority: currentPointer < morningEndMin,
    });

    currentPointer = endMin + breakMin;

    if (currentPointer >= morningEndMin && currentPointer < afternoonStartMin) {
      currentPointer = afternoonStartMin;
    }
  });

  return {
    date: targetDateStr,
    schedule: scheduledSlots,
    workHoursTotal: 8,
    breakMinutesConfig: breakMin
  };
}
