import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, User, ArrowRight } from 'lucide-react'
import { formatDate, getStatusClass, getPriorityClass, truncate } from '../utils/helpers'

const CaseCard = ({ caseData }) => {
  const navigate = useNavigate()
  const {
    id, title, caseNumber, status, priority, category, district,
    plaintiff, defendant, filedDate, description,
  } = caseData

  return (
    <div
      id={`case-card-${id}`}
      className="card glass-hover cursor-pointer group animate-slide-up transition-all duration-300 hover:border-brand-500/30"
      onClick={() => navigate(`/cases/${id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/cases/${id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-dark-500 font-mono mb-1">{caseNumber}</p>
          <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-brand-300 transition-colors line-clamp-2">
            {title}
          </h3>
        </div>
        <ArrowRight size={16} className="text-dark-600 group-hover:text-brand-400 transition-colors shrink-0 mt-0.5" />
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={getStatusClass(status)}>{status}</span>
        <span className={getPriorityClass(priority)}>{priority}</span>
        <span className="badge bg-dark-800/80 text-dark-400 border border-dark-700/50">{category}</span>
      </div>

      {/* Description */}
      <p className="text-dark-400 text-xs leading-relaxed mb-4">
        {truncate(description, 120)}
      </p>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-2 text-xs text-dark-500">
        <div className="flex items-center gap-1.5">
          <MapPin size={12} className="text-dark-600 shrink-0" />
          <span>{district}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-dark-600 shrink-0" />
          <span>{formatDate(filedDate)}</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2">
          <User size={12} className="text-dark-600 shrink-0" />
          <span className="truncate">{plaintiff} vs {defendant}</span>
        </div>
      </div>
    </div>
  )
}

export default CaseCard
