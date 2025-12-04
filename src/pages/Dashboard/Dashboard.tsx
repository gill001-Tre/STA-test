import { useState, useEffect } from 'react'
import StatCard from '@/components/UI/StatCard'
import ProgressBar from '@/components/UI/ProgressBar'
import StatusBadge from '@/components/UI/StatusBadge'
import { useYear } from '@/contexts/YearContext'
import { loadFromYearStorage, STORAGE_KEYS } from '@/utils/storageHelper'

interface PillarAssignment {
  id: number
  number: string
  title: string
  assignedWins: number[]
}

// Helper function to get assigned pillars for a must-win (year-aware)
const getAssignedPillars = (mustWinId: number, selectedYear: number): PillarAssignment[] => {
  const stored = loadFromYearStorage(STORAGE_KEYS.STRATEGY_PILLARS, selectedYear)
  if (!stored) return []
  
  try {
    const pillars = Array.isArray(stored) ? stored : []
    return pillars.filter((pillar: PillarAssignment) => pillar.assignedWins && pillar.assignedWins.includes(mustWinId))
  } catch (e) {
    console.error('Failed to get assigned pillars:', e)
    return []
  }
}

type Status = 'on-track' | 'in-progress' | 'needs-attention'

interface MustWin {
  id: number
  title: string
  winOwner?: string
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
  assignedMustWin?: string | number
  deadline?: string
  assignee: { name: string; avatar: string }
}

// Mock data - will be replaced with API calls
const mockData = {
  progressLevels: {
    onTrack: '> 60%',
    inProgress: '30 - 60%',
    needsAttention: '0 - 29%'
  },
  strategyPillars: [],
  
  mustWins: [],
  
  keyActivities: []
  
}

