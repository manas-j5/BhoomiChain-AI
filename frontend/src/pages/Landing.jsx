import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Fingerprint, Upload, User, ArrowRight, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Landing = () => {
  const [loginStep, setLoginStep] = useState('select') // 'select', 'citizen-processing', 'official-upload', 'official-processing'
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleCitizenLogin = () => {
    setLoginStep('citizen-processing')
    // Simulate API delay for DigiLocker verification
    setTimeout(() => {
      login({
        id: 'user_123',
        name: 'Rahul Kumar',
        role: 'citizen',
        kycStatus: 'Verified',
        aadhaarLast4: '4321',
      })
      navigate('/dashboard')
    }, 2000)
  }

  const handleOfficialUpload = () => {
    setLoginStep('official-processing')
    // Simulate ID verification AI model processing
    setTimeout(() => {
      login({
        id: 'gov_890',
        name: 'Officer A. Sharma',
        role: 'official',
        department: 'Revenue Dept.',
        district: 'Ranchi',
      })
      navigate('/dashboard')
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex flex-col items-center justify-center p-6 transition-colors duration-300">
      
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl w-full z-10 animate-fade-in text-center">
        {/* Logo and Hero */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Shield size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-dark-900 dark:text-white tracking-tight">
              Bhoomi<span className="text-brand-600 dark:text-brand-400">Chain</span> AI
            </h1>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-dark-900 dark:text-white mb-4 leading-tight">
            Next-Gen Land Governance <br />
            <span className="text-gradient">Intelligence Platform</span>
          </h2>
          <p className="text-dark-600 dark:text-dark-400 text-lg max-w-2xl mx-auto">
            Secure, transparent, and AI-driven resolution of land disputes. Please verify your identity to access the portal.
          </p>
        </div>

        {/* Login Selection */}
        {loginStep === 'select' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Citizen Card */}
            <div className="card glass-hover flex flex-col items-center text-center p-8 group border border-dark-200 dark:border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Fingerprint size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">Citizen Portal</h3>
              <p className="text-dark-600 dark:text-dark-400 text-sm mb-8 flex-1">
                Access your case statuses and file new disputes seamlessly using DigiLocker.
              </p>
              <button onClick={handleCitizenLogin} className="btn-primary w-full flex items-center justify-center gap-2">
                Login via DigiLocker KYC <ArrowRight size={18} />
              </button>
            </div>

            {/* Official Card */}
            <div className="card glass-hover flex flex-col items-center text-center p-8 group border border-dark-200 dark:border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <User size={32} className="text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">Government Official</h3>
              <p className="text-dark-600 dark:text-dark-400 text-sm mb-8 flex-1">
                Access advanced analytics, resolve disputes, and verify claims.
              </p>
              <button onClick={() => setLoginStep('official-upload')} className="w-full bg-dark-800 hover:bg-dark-700 dark:bg-white/10 dark:hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                Verify Government ID <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Citizen Processing State */}
        {loginStep === 'citizen-processing' && (
          <div className="card max-w-md mx-auto p-8 flex flex-col items-center animate-slide-up">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" />
              <Fingerprint size={24} className="text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-2">Connecting to DigiLocker</h3>
            <p className="text-dark-500 dark:text-dark-400 text-sm text-center">
              Securely fetching your KYC details...
            </p>
          </div>
        )}

        {/* Official Upload State */}
        {loginStep === 'official-upload' && (
          <div className="card max-w-md mx-auto p-8 flex flex-col items-center animate-slide-up">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mb-6">
              <Upload size={32} className="text-brand-600 dark:text-brand-400" />
            </div>
            <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">Upload ID Document</h3>
            <p className="text-dark-500 dark:text-dark-400 text-sm text-center mb-6">
              Please upload a clear scan of your Department ID Card for verification.
            </p>
            
            <div className="w-full border-2 border-dashed border-dark-300 dark:border-dark-700 rounded-xl p-8 mb-6 hover:bg-dark-100 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={handleOfficialUpload}>
              <div className="flex flex-col items-center text-dark-400 dark:text-dark-500">
                <Upload size={24} className="mb-2" />
                <span className="text-sm font-medium">Click to upload or drag and drop</span>
                <span className="text-xs mt-1">PDF, JPG, PNG (Max 5MB)</span>
              </div>
            </div>
            
            <button onClick={() => setLoginStep('select')} className="text-sm text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        )}

        {/* Official Processing State */}
        {loginStep === 'official-processing' && (
          <div className="card max-w-md mx-auto p-8 flex flex-col items-center animate-slide-up">
             <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-brand-500/30 border-t-brand-500 animate-spin" />
              <Shield size={24} className="text-brand-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-2">Verifying Document</h3>
            <p className="text-dark-500 dark:text-dark-400 text-sm text-center">
              AI is currently analyzing and validating your government ID...
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default Landing
