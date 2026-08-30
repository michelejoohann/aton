import React from 'react';
import { X, Activity, AlertTriangle, Info, Clock, Layers, CheckCircle2, RefreshCw } from 'lucide-react';

export default function CapacityModal({ isOpen, onClose, projects, persona, settings }) {
  if (!isOpen) return null;

  const stdWeeks = settings?.saveTheDateWeeks || 6;
  const invWeeks = settings?.invitationWeeks || 3;
  const stdHours = settings?.saveTheDateHours || 5;
  const invHours = settings?.invitationHours || 10;
  const partyHours = settings?.partyHours || 20;

  const totalValue = projects.reduce((acc, p) => acc + (p.value || 0), 0);
  const briefingCount = projects.filter(p => p.stage === 'briefing').length;
  const inCreationCount = projects.filter(p => p.stage === 'creation').length;
  const waitingApprovalCount = projects.filter(p => p.stage === 'waiting_approval').length;
  const revisionsCount = projects.filter(p => p.stage === 'revisions').length;
  const finalDeliveryCount = projects.filter(p => p.stage === 'final_delivery').length;

  const capacityPercentage = persona?.capacityPercentage ?? 88;
  const isOverloaded = capacityPercentage > 85;

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-surface border border-line rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-modal text-ink p-5 sm:p-6 space-y-5">

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
              <p className="text-caption text-ink-muted">Jornada 08h–12h / 13h–17h • Carga horária configurada</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar diagnóstico de capacidade"
            className="inline-flex items-center justify-center shrink-0 p-2 rounded-sm border border-line-control bg-surface text-ink-muted hover:bg-surface-2 hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Configured Work Parameters */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-surface-2 border border-line rounded-sm text-center text-caption font-semibold">
          <div>
            <span className="block text-ink-muted text-caption">Std ({stdWeeks} semanas)</span>
            <span className="text-ink font-bold">{stdHours}h de produção</span>
          </div>
          <div>
            <span className="block text-ink-muted text-caption">Convite ({invWeeks} semanas)</span>
            <span className="text-ink font-bold">{invHours}h de produção</span>
          </div>
          <div>
            <span className="block text-ink-muted text-caption">Festa (Final)</span>
            <span className="text-ink font-bold">{partyHours}h de produção</span>
          </div>
        </div>

        {/* Capacity Gauge Bar & Status */}
        <div className="bg-surface-2 border border-line rounded-sm p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-label font-semibold text-ink-muted">Carga de produção atual</span>
            <span className="inline-flex items-center gap-1.5 text-label font-semibold text-on-warning bg-warning-surface border border-warning-border px-2.5 py-1 rounded-xs">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
              <span className="tabular-nums font-bold">{capacityPercentage}%</span> de Ocupação {isOverloaded ? '(Alerta)' : '(Estável)'}
            </span>
          </div>

          <div className="w-full bg-surface rounded-full h-3 border border-line overflow-hidden">
            <div
              className={`h-full rounded-full transition-[width] duration-200 ease-quint ${
                isOverloaded ? 'bg-warning' : 'bg-accent'
              }`}
              style={{ width: `${capacityPercentage}%` }}
            ></div>
          </div>

          <p className="text-label text-ink-muted flex items-start gap-2 pt-1">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-on-warning" aria-hidden="true" />
            <span>
              <strong className="font-semibold text-ink">Diagnóstico do Amozir:</strong> Você está operando com <strong className="font-semibold text-ink">{projects.length} projetos</strong> simultâneos. Na jornada das 08h-12h e 13h-17h com pausas de {settings?.breakMinutes || 15}min, a <strong className="font-semibold text-ink">indefinição dos prazos de resposta dos clientes</strong> gera gargalos nos convites.
            </span>
          </p>
        </div>

        {/* Breakdown Table with ALL 5 Stages + Total */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <h3 className="text-label font-semibold text-ink-muted">
              Distribuição dos projetos nas etapas ({projects.length} no total)
            </h3>
            <span className="text-caption font-semibold text-accent bg-accent-soft px-2 py-0.5 rounded-xs border border-line">
              Total: {projects.length} Projetos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-grid">
            <div className="bg-surface border border-line rounded-sm p-3">
              <span className="block text-caption uppercase tracking-[0.08em] text-ink-subtle">1. Briefing / Novos</span>
              <strong className="block text-section-title font-semibold text-ink tabular-nums mt-1">{briefingCount} Projetos</strong>
              <p className="text-caption text-ink-muted mt-1">Conceito e alinhamento inicial</p>
            </div>

            <div className="bg-surface border border-line rounded-sm p-3">
              <span className="block text-caption uppercase tracking-[0.08em] text-ink-subtle">2. Em Criação Ativa</span>
              <strong className="block text-section-title font-semibold text-ink tabular-nums mt-1">{inCreationCount} Projetos</strong>
              <p className="text-caption text-ink-muted mt-1">Alocados no horário da manhã (08:00)</p>
            </div>

            <div className="bg-surface border border-line rounded-sm p-3">
              <span className="block text-caption uppercase tracking-[0.08em] text-ink-subtle">3. Aguardando Cliente</span>
              <strong className="block text-section-title font-semibold text-on-warning tabular-nums mt-1">{waitingApprovalCount} Projetos</strong>
              <p className="text-caption text-ink-muted mt-1">Risco de retornos simultâneos (SLA 48h)</p>
            </div>

            <div className="bg-surface border border-line rounded-sm p-3">
              <span className="block text-caption uppercase tracking-[0.08em] text-ink-subtle">4. Ajustes &amp; Gráfica</span>
              <strong className="block text-section-title font-semibold text-cyan-600 tabular-nums mt-1">{revisionsCount} Projetos</strong>
              <p className="text-caption text-ink-muted mt-1">Prova de cor e acabamento final</p>
            </div>

            <div className="bg-surface border border-line rounded-sm p-3">
              <span className="block text-caption uppercase tracking-[0.08em] text-ink-subtle">5. Entregue / Concluído</span>
              <strong className="block text-section-title font-semibold text-emerald-600 tabular-nums mt-1">{finalDeliveryCount} Projetos</strong>
              <p className="text-caption text-ink-muted mt-1">Finalizados e entregues</p>
            </div>

            <div className="bg-surface border border-accent/40 bg-accent-soft/30 rounded-sm p-3">
              <span className="block text-caption uppercase tracking-[0.08em] text-accent font-semibold">Faturamento em Gestão</span>
              <strong className="block text-section-title font-semibold text-ink tabular-nums mt-1">R$ {totalValue.toLocaleString('pt-BR')}</strong>
              <p className="text-caption text-ink-muted mt-1">{projects.length} eventos monitorados</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-accent-soft border border-line rounded-sm text-label text-ink-muted flex items-start gap-2.5">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-accent" aria-hidden="true" />
          <span>
            <strong className="font-semibold text-ink">Solução do Amozir:</strong> Por <strong className="font-semibold text-ink">R$ 47/mês</strong>, o Amozir monitora as janelas de {stdWeeks} e {invWeeks} semanas e garante as pausas de {settings?.breakMinutes || 15}min para todos os {projects.length} projetos.
          </span>
        </div>

        <div className="flex justify-end pt-4 border-t border-line">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-sm bg-accent hover:bg-accent-hover text-on-accent text-label font-semibold transition-colors"
          >
            Entendido, Voltar ao Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
