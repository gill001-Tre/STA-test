import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useYear } from '@/contexts/YearContext'
import { loadFromYearStorage, saveToYearStorage, STORAGE_KEYS } from '@/utils/storageHelper'

interface SubTask {
  id: number
  number: string
  title: string
  description: string
  deadline: string
  assignedTo: string
  assignedToAvatar: string
  keyActivity: string
  assignedKeyActivityId?: number
}

interface KeyActivity {
  id: number
  title: string
  assignedMustWin?: number
}

interface MustWin {
  id: number
  title: string
}

const SubTasks = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedYear } = useYear()
  const [searchParams] = useSearchParams()
  const [selectedActivityId, setSelectedActivityId] = useState<number | string>('')
  const [allSubTasks, setAllSubTasks] = useState<SubTask[]>([])
  const [keyActivities, setKeyActivities] = useState<KeyActivity[]>([])
  const [mustWins, setMustWins] = useState<MustWin[]>([])

  // Load must-wins from year-aware storage
  useEffect(() => {
    const stored = loadFromYearStorage(STORAGE_KEYS.MUST_WINS, selectedYear)
    if (stored) {
      try {
        setMustWins(stored)
      } catch (e) {
        console.error('Failed to parse must-wins:', e)
      }
    }
  }, [selectedYear])

  // Load key activities from year-aware storage
  useEffect(() => {
    const stored = loadFromYearStorage(STORAGE_KEYS.KEY_ACTIVITIES, selectedYear)
    if (stored) {
      try {
        setKeyActivities(stored)
      } catch (e) {
        console.error('Failed to parse key activities:', e)
      }
    }
  }, [selectedYear])

  // Set default activity to first available key activity
  useEffect(() => {
    if (keyActivities.length > 0 && !selectedActivityId) {
      setSelectedActivityId(keyActivities[0].id)
      navigate(`/sub-tasks?keyActivityId=${keyActivities[0].id}`)
    }
  }, [keyActivities])

  // Load sub-tasks from year-aware storage
  useEffect(() => {
    const loadSubTasks = () => {
      const stored = loadFromYearStorage(STORAGE_KEYS.SUB_TASKS, selectedYear)
      if (stored) {
        try {
          const parsed = stored
          setAllSubTasks(parsed)
        } catch (e) {
          console.error('Failed to parse sub-tasks:', e)
        }
      }
    }
    loadSubTasks()
  }, [selectedYear])

  // Reload when navigating back to this page
  useEffect(() => {
    const loadSubTasks = () => {
      const stored = loadFromYearStorage(STORAGE_KEYS.SUB_TASKS, selectedYear)
      if (stored) {
        try {
          const parsed = stored
          setAllSubTasks(parsed)
        } catch (e) {
          console.error('Failed to parse sub-tasks:', e)
        }
      }
    }
    loadSubTasks()
  }, [location.pathname])

  // Sync filter from URL params
  useEffect(() => {
    const keyActivityFromUrl = searchParams.get('keyActivityId')
    if (keyActivityFromUrl) {
      setSelectedActivityId(Number(keyActivityFromUrl))
    }
  }, [searchParams])

  // Filter sub-tasks based on selected key activity
  const subTasks = !selectedActivityId 
    ? allSubTasks 
    : allSubTasks.filter(task => Number(task.assignedKeyActivityId) === Number(selectedActivityId))

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
  }

  const handleDeleteTask = (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this sub-task? This action cannot be undone.')) {
      const updatedTasks = allSubTasks.filter(task => task.id !== taskId)
      setAllSubTasks(updatedTasks)
      saveToYearStorage(STORAGE_KEYS.SUB_TASKS, updatedTasks, selectedYear)
    }
  }

  // Create grouped options for dropdown (Win -> Key Activities)
  const groupedKeyActivities = mustWins.map(win => ({
    win,
    activities: keyActivities.filter(ka => Number(ka.assignedMustWin) === win.id)
  })).filter(group => group.activities.length > 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section with Action Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sub-tasks</h1>
              <p className="text-gray-600">Track and manage sub-tasks for activities</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/sub-tasks/create${selectedActivityId ? `?keyActivityId=${selectedActivityId}` : ''}`)}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium whitespace-nowrap"
              >
                Create Sub-task
              </button>
              
              <button
                onClick={() => navigate(`/sub-tasks/progress${selectedActivityId ? `?keyActivityId=${selectedActivityId}` : ''}`)}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium whitespace-nowrap"
              >
                Update Progress
              </button>
              
              <select
                value={selectedActivityId}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  setSelectedActivityId(value)
                  navigate(`/sub-tasks?keyActivityId=${value}`)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                {groupedKeyActivities.map(group => (
                  <optgroup key={group.win.id} label={`W${group.win.id} - ${group.win.title}`}>
                    {group.activities.map((activity, index) => (
                      <option key={activity.id} value={activity.id}>
                        K{index + 1} - {activity.title}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Display selected filter info */}
        {selectedActivityId && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              {(() => {
                const activity = keyActivities.find(ka => ka.id === selectedActivityId)
                if (!activity) return ''
                const win = mustWins.find(w => w.id === activity.assignedMustWin)
                return `Win: W${activity.assignedMustWin} - ${win?.title} | Key Activity: ${activity.title}`
              })()}
            </p>
          </div>
        )}

        {/* Sub-tasks Grid */}
        <div className="space-y-4">
          {subTasks.length > 0 ? (
            subTasks.map((subTask, index) => (
              <div
                key={subTask.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:shadow-orange-200 transition-all p-6"
              >
                <div className="flex items-center justify-between">
                  {/* Left Side - Badge, Title, Description */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0">
                      T{index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {subTask.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {subTask.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Side - Deadline, Assigned, Edit */}
                  <div className="flex items-center gap-8 ml-8">
                    {/* Deadline */}
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Deadline</span>
                      </div>
                      <p className="font-medium text-gray-900">{formatDeadline(subTask.deadline)}</p>
                    </div>

                    {/* Assigned */}
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Assigned to</p>
                      <div className="flex items-center justify-center">
                        <div 
                          className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-semibold cursor-pointer"
                          title={subTask.assignedTo}
                        >
                          {subTask.assignedToAvatar}
                        </div>
                      </div>
                    </div>

                    {/* Edit Icon */}
                    <button
                      onClick={() => navigate(`/sub-tasks/update?id=${subTask.id}${selectedActivityId ? `&keyActivityId=${selectedActivityId}` : ''}`)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    {/* Delete Icon */}
                    <button
                      onClick={() => handleDeleteTask(subTask.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No sub-tasks found for the selected key activity.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SubTasks
