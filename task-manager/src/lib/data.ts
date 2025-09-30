import { Engineer, Task, Statistics } from './types'
import data from './data.json'

export const sampleEngineers: Engineer[] = data.engineers as Engineer[]
export const sampleTasks: Task[] = data.tasks as Task[]

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
