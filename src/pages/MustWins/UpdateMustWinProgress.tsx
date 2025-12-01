import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface MustWin {
  id: number
  number: string
  title: string
  progress: number
  status: 'on-track' | 'in-progress' | 'needs-attention'
  deadline: string
  assignedTo: string
}

const STORAGE_KEY = 'must-wins-data'

const initialMustWins: MustWin[] = [
  {
    id: 1,
    number: '01',
    title: 'Abcd',
    progress: 77,
    status: 'on-track',
    deadline: '2026-02-01',
    assignedTo: 'Fredrik Eder'
  },
  {
    id: 2,
    number: '02',
    title: 'Abcde',
    progress: 57,
    status: 'in-progress',
    deadline: '2026-03-01',
    assignedTo: 'Fredrik Eder'
  },
  {
    id: 3,
    number: '03',
    title: 'hghjggad',
    progress: 95,
    status: 'on-track',
    deadline: '2026-02-02',
    assignedTo: 'Caroline Lundberg'
  },
  {
    id: 4,
    number: '04',
    title: 'bjvjkbakla',
    progress: 10,
    status: 'needs-attention',
    deadline: '2026-02-01',
    assignedTo: 'Jennet Björn'
  }
]

const UpdateMustWinProgress = () => {
  const navigate = useNavigate()
  
  // Load from localStorage or use initial data
  const [mustWins, setMustWins] = useState<MustWin[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : initialMustWins
  })

  const handleProgressChange = (id: number, newProgress: number) => {
    setMustWins(prev => prev.map(win => {
      if (win.id === id) {
        // Auto-update status based on progress
        let newStatus: 'on-track' | 'in-progress' | 'needs-attention' = 'needs-attention'
        if (newProgress >= 60) {
          newStatus = 'on-track'
        } else if (newProgress >= 30) {
          newStatus = 'in-progress'
        }
        return { ...win, progress: newProgress, status: newStatus }
      }
      return win
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
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mustWins))
    console.log('Progress changes saved to localStorage:', mustWins)
    // TODO: Later integrate with Azure Table Storage
    navigate('/must-wins')
  }

  const handleBack = () => {
    navigate(-1)
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Update Must-wins progress</h1>

          {/* Progress Legend */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Progress Level:</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span>≥ 60% - On Track</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>30-60% - In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>&lt; 30% - Needs Attention</span>
            </div>
          </div>
        </div>

        {/* Must-Wins Progress List */}
        <div className="space-y-4">
          {mustWins.map((win) => (
            <div
              key={win.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-start gap-4">
                {/* Number Badge */}
                <div className="bg-primary text-white font-bold text-xl px-5 py-3 rounded-xl flex-shrink-0">
                  {win.number}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">{win.title}</h3>

                  {/* Progress Bar with Slider */}
                  <div className="relative mb-4">
                    {/* Percentage at top right */}
                    <span className={`absolute -top-6 right-0 text-sm font-bold ${win.status === 'on-track' ? 'text-primary' : win.status === 'in-progress' ? 'text-yellow-500' : 'text-red-500'} pointer-events-none`}>
                      {win.progress}%
                    </span>
                    
                    {/* Progress Bar */}
                    <div className="h-3 bg-gray-200 rounded-full">
                      <div
                        className={`h-full ${getProgressColor(win.status)} transition-all duration-300 rounded-full relative`}
                        style={{ width: `${win.progress}%` }}
                      >
                        {/* Circle indicator at the end of progress */}
                        <div 
                          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 ${getProgressColor(win.status)} rounded-full border-2 border-white shadow-lg`}
                          style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Invisible Slider for interaction */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={win.progress}
                      onChange={(e) => handleProgressChange(win.id, Number(e.target.value))}
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
                      <span className="font-medium text-gray-900">{formatDate(win.deadline)}</span>
                    </div>
                    <div className="w-px h-8 bg-gray-300"></div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Assigned to:</span>
                      <span className="font-medium text-gray-900">{win.assignedTo}</span>
                      <div className="w-7 h-7 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {win.assignedTo.split(' ').map(n => n[0]).join('')}
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

export default UpdateMustWinProgress
