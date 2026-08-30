import React, { useState } from 'react';
import { X, Calendar, CheckSquare, User, PartyPopper, Mail, Bookmark, Sun, FileText, DollarSign, Clock, AlertTriangle, MessageSquare, Check, Copy, Film, Image, CheckCircle2 } from 'lucide-react';
import { STAGES } from '../data/mockData';
import { formatDateBR, calculateRetrospectiveDeadline } from '../utils/dateUtils';

export default function ProjectDetailModal({ project, onClose, settings }) {
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedAssetMessage, setCopiedAssetMessage] = useState(false);
  const [assetsReceivedState, setAssetsReceivedState] = useState(project?.assetsReceived || false);

  if (!project) return null;

  const approvalSlaHours = settings?.approvalSlaHours || 48;
  const assetSlaHours = settings?.assetDeliverySlaHours || 72;
  const retroHours = settings?.retrospectiveHours || 8;
  const retroDaysBefore = settings?.retrospectiveDaysBeforeParty || 1;

  const currentStageInfo = STAGES.find(s => s.id === project.stage);

  // Cálculo de estouro de SLA (em horas)
  const isWaitingApproval = project.stage === 'waiting_approval' || project.daysWaitingClient > 0;
  const waitingHours = (project.daysWaitingClient || 0) * 24;
  const isSlaExceeded = isWaitingApproval && waitingHours > approvalSlaHours;
  const overdueHours = isSlaExceeded ? waitingHours - approvalSlaHours : 0;

  const retrospectiveDate = project.retrospectiveDeadline || calculateRetrospectiveDeadline(project.partyDate, retroDaysBefore);
  const hasRetrospective = project.hasRetrospective || project.category === '15 Anos' || project.category === 'Casamento' || project.category === 'Bodas';

  // Mensagem amigável de cobrança de SLA 48h (Aprovação de Arte)
  const generateCobrançaText = () => {
    return `Olá ${project.client}, tudo bem? 😊 Passando para avisar que a prova da arte do projeto "${project.name}" foi enviada para sua aprovação. Para garantirmos o prazo limite de produção e envio sem correria, precisamos da sua validação ou ajustes em até ${approvalSlaHours}h. Qualquer dúvida estou à disposição para finalizar! 🎨✨`;
  };

  // Mensagem amigável de cobrança dos Assets (Fotos/Vídeos) para Retrospectiva
  const generateAssetCobrançaText = () => {
    return `Olá ${project.client}! 🎬 Para iniciarmos a produção da Retrospectiva em Vídeo de 8h para a festa (${formatDateBR(project.partyDate)}), precisamos receber o acervo de fotos e vídeos da infância/família. Como a entrega é feita 1 dia antes da festa (${formatDateBR(retrospectiveDate)}), solicitamos o envio dos materiais em até ${assetSlaHours}h. Pode nos enviar por aqui ou Google Drive? Obrigado! ✨📸`;
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generateCobrançaText());
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  const handleCopyAssetMessage = () => {
    navigator.clipboard.writeText(generateAssetCobrançaText());
    setCopiedAssetMessage(true);
    setTimeout(() => setCopiedAssetMessage(false), 2500);
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
              {hasRetrospective && !assetsReceivedState && (
                <span className="inline-flex items-center gap-1 text-caption font-semibold uppercase text-accent bg-accent-soft border border-line px-2 py-0.5 rounded-xs">
                  <Image className="w-3.5 h-3.5" />
                  Fotos/Vídeos Pendentes ({assetSlaHours}h SLA)
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

        {/* REGRA DA RETROSPECTIVA E PRÉ-CONDIÇÃO DOS ASSETS DO CLIENTE */}
        {hasRetrospective && (
          <div className={`p-4 rounded-md border space-y-3 ${
            !assetsReceivedState ? 'bg-accent-soft/40 border-accent/40' : 'bg-surface-2 border-line'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-label font-semibold text-ink flex items-center gap-2">
                <Film className="w-4 h-4 text-accent" />
                Regra da Retrospectiva ({retroHours}h de produção • Entrega 1 dia antes da festa)
              </h3>
              <button
                type="button"
                onClick={() => setAssetsReceivedState(!assetsReceivedState)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xs text-caption font-semibold transition-colors ${
                  assetsReceivedState
                    ? 'bg-success-surface text-on-success border border-success-border'
                    : 'bg-warning-surface text-on-warning border border-warning-border'
                }`}
              >
                {assetsReceivedState ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Assets Recebidos — Produção Liberada</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Assets Pendentes — Clique para confirmar recebimento</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-caption text-ink-muted">
              {assetsReceivedState
                ? `Fotos e vídeos recebidos! A retrospectiva de ${retroHours}h está agendada para ser entregue em ${formatDateBR(retrospectiveDate)} (1 dia antes da festa).`
                : `Pré-condição obrigatória: A produção da retrospectiva de ${retroHours}h exige o recebimento prévio das fotos/vídeos. SLA limite do cliente: ${assetSlaHours}h.`}
            </p>

            {/* Cobrança de Assets */}
            {!assetsReceivedState && (
              <div className="pt-2 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-caption font-semibold text-ink flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-accent" />
                  Cobrança de Fotos/Vídeos no WhatsApp (SLA {assetSlaHours}h)
                </span>
                <button
                  type="button"
                  onClick={handleCopyAssetMessage}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-accent hover:bg-accent-hover text-on-accent text-caption font-semibold transition-colors"
                >
                  {copiedAssetMessage ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Lembrete de Fotos</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

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
                    <span>Copiado!</span>
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

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-caption">

            {/* 1. Save the Date */}
            <div className="bg-surface p-2.5 rounded-sm border border-line space-y-1">
              <span className="flex items-center gap-1 font-semibold text-ink">
                <Bookmark className="w-3.5 h-3.5 text-ink-subtle" />
                Save the Date
              </span>
              <span className="block text-ink-muted">6w semanas</span>
              <strong className="block font-semibold text-ink tabular-nums">{formatDateBR(project.saveTheDateDeadline)}</strong>
            </div>

            {/* 2. Convite */}
            <div className="bg-surface p-2.5 rounded-sm border border-line space-y-1">
              <span className="flex items-center gap-1 font-semibold text-ink">
                <Mail className="w-3.5 h-3.5 text-ink-subtle" />
                Convite Oficial
              </span>
              <span className="block text-ink-muted">3w semanas</span>
              <strong className="block font-semibold text-ink tabular-nums">{formatDateBR(project.invitationDeadline)}</strong>
            </div>

            {/* 3. Retrospectiva (se ativa) */}
            <div className="bg-surface p-2.5 rounded-sm border border-line space-y-1">
              <span className="flex items-center gap-1 font-semibold text-ink">
                <Film className="w-3.5 h-3.5 text-accent" />
                Retrospectiva
              </span>
              <span className="block text-ink-muted">1 dia antes ({retroHours}h)</span>
              <strong className="block font-semibold text-ink tabular-nums">{formatDateBR(retrospectiveDate)}</strong>
            </div>

            {/* 4. Festa */}
            <div className="bg-accent-soft p-2.5 rounded-sm border border-line-strong space-y-1">
              <span className="flex items-center gap-1 font-semibold text-accent">
                <PartyPopper className="w-3.5 h-3.5 text-accent" />
                Festa Final
              </span>
              <span className="block text-ink-muted">Dia da Festa</span>
              <strong className="block font-semibold text-accent tabular-nums">{formatDateBR(project.partyDate)}</strong>
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
                    : item.isRetrospective
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
              {hasRetrospective && !assetsReceivedState
                ? `Atenção: A Retrospectiva de ${retroHours}h precisa ser entregue em ${formatDateBR(retrospectiveDate)} (1 dia antes da festa), mas as fotos do cliente continuam pendentes. Envie a cobrança do SLA de ${assetSlaHours}h!`
                : `Tudo sob controle! O cronograma retroativo respeita as janelas da jornada de trabalho (08h-17h) e pausas de 15min.`}
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
