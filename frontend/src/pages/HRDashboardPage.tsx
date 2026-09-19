import React from 'react';
import { WorkforceOverview } from '../components/hr/WorkforceOverview';

export const HRDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <WorkforceOverview />
    </div>
  );
};
