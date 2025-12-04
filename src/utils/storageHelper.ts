/**
 * Storage Helper - Year-aware localStorage management
 * All data is stored with year prefix to support multi-year data isolation
 */

/**
 * Get year-specific storage key
 * @param baseKey - The base storage key
 * @param year - The year (defaults to current year)
 * @returns Year-prefixed storage key
 */
export const getYearStorageKey = (baseKey: string, year?: number): string => {
  const yearToUse = year || new Date().getFullYear()
  return `${baseKey}-${yearToUse}`
}

/**
 * Save data to year-specific localStorage
 * @param baseKey - The base storage key
 * @param data - The data to save
 * @param year - The year (optional, defaults to current year)
 */
export const saveToYearStorage = (baseKey: string, data: any, year?: number): void => {
  const key = getYearStorageKey(baseKey, year)
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving to localStorage with key ${key}:`, error)
  }
}

/**
 * Load data from year-specific localStorage
 * @param baseKey - The base storage key
 * @param year - The year (optional, defaults to current year)
 * @returns Parsed data or null if not found
 */
export const loadFromYearStorage = (baseKey: string, year?: number): any => {
  const key = getYearStorageKey(baseKey, year)
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error(`Error loading from localStorage with key ${key}:`, error)
    return null
  }
}

/**
 * Remove data from year-specific localStorage
 * @param baseKey - The base storage key
 * @param year - The year (optional, defaults to current year)
 */
export const removeFromYearStorage = (baseKey: string, year?: number): void => {
  const key = getYearStorageKey(baseKey, year)
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing from localStorage with key ${key}:`, error)
  }
}

/**
 * Get all years that have data for a specific base key
 * @param baseKey - The base storage key
 * @returns Array of years with data
 */
export const getYearsWithData = (baseKey: string): number[] => {
  const years: Set<number> = new Set()
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(`${baseKey}-`)) {
      const yearPart = key.replace(`${baseKey}-`, '')
      const year = parseInt(yearPart, 10)
      if (!isNaN(year)) {
        years.add(year)
      }
    }
  }
  
  return Array.from(years).sort((a, b) => a - b)
}

/**
 * Clear all data for a specific year across all base keys
 * @param year - The year to clear
 */
export const clearYearData = (year: number): void => {
  const keysToRemove: string[] = []
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.endsWith(`-${year}`)) {
      keysToRemove.push(key)
    }
  }
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key)
  })
}

/**
 * Migrate data from old non-year-prefixed keys to new year-prefixed keys
 * Useful for backwards compatibility
 */
export const migrateToYearPrefixedStorage = (baseKey: string, year?: number): void => {
  const targetYear = year || new Date().getFullYear()
  const oldKey = baseKey
  const newKey = getYearStorageKey(baseKey, targetYear)
  
  try {
    const oldData = localStorage.getItem(oldKey)
    if (oldData && !localStorage.getItem(newKey)) {
      localStorage.setItem(newKey, oldData)
      localStorage.removeItem(oldKey)
    }
  } catch (error) {
    console.error(`Error migrating storage from ${oldKey} to ${newKey}:`, error)
  }
}

// Storage key constants
export const STORAGE_KEYS = {
  STRATEGY_PILLARS: 'strategy-pillars-data',
  MUST_WINS: 'must-wins-data',
  KEY_ACTIVITIES: 'key-activities-data',
  SUB_TASKS: 'sub-tasks-data',
  AUTH_USER: 'auth-user'
} as const

/**
 * Initialize test data for 2026
 * Creates sample Strategy Pillars, Must-Wins, Key Activities
 */
