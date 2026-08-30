import React, { useState } from 'react';
import { X, Plus, PartyPopper, Mail, Bookmark } from 'lucide-react';
import { calculateSaveTheDateDeadline, calculateInvitationDeadline, formatDateBR } from '../utils/dateUtils';

export default function NewProjectModal({ isOpen, onClose, onAddProject, settings }) {
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [category, setCategory] = useState('Casamento');
  const [value, setValue] = useState(5500);
  const [partyDate, setPartyDate] = useState('2027-04-15');

  if (!isOpen) return null;

  const stdWeeks = settings?.saveTheDateWeeks || 6;
  const invWeeks = settings?.invitationWeeks || 3;
  const stdHours = settings?.saveTheDateHours || 5;
  const invHours = settings?.invitationHours || 10;
  const partyHours = settings?.partyHours || 20;

  const saveTheDateDeadline = calculateSaveTheDateDeadline(partyDate, stdWeeks);
  const invitationDeadline = calculateInvitationDeadline(partyDate, invWeeks);

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
        { id: `d-${Date.now()}-1`, title: 'Save the Date', rule: `${stdWeeks} semanas antes`, requiredHours: stdHours, deadline: saveTheDateDeadline, status: 'in_progress', completed: false },
        { id: `d-${Date.now()}-2`, title: 'Convite Oficial', rule: `${invWeeks} semanas antes`, requiredHours: invHours, deadline: invitationDeadline, status: 'pending', completed: false },
        { id: `d-${Date.now()}-3`, title: 'Festa / Evento', rule: 'Data da Festa', requiredHours: partyHours, deadline: partyDate, status: 'pending', completed: false }
      ],
      lastUpdate: 'Cadastrado no Amozir'
    };

    onAddProject(newProj);
    onClose();
  };

  const fieldClass =
    'w-full min-h-11 bg-surface border border-line-control rounded-sm px-3 py-2 text-label text-ink placeholder:text-ink-subtle hover:border-ink-subtle focus:border-accent transition-colors duration-150 ease-quint';
  const labelClass = 'block text-caption font-semibold text-ink-muted mb-1.5';

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-surface border border-line rounded-md w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-modal text-ink p-5 sm:p-6 space-y-5">

        <div className="flex items-start justify-between gap-3 pb-4 border-b border-line-strong">
          <div className="flex items-center gap-3 min-w-0">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-accent"
            >
              <Plus className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-section-title font-semibold text-ink">Cadastrar Novo Evento / Festa</h2>
              <p className="text-caption text-ink-muted">Cálculo retroativo pelas regras de {stdWeeks}w e {invWeeks}w semanas</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar cadastro de evento"
            className="inline-flex items-center justify-center shrink-0 p-2 rounded-sm border border-line-control bg-surface text-ink-muted hover:bg-surface-2 hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className={labelClass} htmlFor="np-name">Nome do Evento:</label>
            <input
              id="np-name"
              type="text"
              required
              placeholder="Ex: Casamento Beatriz & Leonardo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-grid">
            <div>
              <label className={labelClass} htmlFor="np-client">Nome do Cliente:</label>
              <input
                id="np-client"
                type="text"
                required
                placeholder="Ex: Beatriz Lima"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="np-category">Tipo de Evento:</label>
              <select
                id="np-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={fieldClass}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-grid">
            <div>
              <label className={`${labelClass} text-accent flex items-center gap-1.5`} htmlFor="np-party-date">
                <PartyPopper className="w-3.5 h-3.5" aria-hidden="true" />
                Data Final da Festa:
              </label>
              <input
                id="np-party-date"
                type="date"
                required
                value={partyDate}
                onChange={(e) => setPartyDate(e.target.value)}
                className={`${fieldClass} font-semibold tabular-nums`}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="np-value">Valor do Contrato (R$):</label>
              <input
                id="np-value"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={`${fieldClass} font-semibold tabular-nums`}
              />
            </div>
          </div>

          {/* Automatic Calculation Preview Box */}
          <div className="p-3.5 bg-surface-2 border border-line rounded-sm space-y-2 text-label">
            <div className="flex items-center justify-between gap-2 text-ink-muted">
              <span className="flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
                Save the Date ({stdWeeks} semanas / {stdHours}h):
              </span>
              <strong className="font-semibold text-ink tabular-nums">{formatDateBR(saveTheDateDeadline)}</strong>
            </div>
            <div className="flex items-center justify-between gap-2 text-ink-muted">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
                Convite Oficial ({invWeeks} semanas / {invHours}h):
              </span>
              <strong className="font-semibold text-ink tabular-nums">{formatDateBR(invitationDeadline)}</strong>
            </div>
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-line text-ink">
              <span className="flex items-center gap-1.5 font-semibold">
                <PartyPopper className="w-4 h-4 text-accent" aria-hidden="true" />
                Data da Festa ({partyHours}h):
              </span>
              <strong className="font-semibold text-accent tabular-nums">{formatDateBR(partyDate)}</strong>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center min-h-11 px-4 rounded-sm bg-surface border border-line-control text-ink text-label font-semibold hover:bg-surface-2 transition-colors duration-150 ease-quint"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center min-h-11 px-5 rounded-sm bg-accent hover:bg-accent-hover text-on-accent text-label font-semibold transition-colors duration-150 ease-quint"
            >
              Criar Evento com Retro-Datas
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
