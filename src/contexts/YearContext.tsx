import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { initializeTestData, fixSubTaskDataTypes, fixKeyActivityDataTypes } from '@/utils/storageHelper'

interface YearContextType {
  selectedYear: number
  setSelectedYear: (year: number) => void
  availableYears: number[]
}

const YearContext = createContext<YearContextType | undefined>(undefined)

export const YearProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedYear, setSelectedYear] = useState(2026)
  const availableYears = [2026, 2027, 2028]

  // Initialize test data on app startup
  useEffect(() => {
    initializeTestData()
  }, [])

  // Fix data types when year changes
  useEffect(() => {
    fixKeyActivityDataTypes(selectedYear)
    fixSubTaskDataTypes(selectedYear)
  }, [selectedYear])

  return (
    <YearContext.Provider value={{ selectedYear, setSelectedYear, availableYears }}>
      {children}
    </YearContext.Provider>
  )
}

export const useYear = () => {
  const context = useContext(YearContext)
  if (!context) {
    throw new Error('useYear must be used within YearProvider')
  }
  return context
}
