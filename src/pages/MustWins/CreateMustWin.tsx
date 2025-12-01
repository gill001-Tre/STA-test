import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateMustWin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    year: 2026,
    title: '',
    description: '',
    assignedPillars: [] as string[],
    assignToHead: '',
    deadline: ''
  })

  const strategyPillars = [
    'Cost Leadership via Technology Efficiency',
    'Business Differentiation through Digital Innovation',
    'Operational Excellence & Agility'
  ]

  const handlePillarToggle = (pillar: string) => {
    setFormData(prev => ({
      ...prev,
      assignedPillars: prev.assignedPillars.includes(pillar)
        ? prev.assignedPillars.filter(p => p !== pillar)
        : [...prev.assignedPillars, pillar]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Creating Must-Win:', formData)
    // TODO: Save to Azure Table Storage
    navigate('/must-wins')
  }

  const handleCancel = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Must - Wins</h1>
          <p className="text-gray-600">Define and manage must - wins for each year</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Must-Win</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Year */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                id="year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white bg-no-repeat bg-right cursor-pointer"
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

            {/* Win Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Win Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter win title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                maxLength={1000}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Describe the win"
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {formData.description.length}/1000
              </div>
            </div>

            {/* Assign to Strategy Pillar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Assign to Strategy Pillar
              </label>
              <div className="space-y-2">
                {strategyPillars.map((pillar) => (
                  <div
                    key={pillar}
                    onClick={() => handlePillarToggle(pillar)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.assignedPillars.includes(pillar)
                        ? 'border-primary bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Checkbox */}
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          formData.assignedPillars.includes(pillar)
                            ? 'bg-primary border-primary'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {formData.assignedPillars.includes(pillar) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{pillar}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assign to Head of Department */}
            <div>
              <label htmlFor="assignToHead" className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Head of Department
              </label>
              <input
                type="text"
                id="assignToHead"
                value={formData.assignToHead}
                onChange={(e) => setFormData({ ...formData, assignToHead: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Select Head of Department"
              />
            </div>

            {/* Deadline */}
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <input
                type="date"
                id="deadline"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Create Win
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateMustWin
