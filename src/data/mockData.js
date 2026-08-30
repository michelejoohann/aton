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
  capacityPercentage: 94,
};

/**
 * Projetos Iniciais Calibrados para 94% de Ocupação (151h pendentes / 160h mensais)
 * Data de referência do sistema: 01/09/2026 (terça-feira)
 */
export const INITIAL_PROJECTS = [
  // ──────────────────────────────────────────────────
  // PROJETO 1 — Casamento Marina & Gustavo (Aguardando Aprovação / Risco SLA 48h)
  // Horas pendentes: Convite (10h) + Retro (8h) + Festa (20h) = 38h
  // ──────────────────────────────────────────────────
  {
    id: 'proj-1',
    name: 'Casamento Marina & Gustavo',
    client: 'Marina Ramos',
    stage: 'waiting_approval',
    value: 5800,
    contractDate: '2026-07-10',
    partyDate: '2026-09-20',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2026-09-20', 6),
    invitationDeadline: calculateInvitationDeadline('2026-09-20', 3),
    retrospectiveDeadline: calculateRetrospectiveDeadline('2026-09-20', 1),
    hasRetrospective: true,
    assetsReceived: true,
    deadline: '2026-09-20',
    daysWaitingClient: 3,
    collisionRisk: true,
    riskMessage: 'Arte do Convite aguardando aprovação da noiva há 3 dias (SLA 48h excedido)',
    progress: 72,
    category: 'Casamento',
    deliverables: [
      { id: 'd1', title: 'Save the Date (Digital & Impresso)', rule: '6 semanas antes', requiredHours: 5, deadline: calculateSaveTheDateDeadline('2026-09-20', 6), status: 'completed', completed: true },
      { id: 'd2', title: 'Convite Oficial com Caligrafia', rule: '3 semanas antes', requiredHours: 10, deadline: calculateInvitationDeadline('2026-09-20', 3), status: 'waiting_approval', completed: false },
      { id: 'd3', title: 'Retrospectiva em Vídeo', rule: '1 dia antes da festa', requiredHours: 8, deadline: calculateRetrospectiveDeadline('2026-09-20', 1), status: 'pending', completed: false, isRetrospective: true },
      { id: 'd4', title: 'Identidade da Festa (Menucard & Placas)', rule: 'Data da Festa', requiredHours: 20, deadline: '2026-09-20', status: 'pending', completed: false }
    ],
    lastUpdate: 'Convite aguardando aprovação da cliente — SLA 48h excedido'
  },

  // ──────────────────────────────────────────────────
  // PROJETO 2 — 15 Anos Beatriz Costa (Em Criação / Risco Assets SLA 72h)
  // Horas pendentes: Std (5h) + Convite (10h) + Retro (8h) + Festa (20h) = 43h
  // ──────────────────────────────────────────────────
  {
    id: 'proj-2',
    name: '15 Anos Beatriz Costa',
    client: 'Patrícia Costa (Mãe)',
    stage: 'creation',
    value: 4200,
    contractDate: '2026-08-05',
    partyDate: '2026-10-18',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2026-10-18', 6),
    invitationDeadline: calculateInvitationDeadline('2026-10-18', 3),
    retrospectiveDeadline: calculateRetrospectiveDeadline('2026-10-18', 1),
    hasRetrospective: true,
    assetsReceived: false,
    deadline: '2026-10-18',
    daysWaitingClient: 0,
    collisionRisk: true,
    riskMessage: 'Save the Date vence em 5 dias — fotos da retrospectiva pendentes da mãe (SLA 72h)',
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
  // PROJETO 3 — Bodas de Ouro Família Silveira (Em Criação)
  // Horas pendentes: Std (5h) + Convite (10h) + Festa (20h) = 35h
  // ──────────────────────────────────────────────────
  {
    id: 'proj-3',
    name: 'Bodas de Ouro Família Silveira',
    client: 'Henrique Silveira',
    stage: 'creation',
    value: 3500,
    contractDate: '2026-08-15',
    partyDate: '2026-11-22',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2026-11-22', 6),
    invitationDeadline: calculateInvitationDeadline('2026-11-22', 3),
    retrospectiveDeadline: calculateRetrospectiveDeadline('2026-11-22', 1),
    hasRetrospective: false,
    assetsReceived: true,
    deadline: '2026-11-22',
    daysWaitingClient: 0,
    collisionRisk: false,
    riskMessage: null,
    progress: 25,
    category: 'Bodas',
    deliverables: [
      { id: 'd1', title: 'Save the Date Dourado Clássico', rule: '6 semanas antes', requiredHours: 5, deadline: calculateSaveTheDateDeadline('2026-11-22', 6), status: 'in_progress', completed: false },
      { id: 'd2', title: 'Convite Clássico Ouro com Relevo', rule: '3 semanas antes', requiredHours: 10, deadline: calculateInvitationDeadline('2026-11-22', 3), status: 'pending', completed: false },
      { id: 'd3', title: 'Menus de Mesa & Papelaria Festa', rule: 'Data da Festa', requiredHours: 20, deadline: '2026-11-22', status: 'pending', completed: false }
    ],
    lastUpdate: 'Iniciando conceito do Save the Date'
  },

  // ──────────────────────────────────────────────────
  // PROJETO 4 — Casamento Lucas & Felipe (Ajustes & Gráfica)
  // Horas pendentes: Papelaria Festa (20h) = 20h
  // ──────────────────────────────────────────────────
  {
    id: 'proj-4',
    name: 'Casamento Lucas & Felipe',
    client: 'Lucas Mendes',
    stage: 'revisions',
    value: 6200,
    contractDate: '2026-06-25',
    partyDate: '2026-10-05',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2026-10-05', 6),
    invitationDeadline: calculateInvitationDeadline('2026-10-05', 3),
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
      { id: 'd2', title: 'Convite Acrílico (Em Gráfica)', rule: '3 semanas antes', requiredHours: 10, deadline: calculateInvitationDeadline('2026-10-05', 3), status: 'completed', completed: true },
      { id: 'd3', title: 'Welcome Cards & Papelaria Festa', rule: 'Data da Festa', requiredHours: 20, deadline: '2026-10-05', status: 'pending', completed: false }
    ],
    lastUpdate: 'Ajustando prova de cor na gráfica'
  },

  // ──────────────────────────────────────────────────
  // PROJETO 5 — Casamento Amanda & Rafael (Briefing / Recém-contratado)
  // Horas pendentes: Std (5h) + Convite (10h) = 15h
  // ──────────────────────────────────────────────────
  {
    id: 'proj-5',
    name: 'Casamento Amanda & Rafael',
    client: 'Amanda Lopes',
    stage: 'briefing',
    value: 5200,
    contractDate: '2026-08-30',
    partyDate: '2026-11-14',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2026-11-14', 6),
    invitationDeadline: calculateInvitationDeadline('2026-11-14', 3),
    retrospectiveDeadline: calculateRetrospectiveDeadline('2026-11-14', 1),
    hasRetrospective: false,
    assetsReceived: false,
    deadline: '2026-11-14',
    daysWaitingClient: 0,
    collisionRisk: false,
    riskMessage: null,
    progress: 5,
    category: 'Casamento',
    deliverables: [
      { id: 'd1', title: 'Save the Date Aquarela', rule: '6 semanas antes', requiredHours: 5, deadline: calculateSaveTheDateDeadline('2026-11-14', 6), status: 'pending', completed: false },
      { id: 'd2', title: 'Convite com Pintura à Mão', rule: '3 semanas antes', requiredHours: 10, deadline: calculateInvitationDeadline('2026-11-14', 3), status: 'pending', completed: false }
    ],
    lastUpdate: 'Contrato assinado — briefing agendado'
  },

  // ──────────────────────────────────────────────────
  // PROJETO 6 — Gala Anual TechCorp 2026 (Entregue / Concluído)
  // Horas pendentes: 0h
  // ──────────────────────────────────────────────────
  {
    id: 'proj-6',
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
    progress: 100,
    category: 'Corporativo',
    deliverables: [
      { id: 'd1', title: 'Save the Date Teaser Digital', rule: '6 semanas antes', requiredHours: 5, deadline: calculateSaveTheDateDeadline('2026-09-12', 6), status: 'completed', completed: true },
      { id: 'd2', title: 'Convite VIP & Credencial', rule: '3 semanas antes', requiredHours: 10, deadline: calculateInvitationDeadline('2026-09-12', 3), status: 'completed', completed: true },
      { id: 'd3', title: 'Brindes, Painel de Palco & Festa', rule: 'Data da Festa', requiredHours: 20, deadline: '2026-09-12', status: 'completed', completed: true }
    ],
    lastUpdate: 'Projeto 100% entregue e finalizado'
  }
];
