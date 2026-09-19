import React from 'react';
import { StateProvider, useAppState } from './services/stateContext';
import { Navbar } from './components/layout/Navbar';
import { DemoBanner } from './components/layout/DemoBanner';
import { ResponsibleAIModal } from './components/layout/ResponsibleAIModal';
import { LandingPage } from './pages/LandingPage';
import { ProfilePage } from './pages/ProfilePage';
import { GraphPage } from './pages/GraphPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { SkillGapsPage } from './pages/SkillGapsPage';
import { WhatIfPage } from './pages/WhatIfPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { AssistantPage } from './pages/AssistantPage';
import { HRDashboardPage } from './pages/HRDashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, toastMessage } = useAppState();

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <LandingPage />;
      case 'profile':
        return <ProfilePage />;
      case 'graph':
        return <GraphPage />;
      case 'matching':
        return <OpportunitiesPage />;
      case 'gaps':
        return <SkillGapsPage />;
      case 'whatif':
        return <WhatIfPage />;
      case 'roadmap':
        return <RoadmapPage />;
      case 'assistant':
        return <AssistantPage />;
      case 'hr':
        return <HRDashboardPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />
      <DemoBanner />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTab()}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 border border-emerald-500/40 text-white text-xs font-semibold shadow-2xl shadow-emerald-500/20 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <ResponsibleAIModal />

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-400">TALENT<span className="text-emerald-400">LENS</span></span>
            <span>• AI Talent Discovery & Career Intelligence Platform</span>
          </div>
          <div>
            Built with Hybrid Deterministic AI • Zero Rate Limits • Local First Architecture
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <StateProvider>
      <MainContent />
    </StateProvider>
  );
};

export default App;
