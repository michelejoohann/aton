import React, { useState } from 'react';
import { STAGES } from '../data/mockData';
import { 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  PartyPopper,
  Mail,
  Bookmark
} from 'lucide-react';
import { formatDateBR } from '../utils/dateUtils';

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
    <section className="mb-10">
      
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Pipeline Integrado dos Projetos de Eventos
            </h2>
            <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full font-semibold">
              9 Eventos Simultâneos
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cada projeto contém obrigatoriamente 3 entregáveis: <strong className="text-purple-300">Save the Date (6m antes)</strong>, <strong className="text-amber-300">Convite (3m antes)</strong> e <strong className="text-emerald-300">Festa</strong>. Total em gestão: <strong className="text-emerald-400">R$ {totalValue.toLocaleString('pt-BR')},00</strong>
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar evento ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-xl p-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none pr-2 cursor-pointer font-medium"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                  {cat === 'ALL' ? 'Todos os Tipos' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 5-Stage Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map(stage => {
          const stageProjects = filteredProjects.filter(p => p.stage === stage.id);
          const stageValue = stageProjects.reduce((acc, p) => acc + p.value, 0);

          return (
            <div key={stage.id} className="flex flex-col min-w-[260px] md:min-w-0">
              
              {/* Column Header */}
              <div className={`p-3 rounded-xl border mb-3 ${stage.color} flex items-center justify-between shadow-sm`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${stage.dotColor}`}></span>
                  <h3 className="text-xs font-bold tracking-tight uppercase">
                    {stage.title}
                  </h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/50 text-slate-200">
                  {stageProjects.length}
                </span>
              </div>

              {/* Column Cards Stack */}
              <div className="flex flex-col gap-3 min-h-[350px]">
                {stageProjects.length === 0 ? (
                  <div className="h-32 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-600 text-xs italic">
                    Nenhum projeto nesta etapa
                  </div>
                ) : (
                  stageProjects.map(project => (
                    <div
                      key={project.id}
                      className={`glass-card rounded-xl p-3.5 border transition-all cursor-pointer relative group ${
                        project.collisionRisk 
                          ? 'border-amber-500/50 hover:border-amber-400 bg-amber-950/10' 
                          : 'border-slate-800 hover:border-purple-500/50'
                      }`}
                      onClick={() => onSelectProject(project)}
                    >
                      {/* Collision Ribbon */}
                      {project.collisionRisk && (
                        <div className="mb-2 flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          Risco na Regra de Prazos
                        </div>
                      )}

                      {/* Project Name & Category */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="text-xs font-bold text-slate-100 group-hover:text-purple-300 transition-colors line-clamp-1">
                          {project.name}
                        </h4>
                        <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                          {project.category}
                        </span>
                      </div>

                      {/* Client Name */}
                      <p className="text-xs text-slate-400 mb-2">
                        Cliente: <span className="text-slate-300 font-medium">{project.client}</span>
                      </p>

                      {/* 3 MANDATORY DELIVERABLES BADGES (Save the Date 6m / Convite 3m / Festa) */}
                      <div className="space-y-1 my-2.5 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 text-[10px]">
                        
                        {/* Deliverable 1: Save the Date (-6m) */}
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="flex items-center gap-1 text-purple-300 font-medium">
                            📌 Save the Date (6m):
                          </span>
                          <span className="font-bold text-slate-200">
                            {formatDateBR(project.saveTheDateDeadline)}
                          </span>
                        </div>

                        {/* Deliverable 2: Convite (-3m) */}
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="flex items-center gap-1 text-amber-300 font-medium">
                            💌 Convite (3m):
                          </span>
                          <span className="font-bold text-slate-200">
                            {formatDateBR(project.invitationDeadline)}
                          </span>
                        </div>

                        {/* Deliverable 3: Festa (Data Final) */}
                        <div className="flex items-center justify-between text-emerald-300 font-bold pt-1 border-t border-slate-800/80">
                          <span className="flex items-center gap-1">
                            🎉 Festa (Final):
                          </span>
                          <span className="text-emerald-400">
                            {formatDateBR(project.partyDate)}
                          </span>
                        </div>

                      </div>

                      {/* Metadata Row: Value & Stage Controls */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span className="font-bold text-emerald-400">
                          R$ {project.value.toLocaleString('pt-BR')}
                        </span>

                        {/* Quick Stage Controls */}
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          {stage.id !== 'briefing' && (
                            <button
                              onClick={() => {
                                const stageKeys = STAGES.map(s => s.id);
                                const currIdx = stageKeys.indexOf(project.stage);
                                if (currIdx > 0) onMoveProjectStage(project.id, stageKeys[currIdx - 1]);
                              }}
                              className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                              title="Voltar etapa"
                            >
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                          )}
                          
                          {stage.id !== 'final_delivery' && (
                            <button
                              onClick={() => {
                                const stageKeys = STAGES.map(s => s.id);
                                const currIdx = stageKeys.indexOf(project.stage);
                                if (currIdx < stageKeys.length - 1) onMoveProjectStage(project.id, stageKeys[currIdx + 1]);
                              }}
                              className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-purple-300 border border-slate-700 transition-colors"
                              title="Avançar etapa"
                            >
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>

              {/* Column Footer */}
              <div className="mt-2 text-[10px] text-slate-500 text-center font-medium">
                Subtotal: R$ {stageValue.toLocaleString('pt-BR')}
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
