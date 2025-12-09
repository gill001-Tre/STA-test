import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import RoleSelection from './pages/Auth/RoleSelection';
import Dashboard from './pages/Dashboard/Dashboard';
import StrategyPillars from './pages/StrategyPillars/StrategyPillars';
import CreateStrategyPillar from './pages/StrategyPillars/CreateStrategyPillar';
import EditStrategyPillar from './pages/StrategyPillars/EditStrategyPillar';
import MustWins from './pages/MustWins/MustWins';
import CreateMustWin from './pages/MustWins/CreateMustWin';
import EditMustWin from './pages/MustWins/EditMustWin';
import UpdateMustWinProgress from './pages/MustWins/UpdateMustWinProgress';
import KeyActivities from './pages/KeyActivities/KeyActivities';
import CreateKeyActivity from './pages/KeyActivities/CreateKeyActivity';
import UpdateKeyActivity from './pages/KeyActivities/UpdateKeyActivity';
import UpdateKeyActivitiesProgress from './pages/KeyActivities/UpdateKeyActivitiesProgress';
import KeyActivityDetail from './pages/KeyActivities/KeyActivityDetail';
import SubTasks from './pages/SubTasks/SubTasks';
import CreateSubTask from './pages/SubTasks/CreateSubTask';
import UpdateSubTask from './pages/SubTasks/UpdateSubTask';
import UpdateSubTaskProgress from './pages/SubTasks/UpdateSubTaskProgress';
import DataCheck from './pages/Debug/DataCheck';

/**
 * Protected Route Component
 * Redirects to login if not authenticated
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, needsRoleSelection } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated && !needsRoleSelection) {
    return <Navigate to="/login" replace />;
  }

  // Show role selection for first-time users
  if (needsRoleSelection) {
    return <RoleSelection />;
  }

  return <>{children}</>;
};

function App() {
  const { isAuthenticated, loading, needsRoleSelection } = useAuth();

  // Show loading screen during initial auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route: Login */}
        <Route
          path="/login" 
          element={
            // Redirect away from login if authenticated OR needs role selection
            (isAuthenticated || needsRoleSelection) ? <Navigate to="/" replace /> : <Login />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
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
                  <Route path="/key-activities/update" element={<UpdateKeyActivity />} />
                  <Route path="/key-activities/:id" element={<KeyActivityDetail />} />
                  <Route path="/key-activities/progress" element={<UpdateKeyActivitiesProgress />} />

                  {/* Sub-tasks Routes */}
                  <Route path="/sub-tasks" element={<SubTasks />} />
                  <Route path="/sub-tasks/create" element={<CreateSubTask />} />
                  <Route path="/sub-tasks/update" element={<UpdateSubTask />} />
                  <Route path="/sub-tasks/progress" element={<UpdateSubTaskProgress />} />

                  {/* Debug Route */}
                  <Route path="/debug/data-check" element={<DataCheck />} />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
