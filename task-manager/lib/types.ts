export interface Engineer {
  id: string
  name: string
  email: string
  department: string
}

export interface Task {
  id: string
  title: string
  description: string
  estimatedTime: number
  actualTime?: number
  status: 'unassigned' | 'assigned' | 'completed'
  assigneeId?: string
  assigneeName?: string
}

export interface Statistics {
  totalTasks: number
  completedTasks: number
  unassignedTasks: number
  totalEstimatedMinutes: number
  totalActualMinutes: number
  unassignedEstimatedMinutes: number
  engineerWorkloads: { [engineerId: string]: { name: string; minutes: number } }
  completedActualMinutes: number
}
