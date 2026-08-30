// Utilitários de Cálculo Retroativo de Datas e Agendamento Inteligente da Agenda

/**
 * Calcula o prazo do Save the Date em semanas antes da Festa (Padrão: 6 semanas)
 */
export function calculateSaveTheDateDeadline(partyDateStr, weeks = 6) {
  if (!partyDateStr) return '';
  const date = new Date(partyDateStr + 'T00:00:00');
  date.setDate(date.getDate() - (weeks * 7));
  return date.toISOString().split('T')[0];
}

/**
 * Calcula o prazo do Convite em semanas antes da Festa (Padrão: 3 semanas)
 */
export function calculateInvitationDeadline(partyDateStr, weeks = 3) {
  if (!partyDateStr) return '';
  const date = new Date(partyDateStr + 'T00:00:00');
  date.setDate(date.getDate() - (weeks * 7));
  return date.toISOString().split('T')[0];
}

/**
 * Formata data no padrão brasileiro (DD/MM/AAAA)
 */
export function formatDateBR(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Verifica diferença em dias em relação à data de referência do sistema
 */
export function getDaysDiffFromToday(targetDateStr) {
  const today = new Date('2026-09-01T00:00:00'); // Data de referência
  const target = new Date(targetDateStr + 'T00:00:00');
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Converte horário "HH:MM" em minutos a partir do início do dia (ex: "08:00" -> 480)
 */
export function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours * 60) + minutes;
}

/**
 * Converte minutos em formato "HH:MM" (ex: 510 -> "08:30")
 */
export function minutesToTime(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Gera o cronograma diário de trabalho com priorização matinal (08h) e pausas de 15m
 */
export function generateDailySchedule(projects, settings, targetDateStr = '2026-09-01') {
  const config = settings || {
    morningStart: '08:00',
    morningEnd: '12:00',
    afternoonStart: '13:00',
    afternoonEnd: '17:00',
    breakMinutes: 15,
    saveTheDateHours: 5,
    invitationHours: 10,
    partyHours: 20
  };

  // Coleta todas as tarefas/entregáveis associados a projetos ativos
  const rawTasks = [];

  projects.forEach(project => {
    // 1. Save the Date (5h)
    rawTasks.push({
      id: `${project.id}-task-std`,
      projectId: project.id,
      projectName: project.name,
      client: project.client,
      type: 'SAVE_THE_DATE',
      title: `Produção Save the Date (${config.saveTheDateHours || 5}h required)`,
      deliverableName: 'Save the Date',
      durationHours: config.saveTheDateHours || 5,
      deadline: project.saveTheDateDeadline,
      partyDate: project.partyDate,
      collisionRisk: project.collisionRisk,
      isCritical: project.collisionRisk || getDaysDiffFromToday(project.saveTheDateDeadline) <= 15,
      stage: project.stage
    });

    // 2. Convite (10h)
    rawTasks.push({
      id: `${project.id}-task-inv`,
      projectId: project.id,
      projectName: project.name,
      client: project.client,
      type: 'INVITATION',
      title: `Produção Convite Oficial (${config.invitationHours || 10}h required)`,
      deliverableName: 'Convite Oficial',
      durationHours: config.invitationHours || 10,
      deadline: project.invitationDeadline,
      partyDate: project.partyDate,
      collisionRisk: project.collisionRisk,
      isCritical: project.daysWaitingClient > 2 || getDaysDiffFromToday(project.invitationDeadline) <= 10,
      stage: project.stage
    });
  });

  // Ordenação com PRIORIDADE MATINAL:
  // Tarefas críticas/de alto risco entram PRIMEIRO na agenda da manhã (08:00)
  rawTasks.sort((a, b) => {
    if (a.isCritical && !b.isCritical) return -1;
    if (!a.isCritical && b.isCritical) return 1;
    return getDaysDiffFromToday(a.deadline) - getDaysDiffFromToday(b.deadline);
  });

  // Janelas de trabalho do dia
  const morningStartMin = timeToMinutes(config.morningStart || '08:00');
  const morningEndMin = timeToMinutes(config.morningEnd || '12:00');
  const afternoonStartMin = timeToMinutes(config.afternoonStart || '13:00');
  const afternoonEndMin = timeToMinutes(config.afternoonEnd || '17:00');
  const breakMin = config.breakMinutes !== undefined ? config.breakMinutes : 15;

  const scheduledSlots = [];
  let currentPointer = morningStartMin;

  rawTasks.slice(0, 5).forEach((task) => {
    // Bloco de foco de 1.5h a 2.5h por sessão
    const sessionDurationMin = Math.min(task.durationHours * 60, 120);

    // Ajusta se colidir com o almoço (12:00 - 13:00)
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

    // Avança ponteiro com a PAUSA DE 15 MINUTOS configurada
    currentPointer = endMin + breakMin;

    // Se a pausa empurrar para o horário de almoço, avança para o início da tarde (13:00)
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
