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
  Sun,
  Film,
  Coffee,
  XCircle,
  AlertOctagon,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import {
  calculateSaveTheDateDeadline,
  calculateInvitationDeadline,
  calculateRetrospectiveDeadline,
  formatDateBR,
  getDaysDiffFromToday,
  DEFAULT_SYSTEM_TODAY
} from '../utils/dateUtils.js';

export default function CoringaAgentDrawer({
  isOpen,
  onClose,
  projects = [],
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
  const partyHours = settings?.partyHours || 20;
  const retroHours = settings?.retrospectiveHours || 8;
  const retroDays = settings?.retrospectiveDaysBeforeParty || 1;
  const breakMinutes = settings?.breakMinutes || 15;
  const approvalSla = settings?.approvalSlaHours || 48;
  const assetSla = settings?.assetDeliverySlaHours || 72;
  const morningStart = settings?.morningStart || '08:00';
  const morningEnd = settings?.morningEnd || '12:00';
  const afternoonStart = settings?.afternoonStart || '13:00';
  const afternoonEnd = settings?.afternoonEnd || '17:00';

  // New Project Simulation State
  const [simPartyDate, setSimPartyDate] = useState('2026-09-28'); // Exemplo com Std vencido
  const [simValue, setSimValue] = useState(5500);
  const [simCategory, setSimCategory] = useState('Casamento');
  const [simResult, setSimResult] = useState(null);

  // Reschedule State
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

  if (!isOpen) return null;

  // Calculadora com diagnóstico completo de prazos passados / risco assumido / críticas
  const handleSimulateNewEvent = (e) => {
    if (e) e.preventDefault();
    if (!simPartyDate) return;

    const stdDeadline = calculateSaveTheDateDeadline(simPartyDate, stdWeeks);
    const invDeadline = calculateInvitationDeadline(simPartyDate, invWeeks);
    const retroDeadline = calculateRetrospectiveDeadline(simPartyDate, retroDays);

    const daysToParty = getDaysDiffFromToday(simPartyDate);
    const daysToStd = getDaysDiffFromToday(stdDeadline);
    const daysToInv = getDaysDiffFromToday(invDeadline);
    const daysToRetro = getDaysDiffFromToday(retroDeadline);

    const isPartyPast = daysToParty < 0;
    const isStdPast = daysToStd < 0;
    const isInvPast = daysToInv < 0;
    const isRetroPast = daysToRetro < 0;

    let status = 'HEALTHY';
    let statusTitle = 'Cronograma Saudável & Aprovado';
    let statusDescription = 'Todos os prazos retroativos e janelas de produção estão dentro dos padrões ideais configurados.';
    let actionRecommendation = `O evento de R$ ${Number(simValue).toLocaleString('pt-BR')} pode ser inserido na sua grade diária (${morningStart}–${afternoonEnd}) sem risco de colisão.`;

    if (isPartyPast) {
      status = 'INVALID_PAST';
      statusTitle = 'Data da Festa Inválida (Já Ocorrida)';
      statusDescription = `A data informada (${formatDateBR(simPartyDate)}) é anterior à data base do sistema (${formatDateBR(DEFAULT_SYSTEM_TODAY)}).`;
      actionRecommendation = 'Selecione uma data futura para planejar a produção do evento.';
    } else if (isInvPast) {
      status = 'CRITICAL_RISK';
      statusTitle = '🚨 RISCO CRÍTICO ASSUMIDO: Convite & Save the Date Vencidos';
      statusDescription = `A festa ocorrerá em apenas ${daysToParty} dias! Pela regra, o Convite Oficial deveria ter sido entregue há ${Math.abs(daysToInv)} dias e o Save the Date há ${Math.abs(daysToStd)} dias.`;
      actionRecommendation = 'AÇÃO RECOMENDADA: Cobrar taxa de urgência (Fast-Track 50%+), descartar Save the Date impresso e produzir convite digital em regime de emergência no primeiro horário da manhã.';
    } else if (isStdPast) {
      status = 'WARNING_RISK';
      statusTitle = '⚠ RISCO ASSUMIDO: Save the Date Vencido (Não-Entregável Padrão)';
      statusDescription = `Festa em ${daysToParty} dias. O prazo retroativo de ${stdWeeks} semanas para o Save the Date expirou em ${formatDateBR(stdDeadline)} (há ${Math.abs(daysToStd)} dias).`;
      actionRecommendation = 'AÇÃO RECOMENDADA: Informar cliente que o Save the Date tradicional é NÃO-ENTREGÁVEL no prazo. Sugerir disparo digital relâmpago hoje ou focar 100% da energia no Convite Oficial.';
    } else if (daysToStd <= 7 || daysToInv <= 7) {
      status = 'TIGHT';
      statusTitle = '⚡ Atenção: Janela de Produção Imediata (Fast-Track)';
      statusDescription = `O prazo do Save the Date vence em ${daysToStd} dias. Alocação imediata exigida na agenda de 08:00 AM.`;
      actionRecommendation = 'AÇÃO RECOMENDADA: Abrir briefing hoje mesmo e travar o layout para evitar estouro do SLA de aprovação de 48h.';
    }

    setSimResult({
      partyDate: simPartyDate,
      saveTheDateDeadline: stdDeadline,
      invitationDeadline: invDeadline,
      retrospectiveDeadline: retroDeadline,
      daysToParty,
      daysToStd,
      daysToInv,
      daysToRetro,
      isStdPast,
      isInvPast,
      isRetroPast,
      status,
      statusTitle,
      statusDescription,
      actionRecommendation
    });
  };

  const handleApplyReschedule = () => {
    const updated = projects.map(p => {
      if (p.collisionRisk) {
        return {
          ...p,
          collisionRisk: false,
          riskMessage: null,
          lastUpdate: `Prazos de produção reorganizados com sucesso pelo Amozir (${stdWeeks}w / ${invWeeks}w respeitados)`
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
              <p className="text-caption text-ink-muted">
                Regras: Std ({stdWeeks}w/{stdHours}h) • Convite ({invWeeks}w/{invHours}h) • Festa ({partyHours}h)
              </p>
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
            Regras ({stdWeeks}w / {invWeeks}w)
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

          {/* TAB 1: REGRAS PARAMETRIZADAS DO USUÁRIO */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="bg-accent-soft border border-line rounded-sm p-4 space-y-3">
                <h4 className="text-label font-semibold text-ink flex items-center gap-2">
                  <Sun className="w-4 h-4 text-accent" aria-hidden="true" />
                  Regras de retrocálculo configuradas no painel
                </h4>
                <p className="text-label text-ink-muted">
                  O Amozir monitora o tempo restante para cada festa e impõe os prazos e jornadas configuradas:
                </p>

                <ul className="text-label text-ink-muted space-y-2">
                  <li className="flex items-start gap-2 bg-surface p-2.5 rounded-xs border border-line">
                    <Bookmark className="w-4 h-4 shrink-0 mt-0.5 text-accent" aria-hidden="true" />
                    <div>
                      <strong className="font-semibold text-ink">Save the Date:</strong>{' '}
                      <span>{stdWeeks} semanas antes da Festa ({stdHours}h de produção)</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2 bg-surface p-2.5 rounded-xs border border-line">
                    <Mail className="w-4 h-4 shrink-0 mt-0.5 text-purple-500" aria-hidden="true" />
                    <div>
                      <strong className="font-semibold text-ink">Convite Oficial:</strong>{' '}
                      <span>{invWeeks} semanas antes da Festa ({invHours}h de produção)</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2 bg-surface p-2.5 rounded-xs border border-line">
                    <Film className="w-4 h-4 shrink-0 mt-0.5 text-cyan-500" aria-hidden="true" />
                    <div>
                      <strong className="font-semibold text-ink">Retrospectiva em Vídeo:</strong>{' '}
                      <span>{retroDays} dia antes da Festa ({retroHours}h de produção • SLA assets {assetSla}h)</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2 bg-surface p-2.5 rounded-xs border border-line">
                    <PartyPopper className="w-4 h-4 shrink-0 mt-0.5 text-accent" aria-hidden="true" />
                    <div>
                      <strong className="font-semibold text-ink">Festa / Evento Final:</strong>{' '}
                      <span>Data da festa ({partyHours}h de produção)</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2 bg-surface p-2.5 rounded-xs border border-line">
                    <Coffee className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
                    <div>
                      <strong className="font-semibold text-ink">Jornada &amp; Pausas:</strong>{' '}
                      <span>{morningStart}–{morningEnd} e {afternoonStart}–{afternoonEnd} com {breakMinutes}min de intervalo</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2 bg-surface p-2.5 rounded-xs border border-line">
                    <Clock className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" aria-hidden="true" />
                    <div>
                      <strong className="font-semibold text-ink">SLA de Aprovação do Cliente:</strong>{' '}
                      <span>{approvalSla} horas úteis para retorno</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Status Breakdown of Active Event Projects */}
              <div className="space-y-2">
                <h5 className="text-label font-semibold text-ink-muted pb-2 border-b border-line">
                  Projetos com alertas de regras e prazos
                </h5>

                {projects.filter(p => p.collisionRisk || p.daysWaitingClient > 2).map(p => (
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
                    <p className="text-caption text-ink-muted">{p.riskMessage || `Aguardando aprovação há ${p.daysWaitingClient} dias`}</p>
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
                  O Amozir monitora os gargalos de aprovação e os prazos de {stdWeeks}w (Save the Date) e {invWeeks}w (Convite) na jornada de 8h diárias.
                </p>
              </div>

              <div className="bg-surface border border-line rounded-sm p-4 space-y-3">
                <h5 className="text-label font-semibold text-ink-muted pb-2 border-b border-line">
                  Proposta do Amozir para ajustar os prazos
                </h5>

                <ol className="text-label text-ink-muted space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-accent tabular-nums">1.</span>
                    <span>Espaçar aprovações pendentes mantendo a antecedência mínima de {invWeeks} semanas antes de cada festa.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-accent tabular-nums">2.</span>
                    <span>Distribuir as sessões de produção nas janelas das {morningStart}–{morningEnd} e {afternoonStart}–{afternoonEnd} com {breakMinutes}min de pausa.</span>
                  </li>
                </ol>

                {rescheduleSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-sm text-emerald-700 text-label font-semibold flex items-center gap-2">
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

          {/* TAB 3: SIMULAR NOVO EVENTO COM DIAGNÓSTICO DE PRAZOS PASSADOS E RISCO ASSUMIDO */}
          {activeTab === 'capacity' && (
            <div className="space-y-4">
              <div className="bg-surface-2 border border-line rounded-sm p-4 space-y-2">
                <h4 className="text-label font-semibold text-ink flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent" aria-hidden="true" />
                  <span>Simulador de Prazos &amp; Diagnóstico de Risco</span>
                </h4>
                <p className="text-caption text-ink-muted">
                  Informe a data final do evento. O Amozir analisará se os prazos de Save the Date ({stdWeeks}w) e Convite ({invWeeks}w) estão no passado, classificando como <strong className="font-semibold text-ink">Risco Assumido</strong> ou <strong className="font-semibold text-ink">Não-Entregável</strong>.
                </p>

                {/* Atalhos rápidos de teste */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSimPartyDate('2026-09-25'); // Save the Date Vencido
                      setSimCategory('Casamento');
                      setSimValue(6200);
                    }}
                    className="text-[11px] font-semibold px-2 py-1 bg-surface border border-warning-border text-on-warning rounded-xs hover:bg-warning-surface transition-colors"
                  >
                    ⚡ Testar Festa em 3 Semanas (Std Vencido)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSimPartyDate('2026-09-10'); // Convite + Std Vencidos
                      setSimCategory('15 Anos');
                      setSimValue(4500);
                    }}
                    className="text-[11px] font-semibold px-2 py-1 bg-surface border border-urgent-border text-on-urgent rounded-xs hover:bg-urgent-surface transition-colors"
                  >
                    🚨 Testar Festa em 9 Dias (Convite Vencido)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSimPartyDate('2027-05-15'); // Saudável
                      setSimCategory('Casamento');
                      setSimValue(9200);
                    }}
                    className="text-[11px] font-semibold px-2 py-1 bg-surface border border-emerald-500/40 text-emerald-700 rounded-xs hover:bg-emerald-500/10 transition-colors"
                  >
                    ✓ Testar Festa em 2027 (Saudável)
                  </button>
                </div>
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
                  <span className="text-[11px] text-ink-muted mt-1 block">
                    Data de hoje para cálculo: <strong className="text-ink">01/09/2026</strong>
                  </span>
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
                  <span>Calcular Prazos &amp; Diagnosticar Risco</span>
                </button>
              </form>

              {/* CARD DE RESULTADO DA SIMULAÇÃO COM DIAGNÓSTICO DE RISCO E PRAZOS PASSADOS */}
              {simResult && (
                <div className={`p-4 rounded-md border space-y-4 animate-in fade-in zoom-in-95 duration-200 ${
                  simResult.status === 'CRITICAL_RISK'
                    ? 'bg-urgent-surface border-urgent-border text-ink'
                    : simResult.status === 'WARNING_RISK'
                    ? 'bg-warning-surface border-warning-border text-ink'
                    : simResult.status === 'TIGHT'
                    ? 'bg-accent-soft border-accent text-ink'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-ink'
                }`}>
                  
                  {/* Status Banner */}
                  <div className="space-y-1 pb-3 border-b border-line">
                    <div className="flex items-center gap-2">
                      {simResult.status === 'CRITICAL_RISK' && <AlertOctagon className="w-5 h-5 text-on-urgent shrink-0" />}
                      {simResult.status === 'WARNING_RISK' && <AlertTriangle className="w-5 h-5 text-on-warning shrink-0" />}
                      {simResult.status === 'TIGHT' && <Clock className="w-5 h-5 text-accent shrink-0" />}
                      {simResult.status === 'HEALTHY' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}

                      <h4 className={`text-label font-bold uppercase tracking-wider ${
                        simResult.status === 'CRITICAL_RISK'
                          ? 'text-on-urgent'
                          : simResult.status === 'WARNING_RISK'
                          ? 'text-on-warning'
                          : simResult.status === 'TIGHT'
                          ? 'text-accent'
                          : 'text-emerald-800'
                      }`}>
                        {simResult.statusTitle}
                      </h4>
                    </div>
                    <p className="text-caption text-ink-muted">
                      {simResult.statusDescription}
                    </p>
                  </div>

                  {/* Detalhamento Individual dos Entregáveis com Selos de Risco */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block">
                      Análise de Entregabilidade por Item:
                    </span>

                    {/* 1. Save the Date */}
                    <div className="p-2.5 rounded-sm bg-surface border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-caption">
                      <div className="flex items-center gap-2">
                        <Bookmark className={`w-4 h-4 shrink-0 ${simResult.isStdPast ? 'text-urgent' : 'text-accent'}`} />
                        <div>
                          <strong className="text-ink block">Save the Date ({stdWeeks} semanas / {stdHours}h):</strong>
                          <span className="text-ink-muted">Prazo ideal: {formatDateBR(simResult.saveTheDateDeadline)}</span>
                        </div>
                      </div>
                      <div>
                        {simResult.isStdPast ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-on-urgent bg-urgent-surface border border-urgent-border px-2 py-0.5 rounded-xs">
                            <XCircle className="w-3.5 h-3.5" />
                            Prazo Vencido há {Math.abs(simResult.daysToStd)}d (Não-Entregável)
                          </span>
                        ) : simResult.daysToStd <= 7 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-on-warning bg-warning-surface border border-warning-border px-2 py-0.5 rounded-xs">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Urgente (Vence em {simResult.daysToStd}d)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Prazo Seguro ({simResult.daysToStd}d)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 2. Convite Oficial */}
                    <div className="p-2.5 rounded-sm bg-surface border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-caption">
                      <div className="flex items-center gap-2">
                        <Mail className={`w-4 h-4 shrink-0 ${simResult.isInvPast ? 'text-urgent' : 'text-purple-500'}`} />
                        <div>
                          <strong className="text-ink block">Convite Oficial ({invWeeks} semanas / {invHours}h):</strong>
                          <span className="text-ink-muted">Prazo ideal: {formatDateBR(simResult.invitationDeadline)}</span>
                        </div>
                      </div>
                      <div>
                        {simResult.isInvPast ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-on-urgent bg-urgent-surface border border-urgent-border px-2 py-0.5 rounded-xs">
                            <AlertOctagon className="w-3.5 h-3.5" />
                            Vencido há {Math.abs(simResult.daysToInv)}d (Produção Emergencial)
                          </span>
                        ) : simResult.daysToInv <= 7 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-on-warning bg-warning-surface border border-warning-border px-2 py-0.5 rounded-xs">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Fast-Track (Vence em {simResult.daysToInv}d)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Prazo Seguro ({simResult.daysToInv}d)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 3. Retrospectiva */}
                    <div className="p-2.5 rounded-sm bg-surface border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-caption">
                      <div className="flex items-center gap-2">
                        <Film className="w-4 h-4 shrink-0 text-cyan-500" />
                        <div>
                          <strong className="text-ink block">Retrospectiva ({retroDays}d antes / {retroHours}h):</strong>
                          <span className="text-ink-muted">Prazo: {formatDateBR(simResult.retrospectiveDeadline)}</span>
                        </div>
                      </div>
                      <div>
                        {simResult.isRetroPast ? (
                          <span className="text-[11px] font-bold text-on-urgent bg-urgent-surface border border-urgent-border px-2 py-0.5 rounded-xs">
                            Prazo Vencido
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-ink-muted bg-surface-2 border border-line px-2 py-0.5 rounded-xs">
                            SLA Fotos: {assetSla}h
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recomendação de Ação do Amozir */}
                  <div className="p-3 bg-surface/90 border border-line rounded-sm space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-accent flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Diagnóstico do Agente Amozir:
                    </span>
                    <p className="text-caption font-medium text-ink">
                      {simResult.actionRecommendation}
                    </p>
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
