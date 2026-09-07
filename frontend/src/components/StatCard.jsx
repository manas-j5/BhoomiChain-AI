import { TrendingUp, TrendingDown } from 'lucide-react'

const colorMap = {
  brand: { bg: 'bg-brand-600/10', border: 'border-brand-500/20', text: 'text-brand-400' },
  blue:  { bg: 'bg-blue-600/10',  border: 'border-blue-500/20',  text: 'text-blue-400'  },
  red:   { bg: 'bg-red-600/10',   border: 'border-red-500/20',   text: 'text-red-400'   },
  green: { bg: 'bg-green-600/10', border: 'border-green-500/20', text: 'text-green-400' },
  amber: { bg: 'bg-amber-600/10', border: 'border-amber-500/20', text: 'text-amber-400' },
}

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'brand', trend }) => {
  const c = colorMap[color] || colorMap.brand

  // Loading skeleton
  if (value === undefined || value === null) {
    return (
      <div className="stat-card animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-dark-800 rounded-xl" />
          <div className="w-12 h-4 bg-dark-800 rounded" />
        </div>
        <div className="h-8 bg-dark-800 rounded w-1/3 mb-2" />
        <div className="h-3 bg-dark-800 rounded w-2/3 mb-1" />
        <div className="h-3 bg-dark-800 rounded w-1/2" />
      </div>
    )
  }

  return (
    <div className={`stat-card border ${c.border} group hover:border-opacity-80 transition-all duration-300`}>
      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
          <Icon size={18} className={c.text} />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
            trend >= 0 ? 'text-green-400 bg-green-500/10 border border-green-500/20' : 'text-red-400 bg-red-500/10 border border-red-500/20'
          }`}>
            {trend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      {/* Value */}
      <p className={`text-3xl font-extrabold ${c.text} mb-1 tabular-nums`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="text-white font-semibold text-sm mb-0.5">{title}</p>
      {subtitle && <p className="text-dark-500 text-xs">{subtitle}</p>}
    </div>
  )
}

export default StatCard
