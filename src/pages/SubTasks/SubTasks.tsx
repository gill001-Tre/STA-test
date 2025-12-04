import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useYear } from '@/contexts/YearContext'
import { loadFromYearStorage, saveToYearStorage, STORAGE_KEYS } from '@/utils/storageHelper'

const STORAGE_KEY = 'sub-tasks-data'

interface SubTask {
  id: number
  number: string
  title: string
  description: string
  deadline: string
  assignedTo: string
  assignedToAvatar: string
  keyActivity: string
}

const SubTasks = () => {
  const navigate = useNavigate()
  const { selectedYear } = useYear()
  const [searchParams] = useSearchParams()
  const [selectedFilter, setSelectedFilter] = useState<string>('Key Activity 1')
  const [allSubTasks, setAllSubTasks] = useState<SubTask[]>([])

  // Load sub-tasks from year-aware storage
  useEffect(() => {
    const loadSubTasks = () => {
      const stored = loadFromYearStorage(STORAGE_KEYS.SUB_TASKS, selectedYear)
      if (stored) {
        try {
          const parsed = stored
          setAllSubTasks(parsed)
        } catch (e) {
          console.error('Failed to parse sub-tasks:', e)
        }
      }
    }
    loadSubTasks()
  }, [selectedYear])

  // Sync filter from URL params
  useEffect(() => {
    const keyActivityFromUrl = searchParams.get('keyActivity')
    if (keyActivityFromUrl) {
      setSelectedFilter(keyActivityFromUrl)
    }
  }, [searchParams])

  // Key activity mapping
  const keyActivityMap: { [key: string]: string } = {
    'Key Activity 1': 'CRM Transformation',
    'Key Activity 2': 'Self Service Merger',
    'Key Activity 3': 'Cost Efficiency',
    'Key Activity 4': 'Cloud Right Strategy'
  }

  // Filter sub-tasks based on selected key activity
  const subTasks = selectedFilter === 'All' 
    ? allSubTasks 
    : allSubTasks.filter(task => task.keyActivity === selectedFilter)

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
  }

  const handleDeleteTask = (taskId: number) => {
    const updatedTasks = allSubTasks.filter(task => task.id !== taskId)
    setAllSubTasks(updatedTasks)
    saveToYearStorage(STORAGE_KEYS.SUB_TASKS, updatedTasks, selectedYear)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section with Action Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sub-tasks</h1>
              <p className="text-gray-600">Track and manage sub-tasks for activities</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/sub-tasks/create?keyActivity=${encodeURIComponent(selectedFilter)}`)}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium whitespace-nowrap"
              >
                Create Sub-task
              </button>
              
              <button
                onClick={() => navigate(`/sub-tasks/progress?keyActivity=${encodeURIComponent(selectedFilter)}`)}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium whitespace-nowrap"
              >
                Update Progress
              </button>
              
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                <option value="Key Activity 1">Key Activity 1</option>
                <option value="Key Activity 2">Key Activity 2</option>
                <option value="Key Activity 3">Key Activity 3</option>
                <option value="Key Activity 4">Key Activity 4</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sub-tasks Grid */}
        <div className="space-y-4">
          {subTasks.map((subTask, index) => (
            <div
              key={subTask.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:shadow-orange-200 transition-all p-6"
            >
              <div className="flex items-center justify-between">
                {/* Left Side - Badge, Title, Description */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0">
                    T{index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {subTask.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {subTask.description}
                    </p>
                  </div>
                </div>

                {/* Right Side - Deadline, Assigned, Edit */}
                <div className="flex items-center gap-8 ml-8">
                  {/* Deadline */}
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Deadline</span>
                    </div>
                    <p className="font-medium text-gray-900">{formatDeadline(subTask.deadline)}</p>
                  </div>

                  {/* Assigned */}
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Assigned to</p>
                    <div className="flex items-center justify-center">
                      <div 
                        className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-semibold cursor-pointer"
                        title={subTask.assignedTo}
                      >
                        {subTask.assignedToAvatar}
                      </div>
                    </div>
                  </div>

                  {/* Edit Icon */}
                  <button
                    onClick={() => navigate(`/sub-tasks/update?id=${subTask.id}&keyActivity=${encodeURIComponent(selectedFilter)}`)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  {/* Delete Icon */}
                  <button
                    onClick={() => handleDeleteTask(subTask.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

export default SubTasks
