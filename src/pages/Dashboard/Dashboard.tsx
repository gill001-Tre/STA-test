import { useState, useEffect } from 'react'
import StatCard from '@/components/UI/StatCard'
import ProgressBar from '@/components/UI/ProgressBar'
import StatusBadge from '@/components/UI/StatusBadge'
import ProgressCircle from '@/components/UI/ProgressCircle'

const STORAGE_KEY = 'strategy-pillars-assignments'
const MUST_WINS_STORAGE_KEY = 'must-wins-data'
const KEY_ACTIVITIES_STORAGE_KEY = 'key-activities-data'

interface PillarAssignment {
  id: number
  number: string
  title: string
  assignedWins: number[]
}

interface MustWinProgress {
  id: number
  progress: number
  status: 'on-track' | 'in-progress' | 'needs-attention'
}

interface KeyActivityProgress {
  id: number
  progress: number
  status: 'on-track' | 'in-progress' | 'needs-attention'
}

// Helper function to get must-win progress from localStorage
const getMustWinProgress = (mustWinId: number): MustWinProgress | null => {
  const stored = localStorage.getItem(MUST_WINS_STORAGE_KEY)
  if (!stored) return null
  
  try {
    const mustWins = JSON.parse(stored)
    const mustWin = mustWins.find((w: any) => w.id === mustWinId)
    if (mustWin) {
      return {
        id: mustWin.id,
        progress: mustWin.progress,
        status: mustWin.status
      }
    }
    return null
  } catch (e) {
    console.error('Failed to parse must-wins data:', e)
    return null
  }
}

// Helper function to get key activity progress from localStorage
const getKeyActivityProgress = (activityId: number): KeyActivityProgress | null => {
  const stored = localStorage.getItem(KEY_ACTIVITIES_STORAGE_KEY)
  if (!stored) return null
  
  try {
    const activities = JSON.parse(stored)
    const activity = activities.find((a: any) => a.id === activityId)
    if (activity) {
      return {
        id: activity.id,
        progress: activity.progress,
        status: activity.status
      }
    }
    return null
  } catch (e) {
    console.error('Failed to parse key-activities data:', e)
    return null
  }
}

// Helper function to get assigned pillar for a must-win
const getAssignedPillar = (mustWinId: number): PillarAssignment | null => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return null
  
  try {
    const pillars: PillarAssignment[] = JSON.parse(stored)
    return pillars.find(pillar => pillar.assignedWins.includes(mustWinId)) || null
  } catch (e) {
    console.error('Failed to parse pillar assignments:', e)
    return null
  }
}

// Helper function to get all pillars with their assigned wins count
const getPillarsWithWinCount = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  
  try {
    const pillars: PillarAssignment[] = JSON.parse(stored)
    return pillars.map(pillar => ({
      id: pillar.id,
      number: pillar.number,
      title: pillar.title,
      winsCount: pillar.assignedWins.length
    }))
  } catch (e) {
    console.error('Failed to parse pillar assignments:', e)
    return []
  }
}

type Status = 'on-track' | 'in-progress' | 'needs-attention'

interface MustWin {
  id: number
  title: string
  progress: number
  status: Status
  activitiesCount: number
  deadline: string
  assignees: Array<{ name: string; avatar: string }>
}

interface KeyActivity {
  id: number
  title: string
  totalTasks: number
  completedTasks: number
  status: Status
  assignee: { name: string; avatar: string }
}

