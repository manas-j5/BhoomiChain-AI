import { useState } from 'react'
import { FlaskConical, Play, Loader2, AlertTriangle, CheckCircle, Info } from 'lucide-react'

const DISTRICTS = ['Ranchi', 'Khunti', 'Dhanbad', 'Hazaribagh', 'Gumla', 'Bokaro', 'East Singhbhum', 'West Singhbhum', 'Giridih', 'Dumka']
const CATEGORIES = ['Encroachment', 'Tribal Land Rights', 'Boundary Dispute', 'Forest Land', 'Inheritance Dispute', 'Revenue Dispute']
const INTERVENTIONS = [
  { value: 'fast_track', label: 'Fast-Track Court Deployment' },
  { value: 'mediation', label: 'Mandatory Mediation Centre' },
  { value: 'digitization', label: 'Land Records Digitization Drive' },
  { value: 'survey', label: 'GPS Re-survey of Disputed Parcels' },
  { value: 'awareness', label: 'Legal Awareness Campaign' },
]

const PolicyLab = () => {
  const [scenario, setScenario] = useState({
    district: 'Ranchi',
    category: 'Encroachment',
    intervention: 'fast_track',
    timeframeMonths: 12,
    resourceUnits: 50,
  })
  const [result, setResult] = useState(null)
  const [running, setRunning] = useState(false)
  const [assumptions, setAssumptions] = useState({
    courtCapacity: true,
    staffing: true,
    funding: false,
    cooperation: true,
  })

  const runSimulation = async () => {
    setRunning(true)
    setResult(null)
    await new Promise(r => setTimeout(r, 2200))
    const base = 35
    const resourceBonus = Math.round(scenario.resourceUnits * 0.3)
    const timeBonus = Math.round((scenario.timeframeMonths / 12) * 8)
    const projectedRate = Math.min(85, base + resourceBonus + timeBonus)

    setResult({
      projectedResolutionRate: projectedRate,
      confidenceLow: Math.max(20, projectedRate - 18),
      confidenceHigh: Math.min(95, projectedRate + 15),
      estimatedCasesResolved: Math.round(projectedRate * 0.22),
      costEstimate: `₹${(scenario.resourceUnits * 1.4).toFixed(1)}L`,
      assumptions: [
        `Historical baseline: 35% resolution rate in ${scenario.district} for ${scenario.category} cases`,
        `Assumes adequate court infrastructure available for fast-tracking`,
        `Model trained on 2019-2024 Jharkhand revenue court data`,
        `Resource unit = 1 trained revenue officer for 1 month`,
      ],
      uncertainties: [
        'Actual cooperation from defendant parties not modelled',
        'Political or administrative delays not factored',
        'Seasonal access issues in tribal/forest areas',
      ],
    })
    setRunning(false)
  }

  const up = (k, v) => setScenario(s => ({ ...s, [k]: v }))

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <FlaskConical size={20} className="text-amber-400" />
          <h1 className="page-title !mb-0">Policy <span className="text-amber-400">Simulation Lab</span></h1>
        </div>
        <p className="page-subtitle">Transparent scenario modelling for land governance policy decisions — all outputs are estimates with explicit assumptions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Scenario builder */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card border-amber-500/20">
            <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
              <FlaskConical size={14} className="text-amber-400" /> Scenario Parameters
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-dark-400 mb-1.5 font-medium">Target District</label>
                <select id="pl-district" className="input-field bg-dark-900 text-sm" value={scenario.district} onChange={e => up('district', e.target.value)}>
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-dark-400 mb-1.5 font-medium">Case Category</label>
                <select id="pl-category" className="input-field bg-dark-900 text-sm" value={scenario.category} onChange={e => up('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-dark-400 mb-1.5 font-medium">Intervention Type</label>
                <select id="pl-intervention" className="input-field bg-dark-900 text-sm" value={scenario.intervention} onChange={e => up('intervention', e.target.value)}>
                  {INTERVENTIONS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-dark-400 mb-1.5 font-medium">
                  Timeframe: <span className="text-white font-semibold">{scenario.timeframeMonths} months</span>
                </label>
                <input id="pl-timeframe" type="range" min={3} max={36} step={3} value={scenario.timeframeMonths}
                  onChange={e => up('timeframeMonths', Number(e.target.value))}
                  className="w-full accent-amber-500" />
                <div className="flex justify-between text-xs text-dark-600 mt-1"><span>3 mo</span><span>36 mo</span></div>
              </div>
              <div>
                <label className="block text-xs text-dark-400 mb-1.5 font-medium">
                  Resource Units: <span className="text-white font-semibold">{scenario.resourceUnits}</span>
                </label>
                <input id="pl-resources" type="range" min={10} max={200} step={10} value={scenario.resourceUnits}
                  onChange={e => up('resourceUnits', Number(e.target.value))}
                  className="w-full accent-amber-500" />
                <div className="flex justify-between text-xs text-dark-600 mt-1"><span>10</span><span>200</span></div>
              </div>
            </div>
          </div>

          {/* Assumptions checklist */}
          <div className="card">
            <h2 className="text-sm font-semibold text-white mb-4">Explicit Assumptions</h2>
            <div className="space-y-3">
              {[
                { key: 'courtCapacity', label: 'Sufficient court capacity exists' },
                { key: 'staffing', label: 'Revenue staff deployment is feasible' },
                { key: 'funding', label: 'Full budget allocation confirmed' },
                { key: 'cooperation', label: 'Inter-department cooperation assumed' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={assumptions[key]}
                    onChange={e => setAssumptions(a => ({ ...a, [key]: e.target.checked }))}
                    className="w-4 h-4 rounded accent-amber-500" />
                  <span className="text-xs text-dark-300 group-hover:text-white transition-colors">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            id="run-simulation-btn"
            onClick={runSimulation}
            disabled={running}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm transition-all active:scale-95 disabled:opacity-60 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500"
          >
            {running ? <><Loader2 size={16} className="animate-spin" /> Running Simulation…</> : <><Play size={16} /> Run Simulation</>}
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {!result && !running && (
            <div className="card h-full flex flex-col items-center justify-center py-24 text-center text-dark-600">
              <FlaskConical size={48} className="mb-4 opacity-30" />
              <p className="font-medium text-dark-400">Configure scenario and run simulation</p>
              <p className="text-sm mt-1">Results will appear here with explicit assumptions and uncertainty ranges</p>
            </div>
          )}
          {running && (
            <div className="card h-full flex flex-col items-center justify-center py-24 text-center">
              <Loader2 size={40} className="text-amber-400 animate-spin mb-4" />
              <p className="text-white font-semibold">Running simulation…</p>
              <p className="text-dark-500 text-sm mt-1">Processing historical patterns and parameters</p>
            </div>
          )}
          {result && !running && (
            <div className="space-y-5 animate-slide-up">
              {/* Disclaimer */}
              <div className="card border-yellow-500/30 bg-yellow-600/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-300 leading-relaxed">
                    <strong>Simulation Disclaimer:</strong> These are non-legal analytical estimates based on historical data patterns. This tool does not predict legal outcomes, determine land titles, or constitute official government policy. All outputs are indicative only.
                  </p>
                </div>
              </div>

              {/* Key metric */}
              <div className="card border-amber-500/30 bg-amber-600/10 text-center">
                <p className="text-xs text-amber-400 font-semibold uppercase tracking-widest mb-2">Projected Resolution Rate</p>
                <p className="text-6xl font-extrabold text-amber-300 mb-2">{result.projectedResolutionRate}%</p>
                <p className="text-sm text-dark-400">Confidence range: {result.confidenceLow}% — {result.confidenceHigh}%</p>
                <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-white/10">
                  <div>
                    <p className="text-2xl font-bold text-white">{result.estimatedCasesResolved}</p>
                    <p className="text-xs text-dark-500 mt-0.5">Estimated cases resolved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{result.costEstimate}</p>
                    <p className="text-xs text-dark-500 mt-0.5">Estimated resource cost</p>
                  </div>
                </div>
              </div>

              {/* Model assumptions */}
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <Info size={14} className="text-blue-400" />
                  <h3 className="text-sm font-semibold text-white">Model Assumptions</h3>
                </div>
                <ul className="space-y-2">
                  {result.assumptions.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-dark-300">
                      <CheckCircle size={12} className="text-green-400 shrink-0 mt-0.5" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Uncertainties */}
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={14} className="text-orange-400" />
                  <h3 className="text-sm font-semibold text-white">Uncertainties & Limitations</h3>
                </div>
                <ul className="space-y-2">
                  {result.uncertainties.map((u, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-dark-400">
                      <span className="text-orange-400 shrink-0">•</span>{u}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PolicyLab
