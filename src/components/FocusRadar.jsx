import React, { useState } from 'react';
import { Clock, ArrowRight, Bookmark, Mail, PartyPopper, Sun, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Film } from 'lucide-react';
import { formatDateBR, getDaysDiffFromToday } from '../utils/dateUtils.js';

export default function FocusRadar({ projects = [], settings, onSelectProject, onOpenAgentAction }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filterRisk, setFilterRisk] = useState('ALL'); // 'ALL' | 'CRITICAL'

  const stdWeeks = settings?.saveTheDateWeeks || 6;
  const invWeeks = settings?.invitationWeeks || 3;
  const stdHours = settings?.saveTheDateHours || 5;
  const invHours = settings?.invitationHours || 10;
  const partyHours = settings?.partyHours || 20;

  // Identifica projetos com risco real, SLA excedido ou deadline iminente (<= 7 dias)
  const criticalProjects = projects.filter(p => {
    const stdDays = p.saveTheDateDeadline ? getDaysDiffFromToday(p.saveTheDateDeadline) : 999;
    const invDays = p.invitationDeadline ? getDaysDiffFromToday(p.invitationDeadline) : 999;
    return Boolean(
      p.collisionRisk ||
      (p.daysWaitingClient && p.daysWaitingClient > 2) ||
      (stdDays >= 0 && stdDays <= 7 && p.stage !== 'final_delivery') ||
      (invDays >= 0 && invDays <= 7 && p.stage !== 'final_delivery') ||
      (p.hasRetrospective && !p.assetsReceived && getDaysDiffFromToday(p.partyDate) <= 15)
    );
  });

  const displayedProjects = filterRisk === 'CRITICAL' ? criticalProjects : projects;

  return (
    <section className="bg-surface rounded-md border border-line p-panel shadow-subtle transition-all duration-200">
      
      {/* Title & Diagnostic Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-line">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 text-accent hover:bg-accent-soft transition-colors"
            title={isCollapsed ? "Expandir Radar de Foco" : "Recolher Radar de Foco"}
            aria-label={isCollapsed ? "Expandir Radar de Foco" : "Recolher Radar de Foco"}
          >
            <Sun className="w-5 h-5" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-section-title font-semibold text-ink">
                Radar de Foco &amp; Monitor de Regras
              </h2>
              <span className="text-caption font-medium bg-surface-2 text-ink-muted border border-line px-2 py-0.5 rounded-xs">
                Regras: Std ({stdWeeks}w / {stdHours}h) • Convite ({invWeeks}w / {invHours}h) • Festa ({partyHours}h)
              </span>
            </div>
            <p className="text-caption text-ink-muted mt-0.5">
              Cálculo retroativo automático a partir da data de cada festa para prevenir atrasos e colisão de produção.
            </p>
          </div>
        </div>

        {/* Controls: Filter & Collapse Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-surface-2 border border-line-control rounded-sm p-1">
            <button
              onClick={() => setFilterRisk('ALL')}
              className={`px-3 py-1.5 text-caption font-semibold rounded-xs transition-colors ${
                filterRisk === 'ALL' ? 'bg-accent text-on-accent' : 'text-ink-muted hover:text-ink'
              }`}
            >
              Todos ({projects.length})
            </button>
            <button
              onClick={() => setFilterRisk('CRITICAL')}
              className={`px-3 py-1.5 text-caption font-semibold rounded-xs transition-colors flex items-center gap-1.5 ${
                filterRisk === 'CRITICAL' ? 'bg-warning text-on-warning' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Risco Crítico ({criticalProjects.length})</span>
            </button>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-line-control text-caption font-semibold text-ink-muted hover:text-ink hover:bg-surface-2 transition-colors"
          >
            {isCollapsed ? (
              <>
                <span>Expandir Painel</span>
                <ChevronDown className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Recolher Painel</span>
                <ChevronUp className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dynamic Project Cards Grid */}
      {!isCollapsed && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-grid mt-5">
          {displayedProjects.length === 0 ? (
            <div className="col-span-full py-8 text-center text-ink-muted bg-surface-2 rounded-sm border border-line">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
              <p className="text-label font-semibold text-ink">Nenhum projeto em risco crítico no momento!</p>
              <p className="text-caption">Todos os prazos retroativos e SLAs de clientes estão dentro do planejado.</p>
            </div>
          ) : (
            displayedProjects.map(project => {
              const daysToParty = getDaysDiffFromToday(project.partyDate);
              const daysToStd = project.saveTheDateDeadline ? getDaysDiffFromToday(project.saveTheDateDeadline) : null;
              const daysToInv = project.invitationDeadline ? getDaysDiffFromToday(project.invitationDeadline) : null;
              const isOverdue = project.collisionRisk || (project.daysWaitingClient && project.daysWaitingClient > 2) || (daysToStd !== null && daysToStd < 0 && project.stage !== 'final_delivery');

              return (
                <article
                  key={project.id}
                  className={`flex flex-col rounded-md p-4 shadow-subtle border transition-all ${
                    isOverdue
                      ? 'bg-warning-surface border-warning-border'
                      : project.stage === 'final_delivery'
                      ? 'bg-surface border-emerald-500/30'
                      : 'bg-surface border-line hover:border-line-strong'
                  }`}
                >
                  {/* Card Header Badge */}
                  <div className={`flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b ${
                    isOverdue ? 'border-warning-border' : 'border-line'
                  }`}>
                    <span className={`inline-flex items-center gap-1 text-caption font-semibold uppercase tracking-[0.08em] px-2 py-0.5 rounded-xs border ${
                      isOverdue
                        ? 'text-on-warning bg-surface border-warning-border'
                        : 'text-accent bg-accent-soft border-line'
                    }`}>
                      {isOverdue ? (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>Alerta de Produção</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>{project.category || 'Evento'}</span>
                        </>
                      )}
                    </span>

                    <span className="text-caption font-semibold tabular-nums text-ink-muted">
                      {daysToParty > 0 ? `Festa em ${daysToParty} dias` : `Evento em ${formatDateBR(project.partyDate)}`}
                    </span>
                  </div>

                  {/* Project Title & Client */}
                  <h3 className="text-label font-semibold text-ink mb-1 truncate" title={project.name}>
                    {project.name}
                  </h3>
                  <p className="text-caption text-ink-muted mb-2">
                    Cliente: <strong className="text-ink font-medium">{project.client}</strong> • Festa: <strong className="text-ink font-medium">{formatDateBR(project.partyDate)}</strong>
                  </p>

                  {/* Diagnostic / Risk Alert Message */}
                  <div className="text-caption text-ink-muted mb-4 flex-1 space-y-1.5">
                    {project.riskMessage ? (
                      <p className="text-on-warning font-medium bg-surface/80 p-2 rounded-xs border border-warning-border">
                        ⚠ {project.riskMessage}
                      </p>
                    ) : (
                      <p className="text-ink-subtle">
                        {project.lastUpdate || 'Cronograma dentro dos parâmetros ideais.'}
                      </p>
                    )}

                    {/* Quick Milestones Summary */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.saveTheDateDeadline && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-surface-2 border border-line px-1.5 py-0.5 rounded-xs text-ink-muted" title={`Save the Date: ${formatDateBR(project.saveTheDateDeadline)}`}>
                          <Bookmark className="w-3 h-3 text-accent" />
                          <span>Std: {formatDateBR(project.saveTheDateDeadline)}</span>
                        </span>
                      )}
                      {project.invitationDeadline && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-surface-2 border border-line px-1.5 py-0.5 rounded-xs text-ink-muted" title={`Convite: ${formatDateBR(project.invitationDeadline)}`}>
                          <Mail className="w-3 h-3 text-purple-500" />
                          <span>Convite: {formatDateBR(project.invitationDeadline)}</span>
                        </span>
                      )}
                      {project.hasRetrospective && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-surface-2 border border-line px-1.5 py-0.5 rounded-xs text-ink-muted">
                          <Film className="w-3 h-3 text-cyan-500" />
                          <span>Retro {project.assetsReceived ? '✓' : '⚠ Assets'}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className={`pt-2 border-t flex items-center justify-between ${
                    isOverdue ? 'border-warning-border' : 'border-line'
                  }`}>
                    <span className="text-caption font-bold text-ink tabular-nums">
                      R$ {project.value?.toLocaleString('pt-BR')}
                    </span>
                    <button
                      onClick={() => onSelectProject(project)}
                      className="inline-flex items-center gap-1 text-caption font-semibold text-accent hover:text-accent-hover transition-colors"
                    >
                      <span>Ver Detalhes</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}
    </section>
  );
}
