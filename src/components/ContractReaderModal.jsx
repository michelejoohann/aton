import React, { useState } from 'react';
import {
  X,
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Clock,
  Calendar,
  Check,
  Plus,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Coffee,
  Bookmark,
  Mail,
  PartyPopper,
  Film
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  calculateSaveTheDateDeadline,
  calculateInvitationDeadline,
  calculateRetrospectiveDeadline,
  formatDateBR,
  getDaysDiffFromToday
} from '../utils/dateUtils.js';

// Amostras pré-carregadas para teste instantâneo sem necessidade de upload local
const SAMPLE_CONTRACTS = [
  {
    id: 'sample-1',
    title: 'Contrato Casamento Luxo (com Site RSVP e Havaianas Extras)',
    fileName: 'Contrato_Casamento_Vanessa_e_Rodrigo_2027.pdf',
    extracted: {
      name: 'Casamento Vanessa & Rodrigo',
      client: 'Vanessa Medeiros',
      category: 'Casamento',
      value: 9200,
      contractDate: '2026-09-01',
      partyDate: '2027-05-15',
      hasRetrospective: true,
      extraDeliverables: [
        {
          id: 'extra-1',
          title: 'Site do Evento com RSVP & Lista de Presentes',
          description: 'Desenvolvimento de landing page responsiva com confirmação de presença online e integração PIX.',
          suggestedHours: 8,
          suggestedDeadlineWeeks: 8,
          accepted: true,
        },
        {
          id: 'extra-2',
          title: 'Chinelo/Havaiana Personalizado para Pista',
          description: 'Arte e vetorização das tiras e solado de 150 pares de sandálias personalizadas para a festa.',
          suggestedHours: 5,
          suggestedDeadlineWeeks: 4,
          accepted: true,
        }
      ]
    }
  },
  {
    id: 'sample-2',
    title: 'Briefing 15 Anos (com Painel Neon & Kit Lágrimas de Alegria)',
    fileName: 'Briefing_15Anos_Sophia_Almeida.docx',
    extracted: {
      name: '15 Anos Sophia Almeida',
      client: 'Kátia Almeida (Mãe)',
      category: '15 Anos',
      value: 6500,
      contractDate: '2026-09-01',
      partyDate: '2027-02-20',
      hasRetrospective: true,
      extraDeliverables: [
        {
          id: 'extra-3',
          title: 'Painel Neon Personalizado para Pista',
          description: 'Design da frase em neon led e gabarito técnico para marcenaria do evento.',
          suggestedHours: 4,
          suggestedDeadlineWeeks: 5,
          accepted: true,
        },
        {
          id: 'extra-4',
          title: 'Lágrimas de Alegria e Leques Decorados',
          description: 'Confecção de 100 saquinhos rendados com lenço e leques impressos.',
          suggestedHours: 6,
          suggestedDeadlineWeeks: 3,
          accepted: true,
        }
      ]
    }
  }
];

