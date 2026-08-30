import React from 'react';
import { Sparkles, Plus, AlertTriangle, Layers, Info, LayoutGrid, Calendar as CalendarIcon, Zap } from 'lucide-react';

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
  return (
    <header className="sticky top-0 z-30 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Agent Badge */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-violet-400 p-[1px] shadow-lg shadow-purple-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0B0F19] rounded-full"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                  CORINGA
                </h1>
                <span className="text-[10px] font-semibold tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                  Gerente de Eventos IA
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Regra 6m (Save the Date) • 3m (Convite) • Festa
              </p>
            </div>
          </div>

          {/* Quick Pitch Context Toggle */}
          <button
            onClick={onOpenPitchModal}
            className="flex items-center gap-1.5 text-xs bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 px-2.5 py-1.5 rounded-lg transition-all"
            title="Ver tese do ICP e modelo de negócios"
          >
            <Info className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline font-medium">Ver ICP (R$ 47/mês)</span>
          </button>
        </div>

        {/* View Toggle Controls & Actions */}
        <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
          
          {/* VIEW SWITCHER: PIPELINE vs CALENDÁRIO */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => onSwitchView('pipeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeView === 'pipeline'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Pipeline (Kanban)</span>
            </button>

            <button
              onClick={() => onSwitchView('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeView === 'calendar'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendário</span>
            </button>
          </div>

          {/* Active Projects & Capacity Indicator */}
          <button
            onClick={onOpenCapacityModal}
            className="flex items-center gap-2.5 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-purple-500/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-white">{projectsCount}</span>
              <span className="text-slate-400 hidden sm:inline">projetos</span>
            </div>
            
            <div className="h-4 w-[1px] bg-slate-700"></div>

            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-10 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    persona.capacityPercentage > 85 ? 'bg-amber-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${persona.capacityPercentage}%` }}
                ></div>
              </div>
              <span className={`font-semibold ${persona.capacityPercentage > 85 ? 'text-amber-400' : 'text-slate-300'}`}>
                {persona.capacityPercentage}%
              </span>
            </div>
          </button>

          {/* AI Coringa Quick Trigger */}
          <button
            onClick={onOpenCoringaAgent}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-purple-600/25 border border-purple-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Zap className="w-4 h-4 fill-purple-200 text-purple-200" />
            <span>Falar com o Coringa</span>
          </button>

          {/* New Project Button */}
          <button
            onClick={onOpenNewProject}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs px-3 py-2 rounded-xl border border-slate-700 transition-all"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">+ Novo Evento</span>
          </button>

        </div>
      </div>
    </header>
  );
}
