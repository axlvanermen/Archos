import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { AppShell } from '@/components/layout/AppShell'
import LandingPage from '@/pages/marketing/LandingPage'
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

      {/* Placeholder routes */}
      <Route path="/planning" element={<AppShell><div className="p-8 text-slate-500">Planning — binnenkort beschikbaar</div></AppShell>} />
      <Route path="/taken" element={<AppShell><div className="p-8 text-slate-500">Taken — binnenkort beschikbaar</div></AppShell>} />
      <Route path="/rapporten" element={<AppShell><div className="p-8 text-slate-500">Rapporten — binnenkort beschikbaar</div></AppShell>} />
      <Route path="/instellingen" element={<AppShell><div className="p-8 text-slate-500">Instellingen — binnenkort beschikbaar</div></AppShell>} />

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
