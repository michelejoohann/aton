import React, { useState } from 'react';
import { X, Calendar, CheckSquare, User, PartyPopper, Mail, Bookmark, Sun, FileText, DollarSign, Clock, AlertTriangle, MessageSquare, Check, Copy } from 'lucide-react';
import { STAGES } from '../data/mockData';
import { formatDateBR } from '../utils/dateUtils';

export default function ProjectDetailModal({ project, onClose, settings }) {
  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!project) return null;

  const approvalSlaHours = settings?.approvalSlaHours || 48;
  const currentStageInfo = STAGES.find(s => s.id === project.stage);

  // Cálculo de estouro de SLA (em horas)
  const isWaitingApproval = project.stage === 'waiting_approval' || project.daysWaitingClient > 0;
  const waitingHours = (project.daysWaitingClient || 0) * 24;
  const isSlaExceeded = isWaitingApproval && waitingHours > approvalSlaHours;
  const overdueHours = isSlaExceeded ? waitingHours - approvalSlaHours : 0;

  // Mensagem amigável de cobrança de SLA 48h
  const generateCobrançaText = () => {
    return `Olá ${project.client}, tudo bem? 😊 Passando para avisar que a prova da arte do projeto "${project.name}" foi enviada para sua aprovação. Para garantirmos o prazo limite de produção e envio sem correria, precisamos da sua validação ou ajustes em até ${approvalSlaHours}h. Qualquer dúvida estou à disposição para finalizar! 🎨✨`;
  };

  const handleCopyMessage = () => {
    const text = generateCobrançaText();
    navigator.clipboard.writeText(text);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-surface border border-line rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-modal text-ink p-5 sm:p-6 space-y-6">

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-line-strong">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-caption uppercase font-semibold tracking-[0.1em] px-2 py-0.5 rounded-xs border border-line-strong bg-surface-2 text-ink">
                {currentStageInfo?.title}
              </span>
              <span className="text-caption uppercase font-semibold tracking-[0.1em] bg-surface text-ink-muted px-2 py-0.5 rounded-xs border border-line">
                {project.category}
              </span>
              {isSlaExceeded && (
                <span className="inline-flex items-center gap-1 text-caption font-semibold uppercase text-on-warning bg-warning-surface border border-warning-border px-2 py-0.5 rounded-xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  SLA 48h Estourado (+{overdueHours}h)
                </span>
              )}
            </div>
            <h2 className="font-display text-page-title font-semibold text-ink tracking-tight">
              {project.name}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-label text-ink-muted mt-1.5">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
                Cliente: <strong className="font-semibold text-ink">{project.client}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
                Contrato: <strong className="font-semibold text-ink">{formatDateBR(project.contractDate || '2026-09-01')}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
                Valor: <strong className="font-semibold text-ink tabular-nums">R$ {project.value.toLocaleString('pt-BR')}</strong>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar detalhes do projeto"
            className="inline-flex items-center justify-center shrink-0 p-2 rounded-sm border border-line-control bg-surface text-ink-muted hover:bg-surface-2 hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* REGRA DE NEGÓCIO & SLA DE ACEITE DO CLIENTE FINAL (48H) */}
        <div className={`p-4 rounded-md border space-y-3 ${
          isSlaExceeded ? 'bg-warning-surface border-warning-border' : 'bg-surface-2 border-line'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-label font-semibold text-ink flex items-center gap-2">
              <Clock className={`w-4 h-4 ${isSlaExceeded ? 'text-on-warning' : 'text-accent'}`} aria-hidden="true" />
              SLA de Aceite do Cliente Final (Regra {approvalSlaHours}h)
            </h3>
            {isSlaExceeded ? (
              <span className="text-caption font-bold text-on-warning bg-surface border border-warning-border px-2 py-0.5 rounded-xs tabular-nums">
                Atrasado há {overdueHours}h além do limite de {approvalSlaHours}h
              </span>
            ) : (
              <span className="text-caption font-semibold text-ink-muted">
                SLA em dia ({approvalSlaHours}h limite de resposta)
              </span>
            )}
          </div>

          <p className="text-caption text-ink-muted">
            {isSlaExceeded
              ? `O cliente final (${project.client}) está há ${project.daysWaitingClient} dias (${waitingHours}h) sem responder à aprovação de layout. O SLA limite de ${approvalSlaHours}h foi excedido.`
              : `Regra de Negócio ativa: O cliente final tem até ${approvalSlaHours} horas para responder e aprovar os entregáveis após o envio.`}
          </p>

          {/* Gerador de Cobrança Amigável */}
          {isWaitingApproval && (
            <div className="pt-2 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-caption font-semibold text-ink flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-accent" />
                Mensagem Automática de Cobrança do SLA 48h
              </span>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-accent hover:bg-accent-hover text-on-accent text-caption font-semibold transition-colors"
              >
                {copiedMessage ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copiado para o Transferidor!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Cobrança em 1-Clique</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Deliverables Timeline Display */}
        <div className="bg-surface-2 border border-line rounded-sm p-4 space-y-3">
          <h3 className="text-label font-semibold text-ink flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" aria-hidden="true" />
            Cronograma dos entregáveis do contrato
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-grid">

            {/* 1. Save the Date */}
            <div className="bg-surface p-3 rounded-sm border border-line space-y-1">
              <div className="flex items-center justify-between gap-2 text-ink font-semibold text-label">
                <span className="flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
                  Save the Date
                </span>
              </div>
              <p className="text-caption text-ink-muted">Prazo limite:</p>
              <strong className="block text-section-title font-semibold text-ink tabular-nums">{formatDateBR(project.saveTheDateDeadline)}</strong>
            </div>

            {/* 2. Convite */}
            <div className="bg-surface p-3 rounded-sm border border-line space-y-1">
              <div className="flex items-center justify-between gap-2 text-ink font-semibold text-label">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
                  Convite Oficial
                </span>
              </div>
              <p className="text-caption text-ink-muted">Prazo limite:</p>
              <strong className="block text-section-title font-semibold text-ink tabular-nums">{formatDateBR(project.invitationDeadline)}</strong>
            </div>

            {/* 3. Festa */}
            <div className="bg-accent-soft p-3 rounded-sm border border-line-strong space-y-1">
              <div className="flex items-center justify-between gap-2 text-ink font-semibold text-label">
                <span className="flex items-center gap-1.5">
                  <PartyPopper className="w-4 h-4 text-accent" aria-hidden="true" />
                  Data da Festa
                </span>
              </div>
              <p className="text-caption text-ink-muted">Dia do Evento:</p>
              <strong className="block text-section-title font-semibold text-accent tabular-nums">{formatDateBR(project.partyDate)}</strong>
            </div>

          </div>
        </div>

        {/* Deliverables Checklist */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-line">
            <h3 className="text-section-title font-semibold text-ink flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-accent" aria-hidden="true" />
              Etapas dos entregáveis do contrato
            </h3>
            <span className="text-label text-ink-muted tabular-nums">
              {project.deliverables.filter(d => d.completed).length} de {project.deliverables.length} entregues
            </span>
          </div>

          <div className="space-y-2">
            {project.deliverables.map(item => (
              <div
                key={item.id}
                className={`flex flex-wrap items-center justify-between gap-2 p-3 rounded-sm border ${
                  item.completed
                    ? 'bg-surface-2 border-line text-ink-muted'
                    : item.isExtra
                    ? 'bg-accent-soft/30 border-accent/40 text-ink'
                    : 'bg-surface border-line text-ink'
                }`}
              >
                <div className="min-w-0">
                  <span className={`text-label font-semibold block ${item.completed ? 'line-through' : ''}`}>
                    {item.title}
                  </span>
                  <span className="text-caption text-ink-muted">
                    {item.rule} • Prazo: <span className="tabular-nums">{formatDateBR(item.deadline)}</span>
                  </span>
                </div>

                <span className={`inline-flex items-center gap-1.5 text-caption font-semibold uppercase tracking-[0.08em] px-2 py-1 rounded-xs border ${
                  item.completed
                    ? 'bg-success-surface text-on-success border-success-border'
                    : 'bg-warning-surface text-on-warning border-warning-border'
                }`}>
                  {item.completed ? <CheckSquare className="w-3.5 h-3.5" aria-hidden="true" /> : <Calendar className="w-3.5 h-3.5" aria-hidden="true" />}
                  {item.completed ? 'Entregue' : 'Em Produção'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="p-4 bg-accent-soft border border-line rounded-sm flex items-start gap-3">
          <Sun className="w-5 h-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <strong className="block text-section-title font-semibold text-ink mb-1">
              Orientação do Amozir
            </strong>
            <p className="text-label text-ink-muted">
              {isSlaExceeded
                ? `O cliente final excedeu o SLA de resposta de ${approvalSlaHours}h. Utilize o botão acima para enviar o lembrete de cobrança e evitar travamento da caligrafia e impressão.`
                : `Mantenha o acompanhamento do SLA de ${approvalSlaHours}h. O cronograma retroativo garante a entrega sem pânico na véspera da festa.`}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-line">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-sm bg-accent hover:bg-accent-hover text-on-accent text-label font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}
