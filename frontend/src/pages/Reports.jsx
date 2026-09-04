import {
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { BarChart3, Download, TrendingUp } from 'lucide-react'
import { useCaseStats } from '../hooks/useCases'

const COLORS = ['#4c6ef5', '#f59f00', '#40c057', '#e03131', '#228be6', '#fd7e14']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl px-4 py-3 text-xs border border-white/10">
      <p className="text-dark-300 font-semibold mb-1">{label || payload[0]?.payload?.name}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || COLORS[0] }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  )
}

const Reports = () => {
  const { stats, loading } = useCaseStats()

  const categoryData = stats
    ? Object.entries(stats.byCategory).map(([name, value]) => ({ name, value }))
    : []

  const districtData = stats
    ? Object.entries(stats.byDistrict).map(([name, cases]) => ({ name, cases }))
    : []

  const statusData = stats
    ? [
        { name: 'Active', value: stats.activeCases, fill: '#4c6ef5' },
        { name: 'Pending', value: stats.pendingCases, fill: '#f59f00' },
        { name: 'Resolved', value: stats.resolvedCases, fill: '#40c057' },
      ]
    : []

  const radarData = categoryData.map(c => ({ subject: c.name, cases: c.value, fullMark: 10 }))

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-dark-800 rounded w-1/3" />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-dark-800 rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <BarChart3 size={22} className="text-brand-400" />
            Analytics & Reports
          </h1>
          <p className="page-subtitle">Comprehensive land dispute analytics for Jharkhand</p>
        </div>
        <button id="export-report-btn" className="btn-primary flex items-center gap-2 text-sm">
          <Download size={15} /> Export PDF
        </button>
      </div>

      {/* Summary stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Cases', value: stats?.totalCases, color: 'text-brand-400' },
          { label: 'Active', value: stats?.activeCases, color: 'text-blue-400' },
          { label: 'Resolved', value: stats?.resolvedCases, color: 'text-green-400' },
          { label: 'Critical', value: stats?.criticalCases, color: 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center">
            <p className={`text-3xl font-bold ${color} mb-1`}>{value ?? '—'}</p>
            <p className="text-xs text-dark-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* District breakdown */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={15} className="text-brand-400" />
            <h2 className="text-sm font-semibold text-white">Cases by District</h2>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={districtData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#868e96', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#868e96', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cases" name="Cases" radius={[4, 4, 0, 0]}>
                {districtData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status donut */}
        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-4">Case Status Distribution</h2>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {statusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-4">Dispute Categories</h2>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value">
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span style={{ color: '#adb5bd', fontSize: 11 }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Radar chart */}
        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-4">Category Radar</h2>
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={80}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#868e96', fontSize: 10 }} />
              <Radar name="Cases" dataKey="cases" stroke="#4c6ef5" fill="#4c6ef5" fillOpacity={0.25} strokeWidth={2} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Integration note */}
      <div className="card border-brand-500/20 bg-brand-600/5">
        <p className="text-xs text-dark-400">
          <strong className="text-brand-300">Full Reports:</strong> Detailed PDF reports with AI-generated summaries,
          GIS heatmaps, and blockchain verification audit trails will be available once all feature branches are integrated into <code className="text-brand-400 bg-dark-800 px-1 rounded">develop</code>.
        </p>
      </div>
    </div>
  )
}

export default Reports
