import React, { useState } from 'react';
import { X, Sparkles, Plus, Calendar, DollarSign, User, Tag } from 'lucide-react';
import { calculateSaveTheDateDeadline, calculateInvitationDeadline, formatDateBR } from '../utils/dateUtils';

export default function NewProjectModal({ isOpen, onClose, onAddProject }) {
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [category, setCategory] = useState('Casamento');
  const [value, setValue] = useState(5500);
  const [partyDate, setPartyDate] = useState('2027-04-15');

  if (!isOpen) return null;

  const saveTheDateDeadline = calculateSaveTheDateDeadline(partyDate);
  const invitationDeadline = calculateInvitationDeadline(partyDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !client || !partyDate) return;

    const newProj = {
      id: `proj-${Date.now()}`,
      name,
      client,
      stage: 'briefing',
      value: Number(value),
      partyDate,
      saveTheDateDeadline,
      invitationDeadline,
      deadline: partyDate,
      daysWaitingClient: 0,
      collisionRisk: false,
      riskMessage: null,
      progress: 10,
      category,
      deliverables: [
        { id: `d-${Date.now()}-1`, title: 'Save the Date', rule: '6 meses antes', deadline: saveTheDateDeadline, status: 'in_progress', completed: false },
        { id: `d-${Date.now()}-2`, title: 'Convite Oficial', rule: '3 meses antes', deadline: invitationDeadline, status: 'pending', completed: false },
        { id: `d-${Date.now()}-3`, title: 'Festa / Evento', rule: 'Data da Festa', deadline: partyDate, status: 'pending', completed: false }
      ],
      lastUpdate: 'Cadastrado no Coringa'
    };

    onAddProject(newProj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0F172A] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl text-slate-100 p-6 space-y-5">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Cadastrar Novo Evento / Festa</h2>
              <p className="text-xs text-slate-400">O Coringa calculará retroativamente os prazos de 6m e 3m</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Nome do Evento:</label>
            <input
              type="text"
              required
              placeholder="Ex: Casamento Beatriz & Leonardo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nome do Cliente:</label>
              <input
                type="text"
                required
                placeholder="Ex: Beatriz Lima"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tipo de Evento:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500 font-medium"
              >
                <option value="Casamento">Casamento</option>
                <option value="15 Anos">15 Anos</option>
                <option value="Bodas">Bodas</option>
                <option value="Corporativo">Corporativo</option>
                <option value="Aniversário">Aniversário</option>
                <option value="Batizado">Batizado</option>
                <option value="Formatura">Formatura</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-emerald-400 font-bold mb-1">🎉 Data Final da Festa:</label>
              <input
                type="date"
                required
                value={partyDate}
                onChange={(e) => setPartyDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Valor do Contrato (R$):</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-emerald-400 font-bold focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Automatic Calculation Preview Box */}
          <div className="p-3.5 bg-purple-950/30 border border-purple-500/40 rounded-xl space-y-1.5 font-mono text-[11px]">
            <div className="text-purple-300 flex justify-between">
              <span>📌 Save the Date (6m antes):</span>
              <strong className="text-white">{formatDateBR(saveTheDateDeadline)}</strong>
            </div>
            <div className="text-amber-300 flex justify-between">
              <span>💌 Convite Oficial (3m antes):</span>
              <strong className="text-white">{formatDateBR(invitationDeadline)}</strong>
            </div>
            <div className="text-emerald-300 flex justify-between pt-1 border-t border-purple-500/20">
              <span>🎉 Data da Festa:</span>
              <strong className="text-emerald-400">{formatDateBR(partyDate)}</strong>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-md shadow-purple-600/30"
            >
              Criar Evento com Retro-Datas
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
