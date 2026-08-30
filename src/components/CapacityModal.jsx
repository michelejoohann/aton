import React from 'react';
import { X, Activity, AlertTriangle, Layers, DollarSign, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CapacityModal({ isOpen, onClose, projects, persona }) {
  if (!isOpen) return null;

  const totalValue = projects.reduce((acc, p) => acc + p.value, 0);
  const waitingApprovalCount = projects.filter(p => p.stage === 'waiting_approval').length;
  const inCreationCount = projects.filter(p => p.stage === 'creation').length;
  const briefingCount = projects.filter(p => p.stage === 'briefing').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0F172A] border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl text-slate-100 p-6 space-y-5">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Diagnóstico de Capacidade Operacional</h2>
              <p className="text-xs text-slate-400">Por que 2-4 entregas mensais geram 9 projetos simultâneos em gestão?</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Capacity Gauge Bar & Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Carga de Produção Atual:</span>
            <span className="text-sm font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
              {persona.capacityPercentage}% de Ocupação (Alerta)
            </span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden p-0.5">
            <div 
              className="bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${persona.capacityPercentage}%` }}
            ></div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pt-1">
            ⚠️ <strong>Diagnóstico Coringa:</strong> Você está operando perto do teto. O problema não é falta de capacidade de criação, mas a <strong>indefinição dos prazos de resposta dos clientes</strong>.
          </p>
        </div>

        {/* Breakdown Table of the Overlapping 9 projects */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-slate-200">Distribuição dos Projetos nas Etapas:</h3>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Em Criação Ativa</span>
              <strong className="text-purple-400 text-sm">{inCreationCount} Projetos</strong>
              <p className="text-[10px] text-slate-500 mt-0.5">Consumindo 60% das suas horas de execução</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Aguardando Aprovação do Cliente</span>
              <strong className="text-amber-400 text-sm">{waitingApprovalCount} Projetos</strong>
              <p className="text-[10px] text-slate-500 mt-0.5">Risco de retornos simultâneos surpresa</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Recém-contratados / Briefing</span>
              <strong className="text-blue-400 text-sm">{briefingCount} Projetos</strong>
              <p className="text-[10px] text-slate-500 mt-0.5">Preparando base para próximas semanas</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Faturamento em Gestão</span>
              <strong className="text-emerald-400 text-sm">R$ {totalValue.toLocaleString('pt-BR')}</strong>
              <p className="text-[10px] text-slate-500 mt-0.5">Sem necessidade de contratar GP dedicado</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-xl text-xs text-purple-200 leading-relaxed">
          💡 <strong>Solução do Coringa:</strong> Por <strong>R$ 47/mês</strong>, o Coringa monitora a movimentação de cada etapa e antecipa quando duas aprovações pendentes vão explodir no mesmo dia.
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-purple-600/30"
          >
            Entendido, Voltar ao Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
