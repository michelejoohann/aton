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
  Bookmark,
  ChevronUp,
  ChevronDown,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { formatDateBR } from '../utils/dateUtils';

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
  settings,
  onMoveProjectStage,
  onSelectProject
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [onlyRisks, setOnlyRisks] = useState(false);
  const [collapsedColumns, setCollapsedColumns] = useState({});

  const stdWeeks = settings?.saveTheDateWeeks || 6;
  const invWeeks = settings?.invitationWeeks || 3;
  const stdHours = settings?.saveTheDateHours || 5;
  const invHours = settings?.invitationHours || 10;
  const partyHours = settings?.partyHours || 20;

  const categories = ['ALL', 'Casamento', '15 Anos', 'Bodas', 'Corporativo', 'Aniversário', 'Batizado', 'Formatura'];

  const toggleColumnCollapse = (stageId) => {
    setCollapsedColumns(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesRisk = !onlyRisks || p.collisionRisk || p.daysWaitingClient > 2;
    return matchesSearch && matchesCategory && matchesRisk;
  });

  const totalValue = filteredProjects.reduce((acc, p) => acc + p.value, 0);

  return (
    <section className="mb-section space-y-5">

      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-line-strong">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-page-title font-semibold text-ink tracking-tight">
              Pipeline Integrado dos Projetos de Eventos
            </h2>
            <span className="text-caption font-semibold uppercase tracking-[0.1em] bg-surface-2 text-ink-muted border border-line px-2 py-0.5 rounded-xs tabular-nums">
              {filteredProjects.length} Eventos Exibidos
            </span>
          </div>
          <p className="text-label text-ink-muted mt-1.5 max-w-3xl">
            Regras de antecedência: <strong className="font-semibold text-ink">Std ({stdWeeks}w / {stdHours}h)</strong>, <strong className="font-semibold text-ink">Convite ({invWeeks}w / {invHours}h)</strong> e <strong className="font-semibold text-ink">Festa ({partyHours}h)</strong>. Total no filtro: <strong className="font-semibold text-ink tabular-nums">R$ {totalValue.toLocaleString('pt-BR')},00</strong>
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
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

          {/* Category Filter */}
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

          {/* Filter Risks Toggle */}
          <button
            onClick={() => setOnlyRisks(!onlyRisks)}
            className={`inline-flex items-center gap-1.5 min-h-11 px-3 rounded-sm text-label font-semibold border transition-colors ${
              onlyRisks
                ? 'bg-warning-surface border-warning-border text-on-warning'
                : 'bg-surface border-line-control text-ink-muted hover:text-ink hover:bg-surface-2'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Apenas Com Alerta</span>
          </button>
        </div>
      </div>

      {/* 5-Stage Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-grid items-start">
        {STAGES.map(stage => {
          const stageProjects = filteredProjects.filter(p => p.stage === stage.id);
          const stageValue = stageProjects.reduce((acc, p) => acc + p.value, 0);
          const look = STAGE_PRESENTATION[stage.id] || FALLBACK_PRESENTATION;
          const isCollapsed = collapsedColumns[stage.id];

          return (
            <div key={stage.id} className="flex flex-col min-w-0 bg-surface-2/50 rounded-md border border-line p-2">

              {/* Column Header with Collapse Toggle */}
              <div className={`p-2.5 rounded-sm border mb-2 min-h-[3.5rem] flex items-center justify-between gap-2 ${look.header}`}>
                <div className="flex items-center gap-2 min-w-0">
                  <span aria-hidden="true" className={`w-2 h-2 rounded-full shrink-0 ${look.marker}`}></span>
                  <h3 className={`text-caption font-semibold uppercase tracking-[0.04em] truncate ${look.label}`}>
                    {stage.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-caption font-semibold tabular-nums px-1.5 py-0.5 rounded-xs bg-surface border border-line text-ink">
                    {stageProjects.length}
                  </span>
                  <button
                    onClick={() => toggleColumnCollapse(stage.id)}
                    className="p-1 text-ink-muted hover:text-ink rounded-xs hover:bg-surface"
                    title={isCollapsed ? "Expandir Coluna" : "Recolher Coluna"}
                  >
                    {isCollapsed ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Column Content */}
              {!isCollapsed ? (
                <div className="flex flex-col gap-3 min-h-[300px]">
                  {stageProjects.length === 0 ? (
                    <div className="h-28 border border-dashed border-line-strong rounded-sm flex items-center justify-center text-ink-subtle text-caption p-2 text-center">
                      Nenhum projeto
                    </div>
                  ) : (
                    stageProjects.map(project => (
                      <div
                        key={project.id}
                        className={`rounded-sm p-3 border shadow-subtle hover:shadow-raised transition-shadow duration-200 ease-quint cursor-pointer ${
                          project.collisionRisk
                            ? 'bg-urgent-surface border-urgent-border'
                            : 'bg-surface border-line hover:border-line-strong'
                        }`}
                        onClick={() => onSelectProject(project)}
                      >
                        {/* Collision / SLA Ribbon */}
                        {project.collisionRisk && (
                          <div className="mb-2 inline-flex items-center gap-1.5 text-caption font-semibold uppercase tracking-[0.08em] text-on-urgent bg-surface border border-urgent-border px-2 py-0.5 rounded-xs">
                            <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                            Alerta de Prazo
                          </div>
                        )}
                        {(project.stage === 'waiting_approval' || project.daysWaitingClient > 0) && (
                          <div className="mb-2 inline-flex items-center gap-1 text-caption font-bold uppercase tracking-[0.08em] text-on-warning bg-warning-surface border border-warning-border px-2 py-0.5 rounded-xs">
                            <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                            SLA 48h ({project.daysWaitingClient || 1}d sem resposta)
                          </div>
                        )}

                        {/* Project Name & Category */}
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="min-w-0 font-semibold text-label text-ink line-clamp-2">
                            {project.name}
                          </h4>
                          <span className="shrink-0 text-caption uppercase tracking-[0.08em] font-semibold text-ink-muted bg-surface-2 px-1.5 py-0.5 rounded-xs border border-line">
                            {project.category}
                          </span>
                        </div>

                        {/* Client Name */}
                        <p className="text-caption text-ink-muted mb-2">
                          Cliente: <span className="text-ink font-medium">{project.client}</span>
                        </p>

                        {/* 3 MANDATORY DELIVERABLES (Save the Date 6w / Convite 3w / Festa) */}
                        <dl className="space-y-1 mb-3 pt-2 border-t border-line text-caption">

                          {/* Deliverable 1: Save the Date */}
                          <div className="flex items-center justify-between gap-2">
                            <dt className="flex items-center gap-1 text-ink-muted min-w-0">
                              <Bookmark className="w-3 h-3 shrink-0 text-ink-subtle" aria-hidden="true" />
                              <span className="truncate">Std ({stdWeeks}w / {stdHours}h)</span>
                            </dt>
                            <dd className="font-semibold text-ink tabular-nums shrink-0">
                              {formatDateBR(project.saveTheDateDeadline)}
                            </dd>
                          </div>

                          {/* Deliverable 2: Convite */}
                          <div className="flex items-center justify-between gap-2">
                            <dt className="flex items-center gap-1 text-ink-muted min-w-0">
                              <Mail className="w-3 h-3 shrink-0 text-ink-subtle" aria-hidden="true" />
                              <span className="truncate">Convite ({invWeeks}w / {invHours}h)</span>
                            </dt>
                            <dd className="font-semibold text-ink tabular-nums shrink-0">
                              {formatDateBR(project.invitationDeadline)}
                            </dd>
                          </div>

                          {/* Deliverable 3: Festa (Data Final) */}
                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-line">
                            <dt className="flex items-center gap-1 text-ink min-w-0 font-semibold">
                              <PartyPopper className="w-3 h-3 shrink-0 text-accent" aria-hidden="true" />
                              <span className="truncate">Festa ({partyHours}h)</span>
                            </dt>
                            <dd className="font-semibold text-accent tabular-nums shrink-0">
                              {formatDateBR(project.partyDate)}
                            </dd>
                          </div>

                        </dl>

                        {/* Metadata Row: Value & Stage Controls */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-line">
                          <span className="text-caption font-semibold text-ink tabular-nums">
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
                                className="inline-flex items-center justify-center p-1 rounded-sm border border-line-control bg-surface text-ink-muted hover:bg-surface-2 hover:text-ink transition-colors"
                                aria-label={`Voltar etapa de ${project.name}`}
                                title="Voltar etapa"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                            )}

                            {stage.id !== 'final_delivery' && (
                              <button
                                onClick={() => {
                                  const stageKeys = STAGES.map(s => s.id);
                                  const currIdx = stageKeys.indexOf(project.stage);
                                  if (currIdx < stageKeys.length - 1) onMoveProjectStage(project.id, stageKeys[currIdx + 1]);
                                }}
                                className="inline-flex items-center justify-center p-1 rounded-sm border border-line-control bg-surface text-accent hover:bg-accent-soft transition-colors"
                                aria-label={`Avançar etapa de ${project.name}`}
                                title="Avançar etapa"
                              >
                                <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    ))
                  )}
                  {/* Column Footer Subtotal */}
                  <div className="mt-auto pt-2 text-caption text-ink-subtle text-center tabular-nums">
                    R$ {stageValue.toLocaleString('pt-BR')}
                  </div>
                </div>
              ) : (
                <div className="p-2 text-center text-caption text-ink-subtle">
                  Coluna Recolhida ({stageProjects.length})
                </div>
              )}

            </div>
          );
        })}
      </div>

    </section>
  );
}
