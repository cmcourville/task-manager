import { Engineer, Task, Statistics } from './types'

export const sampleEngineers: Engineer[] = [
  {
    id: 'eng1',
    name: 'Alice Johnson',
    email: 'alice.johnson@company.com',
    department: 'Backend Development'
  },
  {
    id: 'eng2',
    name: 'Bob Smith',
    email: 'bob.smith@company.com',
    department: 'Frontend Development'
  },
  {
    id: 'eng3',
    name: 'Carol Davis',
    email: 'carol.davis@company.com',
    department: 'DevOps'
  },
  {
    id: 'eng4',
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    department: 'Quality Assurance'
  }
]

export const sampleTasks: Task[] = [
  {
    id: 'task1',
    title: 'Implement User Authentication',
    description: 'Create secure user login and registration system',
    estimatedTime: 120,
    status: 'assigned',
    assigneeId: 'eng1',
    assigneeName: 'Alice Johnson'
  },
  {
    id: 'task2',
    title: 'Database Schema Design',
    description: 'Design and implement database structure',
    estimatedTime: 90,
    status: 'assigned',
    assigneeId: 'eng1',
    assigneeName: 'Alice Johnson'
  },
  {
    id: 'task3',
    title: 'API Documentation',
    description: 'Create comprehensive API documentation',
    estimatedTime: 60,
    actualTime: 60,
    status: 'completed',
    assigneeId: 'eng1',
    assigneeName: 'Alice Johnson'
  },
  {
    id: 'task4',
    title: 'Frontend UI Components',
    description: 'Build reusable React components',
    estimatedTime: 150,
    status: 'assigned',
    assigneeId: 'eng2',
    assigneeName: 'Bob Smith'
  },
  {
    id: 'task5',
    title: 'Testing Suite Setup',
    description: 'Configure automated testing framework',
    estimatedTime: 75,
    actualTime: 75,
    status: 'completed',
    assigneeId: 'eng2',
    assigneeName: 'Bob Smith'
  },
  {
    id: 'task6',
    title: 'Performance Optimization',
    description: 'Optimize application performance and speed',
    estimatedTime: 200,
    status: 'assigned',
    assigneeId: 'eng3',
    assigneeName: 'Carol Davis'
  },
  {
    id: 'task7',
    title: 'Code Review Process',
    description: 'Establish code review guidelines and process',
    estimatedTime: 45,
    status: 'unassigned'
  },
  {
    id: 'task8',
    title: 'Deployment Pipeline',
    description: 'Set up CI/CD deployment pipeline',
    estimatedTime: 180,
    status: 'unassigned'
  },
  {
    id: 'task9',
    title: 'Test Coverage Analysis',
    description: 'Analyze and improve test coverage',
    estimatedTime: 90,
    status: 'unassigned'
  }
]

export const calculateStatistics = (engineers: Engineer[], tasks: Task[]): Statistics => {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.status === 'completed').length
  const unassignedTasks = tasks.filter(task => task.status === 'unassigned').length
  
  const totalEstimatedMinutes = tasks.reduce((sum, task) => sum + task.estimatedTime, 0)
  const totalActualMinutes = tasks.reduce((sum, task) => sum + (task.actualTime || 0), 0)
  
  const unassignedEstimatedMinutes = tasks
    .filter(task => task.status === 'unassigned')
    .reduce((sum, task) => sum + task.estimatedTime, 0)
  
  const engineerWorkloads: { [engineerId: string]: { name: string; minutes: number } } = {}
  
  engineers.forEach(engineer => {
    const assignedTasks = tasks.filter(task => 
      task.assigneeId === engineer.id && task.status !== 'completed'
    )
    const minutes = assignedTasks.reduce((sum, task) => sum + task.estimatedTime, 0)
    engineerWorkloads[engineer.id] = {
      name: engineer.name,
      minutes
    }
  })
  
  const completedActualMinutes = tasks
    .filter(task => task.status === 'completed')
    .reduce((sum, task) => sum + (task.actualTime || 0), 0)
  
  return {
    totalTasks,
    completedTasks,
    unassignedTasks,
    totalEstimatedMinutes,
    totalActualMinutes,
    unassignedEstimatedMinutes,
    engineerWorkloads,
    completedActualMinutes
  }
}