// Mock data - will be replaced with API calls
const mockData = {
  stats: {
    strategyPillars: 4,
    mustWins: 3,
    keyActivities: 12,
    totalTasks: 50,
    completedTasks: 20
  },
  progressLevels: {
    onTrack: '> 60%',
    inProgress: '30 - 60%',
    needsAttention: '0 - 29%'
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
      status: 'on-track' as Status,
      activitiesCount: 4,
      deadline: '2026-05-23',
      assignees: [
        { name: 'Fredrik Eder', avatar: 'FE' },
        { name: 'Caroline Lundberg', avatar: 'CL' },
        { name: 'Jennt Björn', avatar: 'JB' }
      ]
    },
    {
      id: 2,
      title: 'Cybersecurity & Compliance',
      progress: 60,
      status: 'in-progress' as Status,
      activitiesCount: 3,
      deadline: '2026-02-12',
      assignees: [{ name: 'Fredrik Eder', avatar: 'FE' }]
    },
    {
      id: 3,
      title: 'AI & Automation',
      progress: 70,
      status: 'on-track' as Status,
      activitiesCount: 2,
      deadline: '2026-10-13',
      assignees: [
        { name: 'Caroline Lundberg', avatar: 'CL' },
        { name: 'Michael Chen', avatar: 'MC' },
        { name: 'Emma Wilson', avatar: 'EW' }
      ]
    },
    {
      id: 4,
      title: '5G SA Launch',
      progress: 60,
      status: 'in-progress' as Status,
      activitiesCount: 3,
      deadline: '2026-02-13',
      assignees: [
        { name: 'Jennt Björn', avatar: 'JB' },
        { name: 'Sarah Johnson', avatar: 'SJ' }
      ]
    }
  ],
  keyActivities: [
    {
      id: 1,
      title: 'IT Stack Modernization',
      totalTasks: 5,
      completedTasks: 4,
      status: 'on-track' as Status,
      assignee: { name: 'Fredrik Eder', avatar: '' }
    },
    {
      id: 2,
      title: 'CRM Transformation',
      totalTasks: 5,
      completedTasks: 2,
      status: 'in-progress' as Status,
      assignee: { name: 'Caroline Lundberg', avatar: '' }
    },
    {
      id: 3,
      title: 'Self Service Merger',
      totalTasks: 5,
      completedTasks: 2,
      status: 'in-progress' as Status,
      assignee: { name: 'Jennet Björn', avatar: '' }
    },
    {
      id: 4,
      title: 'Cost Efficiency Drive',
      totalTasks: 5,
      completedTasks: 0,
      status: 'needs-attention' as Status,
      assignee: { name: 'Fredrik Eder', avatar: '' }
    }
  ]
}

