import { describe, it, expect } from 'vitest'
import { calculateStatistics } from '@/lib/data'
import type { Engineer, Task } from '@/lib/types'

describe('Enhanced Data Module Tests', () => {
  describe('calculateStatistics edge cases', () => {
    it('should handle tasks with actual time', () => {
      const engineers: Engineer[] = [
        { id: 'eng1', name: 'Alice' }
      ]

      const tasks: Task[] = [
        {
          id: 'task1',
          title: 'Completed Task',
          description: 'Test',
          estimatedTime: 100,
          actualTime: 120,
          status: 'completed',
          assigneeId: 'eng1',
          assigneeName: 'Alice'
        }
      ]

      const stats = calculateStatistics(engineers, tasks)

      expect(stats.totalActualMinutes).toBe(120)
      expect(stats.completedActualMinutes).toBe(120)
    })

    it('should handle tasks without actual time', () => {
      const engineers: Engineer[] = [
        { id: 'eng1', name: 'Alice' }
      ]

      const tasks: Task[] = [
        {
          id: 'task1',
          title: 'Assigned Task',
          description: 'Test',
          estimatedTime: 100,
          status: 'assigned',
          assigneeId: 'eng1',
          assigneeName: 'Alice'
        }
      ]

      const stats = calculateStatistics(engineers, tasks)

      expect(stats.totalActualMinutes).toBe(0)
      expect(stats.completedActualMinutes).toBe(0)
    })

    it('should handle mixed task statuses', () => {
      const engineers: Engineer[] = [
        { id: 'eng1', name: 'Alice' },
        { id: 'eng2', name: 'Bob' }
      ]

      const tasks: Task[] = [
        {
          id: 'task1',
          title: 'Unassigned Task',
          description: 'Test',
          estimatedTime: 50,
          status: 'unassigned'
        },
        {
          id: 'task2',
          title: 'Assigned Task',
          description: 'Test',
          estimatedTime: 100,
          status: 'assigned',
          assigneeId: 'eng1',
          assigneeName: 'Alice'
        },
        {
          id: 'task3',
          title: 'Completed Task',
          description: 'Test',
          estimatedTime: 75,
          actualTime: 80,
          status: 'completed',
          assigneeId: 'eng2',
          assigneeName: 'Bob'
        }
      ]

      const stats = calculateStatistics(engineers, tasks)

      expect(stats.totalTasks).toBe(3)
      expect(stats.completedTasks).toBe(1)
      expect(stats.unassignedTasks).toBe(1)
      expect(stats.totalEstimatedMinutes).toBe(225)
      expect(stats.totalActualMinutes).toBe(80)
      expect(stats.unassignedEstimatedMinutes).toBe(50)
      expect(stats.completedActualMinutes).toBe(80)
      expect(stats.engineerWorkloads['eng1'].minutes).toBe(100)
      expect(stats.engineerWorkloads['eng2'].minutes).toBe(0)
    })

    it('should handle engineers with no assigned tasks', () => {
      const engineers: Engineer[] = [
        { id: 'eng1', name: 'Alice' },
        { id: 'eng2', name: 'Bob' }
      ]

      const tasks: Task[] = [
        {
          id: 'task1',
          title: 'Unassigned Task',
          description: 'Test',
          estimatedTime: 50,
          status: 'unassigned'
        }
      ]

      const stats = calculateStatistics(engineers, tasks)

      expect(stats.engineerWorkloads['eng1'].minutes).toBe(0)
      expect(stats.engineerWorkloads['eng2'].minutes).toBe(0)
    })

    it('should handle tasks with zero estimated time', () => {
      const engineers: Engineer[] = [
        { id: 'eng1', name: 'Alice' }
      ]

      const tasks: Task[] = [
        {
          id: 'task1',
          title: 'Zero Time Task',
          description: 'Test',
          estimatedTime: 0,
          status: 'unassigned'
        }
      ]

      const stats = calculateStatistics(engineers, tasks)

      expect(stats.totalEstimatedMinutes).toBe(0)
      expect(stats.unassignedEstimatedMinutes).toBe(0)
    })

    it('should handle tasks with zero actual time', () => {
      const engineers: Engineer[] = [
        { id: 'eng1', name: 'Alice' }
      ]

      const tasks: Task[] = [
        {
          id: 'task1',
          title: 'Zero Actual Time Task',
          description: 'Test',
          estimatedTime: 100,
          actualTime: 0,
          status: 'completed',
          assigneeId: 'eng1',
          assigneeName: 'Alice'
        }
      ]

      const stats = calculateStatistics(engineers, tasks)

      expect(stats.totalActualMinutes).toBe(0)
      expect(stats.completedActualMinutes).toBe(0)
    })

    it('should handle multiple completed tasks with actual time', () => {
      const engineers: Engineer[] = [
        { id: 'eng1', name: 'Alice' }
      ]

      const tasks: Task[] = [
        {
          id: 'task1',
          title: 'Completed Task 1',
          description: 'Test',
          estimatedTime: 100,
          actualTime: 120,
          status: 'completed',
          assigneeId: 'eng1',
          assigneeName: 'Alice'
        },
        {
          id: 'task2',
          title: 'Completed Task 2',
          description: 'Test',
          estimatedTime: 80,
          actualTime: 90,
          status: 'completed',
          assigneeId: 'eng1',
          assigneeName: 'Alice'
        }
      ]

      const stats = calculateStatistics(engineers, tasks)

      expect(stats.totalActualMinutes).toBe(210)
      expect(stats.completedActualMinutes).toBe(210)
      expect(stats.completedTasks).toBe(2)
    })

    it('should handle tasks with undefined actual time', () => {
      const engineers: Engineer[] = [
        { id: 'eng1', name: 'Alice' }
      ]

      const tasks: Task[] = [
        {
          id: 'task1',
          title: 'No Actual Time Task',
          description: 'Test',
          estimatedTime: 100,
          status: 'completed',
          assigneeId: 'eng1',
          assigneeName: 'Alice'
        }
      ]

      const stats = calculateStatistics(engineers, tasks)

      expect(stats.totalActualMinutes).toBe(0)
      expect(stats.completedActualMinutes).toBe(0)
    })
  })
})
