import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import Layout from './components/Layout/Layout'
// import Login from './pages/Auth/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import StrategyPillars from './pages/StrategyPillars/StrategyPillars'
import CreateStrategyPillar from './pages/StrategyPillars/CreateStrategyPillar'
import EditStrategyPillar from './pages/StrategyPillars/EditStrategyPillar'
import MustWins from './pages/MustWins/MustWins'
import CreateMustWin from './pages/MustWins/CreateMustWin'
import EditMustWin from './pages/MustWins/EditMustWin'
import UpdateMustWinProgress from './pages/MustWins/UpdateMustWinProgress'
import KeyActivities from './pages/KeyActivities/KeyActivities'
import CreateKeyActivity from './pages/KeyActivities/CreateKeyActivity'
import KeyActivityDetail from './pages/KeyActivities/KeyActivityDetail'
import SubTasks from './pages/SubTasks/SubTasks'
import CreateSubTask from './pages/SubTasks/CreateSubTask'
import UpdateSubTaskProgress from './pages/SubTasks/UpdateSubTaskProgress'

function App() {
  // Temporarily disable authentication for development
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Strategy Pillars Routes */}
          <Route path="/strategy-pillars" element={<StrategyPillars />} />
          <Route path="/strategy-pillars/create" element={<CreateStrategyPillar />} />
          <Route path="/strategy-pillars/:id/edit" element={<EditStrategyPillar />} />
          
          {/* Must-Wins Routes */}
          <Route path="/must-wins" element={<MustWins />} />
          <Route path="/must-wins/create" element={<CreateMustWin />} />
          <Route path="/must-wins/:id/edit" element={<EditMustWin />} />
          <Route path="/must-wins/progress" element={<UpdateMustWinProgress />} />
          
          {/* Key Activities Routes */}
          <Route path="/key-activities" element={<KeyActivities />} />
          <Route path="/key-activities/create" element={<CreateKeyActivity />} />
          <Route path="/key-activities/:id" element={<KeyActivityDetail />} />
          
          {/* Sub-tasks Routes */}
          <Route path="/sub-tasks" element={<SubTasks />} />
          <Route path="/sub-tasks/create" element={<CreateSubTask />} />
          <Route path="/sub-tasks/:activityId/progress" element={<UpdateSubTaskProgress />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
