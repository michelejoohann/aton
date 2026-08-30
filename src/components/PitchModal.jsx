import React from 'react';
import { X, Sparkles, Target, DollarSign, Clock, CheckCircle2, ShieldAlert, FileText, ArrowRight } from 'lucide-react';

export default function PitchModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0F172A] border border-purple-500/40 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Tese do ICP & Apresentação Comercial — Coringa
                <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-semibold">
                  R$ 47,00/mês
                </span>
              </h2>
              <p className="text-xs text-slate-400">Agente Gerente de Projetos para Criativos Autônomos</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core ICP Definition */}
        <div className="p-4 bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/30 rounded-2xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Definição Central do ICP</span>
          <p className="text-sm font-semibold text-white leading-relaxed">
            "Profissionais criativos autônomos e microestúdios que entregam de 2 a 4 projetos por mês, mas administram simultaneamente de 6 a 12 projetos em diferentes etapas, sem possuir um gerente de projetos dedicado."
          </p>
        </div>

        {/* Why 2-4 deliveries become 6-12 active projects */}
        <div className="space-y-3 text-xs">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            Por que 2 a 4 entregas viram 6 a 12 projetos ativos?
          </h3>
          <p className="text-slate-300 leading-relaxed">
            Porque os projetos não começam e terminam dentro do mesmo mês. Cada um navega por ciclos sobrepostos:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center pt-1">
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
              <span className="text-purple-400 font-bold text-lg block">3</span>
              <span className="text-[10px] text-slate-400">Entregas do mês</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
              <span className="text-amber-400 font-bold text-lg block">2</span>
              <span className="text-[10px] text-slate-400">Aguardando aprovação</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
              <span className="text-purple-400 font-bold text-lg block">2</span>
              <span className="text-[10px] text-slate-400">Em criação ativa</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
              <span className="text-blue-400 font-bold text-lg block">2</span>
              <span className="text-[10px] text-slate-400">Briefing / Recém-contratados</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
              <span className="text-emerald-400 font-bold text-lg block">1</span>
              <span className="text-[10px] text-slate-400">Futuro / Preparação</span>
            </div>
          </div>
          <p className="text-center font-bold text-purple-300 text-xs pt-1">
            Total simultâneo sob gestão da Camila: 10 Projetos ⚡
          </p>
        </div>

        {/* Operational Pain Points & R$ 47 Value Defense */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              O Problema Percebido
            </h4>
            <blockquote className="italic text-slate-300 border-l-2 border-amber-400 pl-2.5">
              "Tenho vários projetos acontecendo ao mesmo tempo e preciso manter tudo na cabeça. Acabo decidindo o que fazer pela urgência e sempre tenho medo de esquecer alguma entrega."
            </blockquote>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Justificativa dos R$ 47,00/mês
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Equivale a aproximadamente <strong>R$ 1,57 por dia</strong>. Se o Coringa economizar uma única hora de organização ou evitar um único retrabalho no mês, a mensalidade já se paga integralmente.
            </p>
          </div>
        </div>

        {/* Ready-to-use Oral Presentation Pitch */}
        <div className="bg-purple-950/20 border border-purple-500/40 p-4 rounded-2xl space-y-2 text-xs">
          <h4 className="font-bold text-purple-300 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-purple-400" />
            Versão Oral Pronta para Pitch de Vendas
          </h4>
          <p className="text-slate-200 italic leading-relaxed">
            "Nosso ICP é o profissional criativo autônomo ou microestúdio que já possui demanda. Ele entrega de 2 a 4 projetos por mês, mas devido aos ciclos de briefing, criação e aprovações, mantém de 6 a 12 projetos ativos simultaneamente. O problema surge quando ele perde a visão do conjunto e passa a administrar prioridades no susto. Por R$ 47 mensais, o Coringa oferece uma gestão acessível que organiza os projetos, mostra o que exige atenção e antecipa o que pode virar crise."
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-purple-600/30"
          >
            Entendido, Voltar ao Sistema
          </button>
        </div>

      </div>
    </div>
  );
}
