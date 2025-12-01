import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const STORAGE_KEY = 'strategy-pillars-assignments'

const initialPillars = [
  {
    id: 1,
    number: '01',
    title: 'Cost Leadership via Technology Efficiency:',
    description: 'Focus on reducing costs through technology efficiency and consolidation',
    objectives: [
      'Consolidate platforms and reduce duplication across Denmark and Sweden.',
      'Leverage economies of scale to reduce cost per subscriber.',
      'Implement proactive monitoring and automation to improve cost efficiency.',
      'Mandate lean setup and cost-focused investments across the business.',
      'Modernize legacy systems and adopt standard solutions to minimize waste.',
      'Implement a unified house IT approach (e.g., one web service platform) to cut costs and complexity.'
    ],
    assignedWins: []
  },
  {
    id: 2,
    number: '02',
    title: 'Business Differentiation through Digital Innovation:',
    description: 'Deliver unique customer value through IT-enabled products and experiences',
    objectives: [
      'Deliver unique customer value through IT-enabled products and experiences.',
      'Rapidly deploy new capabilities like:',
      'AI-driven personalization',
      'Seamless omnichannel experience',
      'Exposure and local breakout',
      'Enable hyper-personalized journeys (e.g., tailored offers, loyalty perks).',
      'Support rollout of innovative services that set brands apart.'
    ],
    assignedWins: []
  },
  {
    id: 3,
    number: '03',
    title: 'Operational Excellence & Agility:',
    description: 'Deliver reliable, secure, and agile operations to boost execution quality',
    objectives: [
      'Deliver reliable, secure, and agile operations to boost execution quality.',
      'Ensure high system uptime, strong security, and efficient feature delivery.',
      'Support superior customer experience and internal productivity.',
      'Drive continuous improvement with a "never settle" mindset.',
      'Enhance value-adding activities (e.g., less manual work) for internal initiatives.',
      'Enable IT to "do more with less" year over year.',
      'Adapt quickly to market changes (e.g., fast rollout of new digital products or service integrations).'
    ],
    assignedWins: []
  }
]

const EditStrategyPillar = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    year: 2026,
    title: '',
    description: ''
  })

  useEffect(() => {
    console.log('Loading pillar with id:', id)
    // Load existing pillar data
    const stored = localStorage.getItem(STORAGE_KEY)
    let pillars = initialPillars
    
    if (stored) {
      try {
        pillars = JSON.parse(stored)
        console.log('Loaded pillars from storage:', pillars)
      } catch (e) {
        console.error('Failed to parse stored pillars:', e)
      }
    }

    const pillar = pillars.find(p => p.id === Number(id))
    console.log('Found pillar:', pillar)
    if (pillar) {
      // Combine description and objectives with bullet points
      const objectivesText = pillar.objectives.map(obj => `• ${obj}`).join('\n')
      const fullDescription = pillar.description + '\n\n' + objectivesText
      setFormData({
        year: 2026,
        title: pillar.title,
        description: fullDescription
      })
    }
    setLoading(false)
  }, [id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Update pillar in localStorage
    const stored = localStorage.getItem(STORAGE_KEY)
    let pillars = initialPillars
    
    if (stored) {
      try {
        pillars = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse stored pillars:', e)
      }
    }

    const updatedPillars = pillars.map(pillar =>
      pillar.id === Number(id)
        ? { ...pillar, title: formData.title, description: formData.description }
        : pillar
    )

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPillars))
    console.log('Updating Strategy Pillar:', id, formData)
    navigate('/strategy-pillars')
  }

  const handleCancel = () => {
    navigate('/strategy-pillars')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Strategic Technology Pillars</h1>
              <p className="text-gray-600">Update your strategic pillar details</p>
            </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Strategic Pillar</h2>
          <p className="text-sm text-gray-600 mb-6">Update the pillar information</p>

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

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter pillar title"
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
                rows={15}
                maxLength={2000}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Describe the pillar and its objectives"
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {formData.description.length}/2000
              </div>
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
                Save Changes
              </button>
            </div>
          </form>
        </div>
          </>
        )}
      </div>
    </div>
  )
}

export default EditStrategyPillar
