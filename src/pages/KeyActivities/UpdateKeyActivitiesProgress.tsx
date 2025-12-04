import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useYear } from '@/contexts/YearContext'
import { loadFromYearStorage, saveToYearStorage, STORAGE_KEYS } from '@/utils/storageHelper'

interface KeyActivity {
  id: number
  title: string
  assignedMustWin: string | number
  progress: number
  status: 'on-track' | 'in-progress' | 'needs-attention'
  deadline: string
  assignToHead: string
}

const UpdateKeyActivitiesProgress = () => {
  const navigate = useNavigate()
  const { selectedYear } = useYear()
  const [searchParams] = useSearchParams()
  const urlWinId = searchParams.get('winId')
  
  const [selectedWinId, setSelectedWinId] = useState<string>(urlWinId || '1')
  const [keyActivities, setKeyActivities] = useState<KeyActivity[]>([])
  const [mustWinTitle, setMustWinTitle] = useState('')
  const [mustWins, setMustWins] = useState<any[]>([])

  // Load must-wins for dropdown
  useEffect(() => {
    const mustWinsStored = loadFromYearStorage(STORAGE_KEYS.MUST_WINS, selectedYear)
    if (mustWinsStored) {
      setMustWins(mustWinsStored)
    }
  }, [selectedYear])

  // Load key activities whenever selectedWinId changes
  useEffect(() => {
    const stored = loadFromYearStorage(STORAGE_KEYS.KEY_ACTIVITIES, selectedYear)
    if (stored) {
      const allActivities = stored
      // Filter by selected win
      const filteredActivities = allActivities.filter(
        (activity: KeyActivity) => Number(activity.assignedMustWin) === Number(selectedWinId)
      )
      setKeyActivities(filteredActivities)
    }

    // Get must-win title
    const mustWinsStored = loadFromYearStorage(STORAGE_KEYS.MUST_WINS, selectedYear)
    if (mustWinsStored) {
      const wins = mustWinsStored
      const win = wins.find((w: any) => w.id === Number(selectedWinId))
      if (win) {
        setMustWinTitle(win.title)
      }
    }
  }, [selectedWinId, selectedYear])

  const handleProgressChange = (id: number, newProgress: number) => {
    setKeyActivities(prev => prev.map(activity => {
      if (activity.id === id) {
        // Auto-update status based on progress
        let newStatus: 'on-track' | 'in-progress' | 'needs-attention' = 'needs-attention'
        if (newProgress >= 60) {
          newStatus = 'on-track'
        } else if (newProgress >= 30) {
          newStatus = 'in-progress'
        }
        return { ...activity, progress: newProgress, status: newStatus }
      }
      return activity
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
    // Load all activities
    const stored = loadFromYearStorage(STORAGE_KEYS.KEY_ACTIVITIES, selectedYear)
    if (stored) {
      const allActivities = stored
      // Update activities for this win
      const updatedActivities = allActivities.map((activity: KeyActivity) => {
        const updatedActivity = keyActivities.find(ka => ka.id === activity.id)
        if (updatedActivity) {
          return updatedActivity
        }
        return activity
      })
      saveToYearStorage(STORAGE_KEYS.KEY_ACTIVITIES, updatedActivities, selectedYear)
      console.log('Key Activity progress changes saved to year-aware storage:', updatedActivities)
    }
    navigate(`/key-activities?winId=${selectedWinId}`)
  }

  const handleBack = () => {
    navigate(`/key-activities?winId=${selectedWinId}`)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-primary hover:text-orange-600 mb-4 font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Key Activities Progress</h1>
          
          {/* Filter Section */}
          <div className="mb-6 flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Select Must-Win:</label>
            <select
              value={selectedWinId}
              onChange={(e) => setSelectedWinId(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
            >
              {mustWins.map((win) => (
                <option key={win.id} value={win.id}>
                  Win {win.id}: {win.title}
                </option>
              ))}
            </select>
          </div>

          <p className="text-gray-600">Updating for: <span className="font-semibold text-gray-900">{mustWinTitle}</span></p>

          {/* Progress Legend */}
          <div className="flex items-center gap-6 text-sm mt-6">
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

        {/* Key Activities Progress List */}
        <div className="space-y-4">
          {keyActivities.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-500">No key activities found for this win</p>
            </div>
          ) : (
            keyActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-start gap-4">
                  {/* Activity Number Badge */}
                  <div className="bg-primary text-white font-bold text-xl px-5 py-3 rounded-xl flex-shrink-0">
                    {String(keyActivities.indexOf(activity) + 1).padStart(2, '0')}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">{activity.title}</h3>

                    {/* Progress Bar with Slider */}
                    <div className="relative mb-4">
                      {/* Percentage at top right */}
                      <span className={`absolute -top-6 right-0 text-sm font-bold ${activity.status === 'on-track' ? 'text-primary' : activity.status === 'in-progress' ? 'text-yellow-500' : 'text-red-500'} pointer-events-none`}>
                        {activity.progress}%
                      </span>
                      
                      {/* Progress Bar */}
                      <div className="h-3 bg-gray-200 rounded-full">
                        <div
                          className={`h-full ${getProgressColor(activity.status)} transition-all duration-300 rounded-full relative`}
                          style={{ width: `${activity.progress}%` }}
                        >
                          {/* Circle indicator at the end of progress */}
                          <div 
                            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 ${getProgressColor(activity.status)} rounded-full border-2 border-white shadow-lg`}
                            style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}
                          />
                        </div>
                      </div>
                      
                      {/* Invisible Slider for interaction */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={activity.progress}
                        onChange={(e) => handleProgressChange(activity.id, Number(e.target.value))}
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
                        <span className="font-medium text-gray-900">{formatDate(activity.deadline)}</span>
                      </div>
                      <div className="w-px h-8 bg-gray-300"></div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Assigned to:</span>
                        <span className="font-medium text-gray-900">{activity.assignToHead}</span>
                        <div className="w-7 h-7 bg-gray-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {activity.assignToHead.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Save Changes Button - Bottom Right */}
        {keyActivities.length > 0 && (
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

export default UpdateKeyActivitiesProgress
