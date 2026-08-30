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
};

/**
 * Projetos Iniciais com Regras de Negócio Retroativas e SLAs
 */
export const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    name: 'Casamento Marina & Gustavo',
    client: 'Marina Ramos',
    stage: 'creation',
    value: 5800,
    contractDate: '2026-08-01',
    partyDate: '2026-10-15',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2026-10-15', 6),
    invitationDeadline: calculateInvitationDeadline('2026-10-15', 3),
    retrospectiveDeadline: calculateRetrospectiveDeadline('2026-10-15', 1),
    hasRetrospective: true,
    assetsReceived: true,
    deadline: '2026-10-15',
    daysWaitingClient: 0,
    collisionRisk: true,
    riskMessage: 'Prazo limite do Save the Date (6w) coincide com aprovação do 15 Anos Beatriz',
    progress: 45,
    category: 'Casamento',
    deliverables: [
      { id: 'd1', title: 'Save the Date (Digital & Impresso)', rule: '6 semanas antes', requiredHours: 5, deadline: calculateSaveTheDateDeadline('2026-10-15', 6), status: 'in_progress', completed: false },
      { id: 'd2', title: 'Convite Oficial com Caligrafia', rule: '3 semanas antes', requiredHours: 10, deadline: calculateInvitationDeadline('2026-10-15', 3), status: 'pending', completed: false },
      { id: 'd3', title: 'Retrospectiva em Vídeo', rule: '1 dia antes da festa', requiredHours: 8, deadline: calculateRetrospectiveDeadline('2026-10-15', 1), status: 'pending', completed: false, isRetrospective: true },
      { id: 'd4', title: 'Identidade da Festa (Menucard & Placas)', rule: 'Data da Festa', requiredHours: 20, deadline: '2026-10-15', status: 'pending', completed: false }
    ],
    lastUpdate: 'Criando Save the Date'
  },
  {
    id: 'proj-2',
    name: '15 Anos Beatriz Costa',
    client: 'Patrícia Costa (Mãe)',
    stage: 'waiting_approval',
    value: 4200,
    contractDate: '2026-07-15',
    partyDate: '2026-09-30',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2026-09-30', 6),
    invitationDeadline: calculateInvitationDeadline('2026-09-30', 3),
    retrospectiveDeadline: calculateRetrospectiveDeadline('2026-09-30', 1),
    hasRetrospective: true,
    assetsReceived: false,
    deadline: '2026-09-30',
    daysWaitingClient: 4,
    collisionRisk: true,
    riskMessage: 'Arte do Convite (prazo 3w) aguardando aprovação da mãe há 4 dias (SLA 48h excedido)',
    progress: 70,
    category: '15 Anos',
    deliverables: [
      { id: 'd1', title: 'Save the Date', rule: '6 semanas antes', requiredHours: 5, deadline: calculateSaveTheDateDeadline('2026-09-30', 6), status: 'completed', completed: true },
      { id: 'd2', title: 'Convite Oficial Luxo', rule: '3 semanas antes', requiredHours: 10, deadline: calculateInvitationDeadline('2026-09-30', 3), status: 'waiting_approval', completed: false },
      { id: 'd3', title: 'Retrospectiva em Vídeo (Fotos Infância & Família)', rule: '1 dia antes da festa', requiredHours: 8, deadline: calculateRetrospectiveDeadline('2026-09-30', 1), status: 'pending', completed: false, isRetrospective: true, requiresAssets: true },
      { id: 'd4', title: 'Kits da Festa e Pista de Dança', rule: 'Data da Festa', requiredHours: 20, deadline: '2026-09-30', status: 'pending', completed: false }
    ],
    lastUpdate: 'Aguardando aprovação do layout do Convite'
  },
  {
    id: 'proj-3',
    name: 'Bodas de Ouro Família Silveira',
    client: 'Henrique Silveira',
    stage: 'creation',
    value: 3500,
    contractDate: '2026-08-10',
    partyDate: '2026-11-20',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2026-11-20', 6),
    invitationDeadline: calculateInvitationDeadline('2026-11-20', 3),
    retrospectiveDeadline: calculateRetrospectiveDeadline('2026-11-20', 1),
    hasRetrospective: true,
    assetsReceived: true,
    deadline: '2026-11-20',
    daysWaitingClient: 0,
    collisionRisk: false,
    riskMessage: null,
    progress: 50,
    category: 'Bodas',
    deliverables: [
      { id: 'd1', title: 'Save the Date Dourado', rule: '6 semanas antes', requiredHours: 5, deadline: calculateSaveTheDateDeadline('2026-11-20', 6), status: 'completed', completed: true },
      { id: 'd2', title: 'Convite Clássico', rule: '3 semanas antes', requiredHours: 10, deadline: calculateInvitationDeadline('2026-11-20', 3), status: 'in_progress', completed: false },
      { id: 'd3', title: 'Retrospectiva Histórica 50 Anos', rule: '1 dia antes da festa', requiredHours: 8, deadline: calculateRetrospectiveDeadline('2026-11-20', 1), status: 'pending', completed: false, isRetrospective: true },
      { id: 'd4', title: 'Menus de Mesa & Papelaria Festa', rule: 'Data da Festa', requiredHours: 20, deadline: '2026-11-20', status: 'pending', completed: false }
    ],
    lastUpdate: 'Diagramando Convite Clássico'
  },
  {
    id: 'proj-4',
    name: 'Casamento Lucas & Felipe',
    client: 'Lucas Mendes',
    stage: 'revisions',
    value: 6200,
    contractDate: '2026-06-20',
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
    progress: 80,
    category: 'Casamento',
    deliverables: [
      { id: 'd1', title: 'Save the Date Animação', rule: '6 semanas antes', requiredHours: 5, deadline: calculateSaveTheDateDeadline('2026-10-05', 6), status: 'completed', completed: true },
      { id: 'd2', title: 'Convite em Acrílico (Em Gráfica)', rule: '3 semanas antes', requiredHours: 10, deadline: calculateInvitationDeadline('2026-10-05', 3), status: 'in_progress', completed: false },
      { id: 'd3', title: 'Welcome Cards & Papelaria Festa', rule: 'Data da Festa', requiredHours: 20, deadline: '2026-10-05', status: 'pending', completed: false }
    ],
    lastUpdate: 'Ajustando prova de cor com a gráfica'
  },
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
    progress: 95,
    category: 'Corporativo',
    deliverables: [
      { id: 'd1', title: 'Save the Date Teaser', rule: '6 semanas antes', requiredHours: 5, deadline: calculateSaveTheDateDeadline('2026-09-12', 6), status: 'completed', completed: true },
      { id: 'd2', title: 'Convite VIP Credencial', rule: '3 semanas antes', requiredHours: 10, deadline: calculateInvitationDeadline('2026-09-12', 3), status: 'completed', completed: true },
      { id: 'd3', title: 'Brindes, Painel de Palco & Festa', rule: 'Data da Festa', requiredHours: 20, deadline: '2026-09-12', status: 'in_progress', completed: false }
    ],
    lastUpdate: 'Pronto para entrega física na casa de festas'
  }
];
