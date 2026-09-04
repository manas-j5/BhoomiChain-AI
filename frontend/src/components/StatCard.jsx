const StatCard = ({ title, value, subtitle, icon: Icon, color = 'brand', trend }) => {
  const colorMap = {
    brand: 'from-brand-600/20 to-brand-900/10 border-brand-500/20 text-brand-400',
    blue: 'from-blue-600/20 to-blue-900/10 border-blue-500/20 text-blue-400',
    green: 'from-green-600/20 to-green-900/10 border-green-500/20 text-green-400',
    yellow: 'from-yellow-600/20 to-yellow-900/10 border-yellow-500/20 text-yellow-400',
    red: 'from-red-600/20 to-red-900/10 border-red-500/20 text-red-400',
    cyan: 'from-cyan-600/20 to-cyan-900/10 border-cyan-500/20 text-cyan-400',
  }
  const classes = colorMap[color] || colorMap.brand

  return (
    <div className={`stat-card bg-gradient-to-br ${classes} border animate-slide-up`}>
      {/* Background glow */}
      <div className={`absolute inset-0 rounded-xl opacity-10 bg-gradient-to-br ${classes}`} />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-dark-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-white mb-1">
            {value ?? <span className="animate-pulse text-dark-600">—</span>}
          </p>
          {subtitle && <p className="text-dark-500 text-xs">{subtitle}</p>}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span className={`text-xs font-semibold ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
              <span className="text-dark-600 text-xs">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl bg-current/10 ${colorMap[color]?.split(' ')[3] || 'text-brand-400'}`}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
