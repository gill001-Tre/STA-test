import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useYear } from '@/contexts/YearContext'
import { loadFromYearStorage, saveToYearStorage, STORAGE_KEYS } from '@/utils/storageHelper'

interface KPI {
  name: string
  range: string
}

const CreateKeyActivity = () => {
  const navigate = useNavigate()
  const { selectedYear } = useYear()
  const [searchParams] = useSearchParams()
  const winId = searchParams.get('winId') || '1'
  
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    title: '',
    assignedMustWin: winId ? Number(winId) : '',
    assignToHead: '',
    description: '',
    deadline: '',
  })

  const [baselineKPIs, setBaselineKPIs] = useState<KPI[]>([{ name: '', range: '' }, { name: '', range: '' }])
  const [targetKPIs, setTargetKPIs] = useState<KPI[]>([{ name: '', range: '' }, { name: '', range: '' }])
  const [stretchKPIs, setStretchKPIs] = useState<KPI[]>([{ name: '', range: '' }, { name: '', range: '' }])
  const [mustWins, setMustWins] = useState<any[]>([])

  // Load must-wins from year-aware storage
  useEffect(() => {
    const stored = loadFromYearStorage(STORAGE_KEYS.MUST_WINS, selectedYear)
    if (stored) {
      try {
        const wins = Array.isArray(stored) ? stored : []
        setMustWins(wins)
        console.log('Loaded must-wins for year', selectedYear, ':', wins)
      } catch (e) {
        console.error('Failed to parse must-wins:', e)
        setMustWins([])
      }
    } else {
      setMustWins([])
    }
  }, [selectedYear])

  // Update assignedMustWin when winId changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, assignedMustWin: winId ? Number(winId) : '' }))
  }, [winId])

  const addKPI = (type: 'baseline' | 'target' | 'stretch') => {
    if (type === 'baseline') {
      setBaselineKPIs([...baselineKPIs, { name: '', range: '' }])
    } else if (type === 'target') {
      setTargetKPIs([...targetKPIs, { name: '', range: '' }])
    } else {
      setStretchKPIs([...stretchKPIs, { name: '', range: '' }])
    }
  }

  const removeKPI = (type: 'baseline' | 'target' | 'stretch', index: number) => {
    if (type === 'baseline') {
      setBaselineKPIs(baselineKPIs.filter((_, i) => i !== index))
    } else if (type === 'target') {
      setTargetKPIs(targetKPIs.filter((_, i) => i !== index))
    } else {
      setStretchKPIs(stretchKPIs.filter((_, i) => i !== index))
    }
  }

  const updateKPI = (type: 'baseline' | 'target' | 'stretch', index: number, field: 'name' | 'range', value: string) => {
    if (type === 'baseline') {
      const updated = [...baselineKPIs]
      updated[index][field] = value
      setBaselineKPIs(updated)
    } else if (type === 'target') {
      const updated = [...targetKPIs]
      updated[index][field] = value
      setTargetKPIs(updated)
    } else {
      const updated = [...stretchKPIs]
      updated[index][field] = value
      setStretchKPIs(updated)
    }
  }

  const years = [2026, 2027, 2028]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Load existing activities from year-aware storage
    const stored = loadFromYearStorage(STORAGE_KEYS.KEY_ACTIVITIES, selectedYear)
    let existingActivities = []
    if (stored) {
      try {
        existingActivities = stored
      } catch (e) {
        console.error('Failed to parse stored activities:', e)
      }
    }
    
    // Generate new activity ID
    const newId = existingActivities.length > 0 
      ? Math.max(...existingActivities.map((a: any) => a.id)) + 1 
      : 1
    
    const activityData = {
      id: newId,
      ...formData,
      progress: 0,
      status: 'needs-attention',
      baselineKPIs: baselineKPIs.filter(kpi => kpi.name || kpi.range),
      targetKPIs: targetKPIs.filter(kpi => kpi.name || kpi.range),
      stretchKPIs: stretchKPIs.filter(kpi => kpi.name || kpi.range),
    }
    
    // Add new activity to array and save
    const updatedActivities = [...existingActivities, activityData]
    saveToYearStorage(STORAGE_KEYS.KEY_ACTIVITIES, updatedActivities, selectedYear)
    
    console.log('Created key activity:', activityData)
    // TODO: Save to Azure Table Storage
    navigate(`/key-activities?winId=${winId}`)
  }

  const handleCancel = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Key Activity</h1>
          <p className="text-gray-600">Create and assign key activity to head of department</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Key Activity</h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Year
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Key Activity Title */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Key Activity Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter key activity title"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  required
                />
              </div>

              {/* Assign Must-Win */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Assign Must-Win
                </label>
                <select
                  value={formData.assignedMustWin}
                  onChange={(e) => setFormData({ ...formData, assignedMustWin: e.target.value ? Number(e.target.value) : '' })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  required
                >
                  <option value="">Select must win</option>
                  {mustWins.map((win) => (
                    <option key={win.id} value={win.id}>
                      {win.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assign to Head of Department */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Assign to Head of Department
                </label>
                <input
                  type="text"
                  value={formData.assignToHead}
                  onChange={(e) => setFormData({ ...formData, assignToHead: e.target.value })}
                  placeholder="Select Head of Department"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the pillar"
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                />
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  placeholder="Enter date"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  required
                />
              </div>

              {/* KPI Section Header */}
              <div className="pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h3>
              </div>

              {/* Baseline */}
              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Baseline</h3>
                  <button
                    type="button"
                    onClick={() => addKPI('baseline')}
                    className="text-sm text-primary hover:text-orange-600 font-medium flex items-center gap-1"
                  >
                    <span>+</span> Add KPI
                  </button>
                </div>
                <div className="space-y-4">
                  {baselineKPIs.map((kpi, index) => (
                    <div key={index} className="grid grid-cols-2 gap-3 relative">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                          KPI {index + 1} Name {index > 0 && '(Optional)'}
                        </label>
                        <input
                          type="text"
                          value={kpi.name}
                          onChange={(e) => updateKPI('baseline', index, 'name', e.target.value)}
                          placeholder="e.g., 3IT In Development Progress"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            KPI {index + 1} Range {index > 0 && '(Optional)'}
                          </label>
                          <input
                            type="text"
                            value={kpi.range}
                            onChange={(e) => updateKPI('baseline', index, 'range', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                          />
                        </div>
                        {baselineKPIs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeKPI('baseline', index)}
                            className="mt-6 px-2 text-red-500 hover:text-red-700 font-bold"
                            title="Remove KPI"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target */}
              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Target</h3>
                  <button
                    type="button"
                    onClick={() => addKPI('target')}
                    className="text-sm text-primary hover:text-orange-600 font-medium flex items-center gap-1"
                  >
                    <span>+</span> Add KPI
                  </button>
                </div>
                <div className="space-y-4">
                  {targetKPIs.map((kpi, index) => (
                    <div key={index} className="grid grid-cols-2 gap-3 relative">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                          KPI {index + 1} Name {index > 0 && '(Optional)'}
                        </label>
                        <input
                          type="text"
                          value={kpi.name}
                          onChange={(e) => updateKPI('target', index, 'name', e.target.value)}
                          placeholder="e.g., 3IT In Development Progress"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            KPI {index + 1} Range {index > 0 && '(Optional)'}
                          </label>
                          <input
                            type="text"
                            value={kpi.range}
                            onChange={(e) => updateKPI('target', index, 'range', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                          />
                        </div>
                        {targetKPIs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeKPI('target', index)}
                            className="mt-6 px-2 text-red-500 hover:text-red-700 font-bold"
                            title="Remove KPI"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stretch */}
              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Stretch</h3>
                  <button
                    type="button"
                    onClick={() => addKPI('stretch')}
                    className="text-sm text-primary hover:text-orange-600 font-medium flex items-center gap-1"
                  >
                    <span>+</span> Add KPI
                  </button>
                </div>
                <div className="space-y-4">
                  {stretchKPIs.map((kpi, index) => (
                    <div key={index} className="grid grid-cols-2 gap-3 relative">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                          KPI {index + 1} Name {index > 0 && '(Optional)'}
                        </label>
                        <input
                          type="text"
                          value={kpi.name}
                          onChange={(e) => updateKPI('stretch', index, 'name', e.target.value)}
                          placeholder="e.g., 3IT In Development Progress"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            KPI {index + 1} Range {index > 0 && '(Optional)'}
                          </label>
                          <input
                            type="text"
                            value={kpi.range}
                            onChange={(e) => updateKPI('stretch', index, 'range', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                          />
                        </div>
                        {stretchKPIs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeKPI('stretch', index)}
                            className="mt-6 px-2 text-red-500 hover:text-red-700 font-bold"
                            title="Remove KPI"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Create Key Activity
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateKeyActivity
