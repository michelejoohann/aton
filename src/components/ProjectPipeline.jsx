import React, { useState } from 'react';
import { STAGES } from '../data/mockData';
import {
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  PartyPopper,
  Mail,
  Bookmark
} from 'lucide-react';
import { formatDateBR } from '../utils/dateUtils';

// Apresentação das etapas derivada localmente por id: STAGES continua sendo
// fonte de id, ordem e título — nunca de classe de cor.
const STAGE_PRESENTATION = {
  briefing: { marker: 'bg-ink-subtle', header: 'bg-surface-2 border-line', label: 'text-ink' },
  creation: { marker: 'bg-accent', header: 'bg-accent-soft border-line', label: 'text-ink' },
  waiting_approval: { marker: 'bg-warning', header: 'bg-warning-surface border-warning-border', label: 'text-on-warning' },
  revisions: { marker: 'bg-ink-subtle', header: 'bg-surface-2 border-line', label: 'text-ink' },
  final_delivery: { marker: 'bg-success', header: 'bg-success-surface border-success-border', label: 'text-on-success' }
};

const FALLBACK_PRESENTATION = {
  marker: 'bg-ink-subtle',
  header: 'bg-surface-2 border-line',
  label: 'text-ink'
};

export default function ProjectPipeline({
  projects,
  onMoveProjectStage,
  onSelectProject,
  onOpenAgentAction
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'Casamento', '15 Anos', 'Bodas', 'Corporativo', 'Aniversário', 'Batizado', 'Formatura'];

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalValue = projects.reduce((acc, p) => acc + p.value, 0);

  return (
    <section className="mb-section">

      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 mb-5 border-b border-line-strong">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-page-title font-semibold text-ink tracking-tight">
              Pipeline Integrado dos Projetos de Eventos
            </h2>
            <span className="text-caption font-semibold uppercase tracking-[0.1em] bg-surface-2 text-ink-muted border border-line px-2 py-0.5 rounded-xs">
              9 Eventos Simultâneos
            </span>
          </div>
          <p className="text-label text-ink-muted mt-1.5 max-w-3xl">
            Cada projeto contém obrigatoriamente 3 entregáveis: <strong className="font-semibold text-ink">Save the Date (6m antes)</strong>, <strong className="font-semibold text-ink">Convite (3m antes)</strong> e <strong className="font-semibold text-ink">Festa</strong>. Total em gestão: <strong className="font-semibold text-ink tabular-nums">R$ {totalValue.toLocaleString('pt-BR')},00</strong>
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[12rem] sm:w-52 sm:flex-none">
            <Search className="w-4 h-4 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
            <input
              type="text"
              aria-label="Buscar evento ou cliente"
              placeholder="Buscar evento ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full min-h-11 bg-surface border border-line-control rounded-sm pl-9 pr-3 text-label text-ink placeholder:text-ink-subtle focus:border-accent transition-colors duration-150 ease-quint"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-surface border border-line-control rounded-sm pl-2.5">
            <Filter className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
            <select
              aria-label="Filtrar por tipo de evento"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 self-stretch min-h-11 bg-transparent text-label text-ink font-medium cursor-pointer pr-2.5 py-2"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'Todos os Tipos' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 5-Stage Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-grid">
        {STAGES.map(stage => {
          const stageProjects = filteredProjects.filter(p => p.stage === stage.id);
          const stageValue = stageProjects.reduce((acc, p) => acc + p.value, 0);
          const look = STAGE_PRESENTATION[stage.id] || FALLBACK_PRESENTATION;

          return (
            <div key={stage.id} className="flex flex-col min-w-0">

              {/* Column Header */}
              <div className={`p-3 rounded-sm border mb-3 min-h-[4rem] flex items-start justify-between gap-2 ${look.header}`}>
                <div className="flex items-start gap-2 min-w-0">
                  <span aria-hidden="true" className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${look.marker}`}></span>
                  <h3 className={`text-label font-semibold uppercase tracking-[0.04em] ${look.label}`}>
                    {stage.title}
                  </h3>
                </div>
                <span className="shrink-0 text-caption font-semibold tabular-nums px-2 py-0.5 rounded-xs bg-surface border border-line text-ink">
                  {stageProjects.length}
                </span>
              </div>

              {/* Column Cards Stack */}
              <div className="flex flex-col gap-3 min-h-[350px]">
                {stageProjects.length === 0 ? (
                  <div className="h-32 border border-dashed border-line-strong rounded-sm flex items-center justify-center text-ink-subtle text-label">
                    Nenhum projeto nesta etapa
                  </div>
                ) : (
                  stageProjects.map(project => (
                    <div
                      key={project.id}
                      className={`rounded-sm p-3.5 border shadow-subtle hover:shadow-raised transition-shadow duration-200 ease-quint cursor-pointer ${
                        project.collisionRisk
                          ? 'bg-urgent-surface border-urgent-border'
                          : 'bg-surface border-line hover:border-line-strong'
                      }`}
                      onClick={() => onSelectProject(project)}
                    >
                      {/* Collision Ribbon */}
                      {project.collisionRisk && (
                        <div className="mb-2 inline-flex items-center gap-1.5 text-caption font-semibold uppercase tracking-[0.08em] text-on-urgent bg-surface border border-urgent-border px-2 py-1 rounded-xs">
                          <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                          Risco na Regra de Prazos
                        </div>
                      )}

                      {/* Project Name & Category */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="min-w-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectProject(project);
                            }}
                            className="flex items-center min-h-11 text-left text-label font-semibold text-ink"
                          >
                            <span className="line-clamp-2">{project.name}</span>
                          </button>
                        </h4>
                        <span className="shrink-0 text-caption uppercase tracking-[0.08em] font-semibold text-ink-muted bg-surface-2 px-1.5 py-0.5 rounded-xs border border-line">
                          {project.category}
                        </span>
                      </div>

                      {/* Client Name */}
                      <p className="text-caption text-ink-muted mb-2.5">
                        Cliente: <span className="text-ink font-medium">{project.client}</span>
                      </p>

                      {/* 3 MANDATORY DELIVERABLES (Save the Date 6m / Convite 3m / Festa) */}
                      <dl className="space-y-1 mb-3 pt-2.5 border-t border-line text-caption">

                        {/* Deliverable 1: Save the Date (-6m) */}
                        <div className="flex items-center justify-between gap-2">
                          <dt className="flex items-center gap-1.5 text-ink-muted min-w-0">
                            <Bookmark className="w-3.5 h-3.5 shrink-0 text-ink-subtle" aria-hidden="true" />
                            <span className="truncate">Save the Date (6m)</span>
                          </dt>
                          <dd className="font-semibold text-ink tabular-nums shrink-0">
                            {formatDateBR(project.saveTheDateDeadline)}
                          </dd>
                        </div>

                        {/* Deliverable 2: Convite (-3m) */}
                        <div className="flex items-center justify-between gap-2">
                          <dt className="flex items-center gap-1.5 text-ink-muted min-w-0">
                            <Mail className="w-3.5 h-3.5 shrink-0 text-ink-subtle" aria-hidden="true" />
                            <span className="truncate">Convite (3m)</span>
                          </dt>
                          <dd className="font-semibold text-ink tabular-nums shrink-0">
                            {formatDateBR(project.invitationDeadline)}
                          </dd>
                        </div>

                        {/* Deliverable 3: Festa (Data Final) */}
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-line">
                          <dt className="flex items-center gap-1.5 text-ink min-w-0 font-semibold">
                            <PartyPopper className="w-3.5 h-3.5 shrink-0 text-accent" aria-hidden="true" />
                            <span className="truncate">Festa (Final)</span>
                          </dt>
                          <dd className="font-semibold text-accent tabular-nums shrink-0">
                            {formatDateBR(project.partyDate)}
                          </dd>
                        </div>

                      </dl>

                      {/* Metadata Row: Value & Stage Controls */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-line">
                        <span className="text-label font-semibold text-ink tabular-nums">
                          R$ {project.value.toLocaleString('pt-BR')}
                        </span>

                        {/* Quick Stage Controls */}
                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {stage.id !== 'briefing' && (
                            <button
                              onClick={() => {
                                const stageKeys = STAGES.map(s => s.id);
                                const currIdx = stageKeys.indexOf(project.stage);
                                if (currIdx > 0) onMoveProjectStage(project.id, stageKeys[currIdx - 1]);
                              }}
                              className="inline-flex items-center justify-center min-w-11 min-h-11 rounded-sm border border-line-control bg-surface text-ink-muted hover:bg-surface-2 hover:text-ink transition-colors duration-150 ease-quint"
                              aria-label={`Voltar etapa de ${project.name}`}
                              title="Voltar etapa"
                            >
                              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                            </button>
                          )}

                          {stage.id !== 'final_delivery' && (
                            <button
                              onClick={() => {
                                const stageKeys = STAGES.map(s => s.id);
                                const currIdx = stageKeys.indexOf(project.stage);
                                if (currIdx < stageKeys.length - 1) onMoveProjectStage(project.id, stageKeys[currIdx + 1]);
                              }}
                              className="inline-flex items-center justify-center min-w-11 min-h-11 rounded-sm border border-line-control bg-surface text-accent hover:bg-accent-soft transition-colors duration-150 ease-quint"
                              aria-label={`Avançar etapa de ${project.name}`}
                              title="Avançar etapa"
                            >
                              <ChevronRight className="w-4 h-4" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>

              {/* Column Footer */}
              <div className="mt-2 pt-2 border-t border-line text-caption text-ink-subtle text-center tabular-nums">
                Subtotal: R$ {stageValue.toLocaleString('pt-BR')}
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
