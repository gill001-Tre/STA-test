import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useYear } from '@/contexts/YearContext'
import { loadFromYearStorage, saveToYearStorage, STORAGE_KEYS } from '@/utils/storageHelper'

interface KeyActivity {
  id: number
  number: string
  title: string
  progress: number
  status: 'on-track' | 'in-progress' | 'needs-attention'
  deadline: string
  assignedTo: string
}

const UpdateKeyActivityProgress = () => {
  const navigate = useNavigate()
  const { selectedYear } = useYear()
  const [searchParams] = useSearchParams()
  const winId = searchParams.get('winId') || '1'
  const [originalData, setOriginalData] = useState<any[]>([])
  
  // Load from year-aware storage or use initial data
  const [keyActivities, setKeyActivities] = useState<KeyActivity[]>(() => {
    const stored = loadFromYearStorage(STORAGE_KEYS.KEY_ACTIVITIES, selectedYear)
    if (stored && Array.isArray(stored)) {
      setOriginalData(stored)
      return stored.map((activity: any) => ({
        id: activity.id,
        number: `K${activity.id}`,
        title: activity.title,
        progress: activity.progress || 0,
        status: activity.status || 'needs-attention',
        deadline: activity.deadline || '',
        assignedTo: activity.assignToHead || ''
      }))
    }
    return []
  })

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
    // Merge progress updates back into original data to preserve all fields
    const updatedData = originalData.map(original => {
      const updated = keyActivities.find(a => a.id === original.id)
      if (updated) {
        return {
          ...original,
          progress: updated.progress,
          status: updated.status
        }
      }
      return original
    })
    
    // Save to year-aware storage
    saveToYearStorage(STORAGE_KEYS.KEY_ACTIVITIES, updatedData, selectedYear)
    console.log('Progress changes saved:', updatedData)
    navigate(`/key-activities?winId=${winId}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Update Key Activities progress</h1>

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

        {/* Key Activities Progress List */}
        <div className="space-y-4">
          {keyActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-start gap-4">
                {/* Number Badge */}
                <div className="bg-primary text-white font-bold text-xl px-5 py-3 rounded-xl flex-shrink-0">
                  {activity.number}
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
                        ></div>
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
                      <span className="font-medium text-gray-900">{activity.assignedTo}</span>
                      <div className="w-7 h-7 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {activity.assignedTo.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Save Changes Button - Bottom Right */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSaveChanges}
            className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-md"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdateKeyActivityProgress
