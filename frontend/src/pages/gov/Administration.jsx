import { useState } from 'react'
import { Settings, Users, Shield, Eye, Clock, CheckCircle, AlertTriangle, Search } from 'lucide-react'

const MOCK_USERS = [
  { id: 1, name: 'Suresh Kumar IAS', email: 'officer1@gov.in', role: 'REVENUE_OFFICER', district: 'Ranchi', status: 'active', lastLogin: '2024-08-06 09:15' },
  { id: 2, name: 'Priya Singh', email: 'analyst@gov.in', role: 'ANALYST', district: 'Khunti', status: 'active', lastLogin: '2024-08-05 14:30' },
  { id: 3, name: 'Rajesh Mahto', email: 'policy@gov.in', role: 'POLICY_MAKER', district: 'State', status: 'active', lastLogin: '2024-08-04 11:00' },
  { id: 4, name: 'Anita Devi', email: 'officer2@gov.in', role: 'REVENUE_OFFICER', district: 'Dhanbad', status: 'inactive', lastLogin: '2024-07-20 08:45' },
  { id: 5, name: 'Vikram Oraon', email: 'tribal@gov.in', role: 'ANALYST', district: 'Gumla', status: 'active', lastLogin: '2024-08-06 10:30' },
]

const AUDIT_LOGS = [
  { id: 1, user: 'Suresh Kumar', action: 'Viewed Case CASE-2024-002', type: 'VIEW', time: '10 min ago', severity: 'info' },
  { id: 2, user: 'Priya Singh', action: 'Exported Report: District Q2', type: 'EXPORT', time: '1 hour ago', severity: 'warn' },
  { id: 3, user: 'Rajesh Mahto', action: 'Ran Policy Simulation: Ranchi', type: 'SIMULATION', time: '3 hours ago', severity: 'info' },
  { id: 4, user: 'System', action: 'Failed login attempt: unknown@test.com', type: 'AUTH_FAIL', time: '5 hours ago', severity: 'alert' },
  { id: 5, user: 'Vikram Oraon', action: 'Uploaded: FRA_Claims_Gumla.xlsx', type: 'UPLOAD', time: '6 hours ago', severity: 'info' },
  { id: 6, user: 'Suresh Kumar', action: 'Changed role: Anita Devi → INACTIVE', type: 'ADMIN', time: '1 day ago', severity: 'warn' },
]

const ROLES = ['REVENUE_OFFICER', 'ANALYST', 'POLICY_MAKER', 'ADMINISTRATOR']

const Administration = () => {
  const [tab, setTab] = useState('users')
  const [userSearch, setUserSearch] = useState('')
  const [userRoles, setUserRoles] = useState(() => Object.fromEntries(MOCK_USERS.map(u => [u.id, u.role])))

  const filteredUsers = MOCK_USERS.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  const tabs = [
    { key: 'users', label: 'User Management', icon: Users },
    { key: 'audit', label: 'Audit Logs', icon: Eye },
    { key: 'system', label: 'System Settings', icon: Settings },
  ]

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Settings size={20} className="text-amber-400" />
          <h1 className="page-title !mb-0"><span className="text-amber-400">Administration</span> Panel</h1>
        </div>
        <p className="page-subtitle">Manage users, roles, permissions, and view the system audit log</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            id={`admin-tab-${key}`}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === key ? 'bg-amber-600/20 border border-amber-500/30 text-amber-300' : 'glass glass-hover text-dark-400'
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 glass rounded-xl px-4 py-2.5 flex-1 max-w-sm">
              <Search size={14} className="text-dark-500" />
              <input
                id="user-search"
                type="text"
                placeholder="Search users…"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="bg-transparent outline-none text-sm text-dark-200 placeholder-dark-500 w-full"
              />
            </div>
            <button id="invite-user-btn" className="btn-primary text-sm flex items-center gap-2">
              <Users size={14} /> Invite User
            </button>
          </div>

          <div className="card overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  {['Name', 'Email', 'Role', 'District', 'Status', 'Last Login'].map(h => (
                    <th key={h} className="text-left text-dark-500 font-semibold pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="text-white font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-dark-400 font-mono">{u.email}</td>
                    <td className="py-3 pr-4">
                      <select
                        value={userRoles[u.id]}
                        onChange={e => setUserRoles(r => ({ ...r, [u.id]: e.target.value }))}
                        className="bg-dark-800 text-xs text-dark-200 border border-white/10 rounded-lg px-2 py-1 outline-none focus:border-amber-500/50"
                      >
                        {ROLES.map(r => <option key={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="py-3 pr-4 text-dark-400">{u.district}</td>
                    <td className="py-3 pr-4">
                      <span className={`badge ${u.status === 'active' ? 'badge-active' : 'badge-dismissed'}`}>{u.status}</span>
                    </td>
                    <td className="py-3 text-dark-500">{u.lastLogin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Log Tab */}
      {tab === 'audit' && (
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <Eye size={14} className="text-amber-400" />
            <h2 className="text-sm font-semibold text-white">System Audit Log</h2>
            <span className="ml-auto text-xs text-dark-500">Last 24 hours</span>
          </div>
          <div className="space-y-2">
            {AUDIT_LOGS.map(log => (
              <div key={log.id} className={`flex items-start gap-3 p-3 rounded-xl border ${
                log.severity === 'alert' ? 'bg-red-600/8 border-red-500/20' :
                log.severity === 'warn' ? 'bg-yellow-600/8 border-yellow-500/20' :
                'bg-dark-900/30 border-white/5'
              }`}>
                {log.severity === 'alert' ? <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" /> :
                 log.severity === 'warn' ? <Clock size={14} className="text-yellow-400 shrink-0 mt-0.5" /> :
                 <CheckCircle size={14} className="text-green-400 shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium">{log.action}</p>
                  <p className="text-dark-500 text-xs mt-0.5">{log.user} · {log.type}</p>
                </div>
                <span className="text-dark-600 text-xs shrink-0">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Settings Tab */}
      {tab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { title: 'Authentication', items: ['JWT Token Expiry: 7 days', 'MFA: Disabled (Phase 4)', 'SSO Integration: Not configured'] },
            { title: 'AI Engine', items: ['Status: Disconnected (Phase 2)', 'Model: GPT-4 (planned)', 'RAG Pipeline: Not active'] },
            { title: 'GIS Engine', items: ['PostGIS: Not connected', 'Mock GeoJSON: Active', 'Satellite Layer: Disabled'] },
            { title: 'Blockchain', items: ['Provider: Mock (Phase 4)', 'Hash Anchoring: Disabled', 'Verify Endpoint: /api/provenance'] },
          ].map(({ title, items }) => (
            <div key={title} className="card">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Shield size={14} className="text-amber-400" /> {title}
              </h3>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item} className="text-xs text-dark-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-dark-600 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Administration
