import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileSearch, Map, Brain, BarChart3,
  FlaskConical, Upload, Settings, ChevronRight, Shield,
  Menu, Bell, Globe, LogOut, Cpu,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const GOV_NAV = [
  { to: '/gov/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/gov/cases', icon: FileSearch, label: 'Case Intelligence' },
  { to: '/gov/map', icon: Map, label: 'GIS Intelligence' },
  { to: '/gov/ai-chat', icon: Brain, label: 'AI Intelligence' },
  { to: '/gov/reports', icon: BarChart3, label: 'Analytics' },
  { to: '/gov/policy-lab', icon: FlaskConical, label: 'Policy Lab' },
  { to: '/gov/upload', icon: Upload, label: 'Data Upload' },
  { to: '/gov/admin', icon: Settings, label: 'Administration' },
]

const GovSidebar = ({ open }) => (
  <aside className={`flex flex-col bg-dark-950 border-r border-white/10 shrink-0 transition-all duration-300 ${open ? 'w-64' : 'w-0 overflow-hidden'}`}>
    <div className="flex flex-col h-full p-4 min-w-[256px]">
      <div className="px-4 mb-2 mt-2">
        <p className="text-xs font-semibold text-dark-600 uppercase tracking-widest">Government Portal</p>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {GOV_NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            id={`gov-nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-amber-600/20 border border-amber-500/30 text-amber-300'
                : 'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-dark-400 hover:text-white hover:bg-white/10 transition-all duration-200'
            }
          >
            <Icon size={18} />
            <span className="flex-1">{label}</span>
            <ChevronRight size={14} className="opacity-40" />
          </NavLink>
        ))}
      </nav>

      {/* System status */}
      <div className="mt-4 card">
        <div className="flex items-center gap-2 mb-3">
          <Cpu size={14} className="text-amber-400" />
          <span className="text-xs font-semibold text-dark-300">System Status</span>
        </div>
        {[
          { name: 'Backend API', status: true },
          { name: 'AI Engine', status: false },
          { name: 'GIS Engine', status: false },
          { name: 'Blockchain', status: false },
        ].map(({ name, status }) => (
          <div key={name} className="flex items-center justify-between py-1">
            <span className="text-xs text-dark-500">{name}</span>
            <span className={`w-2 h-2 rounded-full ${status ? 'bg-green-400 animate-pulse' : 'bg-dark-600'}`} />
          </div>
        ))}
      </div>

      {/* Gov badge */}
      <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-600/10 border border-amber-500/20">
        <Shield size={14} className="text-amber-400 shrink-0" />
        <div>
          <p className="text-xs font-bold text-amber-300">Govt. Portal</p>
          <p className="text-xs text-dark-500">Authorized Access</p>
        </div>
      </div>
    </div>
  </aside>
)

const GovNavbar = ({ onToggle }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-dark-950/80 backdrop-blur-lg sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button id="gov-sidebar-toggle" onClick={onToggle} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-dark-400 hover:text-white">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center" style={{ boxShadow: '0 0 12px rgba(245,158,11,0.3)' }}>
            <Globe size={16} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-sm">BhoomiChain</span>
            <span className="text-amber-400 font-bold text-sm"> GOV</span>
          </div>
        </div>
        <span className="hidden md:inline px-2 py-0.5 rounded-full text-xs font-bold bg-amber-600/20 border border-amber-500/30 text-amber-300">
          Secure Portal
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button id="gov-notifications-btn" className="relative p-2 rounded-lg hover:bg-white/10 transition-colors text-dark-400 hover:text-white">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xs font-bold text-white">
            {user?.initials || 'GO'}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-white leading-none">{user?.name || 'Government Officer'}</p>
            <p className="text-xs text-dark-500">{user?.role || 'REVENUE_OFFICER'}</p>
          </div>
        </div>
        <button id="gov-logout-btn" onClick={handleLogout} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-dark-500 hover:text-red-400" title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}

const GovLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden bg-dark-950">
      <GovSidebar open={sidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <GovNavbar onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default GovLayout
