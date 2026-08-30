import React from 'react';
import { X, Calendar, CheckSquare, Clock, AlertTriangle, Sparkles, User, PartyPopper, Mail, Bookmark } from 'lucide-react';
import { STAGES } from '../data/mockData';
import { formatDateBR } from '../utils/dateUtils';

export default function ProjectDetailModal({ project, onClose, onToggleTask }) {
  if (!project) return null;

  const currentStageInfo = STAGES.find(s => s.id === project.stage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0F172A] border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 p-6 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${currentStageInfo?.color}`}>
                {currentStageInfo?.title}
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-semibold">
                {project.category}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {project.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>Cliente: <strong className="text-slate-200">{project.client}</strong></span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Deliverables Timeline Display (Save the Date 6m, Convite 3m, Festa) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            Cronograma dos 3 Entregáveis Obrigatórios:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            
            {/* 1. Save the Date */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-purple-500/30 space-y-1">
              <div className="flex items-center justify-between text-purple-300 font-bold">
                <span>📌 Save the Date</span>
                <span className="text-[10px] bg-purple-500/20 px-1.5 py-0.5 rounded">6m antes</span>
              </div>
              <p className="text-[11px] text-slate-400">Prazo limite:</p>
              <strong className="text-sm text-purple-200 block">{formatDateBR(project.saveTheDateDeadline)}</strong>
            </div>

            {/* 2. Convite */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-amber-500/30 space-y-1">
              <div className="flex items-center justify-between text-amber-300 font-bold">
                <span>💌 Convite Oficial</span>
                <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded">3m antes</span>
              </div>
              <p className="text-[11px] text-slate-400">Prazo limite:</p>
              <strong className="text-sm text-amber-200 block">{formatDateBR(project.invitationDeadline)}</strong>
            </div>

            {/* 3. Festa */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-emerald-500/30 space-y-1">
              <div className="flex items-center justify-between text-emerald-300 font-bold">
                <span>🎉 Data da Festa</span>
                <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded">Prazo Final</span>
              </div>
              <p className="text-[11px] text-slate-400">Dia do Evento:</p>
              <strong className="text-sm text-emerald-200 block">{formatDateBR(project.partyDate)}</strong>
            </div>

          </div>
        </div>

        {/* Deliverables Checklist */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-purple-400" />
              Etapas dos Entregáveis
            </h3>
            <span className="text-xs text-slate-400">
              {project.deliverables.filter(d => d.completed).length} de {project.deliverables.length} entregues
            </span>
          </div>

          <div className="space-y-2">
            {project.deliverables.map(item => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  item.completed 
                    ? 'bg-slate-900/40 border-slate-800 text-slate-500 line-through' 
                    : 'bg-slate-900/80 border-slate-700/80 text-slate-200'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">{item.title}</span>
                  <span className="text-[10px] text-slate-400">{item.rule} • Prazo: {formatDateBR(item.deadline)}</span>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  item.completed 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {item.completed ? 'Entregue' : 'Em Produção'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-xl flex items-start gap-3 text-xs">
          <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-purple-300 font-bold mb-1">
              Orientação do Coringa
            </strong>
            <p className="text-slate-300 leading-relaxed">
              Mantenha o foco na aprovação do Convite Oficial. O prazo limite retroativo de 3 meses garante a caligrafia e impressão sem pânico na véspera da festa.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}
