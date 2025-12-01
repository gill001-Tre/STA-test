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
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900">Must-Wins</h1>
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L8 8l-6 1 4.5 4L5.5 19 12 15.5 18.5 19l-1-6L22 9l-6-1z"/>
              </svg>
            </div>
            <button
              onClick={() => navigate('/must-wins/progress')}
              className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium whitespace-nowrap"
            >
              Update Progress
            </button>
          </div>
          <p className="text-gray-600">We will support, prioritize and track more capabilities. These are the must-wins to set us succeed for our 2026 goals</p>
        </div>

        {/* Must-Wins List */}
        <div className="space-y-4">
          {mustWins.map((win, index) => (
            <div
              key={win.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:shadow-orange-200 transition-shadow"
            >
              <div className="flex items-center gap-6">
                {/* Number Badge */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-lg">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{win.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{win.description}</p>
                </div>

                {/* Stats Section */}
                <div className="flex items-center gap-8">
                  {/* Deadline */}
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Deadline
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatDate(win.deadline)}
                    </div>
                  </div>

                  {/* Assigned To */}
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Assigned to</div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center text-xs font-semibold">
                        {win.assignedTo.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{win.assignedTo}</span>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={() => navigate(`/must-wins/${win.id}/edit`)}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-orange-50 rounded-lg transition-colors"
                    title="Edit Must-Win"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
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
