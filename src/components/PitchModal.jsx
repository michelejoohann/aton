import React from 'react';
import { X, Target, DollarSign, Clock, ShieldAlert, FileText } from 'lucide-react';

export default function PitchModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-overlay animate-fade-in">
      <div className="bg-surface border border-line rounded-md w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-modal text-ink p-5 sm:p-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-line-strong">
          <div className="flex items-center gap-3 min-w-0">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-accent"
            >
              <Target className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-page-title font-semibold text-ink tracking-tight flex flex-wrap items-center gap-2">
                Tese do ICP &amp; Apresentação Comercial — Amozir
                <span className="font-body text-caption uppercase tracking-[0.1em] bg-accent text-on-accent px-2 py-0.5 rounded-xs font-semibold tabular-nums">
                  R$ 47,00/mês
                </span>
              </h2>
              <p className="text-label text-ink-muted mt-1">Agente inteligente de gestão multiprojeto</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar tese comercial"
            className="inline-flex items-center justify-center shrink-0 min-w-11 min-h-11 rounded-sm border border-line-control bg-surface text-ink-muted hover:bg-surface-2 hover:text-ink transition-colors duration-150 ease-quint"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Core ICP Definition */}
        <div className="p-4 bg-accent-soft border border-line rounded-sm space-y-2">
          <span className="block text-caption font-semibold text-accent">Definição central do ICP</span>
          <p className="text-section-title text-ink">
            "Profissionais criativos autônomos e microestúdios que entregam de 2 a 4 projetos por mês, mas administram simultaneamente de 6 a 12 projetos em diferentes etapas, sem possuir um gerente de projetos dedicado."
          </p>
        </div>

        {/* Why 2-4 deliveries become 6-12 active projects */}
        <div className="space-y-3">
          <h3 className="text-section-title font-semibold text-ink flex items-center gap-2 pb-2 border-b border-line">
            <Clock className="w-4 h-4 text-accent" aria-hidden="true" />
            Por que 2 a 4 entregas viram 6 a 12 projetos ativos?
          </h3>
          <p className="text-label text-ink-muted">
            Porque os projetos não começam e terminam dentro do mesmo mês. Cada um navega por ciclos sobrepostos:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center pt-1">
            <div className="bg-surface border border-line p-3 rounded-sm">
              <span className="block text-page-title font-semibold text-ink tabular-nums">3</span>
              <span className="text-caption text-ink-muted">Entregas do mês</span>
            </div>
            <div className="bg-surface border border-line p-3 rounded-sm">
              <span className="block text-page-title font-semibold text-ink tabular-nums">2</span>
              <span className="text-caption text-ink-muted">Aguardando aprovação</span>
            </div>
            <div className="bg-surface border border-line p-3 rounded-sm">
              <span className="block text-page-title font-semibold text-ink tabular-nums">2</span>
              <span className="text-caption text-ink-muted">Em criação ativa</span>
            </div>
            <div className="bg-surface border border-line p-3 rounded-sm">
              <span className="block text-page-title font-semibold text-ink tabular-nums">2</span>
              <span className="text-caption text-ink-muted">Briefing / Recém-contratados</span>
            </div>
            <div className="bg-surface border border-line p-3 rounded-sm">
              <span className="block text-page-title font-semibold text-ink tabular-nums">1</span>
              <span className="text-caption text-ink-muted">Futuro / Preparação</span>
            </div>
          </div>
          <p className="text-center text-label font-semibold text-accent pt-1">
            Total simultâneo sob gestão da Camila: <span className="tabular-nums">10</span> Projetos
          </p>
        </div>

        {/* Operational Pain Points & R$ 47 Value Defense */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-grid">
          <div className="bg-surface border border-line p-4 rounded-sm space-y-2">
            <h4 className="text-section-title font-semibold text-ink flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-on-warning" aria-hidden="true" />
              O Problema Percebido
            </h4>
            <blockquote className="bg-surface-2 border border-line rounded-sm p-3 text-label text-ink-muted">
              "Tenho vários projetos acontecendo ao mesmo tempo e preciso manter tudo na cabeça. Acabo decidindo o que fazer pela urgência e sempre tenho medo de esquecer alguma entrega."
            </blockquote>
          </div>

          <div className="bg-surface border border-line p-4 rounded-sm space-y-2">
            <h4 className="text-section-title font-semibold text-ink flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-on-success" aria-hidden="true" />
              Justificativa dos R$ 47,00/mês
            </h4>
            <p className="text-label text-ink-muted">
              Equivale a aproximadamente <strong className="font-semibold text-ink tabular-nums">R$ 1,57 por dia</strong>. Se o Amozir economizar uma única hora de organização ou evitar um único retrabalho no mês, a mensalidade já se paga integralmente.
            </p>
          </div>
        </div>

        {/* Ready-to-use Oral Presentation Pitch */}
        <div className="bg-surface-2 border border-line p-4 rounded-sm space-y-2">
          <h4 className="text-section-title font-semibold text-ink flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" aria-hidden="true" />
            Versão Oral Pronta para Pitch de Vendas
          </h4>
          <p className="text-label text-ink">
            "Nosso ICP é o profissional criativo autônomo ou microestúdio que já possui demanda. Ele entrega de 2 a 4 projetos por mês, mas devido aos ciclos de briefing, criação e aprovações, mantém de 6 a 12 projetos ativos simultaneamente. O problema surge quando ele perde a visão do conjunto e passa a administrar prioridades no susto. Por R$ 47 mensais, o Amozir oferece uma gestão acessível que organiza os projetos, mostra o que exige atenção e antecipa o que pode virar crise."
          </p>
        </div>

        <div className="flex justify-end pt-4 border-t border-line">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center min-h-11 px-5 rounded-sm bg-accent hover:bg-accent-hover text-on-accent text-label font-semibold transition-colors duration-150 ease-quint"
          >
            Entendido, Voltar ao Sistema
          </button>
        </div>

      </div>
    </div>
  );
}
