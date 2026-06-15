import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  Building2,
  HardHat,
  Calendar,
  CheckSquare,
  BarChart2,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  icon: React.ReactNode
  to: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, to: '/dashboard' },
  { label: 'Projecten', icon: <FolderKanban size={18} />, to: '/projecten' },
  { label: 'Klanten', icon: <Building2 size={18} />, to: '/klanten' },
  { label: 'Onderaannemers', icon: <HardHat size={18} />, to: '/onderaannemers' },
  { label: 'Planning', icon: <Calendar size={18} />, to: '/planning' },
  { label: 'Taken', icon: <CheckSquare size={18} />, to: '/taken' },
  { label: 'Rapporten', icon: <BarChart2 size={18} />, to: '/rapporten' },
  { label: 'Instellingen', icon: <Settings size={18} />, to: '/instellingen' },
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Mock user — will be replaced with AuthContext later
const mockUser = {
  name: 'Jan Peeters',
  role: 'Projectleider',
}

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (to: string) =>
    to === '/dashboard'
      ? location.pathname === to
      : location.pathname.startsWith(to)

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 z-30">
      {/* Logo */}
      <div className="flex items-center h-16 px-5 border-b border-slate-100 flex-shrink-0">
        <img
          src="/logo.png"
          alt="Archos"
          className="h-10 w-auto object-contain"
          onError={(e) => {
            // Fallback to text logo if image missing
            const target = e.currentTarget
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent && !parent.querySelector('.logo-fallback')) {
              const fallback = document.createElement('span')
              fallback.className = 'logo-fallback text-xl font-bold tracking-tight'
              fallback.style.color = 'var(--color-primary)'
              fallback.textContent = 'Archos'
              parent.appendChild(fallback)
            }
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Hoofdnavigatie">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.to)
            return (
              <li key={item.to}>
                <button
                  onClick={() => navigate(item.to)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer relative',
                    active
                      ? 'bg-slate-50 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800',
                  )}
                >
                  {/* Gold left border for active */}
                  {active && (
                    <span
                      className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--color-accent)' }}
                    />
                  )}
                  <span
                    className={cn(
                      'flex-shrink-0 transition-colors duration-150',
                      active ? '' : 'text-slate-400',
                    )}
                    style={active ? { color: 'var(--color-accent)' } : undefined}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User footer */}
      <div className="flex-shrink-0 border-t border-slate-100 p-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
            style={{ backgroundColor: 'var(--color-accent)' }}
            aria-hidden="true"
          >
            {getInitials(mockUser.name)}
          </div>

          {/* Name + role */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{mockUser.name}</p>
            <p className="text-xs text-slate-500 truncate">{mockUser.role}</p>
          </div>

          {/* Logout */}
          <button
            onClick={() => navigate('/login')}
            aria-label="Uitloggen"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-150 cursor-pointer flex-shrink-0"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
