import { useParams, useNavigate } from 'react-router-dom'

const KeyActivityDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Mock data - TODO: Fetch from Azure Table Storage
  const activity = {
    id: Number(id),
    number: '01',
    title: 'IT Stack Modernization',
    description: 'Implement Amdocs effectively within 3 Scandinavia by strategically align business and technology goals, followed by the setup of governance frameworks, such as joint steering committees and design authority forums, to oversee execution and manage risks. The focus is on leveraging the opportunity to eliminate silos, reduce technical debt, and increase collaboration, aiming to bring operational efficiency to the entire organization.All of Technology will be heavily engaged in Apollo for the entire 2026, in project governance, discovery, design, development, quality assurance, migration planning and more. Approx. 150 existing assets will need to be reworked to fit the target architecture, and a new e-commerce solution for both Denmark and Sweden, based on Amdocs Commerce, will be built.',
    owner: 'Fredrik Eder',
    ownerAvatar: 'FE',
    deadline: '2026-02-13',
    strategyPillar: '1',
    mustWin: 'Must-Win 1',
    kpis: {
      baseline: [
        { name: '3IT PI Development Progress (full scope)', range: '75-100%' },
        { name: 'E2E Testing Progress (full scope)', range: '66-100%' }
      ],
      target: [
        { name: '3IT PI Development Progress (full scope)', range: '75-100%' },
        { name: 'E2E Testing Progress (full scope)', range: '66-100%' }
      ],
      stretch: [
        { name: '3IT PI Development Progress (full scope)', range: '75-100%' },
        { name: 'E2E Testing Progress (full scope)', range: '66-100%' }
      ]
    },
    subTasks: [
      { id: 1, title: 'Setup governance framework', completed: true },
      { id: 2, title: 'Design authority forums', completed: true },
      { id: 3, title: 'Technical debt assessment', completed: true },
      { id: 4, title: 'Migration planning phase 1', completed: false },
      { id: 5, title: 'E-commerce solution design', completed: false },
      { id: 6, title: 'Quality assurance setup', completed: false },
      { id: 7, title: 'Asset rework planning', completed: false }
    ]
  }

  const completedSubTasks = activity.subTasks.filter(task => task.completed).length
  const totalSubTasks = activity.subTasks.length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/key-activities')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Key Activities
        </button>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 bg-primary text-white rounded-2xl flex items-center justify-center font-bold text-3xl flex-shrink-0">
                  {activity.number}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Title</p>
                  <h1 className="text-3xl font-bold text-gray-900">{activity.title}</h1>
                </div>
              </div>
              
              <div className="flex items-center pt-6 divide-x divide-gray-200">
                {/* Owner */}
                <div className="flex-1 pr-6">
                  <p className="text-sm text-gray-700 mb-2">Owner:</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center text-xs font-semibold">
                      {activity.ownerAvatar}
                    </div>
                    <span className="font-medium text-gray-900">{activity.owner}</span>
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex-1 px-6">
                  <p className="text-sm text-gray-700 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Deadline:
                  </p>
                  <span className="font-medium text-gray-900 ml-7">{activity.deadline}</span>
                </div>

                {/* Tags */}
                <div className="flex-1 pl-6 flex items-center justify-end gap-3">
                  <span className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium whitespace-nowrap">
                    Strategy Pillar {activity.strategyPillar}
                  </span>
                  <span className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium whitespace-nowrap">
                    {activity.mustWin}
                  </span>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{activity.description}</p>
            </div>

            {/* Sub-tasks Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Sub-tasks</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {completedSubTasks} of {totalSubTasks} completed
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-2xl ${i < Math.min(completedSubTasks, 5) ? 'text-orange-400' : 'text-gray-300'}`}
                    >
                      ●
                    </span>
                  ))}
                  {totalSubTasks > 5 && (
                    <span className="text-sm font-semibold text-gray-900 ml-1">
                      +{totalSubTasks - 5}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {activity.subTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                      task.completed ? 'bg-primary' : 'bg-gray-200'
                    }`}>
                      {task.completed && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`flex-1 ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - KPIs */}
          <div className="space-y-4">
            {/* Baseline KPIs */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Baseline</h3>
              <div className="space-y-3">
                {activity.kpis.baseline.map((kpi, index) => (
                  <div key={index} className="bg-white rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">{kpi.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">KPI</span>
                      <span className="text-sm font-semibold text-gray-900">{kpi.range}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Target KPIs */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Target</h3>
              <div className="space-y-3">
                {activity.kpis.target.map((kpi, index) => (
                  <div key={index} className="bg-white rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">{kpi.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">KPI</span>
                      <span className="text-sm font-semibold text-gray-900">{kpi.range}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stretch KPIs */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Stretch</h3>
              <div className="space-y-3">
                {activity.kpis.stretch.map((kpi, index) => (
                  <div key={index} className="bg-white rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">{kpi.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">KPI</span>
                      <span className="text-sm font-semibold text-gray-900">{kpi.range}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KeyActivityDetail
