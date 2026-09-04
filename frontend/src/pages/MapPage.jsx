import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useCases } from '../hooks/useCases'
import { getStatusClass, getPriorityClass } from '../utils/helpers'
import { MapPin, Layers, Filter } from 'lucide-react'

// Fix Leaflet marker icon (Vite/webpack issue)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const STATUS_COLOR = {
  ACTIVE: '#4c6ef5',
  PENDING: '#f59f00',
  RESOLVED: '#40c057',
  DISMISSED: '#868e96',
}

const MapPage = () => {
  const { cases, loading } = useCases({ limit: 100 })
  const [selectedCase, setSelectedCase] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')

  const filteredCases = cases.filter(c =>
    !filterStatus || c.status === filterStatus
  ).filter(c => c.coordinates?.lat && c.coordinates?.lng)

  return (
    <div>
      <h1 className="page-title">GIS Land Parcel Map</h1>
      <p className="page-subtitle">
        Geographic visualization of land disputes across Jharkhand — connects to PostGIS via GIS Engine
      </p>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
          <Filter size={14} className="text-dark-500" />
          <select
            id="map-filter-status"
            className="bg-transparent outline-none text-sm text-dark-300 cursor-pointer"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {['ACTIVE', 'PENDING', 'RESOLVED'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 glass rounded-xl px-4 py-2">
          <Layers size={14} className="text-dark-500" />
          {Object.entries(STATUS_COLOR).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full border-2" style={{ background: color, borderColor: color }} />
              <span className="text-xs text-dark-400">{status}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5 glass rounded-xl px-4 py-2">
          <MapPin size={14} className="text-brand-400" />
          <span className="text-xs text-dark-300">
            Showing <strong className="text-white">{filteredCases.length}</strong> cases
          </span>
        </div>
      </div>

      {/* Map + sidebar */}
      <div className="flex gap-4 h-[580px]">
        {/* Map */}
        <div className="flex-1 rounded-2xl overflow-hidden border border-white/10">
          {loading ? (
            <div className="w-full h-full bg-dark-900 animate-pulse flex items-center justify-center">
              <MapPin size={32} className="text-dark-700 animate-bounce" />
            </div>
          ) : (
            <MapContainer
              center={[23.5, 85.5]}
              zoom={7}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredCases.map(c => (
                <CircleMarker
                  key={c.id}
                  center={[c.coordinates.lat, c.coordinates.lng]}
                  radius={c.priority === 'CRITICAL' ? 14 : c.priority === 'HIGH' ? 11 : 9}
                  pathOptions={{
                    color: STATUS_COLOR[c.status] || '#868e96',
                    fillColor: STATUS_COLOR[c.status] || '#868e96',
                    fillOpacity: 0.75,
                    weight: 2,
                  }}
                  eventHandlers={{ click: () => setSelectedCase(c) }}
                >
                  <Popup>
                    <div style={{ minWidth: '180px' }}>
                      <p style={{ fontWeight: 700, marginBottom: 4 }}>{c.title}</p>
                      <p style={{ fontSize: 11, color: '#adb5bd' }}>{c.caseNumber}</p>
                      <p style={{ fontSize: 11, marginTop: 4 }}>{c.district}, {c.state}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Case detail sidebar */}
        <div className="w-72 flex flex-col gap-3 overflow-y-auto">
          {selectedCase ? (
            <div className="card animate-slide-up">
              <button
                onClick={() => setSelectedCase(null)}
                className="text-xs text-dark-500 hover:text-white mb-3"
              >
                ✕ Close
              </button>
              <p className="text-xs text-dark-500 font-mono mb-1">{selectedCase.caseNumber}</p>
              <h3 className="text-sm font-bold text-white mb-3 leading-snug">{selectedCase.title}</h3>
              <div className="flex gap-2 mb-3">
                <span className={getStatusClass(selectedCase.status)}>{selectedCase.status}</span>
                <span className={getPriorityClass(selectedCase.priority)}>{selectedCase.priority}</span>
              </div>
              <div className="space-y-2 text-xs text-dark-400">
                <p><span className="text-dark-600">District:</span> {selectedCase.district}</p>
                <p><span className="text-dark-600">Survey No:</span> {selectedCase.surveyNumber}</p>
                <p><span className="text-dark-600">Area:</span> {selectedCase.area}</p>
                <p><span className="text-dark-600">Category:</span> {selectedCase.category}</p>
                <p><span className="text-dark-600">Lat/Lng:</span> {selectedCase.coordinates.lat}, {selectedCase.coordinates.lng}</p>
              </div>
            </div>
          ) : (
            <div className="card text-center py-10 text-dark-600">
              <MapPin size={28} className="mx-auto mb-3" />
              <p className="text-xs">Click a marker on the map to view case details</p>
            </div>
          )}

          {/* Case list */}
          <div className="card flex-1 overflow-y-auto">
            <p className="text-xs font-semibold text-dark-400 mb-3">Cases on Map</p>
            <div className="space-y-2">
              {filteredCases.map(c => (
                <button
                  key={c.id}
                  id={`map-case-${c.id}`}
                  onClick={() => setSelectedCase(c)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all ${
                    selectedCase?.id === c.id
                      ? 'bg-brand-600/20 border border-brand-500/30 text-white'
                      : 'hover:bg-white/5 text-dark-400'
                  }`}
                >
                  <p className="font-semibold text-inherit truncate">{c.title}</p>
                  <p className="text-dark-600 mt-0.5">{c.district} · {c.category}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GIS note */}
      <div className="mt-4 card border-brand-500/20 bg-brand-600/5">
        <p className="text-xs text-dark-400">
          <strong className="text-brand-300">GIS Integration:</strong> This map currently shows case coordinates.
          Full GeoJSON parcel overlays, heatmaps, and district polygons will be provided by the <code className="text-brand-400 bg-dark-800 px-1 rounded">feature/gis</code> branch via the GIS Engine API.
        </p>
      </div>
    </div>
  )
}

export default MapPage
