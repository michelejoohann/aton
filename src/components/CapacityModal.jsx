import React from 'react';
import { X, Activity, AlertTriangle, Info } from 'lucide-react';

export default function CapacityModal({ isOpen, onClose, projects, persona }) {
  if (!isOpen) return null;

  const totalValue = projects.reduce((acc, p) => acc + p.value, 0);
  const waitingApprovalCount = projects.filter(p => p.stage === 'waiting_approval').length;
  const inCreationCount = projects.filter(p => p.stage === 'creation').length;
  const briefingCount = projects.filter(p => p.stage === 'briefing').length;

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-overlay animate-fade-in">
      <div className="bg-surface border border-line rounded-md w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-modal text-ink p-5 sm:p-6 space-y-5">

        <div className="flex items-start justify-between gap-3 pb-4 border-b border-line-strong">
          <div className="flex items-center gap-3 min-w-0">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-accent"
            >
              <Activity className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-section-title font-semibold text-ink">Diagnóstico de Capacidade Operacional</h2>
              <p className="text-caption text-ink-muted">Por que 2-4 entregas mensais geram 9 projetos simultâneos em gestão?</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar diagnóstico de capacidade"
            className="inline-flex items-center justify-center shrink-0 min-w-11 min-h-11 rounded-sm border border-line-control bg-surface text-ink-muted hover:bg-surface-2 hover:text-ink transition-colors duration-150 ease-quint"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Capacity Gauge Bar & Status */}
        <div className="bg-surface-2 border border-line rounded-sm p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-label font-semibold text-ink-muted">Carga de produção atual</span>
            <span className="inline-flex items-center gap-1.5 text-label font-semibold text-on-warning bg-warning-surface border border-warning-border px-2.5 py-1 rounded-xs">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
              <span className="tabular-nums">{persona.capacityPercentage}%</span> de Ocupação (Alerta)
            </span>
          </div>

          <div className="w-full bg-surface rounded-full h-3 border border-line overflow-hidden">
            <div
              className="bg-warning h-full rounded-full transition-[width] duration-200 ease-quint"
              style={{ width: `${persona.capacityPercentage}%` }}
            ></div>
          </div>

          <p className="text-label text-ink-muted flex items-start gap-2 pt-1">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-on-warning" aria-hidden="true" />
            <span>
              <strong className="font-semibold text-ink">Diagnóstico do Amozir:</strong> Você está operando perto do teto. O problema não é falta de capacidade de criação, mas a <strong className="font-semibold text-ink">indefinição dos prazos de resposta dos clientes</strong>.
            </span>
          </p>
        </div>

        {/* Breakdown Table of the Overlapping 9 projects */}
        <div className="space-y-3">
          <h3 className="text-label font-semibold text-ink-muted pb-2 border-b border-line">
            Distribuição dos projetos nas etapas
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-grid">
            <div className="bg-surface border border-line rounded-sm p-3">
              <span className="block text-caption uppercase tracking-[0.08em] text-ink-subtle">Em Criação Ativa</span>
              <strong className="block text-section-title font-semibold text-ink tabular-nums mt-1">{inCreationCount} Projetos</strong>
              <p className="text-caption text-ink-muted mt-1">Consumindo 60% das suas horas de execução</p>
            </div>

            <div className="bg-surface border border-line rounded-sm p-3">
              <span className="block text-caption uppercase tracking-[0.08em] text-ink-subtle">Aguardando Aprovação do Cliente</span>
              <strong className="block text-section-title font-semibold text-on-warning tabular-nums mt-1">{waitingApprovalCount} Projetos</strong>
              <p className="text-caption text-ink-muted mt-1">Risco de retornos simultâneos surpresa</p>
            </div>

            <div className="bg-surface border border-line rounded-sm p-3">
              <span className="block text-caption uppercase tracking-[0.08em] text-ink-subtle">Recém-contratados / Briefing</span>
              <strong className="block text-section-title font-semibold text-ink tabular-nums mt-1">{briefingCount} Projetos</strong>
              <p className="text-caption text-ink-muted mt-1">Preparando base para próximas semanas</p>
            </div>

            <div className="bg-surface border border-line rounded-sm p-3">
              <span className="block text-caption uppercase tracking-[0.08em] text-ink-subtle">Faturamento em Gestão</span>
              <strong className="block text-section-title font-semibold text-ink tabular-nums mt-1">R$ {totalValue.toLocaleString('pt-BR')}</strong>
              <p className="text-caption text-ink-muted mt-1">Sem necessidade de contratar GP dedicado</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-accent-soft border border-line rounded-sm text-label text-ink-muted flex items-start gap-2.5">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-accent" aria-hidden="true" />
          <span>
            <strong className="font-semibold text-ink">Solução do Amozir:</strong> Por <strong className="font-semibold text-ink">R$ 47/mês</strong>, o Amozir monitora a movimentação de cada etapa e antecipa quando duas aprovações pendentes vão explodir no mesmo dia.
          </span>
        </div>

        <div className="flex justify-end pt-4 border-t border-line">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center min-h-11 px-5 rounded-sm bg-accent hover:bg-accent-hover text-on-accent text-label font-semibold transition-colors duration-150 ease-quint"
          >
            Entendido, Voltar ao Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
