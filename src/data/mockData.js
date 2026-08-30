import { calculateSaveTheDateDeadline, calculateInvitationDeadline, calculateRetrospectiveDeadline } from '../utils/dateUtils.js';

/**
 * Definição das Etapas do Pipeline de Projetos do Amozir
 */
export const STAGES = [
  {
    id: 'briefing',
    title: 'Briefing & Conceito',
    description: 'Definição da identidade do evento e coleta de informações',
    color: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    dotColor: 'bg-blue-400',
  },
  {
    id: 'creation',
    title: 'Em Criação',
    description: 'Produção ativa dos entregáveis (Save the Date / Convite / Festa)',
    color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    dotColor: 'bg-purple-400',
  },
  {
    id: 'waiting_approval',
    title: 'Aguardando Cliente',
    description: 'Enviado para aprovação de arte/layout pelo cliente',
    color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    dotColor: 'bg-amber-400',
  },
  {
    id: 'revisions',
    title: 'Ajustes & Gráfica',
    description: 'Revisão final, prova de cor e envio para impressão',
    color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    dotColor: 'bg-cyan-400',
  },
  {
    id: 'final_delivery',
    title: 'Entregue / Concluído',
    description: 'Projeto entregue ao cliente e evento finalizado',
    color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    dotColor: 'bg-emerald-400',
  },
];

/**
 * Perfil da Profissional (ICP Principal)
 */
export const PERSONA_CAMILA = {
  name: 'Camila Duarte',
  role: 'Designer Gráfica de Eventos Social & Luxo',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  capacityPercentage: 92,
};

/**
 * Projetos Iniciais — 8 contratos simultâneos com datas reais calculadas
 * Data de referência do sistema: 01/09/2026 (terça-feira)
 *
 * Cenário: Camila tem 8 eventos entre setembro e dezembro de 2026.
 * Cada projeto entra com data de contrato diferente, simulando a realidade
 * de contratos que chegam escalonados ao longo das semanas.
 */
