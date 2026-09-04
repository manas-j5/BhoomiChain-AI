import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, User, FileText, CheckCircle, XCircle, Clock, Shield } from 'lucide-react'
import { useCaseById } from '../hooks/useCases'
import { formatDate, getStatusClass, getPriorityClass } from '../utils/helpers'

const TimelineItem = ({ event, isLast }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
        event.event === 'RESOLVED' ? 'bg-green-400' :
        event.event === 'FIR Filed' || event.event === 'Case Filed' ? 'bg-brand-500' :
        'bg-dark-600'
      }`} />
      {!isLast && <div className="w-px bg-white/10 flex-1 mt-1" />}
    </div>
    <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-semibold text-white">{event.event}</span>
        <span className="text-xs text-dark-600">{formatDate(event.date)}</span>
      </div>
      <p className="text-xs text-dark-400">{event.description}</p>
    </div>
  </div>
)

const DocumentRow = ({ doc }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
    <div className="flex items-center gap-3">
      <FileText size={15} className="text-dark-500 shrink-0" />
      <div>
        <p className="text-sm text-white font-medium">{doc.name}</p>
        <p className="text-xs text-dark-600">{doc.type}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      {doc.verified ? (
        <span className="flex items-center gap-1 text-xs text-green-400">
          <CheckCircle size={13} /> Verified
        </span>
      ) : (
        <span className="flex items-center gap-1 text-xs text-yellow-400">
          <XCircle size={13} /> Pending
        </span>
      )}
      {doc.hash && doc.hash !== 'sha256:MISMATCH' && (
        <span className="text-xs font-mono text-dark-600 bg-dark-800 px-2 py-0.5 rounded">
          {doc.hash.slice(0, 18)}…
        </span>
      )}
      {doc.hash === 'sha256:MISMATCH' && (
        <span className="text-xs font-mono text-red-400 bg-red-900/30 px-2 py-0.5 rounded border border-red-500/30">
          HASH MISMATCH
        </span>
      )}
    </div>
  </div>
)

const CaseDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { caseData, loading, error } = useCaseById(id)

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-dark-800 rounded w-1/3" />
        <div className="h-4 bg-dark-800 rounded w-1/2" />
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-dark-800 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (error || !caseData) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <XCircle size={48} className="text-red-500 mb-4" />
        <p className="text-white font-semibold text-lg">Case Not Found</p>
        <p className="text-dark-400 text-sm mt-1">{error}</p>
        <button onClick={() => navigate('/cases')} className="btn-primary mt-6">Back to Cases</button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Back + header */}
      <button
        id="back-to-cases-btn"
        onClick={() => navigate('/cases')}
        className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-6 text-sm"
      >
        <ArrowLeft size={16} /> Back to Cases
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-dark-500 font-mono mb-1">{caseData.caseNumber}</p>
          <h1 className="text-xl font-bold text-white leading-snug max-w-2xl">{caseData.title}</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className={getStatusClass(caseData.status)}>{caseData.status}</span>
          <span className={getPriorityClass(caseData.priority)}>{caseData.priority} PRIORITY</span>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: MapPin, label: 'Location', value: `${caseData.village}, ${caseData.district}` },
          { icon: Calendar, label: 'Filed', value: formatDate(caseData.filedDate) },
          { icon: Calendar, label: 'Next Hearing', value: formatDate(caseData.hearingDate) },
          { icon: User, label: 'Court', value: caseData.court, small: true },
        ].map(({ icon: Icon, label, value, small }) => (
          <div key={label} className="card">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={13} className="text-brand-400" />
              <span className="text-xs text-dark-500 font-medium">{label}</span>
            </div>
            <p className={`text-white font-semibold ${small ? 'text-xs' : 'text-sm'}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Main 2-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Parties */}
          <div className="card">
            <h2 className="text-sm font-semibold text-white mb-4">Parties Involved</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-brand-600/10 border border-brand-500/20">
                <p className="text-xs text-dark-500 mb-1">Plaintiff</p>
                <p className="text-sm font-semibold text-white">{caseData.plaintiff}</p>
              </div>
              <div className="p-3 rounded-xl bg-red-600/10 border border-red-500/20">
                <p className="text-xs text-dark-500 mb-1">Defendant</p>
                <p className="text-sm font-semibold text-white">{caseData.defendant}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="text-sm font-semibold text-white mb-3">Case Description</h2>
            <p className="text-dark-300 text-sm leading-relaxed">{caseData.description}</p>
          </div>

          {/* Land details */}
          <div className="card">
            <h2 className="text-sm font-semibold text-white mb-4">Land Details</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                ['Survey Number', caseData.surveyNumber],
                ['Area', caseData.area],
                ['Land Type', caseData.landType],
                ['Taluka', caseData.taluka],
                ['Village', caseData.village],
                ['State', caseData.state],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-dark-500 mb-0.5">{k}</p>
                  <p className="text-sm text-white font-medium">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={15} className="text-brand-400" />
              <h2 className="text-sm font-semibold text-white">Documents & Verification</h2>
            </div>
            {caseData.documents.map((doc, i) => (
              <DocumentRow key={i} doc={doc} />
            ))}
          </div>

          {/* AI Summary */}
          {caseData.aiSummary && (
            <div className="card bg-gradient-to-br from-brand-600/10 to-cyan-600/5 border-brand-500/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-gradient-brand flex items-center justify-center text-xs">✦</div>
                <h2 className="text-sm font-semibold text-white">AI Summary</h2>
                <span className="badge bg-brand-500/20 text-brand-300 border border-brand-500/30">AI Generated</span>
              </div>
              <p className="text-dark-300 text-sm leading-relaxed">{caseData.aiSummary}</p>
            </div>
          )}
        </div>

        {/* Right: timeline */}
        <div className="card h-fit">
          <div className="flex items-center gap-2 mb-5">
            <Clock size={15} className="text-brand-400" />
            <h2 className="text-sm font-semibold text-white">Case Timeline</h2>
          </div>
          <div>
            {caseData.timeline.map((event, i) => (
              <TimelineItem
                key={i}
                event={event}
                isLast={i === caseData.timeline.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaseDetails
