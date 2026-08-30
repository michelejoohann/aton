import React, { useState, useMemo } from 'react';
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
  ListOrdered,
  Film
} from 'lucide-react';
import { formatDateBR, generateDailySchedule, getDaysDiffFromToday, DEFAULT_SYSTEM_TODAY } from '../utils/dateUtils.js';

export default function CalendarView({ projects, settings, onSelectProject }) {
  const [currentDate, setCurrentDate] = useState(new Date('2026-09-01T00:00:00'));
  const [filterType, setFilterType] = useState('ALL');
  const [viewMode, setViewMode] = useState('MONTH');
  const [selectedDay, setSelectedDay] = useState('2026-09-01');

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

  const dayOfWeekNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

  const EVENT_PRESENTATION = {
    SAVE_THE_DATE: {
      Icon: Bookmark,
      shortLabel: `Std (${stdWeeks}w/${stdHours}h)`,
      chip: 'bg-surface border-line text-ink hover:border-line-strong',
      badge: 'bg-surface-2 text-ink border-line',
      dot: 'bg-blue-400'
    },
    INVITATION: {
      Icon: Mail,
      shortLabel: `Conv (${invWeeks}w/${invHours}h)`,
      chip: 'bg-surface-2 border-line text-ink hover:border-line-strong',
      badge: 'bg-surface-2 text-ink border-line',
      dot: 'bg-purple-400'
    },
    RETROSPECTIVE: {
      Icon: Film,
      shortLabel: 'Retro (8h)',
      chip: 'bg-surface border-line text-ink hover:border-line-strong',
      badge: 'bg-surface-2 text-ink border-line',
      dot: 'bg-cyan-400'
    },
    PARTY: {
      Icon: PartyPopper,
      shortLabel: `FESTA (${partyHours}h)`,
      chip: 'bg-accent-soft border-line-strong text-accent hover:border-accent',
      badge: 'bg-accent text-on-accent border-accent',
      dot: 'bg-accent'
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
    setSelectedDay('2026-09-01');
  };

  // ── Extrair todos os marcos (deadlines) dos projetos ─────────────────
  const allEvents = useMemo(() => {
    const events = [];
    projects.forEach(project => {
      if (project.saveTheDateDeadline) {
        events.push({
          id: `${project.id}-std`, projectId: project.id, projectName: project.name,
          client: project.client, type: 'SAVE_THE_DATE',
          title: `Save the Date: ${project.name}`,
          ruleLabel: `Save the Date (${stdWeeks}sem / ${stdHours}h)`,
          date: project.saveTheDateDeadline, partyDate: project.partyDate, project
        });
      }
      if (project.invitationDeadline) {
        events.push({
          id: `${project.id}-inv`, projectId: project.id, projectName: project.name,
          client: project.client, type: 'INVITATION',
          title: `Convite: ${project.name}`,
          ruleLabel: `Convite (${invWeeks}sem / ${invHours}h)`,
          date: project.invitationDeadline, partyDate: project.partyDate, project
        });
      }
      if (project.retrospectiveDeadline && project.hasRetrospective) {
        events.push({
          id: `${project.id}-retro`, projectId: project.id, projectName: project.name,
          client: project.client, type: 'RETROSPECTIVE',
          title: `Retrospectiva: ${project.name}`,
          ruleLabel: 'Retrospectiva (8h / 1 dia antes)',
          date: project.retrospectiveDeadline, partyDate: project.partyDate, project
        });
      }
      events.push({
        id: `${project.id}-party`, projectId: project.id, projectName: project.name,
        client: project.client, type: 'PARTY',
        title: `FESTA: ${project.name}`,
        ruleLabel: `Data da Festa (${partyHours}h)`,
        date: project.partyDate, partyDate: project.partyDate, project
      });
    });
    return events;
  }, [projects, stdWeeks, invWeeks, stdHours, invHours, partyHours]);

  const filteredEvents = allEvents.filter(ev => {
    if (filterType === 'ALL') return true;
    return ev.type === filterType;
  });

  // ── Grade mensal ─────────────────────────────────────────────────────
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const getDateStrKey = (dayNum) => {
    if (!dayNum) return '';
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
  };

  const filterButtonClass = (type) =>
    `inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-sm text-caption font-medium transition-colors ${
      filterType === type
        ? 'bg-accent text-on-accent font-semibold'
        : 'text-ink-muted hover:text-ink hover:bg-surface-2'
    }`;

  // ── Agenda diária calculada dinamicamente pelo dia selecionado ──────
  const dailyScheduleData = useMemo(() => {
    return generateDailySchedule(projects, settings, selectedDay);
  }, [projects, settings, selectedDay]);

  const selectedDayObj = new Date(selectedDay + 'T00:00:00');
  const selectedDayOfWeek = dayOfWeekNames[selectedDayObj.getDay()];
  const isWeekend = selectedDayObj.getDay() === 0 || selectedDayObj.getDay() === 6;

  // Navegar dia na agenda diária
  const handlePrevDay = () => {
    const d = new Date(selectedDay + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    setSelectedDay(d.toISOString().split('T')[0]);
  };
  const handleNextDay = () => {
    const d = new Date(selectedDay + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    setSelectedDay(d.toISOString().split('T')[0]);
  };

  // Deadlines que vencem neste dia selecionado
  const dayDeadlines = allEvents.filter(ev => ev.date === selectedDay);

  // Estatísticas do agendamento
  const totalScheduledHours = dailyScheduleData.schedule.reduce((sum, s) => sum + s.durationHours, 0);
  const criticalCount = dailyScheduleData.schedule.filter(s => s.isCritical).length;

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
                Jornada: <strong className="font-semibold text-ink">{settings?.morningStart || '08:00'}–{settings?.morningEnd || '12:00'}</strong> &amp; <strong className="font-semibold text-ink">{settings?.afternoonStart || '13:00'}–{settings?.afternoonEnd || '17:00'}</strong> (Seg–Sex) | Pausa: <strong className="font-semibold text-ink">{settings?.breakMinutes || 15}min</strong> | <strong className="font-semibold text-ink">{projects.length}</strong> projetos ativos | <strong className="font-semibold text-ink">{allEvents.length}</strong> marcos
              </p>
            </div>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex flex-wrap items-center gap-3">
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
              <span>Agenda Diária</span>
            </button>
          </div>

          {viewMode === 'MONTH' && (
            <div className="flex items-center gap-1 bg-surface border border-line-control rounded-sm p-1">
              <button onClick={handlePrevMonth} aria-label="Mês anterior" className="p-1 rounded-sm text-ink-muted hover:bg-surface-2 hover:text-ink">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-caption font-semibold text-ink min-w-[7rem] text-center px-2 tabular-nums">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button onClick={handleNextMonth} aria-label="Próximo mês" className="p-1 rounded-sm text-ink-muted hover:bg-surface-2 hover:text-ink">
                <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={handleToday} className="px-2.5 py-1 rounded-sm text-caption font-semibold text-accent border border-line-control hover:bg-accent-soft">
                Hoje
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          VISTA 1: AGENDA DIÁRIA CALCULADA (08h-12h e 13h-17h)
          ═══════════════════════════════════════════════════════════════════ */}
      {viewMode === 'DAILY_SCHEDULE' && (
        <div className="bg-surface rounded-md border border-line p-5 shadow-subtle space-y-5">

          {/* Day Navigator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
            <div>
              <h3 className="text-section-title font-semibold text-ink flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                <span>{selectedDayOfWeek}, {formatDateBR(selectedDay)}</span>
              </h3>
              <p className="text-caption text-ink-muted mt-0.5">
                {isWeekend ? (
                  <span className="text-on-warning font-semibold">⚠ Fim de semana — sem expediente programado</span>
                ) : (
                  <>
                    <strong className="font-semibold text-ink tabular-nums">{dailyScheduleData.schedule.length}</strong> tarefas alocadas •{' '}
                    <strong className="font-semibold text-ink tabular-nums">{totalScheduledHours.toFixed(1)}h</strong> de produção •{' '}
                    {criticalCount > 0 && <span className="text-on-warning font-semibold">{criticalCount} crítica(s) matinal(is)</span>}
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-surface border border-line-control rounded-sm p-1">
                <button onClick={handlePrevDay} aria-label="Dia anterior" className="p-1 rounded-sm text-ink-muted hover:bg-surface-2 hover:text-ink">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-caption font-semibold text-ink min-w-[6rem] text-center px-2 tabular-nums">
                  {formatDateBR(selectedDay)}
                </span>
                <button onClick={handleNextDay} aria-label="Próximo dia" className="p-1 rounded-sm text-ink-muted hover:bg-surface-2 hover:text-ink">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => setSelectedDay('2026-09-01')}
                className="px-2.5 py-1.5 rounded-sm text-caption font-semibold text-accent border border-line-control hover:bg-accent-soft"
              >
                Hoje
              </button>
              <div className="flex items-center gap-1 bg-surface-2 border border-line px-3 py-1.5 rounded-sm text-caption">
                <Coffee className="w-3.5 h-3.5 text-accent" />
                <span className="tabular-nums font-medium">{settings?.breakMinutes || 15}min pausa</span>
              </div>
            </div>
          </div>

          {/* Deadlines que vencem neste dia */}
          {dayDeadlines.length > 0 && (
            <div className="bg-warning-surface border border-warning-border rounded-md p-3 space-y-2">
              <h4 className="text-caption font-bold uppercase tracking-wider text-on-warning flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                {dayDeadlines.length} deadline(s) neste dia
              </h4>
              <div className="flex flex-wrap gap-2">
                {dayDeadlines.map(ev => {
                  const look = EVENT_PRESENTATION[ev.type] || EVENT_PRESENTATION.PARTY;
                  const EvIcon = look.Icon;
                  return (
                    <button
                      key={ev.id}
                      onClick={() => onSelectProject(ev.project)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-surface border border-line text-caption font-semibold text-ink hover:border-accent transition-colors"
                    >
                      <EvIcon className="w-3.5 h-3.5 text-accent" />
                      <span>{ev.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Timeline de Tarefas */}
          {isWeekend ? (
            <div className="flex flex-col items-center justify-center py-12 text-ink-muted">
              <CalendarIcon className="w-10 h-10 mb-3 text-line-strong" />
              <p className="text-label font-semibold">Fim de semana</p>
              <p className="text-caption">Sem expediente programado. Navegue para um dia útil.</p>
            </div>
          ) : dailyScheduleData.schedule.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-ink-muted">
              <Clock className="w-10 h-10 mb-3 text-line-strong" />
              <p className="text-label font-semibold">Nenhuma tarefa alocada para este dia</p>
              <p className="text-caption">Todas as entregas pendentes estão atribuídas a outros dias.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dailyScheduleData.schedule.map((slot, index) => {
                const isMorning = slot.isMorningPriority;
                const typePresentation = EVENT_PRESENTATION[slot.type] || EVENT_PRESENTATION.PARTY;
                const TypeIcon = typePresentation.Icon;

                return (
                  <React.Fragment key={slot.id}>
                    <div
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-md border transition-all ${
                        slot.isCritical
                          ? 'bg-warning-surface border-warning-border'
                          : isMorning
                          ? 'bg-accent-soft/40 border-accent/30'
                          : 'bg-surface-2 border-line'
                      }`}
                    >
                      {/* Time Block */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="flex flex-col items-center justify-center bg-surface border border-line rounded-sm px-3 py-1.5 text-center min-w-[5rem]">
                          <span className="text-label font-bold text-ink tabular-nums">{slot.startTime}</span>
                          <span className="text-caption text-ink-subtle">até {slot.endTime}</span>
                        </span>

                        <div className="flex flex-col items-start gap-1">
                          {slot.isCritical && (
                            <span className="inline-flex items-center gap-1 text-caption font-semibold uppercase text-on-warning bg-surface border border-warning-border px-2 py-0.5 rounded-xs">
                              <AlertTriangle className="w-3 h-3" />
                              Prioridade Matinal
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 text-caption font-medium text-ink-muted">
                            <TypeIcon className="w-3 h-3" />
                            {slot.deliverableName} • {slot.durationHours}h
                          </span>
                        </div>
                      </div>

                      {/* Task Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-caption font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs border ${
                            slot.isCritical ? 'text-on-warning bg-warning-surface border-warning-border' : 'text-accent bg-surface border-line'
                          }`}>
                            {slot.stepName}
                          </span>
                        </div>
                        <h4 className="text-label font-semibold text-ink mt-1 truncate">
                          {slot.subTaskTitle}
                        </h4>
                        <p className="text-caption text-ink-muted mt-0.5">
                          <strong className="text-ink font-medium">{slot.projectName}</strong> • {slot.client} • Prazo: <strong className="text-ink tabular-nums">{formatDateBR(slot.deadline)}</strong>
                          {slot.assetsReceived === false && (
                            <span className="ml-2 text-on-warning font-semibold">⚠ Assets pendentes</span>
                          )}
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

                    {/* Break Indicator */}
                    {index < dailyScheduleData.schedule.length - 1 && (
                      <div className="flex items-center justify-center gap-2 py-1 text-caption font-medium text-ink-subtle">
                        <div className="h-px bg-line flex-1"></div>
                        <span className="inline-flex items-center gap-1 bg-surface border border-line px-2.5 py-0.5 rounded-full text-caption text-ink-muted">
                          <Coffee className="w-3 h-3 text-accent" />
                          {settings?.breakMinutes || 15}min pausa
                        </span>
                        <div className="h-px bg-line flex-1"></div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Summary Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-line">
                <div className="flex flex-wrap gap-4 text-caption text-ink-muted">
                  <span>Total alocado: <strong className="text-ink tabular-nums">{totalScheduledHours.toFixed(1)}h</strong> / 8h</span>
                  <span>Slots: <strong className="text-ink tabular-nums">{dailyScheduleData.schedule.length}</strong></span>
                  <span>Projetos distintos: <strong className="text-ink tabular-nums">{new Set(dailyScheduleData.schedule.map(s => s.projectId)).size}</strong></span>
                </div>
                {totalScheduledHours > 8 && (
                  <span className="inline-flex items-center gap-1 text-caption font-semibold text-on-warning">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Dia sobrecarregado ({(totalScheduledHours - 8).toFixed(1)}h excedente)
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          VISTA 2: GRADE MENSAL DE MARCOS (DEADLINES)
          ═══════════════════════════════════════════════════════════════════ */}
      {viewMode === 'MONTH' && (
        <>
          {/* Filtros por tipo de entregável */}
          <div className="flex flex-wrap items-center gap-1 bg-surface border border-line-control rounded-sm p-1 w-fit">
            <button onClick={() => setFilterType('ALL')} className={filterButtonClass('ALL')}>
              <LayoutList className="w-4 h-4" aria-hidden="true" />
              <span>Todos ({allEvents.length})</span>
            </button>
            <button onClick={() => setFilterType('SAVE_THE_DATE')} className={filterButtonClass('SAVE_THE_DATE')}>
              <Bookmark className="w-4 h-4" aria-hidden="true" />
              <span>Std ({stdWeeks}w)</span>
            </button>
            <button onClick={() => setFilterType('INVITATION')} className={filterButtonClass('INVITATION')}>
              <Mail className="w-4 h-4" aria-hidden="true" />
              <span>Convite ({invWeeks}w)</span>
            </button>
            <button onClick={() => setFilterType('RETROSPECTIVE')} className={filterButtonClass('RETROSPECTIVE')}>
              <Film className="w-4 h-4" aria-hidden="true" />
              <span>Retro</span>
            </button>
            <button onClick={() => setFilterType('PARTY')} className={filterButtonClass('PARTY')}>
              <PartyPopper className="w-4 h-4" aria-hidden="true" />
              <span>Festa</span>
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="bg-surface rounded-md border border-line p-4 shadow-subtle">
            <div className="grid grid-cols-7 gap-1 text-center text-caption font-semibold text-ink-subtle mb-2 border-b border-line pb-2">
              <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 auto-rows-fr">
              {calendarDays.map((dayNum, index) => {
                if (!dayNum) {
                  return <div key={`empty-${index}`} className="min-h-[110px] bg-surface-2 rounded-sm border border-line"></div>;
                }

                const dateKey = getDateStrKey(dayNum);
                const dayEvents = filteredEvents.filter(ev => ev.date === dateKey);
                const isToday = dateKey === '2026-09-01';
                const isSelected = dateKey === selectedDay;
                const dayObj = new Date(dateKey + 'T00:00:00');
                const isDayWeekend = dayObj.getDay() === 0 || dayObj.getDay() === 6;

                return (
                  <button
                    key={`day-${dayNum}`}
                    type="button"
                    onClick={() => { setSelectedDay(dateKey); setViewMode('DAILY_SCHEDULE'); }}
                    className={`min-h-[110px] p-2 rounded-sm border flex flex-col justify-between transition-colors text-left ${
                      isSelected
                        ? 'bg-accent-soft border-accent ring-1 ring-accent'
                        : isToday
                        ? 'bg-accent-soft/50 border-accent/50'
                        : isDayWeekend
                        ? 'bg-surface-2/50 border-line/50'
                        : 'bg-surface border-line hover:border-line-strong'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-caption font-semibold tabular-nums ${
                        isToday
                          ? 'w-6 h-6 rounded-full bg-accent text-on-accent flex items-center justify-center'
                          : isDayWeekend
                          ? 'text-ink-subtle'
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

                    <div className="space-y-1 flex-1 overflow-y-auto max-h-[80px]">
                      {dayEvents.map(event => {
                        const look = EVENT_PRESENTATION[event.type] || EVENT_PRESENTATION.PARTY;
                        const EvIcon = look.Icon;
                        const daysUntil = getDaysDiffFromToday(event.date);
                        const isOverdue = daysUntil < 0;
                        return (
                          <div
                            key={event.id}
                            className={`w-full text-left p-1 rounded-xs border text-caption leading-tight ${
                              isOverdue ? 'bg-urgent-surface border-urgent-border' : look.chip
                            }`}
                            title={`${event.title} (Festa: ${formatDateBR(event.partyDate)})`}
                          >
                            <span className="flex items-center gap-1 font-semibold truncate">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isOverdue ? 'bg-urgent' : look.dot}`}></span>
                              <span className="truncate">
                                {event.projectName.split(' ').slice(0, 2).join(' ')}
                              </span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Month Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-line text-caption text-ink-muted">
              <span className="font-semibold text-ink">Legenda:</span>
              {Object.entries(EVENT_PRESENTATION).map(([key, look]) => {
                const LIcon = look.Icon;
                return (
                  <span key={key} className="inline-flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${look.dot}`}></span>
                    <LIcon className="w-3 h-3" />
                    <span>{look.shortLabel}</span>
                  </span>
                );
              })}
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-urgent"></span>
                <span className="text-on-urgent font-semibold">Vencido</span>
              </span>
            </div>
          </div>
        </>
      )}

    </section>
  );
}
