import { useState } from 'react'
import { Library, Search, Download, FileText, BookOpen, BarChart3, Database, Scale, ExternalLink, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import { useEvidence } from '../../hooks/useData'
import api from '../../services/api'
import { useEffect } from 'react'

const TABS = [
  { key: 'all', label: 'All Evidence', icon: Library },
  { key: 'COURT_JUDGMENT', label: 'Court Judgments', icon: Scale },
  { key: 'LAND_RECORD', label: 'Land Records', icon: BookOpen },
  { key: 'GOVERNMENT_WEBSITE', label: 'Government', icon: BarChart3 },
  { key: 'NEWS_ARTICLE', label: 'News & Media', icon: FileText },
  { key: 'OTHER', label: 'Other', icon: Database },
]

const VerificationBadge = ({ status }) => {
  const cfg = {
    VERIFIED_PRIMARY: { color: 'text-green-400 bg-green-900/20 border-green-500/20', icon: CheckCircle, label: 'Verified Primary' },
    VERIFIED_GOVERNMENT: { color: 'text-blue-400 bg-blue-900/20 border-blue-500/20', icon: Shield, label: 'Govt Verified' },
    SECONDARY_CROSS_CHECKED: { color: 'text-yellow-400 bg-yellow-900/20 border-yellow-500/20', icon: CheckCircle, label: 'Cross-checked' },
  }[status] || { color: 'text-dark-500 bg-dark-800 border-dark-700', icon: AlertCircle, label: status?.replace(/_/g, ' ') || 'Unknown' }
  const Icon = cfg.icon
  return (
    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.color}`}>
      <Icon size={9} /> {cfg.label}
    </span>
  )
}

const DocumentRepository = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [allEvidence, setAllEvidence] = useState([])
  const [loading, setLoading] = useState(true)

  // Load both case_evidence and land_evidence
  useEffect(() => {
    setLoading(true)
    Promise.allSettled([
      api.get('/cases/evidence-all').catch(() => ({ data: [] })),
      api.get('/land/evidence-all').catch(() => ({ data: [] })),
    ]).then(([caseRes, landRes]) => {
      const caseEvidence = (caseRes.value?.data || []).map(e => ({ ...e, _table: 'case_evidence' }))
      const landEvidence = (landRes.value?.data || []).map(e => ({ ...e, _table: 'land_evidence' }))
      setAllEvidence([...caseEvidence, ...landEvidence])
    }).finally(() => setLoading(false))
  }, [])

  const filtered = allEvidence.filter(doc => {
    const matchTab = activeTab === 'all' || doc.source_type === activeTab
    const matchSearch = !search ||
      (doc.source_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (doc.extracted_value || '').toLowerCase().includes(search.toLowerCase()) ||
      (doc.field_extracted || '').toLowerCase().includes(search.toLowerCase()) ||
      (doc.authority || doc.source_authority || '').toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Library size={20} className="text-brand-400" />
          <h1 className="page-title !mb-0">Evidence <span className="text-gradient">Repository</span></h1>
        </div>
        <p className="page-subtitle">All verified evidence records from court judgments, land records, government sources and more</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 glass rounded-xl px-4 py-3 flex-1 max-w-xl focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all">
          <Search size={16} className="text-dark-500 shrink-0" />
          <input
            id="doc-search"
            type="text"
            placeholder="Search evidence, sources, authorities…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-dark-200 placeholder-dark-500 w-full"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            id={`doc-tab-${key}`}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === key
                ? 'bg-brand-600/20 border border-brand-500/30 text-brand-300'
                : 'glass glass-hover text-dark-400 hover:text-white'
            }`}
          >
            <Icon size={13} />{label}
          </button>
        ))}
      </div>

      <p className="text-xs text-dark-500 mb-4">
        {loading ? 'Loading...' : `${filtered.length} evidence record${filtered.length !== 1 ? 's' : ''}`}
      </p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-dark-800 rounded w-3/4 mb-3" />
              <div className="h-3 bg-dark-800 rounded w-full mb-2" />
              <div className="h-3 bg-dark-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-dark-600">
          <Library size={48} className="mb-4 opacity-30" />
          <p className="text-dark-400 font-medium">No evidence found</p>
          <p className="text-dark-600 text-sm mt-1">Try a different search term or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc, idx) => (
            <div key={doc.evidence_id || idx} id={`doc-card-${doc.evidence_id}`} className="card group hover:border-brand-500/30 transition-all duration-200 flex flex-col">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-brand-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-brand-300 transition-colors">
                    {doc.source_name || 'Unnamed Source'}
                  </p>
                  <p className="text-dark-500 text-xs mt-1">{doc.source_type?.replace(/_/g, ' ')}</p>
                </div>
              </div>

              <div className="flex-1 space-y-1.5 text-xs mb-3">
                <p className="text-dark-500">
                  <span className="text-dark-600">Field: </span>
                  <span className="text-dark-300">{doc.field_extracted}</span>
                </p>
                <p className="text-dark-400 line-clamp-2">{doc.extracted_value}</p>
                {(doc.authority || doc.source_authority) && (
                  <p className="text-dark-600">Authority: {doc.authority || doc.source_authority}</p>
                )}
              </div>

              <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                <VerificationBadge status={doc.verification_status} />
                {doc.source_url && (
                  <a
                    href={doc.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    id={`doc-link-${doc.evidence_id}`}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium glass glass-hover text-dark-400 hover:text-brand-300 transition-colors"
                  >
                    <ExternalLink size={11} /> Source
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DocumentRepository
