import { useState, useRef } from 'react'
import { Upload, FileText, Map, Database, CheckCircle, X, Loader2, AlertCircle } from 'lucide-react'

const FILE_TYPES = [
  { id: 'case_docs', label: 'Case Documents', icon: FileText, exts: 'PDF, DOCX, TXT', color: 'text-brand-400' },
  { id: 'gis_data', label: 'GIS / Spatial Data', icon: Map, exts: 'SHP, GeoJSON, KML', color: 'text-cyan-400' },
  { id: 'records', label: 'Revenue Records', icon: Database, exts: 'PDF, CSV, XLSX', color: 'text-amber-400' },
  { id: 'reports', label: 'Survey Reports', icon: FileText, exts: 'PDF, DOCX', color: 'text-violet-400' },
]

const RECENT_UPLOADS = [
  { name: 'Ranchi_District_Survey_2024.pdf', type: 'Revenue Records', size: '4.2 MB', status: 'processed', time: '2 hours ago' },
  { name: 'Khunti_GIS_Parcels.geojson', type: 'GIS Data', size: '12.8 MB', status: 'processed', time: '5 hours ago' },
  { name: 'FRA_Claims_Gumla_Q2.xlsx', type: 'Case Documents', size: '1.1 MB', status: 'processing', time: '30 min ago' },
  { name: 'Dhanbad_Mining_Survey.pdf', type: 'Survey Reports', size: '8.3 MB', status: 'error', time: '1 day ago' },
]

const DataUpload = () => {
  const [selectedType, setSelectedType] = useState('case_docs')
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadQueue, setUploadQueue] = useState([])
  const fileRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    addToQueue(files)
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    addToQueue(files)
  }

  const addToQueue = (files) => {
    const items = files.map(f => ({ id: Math.random(), name: f.name, size: (f.size / 1024 / 1024).toFixed(2) + ' MB', status: 'queued', progress: 0 }))
    setUploadQueue(q => [...q, ...items])
  }

  const simulateUpload = async () => {
    if (uploadQueue.length === 0) return
    setUploading(true)
    for (let i = 0; i < uploadQueue.length; i++) {
      setUploadQueue(q => q.map((item, j) => j === i ? { ...item, status: 'uploading' } : item))
      await new Promise(r => setTimeout(r, 1500))
      setUploadQueue(q => q.map((item, j) => j === i ? { ...item, status: 'done', progress: 100 } : item))
    }
    setUploading(false)
  }

  const removeFromQueue = (id) => setUploadQueue(q => q.filter(i => i.id !== id))

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Upload size={20} className="text-amber-400" />
          <h1 className="page-title !mb-0">Data <span className="text-amber-400">Upload Centre</span></h1>
        </div>
        <p className="page-subtitle">Upload case documents, GIS data, revenue records and survey reports for processing and indexing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* File type selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FILE_TYPES.map(({ id, label, icon: Icon, exts, color }) => (
              <button
                key={id}
                id={`file-type-${id}`}
                onClick={() => setSelectedType(id)}
                className={`card text-center cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                  selectedType === id ? 'border-amber-500/40 bg-amber-600/10' : 'hover:border-white/20'
                }`}
              >
                <Icon size={22} className={`${color} mx-auto mb-2`} />
                <p className="text-white text-xs font-semibold mb-0.5">{label}</p>
                <p className="text-dark-600 text-xs">{exts}</p>
              </button>
            ))}
          </div>

          {/* Drop zone */}
          <div
            id="drop-zone"
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileRef.current?.click()}
            className={`card border-2 border-dashed cursor-pointer flex flex-col items-center justify-center py-16 transition-all duration-200 ${
              dragOver ? 'border-amber-500/70 bg-amber-600/10' : 'border-white/10 hover:border-amber-500/40 hover:bg-amber-600/5'
            }`}
          >
            <Upload size={36} className={`mb-4 transition-colors ${dragOver ? 'text-amber-400' : 'text-dark-600'}`} />
            <p className="text-white font-semibold mb-1">Drop files here or click to browse</p>
            <p className="text-dark-500 text-sm">Maximum 50 MB per file</p>
            <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
          </div>

          {/* Upload queue */}
          {uploadQueue.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Upload Queue ({uploadQueue.length})</h3>
                {!uploading && (
                  <button id="start-upload-btn" onClick={simulateUpload} className="btn-primary text-xs px-4 py-2 flex items-center gap-2">
                    <Upload size={13} /> Upload All
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {uploadQueue.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-dark-900/50 border border-white/5">
                    <FileText size={15} className="text-dark-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{item.name}</p>
                      <p className="text-dark-600 text-xs">{item.size}</p>
                    </div>
                    {item.status === 'uploading' && <Loader2 size={14} className="text-amber-400 animate-spin shrink-0" />}
                    {item.status === 'done' && <CheckCircle size={14} className="text-green-400 shrink-0" />}
                    {item.status === 'queued' && (
                      <button onClick={() => removeFromQueue(item.id)} className="text-dark-600 hover:text-red-400 transition-colors">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent uploads */}
        <div className="card h-fit">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Uploads</h3>
          <div className="space-y-3">
            {RECENT_UPLOADS.map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-dark-900/50 border border-white/5">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-white text-xs font-medium leading-snug">{item.name}</p>
                  {item.status === 'processed' && <CheckCircle size={13} className="text-green-400 shrink-0 mt-0.5" />}
                  {item.status === 'processing' && <Loader2 size={13} className="text-amber-400 animate-spin shrink-0 mt-0.5" />}
                  {item.status === 'error' && <AlertCircle size={13} className="text-red-400 shrink-0 mt-0.5" />}
                </div>
                <p className="text-dark-600 text-xs">{item.type} · {item.size}</p>
                <p className="text-dark-700 text-xs mt-0.5">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataUpload
