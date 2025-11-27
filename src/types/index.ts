export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'head_of_department' | 'team_chef' | 'viewer';
  department?: string;
  avatarUrl?: string;
}

export interface StrategyPillar {
  partitionKey: string; // Year
  rowKey: string; // Unique ID
  title: string;
  description: string;
  year: number;
  winsCount: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface MustWin {
  partitionKey: string; // Strategy Pillar ID
  rowKey: string; // Unique ID
  title: string;
  description: string;
  year: number;
  strategyPillarId: string;
  assignedTo: string; // User ID
  deadline: Date;
  progress: number;
  status: 'on-track' | 'in-progress' | 'needs-attention';
  activitiesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface KPI {
  name: string;
  range: string;
}

export interface KeyActivity {
  partitionKey: string; // Must-Win ID
  rowKey: string; // Unique ID
  title: string;
  description: string;
  mustWinId: string;
  assignedTo: string; // User ID
  deadline: Date;
  subTasksTotal: number;
  subTasksCompleted: number;
  baselineKPIs: KPI[];
  targetKPIs: KPI[];
  stretchKPIs: KPI[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SubTask {
  partitionKey: string; // Key Activity ID
  rowKey: string; // Unique ID
  title: string;
  description: string;
  keyActivityId: string;
  assignedTo: string; // User ID (Team Chef)
  deadline: Date;
  progress: number;
  status: 'on-track' | 'in-progress' | 'needs-attention';
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  strategyPillarsCount: number;
  mustWinsCount: number;
  keyActivitiesCount: number;
  overallProgress: number;
  progressLevels: {
    onTrack: number;
    inProgress: number;
    needsAttention: number;
  };
}
