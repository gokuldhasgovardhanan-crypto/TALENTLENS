import React, { useState, useEffect } from 'react';
import { RoadmapResponse } from '../types';
import { api } from '../services/api';
import { useAppState } from '../services/stateContext';
import { TimelineView } from '../components/roadmap/TimelineView';

export const RoadmapPage: React.FC = () => {
  const { currentUser, activeTargetRoleId, setActiveTab } = useAppState();
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoadmap = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const data = await api.getRoadmap(currentUser.id, activeTargetRoleId);
        setRoadmap(data);
      } catch (err) {
        console.error('Roadmap error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [currentUser, activeTargetRoleId]);

  return (
    <div className="space-y-6">
      <TimelineView
        roadmap={roadmap}
        onSimulateAgain={() => setActiveTab('whatif')}
      />
    </div>
  );
};
