import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Pillar {
  id: number
  number: string
  title: string
  description: string
  objectives: string[]
  assignedWins: number[]
}

const STORAGE_KEY = 'strategy-pillars-assignments'

const CreateStrategyPillar = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    title: '',
    description: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Load existing pillars from localStorage
    const stored = localStorage.getItem(STORAGE_KEY)
    let existingPillars: Pillar[] = []
    if (stored) {
      try {
        existingPillars = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse stored pillars:', e)
      }
    }

    // Generate new pillar ID and number
    const newId = existingPillars.length > 0 
      ? Math.max(...existingPillars.map(p => p.id)) + 1 
      : 1
    const newNumber = `P${newId}`

    // Create new pillar with objectives from description (split by newlines)
    const objectives = formData.description
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)

    const newPillar: Pillar = {
      id: newId,
      number: newNumber,
      title: formData.title,
      description: formData.description,
      objectives: objectives,
      assignedWins: []
    }

    // Add new pillar to array and save
    const updatedPillars = [...existingPillars, newPillar]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPillars))
    
    console.log('Created pillar:', newPillar)
    
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
                Description (Objectives)
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter objectives (one per line)"
                  rows={6}
                  maxLength={1000}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors placeholder:text-gray-400 resize-none"
                  required
                />
                <div className="absolute top-2 right-2 text-gray-400 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                {formData.description.length}/1000 characters • Each line will appear as a bullet point
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
