import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { OfflineBanner } from '@/components/ui/OfflineBanner'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="md:ml-64 min-h-screen pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />

      <OfflineBanner />
    </div>
  )
}
