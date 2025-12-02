import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

interface KPI {
  name: string
  range: string
}

const UpdateKeyActivity = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const activityId = searchParams.get('id')
  const winId = searchParams.get('winId') || '1' // Default to Win 1 if not provided

  const [formData, setFormData] = useState({
    year: 2026,
    title: '',
    assignedMustWin: '',
    assignToHead: '',
    description: '',
    deadline: '',
  })

  const [baselineKPIs, setBaselineKPIs] = useState<KPI[]>([{ name: '', range: '' }, { name: '', range: '' }])
  const [targetKPIs, setTargetKPIs] = useState<KPI[]>([{ name: '', range: '' }, { name: '', range: '' }])
  const [stretchKPIs, setStretchKPIs] = useState<KPI[]>([{ name: '', range: '' }, { name: '', range: '' }])

  const years = [2026, 2027, 2028]

  // Load must-wins from localStorage
  const [allMustWins, setAllMustWins] = useState<any[]>([])

  useEffect(() => {
    // Load must-wins
    const storedWins = localStorage.getItem('must-wins-data')
    if (storedWins) {
      try {
        setAllMustWins(JSON.parse(storedWins))
      } catch (e) {
        console.error('Failed to parse must-wins:', e)
      }
    }
  }, [])

  // Load existing activity data from localStorage
  useEffect(() => {
    if (activityId) {
      const stored = localStorage.getItem('key-activities-data')
      if (stored) {
        try {
          const activities = JSON.parse(stored)
          const activity = activities.find((a: any) => a.id === Number(activityId))
          
          if (activity) {
            setFormData({
              year: 2026,
              title: activity.title || '',
              assignedMustWin: activity.assignedMustWin || '',
              assignToHead: activity.assignToHead || '',
              description: activity.description || '',
              deadline: activity.deadline || '',
            })
            
            setBaselineKPIs(activity.baselineKPIs && activity.baselineKPIs.length > 0 
              ? activity.baselineKPIs 
              : [{ name: '', range: '' }, { name: '', range: '' }])
            
            setTargetKPIs(activity.targetKPIs && activity.targetKPIs.length > 0 
              ? activity.targetKPIs 
              : [{ name: '', range: '' }, { name: '', range: '' }])
            
            setStretchKPIs(activity.stretchKPIs && activity.stretchKPIs.length > 0 
              ? activity.stretchKPIs 
              : [{ name: '', range: '' }, { name: '', range: '' }])
          }
        } catch (e) {
          console.error('Failed to parse stored activities:', e)
        }
      }
    }
  }, [activityId])

  const mustWins = allMustWins.map((win: any) => ({
    id: win.id,
    title: win.title
  }))

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Load existing activities from localStorage
    const stored = localStorage.getItem('key-activities-data')
    if (stored && activityId) {
      try {
        const activities = JSON.parse(stored)
        const activityIndex = activities.findIndex((a: any) => a.id === Number(activityId))
        
        if (activityIndex !== -1) {
          // Update the activity
          activities[activityIndex] = {
            ...activities[activityIndex],
            title: formData.title,
            description: formData.description,
            assignedMustWin: formData.assignedMustWin,
            assignToHead: formData.assignToHead,
            deadline: formData.deadline,
            baselineKPIs: baselineKPIs.filter(kpi => kpi.name || kpi.range),
            targetKPIs: targetKPIs.filter(kpi => kpi.name || kpi.range),
            stretchKPIs: stretchKPIs.filter(kpi => kpi.name || kpi.range),
          }
          
          // Save back to localStorage
          localStorage.setItem('key-activities-data', JSON.stringify(activities))
          console.log('Updated key activity:', activities[activityIndex])
          navigate(`/key-activities?winId=${winId}`)
        }
      } catch (e) {
        console.error('Failed to update activity:', e)
      }
    }
  }

  const handleCancel = () => {
    navigate(`/key-activities?winId=${winId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Key Activity</h1>
          <p className="text-gray-600">Edit key activity details and update KPI information</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Key Activity</h2>
          <p className="text-sm text-gray-600 mb-8">Update the key activity information and save changes</p>

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
                  onChange={(e) => setFormData({ ...formData, assignedMustWin: e.target.value })}
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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateKeyActivity
