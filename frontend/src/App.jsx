import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Layouts
import Layout from './components/Layout'
import GovLayout from './layouts/GovLayout'

// Public pages
import Landing from './pages/Landing'
import Login from './pages/Login'

// User portal pages
import Dashboard from './pages/Dashboard'
import CaseSearch from './pages/CaseSearch'
import CaseDetails from './pages/CaseDetails'
import MapPage from './pages/MapPage'
import AIChat from './pages/AIChat'
import Reports from './pages/Reports'
import ResearchWorkspace from './pages/user/ResearchWorkspace'
import DocumentRepository from './pages/user/DocumentRepository'

// Government portal pages
import GovDashboard from './pages/gov/GovDashboard'
import CaseIntelligence from './pages/gov/CaseIntelligence'
import PolicyLab from './pages/gov/PolicyLab'
import DataUpload from './pages/gov/DataUpload'
import Administration from './pages/gov/Administration'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* User Portal — /user/* */}
          <Route path="/user" element={<Layout />}>
            <Route index element={<Navigate to="/user/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="cases" element={<CaseSearch />} />
            <Route path="cases/:id" element={<CaseDetails />} />
            <Route path="map" element={<MapPage />} />
            <Route path="ai-chat" element={<AIChat />} />
            <Route path="reports" element={<Reports />} />
            <Route path="workspace" element={<ResearchWorkspace />} />
            <Route path="documents" element={<DocumentRepository />} />
          </Route>

          {/* Government Portal — /gov/* */}
          <Route path="/gov" element={<GovLayout />}>
            <Route index element={<Navigate to="/gov/dashboard" replace />} />
            <Route path="dashboard" element={<GovDashboard />} />
            <Route path="cases" element={<CaseIntelligence />} />
            <Route path="map" element={<MapPage />} />
            <Route path="ai-chat" element={<AIChat />} />
            <Route path="reports" element={<Reports />} />
            <Route path="policy-lab" element={<PolicyLab />} />
            <Route path="upload" element={<DataUpload />} />
            <Route path="admin" element={<Administration />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
