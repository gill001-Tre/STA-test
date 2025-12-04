import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useYear } from '@/contexts/YearContext'
import { loadFromYearStorage, saveToYearStorage, STORAGE_KEYS } from '@/utils/storageHelper'

const CreateSubTask = () => {
  const navigate = useNavigate()
  const { selectedYear } = useYear()
  const [searchParams] = useSearchParams()
  const keyActivityIdFromUrl = searchParams.get('keyActivityId')
  
  const [mustWins, setMustWins] = useState<any[]>([])
  const [keyActivities, setKeyActivities] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_selectedMustWinId, setSelectedMustWinId] = useState<string>('')
  
  const [formData, setFormData] = useState({
    mustWin: '',
    keyActivity: keyActivityIdFromUrl ? Number(keyActivityIdFromUrl) : '',
    title: '',
    description: '',
    assignToHead: '',
    deadline: ''
  })

  // Load must-wins and key activities from year-aware storage
  useEffect(() => {
    const storedMustWins = loadFromYearStorage(STORAGE_KEYS.MUST_WINS, selectedYear)
    if (storedMustWins) {
      try {
        const wins = Array.isArray(storedMustWins) ? storedMustWins : []
        setMustWins(wins)
      } catch (e) {
        console.error('Failed to parse must-wins:', e)
      }
    }

    const storedActivities = loadFromYearStorage(STORAGE_KEYS.KEY_ACTIVITIES, selectedYear)
    if (storedActivities) {
      try {
        const activities = Array.isArray(storedActivities) ? storedActivities : []
        setKeyActivities(activities)
        
        // If keyActivityId is in URL, pre-populate the form
        if (keyActivityIdFromUrl) {
          const activity = activities.find((a: any) => a.id === Number(keyActivityIdFromUrl))
          if (activity) {
            setFormData(prev => ({
              ...prev,
              mustWin: activity.assignedMustWin,
              keyActivity: Number(keyActivityIdFromUrl)
            }))
            setSelectedMustWinId(String(activity.assignedMustWin))
          }
        }
      } catch (e) {
        console.error('Failed to parse key activities:', e)
      }
    }
  }, [selectedYear, keyActivityIdFromUrl])

  // Filter key activities based on selected must-win
  const filteredKeyActivities = formData.mustWin
    ? keyActivities.filter((activity: any) => activity.assignedMustWin === Number(formData.mustWin))
    : []

  const handleMustWinChange = (winId: string) => {
    setFormData(prev => ({
      ...prev,
      mustWin: winId,
      keyActivity: '' // Reset key activity when must-win changes
    }))
  }

  const handleKeyActivityChange = (activityId: string) => {
    setFormData(prev => ({
      ...prev,
      keyActivity: activityId
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Load existing sub-tasks from year-aware storage
    const stored = loadFromYearStorage(STORAGE_KEYS.SUB_TASKS, selectedYear)
    let subTasks = []
    let maxId = 0
    
    if (stored) {
      try {
        subTasks = stored
        maxId = Math.max(...subTasks.map((t: any) => t.id), 0)
      } catch (e) {
        console.error('Failed to parse sub-tasks:', e)
      }
    }

    // Get selected key activity object
    const selectedActivity = keyActivities.find((a: any) => a.id === Number(formData.keyActivity))
    
    // Create new sub-task
    const newSubTask = {
      id: maxId + 1,
      number: `T${maxId + 1}`,
      title: formData.title,
      description: formData.description,
      deadline: formData.deadline,
      assignedTo: formData.assignToHead,
      assignedToAvatar: formData.assignToHead.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
      keyActivity: selectedActivity?.title || formData.keyActivity,
      assignedKeyActivityId: Number(formData.keyActivity)
    }
    
    // Save to year-aware storage
    subTasks.push(newSubTask)
    saveToYearStorage(STORAGE_KEYS.SUB_TASKS, subTasks, selectedYear)
    
    console.log('Sub-task created:', newSubTask)
    navigate(`/sub-tasks?keyActivityId=${formData.keyActivity}`)
  }

  const handleCancel = () => {
    navigate('/sub-tasks')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a new sub-task</h1>
          <p className="text-gray-600">Add a new sub-task and assign to TeamChef</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Must-Win Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Must-Win
              </label>
              <select
                value={formData.mustWin}
                onChange={(e) => handleMustWinChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Select a Must-Win</option>
                {mustWins.map((win) => (
                  <option key={win.id} value={win.id}>
                    {win.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Key Activity Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Activity
              </label>
              <select
                value={formData.keyActivity}
                onChange={(e) => handleKeyActivityChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                disabled={!formData.mustWin}
              >
                <option value="">
                  {formData.mustWin ? 'Select a Key Activity' : 'Select a Must-Win first'}
                </option>
                {filteredKeyActivities.map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-task Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub-task Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter sub-task title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the sub-task"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            {/* Assign to TeamChef */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to TeamChef
              </label>
              <input
                type="text"
                value={formData.assignToHead}
                onChange={(e) => setFormData({ ...formData, assignToHead: e.target.value })}
                placeholder="Assign to TeamChef"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                placeholder="Enter date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Create Sub-task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateSubTask
