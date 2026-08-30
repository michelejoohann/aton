import React, { useState } from 'react';
import { Clock, ArrowRight, Bookmark, Mail, PartyPopper, Sun, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

export default function FocusRadar({ projects, settings, onSelectProject }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filterRisk, setFilterRisk] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'WARNING'

  const stdWeeks = settings?.saveTheDateWeeks || 6;
  const invWeeks = settings?.invitationWeeks || 3;
  const stdHours = settings?.saveTheDateHours || 5;
  const invHours = settings?.invitationHours || 10;
  const partyHours = settings?.partyHours || 20;

  // Projetos com risco ou pendências urgentes
  const criticalProjects = projects.filter(p => p.collisionRisk || p.daysWaitingClient > 2);

  const filteredProjects = projects.filter(p => {
    if (filterRisk === 'CRITICAL') return p.collisionRisk;
    if (filterRisk === 'WARNING') return p.daysWaitingClient > 0;
    return true;
  });

  return (
    <section className="bg-surface rounded-md border border-line p-panel shadow-subtle transition-all duration-200">
      
      {/* Title & Diagnostic Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-line">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 text-accent hover:bg-accent-soft transition-colors"
            title={isCollapsed ? "Expandir Radar de Foco" : "Recolher Radar de Foco"}
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
              className={`px-2.5 py-1 text-caption font-semibold rounded-xs transition-colors ${
                filterRisk === 'ALL' ? 'bg-accent text-on-accent' : 'text-ink-muted hover:text-ink'
              }`}
            >
              Todos ({projects.length})
            </button>
            <button
              onClick={() => setFilterRisk('CRITICAL')}
              className={`px-2.5 py-1 text-caption font-semibold rounded-xs transition-colors ${
                filterRisk === 'CRITICAL' ? 'bg-warning text-on-warning' : 'text-ink-muted hover:text-ink'
              }`}
            >
              Risco Crítico ({criticalProjects.length})
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

      {/* Main Focus Cards Grid (Exibido apenas quando expandido) */}
      {!isCollapsed && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-grid mt-5">

          {/* FICHA 1: Alerta de Regra de Convite (3 Semanas Antes da Festa) */}
          <article className="flex flex-col bg-warning-surface border border-warning-border rounded-md p-4 shadow-subtle">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b border-warning-border">
              <span className="inline-flex items-center gap-1.5 text-caption font-semibold uppercase tracking-[0.1em] text-on-warning bg-surface border border-warning-border px-2 py-0.5 rounded-xs">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                Convite ({invWeeks} semanas / {invHours}h)
              </span>
              <span className="text-caption font-semibold text-on-warning tabular-nums">
                Aprovação Pendente
              </span>
            </div>

            <h3 className="text-label font-semibold text-ink mb-1">
              15 Anos Beatriz — Festa em 30/09/2026
            </h3>

            <p className="text-caption text-ink-muted mb-4 flex-1">
              Pela regra de <strong className="font-semibold text-ink">{invWeeks} semanas antes</strong> ({invHours}h de produção), o Convite precisa estar aprovado. O layout está travado com a mãe há 4 dias.
            </p>

            <div className="pt-2 border-t border-warning-border">
              <button
                onClick={() => {
                  const proj = projects.find(p => p.id === 'proj-2');
                  if (proj) onSelectProject(proj);
                }}
                className="inline-flex items-center gap-1 text-caption font-semibold text-accent hover:text-accent-hover transition-colors"
              >
                <span>Ver Entregáveis da Festa</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </article>

          {/* FICHA 2: Regra de Save the Date (6 Semanas Antes) */}
          <article className="flex flex-col bg-surface border border-line rounded-md p-4 shadow-subtle">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b border-line">
              <span className="inline-flex items-center gap-1.5 text-caption font-semibold uppercase tracking-[0.1em] text-accent bg-accent-soft border border-line px-2 py-0.5 rounded-xs">
                <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
                Save the Date ({stdWeeks} sem / {stdHours}h)
              </span>
              <span className="text-caption font-semibold text-accent tabular-nums">
                Prazo Limite Próximo
              </span>
            </div>

            <h3 className="text-label font-semibold text-ink mb-1">
              Casamento Marina &amp; Gustavo — Festa 15/10/2026
            </h3>

            <p className="text-caption text-ink-muted mb-4 flex-1">
              Festa em Outubro. O Save the Date deve ser disparado em até <strong className="font-semibold text-ink">{stdWeeks} semanas antes</strong> para garantir a agenda dos convidados.
            </p>

            <div className="pt-2 border-t border-line">
              <button
                onClick={() => {
                  const proj = projects.find(p => p.id === 'proj-1');
                  if (proj) onSelectProject(proj);
                }}
                className="inline-flex items-center gap-1 text-caption font-semibold text-accent hover:text-accent-hover transition-colors"
              >
                <span>Abrir Save the Date</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </article>

          {/* FICHA 3: Próxima Festa / Evento Final */}
          <article className="flex flex-col bg-surface border border-line rounded-md p-4 shadow-subtle">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b border-line">
              <span className="inline-flex items-center gap-1.5 text-caption font-semibold uppercase tracking-[0.1em] text-on-success bg-success-surface border border-success-border px-2 py-0.5 rounded-xs">
                <PartyPopper className="w-3.5 h-3.5" aria-hidden="true" />
                Festa Final ({partyHours}h produção)
              </span>
              <span className="text-caption font-medium text-ink-muted tabular-nums">Em 11 dias</span>
            </div>

            <h3 className="text-label font-semibold text-ink mb-1">
              Gala Anual TechCorp 2026 — 12/09/2026
            </h3>

            <p className="text-caption text-ink-muted mb-4 flex-1">
              Save the Date e Convites entregues! Resta a etapa final de montagem dos kits de festa ({partyHours}h de produção).
            </p>

            <div className="pt-2 border-t border-line">
              <button
                onClick={() => {
                  const proj = projects.find(p => p.id === 'proj-5');
                  if (proj) onSelectProject(proj);
                }}
                className="inline-flex items-center gap-1 text-caption font-semibold text-accent hover:text-accent-hover transition-colors"
              >
                <span>Conferir Kit de Festa</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </article>

        </div>
      )}
    </section>
  );
}