const Dashboard = () => {
  const [selectedWin, setSelectedWin] = useState('all')
  const [mustWins, setMustWins] = useState<MustWin[]>(mockData.mustWins)
  const [keyActivities, setKeyActivities] = useState<KeyActivity[]>(mockData.keyActivities)
  
  // Get pillars with actual win counts from localStorage
  const strategyPillarsWithWins = getPillarsWithWinCount()

  // Load must-win and key activity progress from localStorage on mount
  useEffect(() => {
    const updatedMustWins = mockData.mustWins.map(win => {
      const progressData = getMustWinProgress(win.id)
      if (progressData) {
        return {
          ...win,
          progress: progressData.progress,
          status: progressData.status
        }
      }
      return win
    })
    setMustWins(updatedMustWins)

    // Load key activities progress from localStorage
    const updatedKeyActivities = mockData.keyActivities.map(activity => {
      const progressData = getKeyActivityProgress(activity.id)
      if (progressData) {
        // Calculate completed tasks based on progress percentage
        const completedTasks = Math.round((progressData.progress / 100) * activity.totalTasks)
        return {
          ...activity,
          completedTasks: completedTasks,
          status: progressData.status
        }
      }
      return activity
    })
    setKeyActivities(updatedKeyActivities)
  }, [])

  // Helper function to get activity status based on completed tasks
  const getActivityStatus = (totalTasks: number, completedTasks: number): 'on-track' | 'in-progress' | 'needs-attention' => {
    if (totalTasks === 0) return 'needs-attention'
    if (completedTasks === totalTasks) return 'on-track'
    const progress = (completedTasks / totalTasks) * 100
    if (progress >= 30) return 'in-progress'
    return 'needs-attention'
  }

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
          <span>{mockData.progressLevels.onTrack} - On Track</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>{mockData.progressLevels.inProgress} - In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>{mockData.progressLevels.needsAttention} - Needs Attention</span>
        </div>
      </div>

      {/* Strategic Performance Overview */}
      <div className="bg-primary rounded-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Strategic Performance Overview</h2>
        <p className="text-white/80 mb-6 text-sm">Get real-time visibility of data and analysis</p>
        
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            icon={
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            label="Strategy Pillars"
            value={mockData.stats.strategyPillars}
          />
          <StatCard
            icon={
              <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.7-6.3 4.7 2.3-7-6-4.6h7.6z"/>
              </svg>
            }
            label="Must wins"
            value={mockData.stats.mustWins}
          />
          <StatCard
            icon={
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            }
            label="Key Activities"
            value={mockData.stats.keyActivities}
          />
          <StatCard
            icon={
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 7l2 2 4-4" />
              </svg>
            }
            label="Total Tasks Done"
            value={`${mockData.stats.completedTasks}/${mockData.stats.totalTasks}`}
          />
        </div>
      </div>

      {/* Strategic Pillars */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Strategic Pillars</h2>
        <div className="grid grid-cols-3 gap-4">
          {strategyPillarsWithWins.length > 0 ? (
            strategyPillarsWithWins.map((pillar) => (
              <div key={pillar.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">{pillar.title}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-gray-900">{pillar.winsCount}-win{pillar.winsCount !== 1 ? 's' : ''}</span>
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(pillar.winsCount, 5))].map((_, idx) => (
                      <svg key={idx} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.7-6.3 4.7 2.3-7-6-4.6h7.6z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            mockData.strategyPillars.map((pillar) => (
              <div key={pillar.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">{pillar.title}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-gray-900">{pillar.winsCount}-win{pillar.winsCount > 1 ? 's' : ''}</span>
                  <div className="flex items-center gap-1">
                    {[...Array(pillar.winsCount)].map((_, idx) => (
                      <svg key={idx} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.7-6.3 4.7 2.3-7-6-4.6h7.6z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Must-Wins */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Must-Wins</h2>
        <div className="grid grid-cols-2 gap-4">
          {mustWins.map((win) => {
            const assignedPillar = getAssignedPillar(win.id)
            
            return (
              <div key={win.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L8 8l-6 1 4.5 4L5.5 19 12 15.5 18.5 19l-1-6L22 9l-6-1z"/>
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900">{win.title}</h3>
                      <p className="text-sm text-gray-500">Total Key Activities: {win.activitiesCount}</p>
                      
                      {/* Assigned Pillar Badge */}
                      {assignedPillar && (
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Strategic Pillar {assignedPillar.number}
                          </span>
                        </div>
                      )}
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
                  <div className="flex items-center -space-x-2">
                    {win.assignees.map((assignee, idx) => (
                      <div 
                        key={idx} 
                        className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-xs font-bold text-white border-2 border-white"
                        title={assignee.name}
                      >
                        {assignee.avatar}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
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
            <option value="Win-4">Win-4</option>
          </select>
        </div>

        <div className="space-y-3">
          {keyActivities.map((activity) => {
            const dynamicStatus = getActivityStatus(activity.totalTasks, activity.completedTasks)
            const progressPercentage = activity.totalTasks > 0 ? Math.round((activity.completedTasks / activity.totalTasks) * 100) : 0
            
            // Get status colors and labels
            const statusConfig = dynamicStatus === 'on-track' 
              ? { color: 'text-primary', bg: 'bg-orange-50', icon: 'text-primary', label: 'On Track' }
              : dynamicStatus === 'in-progress'
              ? { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: 'text-yellow-600', label: 'In Progress' }
              : { color: 'text-red-600', bg: 'bg-red-50', icon: 'text-red-600', label: 'Needs Attention' }
            
            return (
              <div key={activity.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  {/* Left - Title */}
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{activity.title}</h3>
                      <span className={`text-xs font-medium ${statusConfig.color}`}>{statusConfig.label}</span>
                    </div>
                  </div>

                  {/* Right - Progress Circle and Badge */}
                  <div className="flex items-center gap-3 ml-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {activity.completedTasks}/{activity.totalTasks} tasks
                      </span>
                    </div>
                    <div className="relative flex items-center justify-center">
                      <ProgressCircle
                        total={activity.totalTasks}
                        completed={activity.completedTasks}
                        size={40}
                        strokeWidth={4}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-gray-900 leading-none">{progressPercentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Info Row */}
                <div className="flex items-center justify-end text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{activity.assignee.name}</span>
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

export default Dashboard

