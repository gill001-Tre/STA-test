import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useYear } from '@/contexts/YearContext'
import { loadFromYearStorage, saveToYearStorage, STORAGE_KEYS } from '@/utils/storageHelper'

interface MustWin {
  id: number
  number: string
  title: string
  description: string
  deadline: string
  winOwner?: string
  owners: string[]
  assignedPillars: string[]
  progress?: number
  status?: 'on-track' | 'in-progress' | 'needs-attention'
}

const STORAGE_KEY = 'must-wins-data'

const MustWins = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedYear } = useYear()
  const [mustWins, setMustWins] = useState<MustWin[]>([])

  // Load progress data from year-aware storage on mount
  useEffect(() => {
    loadMustWins()
  }, [selectedYear])

  // Reload when navigating back to this page
  useEffect(() => {
    loadMustWins()
  }, [location.pathname])

  const loadMustWins = () => {
    const stored = loadFromYearStorage(STORAGE_KEYS.MUST_WINS, selectedYear)
    if (stored) {
      const storedData = stored
      // Map data to match MustWin interface
      const mappedData = storedData.map((win: any) => ({
        id: win.id,
        number: `W${win.id}`,
        title: win.title,
        description: win.description || '',
        deadline: win.deadline || '',
        winOwner: win.winOwner || '',
        owners: win.owners || (win.owner ? [win.owner] : []),
        assignedPillars: win.assignedPillars || [],
        progress: win.progress || 0,
        status: win.status || 'needs-attention'
      }))
      setMustWins(mappedData)
    }
  }

  const handleDeleteWin = (winId: number) => {
    if (window.confirm('Are you sure you want to delete this must-win? This action cannot be undone.')) {
      const stored = loadFromYearStorage(STORAGE_KEYS.MUST_WINS, selectedYear)
      if (stored) {
        const updatedData = stored.filter((win: any) => win.id !== winId)
        saveToYearStorage(STORAGE_KEYS.MUST_WINS, updatedData, selectedYear)
        
        // Also remove this win from any pillars' assignedWins arrays (using year-aware storage)
        const pillarsStored = loadFromYearStorage(STORAGE_KEYS.STRATEGY_PILLARS, selectedYear)
        if (pillarsStored) {
          const pillars = Array.isArray(pillarsStored) ? pillarsStored : []
          const updatedPillars = pillars.map((pillar: any) => ({
            ...pillar,
            assignedWins: pillar.assignedWins?.filter((id: number) => id !== winId) || []
          }))
          saveToYearStorage(STORAGE_KEYS.STRATEGY_PILLARS, updatedPillars, selectedYear)
        }
        
        loadMustWins()
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900">Must-Wins</h1>
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L8 8l-6 1 4.5 4L5.5 19 12 15.5 18.5 19l-1-6L22 9l-6-1z"/>
              </svg>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/must-wins/create')}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium whitespace-nowrap flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Win
              </button>
              <button
                onClick={() => navigate('/must-wins/progress')}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium whitespace-nowrap"
              >
                Update Progress
              </button>
            </div>
          </div>
          <p className="text-gray-600">We will support, prioritize, and closely track a set of critical capabilities—our must-win initiatives—to ensure success in achieving our strategic Tech goals.</p>
        </div>

        {/* Must-Wins List */}
        <div className="space-y-4">
          {mustWins.map((win) => (
            <div
              key={win.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:shadow-orange-200 transition-shadow"
            >
              <div className="flex items-start gap-6">
                {/* Number Badge */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-lg">
                    {win.number}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{win.title}</h3>
                  
                  {/* Assigned Pillars Tags */}
                  {win.assignedPillars && win.assignedPillars.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {win.assignedPillars.map((pillar, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {pillar}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 whitespace-pre-line">{win.description}</p>
                  
                  {/* Bottom Info Row */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-6">
                      {/* Win Owner */}
                      {win.winOwner && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <span className="text-xs text-gray-500">Primary Owner: </span>
                            <span className="text-sm font-medium text-gray-900">{win.winOwner}</span>
                          </div>
                        </div>
                      )}

                      {/* Deadline */}
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <span className="text-xs text-gray-500">Deadline: </span>
                          <span className="text-sm font-medium text-gray-900">{formatDate(win.deadline)}</span>
                        </div>
                      </div>

                      {/* Assigned To */}
                      {win.owners.length > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center -space-x-2">
                            {win.owners.slice(0, 3).map((owner, idx) => (
                              <div
                                key={idx}
                                className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center text-xs font-semibold border-2 border-white"
                                title={owner}
                              >
                                {owner.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </div>
                            ))}
                            {win.owners.length > 3 && (
                              <div
                                className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center text-xs font-semibold border-2 border-white"
                                title={win.owners.slice(3).join(', ')}
                              >
                                +{win.owners.length - 3}
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Assigned to: </span>
                            <span className="text-sm font-medium text-gray-900">
                              {win.owners.length === 1 ? win.owners[0] : `${win.owners.length} Head of Departments`}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => navigate(`/must-wins/${win.id}/edit`)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary hover:bg-orange-50 rounded-lg transition-colors"
                        title="Edit Must-Win"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="text-sm font-medium">Edit</span>
                      </button>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteWin(win.id)}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Must-Win"
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
          ))}
        </div>
      </div>
    </div>
  )
}

export default MustWins
