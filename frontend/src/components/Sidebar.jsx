import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  Map,
  MessageSquareText,
  BarChart3,
  Shield,
  ChevronRight,
  Cpu,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/cases', icon: Search, label: 'Case Search' },
  { to: '/map', icon: Map, label: 'GIS Map' },
  { to: '/ai-chat', icon: MessageSquareText, label: 'AI Assistant' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
]

const Sidebar = ({ open }) => {
  return (
    <aside
      className={`
        flex flex-col bg-dark-950 border-r border-white/10 transition-all duration-300 shrink-0
        ${open ? 'w-64' : 'w-0 overflow-hidden'}
      `}
    >
      <div className="flex flex-col h-full p-4 min-w-[256px]">
        {/* Module label */}
        <div className="px-4 mb-2 mt-2">
          <p className="text-xs font-semibold text-dark-600 uppercase tracking-widest">Navigation</p>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 flex-1">
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
              <span className="flex-1">{label}</span>
              <ChevronRight size={14} className="opacity-40" />
            </NavLink>
          ))}
        </nav>

        {/* Bottom: system status */}
        <div className="mt-4 card">
          <div className="flex items-center gap-2 mb-3">
            <Cpu size={14} className="text-brand-400" />
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

        {/* SIH badge */}
        <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-600/10 border border-brand-500/20">
          <Shield size={14} className="text-brand-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-brand-300">SIH 2026</p>
            <p className="text-xs text-dark-500">Team Project</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
