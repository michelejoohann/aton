import { calculateSaveTheDateDeadline, calculateInvitationDeadline } from '../utils/dateUtils';

// Definição das Etapas do Pipeline do Coringa
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
    title: 'Ajustes & Impressão',
    description: 'Ajustes solicitados ou envio para gráfica / caligrafia',
    color: 'border-orange-500/40 text-orange-400 bg-orange-500/10',
    dotColor: 'bg-orange-400',
  },
  {
    id: 'final_delivery',
    title: 'Pronto / Entregue',
    description: 'Entregável finalizado e entregue para a festa',
    color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    dotColor: 'bg-emerald-400',
  },
];

// Perfil da Persona Camila (Design de Eventos e Papelaria de Luxo)
export const PERSONA_CAMILA = {
  name: 'Camila Alencar',
  role: 'Designer de Eventos & Identidade Festiva Solo',
  deliveriesPerMonth: '3 festas/mês',
  activeProjectsCount: 9,
  capacityPercentage: 86,
  status: '2 Convites (prazo 3 meses) colidindo em Setembro',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
};

// Projetos com a regra estrita de 3 entregáveis por festa:
// 1. Save the Date (Até 6 meses antes da Festa)
// 2. Convite (Até 3 meses antes da Festa)
// 3. Festa (Data Final / Evento)

