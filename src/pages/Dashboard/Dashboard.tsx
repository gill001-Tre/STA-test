import { useState } from 'react'
import StatCard from '@/components/UI/StatCard'
import ProgressBar from '@/components/UI/ProgressBar'
import StatusBadge from '@/components/UI/StatusBadge'
import ProgressCircle from '@/components/UI/ProgressCircle'

// Mock data - will be replaced with API calls
const mockData = {
  stats: {
    strategyPillars: 4,
    mustWins: 3,
    keyActivities: 12,
    overallProgress: 59
  },
  progressLevels: {
    onTrack: 40,
    inProgress: 30,
    needsAttention: 0.79
  },
  strategyPillars: [
    { id: 1, title: 'Cost Leadership via Technology Efficiency', winsCount: 2 },
    { id: 2, title: 'Business Differentiation through Digital Innovation', winsCount: 1 },
    { id: 3, title: 'Operational Excellence and Agility', winsCount: 1 }
  ],
  mustWins: [
    {
      id: 1,
      title: 'IT Stack Modernization',
      progress: 70,
      status: 'on-track' as const,
      activitiesCount: 4,
      deadline: '2026-05-23',
      assignees: [{ name: 'Fredrik Eder', avatar: '' }]
    },
    {
      id: 2,
      title: 'Cybersecurity & Compliance',
      progress: 60,
      status: 'on-track' as const,
      activitiesCount: 3,
      deadline: '2026-02-12',
      assignees: [{ name: 'Fredrik Eder', avatar: '' }]
    },
    {
      id: 3,
      title: 'AI & Automation',
      progress: 70,
      status: 'on-track' as const,
      activitiesCount: 2,
      deadline: '2026-10-13',
      assignees: [{ name: 'Caroline Lundberg', avatar: '' }]
    },
    {
      id: 4,
      title: '5G SA Launch',
      progress: 60,
      status: 'needs-attention' as const,
      activitiesCount: 3,
      deadline: '2026-02-13',
      assignees: [{ name: 'Jennet Björn', avatar: '' }]
    }
  ],
  keyActivities: [
    {
      id: 1,
      title: 'CRM Transformation',
      totalTasks: 5,
      completedTasks: 3,
      status: 'on-track' as const,
      assignee: { name: 'Fredrik Eder', avatar: '' }
    },
    {
      id: 2,
      title: 'Self Service Merger',
      totalTasks: 0,
      completedTasks: 0,
      status: 'on-track' as const,
      assignee: { name: 'Fredrik Eder', avatar: '' }
    },
    {
      id: 3,
      title: 'Cost Efficiency',
      totalTasks: 5,
      completedTasks: 2,
      status: 'needs-attention' as const,
      assignee: { name: 'Caroline Lundberg', avatar: '' }
    },
    {
      id: 4,
      title: 'Cloud Right Strategy',
      totalTasks: 5,
      completedTasks: 3,
      status: 'on-track' as const,
      assignee: { name: 'Jennet Björn', avatar: '' }
    }
  ]
}

const Dashboard = () => {
  const [selectedWin, setSelectedWin] = useState('Win-1')

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Progress Level Legend */}
      <div className="flex items-center gap-6 text-sm">
        <span className="font-medium text-gray-700">Progress Level:</span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span>{mockData.progressLevels.onTrack}% - On Track</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>{mockData.progressLevels.inProgress}% - In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>{mockData.progressLevels.needsAttention}% - Needs Attention</span>
        </div>
      </div>

      {/* Strategic Performance Overview */}
      <div className="bg-primary rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Strategic Performance Overview</h2>
        <p className="text-white/80 mb-6 text-sm">Get real-time visibility of data and analysis</p>
        
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            icon={
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            label="Strategy Pillars"
            value={mockData.stats.strategyPillars}
            iconBgColor="bg-orange-100"
          />
          <StatCard
            icon={
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.7-6.3 4.7 2.3-7-6-4.6h7.6z"/>
              </svg>
            }
            label="Must wins"
            value={mockData.stats.mustWins}
            iconBgColor="bg-yellow-100"
          />
          <StatCard
            icon={
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            }
            label="Key Activities"
            value={mockData.stats.keyActivities}
            iconBgColor="bg-orange-100"
          />
          <StatCard
            icon={
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            label="Overall Progress"
            value={`${mockData.stats.overallProgress}%`}
            iconBgColor="bg-orange-100"
          />
        </div>
      </div>

      {/* Strategic Pillars */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Strategic Pillars</h2>
        <div className="grid grid-cols-3 gap-4">
          {mockData.strategyPillars.map((pillar) => (
            <div key={pillar.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">{pillar.title}</h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-gray-900">{pillar.winsCount}-win{pillar.winsCount > 1 ? 's' : ''}</span>
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L8 8l-6 1 4.5 4L5.5 19 12 15.5 18.5 19l-1-6L22 9l-6-1z"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Must-Wins */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Must-Wins</h2>
        <div className="grid grid-cols-2 gap-4">
          {mockData.mustWins.map((win) => (
            <div key={win.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L8 8l-6 1 4.5 4L5.5 19 12 15.5 18.5 19l-1-6L22 9l-6-1z"/>
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">{win.title}</h3>
                    <p className="text-sm text-gray-500">Total Key Activities: {win.activitiesCount}</p>
                  </div>
                </div>
                <StatusBadge status={win.status} />
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <ProgressBar progress={win.progress} status={win.status} showPercentage={false} />
                  <span className="text-sm font-medium text-gray-600 ml-3">{win.progress}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Deadline: {win.deadline}</span>
                </div>
                <div className="flex items-center gap-2">
                  {win.assignees.map((assignee, idx) => (
                    <div key={idx} className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700">
                      {assignee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Activities */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Key Activities</h2>
          <select
            value={selectedWin}
            onChange={(e) => setSelectedWin(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Win-1">Win-1</option>
            <option value="Win-2">Win-2</option>
            <option value="Win-3">Win-3</option>
          </select>
        </div>

        <div className="space-y-3">
          {mockData.keyActivities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-sm text-gray-500">Key Activity {activity.id}</span>
                  <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                </div>

                <div className="flex items-center gap-6">
                  {/* Progress Circles */}
                  <div className="flex items-center gap-2">
                    {[...Array(activity.totalTasks || 5)].map((_, idx) => (
                      <ProgressCircle
                        key={idx}
                        total={1}
                        completed={idx < activity.completedTasks ? 1 : 0}
                        size={24}
                      />
                    ))}
                  </div>

                  <StatusBadge status={activity.status} />

                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      Total Tasks: {activity.totalTasks}/{activity.totalTasks}
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700">
                    {activity.assignee.name.split(' ').map(n => n[0]).join('')}
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

export default Dashboard

