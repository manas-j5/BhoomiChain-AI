import { useState } from 'react'
import { BookOpen, Plus, Trash2, FileText, Star, FolderOpen, StickyNote } from 'lucide-react'

const SAMPLE_COLLECTIONS = [
  { id: 1, name: 'Tribal Rights Cases 2024', count: 4, color: 'border-amber-500/30 bg-amber-600/10' },
  { id: 2, name: 'Encroachment — Ranchi Dist.', count: 6, color: 'border-brand-500/30 bg-brand-600/10' },
  { id: 3, name: 'Forest Land Disputes', count: 3, color: 'border-green-500/30 bg-green-600/10' },
]

const SAVED_CASES = [
  { id: '2', caseNumber: 'CASE-2024-002', title: 'Tribal Land Rights Violation — Torpa Block', status: 'ACTIVE', district: 'Khunti' },
  { id: '8', caseNumber: 'CASE-2024-008', title: 'Illegal Transfer of Tribal Land — Chaibasa', status: 'ACTIVE', district: 'West Singhbhum' },
  { id: '4', caseNumber: 'CASE-2024-004', title: 'Forest Land Encroachment — Netarhat Plateau', status: 'ACTIVE', district: 'Gumla' },
]

const ResearchWorkspace = () => {
  const [activeCollection, setActiveCollection] = useState(1)
  const [notes, setNotes] = useState('Research notes for tribal land rights analysis:\n\n• CNT Act Section 46 is key — prohibits non-tribal transfer\n• PESA provisions strengthen Gram Sabha rights\n• Check CFSL forensic reports for forgery cases')
  const [collections, setCollections] = useState(SAMPLE_COLLECTIONS)
  const [newColName, setNewColName] = useState('')
  const [showNewCol, setShowNewCol] = useState(false)

  const addCollection = () => {
    if (!newColName.trim()) return
    setCollections(c => [...c, { id: Date.now(), name: newColName, count: 0, color: 'border-violet-500/30 bg-violet-600/10' }])
    setNewColName('')
    setShowNewCol(false)
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={20} className="text-brand-400" />
          <h1 className="page-title !mb-0">Research <span className="text-gradient">Workspace</span></h1>
        </div>
        <p className="page-subtitle">Save cases, organize collections, take notes, and build your research portfolio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: Collections */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-dark-400 uppercase tracking-widest">Collections</p>
            <button
              id="new-collection-btn"
              onClick={() => setShowNewCol(!showNewCol)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-dark-500 hover:text-white transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          {showNewCol && (
            <div className="flex gap-2 animate-slide-up">
              <input
                id="new-collection-input"
                type="text"
                placeholder="Collection name…"
                value={newColName}
                onChange={e => setNewColName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCollection()}
                className="input-field text-xs flex-1"
              />
              <button onClick={addCollection} className="btn-primary text-xs px-3">Add</button>
            </div>
          )}

          {collections.map(col => (
            <button
              key={col.id}
              id={`collection-${col.id}`}
              onClick={() => setActiveCollection(col.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                activeCollection === col.id ? col.color : 'glass hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <FolderOpen size={14} className="text-brand-400 shrink-0" />
                <p className="text-sm font-medium text-white truncate">{col.name}</p>
              </div>
              <p className="text-xs text-dark-500 mt-1 ml-5">{col.count} cases</p>
            </button>
          ))}
        </div>

        {/* Main: Saved cases + notes */}
        <div className="lg:col-span-3 space-y-5">
          {/* Saved Cases */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star size={14} className="text-brand-400" />
              <p className="text-sm font-semibold text-white">Saved Cases</p>
            </div>
            <div className="space-y-2">
              {SAVED_CASES.map(c => (
                <div key={c.id} className="card flex items-center gap-4 py-3 group hover:border-brand-500/30 transition-all">
                  <FileText size={15} className="text-dark-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-dark-500">{c.caseNumber}</p>
                    <p className="text-sm text-white font-medium truncate">{c.title}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`badge ${c.status === 'ACTIVE' ? 'badge-active' : 'badge-resolved'}`}>{c.status}</span>
                    <span className="text-xs text-dark-500">{c.district}</span>
                    <button className="p-1.5 rounded-lg text-dark-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
              <button id="add-case-btn" className="w-full py-3 rounded-xl border border-dashed border-white/10 text-dark-500 hover:text-white hover:border-brand-500/30 hover:bg-brand-600/5 text-xs font-medium transition-all flex items-center justify-center gap-2">
                <Plus size={13} /> Add Case to Collection
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <StickyNote size={14} className="text-brand-400" />
              <p className="text-sm font-semibold text-white">Research Notes</p>
              <span className="ml-auto text-xs text-dark-600">Auto-saved</span>
            </div>
            <textarea
              id="research-notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={10}
              className="w-full bg-dark-900/50 rounded-xl p-4 text-sm text-dark-200 placeholder-dark-600 outline-none focus:ring-1 focus:ring-brand-500 border border-white/5 focus:border-brand-500 resize-none transition-all font-mono leading-relaxed"
              placeholder="Write your research notes here…"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResearchWorkspace
