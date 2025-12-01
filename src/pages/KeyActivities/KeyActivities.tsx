import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface KeyActivity {
  id: number
  title: string
  description: string
  subtasks: number
  deadline: string
  assignedTo: string
  assignedToAvatar: string
}

const KeyActivities = () => {
  const navigate = useNavigate()
  const [selectedYear, setSelectedYear] = useState<number>(2026)

  // Mock data - TODO: Replace with actual data from Azure Table Storage
  const keyActivities: KeyActivity[] = [
    {
      id: 1,
      title: 'CRM Transformation',
      description: 'Reach tailgates of Apollo program',
      subtasks: 2,
      deadline: '2026-02-04',
      assignedTo: 'Fredrik Eder',
      assignedToAvatar: 'FE'
    },
    {
      id: 2,
      title: 'Self Service Merger',
      description: 'Deliver a unified Scandinavian self-service platform for B2C and B2B customers to improve experience and efficiency.',
      subtasks: 4,
      deadline: '2026-03-01',
      assignedTo: 'Fredrik Eder',
      assignedToAvatar: 'FE'
    },
    {
      id: 3,
      title: 'Cost Efficiency',
      description: 'By smart spending to drive sustainable growth.',
      subtasks: 2,
      deadline: '2026-02-02',
      assignedTo: 'Caroline Lundback',
      assignedToAvatar: 'CL'
    },
    {
      id: 4,
      title: 'Cloud Right Strategy',
      description: 'Ensuring stable existing infrastructure and adheres to Telcom security requirement and compliance.',
      subtasks: 2,
      deadline: '2026-02-01',
      assignedTo: 'Jonas Blom',
      assignedToAvatar: 'JB'
    }
  ]

  const getSubtaskProgress = (subtasks: number) => {
    // Mock progress - TODO: Calculate actual progress from subtasks
    const completed = Math.floor(Math.random() * subtasks)
    return { completed, total: subtasks }
  }

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
  }

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-green-500'
    if (percentage >= 50) return 'bg-yellow-500'
    if (percentage >= 25) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section with Action Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Key Activities</h1>
              <p className="text-gray-600">Track and manage your team's important tasks and milestones and also create sub-tasks for each key activity</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/key-activities/progress')}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium whitespace-nowrap"
              >
                Update Progress
              </button>
              <button
                onClick={() => navigate('/key-activities/create')}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium whitespace-nowrap"
              >
                Create a Sub-Task
              </button>
              
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-6 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                <option value={2026}>Win-1</option>
                <option value={2027}>Win-2</option>
                <option value={2028}>Win-3</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Activities List */}
        <div className="space-y-4">
          {keyActivities.map((activity, index) => {
            const progress = getSubtaskProgress(activity.subtasks)
            const percentage = getProgressPercentage(progress.completed, progress.total)
            const progressColor = getProgressColor(percentage)

            return (
              <div
                key={activity.id}
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
                  <div 
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => navigate(`/key-activities/${activity.id}`)}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{activity.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{activity.description}</p>
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
                        {formatDeadline(activity.deadline)}
                      </div>
                    </div>

                    {/* Assigned To */}
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Assigned to</div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center text-xs font-semibold">
                          {activity.assignedToAvatar}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{activity.assignedTo}</span>
                      </div>
                    </div>

                    {/* Edit Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/key-activities/update?id=${activity.id}`)
                      }}
                      className="p-2 text-gray-500 hover:text-primary hover:bg-orange-50 rounded-lg transition-colors"
                      title="Edit Key Activity"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
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
