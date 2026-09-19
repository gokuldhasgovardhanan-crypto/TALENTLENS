import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from './api';

export type { UserRole };

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password?: string, demoRole?: string) => Promise<User>;
  register: (email: string, password?: string, name?: string, role?: UserRole) => Promise<User>;
  loginAsDemoUser: (role: UserRole) => Promise<User>;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tl_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('tl_token'));
  const [loading, setLoading] = useState<boolean>(false);

  // Default demo users mapping
  const demoRoleEmails: Record<UserRole, string> = {
    student: 'student@talentlens.demo',
    job_seeker: 'jobseeker@talentlens.demo',
    employee: 'employee@talentlens.demo',
    hr: 'hr@talentlens.demo',
  };

  const login = async (email: string, password?: string, demoRole?: string): Promise<User> => {
    setLoading(true);
    try {
      const res = await api.login(email, password, demoRole);
      // Ensure role property exists on user
      const userWithRole: User = {
        ...res.user,
        role: res.user.role || (res.user.user_type === 'hr_admin' ? 'hr' : res.user.user_type || 'job_seeker'),
        full_name: res.user.full_name || res.user.name || 'User',
      };
      setUser(userWithRole);
      setToken(res.access_token);
      localStorage.setItem('tl_user', JSON.stringify(userWithRole));
      localStorage.setItem('tl_token', res.access_token);
      return userWithRole;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password?: string, name?: string, role?: UserRole): Promise<User> => {
    setLoading(true);
    try {
      const res = await api.register(name || 'New User', email, role || 'job_seeker', password);
      const userWithRole: User = {
        ...res.user,
        role: role || 'job_seeker',
        full_name: name || 'New User',
      };
      setUser(userWithRole);
      setToken(res.access_token);
      localStorage.setItem('tl_user', JSON.stringify(userWithRole));
      localStorage.setItem('tl_token', res.access_token);
      return userWithRole;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoUser = async (role: UserRole): Promise<User> => {
    const email = demoRoleEmails[role];
    return login(email, 'demo', role);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tl_user');
    localStorage.removeItem('tl_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        loginAsDemoUser,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