export const INITIAL_PROJECTS = [
  // ──────────────────────────────────────────────────
  // PROJETO 1 — Contrato antigo, festa próxima (URGENTE)
  // ──────────────────────────────────────────────────
  {
    id: 'proj-1',
    name: 'Casamento Marina & Gustavo',
    client: 'Marina Ramos',
    stage: 'waiting_approval',
    value: 5800,
    contractDate: '2026-07-10',
    partyDate: '2026-09-20',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2026-09-20', 6),   // 09/ago
    invitationDeadline: calculateInvitationDeadline('2026-09-20', 3),     // 30/ago
    retrospectiveDeadline: calculateRetrospectiveDeadline('2026-09-20', 1), // 19/set
    hasRetrospective: true,
    assetsReceived: true,
    deadline: '2026-09-20',
    daysWaitingClient: 3,
    collisionRisk: true,
    riskMessage: 'Convite venceu prazo de 3w (30/ago) — arte aguardando aprovação da cliente há 3 dias (SLA 48h excedido)',
    progress: 72,
    category: 'Casamento',
    deliverables: [
      { id: 'd1', title: 'Save the Date (Digital & Impresso)', rule: '6 semanas antes', requiredHours: 5, deadline: calculateSaveTheDateDeadline('2026-09-20', 6), status: 'completed', completed: true },
      { id: 'd2', title: 'Convite Oficial com Caligrafia', rule: '3 semanas antes', requiredHours: 10, deadline: calculateInvitationDeadline('2026-09-20', 3), status: 'waiting_approval', completed: false },
      { id: 'd3', title: 'Retrospectiva em Vídeo', rule: '1 dia antes da festa', requiredHours: 8, deadline: calculateRetrospectiveDeadline('2026-09-20', 1), status: 'in_progress', completed: false, isRetrospective: true },
      { id: 'd4', title: 'Identidade da Festa (Menucard & Placas)', rule: 'Data da Festa', requiredHours: 20, deadline: '2026-09-20', status: 'pending', completed: false }
    ],
    lastUpdate: 'Convite aguardando aprovação da cliente — SLA 48h excedido'
  },

  // ──────────────────────────────────────────────────
  // PROJETO 2 — 15 Anos, contrato recente, festa em outubro
  // ──────────────────────────────────────────────────
  {
    id: 'proj-2',
    name: '15 Anos Beatriz Costa',
    client: 'Patrícia Costa (Mãe)',
    stage: 'creation',
    value: 4200,
    contractDate: '2026-08-05',
    partyDate: '2026-10-18',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2026-10-18', 6),   // 06/set
    invitationDeadline: calculateInvitationDeadline('2026-10-18', 3),     // 27/set
    retrospectiveDeadline: calculateRetrospectiveDeadline('2026-10-18', 1),
    hasRetrospective: true,
    assetsReceived: false,
    deadline: '2026-10-18',
    daysWaitingClient: 0,
    collisionRisk: true,
    riskMessage: 'Save the Date vence 06/set (em 5 dias) — assets da retrospectiva não recebidos (SLA 72h)',
    progress: 35,
    category: '15 Anos',
    deliverables: [
      { id: 'd1', title: 'Save the Date Neon', rule: '6 semanas antes', requiredHours: 5, deadline: calculateSaveTheDateDeadline('2026-10-18', 6), status: 'in_progress', completed: false },
      { id: 'd2', title: 'Convite Holográfico', rule: '3 semanas antes', requiredHours: 10, deadline: calculateInvitationDeadline('2026-10-18', 3), status: 'pending', completed: false },
      { id: 'd3', title: 'Retrospectiva 15 Anos (Fotos Infância)', rule: '1 dia antes', requiredHours: 8, deadline: calculateRetrospectiveDeadline('2026-10-18', 1), status: 'pending', completed: false, isRetrospective: true, requiresAssets: true },
      { id: 'd4', title: 'Kits da Festa e Pista de Dança', rule: 'Data da Festa', requiredHours: 20, deadline: '2026-10-18', status: 'pending', completed: false }
    ],
    lastUpdate: 'Produzindo Save the Date — prazo em 5 dias'
  },

  // ──────────────────────────────────────────────────
  // PROJETO 3 — Bodas, fluxo tranquilo, festa em novembro
  // ──────────────────────────────────────────────────
  {
    id: 'proj-3',
    name: 'Bodas de Ouro Família Silveira',
    client: 'Henrique Silveira',
    stage: 'creation',
    value: 3500,
    contractDate: '2026-08-15',
    partyDate: '2026-11-22',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2026-11-22', 6),   // 11/out
    invitationDeadline: calculateInvitationDeadline('2026-11-22', 3),     // 01/nov
    retrospectiveDeadline: calculateRetrospectiveDeadline('2026-11-22', 1),
    hasRetrospective: true,
    assetsReceived: true,
    deadline: '2026-11-22',
    daysWaitingClient: 0,
    collisionRisk: false,
    riskMessage: null,
    progress: 20,
    category: 'Bodas',
    deliverables: [
      { id: 'd1', title: 'Save the Date Dourado Clássico', rule: '6 semanas antes', requiredHours: 5, deadline: calculateSaveTheDateDeadline('2026-11-22', 6), status: 'in_progress', completed: false },
      { id: 'd2', title: 'Convite Clássico Ouro com Relevo', rule: '3 semanas antes', requiredHours: 10, deadline: calculateInvitationDeadline('2026-11-22', 3), status: 'pending', completed: false },
      { id: 'd3', title: 'Retrospectiva Histórica 50 Anos', rule: '1 dia antes', requiredHours: 8, deadline: calculateRetrospectiveDeadline('2026-11-22', 1), status: 'pending', completed: false, isRetrospective: true },
      { id: 'd4', title: 'Menus de Mesa & Papelaria Festa', rule: 'Data da Festa', requiredHours: 20, deadline: '2026-11-22', status: 'pending', completed: false }
    ],
    lastUpdate: 'Iniciando conceito do Save the Date'
  },

  // ──────────────────────────────────────────────────
  // PROJETO 4 — Casamento em outubro, convite na gráfica
  // ──────────────────────────────────────────────────
  {
    id: 'proj-4',
    name: 'Casamento Lucas & Felipe',
    client: 'Lucas Mendes',
    stage: 'revisions',
    value: 6200,
    contractDate: '2026-06-25',
    partyDate: '2026-10-05',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2026-10-05', 6),   // 24/ago
    invitationDeadline: calculateInvitationDeadline('2026-10-05', 3),     // 14/set
    retrospectiveDeadline: calculateRetrospectiveDeadline('2026-10-05', 1),
    hasRetrospective: false,
    assetsReceived: true,
    deadline: '2026-10-05',
    daysWaitingClient: 1,
    collisionRisk: false,
    riskMessage: null,
    progress: 78,
    category: 'Casamento',
    deliverables: [
      { id: 'd1', title: 'Save the Date Animação', rule: '6 semanas antes', requiredHours: 5, deadline: calculateSaveTheDateDeadline('2026-10-05', 6), status: 'completed', completed: true },
      { id: 'd2', title: 'Convite Acrílico (Em Gráfica)', rule: '3 semanas antes', requiredHours: 10, deadline: calculateInvitationDeadline('2026-10-05', 3), status: 'in_progress', completed: false },
      { id: 'd3', title: 'Welcome Cards & Papelaria Festa', rule: 'Data da Festa', requiredHours: 20, deadline: '2026-10-05', status: 'pending', completed: false }
    ],
    lastUpdate: 'Ajustando prova de cor na gráfica'
  },

  // ──────────────────────────────────────────────────
  // PROJETO 5 — Corporativo, concluído
  // ──────────────────────────────────────────────────
  {
    id: 'proj-5',
    name: 'Gala Anual TechCorp 2026',
    client: 'Fernanda (RH TechCorp)',
    stage: 'final_delivery',
    value: 7500,
    contractDate: '2026-05-10',
    partyDate: '2026-09-12',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2026-09-12', 6),
    invitationDeadline: calculateInvitationDeadline('2026-09-12', 3),
    retrospectiveDeadline: calculateRetrospectiveDeadline('2026-09-12', 1),
    hasRetrospective: false,
    assetsReceived: true,
    deadline: '2026-09-12',
    daysWaitingClient: 0,
    collisionRisk: false,
    riskMessage: null,
    progress: 98,
    category: 'Corporativo',
    deliverables: [
      { id: 'd1', title: 'Save the Date Teaser Digital', rule: '6 semanas antes', requiredHours: 5, deadline: calculateSaveTheDateDeadline('2026-09-12', 6), status: 'completed', completed: true },
      { id: 'd2', title: 'Convite VIP & Credencial', rule: '3 semanas antes', requiredHours: 10, deadline: calculateInvitationDeadline('2026-09-12', 3), status: 'completed', completed: true },
      { id: 'd3', title: 'Brindes, Painel de Palco & Festa', rule: 'Data da Festa', requiredHours: 20, deadline: '2026-09-12', status: 'completed', completed: true }
    ],
    lastUpdate: 'Entrega concluída — evento em 12/set'
  },

  // ──────────────────────────────────────────────────
  // PROJETO 6 — Contrato novo (assinado ontem), festa em novembro
  // ──────────────────────────────────────────────────
  {
    id: 'proj-6',
    name: 'Casamento Amanda & Rafael',
    client: 'Amanda Lopes',
    stage: 'briefing',
    value: 5200,
    contractDate: '2026-08-30',
    partyDate: '2026-11-14',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2026-11-14', 6),   // 03/out
    invitationDeadline: calculateInvitationDeadline('2026-11-14', 3),     // 24/out
    retrospectiveDeadline: calculateRetrospectiveDeadline('2026-11-14', 1),
    hasRetrospective: true,
    assetsReceived: false,
    deadline: '2026-11-14',
    daysWaitingClient: 0,
    collisionRisk: false,
    riskMessage: null,
    progress: 5,
    category: 'Casamento',
    deliverables: [
      { id: 'd1', title: 'Save the Date Aquarela', rule: '6 semanas antes', requiredHours: 5, deadline: calculateSaveTheDateDeadline('2026-11-14', 6), status: 'pending', completed: false },
      { id: 'd2', title: 'Convite com Pintura à Mão', rule: '3 semanas antes', requiredHours: 10, deadline: calculateInvitationDeadline('2026-11-14', 3), status: 'pending', completed: false },
      { id: 'd3', title: 'Retrospectiva Romântica', rule: '1 dia antes', requiredHours: 8, deadline: calculateRetrospectiveDeadline('2026-11-14', 1), status: 'pending', completed: false, isRetrospective: true, requiresAssets: true },
      { id: 'd4', title: 'Papelaria Completa do Evento', rule: 'Data da Festa', requiredHours: 20, deadline: '2026-11-14', status: 'pending', completed: false }
    ],
    lastUpdate: 'Contrato assinado hoje — briefing agendado para 02/set'
  },

  // ──────────────────────────────────────────────────
  // PROJETO 7 — Chá revelação (evento menor, prazo curto)
  // ──────────────────────────────────────────────────
  {
    id: 'proj-7',
    name: 'Chá Revelação Família Torres',
    client: 'Juliana Torres',
    stage: 'creation',
    value: 2800,
    contractDate: '2026-08-18',
    partyDate: '2026-09-27',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2026-09-27', 6),   // 16/ago
    invitationDeadline: calculateInvitationDeadline('2026-09-27', 3),     // 06/set
    retrospectiveDeadline: calculateRetrospectiveDeadline('2026-09-27', 1),
    hasRetrospective: false,
    assetsReceived: true,
    deadline: '2026-09-27',
    daysWaitingClient: 0,
    collisionRisk: true,
    riskMessage: 'Convite vence 06/set (em 5 dias) e festa em 27/set — produção da festa (20h) se sobrepõe com Casamento Marina',
    progress: 50,
    category: 'Chá Revelação',
    deliverables: [
      { id: 'd1', title: 'Save the Date Digital Surpresa', rule: '6 semanas antes', requiredHours: 5, deadline: calculateSaveTheDateDeadline('2026-09-27', 6), status: 'completed', completed: true },
      { id: 'd2', title: 'Convite Interativo com QR Code', rule: '3 semanas antes', requiredHours: 10, deadline: calculateInvitationDeadline('2026-09-27', 3), status: 'in_progress', completed: false },
      { id: 'd3', title: 'Decoração & Papelaria Revelação', rule: 'Data da Festa', requiredHours: 20, deadline: '2026-09-27', status: 'pending', completed: false }
    ],
    lastUpdate: 'Produzindo Convite QR Code — prazo 06/set'
  },

  // ──────────────────────────────────────────────────
  // PROJETO 8 — Formatura, contrato de 2 semanas atrás, festa em dezembro
  // ──────────────────────────────────────────────────
  {
    id: 'proj-8',
    name: 'Formatura Medicina UFMG 2026',
    client: 'Comissão de Formatura (Pedro Alves)',
    stage: 'briefing',
    value: 9500,
    contractDate: '2026-08-20',
    partyDate: '2026-12-12',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2026-12-12', 6),   // 31/out
    invitationDeadline: calculateInvitationDeadline('2026-12-12', 3),     // 21/nov
    retrospectiveDeadline: calculateRetrospectiveDeadline('2026-12-12', 1),
    hasRetrospective: true,
    assetsReceived: false,
    deadline: '2026-12-12',
    daysWaitingClient: 0,
    collisionRisk: false,
    riskMessage: null,
    progress: 10,
    category: 'Formatura',
    deliverables: [
      { id: 'd1', title: 'Save the Date Acadêmico', rule: '6 semanas antes', requiredHours: 5, deadline: calculateSaveTheDateDeadline('2026-12-12', 6), status: 'pending', completed: false },
      { id: 'd2', title: 'Convite de Gala com Brasão', rule: '3 semanas antes', requiredHours: 10, deadline: calculateInvitationDeadline('2026-12-12', 3), status: 'pending', completed: false },
      { id: 'd3', title: 'Vídeo Retrospectiva da Turma', rule: '1 dia antes', requiredHours: 8, deadline: calculateRetrospectiveDeadline('2026-12-12', 1), status: 'pending', completed: false, isRetrospective: true, requiresAssets: true },
      { id: 'd4', title: 'Identidade Visual Completa Festa', rule: 'Data da Festa', requiredHours: 20, deadline: '2026-12-12', status: 'pending', completed: false }
    ],
    lastUpdate: 'Briefing concluído — aguardando logo da turma'
  }
];
