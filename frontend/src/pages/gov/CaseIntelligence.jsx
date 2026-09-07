import { useState, useCallback } from 'react'
import { FileSearch, Filter, X, ChevronLeft, ChevronRight, Brain, Shield, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCases, useSearch } from '../../hooks/useCases'
import { formatDate, getStatusClass, getPriorityClass, truncate } from '../../utils/helpers'

const STATUS_OPTIONS = ['', 'ACTIVE', 'PENDING', 'RESOLVED', 'DISMISSED']
const PRIORITY_OPTIONS = ['', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
const DISTRICT_OPTIONS = ['', 'Ranchi', 'Khunti', 'Dhanbad', 'Hazaribagh', 'Gumla', 'Bokaro', 'East Singhbhum', 'West Singhbhum', 'Giridih', 'Dumka']

const CaseIntelligence = () => {
  const navigate = useNavigate()
  const [searchMode, setSearchMode] = useState(false)
  const [filters, setFilters] = useState({ status: '', priority: '', district: '' })
  const [showFilters, setShowFilters] = useState(false)

  const { cases, pagination, loading: listLoading, updateParams } = useCases({ limit: 12 })
  const { results, loading: searchLoading, query, search } = useSearch()

  const displayCases = searchMode ? results : cases
  const loading = searchMode ? searchLoading : listLoading
  const hasFilters = filters.status || filters.priority || filters.district

  const handleSearch = useCallback((e) => {
    const q = e.target.value
    if (q.length > 1) { setSearchMode(true); search(q) }
    else setSearchMode(false)
  }, [search])

  const handleFilterChange = (key, value) => {
    const nf = { ...filters, [key]: value }
    setFilters(nf)
    setSearchMode(false)
    updateParams({ ...nf, page: 1 })
  }

  const clearFilters = () => {
    setFilters({ status: '', priority: '', district: '' })
    setSearchMode(false)
    updateParams({ status: '', priority: '', district: '', page: 1 })
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <FileSearch size={20} className="text-amber-400" />
          <h1 className="page-title !mb-0">Case <span className="text-amber-400">Intelligence</span></h1>
        </div>
        <p className="page-subtitle">Full case intelligence view for authorized government officials — all dispute records with evidence graph access</p>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 glass rounded-xl px-4 py-3 flex-1 max-w-xl focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition-all">
          <FileSearch size={16} className="text-dark-500 shrink-0" />
          <input
            id="gov-case-search"
            type="text"
            placeholder="Search by case number, district, plaintiff, category…"
            className="bg-transparent outline-none text-sm text-dark-200 placeholder-dark-500 w-full"
            onChange={handleSearch}
          />
        </div>
        <button
          id="gov-toggle-filters"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
            showFilters || hasFilters
              ? 'bg-amber-600/20 border border-amber-500/40 text-amber-300'
              : 'glass glass-hover text-dark-400'
          }`}
        >
          <Filter size={15} /> Filters
          {hasFilters && <span className="w-2 h-2 bg-amber-500 rounded-full" />}
        </button>
        {hasFilters && (
          <button id="gov-clear-filters" onClick={clearFilters} className="p-3 rounded-xl glass glass-hover text-dark-400 hover:text-red-400">
            <X size={15} />
          </button>
        )}
      </div>

      {showFilters && (
        <div className="card mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up">
          {[
            { label: 'Status', key: 'status', opts: STATUS_OPTIONS },
            { label: 'Priority', key: 'priority', opts: PRIORITY_OPTIONS },
            { label: 'District', key: 'district', opts: DISTRICT_OPTIONS },
          ].map(({ label, key, opts }) => (
            <div key={key}>
              <label className="block text-xs text-dark-400 mb-1.5 font-medium">{label}</label>
              <select
                id={`gov-filter-${key}`}
                className="input-field bg-dark-900 text-sm"
                value={filters[key]}
                onChange={e => handleFilterChange(key, e.target.value)}
              >
                {opts.map(o => <option key={o} value={o}>{o || `All ${label}es`}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}

      {searchMode && query && (
        <p className="text-xs text-dark-500 mb-4">
          {results.length} result{results.length !== 1 ? 's' : ''} for "<span className="text-amber-400">{query}</span>"
        </p>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card animate-pulse flex gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-dark-800 rounded w-1/4" />
                <div className="h-4 bg-dark-800 rounded w-3/4" />
                <div className="h-3 bg-dark-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : displayCases.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-dark-600">
          <FileSearch size={48} className="mb-4 opacity-30" />
          <p className="font-medium text-dark-400">No cases found</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {displayCases.map(c => (
              <div
                key={c.id}
                id={`gov-case-row-${c.id}`}
                className="card glass-hover cursor-pointer group hover:border-amber-500/30 transition-all duration-200"
                onClick={() => navigate(`/user/cases/${c.id}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono text-dark-500">{c.caseNumber}</span>
                      <span className={getStatusClass(c.status)}>{c.status?.split(' — ')[0]}</span>
                      <span className={getPriorityClass(c.priority)}>{c.priority}</span>
                      <span className="badge bg-dark-800/80 text-dark-400 border border-dark-700/50">{c.category}</span>
                    </div>
                    <h3 className="text-white font-semibold text-sm group-hover:text-amber-300 transition-colors mb-1">{c.title}</h3>
                    <p className="text-dark-500 text-xs">{truncate(c.description, 130)}</p>
                  </div>
                  <div className="text-right shrink-0 space-y-2">
                    <div className="text-xs text-dark-500">{c.district}</div>
                    <div className="text-xs text-dark-600">Filed: {formatDate(c.filedDate)}</div>
                    <div className="text-xs text-dark-600">Hearing: {formatDate(c.hearingDate)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-dark-500">
                    <Shield size={11} className="text-dark-600" />
                    {c.documents?.length || 0} documents · {c.documents?.filter(d => d.verified).length || 0} verified
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-dark-500 ml-auto">
                    {c.aiSummary && <Brain size={11} className="text-amber-400" />}
                    {c.aiSummary && <span className="text-amber-400">AI Summary available</span>}
                    <ArrowRight size={12} className="text-dark-600 group-hover:text-amber-400 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!searchMode && pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                id="gov-prev-page"
                disabled={!pagination.hasPrev}
                onClick={() => updateParams({ page: pagination.page - 1 })}
                className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft size={15} /> Prev
              </button>
              <span className="text-sm text-dark-400">Page {pagination.page} of {pagination.totalPages}</span>
              <button
                id="gov-next-page"
                disabled={!pagination.hasNext}
                onClick={() => updateParams({ page: pagination.page + 1 })}
                className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CaseIntelligence
