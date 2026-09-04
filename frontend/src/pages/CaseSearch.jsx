import { useState, useCallback } from 'react'
import { Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react'
import CaseCard from '../components/CaseCard'
import { useCases, useSearch } from '../hooks/useCases'

const STATUS_OPTIONS = ['', 'ACTIVE', 'PENDING', 'RESOLVED', 'DISMISSED']
const PRIORITY_OPTIONS = ['', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
const DISTRICT_OPTIONS = ['', 'Ranchi', 'Khunti', 'Dhanbad', 'Hazaribagh', 'Gumla', 'Bokaro']

const CaseSearch = () => {
  const [searchMode, setSearchMode] = useState(false)
  const [filters, setFilters] = useState({ status: '', priority: '', district: '' })
  const [showFilters, setShowFilters] = useState(false)

  const { cases, pagination, loading: listLoading, updateParams } = useCases({ limit: 9 })
  const { results, loading: searchLoading, query, search } = useSearch()

  const displayCases = searchMode ? results : cases
  const loading = searchMode ? searchLoading : listLoading

  const handleSearch = useCallback((e) => {
    const q = e.target.value
    if (q.length > 1) {
      setSearchMode(true)
      search(q)
    } else {
      setSearchMode(false)
    }
  }, [search])

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    setSearchMode(false)
    updateParams({ ...newFilters, page: 1 })
  }

  const clearFilters = () => {
    setFilters({ status: '', priority: '', district: '' })
    setSearchMode(false)
    updateParams({ status: '', priority: '', district: '', page: 1 })
  }

  const hasFilters = filters.status || filters.priority || filters.district

  return (
    <div>
      <h1 className="page-title">Case Search</h1>
      <p className="page-subtitle">Search and filter land dispute cases across Jharkhand</p>

      {/* Search + Filter bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 glass rounded-xl px-4 py-3 flex-1 max-w-xl focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all">
          <Search size={16} className="text-dark-500 shrink-0" />
          <input
            id="case-search-input"
            type="text"
            placeholder="Search by case number, district, plaintiff, category…"
            className="bg-transparent outline-none text-sm text-dark-200 placeholder-dark-500 w-full"
            onChange={handleSearch}
          />
        </div>
        <button
          id="toggle-filters-btn"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
            showFilters || hasFilters
              ? 'bg-brand-600/20 border border-brand-500/40 text-brand-300'
              : 'glass glass-hover text-dark-400'
          }`}
        >
          <Filter size={15} />
          Filters
          {hasFilters && <span className="w-2 h-2 bg-brand-500 rounded-full" />}
        </button>
        {hasFilters && (
          <button
            id="clear-filters-btn"
            onClick={clearFilters}
            className="p-3 rounded-xl glass glass-hover text-dark-400 hover:text-red-400 transition-colors"
            title="Clear filters"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up">
          <div>
            <label className="block text-xs text-dark-400 mb-1.5 font-medium">Status</label>
            <select
              id="filter-status"
              className="input-field bg-dark-900 text-sm"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-dark-400 mb-1.5 font-medium">Priority</label>
            <select
              id="filter-priority"
              className="input-field bg-dark-900 text-sm"
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p || 'All Priorities'}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-dark-400 mb-1.5 font-medium">District</label>
            <select
              id="filter-district"
              className="input-field bg-dark-900 text-sm"
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
            >
              {DISTRICT_OPTIONS.map(d => <option key={d} value={d}>{d || 'All Districts'}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Search mode label */}
      {searchMode && query && (
        <p className="text-xs text-dark-500 mb-4">
          Showing {results.length} result{results.length !== 1 ? 's' : ''} for "
          <span className="text-brand-400">{query}</span>"
        </p>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-dark-800 rounded w-3/4 mb-3" />
              <div className="h-3 bg-dark-800 rounded w-full mb-2" />
              <div className="h-3 bg-dark-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : displayCases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Search size={48} className="text-dark-700 mb-4" />
          <p className="text-dark-400 font-medium">No cases found</p>
          <p className="text-dark-600 text-sm mt-1">Try a different search term or clear filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayCases.map(c => <CaseCard key={c.id} caseData={c} />)}
          </div>

          {/* Pagination (list mode only) */}
          {!searchMode && pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                id="prev-page-btn"
                disabled={!pagination.hasPrev}
                onClick={() => updateParams({ page: pagination.page - 1 })}
                className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft size={15} /> Prev
              </button>
              <span className="text-sm text-dark-400">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                id="next-page-btn"
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

export default CaseSearch
