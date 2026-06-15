import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import LandingPage from '@/pages/marketing/LandingPage'
import LoginPage from '@/pages/auth/LoginPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import OnboardingPage from '@/pages/onboarding/OnboardingPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Marketing */}
              <Route path="/" element={<LandingPage />} />

              {/* Auth */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/wachtwoord-vergeten" element={<ForgotPasswordPage />} />

              {/* Onboarding */}
              <Route path="/onboarding" element={<OnboardingPage />} />

              {/* App — placeholder until AppShell is built */}
              <Route path="/dashboard" element={<div className="p-8 text-2xl font-semibold">Dashboard wordt geladen…</div>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster richColors position="top-right" />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
