import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PageLayout from './components/layout/PageLayout'
import useAppStore from './store/useStore'
import { ToastContainer } from './components/ui/Toast'

// Simple MVP Pages
import LoginPage from './pages/auth/LoginPage'
import SimpleDashboard from './pages/SimpleDashboard'
import SimpleLeads from './pages/SimpleLeads'
import SimpleInbox from './pages/SimpleInbox'
import Reports from './pages/Reports'
import Users from './pages/Users'
import Settings from './pages/Settings'
import Integrations from './pages/Integrations'
import SalesAgent from './pages/SalesAgent'
import Contacts from './pages/Contacts'
import Comments from './pages/Comments'
import MetaAds from './pages/MetaAds'
import Notifications from './pages/Notifications'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 30000
    }
  }
})

import PublicLayout from './components/layout/PublicLayout'
import HomePage from './pages/public/HomePage'
import ContactPage from './pages/public/ContactPage'

function AppRoutes() {
  const { isAuthenticated } = useAppStore()

  return (
    <>
      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Auth Route */}
        <Route path="/login" element={
          isAuthenticated || localStorage.getItem('user') ? (() => {
            const r = localStorage.getItem('role') || 'SUPER_ADMIN';
            const roleStr = r.toUpperCase().replace(' ', '_');
            const roleMap = {
                'SUPER_ADMIN': 'super-admin',
                'ADMIN': 'admin',
                'MANAGER': 'manager',
                'TEAM_LEADER': 'team-leader',
                'CUSTOMER_SUPPORT': 'support',
                'COUNSELOR': 'counselor'
            };
            const rolePath = roleMap[roleStr] || 'user';
            return <Navigate to={`/${rolePath}/dashboard`} replace />;
          })() : <LoginPage />
        } />

        {/* Private CRM Routes */}
        <Route
          element={
            isAuthenticated || localStorage.getItem('user') ? (
              <PageLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="/:rolePath/dashboard" element={<SimpleDashboard />} />
          <Route path="/:rolePath/leads" element={<SimpleLeads />} />
          <Route path="/:rolePath/my-leads" element={<SimpleLeads />} />
          <Route path="/:rolePath/inbox" element={<SimpleInbox />} />
          <Route path="/:rolePath/reports" element={<Reports />} />
          <Route path="/:rolePath/users" element={<Users />} />
          <Route path="/:rolePath/settings" element={<Settings />} />
          <Route path="/:rolePath/integrations" element={<Integrations />} />
          <Route path="/:rolePath/integration" element={<Integrations />} />
          <Route path="/:rolePath/sales-agent" element={<SalesAgent />} />
          <Route path="/:rolePath/contacts" element={<Contacts />} />
          <Route path="/:rolePath/comments" element={<Comments />} />
          <Route path="/:rolePath/meta-ads" element={<MetaAds />} />
        </Route>

        {/* Redirect /dashboard to role-based dashboard */}
        <Route path="/dashboard" element={
          isAuthenticated || localStorage.getItem('user') ? (() => {
            const r = localStorage.getItem('role') || 'SUPER_ADMIN';
            const roleStr = r.toUpperCase().replace(' ', '_');
            const roleMap = {
                'SUPER_ADMIN': 'super-admin',
                'ADMIN': 'admin',
                'MANAGER': 'manager',
                'TEAM_LEADER': 'team-leader',
                'CUSTOMER_SUPPORT': 'support',
                'COUNSELOR': 'counselor'
            };
            const rolePath = roleMap[roleStr] || 'user';
            return <Navigate to={`/${rolePath}/dashboard`} replace />;
          })() : <Navigate to="/login" replace />
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
      </Router>
    </QueryClientProvider>
  )
}

export default App
