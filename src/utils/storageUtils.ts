/**
 * Storage Utility Functions
 * Handles localStorage operations with year-aware keys
 */

const OLD_STORAGE_KEYS = [
  'strategy-pillars-assignments',
  'must-wins-data',
  'key-activities-data',
  'sub-tasks-data'
]

/**
 * Get year-specific storage key
 */
export const getYearStorageKey = (baseKey: string, year: number): string => {
  return `${baseKey}-${year}`
}

/**
 * Migrate old non-year-keyed data to year-keyed storage
 * This runs once per session to ensure all old data is properly migrated
 */
export const migrateStorageKeys = (): void => {
  // Check if migration has already been done this session
  const migrationDone = sessionStorage.getItem('storage-migration-done')
  if (migrationDone) {
    return
  }

  console.log('🔄 Starting storage migration...')

  // For each old storage key, migrate to year-specific keys
  OLD_STORAGE_KEYS.forEach((oldKey) => {
    const oldData = localStorage.getItem(oldKey)
    
    if (oldData) {
      try {
        // Assume data was created for 2026 if not specified
        // This is a safe default since 2026 is the default year
        const migratedYear = 2026
        const newKey = getYearStorageKey(oldKey, migratedYear)
        
        // Check if new key already has data
        const existingNewData = localStorage.getItem(newKey)
        
        if (!existingNewData) {
          // Move data to new key
          localStorage.setItem(newKey, oldData)
          console.log(`✅ Migrated ${oldKey} → ${newKey}`)
        } else {
          // Merge data if both exist (keep new data as source of truth)
          console.log(`⚠️ ${newKey} already exists, keeping existing data`)
        }
        
        // Remove old key (IMPORTANT: Clean up old storage to prevent conflicts)
        localStorage.removeItem(oldKey)
        console.log(`🗑️ Removed old key: ${oldKey}`)
      } catch (e) {
        console.error(`❌ Failed to migrate ${oldKey}:`, e)
        // Still remove the old key even if parsing failed
        localStorage.removeItem(oldKey)
      }
    }
  })

  // Mark migration as done for this session
  sessionStorage.setItem('storage-migration-done', 'true')
  console.log('✅ Storage migration complete')
}

/**
 * Clear all data from localStorage (useful for testing)
 */
export const clearAllStorageData = (): void => {
  const keysToClear = [
    'strategy-pillars-assignments-2026',
    'strategy-pillars-assignments-2027',
    'strategy-pillars-assignments-2028',
    'must-wins-data-2026',
    'must-wins-data-2027',
    'must-wins-data-2028',
    'key-activities-data-2026',
    'key-activities-data-2027',
    'key-activities-data-2028',
    'sub-tasks-data-2026',
    'sub-tasks-data-2027',
    'sub-tasks-data-2028',
    // Old keys (just in case)
    'strategy-pillars-assignments',
    'must-wins-data',
    'key-activities-data',
    'sub-tasks-data'
  ]

  keysToClear.forEach((key) => {
    localStorage.removeItem(key)
  })

  console.log('🗑️ Cleared all storage data')
}

/**
 * Get all data for a specific year
 */
export const getAllDataForYear = (year: number): Record<string, any> => {
  return {
    pillars: localStorage.getItem(getYearStorageKey('strategy-pillars-assignments', year)),
    mustWins: localStorage.getItem(getYearStorageKey('must-wins-data', year)),
    keyActivities: localStorage.getItem(getYearStorageKey('key-activities-data', year)),
    subTasks: localStorage.getItem(getYearStorageKey('sub-tasks-data', year))
  }
}

/**
 * Get data statistics
 */
export const getStorageStats = (): Record<string, any> => {
  const stats: Record<string, any> = {
    total: 0,
    byYear: {} as Record<number, Record<string, number>>,
    old: {} as Record<string, boolean>
  }

  // Check for old keys
  OLD_STORAGE_KEYS.forEach((key) => {
    const hasOld = localStorage.getItem(key) !== null
    stats.old[key] = hasOld
  })

  // Check new keys by year
  const years: number[] = [2026, 2027, 2028]
  years.forEach((year) => {
    stats.byYear[year] = {}
    OLD_STORAGE_KEYS.forEach((key) => {
      const newKey = getYearStorageKey(key, year)
      const data = localStorage.getItem(newKey)
      if (data) {
        try {
          const parsed = JSON.parse(data)
          const count = Array.isArray(parsed) ? parsed.length : 1
          stats.byYear[year][key] = count
          stats.total += count
        } catch (e) {
          // Skip
        }
      }
    })
  })

  return stats
}