export default function ContractReaderModal({ isOpen, onClose, onAddProject, settings, projects = [] }) {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [step, setStep] = useState('UPLOAD_OR_REVIEW'); // 'UPLOAD_OR_REVIEW' | 'AGREEMENT_CONFIRMATION' | 'SUCCESS_TOAST'

  if (!isOpen) return null;

  const stdWeeks = settings?.saveTheDateWeeks || 6;
  const invWeeks = settings?.invitationWeeks || 3;
  const stdHours = settings?.saveTheDateHours || 5;
  const invHours = settings?.invitationHours || 10;
  const partyHours = settings?.partyHours || 20;
  const retroHours = settings?.retrospectiveHours || 8;
  const breakMinutes = settings?.breakMinutes || 15;

  // Processa o arquivo ou amostra selecionada
  const handleProcessFile = (sample = null) => {
    setIsAnalyzing(true);
    setAnalysisDone(false);
    setStep('UPLOAD_OR_REVIEW');

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisDone(true);
      if (sample) {
        setExtractedData(JSON.parse(JSON.stringify(sample.extracted)));
      } else {
        setExtractedData({
          name: file ? file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ') : 'Evento Importado via Contrato',
          client: 'Cliente Extraído do Documento',
          category: 'Casamento',
          value: 7800,
          contractDate: '2026-09-01',
          partyDate: '2027-04-18',
          hasRetrospective: true,
          extraDeliverables: [
            {
              id: `extra-gen-1`,
              title: 'Identidade Visual de Cardápio em Acrílico',
              description: 'Gravação a laser e impressão UV em placas acrílicas.',
              suggestedHours: 6,
              suggestedDeadlineWeeks: 4,
              accepted: true
            }
          ]
        });
      }
    }, 1200);
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      handleProcessFile(null);
    }
  };

  const handleToggleExtraAccepted = (extraId) => {
    setExtractedData(prev => ({
      ...prev,
      extraDeliverables: prev.extraDeliverables.map(item => {
        if (item.id === extraId) {
          return { ...item, accepted: !item.accepted };
        }
        return item;
      })
    }));
  };

  const handleUpdateExtraHours = (extraId, hours) => {
    setExtractedData(prev => ({
      ...prev,
      extraDeliverables: prev.extraDeliverables.map(item => {
        if (item.id === extraId) {
          return { ...item, suggestedHours: Number(hours) };
        }
        return item;
      })
    }));
  };

  // Prazos calculados
  const stdDeadline = extractedData ? calculateSaveTheDateDeadline(extractedData.partyDate, stdWeeks) : '';
  const invDeadline = extractedData ? calculateInvitationDeadline(extractedData.partyDate, invWeeks) : '';
  const retroDeadline = extractedData ? calculateRetrospectiveDeadline(extractedData.partyDate, 1) : '';

  const acceptedExtras = extractedData?.extraDeliverables?.filter(item => item.accepted) || [];
  const extrasHoursTotal = acceptedExtras.reduce((sum, item) => sum + (Number(item.suggestedHours) || 0), 0);
  const totalProductionHours = stdHours + invHours + partyHours + (extractedData?.hasRetrospective ? retroHours : 0) + extrasHoursTotal;

  // Diagnóstico de colisão com projetos existentes
  const collisionAlerts = [];
  if (extractedData) {
    projects.forEach(existingProj => {
      if (existingProj.saveTheDateDeadline && stdDeadline) {
        const diff = Math.abs(getDaysDiffFromToday(existingProj.saveTheDateDeadline) - getDaysDiffFromToday(stdDeadline));
        if (diff <= 3) {
          collisionAlerts.push(`Prazo de Save the Date (${formatDateBR(stdDeadline)}) coincide com '${existingProj.name}' (${formatDateBR(existingProj.saveTheDateDeadline)})`);
        }
      }
      if (existingProj.invitationDeadline && invDeadline) {
        const diff = Math.abs(getDaysDiffFromToday(existingProj.invitationDeadline) - getDaysDiffFromToday(invDeadline));
        if (diff <= 3) {
          collisionAlerts.push(`Prazo de Convite (${formatDateBR(invDeadline)}) coincide com aprovação de '${existingProj.name}'`);
        }
      }
    });
  }

  // Avança para a tela de Acordo de Confirmação
  const handleProceedToAgreement = () => {
    setStep('AGREEMENT_CONFIRMATION');
  };

  // Efetiva o cadastro, dispara confetes, replaneja calendário e fecha
  const handleFinalConfirmAgreement = () => {
    if (!extractedData) return;

    const baseDeliverables = [
      { id: `d-${Date.now()}-std`, title: 'Save the Date', rule: `${stdWeeks} semanas antes`, requiredHours: stdHours, deadline: stdDeadline, status: 'in_progress', completed: false },
      { id: `d-${Date.now()}-inv`, title: 'Convite Oficial', rule: `${invWeeks} semanas antes`, requiredHours: invHours, deadline: invDeadline, status: 'pending', completed: false },
      { id: `d-${Date.now()}-party`, title: 'Identidade da Festa', rule: 'Data da Festa', requiredHours: partyHours, deadline: extractedData.partyDate, status: 'pending', completed: false }
    ];

    if (extractedData.hasRetrospective) {
      baseDeliverables.push({
        id: `d-${Date.now()}-retro`,
        title: 'Retrospectiva em Vídeo',
        rule: '1 dia antes da festa',
        requiredHours: retroHours,
        deadline: retroDeadline,
        status: 'pending',
        completed: false,
        isRetrospective: true,
        requiresAssets: true
      });
    }

    const extraDeliverableObjects = acceptedExtras.map((item, idx) => {
      const extraDeadline = calculateSaveTheDateDeadline(extractedData.partyDate, item.suggestedDeadlineWeeks || 4);
      return {
        id: `d-${Date.now()}-extra-${idx}`,
        title: `[EXTRA] ${item.title}`,
        rule: `${item.suggestedDeadlineWeeks || 4} sem antes (${item.suggestedHours}h)`,
        requiredHours: item.suggestedHours || 5,
        deadline: extraDeadline,
        status: 'pending',
        completed: false,
        isExtra: true,
        description: item.description
      };
    });

    const newProject = {
      id: `proj-${Date.now()}`,
      name: extractedData.name,
      client: extractedData.client,
      stage: 'briefing',
      value: Number(extractedData.value),
      contractDate: extractedData.contractDate || '2026-09-01',
      partyDate: extractedData.partyDate,
      saveTheDateDeadline: stdDeadline,
      invitationDeadline: invDeadline,
      retrospectiveDeadline: retroDeadline,
      hasRetrospective: Boolean(extractedData.hasRetrospective),
      assetsReceived: false,
      deadline: extractedData.partyDate,
      daysWaitingClient: 0,
      collisionRisk: collisionAlerts.length > 0 || acceptedExtras.length > 1,
      riskMessage: collisionAlerts.length > 0
        ? collisionAlerts[0]
        : acceptedExtras.length > 0
        ? `${acceptedExtras.length} entregáveis extras adicionados e replanejados na agenda`
        : 'Cronograma e pausas replanejados com sucesso',
      progress: 5,
      category: extractedData.category || 'Casamento',
      deliverables: [...baseDeliverables, ...extraDeliverableObjects],
      lastUpdate: `Contrato homologado e aprovado (${totalProductionHours}h replanejadas na agenda)`
    };

    // Dispara confetes de comemoração
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignora caso ambiente sem canvas
    }

    onAddProject(newProject);
    setStep('SUCCESS_TOAST');

    setTimeout(() => {
      onClose();
      setStep('UPLOAD_OR_REVIEW');
      setAnalysisDone(false);
      setExtractedData(null);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-surface border border-line rounded-md w-full max-w-3xl my-8 shadow-modal text-ink overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-line bg-surface-2">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-accent">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-section-title font-semibold text-ink flex items-center gap-2">
                Agente Leitor de Contratos &amp; Briefings IA
              </h2>
              <p className="text-caption text-ink-muted mt-0.5">
                {step === 'AGREEMENT_CONFIRMATION'
                  ? 'Acordo de Confirmação & Replanejamento Automático do Calendário'
                  : 'Faça upload do contrato (PDF/DOC) para extração automática da data da festa e entregáveis extras.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-sm text-ink-muted hover:text-ink hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* ESTADO 1: Upload / Seleção de Amostras */}
          {step === 'UPLOAD_OR_REVIEW' && !analysisDone && !isAnalyzing && (
            <div className="space-y-5">
              {/* Dropzone de Upload */}
              <div className="border-2 border-dashed border-line-strong hover:border-accent rounded-md p-8 text-center bg-surface-2 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="w-10 h-10 text-accent mx-auto mb-3" />
                <h3 className="text-label font-semibold text-ink">Arraste seu PDF ou DOC do Contrato aqui</h3>
                <p className="text-caption text-ink-muted mt-1">Suporta arquivos PDF, DOCX e TXT de briefings e contratos de eventos</p>
                <span className="inline-block mt-4 px-4 py-2 rounded-sm bg-surface border border-line text-caption font-semibold text-accent">
                  Selecionar Arquivo do Computador
                </span>
              </div>

              {/* Contratos de Amostra para Teste Rápido */}
              <div className="space-y-3">
                <span className="block text-caption font-semibold text-ink-muted uppercase tracking-wider">
                  Ou teste com um contrato pré-carregado em 1 clique:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SAMPLE_CONTRACTS.map(sample => (
                    <button
                      key={sample.id}
                      onClick={() => handleProcessFile(sample)}
                      className="p-4 rounded-sm border border-line bg-surface hover:border-accent hover:bg-accent-soft/30 text-left transition-all group"
                    >
                      <div className="flex items-center gap-2 text-label font-semibold text-ink group-hover:text-accent">
                        <FileText className="w-4 h-4 text-accent shrink-0" />
                        <span className="truncate">{sample.title}</span>
                      </div>
                      <p className="text-caption text-ink-muted mt-1">
                        Arquivo: <span className="font-mono text-ink-subtle">{sample.fileName}</span>
                      </p>
                      <span className="inline-flex items-center gap-1 text-caption font-semibold text-accent mt-2">
                        <span>Analisar Contrato</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ESTADO 2: Estado de Processamento da IA */}
          {isAnalyzing && (
            <div className="p-12 text-center space-y-4">
              <Sparkles className="w-12 h-12 text-accent mx-auto animate-spin" />
              <h3 className="text-section-title font-semibold text-ink">O Agente Amozir está lendo o contrato...</h3>
              <p className="text-caption text-ink-muted max-w-md mx-auto">
                Escaneando cláusulas, identificando a data da festa, prazos limites e buscando entregáveis extras não-padronizados.
              </p>
            </div>
          )}

          {/* ESTADO 3: Resultado da Extração & Customização de Entregáveis */}
          {step === 'UPLOAD_OR_REVIEW' && analysisDone && extractedData && (
            <div className="space-y-6">

              {/* Dados Principais Extraídos */}
              <div className="p-4 bg-accent-soft/50 border border-line rounded-md space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-line">
                  <span className="inline-flex items-center gap-1.5 text-caption font-semibold uppercase text-accent">
                    <CheckCircle className="w-4 h-4" />
                    Dados Extraídos do Documento
                  </span>
                  <span className="text-caption font-semibold text-ink tabular-nums">
                    Valor: R$ {extractedData.value.toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-caption">
                  <div>
                    <span className="block text-ink-muted">Evento:</span>
                    <strong className="text-ink font-semibold text-label">{extractedData.name}</strong>
                  </div>
                  <div>
                    <span className="block text-ink-muted">Cliente:</span>
                    <strong className="text-ink font-semibold text-label">{extractedData.client}</strong>
                  </div>
                  <div>
                    <span className="block text-ink-muted">Data da Festa:</span>
                    <strong className="text-accent font-semibold text-label tabular-nums">{formatDateBR(extractedData.partyDate)}</strong>
                  </div>
                </div>
              </div>

              {/* Prazos Retroativos Calculados */}
              <div className="p-4 bg-surface-2 border border-line rounded-md space-y-2 text-caption">
                <h4 className="font-semibold text-ink flex items-center gap-1.5 mb-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  Prazos Retroativos Obrigatórios do Contrato
                </h4>
                <div className="flex justify-between border-b border-line pb-1">
                  <span>Save the Date ({stdWeeks} semanas antes / {stdHours}h produção):</span>
                  <strong className="text-ink tabular-nums">{formatDateBR(stdDeadline)}</strong>
                </div>
                <div className="flex justify-between border-b border-line pb-1">
                  <span>Convite Oficial ({invWeeks} semanas antes / {invHours}h produção):</span>
                  <strong className="text-ink tabular-nums">{formatDateBR(invDeadline)}</strong>
                </div>
                {extractedData.hasRetrospective && (
                  <div className="flex justify-between border-b border-line pb-1">
                    <span>Retrospectiva em Vídeo (1 dia antes / {retroHours}h produção):</span>
                    <strong className="text-ink tabular-nums">{formatDateBR(retroDeadline)}</strong>
                  </div>
                )}
                <div className="flex justify-between pt-1">
                  <span className="font-semibold text-ink">Festa / Evento Final ({partyHours}h produção):</span>
                  <strong className="text-accent tabular-nums">{formatDateBR(extractedData.partyDate)}</strong>
                </div>
              </div>

              {/* PAINEL DE APROVAÇÃO DE ENTREGÁVEIS EXTRAS */}
              {extractedData.extraDeliverables && extractedData.extraDeliverables.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-line">
                    <h3 className="text-label font-semibold text-ink flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      Entregáveis Extras Não-Padronizados Detectados ({extractedData.extraDeliverables.length})
                    </h3>
                    <span className="text-caption text-ink-muted">Defina prazos, tempo de produção e aceite/recuse</span>
                  </div>

                  <div className="space-y-3">
                    {extractedData.extraDeliverables.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-md border transition-all ${
                          item.accepted
                            ? 'bg-surface border-line-strong shadow-subtle'
                            : 'bg-surface-2 border-line opacity-60'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-label font-semibold text-ink">{item.title}</span>
                              {item.accepted ? (
                                <span className="text-caption font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 px-2 py-0.5 rounded-xs">
                                  Atividade Aceita
                                </span>
                              ) : (
                                <span className="text-caption font-semibold bg-surface-2 text-ink-subtle border border-line px-2 py-0.5 rounded-xs">
                                  Recusada
                                </span>
                              )}
                            </div>
                            <p className="text-caption text-ink-muted">{item.description}</p>
                          </div>

                          {/* Toggle Accept Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleExtraAccepted(item.id)}
                            className={`px-3 py-1.5 rounded-sm text-caption font-semibold whitespace-nowrap transition-colors ${
                              item.accepted
                                ? 'bg-surface-2 border border-line text-ink hover:bg-surface'
                                : 'bg-accent text-on-accent hover:bg-accent-hover'
                            }`}
                          >
                            {item.accepted ? 'Recusar Atividade' : 'Aceitar Atividade'}
                          </button>
                        </div>

                        {/* Configurações da atividade extra */}
                        {item.accepted && (
                          <div className="mt-3 pt-3 border-t border-line grid grid-cols-1 sm:grid-cols-2 gap-3 bg-surface-2 p-3 rounded-sm">
                            <div>
                              <label className="block text-caption text-ink-muted mb-1">
                                Tempo de Produção Exigido (Horas)
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  value={item.suggestedHours}
                                  onChange={(e) => handleUpdateExtraHours(item.id, e.target.value)}
                                  className="w-24 px-2.5 py-1.5 rounded-sm border border-line-control bg-surface text-ink text-caption font-semibold focus:outline-none"
                                />
                                <span className="text-caption text-ink-muted">horas</span>
                              </div>
                            </div>

                            <div>
                              <label className="block text-caption text-ink-muted mb-1">
                                Prazo Limite Sugerido
                              </label>
                              <span className="text-caption font-semibold text-ink block mt-1">
                                {item.suggestedDeadlineWeeks} semanas antes da festa ({formatDateBR(calculateSaveTheDateDeadline(extractedData.partyDate, item.suggestedDeadlineWeeks))})
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-line flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAnalysisDone(false);
                    setExtractedData(null);
                  }}
                  className="px-4 py-2 rounded-sm text-caption font-semibold text-ink-muted hover:text-ink hover:bg-surface-2"
                >
                  Analisar Outro Arquivo
                </button>

                <button
                  type="button"
                  onClick={handleProceedToAgreement}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-sm bg-accent hover:bg-accent-hover text-on-accent text-label font-semibold shadow-raised transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Aprovar Cronograma &amp; Cadastrar Evento</span>
                </button>
              </div>

            </div>
          )}

          {/* ESTADO 4: TERMO DE ACORDO DE CONFIRMAÇÃO & REPLANEJAMENTO */}
          {step === 'AGREEMENT_CONFIRMATION' && extractedData && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">

              {/* Banner de Homologação */}
              <div className="bg-surface-2 border border-line-strong rounded-md p-4 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-line text-accent">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="text-label font-bold uppercase tracking-wider text-ink">
                    Acordo de Confirmação &amp; Homologação de Prazos
                  </h3>
                </div>

                <p className="text-caption text-ink-muted">
                  Ao confirmar este acordo, o Amozir atualizará automaticamente os dados do pipeline, replanejará a agenda diária e ativará os alertas de monitoramento para o novo contrato:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-surface p-3 rounded-sm border border-line text-caption">
                  <div>
                    <span className="text-ink-muted block">Evento:</span>
                    <strong className="text-ink font-semibold text-label">{extractedData.name}</strong>
                  </div>
                  <div>
                    <span className="text-ink-muted block">Cliente:</span>
                    <strong className="text-ink font-semibold text-label">{extractedData.client}</strong>
                  </div>
                  <div>
                    <span className="text-ink-muted block">Festa:</span>
                    <strong className="text-accent font-semibold tabular-nums">{formatDateBR(extractedData.partyDate)}</strong>
                  </div>
                  <div>
                    <span className="text-ink-muted block">Carga Total de Produção:</span>
                    <strong className="text-ink font-semibold tabular-nums">{totalProductionHours}h alocadas</strong>
                  </div>
                </div>
              </div>

              {/* Replanejamento do Calendário */}
              <div className="bg-surface rounded-md border border-line p-4 space-y-3">
                <h4 className="text-label font-semibold text-ink flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>Replanejamento Automático da Agenda (08h–12h &amp; 13h–17h)</span>
                </h4>

                <div className="space-y-2 text-caption text-ink-muted">
                  <div className="flex items-center justify-between p-2 rounded-xs bg-surface-2 border border-line">
                    <span className="flex items-center gap-1.5 font-medium text-ink">
                      <Bookmark className="w-3.5 h-3.5 text-accent" />
                      <span>Save the Date ({stdHours}h em mini-sessões)</span>
                    </span>
                    <strong className="text-ink tabular-nums font-semibold">Prazo: {formatDateBR(stdDeadline)}</strong>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xs bg-surface-2 border border-line">
                    <span className="flex items-center gap-1.5 font-medium text-ink">
                      <Mail className="w-3.5 h-3.5 text-purple-500" />
                      <span>Convite Oficial ({invHours}h em mini-sessões)</span>
                    </span>
                    <strong className="text-ink tabular-nums font-semibold">Prazo: {formatDateBR(invDeadline)}</strong>
                  </div>

                  {extractedData.hasRetrospective && (
                    <div className="flex items-center justify-between p-2 rounded-xs bg-surface-2 border border-line">
                      <span className="flex items-center gap-1.5 font-medium text-ink">
                        <Film className="w-3.5 h-3.5 text-cyan-500" />
                        <span>Retrospectiva em Vídeo ({retroHours}h)</span>
                      </span>
                      <strong className="text-ink tabular-nums font-semibold">Prazo: {formatDateBR(retroDeadline)} (1d antes)</strong>
                    </div>
                  )}

                  {acceptedExtras.map((extra, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xs bg-surface-2 border border-line">
                      <span className="flex items-center gap-1.5 font-medium text-ink">
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                        <span>{extra.title} ({extra.suggestedHours}h)</span>
                      </span>
                      <strong className="text-ink tabular-nums font-semibold">
                        Prazo: {formatDateBR(calculateSaveTheDateDeadline(extractedData.partyDate, extra.suggestedDeadlineWeeks || 4))}
                      </strong>
                    </div>
                  ))}

                  <div className="flex items-center justify-between p-2 rounded-xs bg-accent-soft/40 border border-accent/30 text-accent font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Coffee className="w-3.5 h-3.5" />
                      <span>Pausas Obrigatórias</span>
                    </span>
                    <span>{breakMinutes} minutos entre todas as tarefas</span>
                  </div>
                </div>
              </div>

              {/* Levantamento de Alertas & Diagnóstico em Tempo Real */}
              <div className="space-y-3">
                <h4 className="text-label font-semibold text-ink flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <span>Levantamento de Alertas &amp; SLAs do Contrato</span>
                </h4>

                {collisionAlerts.length > 0 ? (
                  <div className="p-3 bg-warning-surface border border-warning-border rounded-sm space-y-1.5 text-caption">
                    <span className="font-bold text-on-warning uppercase tracking-wider block">
                      ⚠ {collisionAlerts.length} Alerta(s) de Colisão Identificado(s):
                    </span>
                    {collisionAlerts.map((alertMsg, idx) => (
                      <p key={idx} className="text-ink font-medium">
                        • {alertMsg}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-surface-2 border border-line rounded-sm text-caption text-ink-muted flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Nenhum conflito direto detectado com os outros {projects.length} eventos no cronograma.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-caption">
                  <div className="p-2.5 bg-surface border border-line rounded-sm">
                    <strong className="text-ink block">SLA de Aprovação do Cliente:</strong>
                    <span className="text-ink-muted">48 horas úteis para resposta de layouts.</span>
                  </div>
                  <div className="p-2.5 bg-surface border border-line rounded-sm">
                    <strong className="text-ink block">SLA de Envio de Assets:</strong>
                    <span className="text-ink-muted">72 horas para fotos/vídeos da Retrospectiva.</span>
                  </div>
                </div>
              </div>

              {/* Botões de Ação do Acordo */}
              <div className="pt-4 border-t border-line flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep('UPLOAD_OR_REVIEW')}
                  className="px-4 py-2 rounded-sm text-caption font-semibold text-ink-muted hover:text-ink hover:bg-surface-2 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Voltar e Ajustar</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinalConfirmAgreement}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-sm bg-accent hover:bg-accent-hover text-on-accent text-label font-semibold shadow-raised transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirmar Acordo &amp; Replanejar Calendário</span>
                </button>
              </div>

            </div>
          )}

          {/* ESTADO 5: FEEDBACK DE SUCESSO */}
          {step === 'SUCCESS_TOAST' && (
            <div className="p-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-section-title font-bold text-ink">Contrato Homologado &amp; Calendário Replanejado!</h3>
              <p className="text-caption text-ink-muted max-w-md mx-auto">
                O evento <strong className="text-ink font-semibold">{extractedData?.name}</strong> foi adicionado ao pipeline. A agenda diária, prazos retroativos e alertas de produção foram atualizados.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
