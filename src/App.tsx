import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { AppShell } from '@/components/layout/AppShell'
import LandingPage from '@/pages/marketing/LandingPage'
import BokrijkVakantiewoningPage from '@/pages/marketing/BokrijkVakantiewoningPage'
import LoginPage from '@/pages/auth/LoginPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import OnboardingPage from '@/pages/onboarding/OnboardingPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import ProjectsPage from '@/pages/projects/ProjectsPage'
import ProjectDetailPage from '@/pages/projects/ProjectDetailPage'
import ClientsPage from '@/pages/clients/ClientsPage'
import ClientDetailPage from '@/pages/clients/ClientDetailPage'
import SubcontractorsPage from '@/pages/subcontractors/SubcontractorsPage'
import SubcontractorDetailPage from '@/pages/subcontractors/SubcontractorDetailPage'
import ContractsPage from '@/pages/contracts/ContractsPage'
import ContractWizardPage from '@/pages/contracts/ContractWizardPage'
import ContractDetailPage from '@/pages/contracts/ContractDetailPage'
import TasksPage from '@/pages/tasks/TasksPage'
import PlanningPage from '@/pages/planning/PlanningPage'
import ReportsPage from '@/pages/reports/ReportsPage'
import SettingsPage from '@/pages/settings/SettingsPage'
import InvoicesPage from '@/pages/invoices/InvoicesPage'
import InvoiceFormPage from '@/pages/invoices/InvoiceFormPage'
import InvoiceDetailPage from '@/pages/invoices/InvoiceDetailPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function AppRoutes() {
  return (
    <Routes>
      {/* Marketing */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/vakantiewoning-bokrijk" element={<BokrijkVakantiewoningPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/wachtwoord-vergeten" element={<ForgotPasswordPage />} />

      {/* Onboarding */}
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* App (with shell) */}
      <Route path="/dashboard" element={<AppShell><DashboardPage /></AppShell>} />
      <Route path="/projecten" element={<AppShell><ProjectsPage /></AppShell>} />
      <Route path="/projecten/:id" element={<AppShell><ProjectDetailPage /></AppShell>} />
      <Route path="/klanten" element={<AppShell><ClientsPage /></AppShell>} />
      <Route path="/klanten/:id" element={<AppShell><ClientDetailPage /></AppShell>} />
      <Route path="/onderaannemers" element={<AppShell><SubcontractorsPage /></AppShell>} />
      <Route path="/onderaannemers/:id" element={<AppShell><SubcontractorDetailPage /></AppShell>} />
      <Route path="/contracten" element={<AppShell><ContractsPage /></AppShell>} />
      <Route path="/contracten/nieuw" element={<AppShell><ContractWizardPage /></AppShell>} />
      <Route path="/contracten/:id" element={<AppShell><ContractDetailPage /></AppShell>} />
      <Route path="/facturen" element={<AppShell><InvoicesPage /></AppShell>} />
      <Route path="/facturen/nieuw" element={<AppShell><InvoiceFormPage /></AppShell>} />
      <Route path="/facturen/:id" element={<AppShell><InvoiceDetailPage /></AppShell>} />

      {/* Placeholder routes */}
      <Route path="/planning" element={<AppShell><PlanningPage /></AppShell>} />
      <Route path="/taken" element={<AppShell><TasksPage /></AppShell>} />
      <Route path="/rapporten" element={<AppShell><ReportsPage /></AppShell>} />
      <Route path="/instellingen" element={<AppShell><SettingsPage /></AppShell>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster richColors position="top-right" />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
