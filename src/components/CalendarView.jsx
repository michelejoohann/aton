import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  PartyPopper,
  Mail,
  Bookmark,
  LayoutList
} from 'lucide-react';
import { formatDateBR } from '../utils/dateUtils';

// Apresentação por tipo de entregável: derivada aqui, nunca embutida no dado.
const EVENT_PRESENTATION = {
  SAVE_THE_DATE: {
    Icon: Bookmark,
    shortLabel: 'Std (-6m)',
    chip: 'bg-surface border-line text-ink hover:border-line-strong',
    badge: 'bg-surface-2 text-ink border-line'
  },
  INVITATION: {
    Icon: Mail,
    shortLabel: 'Convite (-3m)',
    chip: 'bg-surface-2 border-line text-ink hover:border-line-strong',
    badge: 'bg-surface-2 text-ink border-line'
  },
  PARTY: {
    Icon: PartyPopper,
    shortLabel: 'FESTA',
    chip: 'bg-accent-soft border-line-strong text-accent hover:border-accent',
    badge: 'bg-accent text-on-accent border-accent'
  }
};

export default function CalendarView({ projects, onSelectProject }) {
  // Current visible month/year state (Default: Setembro 2026)
  const [currentDate, setCurrentDate] = useState(new Date('2026-09-01T00:00:00'));
  const [filterType, setFilterType] = useState('ALL'); // ALL, SAVE_THE_DATE, INVITATION, PARTY

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Navigate Months
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date('2026-09-01T00:00:00'));
  };

  // Extract all deliverable events from the 9 projects
  const allEvents = [];
  projects.forEach(project => {
    // 1. Save the Date (-6m)
    allEvents.push({
      id: `${project.id}-std`,
      projectId: project.id,
      projectName: project.name,
      client: project.client,
      type: 'SAVE_THE_DATE',
      title: `Save the Date: ${project.name}`,
      ruleLabel: 'Save the Date (6m antes)',
      date: project.saveTheDateDeadline,
      partyDate: project.partyDate,
      project
    });

    // 2. Convite (-3m)
    allEvents.push({
      id: `${project.id}-inv`,
      projectId: project.id,
      projectName: project.name,
      client: project.client,
      type: 'INVITATION',
      title: `Convite Oficial: ${project.name}`,
      ruleLabel: 'Convite (3m antes)',
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
      ruleLabel: 'Data da Festa (Prazo Final)',
      date: project.partyDate,
      partyDate: project.partyDate,
      project
    });
  });

  // Filter events by selected deliverable type
  const filteredEvents = allEvents.filter(ev => {
    if (filterType === 'ALL') return true;
    return ev.type === filterType;
  });

  // Calculate days in month grid
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays = [];
  // Empty padding cells
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  // Days 1..daysInMonth
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  // Format date string key YYYY-MM-DD
  const getDateStrKey = (dayNum) => {
    if (!dayNum) return '';
    const mStr = String(currentMonth + 1).padStart(2, '0');
    const dStr = String(dayNum).padStart(2, '0');
    return `${currentYear}-${mStr}-${dStr}`;
  };

  const filterButtonClass = (type) =>
    `inline-flex items-center justify-center gap-1.5 min-h-11 px-2.5 rounded-sm text-label font-medium transition-colors duration-150 ease-quint ${
      filterType === type
        ? 'bg-accent text-on-accent font-semibold'
        : 'text-ink-muted hover:text-ink hover:bg-surface-2'
    }`;

  const monthEvents = filteredEvents.filter(ev =>
    ev.date.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`)
  );

  return (
    <section className="mb-section">

      {/* Calendar Bar Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 mb-5 border-b border-line-strong">
        <div>
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-accent"
            >
              <CalendarIcon className="w-5 h-5" />
            </span>
            <h2 className="font-display text-page-title font-semibold text-ink tracking-tight">
              Visão de Calendário — Cronograma de Entregáveis
            </h2>
          </div>
          <p className="text-label text-ink-muted mt-1.5 max-w-3xl">
            Visualização automática pela regra: <strong className="font-semibold text-ink">Save the Date (6m antes)</strong>, <strong className="font-semibold text-ink">Convite (3m antes)</strong> e <strong className="font-semibold text-ink">Data da Festa</strong>.
          </p>
        </div>

        {/* Month Navigation & Type Filter */}
        <div className="flex flex-wrap items-center gap-2">

          {/* Deliverable Type Filters */}
          <div className="flex flex-wrap items-center gap-1 bg-surface border border-line-control rounded-sm p-1">
            <button onClick={() => setFilterType('ALL')} className={filterButtonClass('ALL')}>
              <LayoutList className="w-4 h-4" aria-hidden="true" />
              <span>Todos (<span className="tabular-nums">{allEvents.length}</span>)</span>
            </button>
            <button onClick={() => setFilterType('SAVE_THE_DATE')} className={filterButtonClass('SAVE_THE_DATE')}>
              <Bookmark className="w-4 h-4" aria-hidden="true" />
              <span>6m (Save the Date)</span>
            </button>
            <button onClick={() => setFilterType('INVITATION')} className={filterButtonClass('INVITATION')}>
              <Mail className="w-4 h-4" aria-hidden="true" />
              <span>3m (Convite)</span>
            </button>
            <button onClick={() => setFilterType('PARTY')} className={filterButtonClass('PARTY')}>
              <PartyPopper className="w-4 h-4" aria-hidden="true" />
              <span>Festa</span>
            </button>
          </div>

          {/* Month Switcher Controls */}
          <div className="flex items-center gap-1 bg-surface border border-line-control rounded-sm p-1">
            <button
              onClick={handlePrevMonth}
              aria-label="Mês anterior"
              title="Mês Anterior"
              className="inline-flex items-center justify-center min-w-11 min-h-11 rounded-sm text-ink-muted hover:bg-surface-2 hover:text-ink transition-colors duration-150 ease-quint"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>

            <span className="text-label font-semibold text-ink min-w-[8rem] text-center px-2 tabular-nums">
              {monthNames[currentMonth]} {currentYear}
            </span>

            <button
              onClick={handleNextMonth}
              aria-label="Próximo mês"
              title="Próximo Mês"
              className="inline-flex items-center justify-center min-w-11 min-h-11 rounded-sm text-ink-muted hover:bg-surface-2 hover:text-ink transition-colors duration-150 ease-quint"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              onClick={handleToday}
              className="inline-flex items-center justify-center min-h-11 px-3 rounded-sm text-label font-semibold text-accent border border-line-control hover:bg-accent-soft transition-colors duration-150 ease-quint"
            >
              Hoje
            </button>
          </div>

        </div>
      </div>

      {/* Calendar Grid (tablet & desktop) */}
      <div className="hidden sm:block bg-surface rounded-md border border-line p-4 shadow-subtle">

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-caption font-semibold text-ink-subtle mb-2 border-b border-line pb-2">
          <span>Dom</span>
          <span>Seg</span>
          <span>Ter</span>
          <span>Qua</span>
          <span>Qui</span>
          <span>Sex</span>
          <span>Sáb</span>
        </div>

        {/* Days Cells Grid */}
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
                className={`min-h-[110px] p-2 rounded-sm border flex flex-col justify-between transition-colors duration-150 ease-quint ${
                  isToday
                    ? 'bg-accent-soft border-accent'
                    : 'bg-surface border-line hover:border-line-strong'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-label font-semibold tabular-nums ${
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

                {/* Day Events Badges List */}
                <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[85px]">
                  {dayEvents.map(event => {
                    const look = EVENT_PRESENTATION[event.type];
                    const EventIcon = look.Icon;
                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => onSelectProject(event.project)}
                        className={`w-full min-h-11 text-left p-1.5 rounded-xs border text-caption leading-tight cursor-pointer transition-colors duration-150 ease-quint ${look.chip}`}
                        title={`${event.title} (Festa: ${formatDateBR(event.partyDate)})`}
                      >
                        <span className="flex items-center gap-1 font-semibold truncate">
                          <EventIcon className="w-3 h-3 shrink-0" aria-hidden="true" />
                          <span className="truncate">
                            {look.shortLabel}: {event.projectName.replace('Casamento ', '').replace('Aniversário ', '')}
                          </span>
                        </span>
                        <span className="block text-caption text-ink-muted truncate">{event.client}</span>
                      </button>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Agenda compacta (telas estreitas): mesma fonte de dados, sem rolagem lateral */}
      <div className="sm:hidden bg-surface rounded-md border border-line divide-y divide-line shadow-subtle">
        {calendarDays.filter(Boolean).map(dayNum => {
          const dateKey = getDateStrKey(dayNum);
          const dayEvents = filteredEvents.filter(ev => ev.date === dateKey);
          if (dayEvents.length === 0) return null;

          const isToday = dateKey === '2026-09-01';

          return (
            <div key={`agenda-${dayNum}`} className="flex gap-3 p-3">
              <div className="shrink-0 text-center w-10">
                <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-label font-semibold tabular-nums ${
                  isToday ? 'bg-accent text-on-accent' : 'bg-surface-2 text-ink border border-line'
                }`}>
                  {dayNum}
                </span>
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                {dayEvents.map(event => {
                  const look = EVENT_PRESENTATION[event.type];
                  const EventIcon = look.Icon;
                  return (
                    <button
                      key={`agenda-${event.id}`}
                      type="button"
                      onClick={() => onSelectProject(event.project)}
                      className={`w-full min-h-11 text-left p-2 rounded-xs border text-caption cursor-pointer transition-colors duration-150 ease-quint ${look.chip}`}
                    >
                      <span className="flex items-center gap-1.5 font-semibold">
                        <EventIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{look.shortLabel}: {event.projectName}</span>
                      </span>
                      <span className="block text-ink-muted truncate">Cliente: {event.client}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {monthEvents.length === 0 && (
          <p className="p-4 text-label text-ink-subtle text-center">
            Nenhuma entrega marcada para {monthNames[currentMonth]} {currentYear}.
          </p>
        )}
      </div>

      {/* Events Summary Cards for the Current Month */}
      <div className="mt-6 space-y-3">
        <h3 className="text-label font-semibold text-ink-muted pb-2 border-b border-line">
          Resumo de entregas marcadas para {monthNames[currentMonth]} {currentYear}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-grid">
          {monthEvents.map(event => {
            const look = EVENT_PRESENTATION[event.type];
            const EventIcon = look.Icon;
            return (
              <button
                key={`summary-${event.id}`}
                type="button"
                onClick={() => onSelectProject(event.project)}
                className={`w-full min-h-11 text-left p-3 rounded-sm border flex items-start justify-between gap-3 cursor-pointer transition-colors duration-150 ease-quint ${look.chip}`}
              >
                <span className="block min-w-0">
                  <span className={`inline-flex items-center gap-1.5 text-caption uppercase font-semibold tracking-[0.08em] px-2 py-0.5 rounded-xs border ${look.badge}`}>
                    <EventIcon className="w-3 h-3" aria-hidden="true" />
                    {event.ruleLabel}
                  </span>
                  <span className="block text-label font-semibold text-ink mt-2">{event.projectName}</span>
                  <span className="block text-caption text-ink-muted mt-0.5">Cliente: {event.client}</span>
                </span>
                <span className="block text-caption font-semibold text-ink tabular-nums shrink-0">
                  {formatDateBR(event.date)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </section>
  );
}
