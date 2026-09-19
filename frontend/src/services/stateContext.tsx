import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProfileDetail } from '../types';
import { api } from './api';

interface StateContextType {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  profileDetail: UserProfileDetail | null;
  refreshProfile: () => Promise<void>;
  demoUsers: User[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  demoStep: number;
  setDemoStep: (step: number) => void;
  startGuidedDemo: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  systemStatus: { ai_mode: string; offline_ready: boolean };
  isResponsibleModalOpen: boolean;
  setIsResponsibleModalOpen: (open: boolean) => void;
  activeTargetRoleId: number;
  setActiveTargetRoleId: (id: number) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [demoUsers, setDemoUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profileDetail, setProfileDetail] = useState<UserProfileDetail | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [demoStep, setDemoStep] = useState<number>(0); // 0 = off, 1-8 = guided step
  const [systemStatus, setSystemStatus] = useState<{ ai_mode: string; offline_ready: boolean }>({
    ai_mode: 'Local Mode',
    offline_ready: true,
  });
  const [isResponsibleModalOpen, setIsResponsibleModalOpen] = useState(false);
  const [activeTargetRoleId, setActiveTargetRoleId] = useState<number>(1); // Data Analyst
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  useEffect(() => {
    // Initial fetch of demo users & status
    const init = async () => {
      try {
        const users = await api.getDemoUsers();
        setDemoUsers(users);
        if (users.length > 0) {
          // Default to Priya Sharma
          const priya = users.find((u) => u.name.includes('Priya')) || users[0];
          setCurrentUser(priya);
        }
        const status = await api.getStatus();
        setSystemStatus(status);
      } catch (err) {
        console.error('Initialization error:', err);
      }
    };
    init();
  }, []);

  const refreshProfile = async () => {
    if (!currentUser) return;
    try {
      const p = await api.getProfile(currentUser.id);
      setProfileDetail(p);
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      refreshProfile();
    }
  }, [currentUser]);

  const startGuidedDemo = () => {
    const priya = demoUsers.find((u) => u.name.includes('Priya')) || demoUsers[0];
    if (priya) {
      setCurrentUser(priya);
    }
    setDemoStep(1);
    setActiveTab('profile');
    showToast('🚀 Hackathon 3-Minute Curated Demo Started (Priya Sharma)');
  };

  const nextDemoStep = () => {
    const next = demoStep + 1;
    setDemoStep(next);

    switch (next) {
      case 1:
        setActiveTab('profile');
        break;
      case 2:
        setActiveTab('graph');
        break;
      case 3:
        setActiveTab('matching');
        break;
      case 4:
        setActiveTab('gaps');
        break;
      case 5:
        setActiveTab('whatif');
        break;
      case 6:
        setActiveTab('roadmap');
        break;
      case 7:
        setActiveTab('assistant');
        break;
      case 8:
        // Switch to HR persona
        const ananya = demoUsers.find((u) => u.name.includes('Ananya')) || demoUsers[3];
        if (ananya) setCurrentUser(ananya);
        setActiveTab('hr');
        break;
      default:
        setDemoStep(0);
        showToast('🎉 Demo Completed! Feel free to explore freely.');
        break;
    }
  };

  const prevDemoStep = () => {
    if (demoStep <= 1) {
      setDemoStep(0);
      return;
    }
    const prev = demoStep - 1;
    setDemoStep(prev);
    // Align tabs
    if (prev === 1) setActiveTab('profile');
    if (prev === 2) setActiveTab('graph');
    if (prev === 3) setActiveTab('matching');
    if (prev === 4) setActiveTab('gaps');
    if (prev === 5) setActiveTab('whatif');
    if (prev === 6) setActiveTab('roadmap');
    if (prev === 7) setActiveTab('assistant');
  };

  return (
    <StateContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        profileDetail,
        refreshProfile,
        demoUsers,
        activeTab,
        setActiveTab,
        demoStep,
        setDemoStep,
        startGuidedDemo,
        nextDemoStep,
        prevDemoStep,
        systemStatus,
        isResponsibleModalOpen,
        setIsResponsibleModalOpen,
        activeTargetRoleId,
        setActiveTargetRoleId,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(StateContext);
  if (!context) throw new Error('useAppState must be used within StateProvider');
  return context;
};
