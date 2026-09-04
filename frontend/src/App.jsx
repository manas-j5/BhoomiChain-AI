import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CaseSearch from './pages/CaseSearch'
import CaseDetails from './pages/CaseDetails'
import MapPage from './pages/MapPage'
import AIChat from './pages/AIChat'
import Reports from './pages/Reports'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="cases" element={<CaseSearch />} />
          <Route path="cases/:id" element={<CaseDetails />} />
          <Route path="map" element={<MapPage />} />
          <Route path="ai-chat" element={<AIChat />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
