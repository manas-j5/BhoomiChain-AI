import { useState, useEffect } from 'react'
import { Menu, Bell, Search, Globe, Sun, Moon, Sparkles } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const Navbar = ({ onToggleSidebar, sidebarOpen }) => {
  const { isDarkMode, toggleTheme } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-dark-200 dark:border-white/10 bg-white/80 dark:bg-dark-950/80 backdrop-blur-lg sticky top-0 z-40">
      {/* Left: toggle + brand */}
      <div className="flex items-center gap-4">
        <button
          id="sidebar-toggle"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-white/10 transition-colors text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center glow-sm">
            <Globe size={16} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-dark-900 dark:text-white text-sm">BhoomiChain</span>
            <span className="text-brand-600 dark:text-brand-400 font-bold text-sm"> AI</span>
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
          className="bg-transparent outline-none text-sm text-dark-900 dark:text-dark-200 placeholder-dark-400 dark:placeholder-dark-500 w-full"
        />
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-white/10 transition-colors text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Chatbot Icon */}
        <button
          onClick={() => window.location.href='/ai-chat'}
          className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-white/10 transition-colors text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
          aria-label="AI Assistant"
        >
          <Sparkles size={20} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            id="notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-lg transition-colors ${showNotifications ? 'bg-dark-100 dark:bg-white/10 text-dark-900 dark:text-white' : 'hover:bg-dark-100 dark:hover:bg-white/10 text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white'}`}
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full glow-sm"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-900 rounded-xl shadow-xl border border-dark-200 dark:border-white/10 overflow-hidden z-50 animate-slide-up">
              <div className="flex items-center justify-between px-4 py-3 border-b border-dark-100 dark:border-white/10 bg-dark-50 dark:bg-dark-950">
                <h3 className="font-bold text-sm text-dark-900 dark:text-white">Notifications</h3>
                <button className="text-xs text-brand-600 dark:text-brand-400 hover:underline">Mark all as read</button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                <div className="p-4 border-b border-dark-100 dark:border-white/5 hover:bg-dark-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                  <p className="text-sm text-dark-900 dark:text-white font-medium mb-1">New Hearing Scheduled</p>
                  <p className="text-xs text-dark-600 dark:text-dark-400 mb-2">Original Suit No. 1 of 1989 hearing is set for tomorrow at 10:00 AM.</p>
                  <p className="text-[10px] text-brand-600 dark:text-brand-400 font-bold">2 hours ago</p>
                </div>
                <div className="p-4 hover:bg-dark-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                  <p className="text-sm text-dark-900 dark:text-white font-medium mb-1">Document Verified</p>
                  <p className="text-xs text-dark-600 dark:text-dark-400 mb-2">Your uploaded Government ID has been verified by the AI.</p>
                  <p className="text-[10px] text-brand-600 dark:text-brand-400 font-bold">5 hours ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 cursor-pointer ml-1">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
            TL
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-dark-900 dark:text-white leading-none">Team Lead</p>
            <p className="text-xs text-dark-600 dark:text-dark-500">BhoomiChain AI</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