export const initializeTestData = (): void => {
  const year = 2026
  
  // Check if test data already exists
  const existingPillars = loadFromYearStorage(STORAGE_KEYS.STRATEGY_PILLARS, year)
  if (existingPillars && existingPillars.length > 0) {
    console.log('✅ Test data already exists for 2026')
    // Fix any existing key activities with string assignedMustWin values
    fixKeyActivityDataTypes(year)
    // Fix any existing sub-tasks without assignedKeyActivityId
    fixSubTaskDataTypes(year)
    return
  }

  console.log('🚀 Initializing test data for 2026...')

  // Initialize Strategy Pillars
  const testPillars = [
    { id: 1, title: 'Pillar 1', description: 'First strategic pillar', assignedWins: [7, 8] },
    { id: 2, title: 'Pillar 2', description: 'Second strategic pillar', assignedWins: [8] }
  ]
  saveToYearStorage(STORAGE_KEYS.STRATEGY_PILLARS, testPillars, year)
  console.log('✅ Created test pillars')

  // Initialize Must-Wins
  const testMustWins = [
    { id: 7, title: 'Win 7 (test 2 win)', description: 'Second test win', progress: 0, status: 'needs-attention', winOwner: 'Owner 1', owners: ['Owner 1'], deadline: '2026-12-31', assignedPillars: ['Pillar 1', 'Pillar 2'] },
    { id: 8, title: 'Win 8 (test 3 win)', description: 'Third test win', progress: 0, status: 'needs-attention', winOwner: 'Owner 2', owners: ['Owner 2'], deadline: '2026-12-31', assignedPillars: ['Pillar 1'] }
  ]
  saveToYearStorage(STORAGE_KEYS.MUST_WINS, testMustWins, year)
  console.log('✅ Created test must-wins')

  // Initialize Key Activities
  const testKeyActivities = [
    { id: 1, title: 'Key Activity 1 for W7', description: 'Test key activity for win 7', assignedMustWin: 7, assignToHead: 'Manager 1', deadline: '2026-06-30', subtasks: 0, progress: 0, status: 'needs-attention', baselineKPIs: [], targetKPIs: [], stretchKPIs: [] },
    { id: 2, title: 'Key Activity 2 for W7', description: 'Another key activity for win 7', assignedMustWin: 7, assignToHead: 'Manager 2', deadline: '2026-06-30', subtasks: 0, progress: 0, status: 'needs-attention', baselineKPIs: [], targetKPIs: [], stretchKPIs: [] },
    { id: 3, title: 'Key Activity 1 for W8', description: 'Test key activity for win 8', assignedMustWin: 8, assignToHead: 'Manager 1', deadline: '2026-06-30', subtasks: 0, progress: 0, status: 'needs-attention', baselineKPIs: [], targetKPIs: [], stretchKPIs: [] }
  ]
  saveToYearStorage(STORAGE_KEYS.KEY_ACTIVITIES, testKeyActivities, year)
  console.log('✅ Created test key activities')

  console.log('✅ Test data initialization complete!')
}

/**
 * Fix key activities that have string assignedMustWin values
 * Convert them to numbers for proper filtering
 */
export const fixKeyActivityDataTypes = (year: number): void => {
  const activities = loadFromYearStorage(STORAGE_KEYS.KEY_ACTIVITIES, year)
  if (!activities || !Array.isArray(activities)) {
    return
  }

  let hasChanges = false
  const fixedActivities = activities.map((activity: any) => {
    if (activity.assignedMustWin && typeof activity.assignedMustWin === 'string') {
      console.log(`🔄 Converting assignedMustWin for activity "${activity.title}": "${activity.assignedMustWin}" → ${Number(activity.assignedMustWin)}`)
      hasChanges = true
      return {
        ...activity,
        assignedMustWin: Number(activity.assignedMustWin)
      }
    }
    return activity
  })

  if (hasChanges) {
    saveToYearStorage(STORAGE_KEYS.KEY_ACTIVITIES, fixedActivities, year)
    console.log('✅ Fixed key activity data types')
  }
}

/**
 * Fix sub-tasks that don't have assignedKeyActivityId
 * Clear old sub-tasks that can't be matched to activities
 */
export const fixSubTaskDataTypes = (year: number): void => {
  const subTasks = loadFromYearStorage(STORAGE_KEYS.SUB_TASKS, year)
  const keyActivities = loadFromYearStorage(STORAGE_KEYS.KEY_ACTIVITIES, year)

  if (!subTasks || !Array.isArray(subTasks) || !keyActivities || !Array.isArray(keyActivities)) {
    return
  }

  let hasChanges = false
  const fixedSubTasks = subTasks.map((subTask: any) => {
    // If assignedKeyActivityId is missing, try to find it based on keyActivity title or ID
    if (!subTask.assignedKeyActivityId) {
      const matchingActivity = keyActivities.find((ka: any) => 
        ka.title === subTask.keyActivity || ka.id === subTask.keyActivity || Number(ka.id) === Number(subTask.keyActivity)
      )
      if (matchingActivity) {
        console.log(`🔄 Matching task "${subTask.title}" to key activity ID ${matchingActivity.id}`)
        hasChanges = true
        return {
          ...subTask,
          assignedKeyActivityId: matchingActivity.id
        }
      } else {
        // If no match found and assignedKeyActivityId is still missing, mark it as invalid
        // but keep it in case it needs manual assignment
        console.log(`⚠️ Could not match task "${subTask.title}" - setting to activity 1`)
        // Default to first activity if exists
        if (keyActivities.length > 0) {
          hasChanges = true
          return {
            ...subTask,
            assignedKeyActivityId: keyActivities[0].id
          }
        }
      }
    }
    return subTask
  })

  if (hasChanges) {
    saveToYearStorage(STORAGE_KEYS.SUB_TASKS, fixedSubTasks, year)
    console.log('✅ Fixed sub-task data types - added/updated assignedKeyActivityId')
  }
}
