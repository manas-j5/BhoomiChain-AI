import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  Map,
  MessageSquareText,
  BarChart3,
  Shield,
  ChevronRight,
  LogOut,
  UserCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/cases', icon: Search, label: 'Case Search' },
  { to: '/map', icon: Map, label: 'GIS Map' },
  { to: '/ai-chat', icon: MessageSquareText, label: 'AI Assistant' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
]

const Sidebar = ({ open }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside
      className={`
        flex flex-col bg-dark-50 dark:bg-dark-950 border-r border-dark-200 dark:border-white/10 transition-all duration-300 shrink-0
        ${open ? 'w-64' : 'w-0 overflow-hidden'}
      `}
    >
      <div className="flex flex-col h-full min-w-[256px]">
        {/* Logo Section */}
        <div 
          className="px-6 h-16 flex items-center gap-3 cursor-pointer border-b border-dark-200 dark:border-white/5 bg-white dark:bg-transparent" 
          onClick={() => navigate('/dashboard')}
        >
          <img src="/logo.png" alt="BhoomiChain Logo" className="h-8 w-auto object-contain drop-shadow-sm" />
          <span className="font-bold text-lg text-dark-900 dark:text-white tracking-tight">
            Bhoomi<span className="text-brand-600 dark:text-brand-400">Chain</span> <span className="text-xs font-semibold text-brand-500 bg-brand-50 dark:bg-brand-500/10 px-1.5 py-0.5 rounded ml-1">AI</span>
          </span>
        </div>

        {/* Module label */}
        <div className="px-6 py-4 mt-2">
          <p className="text-xs font-bold text-dark-800 dark:text-dark-500 uppercase tracking-widest">Navigation</p>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-2 flex-1 px-4">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              id={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
              className={({ isActive }) =>
                isActive ? 'sidebar-link-active' : 'sidebar-link'
              }
            >
              <Icon size={18} />
              <span className="flex-1 font-medium">{label}</span>
              <ChevronRight size={14} className="opacity-40" />
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Footer */}
        <div className="p-4 mt-auto border-t border-dark-200 dark:border-white/5">
          {user && (
            <div className="flex items-center gap-3 px-2 py-3 mb-2 rounded-xl bg-dark-100 dark:bg-white/5 border border-dark-200 dark:border-white/10">
              <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
                <UserCircle size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-dark-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-dark-500 dark:text-dark-400 capitalize truncate">
                  {user.role} {user.role === 'official' && `- ${user.department}`}
                </p>
              </div>
            </div>
          )}
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
