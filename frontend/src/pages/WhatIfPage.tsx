import React from 'react';
import { useAppState } from '../services/stateContext';
import { SkillSimulator } from '../components/whatif/SkillSimulator';

export const WhatIfPage: React.FC = () => {
  const { activeTargetRoleId, setActiveTab, setActiveTargetRoleId } = useAppState();

  return (
    <div className="space-y-6">
      <SkillSimulator
        initialRoleId={activeTargetRoleId || 1}
        onViewRoadmap={(roleId) => {
          setActiveTargetRoleId(roleId);
          setActiveTab('roadmap');
        }}
      />
    </div>
  );
};
