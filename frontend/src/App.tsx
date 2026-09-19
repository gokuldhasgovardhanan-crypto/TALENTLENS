import React from 'react';
import { Router, Routes, Route, Navigate } from './services/router';
import { AuthProvider, useAuth } from './services/authContext';
import { StateProvider } from './services/stateContext';
import { Navbar } from './components/layout/Navbar';
import { RoleProtectedRoute } from './components/layout/RoleProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { JobSeekerDashboard } from './pages/jobseeker/JobSeekerDashboard';
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { HRDashboard } from './pages/hr/HRDashboard';

const HomeRedirect: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'student':
      return <Navigate to="/student/dashboard" replace />;
    case 'job_seeker':
      return <Navigate to="/job-seeker/dashboard" replace />;
    case 'employee':
      return <Navigate to="/employee/dashboard" replace />;
    case 'hr':
      return <Navigate to="/hr/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <StateProvider>
        <Router>
          <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/login" element={<LoginPage />} />

                {/* Student Routes */}
                <Route
                  path="/student/*"
                  element={
                    <RoleProtectedRoute allowedRoles={['student']}>
                      <StudentDashboard />
                    </RoleProtectedRoute>
                  }
                />

                {/* Job Seeker Routes */}
                <Route
                  path="/job-seeker/*"
                  element={
                    <RoleProtectedRoute allowedRoles={['job_seeker']}>
                      <JobSeekerDashboard />
                    </RoleProtectedRoute>
                  }
                />

                {/* Employee Routes */}
                <Route
                  path="/employee/*"
                  element={
                    <RoleProtectedRoute allowedRoles={['employee']}>
                      <EmployeeDashboard />
                    </RoleProtectedRoute>
                  }
                />

                {/* HR Routes */}
                <Route
                  path="/hr/*"
                  element={
                    <RoleProtectedRoute allowedRoles={['hr']}>
                      <HRDashboard />
                    </RoleProtectedRoute>
                  }
                />

                {/* Root & Fallback */}
                <Route path="/" element={<HomeRedirect />} />
                <Route path="*" element={<HomeRedirect />} />
              </Routes>
            </main>
          </div>
        </Router>
      </StateProvider>
    </AuthProvider>
  );
};

export default App;
