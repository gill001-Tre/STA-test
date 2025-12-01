import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface MustWin {
  id: number
  number: string
  title: string
  description: string
  deadline: string
  assignedTo: string
  assignedPillars: string[]
  progress?: number
  status?: 'on-track' | 'in-progress' | 'needs-attention'
}

const STORAGE_KEY = 'must-wins-data'

const MustWins = () => {
  const navigate = useNavigate()
  const [selectedYear, setSelectedYear] = useState(2026)
  const [mustWins, setMustWins] = useState<MustWin[]>([
    {
      id: 1,
      number: '01',
      title: 'IT Stack Modernization',
      description: '5G launch, HEO & ISO 27001 compliance, quantum readiness.',
      deadline: '2026-03-01',
      assignedTo: 'Peter Kim',
      assignedPillars: [],
      progress: 77,
      status: 'on-track'
    },
    {
      id: 2,
      number: '02',
      title: 'Cybersecurity & Compliance',
      description: '5G launch, HEO & ISO 27001 compliance, quantum readiness.',
      deadline: '2026-03-01',
      assignedTo: 'Emily Chen',
      assignedPillars: [],
      progress: 57,
      status: 'in-progress'
    },
    {
      id: 3,
      number: '03',
      title: 'AI & Automation',
      description: 'AI capabilities; chat for provisioning; anomaly detection.',
      deadline: '2026-02-02',
      assignedTo: 'John Larking',
      assignedPillars: [],
      progress: 95,
      status: 'on-track'
    },
    {
      id: 4,
      number: '04',
      title: '5G SA Readiness',
      description: 'Commercial 5G SA rollout, network APIs for monetization.',
      deadline: '2026-01-01',
      assignedTo: 'Javed Moh',
      assignedPillars: [],
      progress: 10,
      status: 'needs-attention'
    }
  ])

  // Load progress data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const storedData = JSON.parse(stored)
      // Merge stored progress data with current must-wins
      setMustWins(prev => prev.map(win => {
        const storedWin = storedData.find((s: MustWin) => s.id === win.id)
        if (storedWin) {
          return { ...win, progress: storedWin.progress, status: storedWin.status }
        }
        return win
      }))
    }
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Must-Wins</h1>
            <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L8 8l-6 1 4.5 4L5.5 19 12 15.5 18.5 19l-1-6L22 9l-6-1z"/>
            </svg>
          </div>
          <p className="text-gray-600">We will support, prioritize and track more capabilities. These are the must-wins to set us succeed in MW1 vision.</p>

          {/* Year Selector */}
          <div className="flex justify-end mt-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
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

        {/* Must-Wins List */}
        <div className="space-y-4">
          {mustWins.map((win) => (
            <div
              key={win.id}
              className="bg-white rounded-lg border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Win Number Badge */}
                  <div className="bg-primary text-white font-bold text-lg px-4 py-2 rounded-lg flex-shrink-0">
                    {win.number}
                  </div>

                  {/* Win Content */}
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      {win.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                      {win.description}
                    </p>

                    {/* Meta Information */}
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      {/* Deadline */}
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Deadline</span>
                        <span className="font-medium text-gray-900">{formatDate(win.deadline)}</span>
                      </div>

                      {/* Assigned To */}
                      <div className="flex items-center gap-2">
                        <span>Assigned to</span>
                        <span className="font-medium text-gray-900">{win.assignedTo}</span>
                        <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {win.assignedTo.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => navigate(`/must-wins/${win.id}/edit`)}
                  className="ml-4 flex-shrink-0 p-2 text-gray-600 hover:text-primary hover:bg-orange-50 rounded-lg transition-colors"
                  title="Edit Must-Win"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MustWins