export const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    name: 'Casamento Marina & Gustavo',
    client: 'Marina Ramos',
    stage: 'creation',
    value: 5800,
    partyDate: '2027-03-15',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2027-03-15'), // 2026-09-15
    invitationDeadline: calculateInvitationDeadline('2027-03-15'),   // 2026-12-15
    deadline: '2027-03-15',
    daysWaitingClient: 0,
    collisionRisk: true,
    riskMessage: 'Prazo limite do Save the Date (15/09 - regra 6m) coincide com aprovação do 15 Anos Beatriz',
    progress: 45,
    category: 'Casamento',
    deliverables: [
      { id: 'd1', title: 'Save the Date (Digital & Impresso)', rule: '6 meses antes', deadline: calculateSaveTheDateDeadline('2027-03-15'), status: 'in_progress', completed: false },
      { id: 'd2', title: 'Convite Oficial com Caligrafia', rule: '3 meses antes', deadline: calculateInvitationDeadline('2027-03-15'), status: 'pending', completed: false },
      { id: 'd3', title: 'Identidade da Festa (Menucard, Placas & Lembranças)', rule: 'Data da Festa', deadline: '2027-03-15', status: 'pending', completed: false }
    ],
    lastUpdate: 'Criando Save the Date'
  },
  {
    id: 'proj-2',
    name: '15 Anos Beatriz Costa',
    client: 'Patrícia Costa (Mãe)',
    stage: 'waiting_approval',
    value: 4200,
    partyDate: '2026-12-10',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2026-12-10'), // 2026-06-10 (Concluído)
    invitationDeadline: calculateInvitationDeadline('2026-12-10'),   // 2026-09-10 (Aguardando Aprovação!)
    deadline: '2026-12-10',
    daysWaitingClient: 4,
    collisionRisk: true,
    riskMessage: 'Arte do Convite (prazo 3m) aguardando aprovação da mãe há 4 dias',
    progress: 70,
    category: '15 Anos',
    deliverables: [
      { id: 'd1', title: 'Save the Date', rule: '6 meses antes', deadline: calculateSaveTheDateDeadline('2026-12-10'), status: 'completed', completed: true },
      { id: 'd2', title: 'Convite Oficial Luxo', rule: '3 meses antes', deadline: calculateInvitationDeadline('2026-12-10'), status: 'waiting_approval', completed: false },
      { id: 'd3', title: 'Kits da Festa e Pista de Dança', rule: 'Data da Festa', deadline: '2026-12-10', status: 'pending', completed: false }
    ],
    lastUpdate: 'Aguardando aprovação do layout do Convite'
  },
  {
    id: 'proj-3',
    name: 'Bodas de Ouro Família Silveira',
    client: 'Henrique Silveira',
    stage: 'creation',
    value: 3500,
    partyDate: '2027-01-20',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2027-01-20'), // 2026-07-20
    invitationDeadline: calculateInvitationDeadline('2027-01-20'),   // 2026-10-20
    deadline: '2027-01-20',
    daysWaitingClient: 0,
    collisionRisk: false,
    riskMessage: null,
    progress: 50,
    category: 'Bodas',
    deliverables: [
      { id: 'd1', title: 'Save the Date Dourado', rule: '6 meses antes', deadline: calculateSaveTheDateDeadline('2027-01-20'), status: 'completed', completed: true },
      { id: 'd2', title: 'Convite Clássico', rule: '3 meses antes', deadline: calculateInvitationDeadline('2027-01-20'), status: 'in_progress', completed: false },
      { id: 'd3', title: 'Menus de Mesa & Papelaria Festa', rule: 'Data da Festa', deadline: '2027-01-20', status: 'pending', completed: false }
    ],
    lastUpdate: 'Diagramando Convite Clássico'
  },
  {
    id: 'proj-4',
    name: 'Casamento Lucas & Felipe',
    client: 'Lucas Mendes',
    stage: 'revisions',
    value: 6200,
    partyDate: '2026-11-05',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2026-11-05'), // 2026-05-05
    invitationDeadline: calculateInvitationDeadline('2026-11-05'),   // 2026-08-05
    deadline: '2026-11-05',
    daysWaitingClient: 1,
    collisionRisk: false,
    riskMessage: null,
    progress: 80,
    category: 'Casamento',
    deliverables: [
      { id: 'd1', title: 'Save the Date Animação', rule: '6 meses antes', deadline: calculateSaveTheDateDeadline('2026-11-05'), status: 'completed', completed: true },
      { id: 'd2', title: 'Convite em Acrílico (Em Gráfica)', rule: '3 meses antes', deadline: calculateInvitationDeadline('2026-11-05'), status: 'in_progress', completed: false },
      { id: 'd3', title: 'Welcome Cards & Papelaria Festa', rule: 'Data da Festa', deadline: '2026-11-05', status: 'pending', completed: false }
    ],
    lastUpdate: 'Ajustando prova de cor com a gráfica'
  },
  {
    id: 'proj-5',
    name: 'Gala Anual TechCorp 2026',
    client: 'Fernanda (RH TechCorp)',
    stage: 'final_delivery',
    value: 7500,
    partyDate: '2026-09-12',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2026-09-12'), // 2026-03-12
    invitationDeadline: calculateInvitationDeadline('2026-09-12'),   // 2026-06-12
    deadline: '2026-09-12',
    daysWaitingClient: 0,
    collisionRisk: false,
    riskMessage: null,
    progress: 95,
    category: 'Corporativo',
    deliverables: [
      { id: 'd1', title: 'Save the Date Teaser', rule: '6 meses antes', deadline: calculateSaveTheDateDeadline('2026-09-12'), status: 'completed', completed: true },
      { id: 'd2', title: 'Convite VIP Credencial', rule: '3 meses antes', deadline: calculateInvitationDeadline('2026-09-12'), status: 'completed', completed: true },
      { id: 'd3', title: 'Brindes, Painel de Palco & Festa', rule: 'Data da Festa', deadline: '2026-09-12', status: 'in_progress', completed: false }
    ],
    lastUpdate: 'Pronto para entrega física na casa de festas'
  },
  {
    id: 'proj-6',
    name: 'Aniversário 50 Anos Roberto',
    client: 'Clara (Esposa)',
    stage: 'briefing',
    value: 2800,
    partyDate: '2027-04-18',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2027-04-18'), // 2026-10-18
    invitationDeadline: calculateInvitationDeadline('2027-04-18'),   // 2027-01-18
    deadline: '2027-04-18',
    daysWaitingClient: 2,
    collisionRisk: false,
    riskMessage: null,
    progress: 15,
    category: 'Aniversário',
    deliverables: [
      { id: 'd1', title: 'Save the Date Rústico Chic', rule: '6 meses antes', deadline: calculateSaveTheDateDeadline('2027-04-18'), status: 'pending', completed: false },
      { id: 'd2', title: 'Convite Caixa de Vinho', rule: '3 meses antes', deadline: calculateInvitationDeadline('2027-04-18'), status: 'pending', completed: false },
      { id: 'd3', title: 'Rótulos Personalizados Festa', rule: 'Data da Festa', deadline: '2027-04-18', status: 'pending', completed: false }
    ],
    lastUpdate: 'Recebendo lista de convidados'
  },
  {
    id: 'proj-7',
    name: 'Batizado Gabriel',
    client: 'Renata Albuquerque',
    stage: 'creation',
    value: 2200,
    partyDate: '2026-12-05',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2026-12-05'), // 2026-06-05
    invitationDeadline: calculateInvitationDeadline('2026-12-05'),   // 2026-09-05
    deadline: '2026-12-05',
    daysWaitingClient: 0,
    collisionRisk: true,
    riskMessage: 'Prazo limite do Convite (05/09 - 3m) no mesmo período da entrega da Formatura',
    progress: 40,
    category: 'Batizado',
    deliverables: [
      { id: 'd1', title: 'Save the Date Oração', rule: '6 meses antes', deadline: calculateSaveTheDateDeadline('2026-12-05'), status: 'completed', completed: true },
      { id: 'd2', title: 'Convite Padrinhos & Convidados', rule: '3 meses antes', deadline: calculateInvitationDeadline('2026-12-05'), status: 'in_progress', completed: false },
      { id: 'd3', title: 'Lembrancinhas Água Benta & Festa', rule: 'Data da Festa', deadline: '2026-12-05', status: 'pending', completed: false }
    ],
    lastUpdate: 'Ilustrando anjinho para o Convite'
  },
  {
    id: 'proj-8',
    name: 'Casamento Juliana & Rodrigo',
    client: 'Juliana Toledo',
    stage: 'briefing',
    value: 8000,
    partyDate: '2027-05-22',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2027-05-22'), // 2026-11-22
    invitationDeadline: calculateInvitationDeadline('2027-05-22'),   // 2027-02-22
    deadline: '2027-05-22',
    daysWaitingClient: 0,
    collisionRisk: false,
    riskMessage: null,
    progress: 10,
    category: 'Casamento',
    deliverables: [
      { id: 'd1', title: 'Save the Date Aquarela', rule: '6 meses antes', deadline: calculateSaveTheDateDeadline('2027-05-22'), status: 'pending', completed: false },
      { id: 'd2', title: 'Convite Tradicional Relevo', rule: '3 meses antes', deadline: calculateInvitationDeadline('2027-05-22'), status: 'pending', completed: false },
      { id: 'd3', title: 'Papelaria Completa da Cerimônia & Festa', rule: 'Data da Festa', deadline: '2027-05-22', status: 'pending', completed: false }
    ],
    lastUpdate: 'Contrato assinado. Aguardando briefing.'
  },
  {
    id: 'proj-9',
    name: 'Formatura Medicina Turma LIX',
    client: 'Comissão (Dra. Camila)',
    stage: 'waiting_approval',
    value: 9500,
    partyDate: '2026-10-25',
    saveTheDateDeadline: calculateSaveTheDateDeadline('2026-10-25'), // 2026-04-25
    invitationDeadline: calculateInvitationDeadline('2026-10-25'),   // 2026-07-25
    deadline: '2026-10-25',
    daysWaitingClient: 3,
    collisionRisk: false,
    riskMessage: null,
    progress: 75,
    category: 'Formatura',
    deliverables: [
      { id: 'd1', title: 'Save the Date Vídeo', rule: '6 meses antes', deadline: calculateSaveTheDateDeadline('2026-10-25'), status: 'completed', completed: true },
      { id: 'd2', title: 'Convite Formando Capa Dura', rule: '3 meses antes', deadline: calculateInvitationDeadline('2026-10-25'), status: 'waiting_approval', completed: false },
      { id: 'd3', title: 'Placas de Homenagem & Decoração Festa', rule: 'Data da Festa', deadline: '2026-10-25', status: 'pending', completed: false }
    ],
    lastUpdate: 'Comissão analisando a capa do Convite'
  }
];

// Sugestões de Ações do Coringa sem WhatsApp
export const AGENT_ACTIONS = [
  {
    id: 'verify_rules',
    title: 'Verificar Regra 6m / 3m',
    description: 'Checar prazos retroativos do Save the Date e Convite relativos às datas das Festas',
    icon: 'Clock',
    targetProjectId: null,
  },
  {
    id: 'reschedule_conflict',
    title: 'Resolver Conflito de Entregáveis',
    description: 'Reorganizar os prazos de Convites de Setembro ajustando produção com margem de segurança',
    icon: 'Calendar',
    targetProjectId: null,
  },
  {
    id: 'capacity_check',
    title: 'Simular Novo Evento (Festa)',
    description: 'Calcular prazos do Save the Date (-6m) e Convite (-3m) para uma nova data de festa',
    icon: 'Activity',
    targetProjectId: null,
  }
];
