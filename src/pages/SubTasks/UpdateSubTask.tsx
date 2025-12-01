import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const UpdateSubTask = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const subTaskId = searchParams.get('id')

  const [formData, setFormData] = useState({
    keyActivity: '',
    title: '',
    description: '',
    assignToHead: '',
    deadline: ''
  })

  const keyActivities = [
    { id: 1, name: 'Key Activity 1' },
    { id: 2, name: 'Key Activity 2' },
    { id: 3, name: 'Key Activity 3' },
    { id: 4, name: 'Key Activity 4' }
  ]

  // Load existing sub-task data
  useEffect(() => {
    if (subTaskId) {
      // TODO: Fetch from Azure Table Storage
      // Mock data for now based on subTaskId
      setFormData({
        keyActivity: 'Key Activity 1',
        title: 'Database Migration',
        description: 'Migrate legacy database to cloud infrastructure',
        assignToHead: 'Fredrik Eder',
        deadline: '2026-02-15',
      })
    }
  }, [subTaskId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Updated sub-task data:', formData)
    // TODO: Save to Azure Table Storage
    navigate('/sub-tasks')
  }

  const handleCancel = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Update sub-task</h1>
          <p className="text-gray-600">Edit sub-task details</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Key Activity Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key activity
              </label>
              <select
                value={formData.keyActivity}
                onChange={(e) => setFormData({ ...formData, keyActivity: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Select Key Activity</option>
                {keyActivities.map((activity) => (
                  <option key={activity.id} value={activity.name}>
                    {activity.name}
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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateSubTask
