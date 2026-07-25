import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdvancedDashboard from './pages/AdvancedDashboard';
import KanbanBoard from './pages/KanbanBoard';
import TasksPage from './pages/TasksPage';
import AdvancedMessagesPage from './pages/AdvancedMessagesPage';
import AdvancedTeamPage from './pages/AdvancedTeamPage';
import SettingsPage from './pages/SettingsPage';

import './styles/App.css';

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: { background: '#1e293b', color: '#fff', borderRadius: '12px', padding: '14px 20px', fontSize: '14px' },
        success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
      }} />

      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ThemeProvider>
          <AuthProvider>
            <WorkspaceProvider>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<ProtectedRoute><AdvancedDashboard /></ProtectedRoute>} />
                <Route path="/board" element={<ProtectedRoute><KanbanBoard /></ProtectedRoute>} />
                <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
                <Route path="/messages" element={<ProtectedRoute><AdvancedMessagesPage /></ProtectedRoute>} />
                <Route path="/team" element={<ProtectedRoute><AdvancedTeamPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              </Routes>
            </WorkspaceProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </>
  );
}

export default App;
