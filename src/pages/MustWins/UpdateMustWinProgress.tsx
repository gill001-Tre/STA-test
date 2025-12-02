import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface MustWin {
  id: number
  number: string
  title: string
  description?: string
  progress: number
  status: 'on-track' | 'in-progress' | 'needs-attention'
  deadline: string
  owners: string[]
  assignedPillars?: string[]
}

const STORAGE_KEY = 'must-wins-data'

const initialMustWins: MustWin[] = []

const UpdateMustWinProgress = () => {
  const navigate = useNavigate()
  const [originalData, setOriginalData] = useState<any[]>([])
  
  // Load from localStorage or use initial data
  const [mustWins, setMustWins] = useState<MustWin[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsedData = JSON.parse(stored)
        setOriginalData(parsedData) // Keep original data for saving
        // Map data to ensure correct structure with owners array
        return parsedData.map((win: any) => ({
          id: win.id,
          number: `W${win.id}`,
          title: win.title,
          description: win.description,
          progress: win.progress || 0,
          status: win.status || 'needs-attention',
          deadline: win.deadline || '',
          owners: win.owners || (win.owner ? [win.owner] : []),
          assignedPillars: win.assignedPillars || []
        }))
      } catch (e) {
        console.error('Failed to parse stored must-wins:', e)
        return initialMustWins
      }
    }
    return initialMustWins
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
    // Merge progress updates back into original data to preserve all fields
    const updatedData = originalData.map(original => {
      const updated = mustWins.find(w => w.id === original.id)
      if (updated) {
        return {
          ...original,
          progress: updated.progress,
          status: updated.status
        }
      }
      return original
    })
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))
    console.log('Progress changes saved to localStorage:', updatedData)
    // TODO: Later integrate with Azure Table Storage
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Update Must-Wins Progress</h1>

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

export default UpdateMustWinProgress