const Dashboard = () => {
  const { selectedYear } = useYear()
  const [selectedWin, setSelectedWin] = useState<number | string>('')
  const [mustWins, setMustWins] = useState<MustWin[]>(mockData.mustWins)
  const [keyActivities, setKeyActivities] = useState<KeyActivity[]>(mockData.keyActivities)
  const [strategyPillarsWithWins, setStrategyPillarsWithWins] = useState<any[]>([])
  const [totalSubTasksCount, setTotalSubTasksCount] = useState(0)

  // Load must-win and key activity progress from year-aware localStorage
  useEffect(() => {
    // Clear old data on mount for testing - COMMENT OUT AFTER INITIAL TESTING
    // localStorage.removeItem('strategy-pillars-assignments')
    // localStorage.removeItem('must-wins-data')
    // localStorage.removeItem('key-activities-data')
    // localStorage.removeItem('sub-tasks-data')
    
    const loadData = () => {
      // Load pillars with win counts from year-aware storage
      const storedPillars = loadFromYearStorage(STORAGE_KEYS.STRATEGY_PILLARS, selectedYear)
      if (storedPillars) {
        const pillars = Array.isArray(storedPillars) ? storedPillars : []
        setStrategyPillarsWithWins(pillars.map((pillar: any) => ({
          id: pillar.id,
          number: pillar.number,
          title: pillar.title,
          winsCount: pillar.assignedWins?.length || 0,
          assignedWins: pillar.assignedWins || []
        })))
      } else {
        setStrategyPillarsWithWins([])
      }
      
      // Load sub-tasks count from year-aware localStorage
      const storedSubTasks = loadFromYearStorage(STORAGE_KEYS.SUB_TASKS, selectedYear)
      if (storedSubTasks) {
        try {
          const subTasks = Array.isArray(storedSubTasks) ? storedSubTasks : []
          setTotalSubTasksCount(subTasks.length)
        } catch (e) {
          console.error('Failed to parse sub-tasks:', e)
          setTotalSubTasksCount(0)
        }
      } else {
        setTotalSubTasksCount(0)
      }
      
      // Load key activities to count them per win
      const storedActivities = loadFromYearStorage(STORAGE_KEYS.KEY_ACTIVITIES, selectedYear)
      const activitiesByWin: { [key: number]: number } = {}
      if (storedActivities) {
        try {
          const parsedActivities = Array.isArray(storedActivities) ? storedActivities : []
          parsedActivities.forEach((activity: any) => {
            const winId = Number(activity.assignedMustWin)
            if (winId) {
              activitiesByWin[winId] = (activitiesByWin[winId] || 0) + 1
            }
          })
        } catch (e) {
          console.error('Failed to parse key activities for count:', e)
        }
      }
      
      const storedMustWins = loadFromYearStorage(STORAGE_KEYS.MUST_WINS, selectedYear)
      if (storedMustWins) {
        try {
          const parsedMustWins = Array.isArray(storedMustWins) ? storedMustWins : []
          // Map to dashboard format
          const formattedMustWins = parsedMustWins.map((win: any) => ({
            id: win.id,
            title: win.title,
            winOwner: win.winOwner || '',
            progress: win.progress || 0,
            status: win.status || 'needs-attention',
            activitiesCount: activitiesByWin[win.id] || 0,
            deadline: win.deadline || 'N/A',
            assignees: (win.owners || (win.owner ? [win.owner] : [])).map((owner: string) => ({
              name: owner,
              avatar: owner.split(' ').map(n => n[0]).join('').toUpperCase()
            }))
          }))
          setMustWins(formattedMustWins)
        } catch (e) {
          console.error('Failed to parse must-wins:', e)
          setMustWins([])
        }
      } else {
        setMustWins([])
      }
      
      // Load key activities from year-aware localStorage
      if (storedActivities) {
        try {
          const parsedActivities = Array.isArray(storedActivities) ? storedActivities : []
          // Map to dashboard format
          const formattedActivities = parsedActivities.map((activity: any) => ({
            id: activity.id,
            title: activity.title,
            progress: activity.progress || 0,
            status: activity.status || 'needs-attention',
            totalTasks: 100, // Use as denominator for percentage calculation
            completedTasks: activity.progress || 0, // Use progress as the completed amount
            assignedMustWin: activity.assignedMustWin, // Store the win ID for filtering
            deadline: activity.deadline || 'TBD',
            assignee: {
              name: activity.assignToHead || 'Unassigned',
              avatar: activity.assignToHead ? activity.assignToHead.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'NA'
            }
          }))
          setKeyActivities(formattedActivities)
        } catch (e) {
          console.error('Failed to parse key activities:', e)
          setKeyActivities([])
        }
      } else {
        setKeyActivities([])
      }
    }

    // Load data initially
    loadData()

    // Reload data when window gains focus (e.g., after navigating back from another page)
    const handleFocus = () => {
      loadData()
    }
    
    window.addEventListener('focus', handleFocus)
    
    // Cleanup
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [selectedYear])

  // Set default win to first available win
  useEffect(() => {
    if (mustWins.length > 0 && !selectedWin) {
      setSelectedWin(mustWins[0].id)
    }
  }, [mustWins])

  // Helper function to count sub-tasks for a specific key activity
  const getSubTasksCountForActivity = (activity: any): number => {
    try {
      const storedSubTasks = loadFromYearStorage(STORAGE_KEYS.SUB_TASKS, selectedYear)
      if (storedSubTasks) {
        const subTasks = Array.isArray(storedSubTasks) ? storedSubTasks : []
        if (Array.isArray(subTasks)) {
          // Sub-tasks store the key activity as a string like "Key Activity 1" or the activity title
          // Match by either the key activity name or the activity title
          return subTasks.filter((task: any) => 
            task.keyActivity === activity.title || 
            task.keyActivity === `Key Activity ${activity.id}`
          ).length
        }
      }
    } catch (e) {
      console.error('Failed to count sub-tasks:', e)
    }
    return 0
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
            value={strategyPillarsWithWins.length > 0 ? strategyPillarsWithWins.length : mockData.strategyPillars.length}
          />
          <StatCard
            icon={
              <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.7-6.3 4.7 2.3-7-6-4.6h7.6z"/>
              </svg>
            }
            label="Must wins"
            value={mustWins.length}
          />
          <StatCard
            icon={
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            }
            label="Key Activities"
            value={keyActivities.length}
          />
          <StatCard
            icon={
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 7l2 2 4-4" />
              </svg>
            }
            label="Total Sub-tasks"
            value={totalSubTasksCount.toString()}
          />
        </div>
      </div>

      {/* Strategic Pillars */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Strategic Pillars</h2>
        <div className="grid grid-cols-3 gap-4">
          {(strategyPillarsWithWins.length > 0 ? strategyPillarsWithWins : mockData.strategyPillars).map((pillar: any) => (
            <div key={pillar.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">{pillar.title}</h3>
              <div className="flex items-start gap-2 text-sm">
                <span className="font-bold text-gray-900 whitespace-nowrap">{pillar.winsCount}-win{pillar.winsCount !== 1 ? 's' : ''}</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {pillar.assignedWins && pillar.assignedWins.map((winId: number) => (
                    <span
                      key={winId}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L8 8l-6 1 4.5 4L5.5 19 12 15.5 18.5 19l-1-6L22 9l-6-1z"/>
                      </svg>
                      W{winId}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Must-Wins */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Must-Wins</h2>
        <div className="grid grid-cols-2 gap-4">
          {mustWins.map((win) => {
            const assignedPillars = getAssignedPillars(win.id, selectedYear)
            
            return (
              <div key={win.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L8 8l-6 1 4.5 4L5.5 19 12 15.5 18.5 19l-1-6L22 9l-6-1z"/>
                    </svg>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{win.title}</h3>
                      {win.winOwner && (
                        <p className="text-xs text-gray-600 font-medium">Primary Owner: {win.winOwner}</p>
                      )}
                      <p className="text-sm text-gray-500">Total Key Activities: {win.activitiesCount}</p>
                      
                      {/* Assigned Pillars Badges */}
                      {assignedPillars.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {assignedPillars.map((pillar) => (
                            <span key={pillar.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              {pillar.number}
                            </span>
                          ))}
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
                    {win.assignees.slice(0, 3).map((assignee, idx) => (
                      <div 
                        key={idx} 
                        className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-semibold text-white border-2 border-white cursor-pointer"
                        title={assignee.name}
                      >
                        {assignee.avatar}
                      </div>
                    ))}
                    {win.assignees.length > 3 && (
                      <div
                        className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-xs font-semibold text-white border-2 border-white cursor-pointer"
                        title={win.assignees.slice(3).map(a => a.name).join(', ')}
                      >
                        +{win.assignees.length - 3}
                      </div>
                    )}
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
            onChange={(e) => setSelectedWin(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {mustWins.map((win) => (
              <option key={win.id} value={win.id}>
                Win {win.id} - {win.title}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          {keyActivities
            .filter(activity => !selectedWin || Number(activity.assignedMustWin) === Number(selectedWin))
            .map((activity) => {
            const progressPercentage = activity.totalTasks > 0 ? Math.round((activity.completedTasks / activity.totalTasks) * 100) : 0
            
            // Determine color based on percentage criteria: > 60% Orange, 30-60% Yellow, 0-29% Red
            let statusColor = 'red' // 0-29% - Needs Attention
            let statusLabel = 'Needs Attention'
            if (progressPercentage > 60) {
              statusColor = 'orange' // > 60% - On Track
              statusLabel = 'On Track'
            } else if (progressPercentage >= 30) {
              statusColor = 'yellow' // 30-60% - In Progress
              statusLabel = 'In Progress'
            }
            
            // Get status colors and labels
            const statusConfig = statusColor === 'orange'
              ? { color: 'text-primary', bg: 'bg-orange-50', icon: 'text-primary', label: statusLabel }
              : statusColor === 'yellow'
              ? { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: 'text-yellow-600', label: statusLabel }
              : { color: 'text-red-600', bg: 'bg-red-50', icon: 'text-red-600', label: statusLabel }
            
            return (
              <div key={activity.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-lg transition-all">
                {/* Top Row: Title and Progress */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">{activity.title}</h3>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      statusColor === 'orange'
                        ? 'bg-primary/10 text-primary'
                        : statusColor === 'yellow'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        statusColor === 'orange'
                          ? 'bg-primary'
                          : statusColor === 'yellow'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}></span>
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Circular Progress on Right */}
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-gray-900 text-right">{progressPercentage}%</div>
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <svg className="w-12 h-12" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle cx="50" cy="50" r="45" fill="#e5e7eb" />
                        
                        {/* Progress pie slice */}
                        {(() => {
                          const percentage = Math.min(progressPercentage, 100);
                          const radius = 45;
                          const angle = (percentage / 100) * 360;
                          const radians = (angle - 90) * (Math.PI / 180);
                          const x = 50 + radius * Math.cos(radians);
                          const y = 50 + radius * Math.sin(radians);
                          const largeArc = angle > 180 ? 1 : 0;
                          
                          const fillColor = statusColor === 'orange'
                            ? '#FF6600'
                            : statusColor === 'yellow'
                            ? '#FBBF24'
                            : '#EF4444';
                          
                          const pathData = `M 50 50 L 50 5 A 45 45 0 ${largeArc} 1 ${x} ${y} Z`;
                          
                          return (
                            <path d={pathData} fill={fillColor} />
                          );
                        })()}
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Deadline and Owner */}
                <div className="pt-3 border-t border-gray-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 7l2 2 4-4" />
                    </svg>
                    <span className="text-gray-500">Sub-tasks:</span>
                    <span className="font-semibold text-primary">{getSubTasksCountForActivity(activity)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-500">Deadline:</span>
                    <span className="font-semibold text-gray-900">{activity.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-500">Owner:</span>
                    <span className="font-semibold text-gray-900">{activity.assignee.name}</span>
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

