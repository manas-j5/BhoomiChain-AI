import { useEffect, useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Briefcase, AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import CaseCard from '../components/CaseCard'
import { useCaseStats, useCases } from '../hooks/useCases'
import { formatDate } from '../utils/helpers'

// Chart data — enhanced once live API is connected
const monthlyData = [
  { month: 'Mar', filed: 12, resolved: 8 },
  { month: 'Apr', filed: 19, resolved: 11 },
  { month: 'May', filed: 15, resolved: 14 },
  { month: 'Jun', filed: 22, resolved: 13 },
  { month: 'Jul', filed: 18, resolved: 16 },
  { month: 'Aug', filed: 24, resolved: 19 },
]

const COLORS = ['#4c6ef5', '#f59f00', '#40c057', '#e03131', '#228be6', '#fd7e14']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl px-4 py-3 text-xs border border-white/10">
      <p className="text-dark-300 font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  )
}

const Dashboard = () => {
  const { stats, loading: statsLoading } = useCaseStats()
  const { cases, loading: casesLoading } = useCases({ limit: 3 })

  const categoryData = stats
    ? Object.entries(stats.byCategory).map(([name, value]) => ({ name, value }))
    : []

  const districtData = stats
    ? Object.entries(stats.byDistrict).map(([name, value]) => ({ name, value }))
    : []

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="page-title">
          Land Governance <span className="text-gradient">Intelligence Dashboard</span>
        </h1>
        <p className="page-subtitle">
          Real-time overview of land disputes across Jharkhand — BhoomiChain AI Platform
        </p>
      </div>

      {/* KPI stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Cases"
          value={stats?.totalCases}
          subtitle="All registered disputes"
          icon={Briefcase}
          color="brand"
        />
        <StatCard
          title="Active Cases"
          value={stats?.activeCases}
          subtitle="Currently in proceedings"
          icon={Clock}
          color="blue"
          trend={12}
        />
        <StatCard
          title="Critical Priority"
          value={stats?.criticalCases}
          subtitle="Requires urgent attention"
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Resolved"
          value={stats?.resolvedCases}
          subtitle="Successfully closed"
          icon={CheckCircle}
          color="green"
          trend={8}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Monthly trend */}
        <div className="card lg:col-span-2">
          <h2 className="text-sm font-semibold text-white mb-4">Cases Filed vs Resolved (Monthly)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="gradFiled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4c6ef5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4c6ef5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#40c057" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#40c057" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#868e96', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#868e96', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#868e96' }} />
              <Area type="monotone" dataKey="filed" name="Filed" stroke="#4c6ef5" fill="url(#gradFiled)" strokeWidth={2} />
              <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#40c057" fill="url(#gradResolved)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-4">Cases by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {categoryData.slice(0, 4).map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-dark-400">{item.name}</span>
                </div>
                <span className="text-white font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* District bar chart */}
      <div className="card mb-8">
        <h2 className="text-sm font-semibold text-white mb-4">Cases by District</h2>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={districtData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: '#868e96', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#868e96', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" name="Cases" radius={[4, 4, 0, 0]}>
              {districtData.map((_, index) => (
                <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent cases */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Recent Cases</h2>
          <Link
            to="/cases"
            id="view-all-cases-link"
            className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>
        {casesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-dark-800 rounded w-3/4 mb-3" />
                <div className="h-3 bg-dark-800 rounded w-1/2 mb-4" />
                <div className="h-20 bg-dark-800 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cases.map(c => <CaseCard key={c.id} caseData={c} />)}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
