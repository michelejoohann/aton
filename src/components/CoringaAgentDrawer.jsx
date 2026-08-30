import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Calendar, 
  Activity, 
  Play, 
  Volume2, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  Bot,
  RefreshCw,
  Clock,
  PartyPopper,
  Mail,
  Bookmark
} from 'lucide-react';
import { calculateSaveTheDateDeadline, calculateInvitationDeadline, formatDateBR } from '../utils/dateUtils';

export default function CoringaAgentDrawer({ 
  isOpen, 
  onClose, 
  projects, 
  initialAction, 
  onUpdateProjects 
}) {
  const [activeTab, setActiveTab] = useState(initialAction || 'rules');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

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

    const stdDeadline = calculateSaveTheDateDeadline(simPartyDate);
    const invDeadline = calculateInvitationDeadline(simPartyDate);

    setSimResult({
      partyDate: simPartyDate,
      saveTheDateDeadline: stdDeadline,
      invitationDeadline: invDeadline,
      recommendation: `✅ CRONOGRAMA CALCULADO COM SUCESSO: Pela regra de prazos retroativos, o Save the Date deverá ser entregue até ${formatDateBR(stdDeadline)} (6m antes) e o Convite Oficial até ${formatDateBR(invDeadline)} (3m antes). O evento de R$ ${Number(simValue).toLocaleString('pt-BR')} foi aprovado na sua grade!`
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

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
      
      {/* Drawer Container */}
      <div className="w-full max-w-lg bg-[#0F172A] border-l border-purple-500/30 text-slate-100 h-full flex flex-col shadow-2xl shadow-purple-950/50 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 flex items-center gap-2 text-base">
                Agente Coringa
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  Gerente de Prazos IA
                </span>
              </h3>
              <p className="text-xs text-slate-400">Regra: Save the Date (6m) • Convite (3m) • Festa</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Tabs Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 p-1.5 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex-1 py-2 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'rules' 
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Regra 6m / 3m
          </button>

          <button
            onClick={() => setActiveTab('reschedule')}
            className={`flex-1 py-2 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'reschedule' 
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Ajustar Conflitos
          </button>

          <button
            onClick={() => setActiveTab('capacity')}
            className={`flex-1 py-2 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'capacity' 
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Simular Novo Evento
          </button>
        </div>

        {/* Drawer Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* TAB 1: REGRA AUTOMÁTICA DE PRAZOS (6m / 3m / FESTA) */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-4">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Regras de Retrocalculo de Entregáveis
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  O Coringa monitora automaticamente o tempo restante para cada festa e impõe os prazos limites:
                </p>
                <ul className="text-xs text-slate-300 mt-2 space-y-1 pl-2">
                  <li>• <strong className="text-purple-300">Save the Date:</strong> impreterivelmente 6 meses antes da Festa</li>
                  <li>• <strong className="text-amber-300">Convite Oficial:</strong> impreterivelmente 3 meses antes da Festa</li>
                  <li>• <strong className="text-emerald-300">Festa / Evento:</strong> prazo final de entrega física</li>
                </ul>
              </div>

              {/* Status Breakdown of the 9 Active Event Projects */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-200">Projetos com Alerta de Regra:</h5>

                {projects.filter(p => p.collisionRisk).map(p => (
                  <div key={p.id} className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-amber-300">
                      <span>{p.name}</span>
                      <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                        Festa: {formatDateBR(p.partyDate)}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{p.riskMessage}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: RESOLVER CONFLITOS DE CRONOGRAMA */}
          {activeTab === 'reschedule' && (
            <div className="space-y-4">
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Diagnóstico de Sobrecarga de Entregas
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Os convites de <strong>15 Anos Beatriz</strong> (prazo 3m) e o batizado da <strong>Família Albuquerque</strong> acumularam na mesma semana de Setembro.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                <h5 className="text-xs font-bold text-slate-200">
                  Proposta do Coringa para Ajustar os Prazos:
                </h5>

                <ul className="text-xs text-slate-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">1.</span>
                    <span>Espaçar a aprovação de layout do Convite de 15 Anos em 3 dias mantendo a folga de 3 meses.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">2.</span>
                    <span>Resultado: <strong>Regra 6m / 3m / Festa 100% respeitada</strong> e sem colisão de produção.</span>
                  </li>
                </ul>

                {rescheduleSuccess && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Prazos reorganizados com sucesso!
                  </div>
                )}

                <button
                  onClick={handleApplyReschedule}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-purple-900/30"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Aplicar Reorganização de Prazos</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SIMULAR NOVO EVENTO (COM REGRA AUTOMÁTICA 6M / 3M) */}
          {activeTab === 'capacity' && (
            <div className="space-y-4">
              <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-4">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  Calculadora de Retro-Prazos do Novo Evento
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Digite a <strong>Data da Festa</strong>. O Coringa calculará instantaneamente a data limite do Save the Date (-6m) e do Convite (-3m).
                </p>
              </div>

              <form onSubmit={handleSimulateNewEvent} className="space-y-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tipo de Evento:
                  </label>
                  <select
                    value={simCategory}
                    onChange={(e) => setSimCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
                  >
                    <option value="Casamento">Casamento</option>
                    <option value="15 Anos">15 Anos</option>
                    <option value="Bodas">Bodas</option>
                    <option value="Corporativo">Corporativo</option>
                    <option value="Aniversário">Aniversário</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-400 mb-1">
                    🎉 Data Final da Festa:
                  </label>
                  <input
                    type="date"
                    required
                    value={simPartyDate}
                    onChange={(e) => setSimPartyDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Valor do Projeto (R$):
                  </label>
                  <input
                    type="number"
                    value={simValue}
                    onChange={(e) => setSimValue(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-purple-600/30"
                >
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <span>Calcular Prazos Automáticos</span>
                </button>
              </form>

              {simResult && (
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/50 rounded-xl text-xs leading-relaxed space-y-2">
                  <p className="font-semibold text-emerald-300">{simResult.recommendation}</p>
                  
                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 space-y-1 font-mono text-[11px]">
                    <div className="text-purple-300">📌 Save the Date: {formatDateBR(simResult.saveTheDateDeadline)} (-6 meses)</div>
                    <div className="text-amber-300">💌 Convite Oficial: {formatDateBR(simResult.invitationDeadline)} (-3 meses)</div>
                    <div className="text-emerald-300">🎉 Data da Festa: {formatDateBR(simResult.partyDate)}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DAILY BRIEFING AUDIO PLAYER SIMULATION */}
          <div className="pt-4 border-t border-slate-800">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/40 transition-transform active:scale-95"
                >
                  {isPlayingAudio ? <Volume2 className="w-5 h-5 animate-pulse" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <div>
                  <h5 className="text-xs font-bold text-slate-100">Daily Briefing da Camila</h5>
                  <p className="text-[11px] text-slate-400">
                    {isPlayingAudio ? 'Reproduzindo resumo de prazos (0:38)...' : 'Ouvir resumo de entregáveis do dia'}
                  </p>
                </div>
              </div>

              {isPlayingAudio && (
                <span className="text-xs font-mono text-purple-400 font-bold animate-pulse">
                  0:12 / 0:38
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 text-center text-[11px] text-slate-400">
          Coringa PM Agent • ICP Eventos & Papelaria • <strong className="text-purple-300">R$ 47/mês</strong>
        </div>

      </div>
    </div>
  );
}
