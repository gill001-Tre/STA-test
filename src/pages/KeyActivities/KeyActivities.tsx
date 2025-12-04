import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useYear } from '@/contexts/YearContext'
import { loadFromYearStorage, saveToYearStorage, STORAGE_KEYS } from '@/utils/storageHelper'

interface KeyActivity {
  id: number
  title: string
  description: string
  subtasks: number
  deadline: string
  assignedTo: string
  assignedToAvatar: string
  assignToHead?: string
  assignedMustWin?: string
  progress?: number
  status?: 'on-track' | 'in-progress' | 'needs-attention'
  baselineKPIs?: Array<{name: string, range: string}>
  targetKPIs?: Array<{name: string, range: string}>
  stretchKPIs?: Array<{name: string, range: string}>
}

const KeyActivities = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedYear } = useYear()
  const [searchParams] = useSearchParams()
  const urlWinId = searchParams.get('winId')
  const [selectedWinId, setSelectedWinId] = useState<number | string>(urlWinId ? Number(urlWinId) : '') // Default to All or from URL
  const [keyActivities, setKeyActivities] = useState<KeyActivity[]>([])
  const [mustWins, setMustWins] = useState<any[]>([])
  
  // Load activities and must-wins from year-aware storage
  useEffect(() => {
    loadActivities()
    loadMustWins()
  }, [selectedYear])
  
  // Set default win to first available win when must-wins are loaded
  useEffect(() => {
    if (mustWins.length > 0 && !urlWinId) {
      setSelectedWinId(mustWins[0].id)
      navigate(`/key-activities?winId=${mustWins[0].id}`)
    }
  }, [mustWins])
  
  // Reload when navigating back to this page
  useEffect(() => {
    loadActivities()
    loadMustWins()
  }, [location.pathname])
  
  // Force reload when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused - reloading key activities')
      loadActivities()
      loadMustWins()
    }
    
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [selectedYear])
  
  // Update selectedWinId when URL changes
  useEffect(() => {
    if (urlWinId) {
      setSelectedWinId(Number(urlWinId))
    }
  }, [urlWinId])
  
  const loadMustWins = () => {
    const stored = loadFromYearStorage(STORAGE_KEYS.MUST_WINS, selectedYear)
    if (stored) {
      try {
        const parsedData = stored
        setMustWins(parsedData)
      } catch (e) {
        console.error('Failed to parse must-wins:', e)
      }
    }
  }
  
  const getMustWinPillars = (mustWinId: string) => {
    const win = mustWins.find(w => w.id === Number(mustWinId))
    return win?.assignedPillars || []
  }
  
  const loadActivities = () => {
    const stored = loadFromYearStorage(STORAGE_KEYS.KEY_ACTIVITIES, selectedYear)
    if (stored) {
      try {
        const parsedData = stored
        const mappedData = parsedData.map((activity: any) => ({
          id: activity.id,
          title: activity.title,
          description: activity.description || '',
          subtasks: 0, // Will be calculated from sub-tasks later
          deadline: activity.deadline || '',
          assignedTo: activity.assignToHead || '',
          assignedToAvatar: activity.assignToHead ? activity.assignToHead.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'N/A',
          assignedMustWin: activity.assignedMustWin || '',
          progress: activity.progress || 0,
          status: activity.status || 'needs-attention',
          baselineKPIs: activity.baselineKPIs || [],
          targetKPIs: activity.targetKPIs || [],
          stretchKPIs: activity.stretchKPIs || []
        }))
        setKeyActivities(mappedData)
      } catch (e) {
        console.error('Failed to parse stored activities:', e)
      }
    }
  }
  
  const handleDeleteActivity = (activityId: number) => {
    if (window.confirm('Are you sure you want to delete this key activity? This action cannot be undone.')) {
      const stored = loadFromYearStorage(STORAGE_KEYS.KEY_ACTIVITIES, selectedYear)
      if (stored) {
        try {
          const updatedActivities = stored.filter((activity: any) => activity.id !== activityId)
          saveToYearStorage(STORAGE_KEYS.KEY_ACTIVITIES, updatedActivities, selectedYear)
          loadActivities()
        } catch (e) {
          console.error('Failed to delete activity:', e)
        }
      }
    }
  }

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
  }

  // Filter activities based on selected win
  const filteredActivities = !selectedWinId 
    ? keyActivities 
    : keyActivities.filter(activity => {
      const activityWinId = activity.assignedMustWin
      const selectedId = selectedWinId
      return Number(activityWinId) === Number(selectedId)
    })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section with Action Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-8">
            <div></div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/key-activities/progress?winId=${selectedWinId}`)}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium whitespace-nowrap"
              >
                Update Progress
              </button>
              <button
                onClick={() => navigate(`/key-activities/create?winId=${selectedWinId}`)}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium whitespace-nowrap"
              >
                Create Key Activity
              </button>
              
              <select
                value={selectedWinId}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  setSelectedWinId(value)
                  navigate(`/key-activities?winId=${value}`)
                }}
                className="px-6 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                {mustWins.map((win) => (
                  <option key={win.id} value={win.id}>
                    W{win.id} - {win.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Key Activities</h1>
          <p className="text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Track and manage your team's important tasks and milestones and also create sub-tasks for each key activity</p>
        </div>

        {/* Summary Section */}
        <div className="ml-auto w-fit text-right">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Total Activities: <span className="text-sm font-semibold text-primary">{filteredActivities.length}</span></p>
        </div>

        {/* Key Activities List */}
        <div className="space-y-4">
          {filteredActivities.map((activity, index) => {
            const sequenceNumber = index + 1 // Sequential numbering starting from 1

            return (
              <div
                key={activity.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:shadow-orange-200 transition-shadow"
              >
                <div className="flex items-start gap-6">
                  {/* Number Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-xl">
                      K{sequenceNumber}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{activity.title}</h3>
                    
                    {/* Win and Pillar Badges */}
                    {activity.assignedMustWin && (
                      <div className="mb-3 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L8 8l-6 1 4.5 4L5.5 19 12 15.5 18.5 19l-1-6L22 9l-6-1z"/>
                          </svg>
                          W{activity.assignedMustWin}
                        </span>
                        {getMustWinPillars(activity.assignedMustWin).length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm text-gray-500">→</span>
                            {getMustWinPillars(activity.assignedMustWin).map((pillar: string, idx: number) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium"
                              >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                {pillar}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 whitespace-pre-line">
                      {activity.description}
                    </p>
                    
                    {/* KPIs Section */}
                    {(activity.baselineKPIs && activity.baselineKPIs.length > 0 || activity.targetKPIs && activity.targetKPIs.length > 0 || activity.stretchKPIs && activity.stretchKPIs.length > 0) && (
                      <div className="mb-4 grid grid-cols-3 gap-3">
                        {/* Baseline KPIs */}
                        {activity.baselineKPIs && activity.baselineKPIs.length > 0 && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <h4 className="text-xs font-semibold text-orange-800 mb-2">Baseline</h4>
                            <div className="space-y-1.5">
                              {activity.baselineKPIs.filter(kpi => kpi.name || kpi.range).map((kpi, idx) => (
                                <div key={idx} className="text-xs">
                                  {kpi.name && <div className="font-medium text-gray-900">{kpi.name}</div>}
                                  {kpi.range && <div className="text-gray-600">{kpi.range}</div>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Target KPIs */}
                        {activity.targetKPIs && activity.targetKPIs.length > 0 && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <h4 className="text-xs font-semibold text-orange-800 mb-2">Target</h4>
                            <div className="space-y-1.5">
                              {activity.targetKPIs.filter(kpi => kpi.name || kpi.range).map((kpi, idx) => (
                                <div key={idx} className="text-xs">
                                  {kpi.name && <div className="font-medium text-gray-900">{kpi.name}</div>}
                                  {kpi.range && <div className="text-gray-600">{kpi.range}</div>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Stretch KPIs */}
                        {activity.stretchKPIs && activity.stretchKPIs.length > 0 && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <h4 className="text-xs font-semibold text-orange-800 mb-2">Stretch</h4>
                            <div className="space-y-1.5">
                              {activity.stretchKPIs.filter(kpi => kpi.name || kpi.range).map((kpi, idx) => (
                                <div key={idx} className="text-xs">
                                  {kpi.name && <div className="font-medium text-gray-900">{kpi.name}</div>}
                                  {kpi.range && <div className="text-gray-600">{kpi.range}</div>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Bottom Info Section */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-8">
                        {/* Deadline */}
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <span className="text-xs text-gray-500">Deadline </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {formatDeadline(activity.deadline)}
                            </span>
                          </div>
                        </div>

                        {/* Assigned To */}
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-9 h-9 rounded-full bg-gray-700 text-white flex items-center justify-center text-xs font-semibold"
                            title={activity.assignedTo}
                          >
                            {activity.assignedToAvatar}
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Assigned to </span>
                            <span className="text-sm font-semibold text-gray-900">{activity.assignedTo}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/key-activities/update?id=${activity.id}&winId=${selectedWinId}`)
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary hover:bg-orange-50 rounded-lg transition-colors"
                          title="Edit Key Activity"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span className="text-sm font-medium">Edit</span>
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteActivity(activity.id)
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Key Activity"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span className="text-sm font-medium">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default KeyActivities
