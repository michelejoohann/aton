import React, { useState } from 'react';
import Header from './components/Header';
import FocusRadar from './components/FocusRadar';
import ProjectPipeline from './components/ProjectPipeline';
import CalendarView from './components/CalendarView';
import CoringaAgentDrawer from './components/CoringaAgentDrawer';
import ProjectDetailModal from './components/ProjectDetailModal';
import NewProjectModal from './components/NewProjectModal';
import CapacityModal from './components/CapacityModal';
import PitchModal from './components/PitchModal';
import { INITIAL_PROJECTS, PERSONA_CAMILA } from './data/mockData';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [persona, setPersona] = useState(PERSONA_CAMILA);
  const [activeView, setActiveView] = useState('pipeline'); // 'pipeline' | 'calendar'

  // Modals & Drawers States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [agentActionType, setAgentActionType] = useState('rules');

  const [selectedProjectDetail, setSelectedProjectDetail] = useState(null);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isCapacityOpen, setIsCapacityOpen] = useState(false);
  const [isPitchOpen, setIsPitchOpen] = useState(false);

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

  // Open Coringa Agent Drawer with action preset
  const handleOpenAgentAction = (actionType = 'rules') => {
    setAgentActionType(actionType);
    setIsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white">
      
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
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        
        {/* Radar de Foco ("O que precisa da sua atenção AGORA - Regras 6m / 3m / Festa") */}
        <FocusRadar
          projects={projects}
          onSelectProject={(proj) => setSelectedProjectDetail(proj)}
          onOpenAgentAction={handleOpenAgentAction}
        />

        {/* View Switcher Container */}
        {activeView === 'pipeline' ? (
          <ProjectPipeline
            projects={projects}
            onMoveProjectStage={handleMoveProjectStage}
            onSelectProject={(proj) => setSelectedProjectDetail(proj)}
            onOpenAgentAction={handleOpenAgentAction}
          />
        ) : (
          <CalendarView
            projects={projects}
            onSelectProject={(proj) => setSelectedProjectDetail(proj)}
          />
        )}

      </main>

      {/* Persistent Floating Quick AI Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => handleOpenAgentAction('rules')}
          className="flex items-center gap-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-xl shadow-purple-600/40 border border-purple-400/30 transition-all hover:scale-105 active:scale-95 group animate-agent-pulse"
        >
          <Sparkles className="w-4 h-4 text-purple-200 group-hover:rotate-12 transition-transform" />
          <span>Falar com o Coringa</span>
        </button>
      </div>

      {/* Drawers & Modals */}
      <CoringaAgentDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        projects={projects}
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
      />

      <CapacityModal
        isOpen={isCapacityOpen}
        onClose={() => setIsCapacityOpen(false)}
        projects={projects}
        persona={persona}
      />

      <PitchModal
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Coringa | Agente Gerente de Eventos • Regra Save the Date (6m) / Convite (3m) / Festa</span>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsPitchOpen(true)} className="hover:text-purple-400 transition-colors">
              ICP & Tese Comercial
            </button>
            <span>•</span>
            <span className="text-purple-300 font-semibold">R$ 47,00 / mês</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
