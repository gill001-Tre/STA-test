import { useState, useEffect } from 'react'

const DataCheck = () => {
  const [data, setData] = useState<any>({})

  useEffect(() => {
    const pillars = localStorage.getItem('strategy-pillars-assignments')
    const mustWins = localStorage.getItem('must-wins-data')
    const keyActivities = localStorage.getItem('key-activities-data')
    const subTasks = localStorage.getItem('sub-tasks-data')

    setData({
      pillars: pillars ? JSON.parse(pillars) : null,
      mustWins: mustWins ? JSON.parse(mustWins) : null,
      keyActivities: keyActivities ? JSON.parse(keyActivities) : null,
      subTasks: subTasks ? JSON.parse(subTasks) : null
    })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">LocalStorage Data Check</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold text-lg mb-2">Pillars ({data.pillars?.length || 0})</h2>
          <pre className="text-xs overflow-auto">{JSON.stringify(data.pillars, null, 2)}</pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold text-lg mb-2">Must-Wins ({data.mustWins?.length || 0})</h2>
          <pre className="text-xs overflow-auto">{JSON.stringify(data.mustWins, null, 2)}</pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold text-lg mb-2">Key Activities ({data.keyActivities?.length || 0})</h2>
          <pre className="text-xs overflow-auto">{JSON.stringify(data.keyActivities, null, 2)}</pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold text-lg mb-2">Sub-Tasks ({data.subTasks?.length || 0})</h2>
          <pre className="text-xs overflow-auto">{JSON.stringify(data.subTasks, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}

export default DataCheck
