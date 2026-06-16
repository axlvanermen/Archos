import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, CheckSquare, Calendar, Menu, X, Building2, HardHat, FileSignature, Receipt, BarChart2, Settings, LogOut } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const primaryItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Projecten', icon: FolderKanban, to: '/projecten' },
  { label: 'Taken', icon: CheckSquare, to: '/taken' },
  { label: 'Planning', icon: Calendar, to: '/planning' },
]

const menuItems = [
  { label: 'Klanten', icon: Building2, to: '/klanten' },
  { label: 'Onderaannemers', icon: HardHat, to: '/onderaannemers' },
  { label: 'Contracten', icon: FileSignature, to: '/contracten' },
  { label: 'Facturen', icon: Receipt, to: '/facturen' },
  { label: 'Rapporten', icon: BarChart2, to: '/rapporten' },
  { label: 'Instellingen', icon: Settings, to: '/instellingen' },
]

export function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (to: string) => location.pathname.startsWith(to)

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 md:hidden">
        <div className="flex items-stretch h-16">
          {primaryItems.map(({ label, icon: Icon, to }) => (
            <button
              key={to}
              onClick={() => { navigate(to); setMenuOpen(false) }}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors cursor-pointer',
                isActive(to)
                  ? 'text-[#C4943A]'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              <Icon size={22} strokeWidth={isActive(to) ? 2.5 : 1.75} />
              <span>{label}</span>
            </button>
          ))}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors cursor-pointer',
              menuOpen ? 'text-[#C4943A]' : 'text-slate-500 hover:text-slate-800'
            )}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} strokeWidth={1.75} />}
            <span>Menu</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-30 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed bottom-16 left-0 right-0 z-40 bg-white rounded-t-2xl shadow-xl md:hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="p-4 pt-3">
                <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
                <div className="grid grid-cols-2 gap-2">
                  {menuItems.map(({ label, icon: Icon, to }) => (
                    <button
                      key={to}
                      onClick={() => { navigate(to); setMenuOpen(false) }}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer',
                        isActive(to)
                          ? 'bg-[#0F172A] text-[#C4943A]'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      )}
                    >
                      <Icon size={18} />
                      {label}
                    </button>
                  ))}
                </div>
                <button className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer">
                  <LogOut size={18} />
                  Afmelden
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
