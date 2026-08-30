import React from 'react';
import { Clock, ArrowRight, Bookmark, Mail, PartyPopper, Sun } from 'lucide-react';

export default function FocusRadar({ projects, onSelectProject, onOpenAgentAction }) {
  // Projects with collision risks or deliverable deadlines
  const waitingApprovalProjects = projects.filter(p => p.stage === 'waiting_approval');

  return (
    <section className="mb-section">
      {/* Title & Diagnostic Banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 mb-5 border-b border-line-strong">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-accent"
          >
            <Sun className="w-5 h-5" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-section-title font-semibold text-ink">
                Radar de Foco &amp; Monitor de Regras
              </h2>
              <span className="text-caption font-medium bg-surface-2 text-ink-muted border border-line px-2 py-0.5 rounded-xs">
                Regra Automática: 6m (Save the Date) • 3m (Convite)
              </span>
            </div>
            <p className="text-label text-ink-muted mt-1">
              O Amozir calculou retroativamente a partir das datas das festas para garantir que nada atrase.
            </p>
          </div>
        </div>

        <dl className="flex flex-wrap items-center gap-x-4 gap-y-1 text-label text-ink-muted lg:justify-end">
          <div className="flex items-center gap-1.5">
            <Bookmark className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
            <dt className="sr-only">Save the Dates</dt>
            <dd><strong className="font-semibold text-ink tabular-nums">9</strong> Save the Dates</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
            <dt className="sr-only">Convites</dt>
            <dd><strong className="font-semibold text-ink tabular-nums">9</strong> Convites</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <PartyPopper className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
            <dt className="sr-only">Festas</dt>
            <dd><strong className="font-semibold text-ink tabular-nums">9</strong> Festas</dd>
          </div>
        </dl>
      </div>

      {/* 3 Main Focus Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-grid">

        {/* FICHA 1: Alerta de Regra de Convite (3 Meses Antes da Festa) */}
        <article className="flex flex-col bg-warning-surface border border-warning-border rounded-md p-panel shadow-subtle">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-warning-border">
            <span className="inline-flex items-center gap-1.5 text-caption font-semibold uppercase tracking-[0.1em] text-on-warning bg-surface border border-warning-border px-2 py-1 rounded-xs">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              Regra 3 Meses Antes (Convite)
            </span>
            <span className="text-caption font-semibold text-on-warning tabular-nums">
              Prazo limite: Set/2026
            </span>
          </div>

          <h3 className="text-section-title font-semibold text-ink mb-2">
            15 Anos Beatriz — Festa em 10/12/2026
          </h3>

          <p className="text-label text-ink-muted mb-4 flex-1">
            Pela regra dos <strong className="font-semibold text-ink">3 meses antes</strong>, o Convite precisa estar impresso até <strong className="font-semibold text-ink tabular-nums">10/09/2026</strong>. A arte está travada na aprovação do cliente há 4 dias.
          </p>

          <div className="pt-3 border-t border-warning-border">
            <button
              onClick={() => {
                const proj = projects.find(p => p.id === 'proj-2');
                if (proj) onSelectProject(proj);
              }}
              className="inline-flex items-center gap-1.5 min-h-11 px-2 -mx-2 rounded-sm text-label font-semibold text-accent hover:text-accent-hover transition-colors duration-150 ease-quint"
            >
              Ver Entregáveis da Festa
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </article>

        {/* FICHA 2: Regra de Save the Date (6 Meses Antes) */}
        <article className="flex flex-col bg-surface border border-line rounded-md p-panel shadow-subtle">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-line">
            <span className="inline-flex items-center gap-1.5 text-caption font-semibold uppercase tracking-[0.1em] text-accent bg-accent-soft border border-line px-2 py-1 rounded-xs">
              <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
              Regra 6 Meses Antes (Save the Date)
            </span>
            <span className="text-caption font-semibold text-accent tabular-nums">
              Prazo limite: 15/09/2026
            </span>
          </div>

          <h3 className="text-section-title font-semibold text-ink mb-2">
            Casamento Marina &amp; Gustavo — Festa 15/03/2027
          </h3>

          <p className="text-label text-ink-muted mb-4 flex-1">
            A festa é em Março/2027. O Save the Date deve ser disparado impreterivelmente até <strong className="font-semibold text-ink tabular-nums">15/09/2026 (6 meses antes)</strong> para garantia dos convidados.
          </p>

          <div className="pt-3 border-t border-line">
            <button
              onClick={() => {
                const proj = projects.find(p => p.id === 'proj-1');
                if (proj) onSelectProject(proj);
              }}
              className="inline-flex items-center gap-1.5 min-h-11 px-2 -mx-2 rounded-sm text-label font-semibold text-accent hover:text-accent-hover transition-colors duration-150 ease-quint"
            >
              Abrir Save the Date
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </article>

        {/* FICHA 3: Próxima Festa / Evento Final */}
        <article className="flex flex-col bg-surface border border-line rounded-md p-panel shadow-subtle">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-line">
            <span className="inline-flex items-center gap-1.5 text-caption font-semibold uppercase tracking-[0.1em] text-on-success bg-success-surface border border-success-border px-2 py-1 rounded-xs">
              <PartyPopper className="w-3.5 h-3.5" aria-hidden="true" />
              Data Final da Festa Próxima
            </span>
            <span className="text-caption font-medium text-ink-muted tabular-nums">Em 11 dias</span>
          </div>

          <h3 className="text-section-title font-semibold text-ink mb-2">
            Gala Anual TechCorp 2026 — 12/09/2026
          </h3>

          <p className="text-label text-ink-muted mb-4 flex-1">
            Save the Date e Convites já foram entregues! Faltam apenas os brindes e painéis decorativos do dia da festa.
          </p>

          <div className="pt-3 border-t border-line">
            <button
              onClick={() => {
                const proj = projects.find(p => p.id === 'proj-5');
                if (proj) onSelectProject(proj);
              }}
              className="inline-flex items-center gap-1.5 min-h-11 px-2 -mx-2 rounded-sm text-label font-semibold text-accent hover:text-accent-hover transition-colors duration-150 ease-quint"
            >
              Conferir Kit de Festa
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </article>

      </div>
    </section>
  );
}
