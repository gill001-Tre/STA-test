import { MustWin, KeyActivity, SubTask, StrategyPillar, User } from '../types'

// Mock storage for local development
// Later: Replace with real Azure Tables calls

interface StorageData {
  mustWins: Record<string, MustWin[]>
  keyActivities: Record<string, KeyActivity[]>
  subTasks: Record<string, SubTask[]>
  strategyPillars: Record<string, StrategyPillar[]>
  users: User[]
}

const STORAGE_KEY = 'strategy-tracker-data'

// Initialize with empty structure
const getInitialData = (): StorageData => ({
  mustWins: { '2026': [], '2027': [], '2028': [] },
  keyActivities: { '2026': [], '2027': [], '2028': [] },
  subTasks: { '2026': [], '2027': [], '2028': [] },
  strategyPillars: { '2026': [], '2027': [], '2028': [] },
  users: [
    {
      id: '1',
      email: 'admin@tre.se',
      name: 'CTIO',
      role: 'admin',
      department: 'Management',
    },
    {
      id: '2',
      email: 'hod@tre.se',
      name: 'HeadOf',
      role: 'head_of_department',
      department: 'IT',
    },
    {
      id: '3',
      email: 'chef@tre.se',
      name: 'TeamChef',
      role: 'team_chef',
      department: 'IT',
    },
    {
      id: '4',
      email: 'employee@tre.se',
      name: 'Employee',
      role: 'viewer',
      department: 'IT',
    },
  ],
})

class AzureStorageService {
  private getStorage(): StorageData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : getInitialData()
    } catch {
      return getInitialData()
    }
  }

  private saveStorage(data: StorageData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  // Must-Wins
  async getMustWins(year: string): Promise<MustWin[]> {
    const data = this.getStorage()
    return data.mustWins[year] || []
  }

  async saveMustWin(year: string, mustWin: MustWin): Promise<void> {
    const data = this.getStorage()
    if (!data.mustWins[year]) {
      data.mustWins[year] = []
    }
    const existing = data.mustWins[year].findIndex((m) => m.rowKey === mustWin.rowKey)
    if (existing >= 0) {
      data.mustWins[year][existing] = mustWin
    } else {
      data.mustWins[year].push(mustWin)
    }
    this.saveStorage(data)
  }

  async updateMustWin(year: string, id: string, updates: Partial<MustWin>): Promise<void> {
    const data = this.getStorage()
    const index = data.mustWins[year]?.findIndex((m) => m.rowKey === id)
    if (index !== undefined && index >= 0) {
      data.mustWins[year][index] = { ...data.mustWins[year][index], ...updates }
      this.saveStorage(data)
    }
  }

  async deleteMustWin(year: string, id: string): Promise<void> {
    const data = this.getStorage()
    data.mustWins[year] = data.mustWins[year]?.filter((m) => m.rowKey !== id) || []
    this.saveStorage(data)
  }

  // Key Activities
  async getKeyActivities(year: string): Promise<KeyActivity[]> {
    const data = this.getStorage()
    return data.keyActivities[year] || []
  }

  async saveKeyActivity(year: string, activity: KeyActivity): Promise<void> {
    const data = this.getStorage()
    if (!data.keyActivities[year]) {
      data.keyActivities[year] = []
    }
    const existing = data.keyActivities[year].findIndex((a) => a.rowKey === activity.rowKey)
    if (existing >= 0) {
      data.keyActivities[year][existing] = activity
    } else {
      data.keyActivities[year].push(activity)
    }
    this.saveStorage(data)
  }

  async updateKeyActivity(year: string, id: string, updates: Partial<KeyActivity>): Promise<void> {
    const data = this.getStorage()
    const index = data.keyActivities[year]?.findIndex((a) => a.rowKey === id)
    if (index !== undefined && index >= 0) {
      data.keyActivities[year][index] = { ...data.keyActivities[year][index], ...updates }
      this.saveStorage(data)
    }
  }

  async deleteKeyActivity(year: string, id: string): Promise<void> {
    const data = this.getStorage()
    data.keyActivities[year] = data.keyActivities[year]?.filter((a) => a.rowKey !== id) || []
    this.saveStorage(data)
  }

  // Sub-Tasks
  async getSubTasks(year: string): Promise<SubTask[]> {
    const data = this.getStorage()
    return data.subTasks[year] || []
  }

  async saveSubTask(year: string, task: SubTask): Promise<void> {
    const data = this.getStorage()
    if (!data.subTasks[year]) {
      data.subTasks[year] = []
    }
    const existing = data.subTasks[year].findIndex((t) => t.rowKey === task.rowKey)
    if (existing >= 0) {
      data.subTasks[year][existing] = task
    } else {
      data.subTasks[year].push(task)
    }
    this.saveStorage(data)
  }

  async updateSubTask(year: string, id: string, updates: Partial<SubTask>): Promise<void> {
    const data = this.getStorage()
    const index = data.subTasks[year]?.findIndex((t) => t.rowKey === id)
    if (index !== undefined && index >= 0) {
      data.subTasks[year][index] = { ...data.subTasks[year][index], ...updates }
      this.saveStorage(data)
    }
  }

  async deleteSubTask(year: string, id: string): Promise<void> {
    const data = this.getStorage()
    data.subTasks[year] = data.subTasks[year]?.filter((t) => t.rowKey !== id) || []
    this.saveStorage(data)
  }

  // Strategy Pillars
  async getStrategyPillars(year: string): Promise<StrategyPillar[]> {
    const data = this.getStorage()
    return data.strategyPillars[year] || []
  }

  async saveStrategyPillar(year: string, pillar: StrategyPillar): Promise<void> {
    const data = this.getStorage()
    if (!data.strategyPillars[year]) {
      data.strategyPillars[year] = []
    }
    const existing = data.strategyPillars[year].findIndex((p) => p.rowKey === pillar.rowKey)
    if (existing >= 0) {
      data.strategyPillars[year][existing] = pillar
    } else {
      data.strategyPillars[year].push(pillar)
    }
    this.saveStorage(data)
  }

  async updateStrategyPillar(year: string, id: string, updates: Partial<StrategyPillar>): Promise<void> {
    const data = this.getStorage()
    const index = data.strategyPillars[year]?.findIndex((p) => p.rowKey === id)
    if (index !== undefined && index >= 0) {
      data.strategyPillars[year][index] = { ...data.strategyPillars[year][index], ...updates }
      this.saveStorage(data)
    }
  }

  async deleteStrategyPillar(year: string, id: string): Promise<void> {
    const data = this.getStorage()
    data.strategyPillars[year] = data.strategyPillars[year]?.filter((p) => p.rowKey !== id) || []
    this.saveStorage(data)
  }

  // Users & Roles
  async getUserRole(email: string): Promise<string> {
    const data = this.getStorage()
    const user = data.users.find((u) => u.email === email)
    return user?.role || 'employee'
  }

  async getAllUsers(): Promise<User[]> {
    const data = this.getStorage()
    return data.users
  }

  async setUserRole(email: string, role: string): Promise<void> {
    const data = this.getStorage()
    const userIndex = data.users.findIndex((u) => u.email === email)
    if (userIndex >= 0) {
      data.users[userIndex] = { ...data.users[userIndex], role: role as any }
      this.saveStorage(data)
    }
  }
}

export const azureStorageService = new AzureStorageService()
