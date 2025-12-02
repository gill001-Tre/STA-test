import { useState, useEffect } from 'react'

const StorageDebug = () => {
  const [storageData, setStorageData] = useState<Record<string, any>>({})

  const keys = [
    'must-wins-data',
    'key-activities-data',
    'sub-tasks-data',
    'strategy-pillars-assignments'
  ]

  useEffect(() => {
    const loadData = () => {
      const data: Record<string, any> = {}
      keys.forEach(key => {
        const stored = localStorage.getItem(key)
        if (stored) {
          try {
            data[key] = JSON.parse(stored)
          } catch (e) {
            data[key] = { error: 'Failed to parse JSON', raw: stored }
          }
        } else {
          data[key] = null
        }
      })
      setStorageData(data)
    }

    loadData()
    const interval = setInterval(loadData, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">📊 LocalStorage Debug Inspector</h1>

        <div className="grid gap-6">
          {keys.map(key => {
            const data = storageData[key]
            const hasData = data !== null && !data.error
            const count = Array.isArray(data) ? data.length : data ? 1 : 0

            return (
              <div key={key} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Key: <code className="bg-gray-100 px-2 py-1 rounded">{key}</code>
                    </p>
                  </div>
                  <div className="text-right">
                    {hasData ? (
                      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold">
                        ✓ {count} item{count !== 1 ? 's' : ''}
                      </div>
                    ) : data?.error ? (
                      <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-bold">
                        ⚠️ Parse Error
                      </div>
                    ) : (
                      <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold">
                        ✗ Not Found
                      </div>
                    )}
                  </div>
                </div>

                {hasData ? (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-3 font-semibold">Data Preview:</p>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto max-h-64 text-xs font-mono">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </div>
                ) : data?.error ? (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded p-4">
                    <p className="text-red-800">
                      <strong>Error:</strong> {data.error}
                    </p>
                    {data.raw && (
                      <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto">
                        {data.raw}
                      </pre>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-4">
                    <p className="text-yellow-800">
                      No data found. Create items in the app to populate this section.
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-3">💡 How to Check Data</h3>
          <ol className="list-decimal list-inside text-blue-800 space-y-2">
            <li>This page auto-refreshes every 2 seconds</li>
            <li>Create/edit items in your app to see them appear here</li>
            <li>If data doesn't appear, check your browser's DevTools Console (F12)</li>
            <li>Alternatively, open DevTools → Application tab → LocalStorage</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default StorageDebug
