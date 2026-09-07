import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Globe, Users, Shield, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const DEMO_USERS = {
  user: { name: 'Priya Researcher', email: 'researcher@demo.in', role: 'RESEARCHER', portal: 'user', initials: 'PR' },
  gov:  { name: 'IAS Suresh Kumar', email: 'officer@gov.in', role: 'REVENUE_OFFICER', portal: 'gov', initials: 'SK' },
}

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [portal, setPortal] = useState('user')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    // Simulate auth delay
    await new Promise(r => setTimeout(r, 800))
    const demo = DEMO_USERS[portal]
    if ((email === demo.email && password === 'demo123') || (email === '' && password === '')) {
      login({ ...demo })
      navigate(portal === 'gov' ? '/gov/dashboard' : '/user/dashboard')
    } else {
      setError('Invalid credentials. Use demo credentials below or leave blank.')
    }
    setLoading(false)
  }

  const quickEnter = () => {
    login(DEMO_USERS[portal])
    navigate(portal === 'gov' ? '/gov/dashboard' : '/user/dashboard')
  }

  const isGov = portal === 'gov'

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse-slow transition-colors duration-700 ${isGov ? 'bg-amber-600/10' : 'bg-brand-600/12'}`} />
        <div className={`absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full blur-[100px] animate-pulse-slow transition-colors duration-700 ${isGov ? 'bg-orange-600/8' : 'bg-cyan-600/8'}`} style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <button onClick={() => navigate('/')} className="inline-flex items-center gap-2.5 mb-5 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center glow-sm">
              <Globe size={18} className="text-white" />
            </div>
            <span className="font-extrabold text-white text-lg">BhoomiChain<span className="text-brand-400"> AI</span></span>
          </button>
          <p className="text-dark-500 text-sm">Sign in to your portal</p>
        </div>

        {/* Portal Toggle */}
        <div className="flex glass rounded-xl p-1 mb-6">
          <button
            id="toggle-user-portal"
            onClick={() => setPortal('user')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              !isGov ? 'bg-brand-600/20 border border-brand-500/30 text-brand-300' : 'text-dark-500 hover:text-dark-300'
            }`}
          >
            <Users size={15} /> User Portal
          </button>
          <button
            id="toggle-gov-portal"
            onClick={() => setPortal('gov')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              isGov ? 'bg-amber-600/20 border border-amber-500/30 text-amber-300' : 'text-dark-500 hover:text-dark-300'
            }`}
          >
            <Shield size={15} /> Government
          </button>
        </div>

        {/* Card */}
        <div className={`card border transition-colors duration-500 ${isGov ? 'border-amber-500/20' : 'border-brand-500/20'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isGov ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-brand-500 to-cyan-500'}`}>
              {isGov ? <Shield size={18} className="text-white" /> : <Users size={18} className="text-white" />}
            </div>
            <div>
              <p className="text-white font-bold text-sm">{isGov ? 'Government Portal' : 'User Portal'}</p>
              <p className="text-dark-500 text-xs">{isGov ? 'Secure official access' : 'Research & Discovery'}</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-dark-400 font-medium mb-1.5">Email Address</label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={DEMO_USERS[portal].email}
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-dark-400 font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="password-input"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="demo123"
                  className="input-field text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-95 disabled:opacity-60 ${
                isGov
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500'
                  : 'bg-gradient-to-r from-brand-500 to-cyan-500 hover:from-brand-400 hover:to-cyan-400'
              }`}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative text-center"><span className="text-dark-600 text-xs bg-dark-900 px-3">or</span></div>
          </div>

          <button
            id="demo-enter-btn"
            onClick={quickEnter}
            className="w-full flex items-center justify-center gap-2 py-2.5 glass glass-hover rounded-xl text-sm font-semibold text-dark-300 hover:text-white transition-all"
          >
            <Sparkles size={14} className={isGov ? 'text-amber-400' : 'text-brand-400'} />
            Enter Demo (No Login Required)
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-4 card text-xs text-dark-500 space-y-1">
          <p className="text-dark-400 font-semibold mb-1">Demo Credentials:</p>
          <p>Email: <span className="text-brand-400 font-mono">{DEMO_USERS[portal].email}</span></p>
          <p>Password: <span className="text-brand-400 font-mono">demo123</span></p>
        </div>
      </div>
    </div>
  )
}

export default Login
