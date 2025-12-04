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
