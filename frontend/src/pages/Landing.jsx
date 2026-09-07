import { useNavigate } from 'react-router-dom'
import {
  Globe, Shield, Users, ArrowRight, Sparkles, Map,
  Brain, Lock, Database, BarChart3, FileSearch, Upload,
} from 'lucide-react'

const FEATURES = [
  { icon: Brain,    title: 'RAG-Powered AI',    desc: 'Evidence-backed answers with source citations and document references.', color: 'text-brand-400', glow: 'from-brand-600/20' },
  { icon: Map,      title: 'GIS Intelligence',  desc: 'PostGIS spatial analysis, parcel mapping and district overlays.', color: 'text-cyan-400', glow: 'from-cyan-600/20' },
  { icon: Lock,     title: 'RBAC Security',     desc: 'Role-based access control with KYC-ready identity layer.', color: 'text-violet-400', glow: 'from-violet-600/20' },
  { icon: Shield,   title: 'Blockchain Proof',  desc: 'Optional SHA-256 hash anchoring for document provenance.', color: 'text-amber-400', glow: 'from-amber-600/20' },
]

const STATS = [
  { value: '22+', label: 'Live Cases' },
  { value: '10', label: 'Districts' },
  { value: '5', label: 'AI Modules' },
  { value: '∞', label: 'Evidence Links' },
]

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-dark-950 overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/8 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-3/4 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center glow-sm">
            <Globe size={18} className="text-white" />
          </div>
          <span className="font-extrabold text-white text-base tracking-tight">BhoomiChain<span className="text-brand-400"> AI</span></span>
          <span className="hidden sm:inline ml-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-600/20 border border-brand-500/30 text-brand-300 tracking-widest">SIH 2026</span>
        </div>
        <button id="nav-signin-btn" onClick={() => navigate('/login')} className="btn-secondary text-sm px-5 py-2">
          Sign In
        </button>
      </header>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-500/30 text-xs text-brand-300 font-semibold mb-8 animate-fade-in">
          <Sparkles size={12} />
          Smart India Hackathon 2026 — Land Governance Intelligence Platform
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight animate-slide-up">
          Land Dispute Intelligence
          <br />
          <span className="text-gradient">for Bharat</span>
        </h1>

        {/* Subtitle */}
        <p className="text-dark-400 text-lg md:text-xl max-w-2xl mx-auto mb-14 leading-relaxed">
          AI-powered research and decision-support platform for land governance, dispute resolution, and evidence-backed policy insights across Jharkhand.
        </p>

        {/* Portal cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto mb-16">
          {/* User Portal */}
          <div
            id="enter-user-portal"
            onClick={() => navigate('/user/dashboard')}
            className="group relative card text-left overflow-hidden border-brand-500/20 hover:border-brand-500/60 cursor-pointer transition-all duration-300 hover:-translate-y-1"
            style={{ transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow='0 20px 60px rgba(76,110,245,0.2)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow='none'}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center mb-5 glow">
                <Users size={24} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">User Portal</h2>
              <p className="text-dark-400 text-sm mb-5 leading-relaxed">
                Discover, search and research land disputes. AI-powered evidence analysis, interactive GIS maps, and a full research workspace.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Case Search', 'GIS Explorer', 'AI Assistant', 'Research Workspace', 'Reports'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-full text-xs bg-brand-600/15 text-brand-300 border border-brand-500/20">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-brand-400 text-sm font-bold group-hover:gap-3 transition-all">
                Enter as Researcher <ArrowRight size={16} />
              </div>
            </div>
          </div>

          {/* Government Portal */}
          <div
            id="enter-gov-portal"
            onClick={() => navigate('/gov/dashboard')}
            className="group relative card text-left overflow-hidden border-amber-500/20 hover:border-amber-500/60 cursor-pointer transition-all duration-300 hover:-translate-y-1"
            style={{ transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow='0 20px 60px rgba(245,158,11,0.2)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow='none'}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-5" style={{ boxShadow: '0 0 25px rgba(245,158,11,0.35)' }}>
                <Shield size={24} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Government Portal</h2>
              <p className="text-dark-400 text-sm mb-5 leading-relaxed">
                Secure intelligence for revenue officers and policy makers. Case analytics, trend prediction, policy simulation, and administration.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Case Intelligence', 'Policy Lab', 'Predictive Analytics', 'Data Upload', 'Administration'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-full text-xs bg-amber-600/15 text-amber-300 border border-amber-500/20">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-amber-400 text-sm font-bold group-hover:gap-3 transition-all">
                Enter as Official <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-4 max-w-xl mx-auto mb-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-extrabold text-gradient">{value}</p>
              <p className="text-dark-500 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 pb-24">
        <p className="text-center text-dark-600 text-xs uppercase tracking-widest font-semibold mb-6">Platform Capabilities</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc, color, glow }) => (
            <div key={title} className={`card group relative overflow-hidden hover:border-white/20 transition-all duration-300`}>
              <div className={`absolute inset-0 bg-gradient-to-b ${glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative">
                <Icon size={26} className={`${color} mb-3`} />
                <p className="text-white font-bold text-sm mb-1">{title}</p>
                <p className="text-dark-500 text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 text-center pb-10 border-t border-white/5 pt-6">
        <p className="text-dark-700 text-xs">BhoomiChain AI · Smart India Hackathon 2026 · Built for transparent land governance in Jharkhand</p>
      </footer>
    </div>
  )
}

export default Landing
