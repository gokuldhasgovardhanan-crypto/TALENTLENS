import React, { useState, useEffect } from 'react';
import { GraphData } from '../types';
import { api } from '../services/api';
import { useAppState } from '../services/stateContext';
import { InteractiveSkillGraph } from '../components/graph/InteractiveSkillGraph';

export const GraphPage: React.FC = () => {
  const { currentUser } = useAppState();
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGraph = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const data = await api.getSkillGraph(currentUser.id);
        setGraphData(data);
      } catch (err) {
        console.error('Graph fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGraph();
  }, [currentUser]);

  return (
    <div className="space-y-6">
      <InteractiveSkillGraph data={graphData} />
    </div>
  );
};
