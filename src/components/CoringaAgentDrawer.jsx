import React, { useState } from 'react';
import {
  X,
  Calendar,
  Activity,
  Play,
  Volume2,
  ShieldCheck,
  AlertTriangle,
  Bot,
  RefreshCw,
  Clock,
  PartyPopper,
  Mail,
  Bookmark,
  Sun
} from 'lucide-react';
import { calculateSaveTheDateDeadline, calculateInvitationDeadline, formatDateBR } from '../utils/dateUtils.js';

// Drawer do agente Amozir. O identificador do componente e do arquivo é
// mantido de propósito: a renomeação desta rodada é de produto, não de código.
export default function CoringaAgentDrawer({
  isOpen,
  onClose,
  projects,
  settings,
  initialAction,
  onUpdateProjects
}) {
  const [activeTab, setActiveTab] = useState(initialAction || 'rules');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const stdWeeks = settings?.saveTheDateWeeks || 6;
  const invWeeks = settings?.invitationWeeks || 3;
  const stdHours = settings?.saveTheDateHours || 5;
  const invHours = settings?.invitationHours || 10;

  // New Project Simulation State
  const [simPartyDate, setSimPartyDate] = useState('2027-04-20');
  const [simValue, setSimValue] = useState(4800);
  const [simCategory, setSimCategory] = useState('Casamento');
  const [simResult, setSimResult] = useState(null);

  // Reschedule State
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulateNewEvent = (e) => {
    e.preventDefault();
    if (!simPartyDate) return;

    const stdDeadline = calculateSaveTheDateDeadline(simPartyDate, stdWeeks);
    const invDeadline = calculateInvitationDeadline(simPartyDate, invWeeks);

    setSimResult({
      partyDate: simPartyDate,
      saveTheDateDeadline: stdDeadline,
      invitationDeadline: invDeadline,
      recommendation: `CRONOGRAMA CALCULADO COM SUCESSO: Pela regra de prazos retroativos, o Save the Date deverá ser entregue até ${formatDateBR(stdDeadline)} (${stdWeeks} sem / ${stdHours}h de produção) e o Convite Oficial até ${formatDateBR(invDeadline)} (${invWeeks} sem / ${invHours}h de produção). O evento de R$ ${Number(simValue).toLocaleString('pt-BR')} foi aprovado na sua grade na jornada 08h–17h!`
    });
  };

  const handleApplyReschedule = () => {
    // Reorganize collision projects automatically
    const updated = projects.map(p => {
      if (p.id === 'proj-2') {
        return {
          ...p,
          collisionRisk: false,
          riskMessage: null,
          lastUpdate: 'Prazos de aprovação estendidos com segurança de 5 dias'
        };
      }
      if (p.id === 'proj-7') {
        return {
          ...p,
          collisionRisk: false,
          riskMessage: null,
          lastUpdate: 'Ajuste de fila de vetorização do batizado realizado'
        };
      }
      return p;
    });

    onUpdateProjects(updated);
    setRescheduleSuccess(true);
    setTimeout(() => setRescheduleSuccess(false), 4000);
  };

  const tabClass = (tab) =>
    `flex-1 inline-flex items-center justify-center gap-1.5 min-h-11 px-2 rounded-sm text-label font-semibold transition-colors duration-150 ease-quint ${
      activeTab === tab
        ? 'bg-accent text-on-accent'
        : 'text-ink-muted hover:text-ink hover:bg-surface-2'
    }`;

  const fieldClass =
    'w-full min-h-11 bg-surface border border-line-control rounded-sm px-3 py-2 text-label text-ink hover:border-ink-subtle focus:border-accent transition-colors duration-150 ease-quint';
  const labelClass = 'block text-caption font-semibold text-ink-muted mb-1.5';

  return (
    <div className="fixed inset-0 z-modal flex justify-end bg-overlay animate-fade-in">

      {/* Drawer Container */}
      <div className="w-full max-w-lg bg-surface border-l border-line text-ink h-full flex flex-col shadow-modal animate-slide-in-right">

        {/* Drawer Header */}
        <div className="relative overflow-hidden p-5 border-b border-line-strong bg-surface-2 flex items-start justify-between gap-3">
          {/* Motivo de rizoma: as conexões que sustentam o eixo, sob a
              superfície. Aparece só aqui, nunca como padrão de página, e só em
              tinta de linha — o acento fica reservado a ação, seleção e estado. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 200 120"
            fill="none"
            className="pointer-events-none absolute -bottom-9 right-2 h-28 w-52 text-line-strong"
          >
            <g stroke="currentColor" strokeWidth="1">
              <path d="M24 40 96 30 168 62" />
              <path d="M96 30 108 92" />
              <path d="M24 40 60 96 140 108" />
            </g>
            <circle cx="96" cy="30" r="2.5" fill="currentColor" />
            <circle cx="168" cy="62" r="3" fill="currentColor" />
            <circle cx="108" cy="92" r="2" fill="currentColor" />
            <circle cx="140" cy="108" r="2" fill="currentColor" />
            <circle cx="24" cy="40" r="4" fill="currentColor" />
          </svg>

          <div className="relative flex items-center gap-3 min-w-0">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-accent"
            >
              <Bot className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-section-title font-semibold text-ink flex flex-wrap items-center gap-2">
                Agente Amozir
                <span className="font-body text-caption bg-surface text-ink-muted border border-line px-2 py-0.5 rounded-xs font-medium">
                  Gerente de prazos
                </span>
              </h3>
              <p className="text-caption text-ink-muted">Regra: Save the Date (6m) • Convite (3m) • Festa</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar painel do agente Amozir"
            className="relative inline-flex items-center justify-center shrink-0 min-w-11 min-h-11 rounded-sm border border-line-control bg-surface text-ink-muted hover:bg-surface-2 hover:text-ink transition-colors duration-150 ease-quint"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Drawer Tabs Navigation */}
        <div className="flex border-b border-line bg-surface-2 p-1.5 gap-1">
          <button onClick={() => setActiveTab('rules')} className={tabClass('rules')}>
            <Clock className="w-4 h-4" aria-hidden="true" />
            Regra 6m / 3m
          </button>

          <button onClick={() => setActiveTab('reschedule')} className={tabClass('reschedule')}>
            <Calendar className="w-4 h-4" aria-hidden="true" />
            Ajustar Conflitos
          </button>

          <button onClick={() => setActiveTab('capacity')} className={tabClass('capacity')}>
            <Activity className="w-4 h-4" aria-hidden="true" />
            Simular Evento
          </button>
        </div>

        {/* Drawer Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* TAB 1: REGRA AUTOMÁTICA DE PRAZOS (6m / 3m / FESTA) */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="bg-accent-soft border border-line rounded-sm p-4">
                <h4 className="text-label font-semibold text-ink mb-1.5 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-accent" aria-hidden="true" />
                  Regras de retrocálculo dos entregáveis
                </h4>
                <p className="text-label text-ink-muted">
                  O Amozir monitora automaticamente o tempo restante para cada festa e impõe os prazos limites:
                </p>
                <ul className="text-label text-ink-muted mt-2 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <Bookmark className="w-4 h-4 shrink-0 mt-0.5 text-ink-subtle" aria-hidden="true" />
                    <span><strong className="font-semibold text-ink">Save the Date:</strong> impreterivelmente 6 meses antes da Festa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Mail className="w-4 h-4 shrink-0 mt-0.5 text-ink-subtle" aria-hidden="true" />
                    <span><strong className="font-semibold text-ink">Convite Oficial:</strong> impreterivelmente 3 meses antes da Festa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <PartyPopper className="w-4 h-4 shrink-0 mt-0.5 text-accent" aria-hidden="true" />
                    <span><strong className="font-semibold text-ink">Festa / Evento:</strong> prazo final de entrega física</span>
                  </li>
                </ul>
              </div>

              {/* Status Breakdown of the 9 Active Event Projects */}
              <div className="space-y-2">
                <h5 className="text-label font-semibold text-ink-muted pb-2 border-b border-line">
                  Projetos com alerta de regra
                </h5>

                {projects.filter(p => p.collisionRisk).map(p => (
                  <div key={p.id} className="p-3 bg-urgent-surface border border-urgent-border rounded-sm space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-semibold text-on-urgent text-label">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                        {p.name}
                      </span>
                      <span className="text-caption bg-surface border border-urgent-border px-2 py-0.5 rounded-xs tabular-nums">
                        Festa: {formatDateBR(p.partyDate)}
                      </span>
                    </div>
                    <p className="text-caption text-ink-muted">{p.riskMessage}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: RESOLVER CONFLITOS DE CRONOGRAMA */}
          {activeTab === 'reschedule' && (
            <div className="space-y-4">
              <div className="bg-warning-surface border border-warning-border rounded-sm p-4">
                <h4 className="text-label font-semibold text-on-warning mb-1.5 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                  Diagnóstico de sobrecarga de entregas
                </h4>
                <p className="text-label text-ink-muted">
                  Os convites de <strong className="font-semibold text-ink">15 Anos Beatriz</strong> (prazo 3m) e o batizado da <strong className="font-semibold text-ink">Família Albuquerque</strong> acumularam na mesma semana de Setembro.
                </p>
              </div>

              <div className="bg-surface border border-line rounded-sm p-4 space-y-3">
                <h5 className="text-label font-semibold text-ink-muted pb-2 border-b border-line">
                  Proposta do Amozir para ajustar os prazos
                </h5>

                <ol className="text-label text-ink-muted space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-accent tabular-nums">1.</span>
                    <span>Espaçar a aprovação de layout do Convite de 15 Anos em 3 dias mantendo a folga de 3 meses.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-accent tabular-nums">2.</span>
                    <span>Resultado: <strong className="font-semibold text-ink">Regra 6m / 3m / Festa 100% respeitada</strong> e sem colisão de produção.</span>
                  </li>
                </ol>

                {rescheduleSuccess && (
                  <div className="p-3 bg-success-surface border border-success-border rounded-sm text-on-success text-label font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                    Prazos reorganizados com sucesso!
                  </div>
                )}

                <button
                  onClick={handleApplyReschedule}
                  className="w-full inline-flex items-center justify-center gap-2 min-h-11 bg-accent hover:bg-accent-hover text-on-accent text-label font-semibold rounded-sm transition-colors duration-150 ease-quint"
                >
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  <span>Aplicar Reorganização de Prazos</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SIMULAR NOVO EVENTO (COM REGRA AUTOMÁTICA 6M / 3M) */}
          {activeTab === 'capacity' && (
            <div className="space-y-4">
              <div className="bg-surface-2 border border-line rounded-sm p-4">
                <h4 className="text-label font-semibold text-ink mb-1.5 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent" aria-hidden="true" />
                  Calculadora de retro-prazos do novo evento
                </h4>
                <p className="text-label text-ink-muted">
                  Digite a <strong className="font-semibold text-ink">Data da Festa</strong>. O Amozir calculará instantaneamente a data limite do Save the Date (-6m) e do Convite (-3m).
                </p>
              </div>

              <form onSubmit={handleSimulateNewEvent} className="space-y-3 bg-surface border border-line rounded-sm p-4">
                <div>
                  <label className={labelClass} htmlFor="sim-category">
                    Tipo de Evento:
                  </label>
                  <select
                    id="sim-category"
                    value={simCategory}
                    onChange={(e) => setSimCategory(e.target.value)}
                    className={fieldClass}
                  >
                    <option value="Casamento">Casamento</option>
                    <option value="15 Anos">15 Anos</option>
                    <option value="Bodas">Bodas</option>
                    <option value="Corporativo">Corporativo</option>
                    <option value="Aniversário">Aniversário</option>
                  </select>
                </div>

                <div>
                  <label className={`${labelClass} text-accent flex items-center gap-1.5`} htmlFor="sim-party-date">
                    <PartyPopper className="w-3.5 h-3.5" aria-hidden="true" />
                    Data Final da Festa:
                  </label>
                  <input
                    id="sim-party-date"
                    type="date"
                    required
                    value={simPartyDate}
                    onChange={(e) => setSimPartyDate(e.target.value)}
                    className={`${fieldClass} font-semibold tabular-nums`}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="sim-value">
                    Valor do Projeto (R$):
                  </label>
                  <input
                    id="sim-value"
                    type="number"
                    value={simValue}
                    onChange={(e) => setSimValue(e.target.value)}
                    className={`${fieldClass} tabular-nums`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 min-h-11 bg-accent hover:bg-accent-hover text-on-accent text-label font-semibold rounded-sm transition-colors duration-150 ease-quint"
                >
                  <Sun className="w-4 h-4" aria-hidden="true" />
                  <span>Calcular Prazos Automáticos</span>
                </button>
              </form>

              {simResult && (
                <div className="p-4 bg-success-surface border border-success-border rounded-sm space-y-2.5">
                  <p className="text-label font-semibold text-on-success flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{simResult.recommendation}</span>
                  </p>

                  <div className="bg-surface p-2.5 rounded-sm border border-line space-y-1 text-caption">
                    <div className="flex items-center gap-1.5 text-ink-muted">
                      <Bookmark className="w-3.5 h-3.5 text-ink-subtle" aria-hidden="true" />
                      <span>Save the Date: <span className="font-semibold text-ink tabular-nums">{formatDateBR(simResult.saveTheDateDeadline)}</span> (-6 meses)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-ink-muted">
                      <Mail className="w-3.5 h-3.5 text-ink-subtle" aria-hidden="true" />
                      <span>Convite Oficial: <span className="font-semibold text-ink tabular-nums">{formatDateBR(simResult.invitationDeadline)}</span> (-3 meses)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-ink-muted">
                      <PartyPopper className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                      <span>Data da Festa: <span className="font-semibold text-accent tabular-nums">{formatDateBR(simResult.partyDate)}</span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DAILY BRIEFING AUDIO PLAYER SIMULATION */}
          <div className="pt-4 border-t border-line">
            <div className="bg-surface-2 border border-line rounded-sm p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  aria-label={isPlayingAudio ? 'Pausar o Daily Briefing da Camila' : 'Ouvir o Daily Briefing da Camila'}
                  className="inline-flex items-center justify-center shrink-0 min-w-11 min-h-11 rounded-full bg-accent hover:bg-accent-hover text-on-accent transition-colors duration-150 ease-quint"
                >
                  {isPlayingAudio ? <Volume2 className="w-5 h-5" aria-hidden="true" /> : <Play className="w-5 h-5" aria-hidden="true" />}
                </button>
                <div className="min-w-0">
                  <h5 className="text-label font-semibold text-ink">Daily Briefing da Camila</h5>
                  <p className="text-caption text-ink-muted">
                    {isPlayingAudio ? 'Reproduzindo resumo de prazos (0:38)...' : 'Ouvir resumo de entregáveis do dia'}
                  </p>
                </div>
              </div>

              {isPlayingAudio && (
                <span className="inline-flex items-center gap-1.5 text-caption font-semibold text-accent tabular-nums">
                  <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                  0:12 / 0:38
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-line bg-surface-2 text-center text-caption text-ink-muted">
          Amozir • ICP Eventos &amp; Papelaria • <strong className="font-semibold text-ink tabular-nums">R$ 47/mês</strong>
        </div>

      </div>
    </div>
  );
}
