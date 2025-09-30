import { describe, it, expect } from 'vitest'
import { sampleEngineers, sampleTasks, calculateStatistics } from '@/lib/data'
import type { Engineer, Task } from '@/lib/types'

describe('Data Module', () => {
  describe('sampleEngineers', () => {
    it('should contain valid engineer data', () => {
      expect(sampleEngineers.length).toBeGreaterThanOrEqual(4)
      
      sampleEngineers.forEach(engineer => {
        expect(engineer).toHaveProperty('id')
        expect(engineer).toHaveProperty('name')
        expect(typeof engineer.id).toBe('string')
        expect(typeof engineer.name).toBe('string')
      })
    })

    it('should have unique engineer IDs', () => {
      const ids = sampleEngineers.map(eng => eng.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })
  })

  describe('sampleTasks', () => {
    it('should contain valid task data', () => {
      expect(sampleTasks.length).toBeGreaterThan(0)
      
      sampleTasks.forEach(task => {
        expect(task).toHaveProperty('id')
        expect(task).toHaveProperty('title')
        expect(task).toHaveProperty('description')
        expect(task).toHaveProperty('estimatedTime')
        expect(task).toHaveProperty('status')
        expect(typeof task.id).toBe('string')
        expect(typeof task.title).toBe('string')
        expect(typeof task.description).toBe('string')
        expect(typeof task.estimatedTime).toBe('number')
        expect(['unassigned', 'assigned', 'completed']).toContain(task.status)
      })
    })

    it('should have unique task IDs', () => {
      const ids = sampleTasks.map(task => task.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should have valid status values', () => {
      const validStatuses = ['unassigned', 'assigned', 'completed']
      sampleTasks.forEach(task => {
        expect(validStatuses).toContain(task.status)
      })
    })
  })

  describe('calculateStatistics', () => {
    const mockEngineers: Engineer[] = [
      { id: 'eng1', name: 'Alice' },
      { id: 'eng2', name: 'Bob' }
    ]

    const mockTasks: Task[] = [
      {
        id: 'task1',
        title: 'Task 1',
        description: 'Description 1',
        estimatedTime: 100,
        actualTime: 90,
        status: 'completed',
        assigneeId: 'eng1',
        assigneeName: 'Alice'
      },
      {
        id: 'task2',
        title: 'Task 2',
        description: 'Description 2',
        estimatedTime: 200,
        status: 'assigned',
        assigneeId: 'eng1',
        assigneeName: 'Alice'
      },
      {
        id: 'task3',
        title: 'Task 3',
        description: 'Description 3',
        estimatedTime: 150,
        status: 'unassigned'
      }
    ]

    it('should calculate correct basic statistics', () => {
      const stats = calculateStatistics(mockEngineers, mockTasks)
      
      expect(stats.totalTasks).toBe(3)
      expect(stats.completedTasks).toBe(1)
      expect(stats.unassignedTasks).toBe(1)
    })

    it('should calculate correct time statistics', () => {
      const stats = calculateStatistics(mockEngineers, mockTasks)
      
      expect(stats.totalEstimatedMinutes).toBe(450) // 100 + 200 + 150
      expect(stats.totalActualMinutes).toBe(90) // only task1 has actualTime
      expect(stats.unassignedEstimatedMinutes).toBe(150) // only task3 is unassigned
      expect(stats.completedActualMinutes).toBe(90) // only task1 is completed
    })

    it('should calculate engineer workloads correctly', () => {
      const stats = calculateStatistics(mockEngineers, mockTasks)
      
      expect(stats.engineerWorkloads['eng1'].minutes).toBe(200) // only assigned, non-completed tasks
      expect(stats.engineerWorkloads['eng1'].name).toBe('Alice')
      expect(stats.engineerWorkloads['eng2'].minutes).toBe(0) // no assigned tasks
      expect(stats.engineerWorkloads['eng2'].name).toBe('Bob')
    })

    it('should handle empty arrays', () => {
      const stats = calculateStatistics([], [])
      
      expect(stats.totalTasks).toBe(0)
      expect(stats.completedTasks).toBe(0)
      expect(stats.unassignedTasks).toBe(0)
      expect(stats.totalEstimatedMinutes).toBe(0)
      expect(stats.totalActualMinutes).toBe(0)
      expect(stats.unassignedEstimatedMinutes).toBe(0)
      expect(stats.completedActualMinutes).toBe(0)
      expect(Object.keys(stats.engineerWorkloads)).toHaveLength(0)
    })
  })
})
