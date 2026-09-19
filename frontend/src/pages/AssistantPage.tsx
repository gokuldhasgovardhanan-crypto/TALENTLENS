import React from 'react';
import { useAppState } from '../services/stateContext';
import { ChatInterface } from '../components/assistant/ChatInterface';

export const AssistantPage: React.FC = () => {
  const { setActiveTab } = useAppState();

  return (
    <div className="space-y-6">
      <ChatInterface onNavigateToTab={(tab) => setActiveTab(tab)} />
    </div>
  );
};
