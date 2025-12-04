import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useYear } from '@/contexts/YearContext'
import { loadFromYearStorage, saveToYearStorage, STORAGE_KEYS } from '@/utils/storageHelper'

interface SubTask {
  id: number
  number: string
  title: string
  progress: number
  status: 'on-track' | 'in-progress' | 'needs-attention'
  deadline: string
  assignedTo: string
  assignedToAvatar: string
  keyActivity: string
  assignedKeyActivityId?: number
}

const UpdateSubTaskProgress = () => {
  const navigate = useNavigate()
  const { selectedYear } = useYear()
  const [searchParams] = useSearchParams()
  const keyActivityIdFromUrl = searchParams.get('keyActivityId')
  
  const [subTasks, setSubTasks] = useState<SubTask[]>([])
  const [keyActivities, setKeyActivities] = useState<any[]>([])
  const [mustWins, setMustWins] = useState<any[]>([])
  const [selectedActivityId, setSelectedActivityId] = useState<number | string>('')
  
  useEffect(() => {
    loadData()
  }, [selectedYear])

  // Set default activity to first key activity when loaded
  useEffect(() => {
    if (keyActivities.length > 0 && !selectedActivityId && !keyActivityIdFromUrl) {
      const firstActivity = keyActivities[0]
      setSelectedActivityId(firstActivity.id)
    } else if (keyActivityIdFromUrl) {
      setSelectedActivityId(Number(keyActivityIdFromUrl))
    }
  }, [keyActivities])

  const loadData = () => {
    const storedSubTasks = loadFromYearStorage(STORAGE_KEYS.SUB_TASKS, selectedYear)
    const storedActivities = loadFromYearStorage(STORAGE_KEYS.KEY_ACTIVITIES, selectedYear)
    const storedWins = loadFromYearStorage(STORAGE_KEYS.MUST_WINS, selectedYear)
    
    setSubTasks(storedSubTasks || [])
    setKeyActivities(storedActivities || [])
    setMustWins(storedWins || [])
  }

  // Filter tasks by selected key activity
  const filteredSubTasks = selectedActivityId 
    ? subTasks.filter(task => Number(task.assignedKeyActivityId) === Number(selectedActivityId))
    : []

  const handleProgressChange = (id: number, newProgress: number) => {
    setSubTasks(prev => prev.map(task => {
      if (task.id === id) {
        let newStatus: 'on-track' | 'in-progress' | 'needs-attention' = 'needs-attention'
        if (newProgress >= 60) {
          newStatus = 'on-track'
        } else if (newProgress >= 30) {
          newStatus = 'in-progress'
        }
        return { ...task, progress: newProgress, status: newStatus }
      }
      return task
    }))
  }

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-primary'
      case 'in-progress':
        return 'bg-yellow-500'
      case 'needs-attention':
        return 'bg-red-500'
      default:
        return 'bg-gray-400'
    }
  }

  const handleSaveChanges = () => {
    saveToYearStorage(STORAGE_KEYS.SUB_TASKS, subTasks, selectedYear)
    console.log('Progress changes saved:', subTasks)
    navigate(`/sub-tasks?keyActivityId=${selectedActivityId}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  // Get selected activity details
  const selectedActivity = keyActivities.find(a => a.id === Number(selectedActivityId))
  const selectedWin = selectedActivity ? mustWins.find(w => w.id === Number(selectedActivity.assignedMustWin)) : null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Link */}
        <button
          onClick={() => navigate(`/sub-tasks?keyActivityId=${selectedActivityId}`)}
          className="flex items-center gap-1 text-primary hover:text-orange-600 transition-colors mb-4 font-medium"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Update Sub-tasks Progress</h1>
            <select
              value={selectedActivityId}
              onChange={(e) => setSelectedActivityId(Number(e.target.value))}
              className="px-4 py-2.5 border border-primary rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              {mustWins.map((win) => (
                <optgroup key={win.id} label={`Win ${win.id} - ${win.title}`}>
                  {keyActivities
                    .filter(ka => Number(ka.assignedMustWin) === win.id)
                    .map((activity, idx) => (
                      <option key={activity.id} value={activity.id}>
                        K{idx + 1} - {activity.title}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Updating message */}
          {selectedActivity && (
            <p className="text-gray-600 mb-4">
              <span className="font-medium">Updating for:</span> {selectedWin?.title && `Win ${selectedWin.id} → `}{selectedActivity.title}
            </p>
          )}

          {/* Progress Legend */}
          <div className="flex items-center gap-6 text-sm">
            <span className="font-medium text-gray-700">Progress Level:</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span>&gt; 60% - On Track</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>30 - 60% - In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>0 - 29% - Needs Attention</span>
            </div>
          </div>
        </div>

        {/* Sub-tasks Progress List */}
        <div className="space-y-4">
          {filteredSubTasks.length > 0 ? (
            filteredSubTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-start gap-4">
                  {/* Number Badge */}
                  <div className="bg-primary text-white font-bold text-xl px-5 py-3 rounded-xl flex-shrink-0">
                    {task.number}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">{task.title}</h3>

                    {/* Progress Bar with Slider */}
                    <div className="relative mb-4">
                      {/* Percentage at top right */}
                      <span className={`absolute -top-6 right-0 text-sm font-bold ${task.status === 'on-track' ? 'text-primary' : task.status === 'in-progress' ? 'text-yellow-500' : 'text-red-500'} pointer-events-none`}>
                        {task.progress ?? 0}%
                      </span>
                      
                      {/* Progress Bar */}
                      <div className="h-3 bg-gray-200 rounded-full">
                        <div
                          className={`h-full ${getProgressColor(task.status)} transition-all duration-300 rounded-full relative`}
                          style={{ width: `${task.progress ?? 0}%` }}
                        >
                          {/* Circle indicator at the end of progress */}
                          <div 
                            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 ${getProgressColor(task.status)} rounded-full border-2 border-white shadow-lg`}
                            style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Invisible Slider for interaction */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={task.progress ?? 0}
                        onChange={(e) => handleProgressChange(task.id, Number(e.target.value))}
                        className="w-full h-3 bg-transparent appearance-none cursor-pointer absolute top-0 left-0 opacity-0"
                        style={{ zIndex: 10 }}
                      />
                    </div>

                    {/* Deadline and Assigned To - Below Progress Bar */}
                    <div className="flex items-center justify-end gap-8 text-sm text-gray-600 pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-600">Deadline</span>
                        <span className="font-medium text-gray-900">{formatDate(task.deadline)}</span>
                      </div>
                      <div className="w-px h-8 bg-gray-300"></div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Assigned to:</span>
                        <span className="font-medium text-gray-900">{task.assignedTo}</span>
                        <div 
                          className="w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer"
                          title={task.assignedTo}
                        >
                          <span className="text-white text-xs font-medium">
                            {task.assignedToAvatar}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 font-medium">No sub-tasks for this key activity</p>
              <p className="text-sm text-gray-500 mt-1">Create sub-tasks to track and update their progress</p>
            </div>
          )}
        </div>

        {/* Save Changes Button - Bottom Right */}
        {filteredSubTasks.length > 0 && (
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSaveChanges}
            className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-md"
          >
            Save Changes
          </button>
        </div>
        )}
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #FF6600;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #FF6600;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }

        .slider::-webkit-slider-runnable-track {
          background: transparent;
          height: 2px;
        }

        .slider::-moz-range-track {
          background: transparent;
          height: 2px;
        }
      `}</style>
    </div>
  )
}

export default UpdateSubTaskProgress
