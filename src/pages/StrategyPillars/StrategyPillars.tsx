import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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

const STORAGE_KEY = 'strategy-pillars-assignments'

const initialPillars: Pillar[] = [
  {
    id: 1,
    number: '01',
    title: 'Cost Leadership via Technology Efficiency:',
    description: 'Focus on reducing costs through technology efficiency and consolidation',
    objectives: [
      'Consolidate platforms and reduce duplication across Denmark and Sweden.',
      'Leverage economies of scale to reduce cost per subscriber.',
      'Implement proactive monitoring and automation to improve cost efficiency.',
      'Mandate lean setup and cost-focused investments across the business.',
      'Modernize legacy systems and adopt standard solutions to minimize waste.',
      'Implement a unified house IT approach (e.g., one web service platform) to cut costs and complexity.'
    ],
    assignedWins: []
  },
  {
    id: 2,
    number: '02',
    title: 'Business Differentiation through Digital Innovation:',
    description: 'Deliver unique customer value through IT-enabled products and experiences',
    objectives: [
      'Deliver unique customer value through IT-enabled products and experiences.',
      'Rapidly deploy new capabilities like:',
      'AI-driven personalization',
      'Seamless omnichannel experience',
      'Exposure and local breakout',
      'Enable hyper-personalized journeys (e.g., tailored offers, loyalty perks).',
      'Support rollout of innovative services that set brands apart.'
    ],
    assignedWins: []
  },
  {
    id: 3,
    number: '03',
    title: 'Operational Excellence & Agility:',
    description: 'Deliver reliable, secure, and agile operations to boost execution quality',
    objectives: [
      'Deliver reliable, secure, and agile operations to boost execution quality.',
      'Ensure high system uptime, strong security, and efficient feature delivery.',
      'Support superior customer experience and internal productivity.',
      'Drive continuous improvement with a "never settle" mindset.',
      'Enhance value-adding activities (e.g., less manual work) for internal initiatives.',
      'Enable IT to "do more with less" year over year.',
      'Adapt quickly to market changes (e.g., fast rollout of new digital products or service integrations).'
    ],
    assignedWins: []
  }
]

const StrategyPillars = () => {
  const navigate = useNavigate()
  const [selectedYear] = useState(new Date().getFullYear())
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedPillarId, setSelectedPillarId] = useState<number | null>(null)
  const [selectedWins, setSelectedWins] = useState<number[]>([])
  
  // Load pillars from localStorage or use initial data
  const [pillars, setPillars] = useState<Pillar[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse stored pillars:', e)
        return initialPillars
      }
    }
    return initialPillars
  })

  // Save to localStorage whenever pillars change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pillars))
  }, [pillars])

  // Mock Must-Wins data - matching dashboard data
  const mockMustWins: MustWin[] = [
    { id: 1, number: 1, title: 'IT Stack Modernization', status: 'on-track', isAssigned: false },
    { id: 2, number: 2, title: 'Cybersecurity & Compliance', status: 'in-progress', isAssigned: false },
    { id: 3, number: 3, title: 'AI & Automation', status: 'on-track', isAssigned: false },
    { id: 4, number: 4, title: '5G SA Launch', status: 'in-progress', isAssigned: false },
  ]

  const getWinTitle = (winId: number) => {
    const win = mockMustWins.find(w => w.id === winId)
    return win ? `Win ${win.number}` : ''
  }

  const handleAssignWin = (pillarId: number) => {
    setSelectedPillarId(pillarId)
    setSelectedWins([])
    setShowAssignModal(true)
  }

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

  const handleRemoveWin = (pillarId: number, winId: number) => {
    setPillars(prev => prev.map(pillar =>
      pillar.id === pillarId
        ? { ...pillar, assignedWins: pillar.assignedWins.filter(id => id !== winId) }
        : pillar
    ))
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Strategic Technology Pillars</h1>

          {/* Year Selector */}
          <div className="flex justify-end mb-4">
            <select
              value={selectedYear}
              className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors appearance-none bg-white bg-no-repeat bg-right"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.25rem'
              }}
            >
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
              <option value={2028}>2028</option>
            </select>
          </div>
        </div>

        {/* Pillars List */}
        <div className="space-y-4">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
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
                            {getWinTitle(winId)}
                            <button
                              onClick={() => handleRemoveWin(pillar.id, winId)}
                              className="ml-1 hover:bg-yellow-200 rounded-full p-0.5 transition-colors"
                              title="Remove win"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
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
                  
                  {/* Assign Win Button */}
                  <button
                    onClick={() => handleAssignWin(pillar.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Assign Win
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
