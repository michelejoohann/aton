import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Clock, 
  Tag, 
  CheckCircle2, 
  PartyPopper,
  Mail,
  Bookmark
} from 'lucide-react';
import { formatDateBR } from '../utils/dateUtils';

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
      title: `📌 Save the Date: ${project.name}`,
      ruleLabel: 'Save the Date (6m antes)',
      date: project.saveTheDateDeadline,
      partyDate: project.partyDate,
      color: 'bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30',
      badgeColor: 'bg-purple-500 text-white',
      project
    });

    // 2. Convite (-3m)
    allEvents.push({
      id: `${project.id}-inv`,
      projectId: project.id,
      projectName: project.name,
      client: project.client,
      type: 'INVITATION',
      title: `💌 Convite Oficial: ${project.name}`,
      ruleLabel: 'Convite (3m antes)',
      date: project.invitationDeadline,
      partyDate: project.partyDate,
      color: 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30',
      badgeColor: 'bg-amber-500 text-slate-950 font-bold',
      project
    });

    // 3. Festa (Data Final)
    allEvents.push({
      id: `${project.id}-party`,
      projectId: project.id,
      projectName: project.name,
      client: project.client,
      type: 'PARTY',
      title: `🎉 FESTA: ${project.name}`,
      ruleLabel: 'Data da Festa (Prazo Final)',
      date: project.partyDate,
      partyDate: project.partyDate,
      color: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30 font-bold',
      badgeColor: 'bg-emerald-500 text-slate-950 font-bold',
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

  return (
    <section className="mb-10">
      
      {/* Calendar Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Visão de Calendário — Cronograma de Entregáveis
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visualização automática pela regra: <strong className="text-purple-300">Save the Date (6m antes)</strong>, <strong className="text-amber-300">Convite (3m antes)</strong> e <strong className="text-emerald-300">Data da Festa</strong>.
          </p>
        </div>

        {/* Month Navigation & Type Filter */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Deliverable Type Filters */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-xl p-1 text-xs">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterType === 'ALL' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos ({allEvents.length})
            </button>
            <button
              onClick={() => setFilterType('SAVE_THE_DATE')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                filterType === 'SAVE_THE_DATE' ? 'bg-purple-600 text-white font-bold' : 'text-purple-400 hover:text-purple-300'
              }`}
            >
              📌 6m (Save the Date)
            </button>
            <button
              onClick={() => setFilterType('INVITATION')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                filterType === 'INVITATION' ? 'bg-amber-600 text-white font-bold' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              💌 3m (Convite)
            </button>
            <button
              onClick={() => setFilterType('PARTY')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                filterType === 'PARTY' ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              🎉 Festa
            </button>
          </div>

          {/* Month Switcher Controls */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-xl p-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Mês Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-slate-100 min-w-[130px] text-center px-2">
              {monthNames[currentMonth]} {currentYear}
            </span>

            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Próximo Mês"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg transition-colors border border-slate-700"
            >
              Hoje
            </button>
          </div>

        </div>
      </div>

      {/* Calendar Grid */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-4 shadow-xl overflow-hidden">
        
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 mb-2 border-b border-slate-800/80 pb-2 uppercase tracking-wider">
          <span className="text-amber-400/80">Dom</span>
          <span>Seg</span>
          <span>Ter</span>
          <span>Qua</span>
          <span>Qui</span>
          <span>Sex</span>
          <span className="text-amber-400/80">Sáb</span>
        </div>

        {/* Days Cells Grid */}
        <div className="grid grid-cols-7 gap-1.5 auto-rows-fr">
          {calendarDays.map((dayNum, index) => {
            if (!dayNum) {
              return (
                <div key={`empty-${index}`} className="min-h-[100px] bg-slate-950/20 rounded-xl border border-slate-900/50"></div>
              );
            }

            const dateKey = getDateStrKey(dayNum);
            const dayEvents = filteredEvents.filter(ev => ev.date === dateKey);
            const isToday = dateKey === '2026-09-01';

            return (
              <div
                key={`day-${dayNum}`}
                className={`min-h-[110px] p-2 rounded-xl border flex flex-col justify-between transition-all ${
                  isToday 
                    ? 'bg-purple-950/30 border-purple-500/60 shadow-lg shadow-purple-950/40' 
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${
                    isToday ? 'w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center' : 'text-slate-300'
                  }`}>
                    {dayNum}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[9px] font-extrabold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded-full border border-slate-700">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                {/* Day Events Badges List */}
                <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[85px]">
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      onClick={() => onSelectProject(event.project)}
                      className={`p-1.5 rounded-lg border text-[10px] font-medium leading-tight cursor-pointer transition-all ${event.color}`}
                      title={`${event.title} (Festa: ${formatDateBR(event.partyDate)})`}
                    >
                      <div className="font-bold truncate">
                        {event.type === 'SAVE_THE_DATE' && '📌 Std (-6m): '}
                        {event.type === 'INVITATION' && '💌 Convite (-3m): '}
                        {event.type === 'PARTY' && '🎉 FESTA: '}
                        {event.projectName.replace('Casamento ', '').replace('Aniversário ', '')}
                      </div>
                      <div className="text-[9px] opacity-80 truncate">{event.client}</div>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Events Summary Cards for the Current Month */}
      <div className="mt-6 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span>Resumo de Entregas Marcadas para {monthNames[currentMonth]} {currentYear}:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {filteredEvents
            .filter(ev => ev.date.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`))
            .map(event => (
              <div
                key={`summary-${event.id}`}
                onClick={() => onSelectProject(event.project)}
                className={`p-3 rounded-xl border flex items-start justify-between gap-3 cursor-pointer transition-all hover:scale-[1.01] ${event.color}`}
              >
                <div>
                  <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded ${event.badgeColor}`}>
                    {event.ruleLabel}
                  </span>
                  <h4 className="text-xs font-bold text-slate-100 mt-1.5">{event.projectName}</h4>
                  <p className="text-[11px] opacity-80 mt-0.5">Cliente: {event.client}</p>
                </div>
                <div className="text-right text-[11px] font-bold shrink-0">
                  {formatDateBR(event.date)}
                </div>
              </div>
            ))}
        </div>
      </div>

    </section>
  );
}
