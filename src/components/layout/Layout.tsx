import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Calendar, MessageSquare, Target, BookOpen, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: ReactNode
}

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Calendar, label: 'Sessions', path: '/sessions' },
  { icon: MessageSquare, label: 'Topics', path: '/topics' },
  { icon: Target, label: 'Goals', path: '/goals' },
  { icon: BookOpen, label: 'Journal', path: '/journal' },
  { icon: User, label: 'Profile', path: '/profile' },
]

export function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-aqua-100 flex flex-col">
      {/* Desktop Header */}
      <header className="hidden md:flex sticky top-0 z-40 w-full border-b bg-gradient-to-br from-blue-100 via-purple-100 to-aqua-100 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-gray-900">Therapy Pathways</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "transition-colors hover:text-gray-700",
                  location.pathname === item.path ? "text-gray-900" : "text-gray-500"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-6 pb-24 md:pb-6">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-t px-4 py-2">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 p-2 transition-colors",
                  isActive ? "text-blue-600" : "text-gray-500"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
