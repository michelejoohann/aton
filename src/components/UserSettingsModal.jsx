import React, { useState } from 'react';
import { Settings, X, Save, Clock, Calendar, Check, RotateCcw } from 'lucide-react';

export const DEFAULT_SETTINGS = {
  // Prazos limite em semanas antes da Festa
  saveTheDateWeeks: 6,
  invitationWeeks: 3,

  // Horas de produção necessárias por tipo de entregável
  saveTheDateHours: 5,
  invitationHours: 10,
  partyHours: 20,

  // Jornada de Trabalho do Usuário Principal
  morningStart: '08:00',
  morningEnd: '12:00',
  afternoonStart: '13:00',
  afternoonEnd: '17:00',
  breakMinutes: 15,
  workDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
};

export default function UserSettingsModal({ isOpen, onClose, settings, onSaveSettings }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    ...DEFAULT_SETTINGS,
    ...(settings || {})
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setSavedSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetDefaults = () => {
    setFormData(DEFAULT_SETTINGS);
    setSavedSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-surface rounded-md border border-line shadow-raised w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-line bg-surface-2">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-accent">
              <Settings className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="settings-modal-title" className="text-section-title font-semibold text-ink">
                Painel de Configurações do Usuário Principal
              </h2>
              <p className="text-caption text-ink-muted mt-0.5">
                Ajuste os prazos padrão em semanas, horas de produção e a jornada de trabalho da agenda.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-sm text-ink-muted hover:text-ink hover:bg-surface transition-colors"
            aria-label="Fechar configurações"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Seção 1: Regras de Prazos (Semanas) */}
          <div>
            <h3 className="text-label font-semibold text-ink flex items-center gap-2 pb-2 border-b border-line">
              <Calendar className="w-4 h-4 text-accent" />
              <span>Regras de Prazos Retroativos (Antecedência da Festa)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-caption font-medium text-ink mb-1.5">
                  Save the Date (em semanas antes da festa)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="52"
                    value={formData.saveTheDateWeeks}
                    onChange={(e) => handleChange('saveTheDateWeeks', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-line-control bg-surface text-ink font-semibold focus:outline-none focus:border-accent"
                    required
                  />
                  <span className="text-caption text-ink-muted font-medium whitespace-nowrap">semanas</span>
                </div>
                <p className="text-caption text-ink-subtle mt-1">Padrão: 6 semanas (ex: festa em 15/10 → Std em 03/09)</p>
              </div>

              <div>
                <label className="block text-caption font-medium text-ink mb-1.5">
                  Convite Oficial (em semanas antes da festa)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="52"
                    value={formData.invitationWeeks}
                    onChange={(e) => handleChange('invitationWeeks', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-line-control bg-surface text-ink font-semibold focus:outline-none focus:border-accent"
                    required
                  />
                  <span className="text-caption text-ink-muted font-medium whitespace-nowrap">semanas</span>
                </div>
                <p className="text-caption text-ink-subtle mt-1">Padrão: 3 semanas (ex: festa em 15/10 → Convite em 24/09)</p>
              </div>
            </div>
          </div>

          {/* Seção 2: Carga Horária de Produção Necessária */}
          <div>
            <h3 className="text-label font-semibold text-ink flex items-center gap-2 pb-2 border-b border-line">
              <Clock className="w-4 h-4 text-accent" />
              <span>Carga Horária de Produção Necessária (em Horas)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-caption font-medium text-ink mb-1.5">
                  Save the Date
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.saveTheDateHours}
                    onChange={(e) => handleChange('saveTheDateHours', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-line-control bg-surface text-ink font-semibold focus:outline-none focus:border-accent"
                    required
                  />
                  <span className="text-caption text-ink-muted font-medium">horas</span>
                </div>
              </div>

              <div>
                <label className="block text-caption font-medium text-ink mb-1.5">
                  Convite Oficial
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.invitationHours}
                    onChange={(e) => handleChange('invitationHours', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-line-control bg-surface text-ink font-semibold focus:outline-none focus:border-accent"
                    required
                  />
                  <span className="text-caption text-ink-muted font-medium">horas</span>
                </div>
              </div>

              <div>
                <label className="block text-caption font-medium text-ink mb-1.5">
                  Festa / Evento
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.partyHours}
                    onChange={(e) => handleChange('partyHours', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-line-control bg-surface text-ink font-semibold focus:outline-none focus:border-accent"
                    required
                  />
                  <span className="text-caption text-ink-muted font-medium">horas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seção 3: Jornada de Trabalho na Agenda */}
          <div>
            <h3 className="text-label font-semibold text-ink flex items-center gap-2 pb-2 border-b border-line">
              <Clock className="w-4 h-4 text-accent" />
              <span>Jornada de Trabalho &amp; Pausas na Agenda</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {/* Turno da Manhã */}
              <div className="bg-surface-2 p-3.5 rounded-sm border border-line space-y-3">
                <span className="block text-caption font-semibold text-ink">Turno da Manhã</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-caption text-ink-muted mb-1">Início</label>
                    <input
                      type="time"
                      value={formData.morningStart}
                      onChange={(e) => handleChange('morningStart', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-sm border border-line-control bg-surface text-ink text-caption font-semibold focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-caption text-ink-muted mb-1">Fim</label>
                    <input
                      type="time"
                      value={formData.morningEnd}
                      onChange={(e) => handleChange('morningEnd', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-sm border border-line-control bg-surface text-ink text-caption font-semibold focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Turno da Tarde */}
              <div className="bg-surface-2 p-3.5 rounded-sm border border-line space-y-3">
                <span className="block text-caption font-semibold text-ink">Turno da Tarde</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-caption text-ink-muted mb-1">Início</label>
                    <input
                      type="time"
                      value={formData.afternoonStart}
                      onChange={(e) => handleChange('afternoonStart', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-sm border border-line-control bg-surface text-ink text-caption font-semibold focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-caption text-ink-muted mb-1">Fim</label>
                    <input
                      type="time"
                      value={formData.afternoonEnd}
                      onChange={(e) => handleChange('afternoonEnd', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-sm border border-line-control bg-surface text-ink text-caption font-semibold focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Intervalo de descanso */}
            <div className="mt-4 flex items-center justify-between p-3.5 bg-surface-2 rounded-sm border border-line">
              <div>
                <label htmlFor="breakMinutesInput" className="block text-caption font-semibold text-ink">
                  Pausa de Descanso Entre Tarefas
                </label>
                <p className="text-caption text-ink-subtle">Intervalo mínimo inserido automaticamente no cronograma da agenda.</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="breakMinutesInput"
                  type="number"
                  min="0"
                  max="60"
                  value={formData.breakMinutes}
                  onChange={(e) => handleChange('breakMinutes', Number(e.target.value))}
                  className="w-20 px-3 py-1.5 rounded-sm border border-line-control bg-surface text-ink font-semibold focus:outline-none text-center"
                  required
                />
                <span className="text-caption text-ink-muted font-medium">minutos</span>
              </div>
            </div>

          </div>

          {/* Actions Footer */}
          <div className="pt-4 border-t border-line flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm text-caption text-ink-muted hover:text-ink hover:bg-surface-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Padrões</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-sm text-label font-medium text-ink-muted hover:bg-surface-2 transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-sm bg-accent hover:bg-accent-hover text-on-accent text-label font-semibold shadow-raised transition-colors"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Salvo com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Salvar Configurações</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
