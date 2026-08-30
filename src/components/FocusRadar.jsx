import React from 'react';
import { Clock, CheckCircle2, ArrowRight, ShieldAlert, Sparkles, Calendar, PartyPopper } from 'lucide-react';
import { formatDateBR } from '../utils/dateUtils';

export default function FocusRadar({ projects, onSelectProject, onOpenAgentAction }) {
  // Projects with collision risks or deliverable deadlines
  const waitingApprovalProjects = projects.filter(p => p.stage === 'waiting_approval');

  return (
    <section className="mb-8">
      {/* Title & Diagnostic Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Radar de Foco & Monitor de Regras
              <span className="text-[11px] font-medium bg-slate-800 text-purple-300 border border-slate-700 px-2 py-0.5 rounded-full">
                Regra Automática: 6m (Save the Date) • 3m (Convite)
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              O Coringa calculou retroativamente a partir das datas das festas para garantir que nada atrase.
            </p>
          </div>
        </div>

        <div className="text-right text-xs text-slate-400 hidden lg:block">
          <span className="text-purple-400 font-semibold">📌 9 Save the Dates</span> | 
          <span className="text-amber-400 font-semibold ml-1.5">💌 9 Convites</span> | 
          <span className="text-emerald-400 font-semibold ml-1.5">🎉 9 Festas</span>
        </div>
      </div>

      {/* 3 Main Focus Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* CARD 1: 🚨 Alerta de Regra de Convite (3 Meses Antes da Festa) */}
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-amber-500 relative overflow-hidden group hover:border-amber-500/60 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
              <Clock className="w-4 h-4 text-amber-400" />
              Regra 3 Meses Antes (Convite)
            </span>
            <span className="text-[11px] text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded">
              Prazo limite: Set/2026
            </span>
          </div>

          <h3 className="text-sm font-semibold text-slate-100 mb-1.5">
            15 Anos Beatriz — Festa em 10/12/2026
          </h3>
          
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            Pela regra dos <strong className="text-amber-300">3 meses antes</strong>, o Convite precisa estar impresso até <strong className="text-amber-300">10/09/2026</strong>. A arte está travada na aprovação do cliente há 4 dias.
          </p>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                const proj = projects.find(p => p.id === 'proj-2');
                if (proj) onSelectProject(proj);
              }}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
            >
              Ver Entregáveis da Festa <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 2: 📌 Regra de Save the Date (6 Meses Antes) */}
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-purple-500 relative overflow-hidden group hover:border-purple-500/60 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20">
              <Calendar className="w-4 h-4 text-purple-400" />
              Regra 6 Meses Antes (Save the Date)
            </span>
            <span className="text-[11px] text-purple-300 font-semibold bg-purple-500/20 px-2 py-0.5 rounded">
              Prazo limite: 15/09/2026
            </span>
          </div>

          <h3 className="text-sm font-semibold text-slate-100 mb-1.5">
            Casamento Marina & Gustavo — Festa 15/03/2027
          </h3>
          
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            A festa é em Março/2027. O Save the Date deve ser disparado impreterivelmente até <strong className="text-purple-300">15/09/2026 (6 meses antes)</strong> para garantia dos convidados.
          </p>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                const proj = projects.find(p => p.id === 'proj-1');
                if (proj) onSelectProject(proj);
              }}
              className="text-xs font-semibold text-purple-300 hover:text-purple-200 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
            >
              Abrir Save the Date <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 3: 🎉 Próxima Festa / Evento Final */}
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-emerald-500 relative overflow-hidden group hover:border-emerald-500/60 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              <PartyPopper className="w-4 h-4 text-emerald-400" />
              Data Final da Festa Próxima
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Em 11 dias</span>
          </div>

          <h3 className="text-sm font-semibold text-slate-100 mb-1.5">
            Gala Anual TechCorp 2026 — 12/09/2026
          </h3>
          
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            Save the Date e Convites já foram entregues! Faltam apenas os brindes e painéis decorativos do dia da festa.
          </p>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                const proj = projects.find(p => p.id === 'proj-5');
                if (proj) onSelectProject(proj);
              }}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
            >
              Conferir Kit de Festa <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
