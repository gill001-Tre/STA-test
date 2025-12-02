import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Pillar {
  id: number
  number: string
  title: string
  description: string
  objectives: string[]
  assignedWins: number[]
}

interface MustWin {
  id: number
  title: string
  description: string
  progress: number
  status: 'on-track' | 'in-progress' | 'needs-attention'
  winOwner: string
  owners: string[]
  deadline: string
  assignedPillars: string[]
}

const PILLARS_STORAGE_KEY = 'strategy-pillars-assignments'
const MUST_WINS_STORAGE_KEY = 'must-wins-data'

const CreateMustWin = () => {
  const navigate = useNavigate()
  const [strategyPillars, setStrategyPillars] = useState<Pillar[]>([])
  const [formData, setFormData] = useState({
    year: 2026,
    title: '',
    description: '',
    assignedPillars: [] as string[],
    winOwner: '',
    owners: [] as string[],
    deadline: ''
  })
  const [ownerInput, setOwnerInput] = useState('')

  // Load pillars from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(PILLARS_STORAGE_KEY)
    if (stored) {
      try {
        const pillars = JSON.parse(stored)
        setStrategyPillars(pillars)
      } catch (e) {
        console.error('Failed to parse stored pillars:', e)
      }
    }
  }, [])

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
    
    // Load existing must-wins from localStorage
    const stored = localStorage.getItem(MUST_WINS_STORAGE_KEY)
    let existingMustWins: MustWin[] = []
    if (stored) {
      try {
        existingMustWins = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse stored must-wins:', e)
      }
    }

    // Generate new must-win ID
    const newId = existingMustWins.length > 0 
      ? Math.max(...existingMustWins.map(w => w.id)) + 1 
      : 1

    // Create new must-win
    const newMustWin: MustWin = {
      id: newId,
      title: formData.title,
      description: formData.description,
      progress: 0,
      status: 'needs-attention',
      winOwner: formData.winOwner,
      owners: formData.owners,
      deadline: formData.deadline,
      assignedPillars: formData.assignedPillars
    }

    // Add new must-win to array and save
    const updatedMustWins = [...existingMustWins, newMustWin]
    localStorage.setItem(MUST_WINS_STORAGE_KEY, JSON.stringify(updatedMustWins))
    
    // Update pillars' assignedWins arrays
    if (formData.assignedPillars.length > 0) {
      const storedPillars = localStorage.getItem(PILLARS_STORAGE_KEY)
      if (storedPillars) {
        try {
          const pillars: Pillar[] = JSON.parse(storedPillars)
          const updatedPillars = pillars.map(pillar => {
            if (formData.assignedPillars.includes(pillar.title)) {
              // Add the new must-win ID to this pillar's assignedWins
              return {
                ...pillar,
                assignedWins: [...pillar.assignedWins, newId]
              }
            }
            return pillar
          })
          localStorage.setItem(PILLARS_STORAGE_KEY, JSON.stringify(updatedPillars))
          console.log('Updated pillars with new win assignment:', updatedPillars)
        } catch (e) {
          console.error('Failed to update pillars:', e)
        }
      }
    }
    
    console.log('Created Must-Win:', newMustWin)
    
    // Navigate to must-wins list
    navigate('/must-wins')
  }

  const handleCancel = () => {
    navigate('/must-wins')
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
              {strategyPillars.length === 0 ? (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center text-gray-500">
                  No strategy pillars available. Please create pillars first.
                </div>
              ) : (
              <div className="space-y-2">
                {strategyPillars.map((pillar) => (
                  <div
                    key={pillar.id}
                    onClick={() => handlePillarToggle(pillar.title)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.assignedPillars.includes(pillar.title)
                        ? 'border-primary bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Checkbox */}
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          formData.assignedPillars.includes(pillar.title)
                            ? 'bg-primary border-primary'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {formData.assignedPillars.includes(pillar.title) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">{pillar.number}</span>
                        <span className="font-medium text-gray-900">{pillar.title}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>

            {/* Win Owner */}
            <div>
              <label htmlFor="winOwner" className="block text-sm font-medium text-gray-700 mb-2">
                Win Owner
              </label>
              <input
                type="text"
                id="winOwner"
                value={formData.winOwner}
                onChange={(e) => setFormData({ ...formData, winOwner: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter win owner name"
              />
              <p className="text-xs text-gray-500 mt-1">Primary person responsible for this must-win</p>
            </div>

            {/* Assign to Owners */}
            <div>
              <label htmlFor="owners" className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Head of Departments (Press Enter to add)
              </label>
              <div className="space-y-2">
                {/* Tags Display */}
                {formData.owners.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {formData.owners.map((owner, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-full text-sm font-medium"
                      >
                        <span>{owner}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              owners: formData.owners.filter((_, i) => i !== idx)
                            })
                          }}
                          className="hover:bg-orange-600 rounded-full p-0.5 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {/* Input Field */}
                <input
                  type="text"
                  id="owners"
                  value={ownerInput}
                  onChange={(e) => setOwnerInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && ownerInput.trim()) {
                      e.preventDefault()
                      if (!formData.owners.includes(ownerInput.trim())) {
                        setFormData({
                          ...formData,
                          owners: [...formData.owners, ownerInput.trim()]
                        })
                      }
                      setOwnerInput('')
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Type name and press Enter to add"
                />
                <p className="text-xs text-gray-500">Add Head of Departments who will be responsible for this must-win</p>
              </div>
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
