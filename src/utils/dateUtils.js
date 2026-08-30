// Utilitários de Cálculo Retroativo de Datas e Agendamento Inteligente de Mini-Tarefas

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
 * Calcula o prazo da Retrospectiva em dias antes da Festa (Padrão: 1 dia antes)
 */
export function calculateRetrospectiveDeadline(partyDateStr, daysBefore = 1) {
  if (!partyDateStr) return '';
  const date = new Date(partyDateStr + 'T00:00:00');
  date.setDate(date.getDate() - daysBefore);
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
 * Decompõe entregáveis inteiros em MINI-TAREFAS diluídas com carga horária fracionada
 */
export function getDeliverableMiniTasks(deliverableType, totalHours, projectName, clientName, deadlineStr, isCritical) {
  if (deliverableType === 'SAVE_THE_DATE') {
    return [
      {
        stepName: 'Sessão 1/3: Concept & Moodboard',
        subTaskTitle: 'Coleta de referências, conceito visual e paleta de cores',
        durationHours: 1.5,
        isCritical
      },
      {
        stepName: 'Sessão 2/3: Design Layout & Tipografia',
        subTaskTitle: 'Composição gráfica do Save the Date e vetorização',
        durationHours: 2.0,
        isCritical
      },
      {
        stepName: 'Sessão 3/3: Fechamento & Disparo',
        subTaskTitle: 'Ajustes de contraste, exportação em alta e disparo digital',
        durationHours: 1.5,
        isCritical
      }
    ];
  }

  if (deliverableType === 'INVITATION') {
    return [
      {
        stepName: 'Sessão 1/4: Ilustração & Monograma',
        subTaskTitle: 'Vetorização do brasão do casal e arte do envelope',
        durationHours: 2.5,
        isCritical
      },
      {
        stepName: 'Sessão 2/4: Diagramação & Faca Especial',
        subTaskTitle: 'Mapeamento de faca gráfica, sangria e prova de cor',
        durationHours: 2.5,
        isCritical
      },
      {
        stepName: 'Sessão 3/4: Caligrafia & Produção Gráfica',
        subTaskTitle: 'Caligrafia dos nomes de convidados e envio de amostra',
        durationHours: 2.5,
        isCritical
      },
      {
        stepName: 'Sessão 4/4: Montagem & Lacre de Cera',
        subTaskTitle: 'Acabamento final, aplicação de lacre e conferência de lote',
        durationHours: 2.5,
        isCritical
      }
    ];
  }

  if (deliverableType === 'RETROSPECTIVE') {
    return [
      {
        stepName: 'Sessão 1/4: Triagem de Assets & Fotos',
        subTaskTitle: 'Organização do acervo enviado pelo cliente e tratamento de imagens',
        durationHours: 2.0,
        isCritical
      },
      {
        stepName: 'Sessão 2/4: Edição de Linha do Tempo & Áudio',
        subTaskTitle: 'Corte da trilha sonora, decupagem de vídeo e sincronismo',
        durationHours: 2.0,
        isCritical
      },
      {
        stepName: 'Sessão 3/4: Efeitos, Títulos & Vinhetas',
        subTaskTitle: 'Animações de texto, transições e vinheta de encerramento',
        durationHours: 2.0,
        isCritical
      },
      {
        stepName: 'Sessão 4/4: Renderização 4K & Teste Projeção',
        subTaskTitle: 'Render em alta qualidade e checklist de reprodução',
        durationHours: 2.0,
        isCritical
      }
    ];
  }

  // FESTA
  return [
    {
      stepName: 'Sessão 1/5: Menus & Papelaria de Mesa',
      subTaskTitle: 'Diagramação de menucards e marcadores de lugar',
      durationHours: 2.0,
      isCritical
    },
    {
      stepName: 'Sessão 2/5: Placas de Sinalização & Welcome',
      subTaskTitle: 'Design do painel de entrada e sinalização da cerimônia',
      durationHours: 2.0,
      isCritical
    },
    {
      stepName: 'Sessão 3/5: Kits de Banheiro & Pista',
      subTaskTitle: 'Identidade dos kits de amenities e havaianas',
      durationHours: 2.0,
      isCritical
    }
  ];
}

/**
 * Gera a agenda de trabalho diária diluindo as MINI-TAREFAS no expediente das 08:00 às 17:00
 * respeitando os turnos da manhã e tarde e a pausa de 15min.
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
    retrospectiveHours: 8,
    partyHours: 20
  };

  const allMiniTasks = [];

  projects.forEach(project => {
    const isStdCritical = project.collisionRisk || getDaysDiffFromToday(project.saveTheDateDeadline) <= 15;
    const isInvCritical = project.daysWaitingClient > 2 || getDaysDiffFromToday(project.invitationDeadline) <= 10;
    const isRetroCritical = !project.assetsReceived || getDaysDiffFromToday(project.retrospectiveDeadline || project.partyDate) <= 3;

    // 1. Save the Date mini-tarefas (5h divididas)
    const stdSubTasks = getDeliverableMiniTasks(
      'SAVE_THE_DATE',
      config.saveTheDateHours || 5,
      project.name,
      project.client,
      project.saveTheDateDeadline,
      isStdCritical
    );

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
        partyDate: project.partyDate
      });
    });

    // 2. Convite mini-tarefas (10h divididas)
    const invSubTasks = getDeliverableMiniTasks(
      'INVITATION',
      config.invitationHours || 10,
      project.name,
      project.client,
      project.invitationDeadline,
      isInvCritical
    );

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
        partyDate: project.partyDate
      });
    });

    // 3. Retrospectiva mini-tarefas (8h divididas se a regra estiver ativa e houver prazo)
    if (project.hasRetrospective || project.retrospectiveDeadline) {
      const retroSubTasks = getDeliverableMiniTasks(
        'RETROSPECTIVE',
        config.retrospectiveHours || 8,
        project.name,
        project.client,
        project.retrospectiveDeadline || project.partyDate,
        isRetroCritical
      );

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
          partyDate: project.partyDate,
          assetsReceived: project.assetsReceived !== false
        });
      });
    }
  });

  // ORDENAÇÃO COM PRIORIDADE MATINAL:
  allMiniTasks.sort((a, b) => {
    if (a.isCritical && !b.isCritical) return -1;
    if (!a.isCritical && b.isCritical) return 1;
    return getDaysDiffFromToday(a.deadline) - getDaysDiffFromToday(b.deadline);
  });

  // Janelas de expediente
  const morningStartMin = timeToMinutes(config.morningStart || '08:00');
  const morningEndMin = timeToMinutes(config.morningEnd || '12:00');
  const afternoonStartMin = timeToMinutes(config.afternoonStart || '13:00');
  const afternoonEndMin = timeToMinutes(config.afternoonEnd || '17:00');
  const breakMin = config.breakMinutes !== undefined ? config.breakMinutes : 15;

  const scheduledSlots = [];
  let currentPointer = morningStartMin;

  allMiniTasks.forEach((task) => {
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
