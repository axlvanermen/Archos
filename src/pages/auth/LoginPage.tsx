import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Ongeldig e-mailadres of wachtwoord. Probeer het opnieuw.')
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Bevestig eerst uw e-mailadres via de link in uw inbox.')
        } else {
          setError('Er is een fout opgetreden. Probeer het later opnieuw.')
        }
        return
      }

      navigate('/dashboard')
    } catch {
      setError('Er is een onverwachte fout opgetreden.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4">
      {/* Background subtle pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'var(--color-accent)' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'var(--color-primary)' }}
        />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo & brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'var(--color-primary)' }}>
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>
            Archos
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            Het digitale zenuwcentrum van uw bouwbedrijf
          </p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--color-primary)' }}>
            Aanmelden
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                E-mailadres
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="naam@bedrijf.be"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400
                  transition-all outline-none
                  focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-opacity-20"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Wachtwoord
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400
                    transition-all outline-none
                    focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-opacity-20"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-100">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:opacity-90 active:scale-[0.98]"
              style={{ background: isLoading || !email || !password ? 'var(--color-secondary)' : 'var(--color-primary)' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Aanmelden...
                </>
              ) : (
                'Aanmelden'
              )}
            </button>
          </form>

          {/* Forgot password */}
          <div className="mt-5 text-center">
            <Link
              to="/auth/wachtwoord-vergeten"
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: 'var(--color-accent)' }}
            >
              Wachtwoord vergeten?
            </Link>
          </div>
        </div>

        {/* Register link */}
        <p className="text-center mt-6 text-sm text-slate-500">
          Nog geen account?{' '}
          <Link
            to="/onboarding"
            className="font-semibold transition-colors hover:opacity-80"
            style={{ color: 'var(--color-accent)' }}
          >
            Registreer uw bedrijf
          </Link>
        </p>
      </div>
    </div>
  )
}
