import { useState, useRef } from 'react'
import { Globe, Loader2, Upload, RefreshCw, X, Palette } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

interface Props {
  onNext: () => void
  onBack: () => void
}

interface ColorSwatch {
  color: string
  label: string
}

const MOCK_SCAN_RESULTS: ColorSwatch[] = [
  { color: '#1a3c5e', label: 'Primair' },
  { color: '#2d6a4f', label: 'Secondair' },
  { color: '#e07b39', label: 'Accent' },
]

export default function StepBranding({ onNext, onBack }: Props) {
  const { applyTheme, theme } = useTheme()

  const [websiteUrl, setWebsiteUrl] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [scanDone, setScanDone] = useState(false)
  const [scannedColors, setScannedColors] = useState<ColorSwatch[]>([])

  const [primary, setPrimary] = useState(theme.primary)
  const [secondary, setSecondary] = useState(theme.secondary)
  const [accent, setAccent] = useState(theme.accent)

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleScan = async () => {
    if (!websiteUrl.trim()) return
    setIsScanning(true)
    setScanDone(false)

    // Simulate a website scan (mock)
    await new Promise((r) => setTimeout(r, 1800))

    setScannedColors(MOCK_SCAN_RESULTS)
    setScanDone(true)
    setIsScanning(false)
  }

  const applyScannedColor = (color: string, index: number) => {
    if (index === 0) setPrimary(color)
    else if (index === 1) setSecondary(color)
    else if (index === 2) setAccent(color)
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleConfirm = () => {
    applyTheme({
      primary,
      secondary,
      accent,
      logoUrl: logoPreview ?? undefined,
    })
    onNext()
  }

  const colorFields = [
    { label: 'Primaire kleur', value: primary, onChange: setPrimary, hint: 'Hoofdkleur voor tekst en navigatie' },
    { label: 'Secondaire kleur', value: secondary, onChange: setSecondary, hint: 'Achtergronden en subtiele elementen' },
    { label: 'Accentkleur', value: accent, onChange: setAccent, hint: 'Knoppen en highlights' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>
          Branding &amp; stijl
        </h2>
        <p className="text-sm text-slate-500">
          Personaliseer Archos met de kleuren en het logo van uw bedrijf.
        </p>
      </div>

      {/* Website scan */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
          <span className="text-sm font-semibold text-slate-700">Website scannen</span>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Voer uw websiteadres in en we detecteren automatisch uw huisstijlkleuren.
        </p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://www.uwbedrijf.be"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-white outline-none
                focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-opacity-20 transition-all"
              disabled={isScanning}
            />
          </div>
          <button
            type="button"
            onClick={handleScan}
            disabled={isScanning || !websiteUrl.trim()}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg text-white
              transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ background: 'var(--color-accent)' }}
          >
            {isScanning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Scannen...
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                Scan
              </>
            )}
          </button>
        </div>

        {/* Scan results */}
        {scanDone && scannedColors.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-600 mb-2">Gevonden kleuren — klik om toe te passen:</p>
            <div className="flex gap-3">
              {scannedColors.map((swatch, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyScannedColor(swatch.color, i)}
                  className="flex flex-col items-center gap-1.5 group"
                  title={`${swatch.label}: ${swatch.color}`}
                >
                  <div
                    className="w-10 h-10 rounded-lg shadow-sm border-2 border-white group-hover:scale-110 transition-transform"
                    style={{ background: swatch.color }}
                  />
                  <span className="text-xs text-slate-500 font-medium">{swatch.label}</span>
                  <span className="text-xs text-slate-400 font-mono">{swatch.color}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Manual color pickers */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
          <span className="text-sm font-semibold text-slate-700">Kleuren aanpassen</span>
        </div>
        <div className="space-y-3">
          {colorFields.map((field) => (
            <div key={field.label} className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <input
                  type="color"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5 bg-white"
                  title={field.label}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">{field.label}</span>
                  <span className="text-xs font-mono text-slate-400">{field.value}</span>
                </div>
                <p className="text-xs text-slate-400">{field.hint}</p>
              </div>
              <div
                className="flex-shrink-0 w-8 h-8 rounded-lg border border-slate-100 shadow-sm"
                style={{ background: field.value }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Preview strip */}
      <div
        className="rounded-xl p-4 flex items-center gap-3"
        style={{ background: primary }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: accent }}
        >
          {logoPreview ? (
            <img src={logoPreview} alt="Logo" className="w-6 h-6 object-contain" />
          ) : (
            <span className="text-white text-xs font-bold">A</span>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Archos — Uw bedrijf</p>
          <p className="text-xs" style={{ color: secondary }}>Voorvertoning van uw huisstijl</p>
        </div>
        <div className="ml-auto">
          <button
            type="button"
            className="px-3 py-1.5 text-xs font-semibold rounded-md transition-all"
            style={{ background: accent, color: 'white' }}
          >
            Knop
          </button>
        </div>
      </div>

      {/* Logo upload */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Upload className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
          <span className="text-sm font-semibold text-slate-700">Logo uploaden</span>
          <span className="text-xs text-slate-400">(optioneel)</span>
        </div>

        {logoPreview ? (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl border border-slate-200 bg-white flex items-center justify-center p-2">
              <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-700 truncate">{logoFile?.name}</p>
              <p className="text-xs text-slate-400">{logoFile ? `${(logoFile.size / 1024).toFixed(1)} KB` : ''}</p>
            </div>
            <button
              type="button"
              onClick={() => { setLogoPreview(null); setLogoFile(null) }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed border-slate-200
              hover:border-[var(--color-accent)] hover:bg-amber-50 transition-all group"
          >
            <Upload className="w-6 h-6 text-slate-300 group-hover:text-[var(--color-accent)] transition-colors" />
            <div className="text-center">
              <p className="text-sm font-medium text-slate-500">Klik om een logo te uploaden</p>
              <p className="text-xs text-slate-400">PNG, SVG, JPG — max. 2 MB</p>
            </div>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          onChange={handleLogoChange}
          className="hidden"
        />
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold border border-slate-200 text-slate-600
            hover:bg-slate-50 transition-all"
        >
          Terug
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold text-white
            hover:opacity-90 active:scale-[0.98] transition-all"
          style={{ background: 'var(--color-primary)' }}
        >
          Bevestigen &amp; doorgaan
        </button>
      </div>
    </div>
  )
}
