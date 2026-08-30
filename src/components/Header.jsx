import React from 'react';
import { Plus, Layers, Info, LayoutGrid, Calendar as CalendarIcon, Sun, AlertTriangle } from 'lucide-react';

export default function Header({
  persona,
  projectsCount,
  activeView,
  onSwitchView,
  onOpenNewProject,
  onOpenCoringaAgent,
  onOpenPitchModal,
  onOpenCapacityModal
}) {
  const isOverloaded = persona.capacityPercentage > 85;

  const viewButtonClass = (view) =>
    `inline-flex items-center justify-center gap-1.5 min-h-11 px-3 rounded-sm text-label font-semibold transition-colors duration-150 ease-quint ${
      activeView === view
        ? 'bg-accent text-on-accent'
        : 'text-ink-muted hover:text-ink hover:bg-surface-2'
    }`;

  return (
    <header className="sticky top-0 z-sticky bg-surface-2 border-b border-line px-page-x lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">

        {/* Brand & Agent Badge */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            {/* Marca Amozir: eixo vertical, conexões de rizoma sob a
                superfície e o pivô em acento. */}
            <svg
              aria-hidden="true"
              viewBox="0 0 40 40"
              fill="none"
              className="h-10 w-10 shrink-0 text-ink"
            >
              <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M20 5v30" />
                <path d="M20 15 8 22" />
                <path d="M20 25 32 18" />
              </g>
              <circle cx="8" cy="22" r="2" fill="currentColor" />
              <circle cx="32" cy="18" r="2" fill="currentColor" />
              <circle cx="20" cy="20" r="4.5" className="text-accent" fill="currentColor" />
            </svg>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-page-title font-semibold tracking-tight text-ink">
                  Amozir
                </h1>
                <span className="text-caption font-medium bg-surface text-ink-muted border border-line px-2 py-0.5 rounded-xs">
                  Agente de gestão multiprojeto
                </span>
              </div>
              <p className="text-caption text-ink-muted">
                Do prazo final ao próximo passo
              </p>
            </div>
          </div>

          {/* Quick Pitch Context Toggle */}
          <button
            onClick={onOpenPitchModal}
            aria-label="Ver tese do ICP e modelo de negócios"
            title="Ver tese do ICP e modelo de negócios"
            className="inline-flex items-center justify-center gap-1.5 min-h-11 min-w-11 px-3 rounded-sm text-label font-medium text-ink-muted border border-line-control bg-surface hover:bg-surface-2 hover:text-ink transition-colors duration-150 ease-quint"
          >
            <Info className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline whitespace-nowrap">Ver ICP (R$ 47/mês)</span>
          </button>
        </div>

        {/* View Toggle Controls & Actions */}
        <div className="flex flex-wrap items-center justify-start md:justify-end gap-2 w-full md:w-auto">

          {/* VIEW SWITCHER: PIPELINE vs CALENDÁRIO */}
          <div className="flex items-center gap-1 bg-surface border border-line-control rounded-sm p-1">
            <button onClick={() => onSwitchView('pipeline')} className={viewButtonClass('pipeline')}>
              <LayoutGrid className="w-4 h-4" aria-hidden="true" />
              <span className="whitespace-nowrap">Pipeline (Kanban)</span>
            </button>

            <button onClick={() => onSwitchView('calendar')} className={viewButtonClass('calendar')}>
              <CalendarIcon className="w-4 h-4" aria-hidden="true" />
              <span className="whitespace-nowrap">Calendário</span>
            </button>
          </div>

          {/* Active Projects & Capacity Indicator */}
          <button
            onClick={onOpenCapacityModal}
            aria-label={`Diagnóstico de capacidade: ${projectsCount} projetos, ${persona.capacityPercentage}% de ocupação${isOverloaded ? ' — sobrecarga' : ''}`}
            className="inline-flex items-center gap-2.5 min-h-11 px-3 rounded-sm bg-surface border border-line-control hover:border-ink-subtle transition-colors duration-150 ease-quint"
          >
            <span className="flex items-center gap-1.5 text-label text-ink-muted">
              <Layers className="w-4 h-4" aria-hidden="true" />
              <strong className="font-semibold text-ink tabular-nums">{projectsCount}</strong>
              <span className="hidden sm:inline">projetos</span>
            </span>

            <span aria-hidden="true" className="h-5 w-px bg-line"></span>

            <span className="flex items-center gap-1.5 text-label">
              <span className="w-12 bg-surface-2 rounded-full h-1.5 overflow-hidden border border-line">
                <span
                  className={`block h-full rounded-full transition-[width] duration-200 ease-quint ${
                    isOverloaded ? 'bg-warning' : 'bg-accent'
                  }`}
                  style={{ width: `${persona.capacityPercentage}%` }}
                ></span>
              </span>
              <span className={`font-semibold tabular-nums ${isOverloaded ? 'text-on-warning' : 'text-ink-muted'}`}>
                {persona.capacityPercentage}%
              </span>
              {isOverloaded && (
                <span className="inline-flex items-center gap-1 text-caption font-semibold uppercase tracking-[0.1em] text-on-warning">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  Alerta
                </span>
              )}
            </span>
          </button>

          {/* Gatilho rápido do agente Amozir */}
          <button
            onClick={onOpenCoringaAgent}
            className="inline-flex items-center gap-2 min-h-11 px-4 rounded-sm bg-accent hover:bg-accent-hover text-on-accent text-label font-semibold transition-colors duration-150 ease-quint"
          >
            <Sun className="w-4 h-4" aria-hidden="true" />
            <span className="whitespace-nowrap">Falar com o Amozir</span>
          </button>

          {/* New Project Button */}
          <button
            onClick={onOpenNewProject}
            aria-label="Cadastrar novo evento"
            className="inline-flex items-center justify-center gap-1.5 min-h-11 min-w-11 px-3 rounded-sm bg-surface border border-line-control text-ink text-label font-semibold hover:bg-surface-2 transition-colors duration-150 ease-quint"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline whitespace-nowrap">+ Novo Evento</span>
          </button>

        </div>
      </div>
    </header>
  );
}
