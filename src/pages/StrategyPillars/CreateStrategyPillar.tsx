import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateStrategyPillar = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    title: '',
    description: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save to Azure Table Storage
    console.log('Creating pillar:', formData)
    // Navigate back to strategy pillars list
    navigate('/strategy-pillars')
  }

  const handleCancel = () => {
    navigate('/strategy-pillars')
  }

  const years = [2026, 2027, 2028]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Strategy Pillar</h1>
          <p className="text-gray-600">
            To support the business goals, we define strategic Technology pillars for mirroring the business pillars, with specific Technology objectives
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Create Strategy Pillar</h2>
          <p className="text-sm text-gray-500 mb-6">Add a new strategic pillar and assign to win/wins.</p>

          <form onSubmit={handleSubmit}>
            {/* Year Field */}
            <div className="mb-6">
              <label htmlFor="year" className="block text-sm font-medium text-gray-900 mb-2">
                Year
              </label>
              <select
                id="year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors appearance-none bg-no-repeat bg-right"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.25rem'
                }}
                required
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Pillar Title Field */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
                Pillar Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter pillar title"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors placeholder:text-gray-400"
                required
              />
            </div>

            {/* Description Field */}
            <div className="mb-8">
              <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the pillar"
                rows={6}
                maxLength={1000}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors placeholder:text-gray-400 resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/1000 characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Create Pillar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateStrategyPillar
