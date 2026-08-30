import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import FocusRadar from './components/FocusRadar.jsx';
import ProjectPipeline from './components/ProjectPipeline.jsx';
import CalendarView from './components/CalendarView.jsx';
import CoringaAgentDrawer from './components/CoringaAgentDrawer.jsx';
import ProjectDetailModal from './components/ProjectDetailModal.jsx';
import NewProjectModal from './components/NewProjectModal.jsx';
import CapacityModal from './components/CapacityModal.jsx';
import PitchModal from './components/PitchModal.jsx';
import UserSettingsModal, { DEFAULT_SETTINGS } from './components/UserSettingsModal.jsx';
import ContractReaderModal from './components/ContractReaderModal.jsx';
import { INITIAL_PROJECTS, PERSONA_CAMILA } from './data/mockData.js';
import { Sun } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [persona] = useState(PERSONA_CAMILA);
  const [activeView, setActiveView] = useState('pipeline'); // 'pipeline' | 'calendar'

  // User Settings State with localStorage persistence
  const [userSettings, setUserSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('amozir_user_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const handleSaveSettings = (newSettings) => {
    setUserSettings(newSettings);
    try {
      localStorage.setItem('amozir_user_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.warn('Erro ao salvar configurações no localStorage:', e);
    }
  };

  // Modals & Drawers States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [agentActionType, setAgentActionType] = useState('rules');

  const [selectedProjectDetail, setSelectedProjectDetail] = useState(null);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isCapacityOpen, setIsCapacityOpen] = useState(false);
  const [isPitchOpen, setIsPitchOpen] = useState(false);
  const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false);
  const [isContractReaderOpen, setIsContractReaderOpen] = useState(false);

  // Move project stage in pipeline
  const handleMoveProjectStage = (projectId, newStage) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          stage: newStage,
          lastUpdate: `Etapa atualizada para ${newStage}`
        };
      }
      return p;
    }));
  };

  // Add new project
  const handleAddProject = (newProj) => {
    setProjects(prev => [newProj, ...prev]);
  };

  // Abre o drawer do agente Amozir com uma ação pré-selecionada
  const handleOpenAgentAction = (actionType = 'rules') => {
    setAgentActionType(actionType);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen text-ink flex flex-col">

      {/* Top Header Navigation */}
      <Header
        persona={persona}
        projectsCount={projects.length}
        activeView={activeView}
        onSwitchView={(view) => setActiveView(view)}
        onOpenNewProject={() => setIsNewProjectOpen(true)}
        onOpenCoringaAgent={() => handleOpenAgentAction('rules')}
        onOpenPitchModal={() => setIsPitchOpen(true)}
        onOpenCapacityModal={() => setIsCapacityOpen(true)}
        onOpenUserSettings={() => setIsUserSettingsOpen(true)}
        onOpenContractReader={() => setIsContractReaderOpen(true)}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-page-x lg:px-8 py-8 space-y-8">

        {/* Radar de Foco com recolhimento e filtros */}
        <FocusRadar
          projects={projects}
          settings={userSettings}
          onSelectProject={(proj) => setSelectedProjectDetail(proj)}
          onOpenAgentAction={handleOpenAgentAction}
        />

        {/* View Switcher Container */}
        {activeView === 'pipeline' ? (
          <ProjectPipeline
            projects={projects}
            settings={userSettings}
            onMoveProjectStage={handleMoveProjectStage}
            onSelectProject={(proj) => setSelectedProjectDetail(proj)}
            onOpenAgentAction={handleOpenAgentAction}
          />
        ) : (
          <CalendarView
            projects={projects}
            settings={userSettings}
            onSelectProject={(proj) => setSelectedProjectDetail(proj)}
          />
        )}

      </main>

      {/* Persistent Floating Quick AI Trigger Button */}
      <div className="fixed bottom-5 right-5 z-sticky">
        <button
          onClick={() => handleOpenAgentAction('rules')}
          className="inline-flex items-center gap-2 min-h-11 px-4 rounded-sm bg-accent hover:bg-accent-hover text-on-accent text-label font-semibold shadow-raised transition-colors duration-200 ease-quint"
        >
          <Sun className="w-4 h-4" aria-hidden="true" />
          <span>Falar com o Amozir</span>
        </button>
      </div>

      {/* Drawers & Modals */}
      <CoringaAgentDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        projects={projects}
        settings={userSettings}
        initialAction={agentActionType}
        onUpdateProjects={(updated) => setProjects(updated)}
      />

      <ProjectDetailModal
        project={selectedProjectDetail}
        onClose={() => setSelectedProjectDetail(null)}
      />

      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onAddProject={handleAddProject}
        onOpenContractReader={() => setIsContractReaderOpen(true)}
        settings={userSettings}
      />

      <ContractReaderModal
        isOpen={isContractReaderOpen}
        onClose={() => setIsContractReaderOpen(false)}
        onAddProject={handleAddProject}
        settings={userSettings}
      />

      <CapacityModal
        isOpen={isCapacityOpen}
        onClose={() => setIsCapacityOpen(false)}
        projects={projects}
        persona={persona}
        settings={userSettings}
      />

      <PitchModal
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
      />

      <UserSettingsModal
        isOpen={isUserSettingsOpen}
        onClose={() => setIsUserSettingsOpen(false)}
        settings={userSettings}
        onSaveSettings={handleSaveSettings}
      />

      {/* Footer */}
      <footer className="border-t border-line bg-surface-2 mt-auto">
        <div className="max-w-7xl mx-auto px-page-x lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-caption text-ink-muted">
          <span className="text-center sm:text-left">
            Amozir • Do prazo final ao próximo passo — Std ({userSettings.saveTheDateWeeks}w/5h) / Convite ({userSettings.invitationWeeks}w/10h) / Festa (20h)
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsUserSettingsOpen(true)}
              className="inline-flex items-center min-h-11 px-2 rounded-sm text-ink-muted hover:text-accent font-medium transition-colors duration-150 ease-quint"
            >
              ⚙️ Configurações do Usuário
            </button>
            <span aria-hidden="true" className="text-line-strong">•</span>
            <button
              onClick={() => setIsPitchOpen(true)}
              className="inline-flex items-center min-h-11 px-2 rounded-sm text-ink-muted hover:text-accent underline decoration-line-control underline-offset-4 transition-colors duration-150 ease-quint"
            >
              ICP &amp; Tese Comercial
            </button>
            <span aria-hidden="true" className="text-line-strong">•</span>
            <span className="font-semibold text-ink tabular-nums">R$ 47,00 / mês</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
