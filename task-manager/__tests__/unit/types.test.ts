import { describe, it, expect } from 'vitest'
import type { Engineer, Task, Statistics } from '@/lib/types'

describe('Type Definitions', () => {
  describe('Engineer interface', () => {
    it('should have required properties', () => {
      const engineer: Engineer = {
        id: 'eng1',
        name: 'Alice Johnson'
      }

      expect(engineer.id).toBe('eng1')
      expect(engineer.name).toBe('Alice Johnson')
    })
  })

  describe('Task interface', () => {
    it('should have required properties', () => {
      const task: Task = {
        id: 'task1',
        title: 'Test Task',
        description: 'A test task description',
        estimatedTime: 120,
        status: 'unassigned'
      }

      expect(task.id).toBe('task1')
      expect(task.title).toBe('Test Task')
      expect(task.description).toBe('A test task description')
      expect(task.estimatedTime).toBe(120)
      expect(task.status).toBe('unassigned')
    })

    it('should support optional properties', () => {
      const task: Task = {
        id: 'task2',
        title: 'Assigned Task',
        description: 'A task with assignee',
        estimatedTime: 90,
        actualTime: 95,
        status: 'completed',
        assigneeId: 'eng1',
        assigneeName: 'Alice Johnson'
      }

      expect(task.actualTime).toBe(95)
      expect(task.assigneeId).toBe('eng1')
      expect(task.assigneeName).toBe('Alice Johnson')
    })
  })

  describe('Statistics interface', () => {
    it('should have all required properties', () => {
      const stats: Statistics = {
        totalTasks: 10,
        completedTasks: 5,
        unassignedTasks: 2,
        totalEstimatedMinutes: 1000,
        totalActualMinutes: 800,
        unassignedEstimatedMinutes: 200,
        engineerWorkloads: {
          'eng1': { name: 'Alice', minutes: 300 },
          'eng2': { name: 'Bob', minutes: 200 }
        },
        completedActualMinutes: 600
      }

      expect(stats.totalTasks).toBe(10)
      expect(stats.completedTasks).toBe(5)
      expect(stats.unassignedTasks).toBe(2)
      expect(stats.totalEstimatedMinutes).toBe(1000)
      expect(stats.totalActualMinutes).toBe(800)
      expect(stats.unassignedEstimatedMinutes).toBe(200)
      expect(stats.engineerWorkloads).toHaveProperty('eng1')
      expect(stats.completedActualMinutes).toBe(600)
    })
  })
})
