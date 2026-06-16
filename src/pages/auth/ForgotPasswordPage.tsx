import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, AlertCircle, CheckCircle, ArrowLeft, Mail } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/auth/wachtwoord-instellen`,
        }
      )

      if (resetError) {
        setError('Er is een fout opgetreden. Controleer uw e-mailadres en probeer opnieuw.')
        return
      }

      setSent(true)
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
          <img src="/archos-mark.png" alt="Archos" className="w-14 h-14 object-contain mx-auto mb-4" />
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>
            ARCHOS
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {!sent ? (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-primary)' }}>
                  Wachtwoord vergeten?
                </h2>
                <p className="mt-1.5 text-sm text-slate-500">
                  Voer uw e-mailadres in en we sturen u een herstelmail.
                </p>
              </div>

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

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-100">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white
                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
                  style={{ background: 'var(--color-primary)' }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verzenden...
                    </>
                  ) : (
                    'Stuur herstelmail'
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success state */
            <div className="text-center py-2">
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
                style={{ background: '#f0fdf4' }}
              >
                <CheckCircle className="w-7 h-7 text-green-500" />
              </div>
              <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
                Herstelmail verzonden
              </h2>
              <p className="text-sm text-slate-500 mb-2">
                We hebben een herstelmail gestuurd naar
              </p>
              <div className="flex items-center justify-center gap-1.5 mb-5">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-700">{email}</span>
              </div>
              <p className="text-xs text-slate-400">
                Geen mail ontvangen? Controleer uw spam-map of probeer opnieuw.
              </p>
              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="mt-4 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: 'var(--color-accent)' }}
              >
                Opnieuw proberen
              </button>
            </div>
          )}
        </div>

        {/* Back to login */}
        <div className="mt-6 text-center">
          <Link
            to="/auth/aanmelden"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar aanmelden
          </Link>
        </div>
      </div>
    </div>
  )
}
