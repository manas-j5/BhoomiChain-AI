import { Menu, Bell, Search, Globe } from 'lucide-react'

const Navbar = ({ onToggleSidebar, sidebarOpen }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-dark-950/80 backdrop-blur-lg sticky top-0 z-40">
      {/* Left: toggle + brand */}
      <div className="flex items-center gap-4">
        <button
          id="sidebar-toggle"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-dark-400 hover:text-white"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center glow-sm">
            <Globe size={16} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-sm">BhoomiChain</span>
            <span className="text-brand-400 font-bold text-sm"> AI</span>
          </div>
        </div>
      </div>

      {/* Center: search bar */}
      <div className="hidden md:flex items-center gap-2 glass rounded-xl px-4 py-2 w-80">
        <Search size={16} className="text-dark-500 shrink-0" />
        <input
          id="global-search"
          type="text"
          placeholder="Search cases, districts, plaintiffs…"
          className="bg-transparent outline-none text-sm text-dark-200 placeholder-dark-500 w-full"
        />
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        <button
          id="notifications-btn"
          className="relative p-2 rounded-lg hover:bg-white/10 transition-colors text-dark-400 hover:text-white"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full glow-sm"></span>
        </button>
        <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 cursor-pointer hover:bg-white/10 transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
            TL
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-white leading-none">Team Lead</p>
            <p className="text-xs text-dark-500">BhoomiChain AI</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
