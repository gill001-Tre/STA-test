import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useYear } from '@/contexts/YearContext'
import { loadFromYearStorage, saveToYearStorage, STORAGE_KEYS } from '@/utils/storageHelper'

interface Pillar {
  id: number
  number: string
  title: string
  description: string
  objectives: string[]
  assignedWins: number[]
}

interface MustWin {
  id: number
  number: number
  title: string
  status: 'on-track' | 'in-progress' | 'needs-attention'
  isAssigned: boolean
}

const StrategyPillars = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedYear } = useYear()
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedPillarId, setSelectedPillarId] = useState<number | null>(null)
  const [selectedWins, setSelectedWins] = useState<number[]>([])
  const [pillars, setPillars] = useState<Pillar[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  // Normalize pillar data to ensure all required fields exist
  const normalizePillar = (pillar: any): Pillar => ({
    id: pillar.id || 0,
    number: pillar.number || '',
    title: pillar.title || '',
    description: pillar.description || '',
    objectives: Array.isArray(pillar.objectives) ? pillar.objectives : [],
    assignedWins: Array.isArray(pillar.assignedWins) ? pillar.assignedWins : []
  })

  // Load pillars when year changes
  useEffect(() => {
    console.log('Loading pillars for year:', selectedYear)
    const stored = loadFromYearStorage(STORAGE_KEYS.STRATEGY_PILLARS, selectedYear)
    console.log('Stored pillars:', stored)
    if (stored) {
      try {
        const pillarsArray = Array.isArray(stored) ? stored.map(normalizePillar) : []
        console.log('Setting pillars:', pillarsArray)
        setPillars(pillarsArray)
      } catch (e) {
        console.error('Failed to parse stored pillars:', e)
        setPillars([])
      }
    } else {
      setPillars([])
    }
  }, [selectedYear, refreshKey])

  // Reload data when navigating back to this page
  useEffect(() => {
    console.log('Page mounted/navigated - checking for updated data')
    const stored = loadFromYearStorage(STORAGE_KEYS.STRATEGY_PILLARS, selectedYear)
    if (stored) {
      try {
        const pillarsArray = Array.isArray(stored) ? stored.map(normalizePillar) : []
        console.log('Updated pillars from storage:', pillarsArray)
        setPillars(pillarsArray)
      } catch (e) {
        console.error('Failed to parse stored pillars:', e)
      }
    }
  }, [location.pathname, selectedYear])

  // Force reload when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused - reloading pillars')
      const stored = loadFromYearStorage(STORAGE_KEYS.STRATEGY_PILLARS, selectedYear)
      if (stored) {
        try {
          const pillarsArray = Array.isArray(stored) ? stored.map(normalizePillar) : []
          setPillars(pillarsArray)
        } catch (e) {
          console.error('Failed to parse stored pillars:', e)
        }
      }
    }
    
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [selectedYear])

  // Listen for storage changes (from other tabs/windows or same tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      const pillarKey = `${STORAGE_KEYS.STRATEGY_PILLARS}-${selectedYear}`
      const mustWinKey = `${STORAGE_KEYS.MUST_WINS}-${selectedYear}`
      
      // Reload pillars if either pillar data OR must-win data changes
      if (e.key === pillarKey || e.key === mustWinKey) {
        console.log('Storage changed - reloading pillars')
        const stored = loadFromYearStorage(STORAGE_KEYS.STRATEGY_PILLARS, selectedYear)
        if (stored) {
          try {
            const pillarsArray = JSON.parse(JSON.stringify(stored))
            setPillars(Array.isArray(pillarsArray) ? pillarsArray.map(normalizePillar) : [])
          } catch (error) {
            console.error('Failed to parse new storage value:', error)
          }
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [selectedYear])

  // Save to year-aware storage whenever pillars change
  useEffect(() => {
    if (pillars.length > 0) {
      console.log('Saving pillars to storage:', pillars)
      saveToYearStorage(STORAGE_KEYS.STRATEGY_PILLARS, pillars, selectedYear)
    }
  }, [pillars, selectedYear])

  // Mock Must-Wins data - matching dashboard data
  const mockMustWins: MustWin[] = []

  const handleToggleWin = (winId: number) => {
    setSelectedWins(prev =>
      prev.includes(winId)
        ? prev.filter(id => id !== winId)
        : [...prev, winId]
    )
  }

  const handleSaveAssignment = () => {
    if (selectedPillarId) {
      setPillars(prev => prev.map(pillar =>
        pillar.id === selectedPillarId
          ? { ...pillar, assignedWins: [...new Set([...pillar.assignedWins, ...selectedWins])] }
          : pillar
      ))
    }
    console.log('Assigning wins to pillar:', selectedPillarId, selectedWins)
    // TODO: Save to Azure Table Storage
    setShowAssignModal(false)
    setSelectedPillarId(null)
    setSelectedWins([])
  }

  const handleDeletePillar = (pillarId: number) => {
    if (window.confirm('Are you sure you want to delete this pillar? This action cannot be undone.')) {
      setPillars(prev => prev.filter(pillar => pillar.id !== pillarId))
    }
  }

  const handleCancelAssignment = () => {
    setShowAssignModal(false)
    setSelectedPillarId(null)
    setSelectedWins([])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-primary text-white'
      case 'in-progress':
        return 'bg-yellow-500 text-white'
      case 'needs-attention':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'On Track'
      case 'in-progress':
        return 'In Progress'
      case 'needs-attention':
        return 'Needs Attention'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Strategic Technology Pillars</h1>
            <button
              onClick={() => navigate('/strategy-pillars/create')}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Pillar
            </button>
          </div>
        </div>

        {/* Pillars List */}
        <div className="space-y-4">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:shadow-orange-200 transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Pillar Number Badge */}
                  <div className="bg-primary text-white font-bold text-lg px-4 py-2 rounded-lg flex-shrink-0">
                    {pillar.number}
                  </div>

                  {/* Pillar Content */}
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      {pillar.title}
                    </h2>

                    {/* Assigned Wins Tags */}
                    {pillar.assignedWins.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {pillar.assignedWins.map((winId) => (
                          <span
                            key={winId}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium group"
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L8 8l-6 1 4.5 4L5.5 19 12 15.5 18.5 19l-1-6L22 9l-6-1z"/>
                            </svg>
                            W{winId}
                          </span>
                        ))}
                      </div>
                    )}

                    <ul className="space-y-1.5">
                      {pillar.objectives.map((objective, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start">
                          <span className="text-gray-400 mr-2 flex-shrink-0">•</span>
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="ml-4 flex gap-2 flex-shrink-0">
                  {/* Edit Button */}
                  <button
                    onClick={() => navigate(`/strategy-pillars/${pillar.id}/edit`)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    title="Edit Pillar"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeletePillar(pillar.id)}
                    className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                    title="Delete Pillar"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assign Win Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-primary text-white px-6 py-4">
              <h2 className="text-xl font-semibold">Assign Must-Wins to Pillar</h2>
              <p className="text-sm text-white/90 mt-1">Select one or more Must-Wins to assign</p>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-3">
                {mockMustWins.map((win) => (
                  <div
                    key={win.id}
                    onClick={() => handleToggleWin(win.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedWins.includes(win.id)
                        ? 'border-primary bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {/* Checkbox */}
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            selectedWins.includes(win.id)
                              ? 'bg-primary border-primary'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {selectedWins.includes(win.id) && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>

                        {/* Must-Win Title */}
                        <div className="flex items-center gap-2 flex-1">
                          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L8 8l-6 1 4.5 4L5.5 19 12 15.5 18.5 19l-1-6L22 9l-6-1z"/>
                          </svg>
                          <span className="font-medium text-gray-900">
                            Win {win.number}: {win.title}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(win.status)}`}>
                        {getStatusLabel(win.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={handleCancelAssignment}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssignment}
                disabled={selectedWins.length === 0}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedWins.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-orange-600'
                }`}
              >
                Assign {selectedWins.length > 0 && `(${selectedWins.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StrategyPillars
