import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Shield, AlertTriangle, CheckCircle, Clock, Briefcase, TrendingUp, Brain, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCaseStats, useCases } from '../../hooks/useCases'
import { getStatusClass, getPriorityClass, formatDate } from '../../utils/helpers'

const COLORS = ['#f59f00', '#e03131', '#40c057', '#4c6ef5', '#fd7e14', '#228be6']

const monthlyData = [
  { month: 'Mar', filed: 14, resolved: 9 },
  { month: 'Apr', filed: 21, resolved: 12 },
  { month: 'May', filed: 17, resolved: 15 },
  { month: 'Jun', filed: 25, resolved: 14 },
  { month: 'Jul', filed: 20, resolved: 18 },
  { month: 'Aug', filed: 28, resolved: 21 },
]

const AI_INSIGHTS = [
  { type: 'warning', text: 'Tribal land violation cases up 34% in West Singhbhum this quarter. Recommend increased field monitoring.' },
  { type: 'info', text: 'Boundary dispute resolution rate improved by 18% following Fast-Track Court deployment in Dhanbad.' },
  { type: 'alert', text: '5 critical cases have next hearings within 7 days. 2 require urgent evidence submission.' },
  { type: 'info', text: 'Satellite-detected forest encroachments: 3 new parcels flagged in Gumla district (Netarhat area).' },
]

const Tooltip_ = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl px-4 py-3 text-xs border border-white/10">
      <p className="text-dark-300 font-semibold mb-1">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>)}
    </div>
  )
}

const GovDashboard = () => {
  const { stats, loading: sLoading } = useCaseStats()
  const { cases, loading: cLoading } = useCases({ limit: 100 })

  const criticalQueue = cases
    .filter(c => (c.priority === 'CRITICAL' || c.priority === 'HIGH') && c.status === 'ACTIVE')
    .slice(0, 5)

  const districtData = stats
    ? Object.entries(stats.byDistrict).map(([name, value]) => ({ name, value }))
    : []

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={20} className="text-amber-400" />
          <h1 className="page-title !mb-0">Government <span className="text-amber-400">Intelligence Dashboard</span></h1>
        </div>
        <p className="page-subtitle">Operational overview for authorized Jharkhand Revenue & Land Administration</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Cases', value: stats?.totalCases, icon: Briefcase, color: 'text-amber-400', bg: 'bg-amber-600/10 border-amber-500/20' },
          { label: 'Active Cases', value: stats?.activeCases, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-600/10 border-blue-500/20' },
          { label: 'Critical Priority', value: stats?.criticalCases, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-600/10 border-red-500/20' },
          { label: 'Resolved', value: stats?.resolvedCases, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-600/10 border-green-500/20' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`card border ${bg}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-xl border ${bg} flex items-center justify-center`}>
                <Icon size={16} className={color} />
              </div>
            </div>
            {sLoading
              ? <div className="h-8 bg-dark-800 rounded w-1/3 animate-pulse mb-1" />
              : <p className={`text-3xl font-extrabold ${color} mb-1 tabular-nums`}>{value ?? '—'}</p>
            }
            <p className="text-white font-semibold text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts + AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Monthly trend */}
        <div className="card lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-amber-400" />
            <h2 className="text-sm font-semibold text-white">Monthly Filing Trend</h2>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="gFiled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59f00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59f00" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#40c057" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#40c057" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#868e96', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#868e96', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tooltip_ />} />
              <Area type="monotone" dataKey="filed" name="Filed" stroke="#f59f00" fill="url(#gFiled)" strokeWidth={2} />
              <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#40c057" fill="url(#gResolved)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insights */}
        <div className="card border-amber-500/20 bg-amber-600/5">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={14} className="text-amber-400" />
            <h2 className="text-sm font-semibold text-white">AI Insights</h2>
            <span className="ml-auto text-xs px-2 py-0.5 bg-amber-600/20 text-amber-300 rounded-full border border-amber-500/30">Live</span>
          </div>
          <div className="space-y-3">
            {AI_INSIGHTS.map((ins, i) => (
              <div key={i} className={`p-3 rounded-xl text-xs leading-relaxed border ${
                ins.type === 'warning' ? 'bg-orange-600/10 border-orange-500/20 text-orange-300' :
                ins.type === 'alert' ? 'bg-red-600/10 border-red-500/20 text-red-300' :
                'bg-dark-800/50 border-white/5 text-dark-300'
              }`}>
                {ins.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* District Chart */}
      <div className="card mb-8">
        <h2 className="text-sm font-semibold text-white mb-4">Cases by District</h2>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={districtData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: '#868e96', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#868e96', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<Tooltip_ />} />
            <Bar dataKey="value" name="Cases" radius={[4, 4, 0, 0]}>
              {districtData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* High Priority Queue */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-400" />
            High Priority Queue
          </h2>
          <Link to="/gov/cases" id="gov-view-all-cases" className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="card overflow-x-auto">
          {cLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-10 bg-dark-800 rounded animate-pulse" />)}
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  {['Case Number', 'Title', 'District', 'Status', 'Priority', 'Next Hearing'].map(h => (
                    <th key={h} className="text-left text-dark-500 font-semibold pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {criticalQueue.map((c, i) => (
                  <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="py-3 pr-4 font-mono text-dark-400">{c.caseNumber}</td>
                    <td className="py-3 pr-4 text-white font-medium max-w-[180px] truncate">{c.title}</td>
                    <td className="py-3 pr-4 text-dark-400">{c.district}</td>
                    <td className="py-3 pr-4"><span className={getStatusClass(c.status)}>{c.status}</span></td>
                    <td className="py-3 pr-4"><span className={getPriorityClass(c.priority)}>{c.priority}</span></td>
                    <td className="py-3 text-dark-400">{formatDate(c.hearingDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default GovDashboard
