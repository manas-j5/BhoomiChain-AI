import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useCases } from '../hooks/useCases'
import { getStatusClass } from '../utils/helpers'
import { MapPin, Layers, Filter } from 'lucide-react'
import api from '../services/api'

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
  const { cases, loading: casesLoading } = useCases({ limit: 100 })
  const [geoPoints, setGeoPoints] = useState([])
  const [geoLoading, setGeoLoading] = useState(true)
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [layer, setLayer] = useState('cases') // 'cases' | 'parcels'

  // Load real geospatial data
  useEffect(() => {
    api.get('/land/geospatial-all')
      .then(res => setGeoPoints(res.data || []))
      .catch(() => setGeoPoints([]))
      .finally(() => setGeoLoading(false))
  }, [])

  const loading = layer === 'cases' ? casesLoading : geoLoading

  const activePoints = layer === 'cases'
    ? cases.filter(c => !filterStatus || c.status === filterStatus)
    : geoPoints

  return (
    <div>
      <h1 className="page-title">GIS Land Parcel Map</h1>
      <p className="page-subtitle">
        Geographic visualization of land parcels and disputes — {geoPoints.length} real parcels from Supabase
      </p>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Layer toggle */}
        <div className="flex glass rounded-xl overflow-hidden">
          {[{ key: 'cases', label: 'Cases' }, { key: 'parcels', label: 'Land Parcels' }].map(l => (
            <button
              key={l.key}
              onClick={() => setLayer(l.key)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                layer === l.key ? 'bg-brand-600/30 text-brand-300' : 'text-dark-400 hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {layer === 'cases' && (
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
        )}

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
            <strong className="text-white">{activePoints.length}</strong> {layer === 'cases' ? 'cases' : 'parcels'}
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
              zoom={layer === 'parcels' ? 12 : 7}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Layer: Cases */}
              {layer === 'cases' && cases
                .filter(c => !filterStatus || c.status === filterStatus)
                .map(c => {
                  const districtCoords = {
                    'Haridwar': [29.9457, 78.1642], 'MULTIPLE': [24.0, 88.0],
                    'Varanasi': [25.3176, 82.9739], 'Ayodhya': [26.7922, 82.1998],
                  }
                  const coords = districtCoords[c.district] || [23.5 + Math.random() * 2 - 1, 85.5 + Math.random() * 2 - 1]
                  return (
                    <CircleMarker
                      key={c.id}
                      center={coords}
                      radius={c.priority === 'CRITICAL' ? 14 : c.priority === 'HIGH' ? 11 : 9}
                      pathOptions={{
                        color: STATUS_COLOR[c.status?.split(' ')[0]] || '#868e96',
                        fillColor: STATUS_COLOR[c.status?.split(' ')[0]] || '#868e96',
                        fillOpacity: 0.75,
                        weight: 2,
                      }}
                      eventHandlers={{ click: () => setSelectedPoint(c) }}
                    >
                      <Popup>
                        <div style={{ minWidth: '180px' }}>
                          <p style={{ fontWeight: 700, marginBottom: 4 }}>{c.title}</p>
                          <p style={{ fontSize: 11, color: '#adb5bd' }}>{c.caseNumber}</p>
                          <p style={{ fontSize: 11, marginTop: 4 }}>{c.district}</p>
                        </div>
                      </Popup>
                    </CircleMarker>
                  )
                })
              }

              {/* Layer: Real Geospatial Parcels */}
              {layer === 'parcels' && geoPoints.map((pt, i) => {
                const lat = parseFloat(pt.latitude)
                const lng = parseFloat(pt.longitude)
                if (isNaN(lat) || isNaN(lng)) return null
                return (
                  <CircleMarker
                    key={pt.geo_id || i}
                    center={[lat, lng]}
                    radius={7}
                    pathOptions={{ color: '#4c6ef5', fillColor: '#4c6ef5', fillOpacity: 0.6, weight: 1.5 }}
                    eventHandlers={{ click: () => setSelectedPoint(pt) }}
                  >
                    <Popup>
                      <div style={{ minWidth: '160px' }}>
                        <p style={{ fontWeight: 700, marginBottom: 4 }}>Land ID: {pt.land_id}</p>
                        <p style={{ fontSize: 11 }}>Survey: {pt.survey_no || '—'}</p>
                        <p style={{ fontSize: 11 }}>Area: {pt.area || '—'}</p>
                        {pt.location_accuracy && <p style={{ fontSize: 10, color: '#868e96' }}>Accuracy: {pt.location_accuracy}</p>}
                      </div>
                    </Popup>
                  </CircleMarker>
                )
              })}
            </MapContainer>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-72 flex flex-col gap-3 overflow-y-auto">
          {selectedPoint ? (
            <div className="card animate-slide-up">
              <button onClick={() => setSelectedPoint(null)} className="text-xs text-dark-500 hover:text-white mb-3">
                ✕ Close
              </button>
              {layer === 'cases' ? (
                <>
                  <p className="text-xs text-dark-500 font-mono mb-1">{selectedPoint.caseNumber}</p>
                  <h3 className="text-sm font-bold text-white mb-3 leading-snug">{selectedPoint.title}</h3>
                  <div className="space-y-2 text-xs text-dark-400">
                    <p><span className="text-dark-600">District:</span> {selectedPoint.district}</p>
                    <p><span className="text-dark-600">Status:</span> {selectedPoint.status?.split(' ')[0]}</p>
                    <p><span className="text-dark-600">Category:</span> {selectedPoint.category}</p>
                    <p><span className="text-dark-600">Plaintiff:</span> {selectedPoint.plaintiff}</p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs text-dark-500 font-mono mb-1">Land ID: {selectedPoint.land_id}</p>
                  <div className="space-y-2 text-xs text-dark-400">
                    <p><span className="text-dark-600">Survey No:</span> {selectedPoint.survey_no || '—'}</p>
                    <p><span className="text-dark-600">Area:</span> {selectedPoint.area || '—'}</p>
                    <p><span className="text-dark-600">Lat/Lng:</span> {selectedPoint.latitude}, {selectedPoint.longitude}</p>
                    <p><span className="text-dark-600">Accuracy:</span> {selectedPoint.location_accuracy || '—'}</p>
                    <p><span className="text-dark-600">Source:</span> {selectedPoint.coordinate_source || '—'}</p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="card text-center py-10 text-dark-600">
              <MapPin size={28} className="mx-auto mb-3" />
              <p className="text-xs">Click a marker to view details</p>
            </div>
          )}

          {/* Item list */}
          <div className="card flex-1 overflow-y-auto">
            <p className="text-xs font-semibold text-dark-400 mb-3">{layer === 'cases' ? 'Cases' : 'Parcels'} on Map</p>
            <div className="space-y-2">
              {(layer === 'cases' ? cases : geoPoints).slice(0, 20).map((item, i) => (
                <button
                  key={item.id || item.geo_id || i}
                  id={`map-item-${item.id || item.land_id || i}`}
                  onClick={() => setSelectedPoint(item)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all ${
                    selectedPoint?.id === item.id || selectedPoint?.land_id === item.land_id
                      ? 'bg-brand-600/20 border border-brand-500/30 text-white'
                      : 'hover:bg-white/5 text-dark-400'
                  }`}
                >
                  <p className="font-semibold text-inherit truncate">
                    {layer === 'cases' ? item.title : `Land: ${item.land_id}`}
                  </p>
                  <p className="text-dark-600 mt-0.5">
                    {layer === 'cases' ? `${item.district} · ${item.category}` : `${item.latitude?.toFixed(4)}, ${item.longitude?.toFixed(4)}`}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 card border-brand-500/20 bg-brand-600/5">
        <p className="text-xs text-dark-400">
          <strong className="text-brand-300">Live Data:</strong> Showing {geoPoints.length} real land parcels from <code className="text-brand-400 bg-dark-800 px-1 rounded">land_geospatial</code> table
          and {cases.length} dispute cases from <code className="text-brand-400 bg-dark-800 px-1 rounded">cases_raw</code> table in Supabase.
        </p>
      </div>
    </div>
  )
}

export default MapPage
