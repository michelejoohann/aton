import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  PartyPopper,
  Mail,
  Bookmark,
  LayoutList,
  Clock,
  Coffee,
  AlertTriangle,
  Grid,
  ListOrdered
} from 'lucide-react';
import { formatDateBR, generateDailySchedule } from '../utils/dateUtils';

export default function CalendarView({ projects, settings, onSelectProject }) {
  const [currentDate, setCurrentDate] = useState(new Date('2026-09-01T00:00:00'));
  const [filterType, setFilterType] = useState('ALL'); // ALL, SAVE_THE_DATE, INVITATION, PARTY
  const [viewMode, setViewMode] = useState('MONTH'); // 'MONTH' | 'DAILY_SCHEDULE'

  const stdWeeks = settings?.saveTheDateWeeks || 6;
  const invWeeks = settings?.invitationWeeks || 3;
  const stdHours = settings?.saveTheDateHours || 5;
  const invHours = settings?.invitationHours || 10;
  const partyHours = settings?.partyHours || 20;

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const EVENT_PRESENTATION = {
    SAVE_THE_DATE: {
      Icon: Bookmark,
      shortLabel: `Std (${stdWeeks}w / ${stdHours}h)`,
      chip: 'bg-surface border-line text-ink hover:border-line-strong',
      badge: 'bg-surface-2 text-ink border-line'
    },
    INVITATION: {
      Icon: Mail,
      shortLabel: `Convite (${invWeeks}w / ${invHours}h)`,
      chip: 'bg-surface-2 border-line text-ink hover:border-line-strong',
      badge: 'bg-surface-2 text-ink border-line'
    },
    PARTY: {
      Icon: PartyPopper,
      shortLabel: `FESTA (${partyHours}h)`,
      chip: 'bg-accent-soft border-line-strong text-accent hover:border-accent',
      badge: 'bg-accent text-on-accent border-accent'
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date('2026-09-01T00:00:00'));
  };

  // Extract all deliverable events from the projects
  const allEvents = [];
  projects.forEach(project => {
    // 1. Save the Date (6w)
    allEvents.push({
      id: `${project.id}-std`,
      projectId: project.id,
      projectName: project.name,
      client: project.client,
      type: 'SAVE_THE_DATE',
      title: `Save the Date: ${project.name}`,
      ruleLabel: `Save the Date (${stdWeeks} sem / ${stdHours}h)`,
      date: project.saveTheDateDeadline,
      partyDate: project.partyDate,
      project
    });

    // 2. Convite (3w)
    allEvents.push({
      id: `${project.id}-inv`,
      projectId: project.id,
      projectName: project.name,
      client: project.client,
      type: 'INVITATION',
      title: `Convite Oficial: ${project.name}`,
      ruleLabel: `Convite (${invWeeks} sem / ${invHours}h)`,
      date: project.invitationDeadline,
      partyDate: project.partyDate,
      project
    });

    // 3. Festa (Data Final)
    allEvents.push({
      id: `${project.id}-party`,
      projectId: project.id,
      projectName: project.name,
      client: project.client,
      type: 'PARTY',
      title: `FESTA: ${project.name}`,
      ruleLabel: `Data da Festa (${partyHours}h)`,
      date: project.partyDate,
      partyDate: project.partyDate,
      project
    });
  });

  const filteredEvents = allEvents.filter(ev => {
    if (filterType === 'ALL') return true;
    return ev.type === filterType;
  });

  // Calculate days in month grid
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const getDateStrKey = (dayNum) => {
    if (!dayNum) return '';
    const mStr = String(currentMonth + 1).padStart(2, '0');
    const dStr = String(dayNum).padStart(2, '0');
    return `${currentYear}-${mStr}-${dStr}`;
  };

  const filterButtonClass = (type) =>
    `inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-sm text-caption font-medium transition-colors ${
      filterType === type
        ? 'bg-accent text-on-accent font-semibold'
        : 'text-ink-muted hover:text-ink hover:bg-surface-2'
    }`;

  const monthEvents = filteredEvents.filter(ev =>
    ev.date.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`)
  );

  // Agenda Diária Gerada com Regras das 08h-12h e 13h-17h, 15m breaks e Prioridade Matinal
  const dailyScheduleData = generateDailySchedule(projects, settings, '2026-09-01');

  return (
    <section className="mb-section space-y-5">

      {/* Calendar Bar Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-line-strong">
        <div>
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-accent"
            >
              <CalendarIcon className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-display text-page-title font-semibold text-ink tracking-tight">
                Visão de Agenda &amp; Cronograma
              </h2>
              <p className="text-caption text-ink-muted mt-1">
                Jornada: <strong className="font-semibold text-ink">08:00–12:00</strong> &amp; <strong className="font-semibold text-ink">13:00–17:00</strong> (Seg–Sex) | Pausa: <strong className="font-semibold text-ink">{settings?.breakMinutes || 15}min entre tarefas</strong> | Priorização Matinal às <strong className="font-semibold text-ink">08:00</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* View Controls: Month Grid vs Daily Hourly Schedule */}
        <div className="flex flex-wrap items-center gap-3">

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-surface border border-line-control rounded-sm p-1">
            <button
              onClick={() => setViewMode('MONTH')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-caption font-semibold transition-colors ${
                viewMode === 'MONTH' ? 'bg-accent text-on-accent' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Grade Mensal</span>
            </button>
            <button
              onClick={() => setViewMode('DAILY_SCHEDULE')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-caption font-semibold transition-colors ${
                viewMode === 'DAILY_SCHEDULE' ? 'bg-accent text-on-accent' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>Agenda Diária (08h–17h)</span>
            </button>
          </div>

          {/* Month Switcher Controls */}
          {viewMode === 'MONTH' && (
            <div className="flex items-center gap-1 bg-surface border border-line-control rounded-sm p-1">
              <button
                onClick={handlePrevMonth}
                aria-label="Mês anterior"
                className="p-1 rounded-sm text-ink-muted hover:bg-surface-2 hover:text-ink"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-caption font-semibold text-ink min-w-[7rem] text-center px-2 tabular-nums">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button
                onClick={handleNextMonth}
                aria-label="Próximo mês"
                className="p-1 rounded-sm text-ink-muted hover:bg-surface-2 hover:text-ink"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleToday}
                className="px-2.5 py-1 rounded-sm text-caption font-semibold text-accent border border-line-control hover:bg-accent-soft"
              >
                Hoje
              </button>
            </div>
          )}

        </div>
      </div>

      {/* VISTA 1: AGENDA DIÁRIA DE TRABALHO (08h-12h e 13h-17h com pausas de 15m e prioridade matinal) */}
      {viewMode === 'DAILY_SCHEDULE' && (
        <div className="bg-surface rounded-md border border-line p-5 shadow-subtle space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
            <div>
              <h3 className="text-section-title font-semibold text-ink flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                <span>Programação Diária de Foco — Terça-feira, 01/09/2026</span>
              </h3>
              <p className="text-caption text-ink-muted mt-0.5">
                Alocação automatizada na jornada de 8h diárias. <strong className="font-semibold text-ink">Tarefas críticas são inseridas no primeiro horário da manhã (08:00)</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-surface-2 border border-line px-3 py-1.5 rounded-sm text-caption">
              <Coffee className="w-4 h-4 text-accent" />
              <span>Intervalo mínimo: <strong className="font-semibold text-ink tabular-nums">{settings?.breakMinutes || 15} minutos</strong></span>
            </div>
          </div>

          {/* Time Slots Timeline Grid */}
          <div className="space-y-3">
            {dailyScheduleData.schedule.map((slot, index) => {
              const isMorning = slot.isMorningPriority;
              return (
                <React.Fragment key={slot.id}>
                  {/* Task Card Slot */}
                  <div
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-md border transition-all ${
                      slot.isCritical
                        ? 'bg-warning-surface border-warning-border'
                        : isMorning
                        ? 'bg-accent-soft/40 border-accent/30'
                        : 'bg-surface-2 border-line'
                    }`}
                  >
                    {/* Time Indicator */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="flex flex-col items-center justify-center bg-surface border border-line rounded-sm px-3 py-1.5 text-center">
                        <span className="text-label font-bold text-ink tabular-nums">{slot.startTime}</span>
                        <span className="text-caption text-ink-subtle">até {slot.endTime}</span>
                      </span>

                      {slot.isCritical && (
                        <span className="inline-flex items-center gap-1 text-caption font-semibold uppercase text-on-warning bg-surface border border-warning-border px-2 py-0.5 rounded-xs">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Prioridade 08:00 (Matinal)
                        </span>
                      )}
                    </div>

                    {/* Task Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-caption font-semibold text-ink-muted uppercase tracking-wider">
                          {slot.deliverableName} ({slot.durationHours}h produção exigida)
                        </span>
                      </div>
                      <h4 className="text-label font-semibold text-ink truncate mt-0.5">
                        {slot.projectName} — Cliente: {slot.client}
                      </h4>
                      <p className="text-caption text-ink-muted mt-0.5">
                        {slot.title} • Data Limite do Entregável: <strong className="text-ink">{formatDateBR(slot.deadline)}</strong>
                      </p>
                    </div>

                    {/* Action */}
                    <button
                      onClick={() => {
                        const proj = projects.find(p => p.id === slot.projectId);
                        if (proj) onSelectProject(proj);
                      }}
                      className="px-3 py-1.5 rounded-sm bg-surface border border-line-control hover:bg-surface-2 text-caption font-semibold text-accent whitespace-nowrap transition-colors"
                    >
                      Ver Projeto
                    </button>
                  </div>

                  {/* 15-Minute Break Indicator Between Tasks */}
                  {index < dailyScheduleData.schedule.length - 1 && (
                    <div className="flex items-center justify-center gap-2 py-1 text-caption font-medium text-ink-subtle">
                      <div className="h-px bg-line flex-1"></div>
                      <span className="inline-flex items-center gap-1 bg-surface border border-line px-2.5 py-0.5 rounded-full text-caption text-ink-muted">
                        <Coffee className="w-3 h-3 text-accent" />
                        Pausa de {settings?.breakMinutes || 15} minutos para descanso
                      </span>
                      <div className="h-px bg-line flex-1"></div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* VISTA 2: GRADE MENSAL DE ENTREGÁVEIS */}
      {viewMode === 'MONTH' && (
        <>
          {/* Deliverable Type Filters */}
          <div className="flex flex-wrap items-center gap-1 bg-surface border border-line-control rounded-sm p-1 w-fit">
            <button onClick={() => setFilterType('ALL')} className={filterButtonClass('ALL')}>
              <LayoutList className="w-4 h-4" aria-hidden="true" />
              <span>Todos os Entregáveis ({allEvents.length})</span>
            </button>
            <button onClick={() => setFilterType('SAVE_THE_DATE')} className={filterButtonClass('SAVE_THE_DATE')}>
              <Bookmark className="w-4 h-4" aria-hidden="true" />
              <span>Std ({stdWeeks}w / {stdHours}h)</span>
            </button>
            <button onClick={() => setFilterType('INVITATION')} className={filterButtonClass('INVITATION')}>
              <Mail className="w-4 h-4" aria-hidden="true" />
              <span>Convite ({invWeeks}w / {invHours}h)</span>
            </button>
            <button onClick={() => setFilterType('PARTY')} className={filterButtonClass('PARTY')}>
              <PartyPopper className="w-4 h-4" aria-hidden="true" />
              <span>Festa ({partyHours}h)</span>
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="bg-surface rounded-md border border-line p-4 shadow-subtle">
            <div className="grid grid-cols-7 gap-1 text-center text-caption font-semibold text-ink-subtle mb-2 border-b border-line pb-2">
              <span>Dom</span>
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span>Sáb</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 auto-rows-fr">
              {calendarDays.map((dayNum, index) => {
                if (!dayNum) {
                  return (
                    <div key={`empty-${index}`} className="min-h-[100px] bg-surface-2 rounded-sm border border-line"></div>
                  );
                }

                const dateKey = getDateStrKey(dayNum);
                const dayEvents = filteredEvents.filter(ev => ev.date === dateKey);
                const isToday = dateKey === '2026-09-01';

                return (
                  <div
                    key={`day-${dayNum}`}
                    className={`min-h-[110px] p-2 rounded-sm border flex flex-col justify-between transition-colors ${
                      isToday
                        ? 'bg-accent-soft border-accent'
                        : 'bg-surface border-line hover:border-line-strong'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-caption font-semibold tabular-nums ${
                        isToday
                          ? 'w-6 h-6 rounded-full bg-accent text-on-accent flex items-center justify-center'
                          : 'text-ink'
                      }`}>
                        {dayNum}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="text-caption font-semibold tabular-nums text-ink-muted bg-surface-2 px-1.5 py-0.5 rounded-xs border border-line">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 flex-1 overflow-y-auto max-h-[85px]">
                      {dayEvents.map(event => {
                        const look = EVENT_PRESENTATION[event.type];
                        const EventIcon = look.Icon;
                        return (
                          <button
                            key={event.id}
                            type="button"
                            onClick={() => onSelectProject(event.project)}
                            className={`w-full text-left p-1 rounded-xs border text-caption leading-tight cursor-pointer transition-colors ${look.chip}`}
                            title={`${event.title} (Festa: ${formatDateBR(event.partyDate)})`}
                          >
                            <span className="flex items-center gap-1 font-semibold truncate">
                              <EventIcon className="w-3 h-3 shrink-0" aria-hidden="true" />
                              <span className="truncate">
                                {look.shortLabel}: {event.projectName.replace('Casamento ', '').replace('Aniversário ', '')}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

    </section>
  );
}
